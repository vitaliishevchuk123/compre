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

const LOCKED_LEVELS = [
  { id: 'A2', name: 'Elementary' },
  { id: 'B1', name: 'Intermediate' },
  { id: 'B2', name: 'Upper-Int.' },
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

  const wordsLearned = Math.min(lessonIndex + 1, A1_CARDS.length);
  const a1Pct = wordsLearned / A1_CARDS.length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.brand}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Compre</Text>
        </View>
        <View style={styles.streakPill}>
          <Text style={styles.streakText}>🔥 {stats.streak}-day streak</Text>
        </View>
      </View>

      {/* A1 Continue card */}
      <Pressable
        style={({ pressed }) => [styles.continueCard, pressed && { opacity: 0.92 }]}
        onPress={() => navigation.navigate('CategoryPicker', { level: 'A1' })}
      >
        <View style={styles.continueTop}>
          <View>
            <Text style={styles.continueBadge}>A1</Text>
            <Text style={styles.continueTitle}>Continue Learning</Text>
            <Text style={styles.continueSub}>Beginner · {wordsLearned} / {A1_CARDS.length} words</Text>
          </View>
          <View style={styles.arrowCircle}>
            <Text style={styles.arrowText}>›</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.round(a1Pct * 100)}%` as any }]} />
        </View>
      </Pressable>

      {/* Locked levels row */}
      <Text style={styles.sectionLabel}>Levels</Text>
      <View style={styles.lockedRow}>
        {LOCKED_LEVELS.map((lv) => (
          <View key={lv.id} style={styles.lockedCard}>
            <Text style={styles.lockEmoji}>🔒</Text>
            <Text style={styles.lockedId}>{lv.id}</Text>
            <Text style={styles.lockedName}>{lv.name}</Text>
          </View>
        ))}
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatCard icon="🔥" value={stats.streak} label="Streak" />
        <StatCard icon="📖" value={stats.totalWords} label="Words" />
        <StatCard icon="✅" value={stats.lessonsCompleted} label="Lessons" />
      </View>
    </SafeAreaView>
  );
}

function StatCard({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 0,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bg },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    marginBottom: 20,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 34, height: 34 },
  title: { fontSize: 20, fontWeight: '800', color: theme.accent, letterSpacing: -0.3 },
  streakPill: {
    backgroundColor: theme.card,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: theme.border,
  },
  streakText: { fontSize: 12, fontWeight: '600', color: theme.textPrimary },

  continueCard: {
    backgroundColor: theme.accent,
    borderRadius: theme.radius,
    padding: 20,
    marginBottom: 20,
    shadowColor: theme.accent,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  continueTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  continueBadge: { fontSize: 13, fontWeight: '800', color: 'rgba(255,255,255,0.75)', marginBottom: 4, letterSpacing: 1 },
  continueTitle: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  continueSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: '500', marginTop: 3 },
  arrowCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: { fontSize: 26, color: '#fff', lineHeight: 30 },
  progressTrack: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 3 },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },

  lockedRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  lockedCard: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: theme.radiusSm,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    opacity: 0.5,
  },
  lockEmoji: { fontSize: 16, marginBottom: 4 },
  lockedId: { fontSize: 16, fontWeight: '800', color: theme.textSecondary },
  lockedName: { fontSize: 10, fontWeight: '600', color: theme.textSecondary, marginTop: 2, textAlign: 'center' },

  statsRow: { flexDirection: 'row', gap: 10, marginTop: 'auto', paddingBottom: 8 },
  statCard: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: theme.radiusSm,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: '800', color: theme.textPrimary },
  statLabel: { fontSize: 11, color: theme.textSecondary, marginTop: 2, fontWeight: '500' },
});
