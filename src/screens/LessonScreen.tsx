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
        <ActivityIndicator size="large" color="#4f8cff" />
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

  const progress = `${index + 1} / ${A1_CARDS.length}`;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Text style={styles.progress}>{progress}</Text>

      <Image source={getImage(card.imageKey)} style={styles.image} resizeMode="cover" />

      <Text style={styles.prompt}>
        {card.sentence ?? 'What is this?'}
      </Text>

      <View style={styles.options}>
        {options.map((option) => (
          <Option
            key={option}
            label={option}
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
        <Text style={styles.nextText}>
          {index + 1 >= A1_CARDS.length ? 'Finish' : 'Next'}
        </Text>
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
  onPress,
}: {
  label: string;
  state: OptionVisual;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.option, OPTION_STYLE[state]]}
      onPress={onPress}
      disabled={state !== 'idle'}
    >
      <Text style={[styles.optionText, state === 'muted' && styles.optionTextMuted]}>
        {label}
      </Text>
    </Pressable>
  );
}

const OPTION_STYLE = StyleSheet.create({
  idle: { backgroundColor: '#f3f6fd' },
  correct: { backgroundColor: '#d6f5e0', borderColor: '#34c172', borderWidth: 2 },
  wrong: { backgroundColor: '#fbe0e0', borderColor: '#e05656', borderWidth: 2 },
  muted: { backgroundColor: '#f3f6fd', opacity: 0.5 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  progress: { fontSize: 14, color: '#7a86a1', textAlign: 'center', marginBottom: 12 },
  image: {
    width: '100%', aspectRatio: 1, borderRadius: 24, backgroundColor: '#eef2fb',
  },
  prompt: {
    fontSize: 24, fontWeight: '700', color: '#1a2238',
    textAlign: 'center', marginVertical: 24,
  },
  options: { gap: 12 },
  option: { borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  optionText: { fontSize: 18, fontWeight: '600', color: '#1a2238' },
  optionTextMuted: { color: '#9aa3bb' },
  next: {
    marginTop: 'auto', backgroundColor: '#4f8cff', borderRadius: 18,
    paddingVertical: 18, alignItems: 'center',
  },
  nextDisabled: { backgroundColor: '#cdd7ec' },
  nextPressed: { backgroundColor: '#3d76e0' },
  nextText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
