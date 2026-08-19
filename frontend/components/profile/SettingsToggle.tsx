import { StyleSheet, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/constants/theme';
import { AppText, PressableScale } from '@/components/ui';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  hint?: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

export function SettingsToggle({ icon, label, hint, value, onChange }: Props) {
  return (
    <PressableScale onPress={() => onChange(!value)} style={styles.row}>
      <View style={styles.icon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="title">{label}</AppText>
        {hint ? <AppText variant="caption">{hint}</AppText> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        pointerEvents="none"
        trackColor={{ false: colors.border, true: colors.primaryMuted }}
        thumbColor={value ? colors.primaryDark : colors.white}
      />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    minHeight: 56,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
