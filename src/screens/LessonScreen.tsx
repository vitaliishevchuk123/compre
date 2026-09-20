import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  ActivityIndicator,
  Image,
  Keyboard,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVoice } from '../context/VoiceContext';
import { useLearnSettings } from '../context/LearnSettingsContext';
import ModeSwitch from '../components/ModeSwitch';
import { A1_CARDS } from '../data/seed/a1';
import { getImage } from '../data/imageRegistry';
import { getWordsByLevel, recordAnswer } from '../db/words';
import { completeLesson } from '../db/statistics';
import { theme } from '../theme';
import type { LessonProps } from '../navigation';
import type { LessonCard } from '../types';

/** Screens shorter than this (iPhone 8 / SE, or a phone browser with toolbars) get tighter spacing. */
const COMPACT_HEIGHT = 760;

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
  const { mode, setMode } = useLearnSettings();
  const compact = useWindowDimensions().height < COMPACT_HEIGHT;
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

  const speakSessionRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);
  const [paused, setPausedState] = useState(false);

  // Quick Learn/Test switch in the header (same setting as Settings → Mode).
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <ModeSwitch mode={mode} onChange={setMode} />,
    });
  }, [navigation, mode, setMode]);

  // Drop a half-answered card when the mode changes.
  useEffect(() => {
    setSelected(null);
    setIsReplaying(false);
  }, [mode]);

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

      // After word + phrase (+ description on the first pass): repeat or advance.
      const afterSpeech = () => {
        if (speakSessionRef.current !== session) return;
        if (n + 1 < repeatCount) {
          timerRef.current = setTimeout(() => doRepeat(n + 1), 800);
        } else if (autoAdvance && !pausedRef.current) {
          timerRef.current = setTimeout(() => nextRef.current(), pauseSeconds * 1000);
        }
      };

      speak(card.answer, {
        onDone: () => {
          if (speakSessionRef.current !== session) return;
          speak(card.answerPhrase ?? card.answer, {
            onDone: () => {
              if (speakSessionRef.current !== session) return;
              if (n === 0 && card.description) {
                speak(card.description, { onDone: afterSpeech });
              } else {
                afterSpeech();
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

  /** Test mode: read the question, then the description of the word. */
  function speakQuestion() {
    const session = ++speakSessionRef.current;
    Speech.stop();
    speak(prompt, {
      onDone: () => {
        if (speakSessionRef.current !== session || !card.description) return;
        speak(card.description);
      },
    });
  }

  useEffect(() => {
    if (mode !== 'learn') {
      speakQuestion();
      return () => { speakSessionRef.current++; Speech.stop(); };
    }
    startLearnSession();
    return () => {
      speakSessionRef.current++;
      Speech.stop();
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    };
  }, [index, voiceId, mode]);

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
  const progressPct = CARDS.length > 1 ? index / (CARDS.length - 1) : 1;

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
    speakSessionRef.current++;
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
        <Text style={styles.jumpTitle}>Jump to card</Text>
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
      <SafeAreaView style={[styles.container, compact && cs.container]} edges={['bottom']} {...swipe.panHandlers}>
        {/* Progress bar */}
        <View style={[styles.progressBarWrap, compact && cs.progressBarWrap]}>
          <View style={[styles.progressBarFill, { width: `${Math.round(progressPct * 100)}%` as any }]} />
        </View>

        <View style={[styles.progressRow, compact && cs.progressRow]}>
          <Pressable
            onPress={back}
            style={({ pressed }) => [styles.navBtn, compact && cs.navBtn, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="chevron-back" size={compact ? 18 : 20} color={theme.textPrimary} />
          </Pressable>
          <Pressable onPress={openJump} hitSlop={10}>
            <Text style={styles.progressText}>
              {index + 1} <Text style={styles.progressOf}>/ {CARDS.length}</Text>
            </Text>
          </Pressable>
        </View>

        <View style={[styles.card, compact && cs.card]}>
          <View style={[styles.imageFrame, styles.imageFrameLearn, compact && cs.imageFrame]}>
            <Image
              source={getImage(card.imageKey)}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <View style={[styles.promptRow, compact && cs.promptRow]}>
            <Text style={[styles.learnWord, compact && cs.learnWord]}>{card.answer}</Text>
            <Pressable
              style={({ pressed }) => [styles.speakBtn, compact && cs.speakBtn, pressed && { opacity: 0.6 }]}
              onPress={startLearnSession}
              hitSlop={10}
            >
              <Ionicons name="volume-high" size={18} color={theme.accent} />
            </Pressable>
          </View>
          {card.answerPhrase && (
            <Text style={[styles.learnPhrase, compact && cs.learnPhrase]}>{card.answerPhrase}</Text>
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

        {card.description && (
          <ScrollView style={styles.descriptionWrap} contentContainerStyle={styles.descriptionContent}>
            <Text style={[styles.description, compact && cs.description]}>{card.description}</Text>
          </ScrollView>
        )}

        <View style={[styles.bottomRow, compact && cs.bottomRow]}>
          {autoAdvance && (
            <Pressable
              style={({ pressed }) => [styles.pauseBtn, compact && cs.pauseBtn, pressed && { opacity: 0.6 }]}
              onPress={togglePause}
            >
              <Ionicons name={paused ? 'play' : 'pause'} size={20} color={theme.textPrimary} />
            </Pressable>
          )}
          <Pressable
            style={({ pressed }) => [styles.next, compact && cs.next, { flex: 1 }, pressed && styles.nextPressed]}
            onPress={next}
          >
            <Text style={[styles.nextText, compact && cs.nextText]}>{isLast ? 'Finish' : 'Next'}</Text>
          </Pressable>
        </View>
        {jumpModal}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, compact && cs.container]} edges={['bottom']} {...swipe.panHandlers}>
      {/* Progress bar */}
      <View style={[styles.progressBarWrap, compact && cs.progressBarWrap]}>
        <View style={[styles.progressBarFill, { width: `${Math.round(progressPct * 100)}%` as any }]} />
      </View>

      <View style={[styles.progressRow, compact && cs.progressRow]}>
        <Pressable
          onPress={back}
          style={({ pressed }) => [styles.navBtn, compact && cs.navBtn, pressed && { opacity: 0.6 }]}
        >
          <Ionicons name="chevron-back" size={compact ? 18 : 20} color={theme.textPrimary} />
        </Pressable>
        <Pressable onPress={openJump} hitSlop={10}>
          <Text style={styles.progressText}>
            {index + 1} <Text style={styles.progressOf}>/ {CARDS.length}</Text>
          </Text>
        </Pressable>
      </View>

      <View style={[styles.card, compact && cs.card]}>
        <View style={[styles.imageFrame, styles.imageFrameTest, compact && cs.imageFrame]}>
          <Image
            source={getImage(card.imageKey)}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={[styles.promptRow, compact && cs.promptRow]}>
          <Text style={[styles.prompt, compact && cs.prompt]}>{prompt}</Text>
          <Pressable
            style={({ pressed }) => [styles.speakBtn, compact && cs.speakBtn, pressed && { opacity: 0.6 }]}
            onPress={speakQuestion}
            hitSlop={10}
          >
            <Ionicons name="volume-high" size={18} color={theme.accent} />
          </Pressable>
        </View>
        {card.description && (
          <ScrollView
            style={styles.testDescriptionWrap}
            contentContainerStyle={styles.testDescriptionContent}
          >
            <Text style={[styles.testDescription, compact && cs.testDescription]}>
              {card.description}
            </Text>
          </ScrollView>
        )}
      </View>

      <View style={[styles.options, compact && cs.options]}>
        {options.map((option, i) => (
          <Option
            key={option}
            label={option}
            letter={String.fromCharCode(65 + i)}
            sentence={false}
            compact={compact}
            state={optionState(option, card.answer, selected)}
            pulse={isReplaying && option === card.answer}
            onPress={() => choose(option)}
          />
        ))}
      </View>

      <View style={[styles.bottomRow, compact && cs.bottomRow]}>
        {answered ? (
          <Pressable
            style={({ pressed }) => [styles.replayBtn, compact && cs.replayBtn, pressed && { opacity: 0.7 }]}
            onPress={() => {
              setIsReplaying(true);
              Speech.stop();
              speak(card.answerPhrase ?? card.answer, {
                onDone: () => setIsReplaying(false),
                onStopped: () => setIsReplaying(false),
              });
            }}
          >
            <Ionicons name="volume-high" size={16} color={theme.textPrimary} style={{ marginRight: 6 }} />
            <Text style={[styles.replayText, compact && cs.replayText]}>Say answer</Text>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.replayBtn, compact && cs.replayBtn, pressed && { opacity: 0.7 }]}
            onPress={next}
          >
            <Text style={[styles.replayText, compact && cs.replayText]}>Skip</Text>
          </Pressable>
        )}
        <Pressable
          disabled={!answered}
          style={({ pressed }) => [
            styles.next,
            compact && cs.next,
            !answered && styles.nextDisabled,
            pressed && answered && styles.nextPressed,
          ]}
          onPress={next}
        >
          <Text style={[styles.nextText, compact && cs.nextText]}>{isLast ? 'Finish' : 'Next'}</Text>
        </Pressable>
      </View>
      {jumpModal}
    </SafeAreaView>
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
  letter,
  state,
  sentence,
  pulse,
  compact,
  onPress,
}: {
  label: string;
  letter?: string;
  state: OptionVisual;
  sentence?: boolean;
  pulse?: boolean;
  compact?: boolean;
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

  const badgeLabel = state === 'correct' ? '✓' : state === 'wrong' ? '✗' : (letter ?? '');
  const badgeBg =
    state === 'correct' ? theme.success :
    state === 'wrong' ? theme.danger :
    'rgba(0,0,0,0.06)';
  const badgeTextColor = (state === 'correct' || state === 'wrong') ? '#fff' : theme.textSecondary;

  return (
    <Animated.View
      style={[
        styles.option,
        OPTION_STYLE[state],
        pulse && { opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.25] }) },
      ]}
    >
      <Pressable
        style={[styles.optionInner, compact && cs.optionInner]}
        onPress={onPress}
        disabled={state !== 'idle'}
      >
        {letter != null && (
          <View style={[styles.optionBadge, compact && cs.optionBadge, { backgroundColor: badgeBg }]}>
            <Text style={[styles.optionBadgeText, { color: badgeTextColor }]}>{badgeLabel}</Text>
          </View>
        )}
        <Text
          style={[
            styles.optionText,
            compact && cs.optionText,
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
  muted: { backgroundColor: theme.option, opacity: 0.4 },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.bg,
  },

  progressBarWrap: {
    height: 4,
    backgroundColor: theme.border,
    borderRadius: 2,
    marginHorizontal: -20,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.accent,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  progressText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  progressOf: {
    fontWeight: '400',
    color: theme.textSecondary,
    fontSize: 15,
  },

  card: {
    backgroundColor: theme.card,
    borderRadius: theme.radius,
    padding: 12,
    alignItems: 'center',
    flexShrink: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  imageFrame: {
    width: '100%',
    flexShrink: 1,
    minHeight: 120,
    borderRadius: theme.radiusSm,
    backgroundColor: theme.imageBg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageFrameLearn: { height: 340 },
  imageFrameTest: { height: 240 },
  image: { width: '100%', height: '100%' },

  promptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  prompt: {
    fontSize: 19,
    fontWeight: '700',
    color: theme.textPrimary,
    textAlign: 'center',
    flexShrink: 1,
  },
  learnWord: {
    fontSize: 30,
    fontWeight: '800',
    color: theme.textPrimary,
    textAlign: 'center',
    flexShrink: 1,
    letterSpacing: -0.5,
  },
  learnPhrase: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
    fontStyle: 'italic',
  },
  // minHeight forces the (shrinkable) card image to give up space on short screens.
  descriptionWrap: { flex: 1, minHeight: 84, marginTop: 10 },
  descriptionContent: { paddingHorizontal: 8, paddingBottom: 4 },
  description: {
    fontSize: 15,
    lineHeight: 21,
    color: theme.textPrimary,
    textAlign: 'center',
  },
  testDescriptionWrap: {
    width: '100%',
    // Never shrinks: the image gives up space first (see imageFrame minHeight);
    // only a description taller than maxHeight scrolls.
    flexGrow: 0,
    flexShrink: 0,
    maxHeight: 120,
    marginTop: 8,
  },
  testDescriptionContent: { paddingHorizontal: 4 },
  testDescription: {
    fontSize: 14,
    lineHeight: 19,
    color: theme.textSecondary,
    textAlign: 'center',
  },

  speakBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.option,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pauseBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },

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
    backgroundColor: theme.border,
    borderWidth: 1,
    borderColor: theme.textSecondary,
  },
  dotFilled: {
    backgroundColor: theme.accent,
    borderColor: theme.accent,
  },

  options: { gap: 6, marginTop: 10 },
  option: {
    borderRadius: theme.radiusSm,
    overflow: 'hidden',
  },
  optionInner: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  optionBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  optionText: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.optionText,
    flex: 1,
  },
  optionTextSentence: { fontSize: 16, fontWeight: '600' },
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
    backgroundColor: theme.card,
    borderRadius: theme.radius,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  replayText: { color: theme.textPrimary, fontSize: 16, fontWeight: '700' },
  next: {
    flex: 1,
    backgroundColor: theme.accent,
    borderRadius: theme.radius,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: theme.accent,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  nextDisabled: { backgroundColor: theme.border, shadowOpacity: 0 },
  nextPressed: { backgroundColor: theme.accentDark },
  nextText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  jumpBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
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
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  jumpGoText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});

/** Overrides for short screens (see COMPACT_HEIGHT). */
const cs = StyleSheet.create({
  container: { paddingTop: 4, paddingBottom: 8 },
  progressBarWrap: { marginBottom: 6 },
  progressRow: { marginBottom: 6 },
  navBtn: { width: 32, height: 32, borderRadius: 16 },
  card: { padding: 8 },
  imageFrame: { minHeight: 64 },
  promptRow: { marginTop: 8, gap: 6 },
  prompt: { fontSize: 17 },
  learnWord: { fontSize: 26 },
  learnPhrase: { fontSize: 15, marginTop: 4 },
  description: { fontSize: 14, lineHeight: 19 },
  testDescription: { fontSize: 13, lineHeight: 17 },
  speakBtn: { width: 30, height: 30, borderRadius: 15 },
  pauseBtn: { width: 40, height: 40, borderRadius: 20 },
  options: { gap: 5, marginTop: 8 },
  optionInner: { paddingVertical: 7, paddingHorizontal: 14, gap: 10 },
  optionBadge: { width: 22, height: 22, borderRadius: 11 },
  optionText: { fontSize: 16 },
  bottomRow: { paddingTop: 8, gap: 8 },
  replayBtn: { paddingVertical: 9 },
  replayText: { fontSize: 15 },
  next: { paddingVertical: 9 },
  nextText: { fontSize: 16 },
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
