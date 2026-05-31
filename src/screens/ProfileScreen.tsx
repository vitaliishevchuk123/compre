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
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>

        {/* Stats */}
        {stats && (
          <View style={styles.statsGrid}>
            <StatCard label="Streak" value={`${stats.streak} 🔥`} />
            <StatCard label="Words" value={`${stats.totalWords} / ${A1_CARDS.length}`} />
            <StatCard label="Mastered" value={String(stats.masteredWords)} />
            <StatCard label="Lessons" value={String(stats.lessonsCompleted)} />
          </View>
        )}

        {/* Voice setting */}
        <Text style={styles.sectionLabel}>Voice</Text>
        <Pressable
          style={({ pressed }) => [styles.voiceBtn, pressed && { opacity: 0.7 }]}
          onPress={() => setShowVoicePicker(true)}
        >
          <Text style={styles.voiceBtnLabel}>🔊  {selectedVoiceName}</Text>
          <Text style={styles.voiceBtnChevron}>›</Text>
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
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
      {selected && <Text style={styles.voiceCheck}>✓</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  content: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 40 },
  title: { fontSize: 18, fontWeight: '700', color: 'rgb(229, 145, 60)', marginBottom: 20 },

  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'space-between', rowGap: 12, marginBottom: 28,
  },
  statCard: {
    width: '48%', backgroundColor: theme.card,
    borderRadius: theme.radius, padding: 18, alignItems: 'center',
  },
  statValue: { fontSize: 24, fontWeight: '800', color: 'rgb(100, 88, 74)' },
  statLabel: { fontSize: 12, color: theme.textSecondary, marginTop: 4 },

  sectionLabel: {
    fontSize: 13, fontWeight: '600', color: theme.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8,
  },
  voiceBtn: {
    backgroundColor: theme.card, borderRadius: theme.radiusSm,
    paddingHorizontal: 16, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  voiceBtnLabel: { fontSize: 16, fontWeight: '600', color: theme.textPrimary },
  voiceBtnChevron: { fontSize: 22, color: theme.textSecondary },

  modal: { flex: 1, backgroundColor: theme.bg },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.option,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: theme.textPrimary },
  modalClose: { fontSize: 16, fontWeight: '600', color: theme.accent },
  voiceList: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },
  voiceRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 16,
    borderRadius: theme.radiusSm, marginBottom: 6, backgroundColor: theme.card,
  },
  voiceRowSelected: {
    backgroundColor: theme.successBg, borderWidth: 1.5, borderColor: theme.success,
  },
  voiceInfo: { flex: 1 },
  voiceName: { fontSize: 16, fontWeight: '600', color: theme.textPrimary },
  voiceNameSelected: { color: theme.success },
  voiceLang: { fontSize: 13, color: theme.textSecondary, marginTop: 2 },
  voiceCheck: { fontSize: 18, color: theme.success, marginLeft: 8 },
});
