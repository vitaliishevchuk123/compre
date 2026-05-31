import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  ActivityIndicator,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Speech from 'expo-speech';
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

export default function LessonScreen({ navigation }: LessonProps) {
  const [wordIds, setWordIds] = useState<Map<string, number> | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isReplaying, setIsReplaying] = useState(false);
  const { voiceId } = useVoice();

  useEffect(() => {
    getWordsByLevel('A1').then((words) => {
      setWordIds(new Map(words.map((w) => [w.word, w.id])));
    });
  }, []);

  const card: LessonCard = A1_CARDS[index];
  const options = useMemo(() => shuffle(card.options), [card]);
  const prompt = card.kind === 'sentence' ? 'Which sentence?' : (card.sentence ?? 'What is this?');

  function speak(text: string, extra?: Speech.SpeechOptions) {
    const opts: Speech.SpeechOptions = { language: 'en-US', rate: 0.85, ...extra };
    if (voiceId) opts.voice = voiceId;
    Speech.speak(text, opts);
  }

  useEffect(() => {
    speak(prompt);
    return () => { Speech.stop(); };
  }, [index, voiceId]);

  // Keep refs so PanResponder (created once) can read latest state.
  const answeredRef = useRef(false);
  const nextRef = useRef<() => void>(() => {});
  answeredRef.current = selected !== null;

  const swipe = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) =>
      Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy),
    onPanResponderRelease: (_, g) => {
      if (g.dx < -50 && answeredRef.current) nextRef.current();
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
    if (index + 1 >= A1_CARDS.length) {
      await completeLesson(correctCount);
      navigation.goBack();
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setIsReplaying(false);
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

  const isLast = index + 1 >= A1_CARDS.length;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']} {...swipe.panHandlers}>
      <Text style={styles.progress}>
        {index + 1} / {A1_CARDS.length}
      </Text>

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
            sentence={card.kind === 'sentence'}
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
            <Text style={styles.replayText}>🔊 answer</Text>
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
    paddingTop: 4,
    paddingBottom: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.bg,
  },
  progress: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
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
    height: 190,
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
    paddingVertical: 15,
    alignItems: 'center',
  },
  replayBtnPressed: { opacity: 0.7 },
  replayText: { color: theme.textPrimary, fontSize: 18, fontWeight: '700' },
  next: {
    flex: 1,
    backgroundColor: theme.accent,
    borderRadius: theme.radius,
    paddingVertical: 15,
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
});
