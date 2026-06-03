import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  ActivityIndicator,
  Image,
  Keyboard,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVoice } from '../context/VoiceContext';
import { A1_CARDS } from '../data/seed/a1';
import { getImage } from '../data/imageRegistry';
import { getWordsByLevel, recordAnswer } from '../db/words';
import { completeLesson } from '../db/statistics';
import { theme } from '../theme';
import type { LessonProps } from '../navigation';
import type { LessonCard } from '../types';

/** Fisher–Yates shuffle (returns a new array). */
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function LessonScreen({ navigation, route }: LessonProps) {
  const category = route.params?.category;
  const mode = route.params?.mode ?? 'test';
  const autoAdvance = route.params?.autoAdvance ?? false;
  const repeatCount = route.params?.repeatCount ?? 1;
  const pauseSeconds = route.params?.pauseSeconds ?? 0;
  const CARDS = category
    ? A1_CARDS.filter((c) => c.category === category)
    : A1_CARDS;

  const storageKey = `@lesson_index${category ? `_${category}` : ''}`;

  const [wordIds, setWordIds] = useState<Map<string, number> | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isReplaying, setIsReplaying] = useState(false);
  const [currentRepeat, setCurrentRepeat] = useState(0);
  const [jumpOpen, setJumpOpen] = useState(false);
  const [jumpValue, setJumpValue] = useState(1);
  const { voiceId } = useVoice();

  // Incremented each time we want to cancel an in-progress speak sequence.
  const speakSessionRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);
  const [paused, setPausedState] = useState(false);

  useEffect(() => {
    Promise.all([
      getWordsByLevel('A1'),
      AsyncStorage.getItem(storageKey),
    ]).then(([words, savedIndex]) => {
      setWordIds(new Map(words.map((w) => [w.word, w.id])));
      if (savedIndex !== null) {
        const i = parseInt(savedIndex, 10);
        if (i > 0 && i < CARDS.length) setIndex(i);
      }
    });
  }, []);

  const card: LessonCard = CARDS[index];
  const options = useMemo(() => shuffle(card.options), [card]);
  const prompt = card.sentence ?? 'What is this?';

  function speak(text: string, extra?: Speech.SpeechOptions) {
    const opts: Speech.SpeechOptions = { language: 'en-US', rate: 0.85, ...extra };
    if (voiceId) opts.voice = voiceId;
    Speech.speak(text, opts);
  }

  function startLearnSession() {
    if (timerRef.current) clearTimeout(timerRef.current);
    const session = ++speakSessionRef.current;
    setCurrentRepeat(0);

    function doRepeat(n: number) {
      if (speakSessionRef.current !== session) return;
      setCurrentRepeat(n);
      speak(card.answer, {
        onDone: () => {
          if (speakSessionRef.current !== session) return;
          speak(card.answerPhrase ?? card.answer, {
            onDone: () => {
              if (speakSessionRef.current !== session) return;
              if (n + 1 < repeatCount) {
                timerRef.current = setTimeout(() => doRepeat(n + 1), 800);
              } else if (autoAdvance && !pausedRef.current) {
                timerRef.current = setTimeout(() => nextRef.current(), pauseSeconds * 1000);
              }
            },
          });
        },
      });
    }

    doRepeat(0);
  }

  function togglePause() {
    if (pausedRef.current) {
      pausedRef.current = false;
      setPausedState(false);
      startLearnSession();
    } else {
      speakSessionRef.current++;
      Speech.stop();
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
      pausedRef.current = true;
      setPausedState(true);
    }
  }

  useEffect(() => {
    if (mode !== 'learn') {
      speak(prompt);
      return () => { Speech.stop(); };
    }
    startLearnSession();
    return () => {
      speakSessionRef.current++;
      Speech.stop();
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    };
  }, [index, voiceId]);

  // Keep refs so PanResponder (created once) can read latest state.
  const answeredRef = useRef(false);
  const nextRef = useRef<() => void>(() => {});
  answeredRef.current = selected !== null;

  const swipe = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) =>
      Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy),
    onPanResponderRelease: (_, g) => {
      if (g.dx < -50 && (mode === 'learn' || answeredRef.current)) nextRef.current();
    },
  }), []);

  if (!wordIds) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={theme.accent} />
      </SafeAreaView>
    );
  }

  const answered = selected !== null;

  async function next() {
    if (index + 1 >= CARDS.length) {
      await completeLesson(mode === 'test' ? correctCount : 0);
      await AsyncStorage.removeItem(storageKey);
      navigation.goBack();
      return;
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    setSelected(null);
    setIsReplaying(false);
    AsyncStorage.setItem(storageKey, String(nextIndex));
  }
  nextRef.current = next;

  function choose(option: string) {
    if (answered) return;
    setSelected(option);
    const correct = option === card.answer;
    if (correct) setCorrectCount((c) => c + 1);
    const id = wordIds!.get(card.answer);
    if (id != null) void recordAnswer(id, correct);
    Speech.stop();
    speak(card.answerPhrase ?? card.answer);
  }

  const isLast = index + 1 >= CARDS.length;

  function back() {
    const prevIndex = index === 0 ? CARDS.length - 1 : index - 1;
    Speech.stop();
    setIndex(prevIndex);
    setSelected(null);
    setIsReplaying(false);
    AsyncStorage.setItem(storageKey, String(prevIndex));
  }

  function openJump() {
    setJumpValue(index + 1);
    setJumpOpen(true);
  }

  function jumpToSlide() {
    const i = Math.max(0, Math.min(CARDS.length - 1, jumpValue - 1));
    Keyboard.dismiss();
    Speech.stop();
    setIndex(i);
    setSelected(null);
    setIsReplaying(false);
    AsyncStorage.setItem(storageKey, String(i));
    setJumpOpen(false);
  }

  const jumpModal = (
    <Modal
      visible={jumpOpen}
      transparent
      animationType="slide"
      onRequestClose={() => setJumpOpen(false)}
    >
      <Pressable style={styles.jumpBackdrop} onPress={() => { Keyboard.dismiss(); setJumpOpen(false); }} />
      <View style={styles.jumpSheet}>
        <Text style={styles.jumpTitle}>Jump to slide</Text>
        <View style={styles.jumpInputRow}>
          <TextInput
            style={styles.jumpInput}
            keyboardType="number-pad"
            value={String(jumpValue)}
            onChangeText={(t) => {
              const n = parseInt(t, 10);
              if (!isNaN(n)) setJumpValue(Math.max(1, Math.min(CARDS.length, n)));
              else if (t === '') setJumpValue(1);
            }}
            selectTextOnFocus
          />
          <Text style={styles.jumpOf}>/ {CARDS.length}</Text>
        </View>
        <LessonSlider value={jumpValue} total={CARDS.length} onChange={setJumpValue} />
        <Pressable
          style={({ pressed }) => [styles.jumpGoBtn, pressed && { opacity: 0.8 }]}
          onPress={jumpToSlide}
        >
          <Text style={styles.jumpGoText}>Go</Text>
        </Pressable>
      </View>
    </Modal>
  );

  if (mode === 'learn') {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']} {...swipe.panHandlers}>
        <View style={styles.progressRow}>
          <Pressable
            onPress={back}
            style={({ pressed }) => [styles.prevBtn, pressed && styles.prevBtnPressed]}
          >
            <Text style={styles.prevBtnText}>Prev</Text>
          </Pressable>
          <ProgressPill index={index} total={CARDS.length} onPress={openJump} />
        </View>

        <View style={styles.card}>
          <View style={styles.imageFrame}>
            <Image
              source={getImage(card.imageKey)}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <View style={styles.promptRow}>
            <Text style={styles.learnWord}>{card.answer}</Text>
            <Pressable
              style={({ pressed }) => [styles.speakBtn, pressed && styles.speakBtnPressed]}
              onPress={startLearnSession}
              hitSlop={10}
            >
              <Text style={styles.speakIcon}>🔊</Text>
            </Pressable>
          </View>
          {card.answerPhrase && (
            <Text style={styles.learnPhrase}>{card.answerPhrase}</Text>
          )}
          {repeatCount > 1 && (
            <View style={styles.dotsRow}>
              {Array.from({ length: repeatCount }).map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i <= currentRepeat && styles.dotFilled]}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.bottomRow}>
          {autoAdvance && (
            <Pressable
              style={({ pressed }) => [styles.pauseBtn, pressed && styles.pauseBtnPressed]}
              onPress={togglePause}
            >
              <Text style={styles.pauseIcon}>{paused ? '▶' : '⏸'}</Text>
            </Pressable>
          )}
          <Pressable
            style={({ pressed }) => [styles.next, { flex: 1 }, pressed && styles.nextPressed]}
            onPress={next}
          >
            <Text style={styles.nextText}>{isLast ? 'Finish' : 'Next'}</Text>
          </Pressable>
        </View>
        {jumpModal}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']} {...swipe.panHandlers}>
      <View style={styles.progressRow}>
        <Pressable
          onPress={back}
          style={({ pressed }) => [
            styles.prevBtn,
            pressed && styles.prevBtnPressed,
          ]}
        >
          <Text style={styles.prevBtnText}>Prev</Text>
        </Pressable>
        <ProgressPill index={index} total={CARDS.length} onPress={openJump} />
      </View>

      {/* White lesson card: centered image + prompt */}
      <View style={styles.card}>
        <View style={styles.imageFrame}>
          <Image
            source={getImage(card.imageKey)}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.promptRow}>
          <Text style={styles.prompt}>{prompt}</Text>
          <Pressable
            style={({ pressed }) => [styles.speakBtn, pressed && styles.speakBtnPressed]}
            onPress={() => speak(prompt)}
            hitSlop={10}
          >
            <Text style={styles.speakIcon}>🔊</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.options}>
        {options.map((option) => (
          <Option
            key={option}
            label={option}
            sentence={false}
            state={optionState(option, card.answer, selected)}
            pulse={isReplaying && option === card.answer}
            onPress={() => choose(option)}
          />
        ))}
      </View>

      <View style={styles.bottomRow}>
        {answered ? (
          <Pressable
            style={({ pressed }) => [styles.replayBtn, pressed && styles.replayBtnPressed]}
            onPress={() => {
              setIsReplaying(true);
              Speech.stop();
              speak(card.answerPhrase ?? card.answer, {
                onDone: () => setIsReplaying(false),
                onStopped: () => setIsReplaying(false),
              });
            }}
          >
            <Text style={styles.replayText}>Say answer 🔊</Text>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.replayBtn, pressed && styles.replayBtnPressed]}
            onPress={next}
          >
            <Text style={styles.replayText}>Skip</Text>
          </Pressable>
        )}
        <Pressable
          disabled={!answered}
          style={({ pressed }) => [
            styles.next,
            !answered && styles.nextDisabled,
            pressed && answered && styles.nextPressed,
          ]}
          onPress={next}
        >
          <Text style={styles.nextText}>{isLast ? 'Finish' : 'Next'}</Text>
        </Pressable>
      </View>
      {jumpModal}
    </SafeAreaView>
  );
}

