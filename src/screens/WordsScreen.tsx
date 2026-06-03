import { useCallback, useState } from 'react';
import { SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getWordsByLevel } from '../db/words';
import { A1_CARDS } from '../data/seed/a1';
import { theme } from '../theme';

type WordEntry = { word: string; category: string };
type WordChunk = WordEntry[];
type Section = { title: string; data: WordChunk[] };

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

const COLS = 3;

function chunkWords(words: WordEntry[]): WordChunk[] {
  const chunks: WordChunk[] = [];
  for (let i = 0; i < words.length; i += COLS) chunks.push(words.slice(i, i + COLS));
  return chunks;
}

function buildAlphaSections(learnedSet: Set<string>): { sections: Section[]; total: number; learned: number } {
  const seen = new Set<string>();
  const all: WordEntry[] = [];
  for (const card of A1_CARDS) {
    if (!seen.has(card.answer)) {
      seen.add(card.answer);
      all.push({ word: card.answer, category: card.category });
    }
  }
  all.sort((a, b) => a.word.localeCompare(b.word));

  const byLetter = new Map<string, WordEntry[]>();
  for (const entry of all) {
    const letter = entry.word[0].toUpperCase();
    if (!byLetter.has(letter)) byLetter.set(letter, []);
    byLetter.get(letter)!.push(entry);
  }

  const sections: Section[] = [];
  for (const [letter, words] of byLetter) {
    sections.push({ title: letter, data: chunkWords(words) });
  }

  return { sections, total: all.length, learned: all.filter((e) => learnedSet.has(e.word)).length };
}

function buildCategorySections(learnedSet: Set<string>): { sections: Section[]; total: number; learned: number } {
  const seen = new Set<string>();
  const all: WordEntry[] = [];
  for (const card of A1_CARDS) {
    if (!seen.has(card.answer)) {
      seen.add(card.answer);
      all.push({ word: card.answer, category: card.category });
    }
  }

  const byCategory = new Map<string, WordEntry[]>();
  for (const entry of all) {
    if (!byCategory.has(entry.category)) byCategory.set(entry.category, []);
    byCategory.get(entry.category)!.push(entry);
  }

  const sections: Section[] = [];
  for (const [cat, words] of [...byCategory].sort(([a], [b]) => a.localeCompare(b))) {
    words.sort((a, b) => a.word.localeCompare(b.word));
    sections.push({ title: cat, data: chunkWords(words) });
  }

  return { sections, total: all.length, learned: all.filter((e) => learnedSet.has(e.word)).length };
}

type Tab = 'alpha' | 'category';

export default function WordsScreen() {
  const [learnedSet, setLearnedSet] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<Tab>('alpha');

  useFocusEffect(
    useCallback(() => {
      getWordsByLevel('A1').then((words) => {
        setLearnedSet(new Set(words.map((w) => w.word)));
      });
    }, [])
  );

  const { sections, total, learned } =
    tab === 'alpha' ? buildAlphaSections(learnedSet) : buildCategorySections(learnedSet);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Words</Text>
          <Text style={styles.subtitle}>{learned} / {total} learned</Text>
        </View>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === 'alpha' && styles.tabActive]}
            onPress={() => setTab('alpha')}
          >
            <Text style={[styles.tabText, tab === 'alpha' && styles.tabTextActive]}>Alphabet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'category' && styles.tabActive]}
            onPress={() => setTab('category')}
          >
            <Text style={[styles.tabText, tab === 'category' && styles.tabTextActive]}>Category</Text>
          </TouchableOpacity>
        </View>
      </View>

      <SectionList
        key={tab}
        sections={sections}
        keyExtractor={(chunk, idx) => chunk.map((e) => e.word).join(',') + idx}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section }) => {
          const color = tab === 'category' ? (CATEGORY_COLOR[section.title] ?? '#F0F0F0') : undefined;
          return (
            <View style={styles.sectionHeader}>
              {color && <View style={[styles.categoryDot, { backgroundColor: color }]} />}
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
          );
        }}
        renderItem={({ item: chunk }) => (
          <View style={styles.row}>
            {chunk.map((entry) => {
              const done = learnedSet.has(entry.word);
              const bg = CATEGORY_COLOR[entry.category] ?? '#F0F0F0';
              return (
                <View key={entry.word} style={[styles.chip, { backgroundColor: bg }, done && styles.chipDone]}>
                  <Text style={[styles.chipWord, done && styles.chipWordDone]}>
                    {entry.word}
                  </Text>
                  {done && <Text style={styles.checkmark}>✓</Text>}
                </View>
              );
            })}
            {chunk.length < COLS &&
              Array.from({ length: COLS - chunk.length }).map((_, i) => (
                <View key={`empty-${i}`} style={styles.chipEmpty} />
              ))}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 0 },
  headerTop: { flexDirection: 'row', alignItems: 'baseline', gap: 10, paddingHorizontal: 8, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: '700', color: 'rgb(229, 145, 60)' },
  subtitle: { fontSize: 14, color: theme.textSecondary },
  tabs: {
    flexDirection: 'row',
    borderRadius: theme.radiusSm,
    backgroundColor: '#EBEBEB',
    padding: 3,
    gap: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: theme.radiusSm - 1,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  tabText: { fontSize: 13, fontWeight: '600', color: theme.textSecondary },
  tabTextActive: { color: theme.textPrimary },
  list: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 32 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 6,
    backgroundColor: theme.bg,
    gap: 8,
  },
  categoryDot: { width: 12, height: 12, borderRadius: 6 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: theme.textSecondary },
  row: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  chip: {
    flex: 1,
    borderRadius: theme.radiusSm,
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chipEmpty: { flex: 1 },
  chipDone: { opacity: 0.75 },
  chipWord: { fontSize: 13, fontWeight: '700', color: theme.textPrimary },
  chipWordDone: { color: theme.textSecondary },
  checkmark: { fontSize: 14, color: theme.success, fontWeight: '700' },
});
