import { StyleSheet, View } from 'react-native';

import { AppText, PressableScale, Select } from '@/components/ui';
import { colors, fonts, radius } from '@/constants/theme';
import { MONTHS, MONTH_SHORT, monthIndexInRange, seasonHint } from '@/lib/season';

type Props = {
  sowingMonth: number;
  harvestMonth: number;
  onChange: (next: { sowingMonth: number; harvestMonth: number }) => void;
};

export function SowingPeriod({ sowingMonth, harvestMonth, onChange }: Props) {
  const onChip = (index: number) => {
    // First tap sets sowing and clears harvest to the same month; second tap completes the range.
    if (sowingMonth === harvestMonth) {
      onChange({ sowingMonth, harvestMonth: index });
      return;
    }
    onChange({ sowingMonth: index, harvestMonth: index });
  };

  return (
    <View style={styles.block}>
      <AppText variant="label">Sowing period</AppText>

      <View style={styles.row}>
        <Select
          style={styles.col}
          label="Sowing month"
          value={MONTHS[sowingMonth]}
          options={[...MONTHS]}
          onChange={(label) => {
            const index = MONTHS.indexOf(label as (typeof MONTHS)[number]);
            if (index >= 0) onChange({ sowingMonth: index, harvestMonth });
          }}
        />
        <Select
          style={styles.col}
          label="Harvest month"
          value={MONTHS[harvestMonth]}
          options={[...MONTHS]}
          onChange={(label) => {
            const index = MONTHS.indexOf(label as (typeof MONTHS)[number]);
            if (index >= 0) onChange({ sowingMonth, harvestMonth: index });
          }}
        />
      </View>

      <View style={styles.rail}>
        {MONTH_SHORT.map((label, index) => {
          const inRange = monthIndexInRange(index, sowingMonth, harvestMonth);
          const edge = index === sowingMonth || index === harvestMonth;
          return (
            <PressableScale
              key={label}
              onPress={() => onChip(index)}
              style={[styles.month, inRange && styles.monthOn, edge && styles.monthEdge]}>
              <AppText
                style={[
                  styles.monthText,
                  inRange && styles.monthTextOn,
                  edge && styles.monthTextEdge,
                ]}>
                {label}
              </AppText>
            </PressableScale>
          );
        })}
      </View>

      <AppText variant="caption">{seasonHint(sowingMonth, harvestMonth)}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 12 },
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1, minWidth: 0 },
  rail: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  month: {
    width: '15.2%',
    minWidth: 48,
    flexGrow: 1,
    height: 36,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthOn: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoft,
  },
  monthEdge: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  monthText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.textSecondary,
  },
  monthTextOn: { color: colors.primaryDark },
  monthTextEdge: { color: colors.white },
});
