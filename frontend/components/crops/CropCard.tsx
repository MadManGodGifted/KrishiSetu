import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { images, recommendationResult } from '@/constants/dummy';
import { colors, radius } from '@/constants/theme';
import { AppText, Button, Card, Metric, StatusChip } from '@/components/ui';

type Props = {
  onDeals?: () => void;
};

export function CropCard({ onDeals }: Props) {
  const result = recommendationResult;

  return (
    <Card padded={false}>
      <Image source={images.wheat} style={styles.image} contentFit="cover" />
      <View style={styles.body}>
        <View style={styles.top}>
          <View style={{ flex: 1 }}>
            <AppText variant="label">Recommended crop</AppText>
            <AppText variant="h1">{result.crop}</AppText>
          </View>
          <StatusChip label={`${result.confidence}% sure`} tone="good" />
        </View>

        <View style={styles.metrics}>
          <Metric label="Yield" value={result.expectedYield} />
          <Metric label="Risk" value={result.risk} />
          <Metric label="Water" value={result.water} />
        </View>

        <AppText variant="caption" style={styles.reason}>
          {result.reasoning}
        </AppText>

        {onDeals ? <Button title="View smart deals" onPress={onDeals} /> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 160,
    width: '100%',
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    backgroundColor: colors.primarySoft,
  },
  body: { padding: 20, gap: 16 },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  metrics: { flexDirection: 'row', gap: 8 },
  reason: { lineHeight: 20 },
});
