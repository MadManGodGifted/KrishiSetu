import { Pressable, StyleSheet, View } from 'react-native';

import { colors, fonts, radius } from '@/constants/theme';
import type { HealthTone } from '@/constants/dummy';

import { AppText } from './AppText';

const toneColors: Record<string, { bg: string; fg: string }> = {
  excellent: { bg: colors.primarySoft, fg: colors.primaryDark },
  good: { bg: colors.primarySoft, fg: colors.primary },
  fair: { bg: colors.warningSoft, fg: '#B78103' },
  low: { bg: colors.primarySoft, fg: colors.primary },
  watch: { bg: colors.dangerSoft, fg: colors.danger },
  warning: { bg: colors.warningSoft, fg: '#B78103' },
  High: { bg: colors.dangerSoft, fg: colors.danger },
  Low: { bg: colors.primarySoft, fg: colors.primary },
  Moderate: { bg: colors.accentSoft, fg: colors.accent },
};

type ChipProps = {
  label: string;
  tone?: HealthTone | string;
};

export function StatusChip({ label, tone }: ChipProps) {
  const palette = toneColors[tone ?? label] ?? { bg: colors.primarySoft, fg: colors.primary };
  return (
    <View style={[styles.chip, { backgroundColor: palette.bg }]}>
      <AppText style={[styles.chipText, { color: palette.fg }]}>{label}</AppText>
    </View>
  );
}

type SelectableProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function SelectableChip({ label, selected, onPress }: SelectableProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.selectable, selected && styles.selectableOn]}>
      <AppText
        variant="title"
        color={selected ? colors.white : colors.textSecondary}
        style={{ fontFamily: fonts.semibold, fontSize: 14 }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  chipText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
  selectable: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectableOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