function ProgressPill({ index, total, onPress }: { index: number; total: number; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={10} style={styles.progressPill}>
      <Text style={styles.progress}>{index + 1} / {total}</Text>
    </Pressable>
  );
}

type OptionVisual = 'idle' | 'correct' | 'wrong' | 'muted';

function optionState(
  option: string,
  answer: string,
  selected: string | null
): OptionVisual {
  if (selected === null) return 'idle';
  if (option === answer) return 'correct';
  if (option === selected) return 'wrong';
  return 'muted';
}

function Option({
  label,
  state,
  sentence,
  pulse,
  onPress,
}: {
  label: string;
  state: OptionVisual;
  sentence?: boolean;
  pulse?: boolean;
  onPress: () => void;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (pulse) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    } else {
      anim.stopAnimation();
      anim.setValue(0);
    }
  }, [pulse]);

  return (
    <Animated.View
      style={[
        styles.option,
        OPTION_STYLE[state],
        pulse && { opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.25] }) },
      ]}
    >
      <Pressable
        style={styles.optionInner}
        onPress={onPress}
        disabled={state !== 'idle'}
      >
        <Text
          style={[
            styles.optionText,
            sentence && styles.optionTextSentence,
            state === 'muted' && styles.optionTextMuted,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const OPTION_STYLE = StyleSheet.create({
  idle: { backgroundColor: theme.option },
  correct: { backgroundColor: theme.successBg, borderColor: theme.success, borderWidth: 2 },
  wrong: { backgroundColor: theme.dangerBg, borderColor: theme.danger, borderWidth: 2 },
  muted: { backgroundColor: theme.option, opacity: 0.45 },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.bg,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressPill: {
    backgroundColor: theme.card,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: theme.option,
  },
  progress: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  prevBtn: {
    backgroundColor: 'rgb(229, 145, 60)',
    borderRadius: theme.radius,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  prevBtnPressed: { opacity: 0.6 },
  prevBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  card: {
    backgroundColor: theme.card,
    borderRadius: theme.radius,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  // Square frame keeps the layout stable; `contain` centers any aspect ratio
  // without cropping, so internet-sourced images of any shape look intentional.
  imageFrame: {
    width: '100%',
    height: 400,
    borderRadius: theme.radiusSm,
    backgroundColor: theme.imageBg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 8,
  },
  prompt: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
    textAlign: 'center',
    flexShrink: 1,
  },
  pauseBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.option,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseBtnPressed: { opacity: 0.6 },
  pauseIcon: { fontSize: 20 },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.option,
    borderWidth: 1,
    borderColor: theme.textSecondary,
  },
  dotFilled: {
    backgroundColor: theme.accent,
    borderColor: theme.accent,
  },
  learnWord: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.textPrimary,
    textAlign: 'center',
    flexShrink: 1,
  },
  learnPhrase: {
    fontSize: 17,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
    fontStyle: 'italic',
  },
  speakBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.option,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakBtnPressed: { opacity: 0.6 },
  speakIcon: { fontSize: 18 },
  options: { gap: 8, marginTop: 14 },
  option: {
    borderRadius: theme.radiusSm,
    overflow: 'hidden',
  },
  optionInner: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.optionText,
    textAlign: 'center',
  },
  optionTextSentence: { fontSize: 17, fontWeight: '600' },
  optionTextMuted: { color: theme.textSecondary },
  bottomRow: {
    marginTop: 'auto',
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  replayBtn: {
    flex: 1,
    backgroundColor: theme.option,
    borderRadius: theme.radius,
    paddingVertical: 11,
    alignItems: 'center',
  },
  replayBtnPressed: { opacity: 0.7 },
  replayText: { color: theme.textPrimary, fontSize: 18, fontWeight: '700' },
  next: {
    flex: 1,
    backgroundColor: theme.accent,
    borderRadius: theme.radius,
    paddingVertical: 11,
    alignItems: 'center',
    shadowColor: theme.accent,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  nextDisabled: { backgroundColor: '#E4D6C6', shadowOpacity: 0 },
  nextPressed: { backgroundColor: theme.accentDark },
  nextText: { color: '#fff', fontSize: 18, fontWeight: '700' },

  jumpBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  jumpSheet: {
    backgroundColor: theme.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 20,
  },
  jumpTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.textPrimary,
    textAlign: 'center',
  },
  jumpInputRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 10,
  },
  jumpInput: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.accent,
    textAlign: 'center',
    minWidth: 70,
    borderBottomWidth: 2,
    borderBottomColor: theme.accent,
    paddingVertical: 4,
  },
  jumpOf: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.accent,
  },
  jumpGoBtn: {
    backgroundColor: theme.accent,
    borderRadius: theme.radius,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: theme.accent,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  jumpGoText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});

