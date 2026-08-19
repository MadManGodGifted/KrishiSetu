import { StyleSheet, View } from 'react-native';

import { farmSummary } from '@/constants/dummy';
import { AppText, Card, Metric, StatusChip } from '@/components/ui';

export function FarmSummary() {
  return (
    <Card>
      <View style={styles.top}>
        <AppText variant="h2">Farm summary</AppText>
        <StatusChip label={farmSummary.health} tone="good" />
      </View>
      <View style={styles.row}>
        <Metric label="Size" value={`${farmSummary.acres} acres`} />
        <Metric label="Health" value={`${farmSummary.healthScore}`} />
        <Metric label="Next" value="Irrigate" hint="in 2 days" />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  row: { flexDirection: 'row', gap: 12 },
});
