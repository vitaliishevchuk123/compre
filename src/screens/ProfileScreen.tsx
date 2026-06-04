import { useCallback, useEffect, useState } from 'react';
import {
  Modal, Pressable, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { getStatistics, type Statistics } from '../db/statistics';
import { A1_CARDS } from '../data/seed/a1';
import { theme } from '../theme';
import { useVoice } from '../context/VoiceContext';
import { Ionicons } from '@expo/vector-icons';

const STAT_DEFS: { key: keyof Statistics; label: string; icon: string; format?: (v: number) => string }[] = [
  { key: 'streak',           label: 'Day streak',  icon: '🔥' },
  { key: 'totalWords',       label: 'Words seen',  icon: '📖', format: (v) => `${v} / ${A1_CARDS.length}` },
  { key: 'masteredWords',    label: 'Mastered',    icon: '⭐' },
  { key: 'lessonsCompleted', label: 'Lessons',     icon: '✅' },
];

export default function ProfileScreen() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [voices, setVoices] = useState<Speech.Voice[]>([]);
  const { voiceId, setVoiceId } = useVoice();

  useFocusEffect(
    useCallback(() => {
      getStatistics().then(setStats);
    }, [])
  );

  useEffect(() => {
    Speech.getAvailableVoicesAsync().then((all) => {
      setVoices(
        all
          .filter((v) => v.language.startsWith('en'))
          .sort((a, b) => {
            const q = (v: Speech.Voice) =>
              v.quality === Speech.VoiceQuality.Enhanced ? 1 : 0;
            return q(b) - q(a) || a.name.localeCompare(b.name);
          })
      );
    });
  }, []);

  const selectedVoiceName =
    voices.find((v) => v.identifier === voiceId)?.name ?? 'Default';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        {stats && (
          <View style={styles.statsGrid}>
            {STAT_DEFS.map(({ key, label, icon, format }) => (
              <StatCard
                key={key}
                icon={icon}
                label={label}
                value={format ? format(stats[key]) : String(stats[key])}
              />
            ))}
          </View>
        )}

        <Text style={styles.sectionLabel}>Voice</Text>
        <Pressable
          style={({ pressed }) => [styles.voiceBtn, pressed && { opacity: 0.7 }]}
          onPress={() => setShowVoicePicker(true)}
        >
          <View style={styles.voiceBtnLeft}>
            <View style={styles.voiceBtnIcon}>
              <Ionicons name="volume-high" size={18} color={theme.accent} />
            </View>
            <Text style={styles.voiceBtnLabel}>{selectedVoiceName}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
        </Pressable>
      </ScrollView>

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

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function VoiceRow({ name, language, quality, selected, onPress }: {
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
        <Text style={[styles.voiceName, selected && styles.voiceNameSelected]}>
          {name}
        </Text>
        {language ? (
          <Text style={styles.voiceLang}>
            {language}{quality === Speech.VoiceQuality.Enhanced ? ' · enhanced' : ''}
          </Text>
        ) : null}
      </View>
      {selected && <Ionicons name="checkmark-circle" size={20} color={theme.success} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: theme.accent, marginBottom: 20, letterSpacing: -0.3 },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    width: '47%',
    backgroundColor: theme.card,
    borderRadius: theme.radius,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  statIcon: { fontSize: 24, marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: '800', color: theme.textPrimary },
  statLabel: { fontSize: 12, color: theme.textSecondary, marginTop: 3, fontWeight: '500' },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  voiceBtn: {
    backgroundColor: theme.card,
    borderRadius: theme.radiusSm,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voiceBtnLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  voiceBtnIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.option,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceBtnLabel: { fontSize: 16, fontWeight: '600', color: theme.textPrimary },

  modal: { flex: 1, backgroundColor: theme.bg },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.border,
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
});
