import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStatistics, type Statistics } from '../db/statistics';
import { A1_CARDS } from '../data/seed/a1';
import type { HomeProps } from '../navigation';

const A1_TOTAL = A1_CARDS.length;

export default function HomeScreen({ navigation }: HomeProps) {
  const [stats, setStats] = useState<Statistics | null>(null);

  // Refresh whenever the screen regains focus (e.g. after a lesson).
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getStatistics().then((s) => {
        if (active) setStats(s);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  if (!stats) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#4f8cff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Compre</Text>
      <Text style={styles.subtitle}>Learn English through understanding</Text>

      <View style={styles.statsRow}>
        <Stat label="Words" value={`${stats.totalWords} / ${A1_TOTAL}`} />
        <Stat label="Mastered" value={stats.masteredWords} />
      </View>
      <View style={styles.statsRow}>
        <Stat label="Streak" value={`${stats.streak} 🔥`} />
        <Stat label="Lessons" value={stats.lessonsCompleted} />
      </View>

      <Pressable
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        onPress={() => navigation.navigate('Lesson')}
      >
        <Text style={styles.ctaText}>Start lesson</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 34, fontWeight: '800', color: '#1a2238', marginTop: 12 },
  subtitle: { fontSize: 15, color: '#7a86a1', marginTop: 4, marginBottom: 28 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statCard: {
    flex: 1, backgroundColor: '#f3f6fd', borderRadius: 16, padding: 18,
  },
  statValue: { fontSize: 24, fontWeight: '700', color: '#1a2238' },
  statLabel: { fontSize: 13, color: '#7a86a1', marginTop: 2 },
  cta: {
    marginTop: 'auto', backgroundColor: '#4f8cff', borderRadius: 18,
    paddingVertical: 18, alignItems: 'center',
  },
  ctaPressed: { backgroundColor: '#3d76e0' },
  ctaText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
