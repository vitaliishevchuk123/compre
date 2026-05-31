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

const A1_TOTAL = A1_CARDS.length;

export default function HomeScreen({ navigation }: HomeProps) {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [voices, setVoices] = useState<Speech.Voice[]>([]);
  const { voiceId, setVoiceId } = useVoice();

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getStatistics().then((s) => {
        if (active) setStats(s);
      });
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

  const selectedVoice = voices.find((v) => v.identifier === voiceId);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Pressable
          style={({ pressed }) => [styles.gearBtn, pressed && { opacity: 0.6 }]}
          onPress={() => setShowVoicePicker(true)}
          hitSlop={10}
        >
          <Text style={styles.gearIcon}>⚙️</Text>
        </Pressable>
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
                  Speech.speak('Hello!', {
                    voice: v.identifier,
                    language: v.language,
                    rate: 0.85,
                  });
                }}
              />
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function VoiceRow({
  name,
  language,
  quality,
  selected,
  onPress,
}: {
  name: string;
  language: string;
  quality?: Speech.VoiceQuality;
  selected: boolean;
  onPress: () => void;
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
  topBar: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  logo: { width: 44, height: 44 },
  gearBtn: { padding: 4 },
  gearIcon: { fontSize: 24 },
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
