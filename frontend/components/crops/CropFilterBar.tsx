import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  countActiveFilters,
  defaultFilters,
  type ClimateFilter,
  type CropFilters,
  type CropSort,
  type DurationFilter,
  type WaterFilter,
} from '@/constants/crops';
import { colors, fonts } from '@/constants/theme';
import { AppText, Card, PressableScale, SelectableChip } from '@/components/ui';

type Props = {
  value: CropFilters;
  onChange: (next: CropFilters) => void;
};

const sorts: { value: CropSort; label: string }[] = [
  { value: 'match', label: 'Best match' },
  { value: 'profit', label: 'Highest profitability' },
  { value: 'input', label: 'Lowest input cost' },
  { value: 'market', label: 'Market potential & MSP' },
];

const durations: { value: DurationFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'short', label: 'Short 60–90 d' },
  { value: 'medium', label: 'Medium 120–150 d' },
  { value: 'long', label: 'Long / perennial' },
];

const waters: { value: WaterFilter; label: string }[] = [
  { value: 'all', label: 'Any' },
  { value: 'low', label: 'Low / rain-fed' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const climates: { value: ClimateFilter; label: string }[] = [
  { value: 'all', label: 'Any' },
  { value: 'resilient', label: 'High resilience' },
  { value: 'drought', label: 'Dry-spell hardy' },
  { value: 'flood', label: 'Flood hardy' },
];

export function CropFilterBar({ value, onChange }: Props) {
  const active = countActiveFilters(value);

  return (
    <Card>
      <View style={styles.head}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <AppText variant="h2">Filter & sort</AppText>
          <AppText variant="caption" style={{ marginTop: 2 }}>
            Profit, harvest time, water, MSP, and climate risk — pick what matters on this field.
          </AppText>
        </View>
        {active > 0 ? (
          <PressableScale
            onPress={() => onChange({ ...defaultFilters, sort: value.sort })}
            style={styles.clear}>
            <AppText style={styles.clearText}>Clear {active}</AppText>
          </PressableScale>
        ) : null}
      </View>

      <Row label="Sort" hint="One ranking at a time">
        {sorts.map((item) => (
          <SelectableChip
            key={item.value}
            label={item.label}
            selected={value.sort === item.value}
            onPress={() => onChange({ ...value, sort: item.value })}
          />
        ))}
      </Row>

      <Row label="Crop duration" hint="Days to harvest">
        {durations.map((item) => (
          <SelectableChip
            key={item.value}
            label={item.label}
            selected={value.duration === item.value}
            onPress={() => onChange({ ...value, duration: item.value })}
          />
        ))}
      </Row>

      <Row label="Water requirement" hint="What this field can actually supply">
        {waters.map((item) => (
          <SelectableChip
            key={item.value}
            label={item.label}
            selected={value.water === item.value}
            onPress={() => onChange({ ...value, water: item.value })}
          />
        ))}
      </Row>

      <Row label="Market potential & MSP" hint="Demand now, or a government price floor">
        <SelectableChip
          label="MSP supported only"
          selected={value.mspOnly}
          onPress={() => onChange({ ...value, mspOnly: !value.mspOnly })}
        />
        <SelectableChip
          label="High market demand"
          selected={value.highDemandOnly}
          onPress={() => onChange({ ...value, highDemandOnly: !value.highDemandOnly })}
        />
      </Row>

      <Row label="Climate & pest risk" hint="Crops that handle dry spells, floods, or local pests">
        {climates.map((item) => (
          <SelectableChip
            key={item.value}
            label={item.label}
            selected={value.climate === item.value}
            onPress={() => onChange({ ...value, climate: item.value })}
          />
        ))}
      </Row>
    </Card>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.block}>
      <AppText style={styles.rowLabel}>{label}</AppText>
      <AppText variant="caption">{hint}</AppText>
      <View style={styles.chips}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  clear: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
    minHeight: 36,
    justifyContent: 'center',
  },
  clearText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.primaryDark,
  },
  block: { marginTop: 12, gap: 6 },
  rowLabel: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
