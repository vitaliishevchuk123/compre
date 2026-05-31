import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { getStatistics, type Statistics } from '../db/statistics';
import { A1_CARDS } from '../data/seed/a1';
import { theme } from '../theme';
import { useVoice } from '../context/VoiceContext';
import type { HomeProps } from '../navigation';

const LEVELS = [
  { id: 'A1', name: 'Beginner',           total: A1_CARDS.length, unlocked: true  },
  { id: 'A2', name: 'Elementary',         total: 0,                unlocked: false },
  { id: 'B1', name: 'Intermediate',       total: 0,                unlocked: false },
  { id: 'B2', name: 'Upper Intermediate', total: 0,                unlocked: false },
];

export default function HomeScreen({ navigation }: HomeProps) {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [voices, setVoices] = useState<Speech.Voice[]>([]);
  const { voiceId, setVoiceId } = useVoice();

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getStatistics().then((s) => { if (active) setStats(s); });
      return () => { active = false; };
    }, [])
  );

  useEffect(() => {
    Speech.getAvailableVoicesAsync().then((all) => {
      const en = all
        .filter((v) => v.language.startsWith('en'))
        .sort((a, b) => {
          const q = (v: Speech.Voice) =>
            v.quality === Speech.VoiceQuality.Enhanced ? 1 : 0;
          return q(b) - q(a) || a.name.localeCompare(b.name);
        });
      setVoices(en);
    });
  }, []);

  if (!stats) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={theme.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <View style={styles.topRight}>
          <Text style={styles.streak}>{stats.streak} 🔥</Text>
          <Pressable
            style={({ pressed }) => [styles.gearBtn, pressed && { opacity: 0.6 }]}
            onPress={() => setShowVoicePicker(true)}
            hitSlop={10}
          >
            <Text style={styles.gearIcon}>⚙️</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.title}>Compre</Text>

      {/* Level cards */}
      <View style={styles.levelsGrid}>
        {LEVELS.map((level) => {
          const wordsLearned = level.id === 'A1' ? stats.totalWords : 0;
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
              onPress={() => navigation.navigate('Lesson')}
            >
              <View style={styles.levelCardTop}>
                <Text style={styles.levelId}>{level.id}</Text>
                <Text style={styles.levelWords}>
                  {wordsLearned} / {level.total}
                </Text>
              </View>
              <Text style={styles.levelName}>{level.name}</Text>
              {/* Progress bar */}
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${Math.round(pct * 100)}%` }]} />
              </View>
              <Text style={styles.levelHint}>Tap to start lesson</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Bottom stats row */}
      <View style={styles.statsRow}>
        <MiniStat label="Mastered" value={stats.masteredWords} />
        <MiniStat label="Lessons" value={stats.lessonsCompleted} />
      </View>

      {/* Voice picker modal */}
      <Modal
        visible={showVoicePicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowVoicePicker(false)}
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Voice</Text>
            <Pressable
              onPress={() => setShowVoicePicker(false)}
              hitSlop={12}
              style={({ pressed }) => pressed && { opacity: 0.6 }}
            >
              <Text style={styles.modalClose}>Done</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.voiceList}>
            <VoiceRow
              name="Default"
              language=""
              selected={voiceId === null}
              onPress={() => {
                setVoiceId(null);
                Speech.speak('Hello!', { language: 'en-US', rate: 0.85 });
              }}
            />
            {voices.map((v) => (
              <VoiceRow
                key={v.identifier}
                name={v.name}
                language={v.language}
                quality={v.quality}
                selected={v.identifier === voiceId}
                onPress={() => {
                  setVoiceId(v.identifier);
                  Speech.speak('Hello!', { voice: v.identifier, language: v.language, rate: 0.85 });
                }}
              />
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
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

function VoiceRow({
  name, language, quality, selected, onPress,
}: {
  name: string; language: string; quality?: Speech.VoiceQuality;
  selected: boolean; onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.voiceRow,
        selected && styles.voiceRowSelected,
        pressed && { opacity: 0.7 },
      ]}
      onPress={onPress}
    >
      <View style={styles.voiceInfo}>
        <Text style={[styles.voiceName, selected && styles.voiceNameSelected]}>{name}</Text>
        {language ? (
          <Text style={styles.voiceLang}>
            {language}{quality === Speech.VoiceQuality.Enhanced ? ' · enhanced' : ''}
          </Text>
        ) : null}
      </View>
      {selected && <Text style={styles.voiceCheck}>✓</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bg },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  logo: { width: 40, height: 40 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  streak: { fontSize: 16, fontWeight: '700', color: theme.textPrimary },
  gearBtn: { padding: 4 },
  gearIcon: { fontSize: 22 },

  title: {
    fontSize: 34,
    fontWeight: '800',
    color: theme.textPrimary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },

  levelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  // Active level card
  levelCard: {
    width: '47%',
    backgroundColor: theme.card,
    borderRadius: theme.radius,
    padding: 16,
    shadowColor: theme.accent,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 2,
    borderColor: theme.accent,
  },
  levelCardPressed: { opacity: 0.85 },
  levelCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  levelId: { fontSize: 22, fontWeight: '900', color: theme.accent },
  levelWords: { fontSize: 12, fontWeight: '600', color: theme.textSecondary, marginTop: 4 },
  levelName: { fontSize: 13, fontWeight: '600', color: theme.textSecondary, marginTop: 2 },
  progressTrack: {
    height: 5,
    backgroundColor: theme.option,
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.accent,
    borderRadius: 3,
  },
  levelHint: { fontSize: 11, color: theme.accent, fontWeight: '600', marginTop: 8 },

  // Locked level card
  levelCardLocked: {
    width: '47%',
    backgroundColor: theme.card,
    borderRadius: theme.radius,
    padding: 16,
    opacity: 0.45,
    alignItems: 'flex-start',
  },
  lockIcon: { fontSize: 18, marginBottom: 4 },
  levelIdLocked: { fontSize: 22, fontWeight: '900', color: theme.textSecondary },
  levelNameLocked: { fontSize: 13, fontWeight: '600', color: theme.textSecondary, marginTop: 2 },

  // Bottom stats
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
    paddingTop: 20,
  },
  miniStat: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: theme.radiusSm,
    paddingVertical: 12,
    alignItems: 'center',
  },
  miniStatValue: { fontSize: 20, fontWeight: '800', color: theme.textPrimary },
  miniStatLabel: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },

  // Modal
  modal: { flex: 1, backgroundColor: theme.bg },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.option,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: theme.textPrimary },
  modalClose: { fontSize: 16, fontWeight: '600', color: theme.accent },
  voiceList: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: theme.radiusSm,
    marginBottom: 6,
    backgroundColor: theme.card,
  },
  voiceRowSelected: {
    backgroundColor: theme.successBg,
    borderWidth: 1.5,
    borderColor: theme.success,
  },
  voiceInfo: { flex: 1 },
  voiceName: { fontSize: 16, fontWeight: '600', color: theme.textPrimary },
  voiceNameSelected: { color: theme.success },
  voiceLang: { fontSize: 13, color: theme.textSecondary, marginTop: 2 },
  voiceCheck: { fontSize: 18, color: theme.success, marginLeft: 8 },
});
