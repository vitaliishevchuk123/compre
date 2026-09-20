import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';
import type { LearnSettings } from '../context/LearnSettingsContext';

type Mode = LearnSettings['mode'];

const OPTIONS: { value: Mode; label: string }[] = [
  { value: 'learn', label: '📖 Learn' },
  { value: 'test', label: '✏️ Test' },
];

/** Compact Learn/Test switch. Drives the same setting as Settings → Mode. */
export default function ModeSwitch({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  return (
    <View style={styles.wrap} accessibilityRole="tablist">
      {OPTIONS.map(({ value, label }) => {
        const active = mode === value;
        return (
          <Pressable
            key={value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={[styles.seg, active && styles.segActive]}
            onPress={() => onChange(value)}
          >
            <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: theme.border,
    borderRadius: theme.radiusSm,
    padding: 3,
    gap: 3,
    marginRight: 4,
  },
  seg: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 11,
  },
  segActive: {
    backgroundColor: theme.accent,
  },
  text: { fontSize: 13, fontWeight: '700', color: theme.textSecondary },
  textActive: { color: '#fff' },
});
