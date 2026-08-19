import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui';
import { radius } from '@/constants/theme';

export function CropCardSkeleton() {
  return (
    <Card>
      <View style={styles.top}>
        <Skeleton width={68} height={68} round={16} />
        <View style={styles.identity}>
          <Skeleton width="70%" height={20} />
          <Skeleton width="45%" height={12} />
          <View style={styles.badges}>
            <Skeleton width={88} height={24} round={radius.full} />
            <Skeleton width={72} height={24} round={radius.full} />
          </View>
        </View>
      </View>
      <View style={styles.metrics}>
        <Skeleton height={72} style={{ flex: 1 }} />
        <Skeleton height={72} style={{ flex: 1 }} />
        <Skeleton height={72} style={{ flex: 1 }} />
      </View>
      <View style={styles.actions}>
        <Skeleton height={52} style={{ flex: 1 }} />
        <Skeleton height={52} style={{ flex: 1 }} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  identity: { flex: 1, minWidth: 0, gap: 8 },
  badges: { flexDirection: 'row', gap: 6, marginTop: 2 },
  metrics: { flexDirection: 'row', gap: 8, marginTop: 14 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 14 },
});
