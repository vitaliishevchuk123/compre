import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { A1_CARDS } from '../data/seed/a1';
import { getImage } from '../data/imageRegistry';
import { theme } from '../theme';
import { useLearnSettings } from '../context/LearnSettingsContext';
import type { CategoryPickerProps } from '../navigation';

const CATEGORY_COLOR: Record<string, string> = {
  people:     '#EDE0F5',
  family:     '#F5DDF0',
  animals:    '#D8EEF7',
  actions:    '#D5F5E3',
  adjectives: '#FFF3D8',
  adverbs:    '#FFF3D8',
  emotions:   '#FFD8D8',
  colors:     '#E5F5D5',
  food:       '#FFE8C0',
  objects:    '#DDE5FF',
  body:       '#FFE5DC',
  nature:     '#D5F5EE',
  numbers:    '#EED5FF',
};

type CategoryInfo = { name: string; imageKey: string; count: number };

function getCategories(): CategoryInfo[] {
  const map = new Map<string, CategoryInfo>();
  for (const card of A1_CARDS) {
    if (!map.has(card.category)) {
      map.set(card.category, { name: card.category, imageKey: card.imageKey, count: 0 });
    }
    map.get(card.category)!.count++;
  }
  return Array.from(map.values());
}

const ALL_COUNT = A1_CARDS.length;
const CATEGORIES = getCategories();

export default function CategoryPickerScreen({ navigation }: CategoryPickerProps) {
  const { mode, autoAdvance, repeatCount, pauseSeconds } = useLearnSettings();

  function go(category?: string) {
    navigation.navigate('Lesson', { category, mode, autoAdvance, repeatCount, pauseSeconds });
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>

        {/* All card */}
        <Pressable
          style={({ pressed }) => [styles.card, styles.cardAll, pressed && { opacity: 0.88 }]}
          onPress={() => go()}
        >
          <Text style={styles.allLabel}>All</Text>
          <Text style={styles.allCount}>{ALL_COUNT} words</Text>
          <View style={styles.modeTag}>
            <Text style={styles.modeTagText}>{mode === 'learn' ? '📖 Learn' : '✏️ Test'}</Text>
          </View>
        </Pressable>

        {/* Category cards */}
        {CATEGORIES.map((cat) => {
          const bg = CATEGORY_COLOR[cat.name] ?? '#F0F0F0';
          return (
            <Pressable
              key={cat.name}
              style={({ pressed }) => [styles.card, { backgroundColor: bg }, pressed && { opacity: 0.88 }]}
              onPress={() => go(cat.name)}
            >
              <Image
                source={getImage(cat.imageKey)}
                style={styles.catImage}
                resizeMode="cover"
              />
              <View style={styles.catFooter}>
                <Text style={styles.catName}>
                  {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                </Text>
                <Text style={styles.catCount}>{cat.count} words</Text>
              </View>
            </Pressable>
          );
        })}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 16,
  },
  card: {
    width: '47%',
    borderRadius: theme.radius,
    overflow: 'hidden',
    minHeight: 148,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardAll: {
    backgroundColor: theme.accent,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 4,
  },
  allLabel: { fontSize: 30, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  allCount: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  modeTag: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  modeTagText: { fontSize: 12, color: '#fff', fontWeight: '700' },

  catImage: { width: '100%', height: 100 },
  catFooter: { padding: 10 },
  catName: { fontSize: 14, fontWeight: '700', color: theme.textPrimary },
  catCount: { fontSize: 11, color: theme.textSecondary, marginTop: 2, fontWeight: '500' },
});
