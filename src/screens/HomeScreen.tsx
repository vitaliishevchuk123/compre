import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStatistics, type Statistics } from '../db/statistics';
import { A1_CARDS } from '../data/seed/a1';
import { theme } from '../theme';
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
        <ActivityIndicator size="large" color={theme.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Compre</Text>
        <Text style={styles.subtitle}>Learn English through understanding</Text>
      </View>

      <View style={styles.statsGrid}>
        <Stat label="Words" value={`${stats.totalWords} / ${A1_TOTAL}`} />
        <Stat label="Mastered" value={stats.masteredWords} />
        <Stat label="Streak" value={`${stats.streak} 🔥`} accent />
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

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, accent && styles.statValueAccent]}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.bg,
  },
  topBar: { alignSelf: 'stretch', alignItems: 'flex-start', paddingTop: 4 },
  logo: { width: 44, height: 44 },
  header: { alignItems: 'center', marginTop: 8, marginBottom: 32 },
  title: { fontSize: 40, fontWeight: '800', color: theme.textPrimary },
  subtitle: {
    fontSize: 15,
    color: theme.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  statCard: {
    width: '48%',
    backgroundColor: theme.card,
    borderRadius: theme.radius,
    padding: 20,
    alignItems: 'center',
    // soft shadow
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  statValue: { fontSize: 26, fontWeight: '800', color: theme.textPrimary },
  statValueAccent: { color: theme.accent },
  statLabel: { fontSize: 13, color: theme.textSecondary, marginTop: 4 },
  cta: {
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
  ctaPressed: { backgroundColor: theme.accentDark },
  ctaText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
