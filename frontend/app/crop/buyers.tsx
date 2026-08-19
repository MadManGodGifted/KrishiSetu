import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { CropThumb } from '@/components/crops/CropThumb';
import { AppText, Button, Card, Header, Input, Screen, SelectableChip, StatusChip } from '@/components/ui';
import { formatInr, pickText } from '@/constants/crops';
import {
  CONTRACT_QTY_PRESETS,
  expectedEarnings,
  formatSalePrice,
  getCropMarket,
  overlayContract,
  salePriceForCrop,
} from '@/constants/market';
import { colors, fonts, radius } from '@/constants/theme';
import { useLocale } from '@/context/LocaleContext';
import { getLiveApmcPrice } from '@/lib/marketCache';
import { getRankedCrop, getRecommendSnapshot } from '@/lib/recommendStore';

export default function MarketBuyersScreen() {
  const router = useRouter();
  const { locale } = useLocale();
  const params = useLocalSearchParams<{ id?: string }>();
  const cropId = typeof params.id === 'string' ? params.id : 'wheat-hd2967';

  const snap = useMemo(() => getRecommendSnapshot(), []);
  const crop = useMemo(() => getRankedCrop(cropId), [cropId]);
  const market = useMemo(() => getCropMarket(crop.id), [crop.id]);
  const buyers = market?.buyers ?? [];

  const liveToday = getLiveApmcPrice(crop.id);
  const price = salePriceForCrop(crop.id, liveToday, crop.mandiPrice);
  const apmc = market?.apmc;

  const defaultBuyer = buyers.find((item) => item.contractFarming) ?? buyers[0];
  const [buyerId, setBuyerId] = useState(defaultBuyer?.id ?? '');
  const [preset, setPreset] = useState<(typeof CONTRACT_QTY_PRESETS)[number] | 'custom'>(5);
  const [customQty, setCustomQty] = useState('5');
  const [pickup, setPickup] = useState(market?.contract?.pickup ?? true);

  const tonnes = preset === 'custom' ? Math.max(0, Number(customQty) || 0) : preset;
  const earnings = expectedEarnings(tonnes, price);
  const buyer = buyers.find((item) => item.id === buyerId) ?? defaultBuyer;
  const canContract = Boolean(buyer) && tonnes > 0;

  const generate = () => {
    if (!buyer || !canContract) return;
    const contract = overlayContract(crop.id, {
      buyer: buyer.name,
      quantity: `${tonnes} tonnes`,
      price: formatSalePrice(price),
      pickup,
      agreementNo: `KS-CF-2026-${String(tonnes).padStart(2, '0')}${buyer.id.slice(0, 3).toUpperCase()}`,
    });
    router.push({
      pathname: '/report',
      params: {
        type: 'contract',
        cropId: crop.id,
        acres: String(snap.acres),
        season: snap.season,
        buyer: buyer.name,
        quantity: `${tonnes} tonnes`,
        price: formatSalePrice(price),
        pickup: pickup ? '1' : '0',
        earnings: formatInr(earnings),
        agreementNo: contract?.agreementNo,
      },
    });
  };

  return (
    <Screen>
      <Header title="Market Buyers" subtitle={pickText(crop.name, locale)} showBack />

      <View style={styles.hero}>
        <CropThumb cropId={crop.id} name={crop.name.en} size={56} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <AppText variant="h2" numberOfLines={1}>
            {crop.name.en}
          </AppText>
          <AppText variant="caption" numberOfLines={1}>
            {crop.variety} · {snap.season}
          </AppText>
        </View>
      </View>

      <Card>
        <View style={styles.sectionHead}>
          <Ionicons name="pricetag-outline" size={18} color={colors.primary} />
          <AppText variant="title">Today’s APMC price</AppText>
        </View>
        <AppText variant="h1">{formatSalePrice(price)}</AppText>
        <AppText variant="caption" style={{ marginTop: 4 }}>
          {apmc?.name ?? 'Local mandi'}
        </AppText>
        {apmc ? (
          <View style={styles.apmcRow}>
            <Mini label="Yesterday" value={formatInr(apmc.yesterday)} />
            <Mini label="Weekly" value={apmc.weekly} />
          </View>
        ) : null}
      </Card>

      <AppText variant="h2">Nearby buyers</AppText>
      {buyers.length === 0 ? (
        <Card>
          <AppText variant="title">No buyers nearby yet</AppText>
          <AppText variant="caption" style={{ marginTop: 6 }}>
            Check the APMC price and try again after harvest planning.
          </AppText>
        </Card>
      ) : (
        buyers.map((item) => {
          const selected = item.id === buyerId;
          return (
            <Card key={item.id} onPress={() => setBuyerId(item.id)} style={selected ? styles.buyerOn : undefined}>
              <View style={styles.buyerTop}>
                <AppText variant="title" style={{ flex: 1 }} numberOfLines={1}>
                  {item.name}
                </AppText>
                {item.contractFarming ? <StatusChip label="Contract" tone="good" /> : null}
              </View>
              <Row label="Need" value={`${item.needTons} tonnes`} />
              <Row label="Distance" value={`${item.distanceKm} km`} />
              <Row label="Model" value={item.model} />
              <AppText variant="caption">
                {item.priceNote} · {item.updated}
              </AppText>
            </Card>
          );
        })
      )}

      <Card>
        <View style={styles.sectionHead}>
          <Ionicons name="document-text-outline" size={18} color={colors.primary} />
          <AppText variant="title">Smart contract</AppText>
        </View>

        {!buyer ? (
          <AppText variant="caption">Add a nearby buyer to generate a sample contract.</AppText>
        ) : (
          <View style={{ gap: 14 }}>
            <Row label="Buyer" value={buyer.name} />

            <View style={{ gap: 8 }}>
              <AppText variant="label">Quantity</AppText>
              <View style={styles.chips}>
                {CONTRACT_QTY_PRESETS.map((qty) => (
                  <SelectableChip
                    key={qty}
                    label={`${qty} t`}
                    selected={preset === qty}
                    onPress={() => {
                      setPreset(qty);
                      setCustomQty(String(qty));
                    }}
                  />
                ))}
                <SelectableChip
                  label="Custom"
                  selected={preset === 'custom'}
                  onPress={() => setPreset('custom')}
                />
              </View>
              {preset === 'custom' ? (
                <Input
                  label="Tonnes"
                  value={customQty}
                  onChangeText={setCustomQty}
                  keyboardType="numeric"
                  placeholder="Enter quantity"
                  suffix={<AppText variant="caption">tonnes</AppText>}
                />
              ) : (
                <AppText variant="caption">{preset} tonnes</AppText>
              )}
            </View>

            <Row label="Price" value={formatSalePrice(price)} />

            <View style={{ gap: 8 }}>
              <AppText variant="label">Pickup type</AppText>
              <View style={styles.chips}>
                <SelectableChip label="Farm-gate pickup" selected={pickup} onPress={() => setPickup(true)} />
                <SelectableChip label="I will deliver" selected={!pickup} onPress={() => setPickup(false)} />
              </View>
            </View>

            <View style={styles.earn}>
              <AppText variant="label">Expected earnings</AppText>
              <AppText variant="h1">{formatInr(earnings)}</AppText>
              <AppText variant="caption">
                {tonnes || 0} tonnes · {formatSalePrice(price)}
              </AppText>
            </View>

            <Button
              title="Generate Smart Contract"
              disabled={!canContract}
              icon={<Ionicons name="document-text" size={18} color={colors.white} />}
              onPress={generate}
            />
          </View>
        )}
      </Card>
    </Screen>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.mini}>
      <AppText style={styles.miniLabel}>{label}</AppText>
      <AppText style={styles.miniValue}>{value}</AppText>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <AppText variant="caption" style={styles.rowLabel} numberOfLines={2}>
        {label}
      </AppText>
      <AppText variant="title" style={styles.rowValue} numberOfLines={3}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  apmcRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  mini: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  miniLabel: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  miniValue: { fontFamily: fonts.bold, fontSize: 15, color: colors.text, marginTop: 2 },
  buyerTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  buyerOn: { borderColor: colors.primary, borderWidth: 1.5 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  earn: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    padding: 14,
    gap: 2,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  rowLabel: { width: 110, flexShrink: 0 },
  rowValue: { flex: 1, minWidth: 0, fontSize: 15 },
});
