import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import type { Deal } from '@/constants/dummy';
import { colors, fonts, radius } from '@/constants/theme';
import { AppText, PressableScale, StatusChip } from '@/components/ui';

type Props = {
  deal: Deal;
  onBuy?: (deal: Deal) => void;
};

export function ProductCard({ deal, onBuy }: Props) {
  return (
    <View style={styles.card}>
      <View>
        <Image source={deal.image} style={styles.image} contentFit="cover" />
        {deal.aiRecommended ? (
          <View style={styles.badge}>
            <StatusChip label="AI pick" tone="good" />
          </View>
        ) : null}
        {deal.discount ? (
          <View style={styles.discount}>
            <AppText style={styles.discountText}>{deal.discount}% off</AppText>
          </View>
        ) : null}
      </View>
      <View style={styles.body}>
        <AppText variant="title" numberOfLines={1}>
          {deal.name}
        </AppText>
        <AppText variant="caption" numberOfLines={1}>
          {deal.dealer}
        </AppText>
        <View style={styles.footer}>
          <View>
            <AppText variant="h2">₹{deal.price.toLocaleString('en-IN')}</AppText>
            {deal.mrp ? (
              <AppText variant="caption" style={styles.mrp}>
                ₹{deal.mrp.toLocaleString('en-IN')}
              </AppText>
            ) : null}
          </View>
          <PressableScale onPress={() => onBuy?.(deal)} style={styles.buy}>
            <AppText style={styles.buyText}>Buy</AppText>
          </PressableScale>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  image: { height: 120, width: '100%', backgroundColor: colors.background },
  badge: { position: 'absolute', top: 8, left: 8 },
  discount: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.accent,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  discountText: { color: colors.white, fontFamily: fonts.bold, fontSize: 11 },
  body: { padding: 12, gap: 4 },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  mrp: { textDecorationLine: 'line-through' },
  buy: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
  },
  buyText: { color: colors.white, fontFamily: fonts.bold, fontSize: 13 },
});
