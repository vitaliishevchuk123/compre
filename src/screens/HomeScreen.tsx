import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const LEVELS = [
  { id: 'A1', name: 'Beginner',           total: A1_CARDS.length, unlocked: true  },
  { id: 'A2', name: 'Elementary',         total: 0,                unlocked: false },
  { id: 'B1', name: 'Intermediate',       total: 0,                unlocked: false },
  { id: 'B2', name: 'Upper Intermediate', total: 0,                unlocked: false },
];

export default function HomeScreen({ navigation }: HomeProps) {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [lessonIndex, setLessonIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      Promise.all([
        getStatistics(),
        AsyncStorage.getItem('@lesson_index'),
      ]).then(([s, saved]) => {
        if (!active) return;
        setStats(s);
        setLessonIndex(saved !== null ? parseInt(saved, 10) : 0);
      });
      return () => { active = false; };
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
        <View style={styles.brand}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Compre</Text>
        </View>
        <View style={styles.streakPill}>
          <Text style={styles.streakText}>🔥 {stats.streak}-day streak</Text>
        </View>
      </View>

      <View style={styles.levelsGrid}>
        {LEVELS.map((level) => {
          const wordsLearned = level.id === 'A1' ? lessonIndex + 1 : 0;
          const pct = level.total > 0 ? wordsLearned / level.total : 0;

          if (!level.unlocked) {
            return (
              <View key={level.id} style={styles.levelCardLocked}>
                <Text style={styles.lockIcon}>🔒</Text>
                <Text style={styles.levelIdLocked}>{level.id}</Text>
                <Text style={styles.levelNameLocked}>{level.name}</Text>
              </View>
            );
          }

          return (
            <Pressable
              key={level.id}
              style={({ pressed }) => [styles.levelCard, pressed && styles.levelCardPressed]}
              onPress={() => navigation.navigate('CategoryPicker', { level: level.id })}
            >
              <View style={styles.levelCardTop}>
                <Text style={styles.levelId}>{level.id}</Text>
                <Text style={styles.levelWords}>{wordsLearned} / {level.total}</Text>
              </View>
              <Text style={styles.levelName}>{level.name}</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${Math.round(pct * 100)}%` }]} />
              </View>
              <Text style={styles.levelHint}>Tap to start lesson</Text>
            </Pressable>
          );
        })}
      </View>

    </SafeAreaView>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.miniStat}>
      <Text style={styles.miniStatValue}>{value}</Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: theme.bg,
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 0,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bg },
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingTop: 4, marginBottom: 20,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 36, height: 36 },
  streakPill: {
    backgroundColor: theme.card,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: theme.option,
  },
  streakText: { fontSize: 11, fontWeight: '600', color: theme.textPrimary },
  title: {
    fontSize: 18, fontWeight: '700', color: 'rgb(229, 145, 60)',
  },
  levelsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  levelCard: {
    width: '47%', backgroundColor: theme.card,
    borderRadius: theme.radius, padding: 16,
    shadowColor: theme.accent, shadowOpacity: 0.12,
    shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 3, borderWidth: 2, borderColor: theme.accent,
  },
  levelCardPressed: { opacity: 0.85 },
  levelCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  levelId: { fontSize: 22, fontWeight: '900', color: theme.accent },
  levelWords: { fontSize: 12, fontWeight: '600', color: theme.textSecondary, marginTop: 4 },
  levelName: { fontSize: 13, fontWeight: '600', color: theme.textSecondary, marginTop: 2 },
  progressTrack: {
    height: 5, backgroundColor: theme.option,
    borderRadius: 3, marginTop: 12, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: theme.accent, borderRadius: 3 },
  levelHint: { fontSize: 11, color: theme.accent, fontWeight: '600', marginTop: 8 },
  levelCardLocked: {
    width: '47%', backgroundColor: theme.card,
    borderRadius: theme.radius, padding: 16, opacity: 0.45,
  },
  lockIcon: { fontSize: 18, marginBottom: 4 },
  levelIdLocked: { fontSize: 22, fontWeight: '900', color: theme.textSecondary },
  levelNameLocked: { fontSize: 13, fontWeight: '600', color: theme.textSecondary, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 'auto', paddingTop: 16, paddingBottom: 8 },
  miniStat: {
    flex: 1, backgroundColor: theme.card,
    borderRadius: theme.radiusSm, paddingVertical: 12, alignItems: 'center',
  },
  miniStatValue: { fontSize: 20, fontWeight: '800', color: 'rgb(100, 88, 74)' },
  miniStatLabel: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
});
