import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  // Map the level's words to their db ids so answers can be persisted.
  useEffect(() => {
    getWordsByLevel('A1').then((words) => {
      setWordIds(new Map(words.map((w) => [w.word, w.id])));
    });
  }, []);

  const card: LessonCard = A1_CARDS[index];
  const options = useMemo(() => shuffle(card.options), [card]);

  if (!wordIds) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={theme.accent} />
      </SafeAreaView>
    );
  }

  const answered = selected !== null;

  function choose(option: string) {
    if (answered) return;
    setSelected(option);
    const correct = option === card.answer;
    if (correct) setCorrectCount((c) => c + 1);
    const id = wordIds!.get(card.answer);
    if (id != null) void recordAnswer(id, correct);
  }

  async function next() {
    if (index + 1 >= A1_CARDS.length) {
      await completeLesson(correctCount);
      navigation.goBack();
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  const isLast = index + 1 >= A1_CARDS.length;
  const isSentence = card.kind === 'sentence';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
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
        <Text style={styles.prompt}>
          {isSentence ? 'Which sentence?' : card.sentence ?? 'What is this?'}
        </Text>
      </View>

      <View style={styles.options}>
        {options.map((option) => (
          <Option
            key={option}
            label={option}
            sentence={isSentence}
            state={optionState(option, card.answer, selected)}
            onPress={() => choose(option)}
          />
        ))}
      </View>

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
  onPress,
}: {
  label: string;
  state: OptionVisual;
  sentence?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.option, OPTION_STYLE[state]]}
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
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
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
    marginBottom: 16,
  },
  card: {
    backgroundColor: theme.card,
    borderRadius: theme.radius,
    padding: 20,
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
    aspectRatio: 1,
    borderRadius: theme.radiusSm,
    backgroundColor: theme.imageBg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
  prompt: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.textPrimary,
    textAlign: 'center',
    marginTop: 20,
  },
  options: { gap: 12, marginTop: 24 },
  option: {
    borderRadius: theme.radiusSm,
    paddingVertical: 18,
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
  next: {
    marginTop: 'auto',
    backgroundColor: theme.accent,
    borderRadius: theme.radius,
    paddingVertical: 18,
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
