import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/constants/theme';
import { AppText, PressableScale } from '@/components/ui';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  danger?: boolean;
  onPress?: () => void;
};

export function SettingsRow({ icon, label, value, danger, onPress }: Props) {
  return (
    <PressableScale onPress={onPress} style={styles.row}>
      <View style={[styles.icon, danger && { backgroundColor: colors.dangerSoft }]}>
        <Ionicons name={icon} size={18} color={danger ? colors.danger : colors.primary} />
      </View>
      <AppText variant="title" style={{ flex: 1 }} color={danger ? colors.danger : colors.text}>
        {label}
      </AppText>
      {value ? <AppText variant="caption">{value}</AppText> : null}
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
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
