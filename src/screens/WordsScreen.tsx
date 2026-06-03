import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getWordsByLevel } from '../db/words';
import { A1_CARDS } from '../data/seed/a1';
import { theme } from '../theme';

type WordRow = { word: string; category: string; status: string | null };

const CATEGORY_COLOR: Record<string, string> = {
  people:     '#E8D5F5',
  family:     '#F5D5E8',
  animals:    '#D5EBF5',
  actions:    '#D5F5E3',
  adjectives: '#F5EED5',
  adverbs:    '#F5EED5',
  emotions:   '#FFD5D5',
  colors:     '#E8F5D5',
  food:       '#FFF0D5',
  objects:    '#E0E8FF',
  body:       '#FFE8E0',
  nature:     '#D5F5EC',
  numbers:    '#F0D5FF',
};

export default function WordsScreen() {
  const [learnedSet, setLearnedSet] = useState<Set<string>>(new Set());

  useFocusEffect(
    useCallback(() => {
      getWordsByLevel('A1').then((words) => {
        setLearnedSet(new Set(words.map((w) => w.word)));
      });
    }, [])
  );

  // Deduplicate by word, preserve order
  const seen = new Set<string>();
  const rows: WordRow[] = [];
  for (const card of A1_CARDS) {
    if (!seen.has(card.answer)) {
      seen.add(card.answer);
      rows.push({ word: card.answer, category: card.category, status: null });
    }
  }

  const learned = rows.filter((r) => learnedSet.has(r.word)).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Words</Text>
        <Text style={styles.subtitle}>{learned} / {rows.length} learned</Text>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(item) => item.word}
        numColumns={3}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          const done = learnedSet.has(item.word);
          const bg = CATEGORY_COLOR[item.category] ?? '#F0F0F0';
          return (
            <View style={[styles.chip, { backgroundColor: bg }, done && styles.chipDone]}>
              <Text style={[styles.chipWord, done && styles.chipWordDone]}>
                {item.word}
              </Text>
              {done && <Text style={styles.checkmark}>✓</Text>}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  header: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 18, fontWeight: '700', color: 'rgb(229, 145, 60)' },
  subtitle: { fontSize: 14, color: theme.textSecondary, marginTop: 2 },
  list: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 },
  row: { gap: 8, marginBottom: 8 },
  chip: {
    flex: 1,
    borderRadius: theme.radiusSm,
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chipDone: { opacity: 0.75 },
  chipWord: { fontSize: 13, fontWeight: '700', color: theme.textPrimary },
  chipWordDone: { color: theme.textSecondary },
  checkmark: { fontSize: 14, color: theme.success, fontWeight: '700' },
});
