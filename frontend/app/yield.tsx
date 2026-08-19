import { StyleSheet, View } from 'react-native';

import { ConfidenceMeter } from '@/components/charts/ConfidenceMeter';
import { YieldChart } from '@/components/charts/YieldChart';
import { AppText, Card, Header, Metric, Screen, StatusChip } from '@/components/ui';
import { yieldForecast } from '@/constants/dummy';
import { colors } from '@/constants/theme';

export default function YieldScreen() {
  return (
    <Screen>
      <Header title="Yield prediction" subtitle={yieldForecast.season} showBack />

      <Card>
        <AppText variant="label">Expected yield</AppText>
        <View style={styles.hero}>
          <AppText variant="display">{yieldForecast.expected}</AppText>
          <AppText variant="h2" color={colors.textSecondary}>
            {yieldForecast.unit}
          </AppText>
        </View>
        <AppText variant="caption">{yieldForecast.perAcre} q per acre · {yieldForecast.season}</AppText>
        <View style={styles.split}>
          <Metric label="Revenue" value={yieldForecast.revenue} hint="at local mandi" />
          <StatusChip label="On track" tone="good" />
        </View>
      </Card>

      <Card>
        <AppText variant="h2">Yield trend</AppText>
        <AppText variant="caption" style={{ marginBottom: 8 }}>
          Quintals per acre, last six seasons
        </AppText>
        <YieldChart />
      </Card>

      <Card>
        <View style={styles.meter}>
          <ConfidenceMeter value={yieldForecast.confidence} caption="Model confidence" />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 4, marginBottom: 6 },
  split: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  meter: { alignItems: 'center', paddingVertical: 8 },
});
