import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { A1_CARDS } from '../data/seed/a1';
import { getImage } from '../data/imageRegistry';
import { theme } from '../theme';
import type { CategoryPickerProps } from '../navigation';

const CATEGORY_COLOR: Record<string, string> = {
  people:     '#E8D5F5',
  family:     '#F5D5E8',
  animals:    '#D5EBF5',
  actions:    '#D5F5E3',
  adjectives: '#FFF0D5',
  adverbs:    '#FFF0D5',
  emotions:   '#FFD5D5',
  colors:     '#E8F5D5',
  food:       '#FFE8C8',
  objects:    '#E0E8FF',
  body:       '#FFE8E0',
  nature:     '#D5F5EC',
  numbers:    '#F0D5FF',
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

export default function CategoryPickerScreen({ navigation, route }: CategoryPickerProps) {
  const { level } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>

        {/* All card */}
        <Pressable
          style={({ pressed }) => [styles.card, styles.cardAll, pressed && { opacity: 0.85 }]}
          onPress={() => navigation.navigate('Lesson', {})}
        >
          <Text style={styles.allLabel}>All</Text>
          <Text style={styles.allCount}>{ALL_COUNT} words</Text>
        </Pressable>

        {/* Category cards */}
        {CATEGORIES.map((cat) => {
          const bg = CATEGORY_COLOR[cat.name] ?? '#F0F0F0';
          return (
            <Pressable
              key={cat.name}
              style={({ pressed }) => [styles.card, { backgroundColor: bg }, pressed && { opacity: 0.85 }]}
              onPress={() => navigation.navigate('Lesson', { category: cat.name })}
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
    minHeight: 140,
  },
  cardAll: {
    backgroundColor: theme.accent,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  allLabel: { fontSize: 28, fontWeight: '800', color: '#fff' },
  allCount: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4, fontWeight: '600' },

  catImage: { width: '100%', height: 100 },
  catFooter: { padding: 10 },
  catName: { fontSize: 15, fontWeight: '700', color: theme.textPrimary },
  catCount: { fontSize: 11, color: theme.textSecondary, marginTop: 2 },
});
