import { StyleSheet, View } from 'react-native';

import { AppText, Input, Select } from '@/components/ui';
import { colors } from '@/constants/theme';
import { AREA_UNITS, formatAcres, parseAreaInput, toAcres, type AreaUnit } from '@/lib/area';

type Props = {
  value: string;
  unit: AreaUnit;
  state?: string;
  onChange: (next: { value: string; unit: AreaUnit }) => void;
  error?: string;
};

export function FarmSizeField({ value, unit, state, onChange, error }: Props) {
  const parsed = parseAreaInput(value);
  const acres = parsed != null ? toAcres(parsed, unit, state) : null;
  const regional = unit === 'bigha' || unit === 'biswa';

  let hint = 'Enter the plot area. Decimals are allowed.';
  if (acres != null && parsed != null) {
    if (unit === 'acre') hint = `${formatAcres(acres)} acres will be sent to the model.`;
    else if (regional) {
      hint = `Normalized to ${formatAcres(acres)} acres using the ${state || 'standard'} ${unit} measure.`;
    } else {
      hint = `Normalized to ${formatAcres(acres)} acres before recommendation.`;
    }
  }

  return (
    <View style={styles.block}>
      <AppText variant="label">Farm size</AppText>
      <View style={styles.row}>
        <Input
          containerStyle={styles.input}
          label="Area"
          placeholder="e.g. 4.5"
          keyboardType="decimal-pad"
          inputMode="decimal"
          value={value}
          onChangeText={(text) => {
            const next = text.replace(/[^0-9.]/g, '');
            const parts = next.split('.');
            const sanitized = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : next;
            onChange({ value: sanitized, unit });
          }}
          error={error}
        />
        <Select
          style={styles.unit}
          label="Unit"
          value={unit}
          options={[...AREA_UNITS]}
          onChange={(next) => onChange({ value, unit: next as AreaUnit })}
        />
      </View>
      {!error ? (
        <AppText variant="caption" color={colors.textSecondary}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 12 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  input: { flex: 1.2, minWidth: 0 },
  unit: { flex: 1, minWidth: 0 },
});