function LessonSlider({
  value,
  total,
  onChange,
}: {
  value: number;
  total: number;
  onChange: (v: number) => void;
}) {
  const [trackWidth, setTrackWidth] = useState(0);

  function xToValue(x: number) {
    if (trackWidth === 0) return value;
    const pct = Math.max(0, Math.min(1, x / trackWidth));
    return Math.max(1, Math.min(total, Math.round(pct * (total - 1)) + 1));
  }

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => onChange(xToValue(evt.nativeEvent.locationX)),
    onPanResponderMove: (evt) => onChange(xToValue(evt.nativeEvent.locationX)),
  }), [trackWidth, total]);

  const thumbPct = total > 1 ? (value - 1) / (total - 1) : 0;
  const THUMB_R = 14;

  return (
    <View
      style={sliderStyles.track}
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      {...panResponder.panHandlers}
    >
      <View style={[sliderStyles.fill, { width: `${thumbPct * 100}%` as any }]} />
      {trackWidth > 0 && (
        <View style={[sliderStyles.thumb, { left: trackWidth * thumbPct - THUMB_R }]} />
      )}
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  track: {
    height: 40,
    justifyContent: 'center',
    backgroundColor: theme.option,
    borderRadius: 20,
    overflow: 'visible',
  },
  fill: {
    height: '100%',
    backgroundColor: theme.accent,
    borderRadius: 20,
    opacity: 0.35,
  },
  thumb: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.accent,
    top: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
