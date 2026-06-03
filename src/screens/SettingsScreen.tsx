import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { useLearnSettings } from '../context/LearnSettingsContext';

const REPEAT_OPTIONS = [1, 2, 3, 5];
const PAUSE_OPTIONS = [0, 1, 2, 3, 5];

export default function SettingsScreen() {
  const {
    mode, autoAdvance, repeatCount, pauseSeconds,
    setMode, setAutoAdvance, setRepeatCount, setPauseSeconds,
  } = useLearnSettings();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        <Text style={styles.sectionLabel}>Mode</Text>
        <View style={styles.segmented}>
          <Pressable
            style={[styles.segBtn, mode === 'learn' && styles.segBtnActive]}
            onPress={() => setMode('learn')}
          >
            <Text style={[styles.segText, mode === 'learn' && styles.segTextActive]}>Learn</Text>
          </Pressable>
          <Pressable
            style={[styles.segBtn, mode === 'test' && styles.segBtnActive]}
            onPress={() => setMode('test')}
          >
            <Text style={[styles.segText, mode === 'test' && styles.segTextActive]}>Test</Text>
          </Pressable>
        </View>

        {mode === 'learn' && (
          <>
            <Text style={styles.sectionLabel}>Auto-advance</Text>
            <View style={styles.card}>
              <SettingRow label="Automatically go to the next slide after audio finishes">
                <View style={styles.chips}>
                  {([false, true] as const).map((v) => (
                    <Pressable
                      key={String(v)}
                      style={[styles.chip, autoAdvance === v && styles.chipActive]}
                      onPress={() => setAutoAdvance(v)}
                    >
                      <Text style={[styles.chipText, autoAdvance === v && styles.chipTextActive]}>
                        {v ? 'On' : 'Off'}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </SettingRow>
            </View>

            <Text style={styles.sectionLabel}>Repeats per slide</Text>
            <View style={styles.card}>
              <SettingRow label="How many times to read each word and sentence">
                <View style={styles.chips}>
                  {REPEAT_OPTIONS.map((n) => (
                    <Pressable
                      key={n}
                      style={[styles.chip, repeatCount === n && styles.chipActive]}
                      onPress={() => setRepeatCount(n)}
                    >
                      <Text style={[styles.chipText, repeatCount === n && styles.chipTextActive]}>
                        {n}×
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </SettingRow>
            </View>

            <Text style={styles.sectionLabel}>Pause after slide</Text>
            <View style={styles.card}>
              <SettingRow label="Wait before moving to the next slide">
                <View style={styles.chips}>
                  {PAUSE_OPTIONS.map((s) => (
                    <Pressable
                      key={s}
                      style={[styles.chip, pauseSeconds === s && styles.chipActive]}
                      onPress={() => setPauseSeconds(s)}
                    >
                      <Text style={[styles.chipText, pauseSeconds === s && styles.chipTextActive]}>
                        {s}s
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </SettingRow>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  content: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 40 },
  title: { fontSize: 18, fontWeight: '700', color: 'rgb(229, 145, 60)', marginBottom: 20 },

  sectionLabel: {
    fontSize: 13, fontWeight: '600', color: theme.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.8,
    marginTop: 20, marginBottom: 8,
  },

  segmented: {
    flexDirection: 'row',
    backgroundColor: theme.option,
    borderRadius: theme.radius,
    padding: 4,
    gap: 4,
  },
  segBtn: {
    flex: 1, paddingVertical: 10,
    borderRadius: theme.radiusSm, alignItems: 'center',
  },
  segBtnActive: { backgroundColor: theme.accent },
  segText: { fontSize: 15, fontWeight: '700', color: theme.textSecondary },
  segTextActive: { color: '#fff' },

  card: {
    backgroundColor: theme.card,
    borderRadius: theme.radiusSm,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingRow: { gap: 10 },
  settingLabel: { fontSize: 14, color: theme.textSecondary },

  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingVertical: 7, paddingHorizontal: 16,
    borderRadius: 20, backgroundColor: theme.option,
  },
  chipActive: { backgroundColor: theme.accent },
  chipText: { fontSize: 14, fontWeight: '700', color: theme.textSecondary },
  chipTextActive: { color: '#fff' },
});
