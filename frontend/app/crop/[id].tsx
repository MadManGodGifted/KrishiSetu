import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { CropThumb } from '@/components/crops/CropThumb';
import { ReportSection } from '@/components/crops/ReportSection';
import { AppText, Button, Header, Screen, Skeleton, StatusChip } from '@/components/ui';
import {
  buildYieldReport,
  durationLabel,
  formatInr,
  pickText,
  waterLabel,
} from '@/constants/crops';
import { riskFromResilience } from '@/constants/cropVisuals';
import { getCropMarket } from '@/constants/market';
import { colors, fonts, radius } from '@/constants/theme';
import { useLocale } from '@/context/LocaleContext';
import { getRankedCrop, getRecommendSnapshot } from '@/lib/recommendStore';

export default function CropDetailsScreen() {
  const router = useRouter();
  const { locale } = useLocale();
  const params = useLocalSearchParams<{ id?: string }>();
  const cropId = typeof params.id === 'string' ? params.id : 'wheat-hd2967';

  const snap = useMemo(() => getRecommendSnapshot(), []);
  const crop = useMemo(() => getRankedCrop(cropId), [cropId]);
  const acres = snap.acres;
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState('overview');

  useEffect(() => {
    setReady(false);
    let alive = true;
    const frame = requestAnimationFrame(() => {
      if (alive) setReady(true);
    });
    const fallback = setTimeout(() => {
      if (alive) setReady(true);
    }, 80);
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      clearTimeout(fallback);
    };
  }, [cropId]);

  const report = useMemo(
    () => (ready ? buildYieldReport(crop.id, acres, snap.season) : null),
    [ready, crop.id, acres, snap.season],
  );
  const schemes = useMemo(() => {
    if (!ready) return [];
    const market = getCropMarket(crop.id);
    return market?.schemes?.length
      ? market.schemes
      : [
          { name: 'PM-KISAN', hint: '₹6,000 / year in 3 instalments' },
          { name: 'PMFBY', hint: 'Crop insurance against yield loss' },
        ];
  }, [ready, crop.id]);

  const risk = riskFromResilience(crop.resilience);
  const toggle = (key: string) => setOpen((cur) => (cur === key ? '' : key));
  const farmProfit = Math.round(crop.netIncomePerAcre * acres);
  const farmInvest = Math.round(crop.inputCostPerAcre * acres);

  return (
    <Screen>
      <Header title="Crop details" subtitle={pickText(crop.name, locale)} showBack />

      <View style={styles.hero}>
        <CropThumb cropId={crop.id} name={crop.name.en} size={84} radius={20} />
        <View style={styles.heroText}>
          <AppText variant="h1" numberOfLines={1}>
            {crop.name.en}
          </AppText>
          <AppText variant="title" color={colors.primaryDark} numberOfLines={1}>
            {crop.variety}
          </AppText>
          <View style={styles.badges}>
            <StatusChip label={`${crop.score}% match`} tone="good" />
            <StatusChip label={risk.label} tone={risk.tone} />
            {crop.mspSupported ? <StatusChip label="MSP" tone="good" /> : null}
          </View>
        </View>
      </View>

      <View style={styles.glance}>
        <Glance label="Profit" value={formatInr(crop.netIncomePerAcre)} hint="/ acre" />
        <Glance label="Water" value={waterLabel(crop.waterNeed)} />
        <Glance label="Duration" value={durationLabel(crop)} />
      </View>

      {!ready ? (
        <View style={{ gap: 12 }}>
          <Skeleton height={72} />
          <Skeleton height={72} />
          <Skeleton height={72} />
        </View>
      ) : (
        <>
          <ReportSection
            icon="information-circle-outline"
            title="Overview"
            summary={pickText(crop.why, locale)}
            open={open === 'overview'}
            onToggle={() => toggle('overview')}>
            <AppText variant="body">{pickText(crop.why, locale)}</AppText>
            <AppText variant="caption">
              {crop.name.hi} · {crop.name.mr}
            </AppText>
          </ReportSection>

          <ReportSection
            icon="cash-outline"
            title="Expected profit"
            summary={`${formatInr(crop.netIncomePerAcre)} / acre`}
            open={open === 'profit'}
            onToggle={() => toggle('profit')}>
            <Row label="Profit / acre" value={formatInr(crop.netIncomePerAcre)} />
            <Row label={`For ${acres} acres`} value={formatInr(farmProfit)} />
            <Row label="Starting cost / acre" value={formatInr(crop.inputCostPerAcre)} />
            <Row label={`Cost for ${acres} acres`} value={formatInr(farmInvest)} />
            <Row label="Mandi price" value={`${formatInr(crop.mandiPrice)} / q`} />
            {crop.mspPrice ? <Row label="MSP" value={`${formatInr(crop.mspPrice)} / q`} /> : null}
          </ReportSection>

          <ReportSection
            icon="water-outline"
            title="Water requirement"
            summary={waterLabel(crop.waterNeed)}
            open={open === 'water'}
            onToggle={() => toggle('water')}>
            <Row label="Need" value={waterLabel(crop.waterNeed)} />
            <AppText variant="caption">
              {crop.waterNeed === 'low'
                ? 'Works on rain-fed or limited irrigation land.'
                : crop.waterNeed === 'high'
                  ? 'Needs reliable canal, drip, or frequent irrigation.'
                  : 'Needs 2–3 irrigations in a normal season.'}
            </AppText>
          </ReportSection>

          <ReportSection
            icon="trending-up-outline"
            title="Expected yield"
            summary={report ? `${report.perAcre} q / acre` : ''}
            open={open === 'yield'}
            onToggle={() => toggle('yield')}>
            {report ? (
              <>
                <Row label="Per acre" value={`${report.perAcre} quintals`} />
                <Row label="Your farm" value={`${report.expected} quintals`} />
                <Row label="Confidence" value={`${report.confidence}%`} />
                <Button
                  title="Open yield chart"
                  variant="secondary"
                  onPress={() =>
                    router.push({
                      pathname: '/yield',
                      params: { cropId: crop.id, acres: String(acres), season: snap.season },
                    })
                  }
                />
              </>
            ) : null}
          </ReportSection>

          <ReportSection
            icon="bug-outline"
            title="Disease risk"
            summary={risk.label}
            open={open === 'risk'}
            onToggle={() => toggle('risk')}>
            <AppText variant="body">{pickText(crop.pestRisk, locale)}</AppText>
          </ReportSection>

          <ReportSection
            icon="ribbon-outline"
            title="Government schemes"
            summary={`${schemes.length} schemes`}
            open={open === 'schemes'}
            onToggle={() => toggle('schemes')}>
            {schemes.map((scheme) => (
              <View key={scheme.name} style={styles.scheme}>
                <AppText variant="title">{scheme.name}</AppText>
                <AppText variant="caption">{scheme.hint}</AppText>
              </View>
            ))}
          </ReportSection>

          <ReportSection
            icon="sparkles-outline"
            title="AI recommendation"
            summary={`${crop.score}% match for your farm`}
            open={open === 'ai'}
            onToggle={() => toggle('ai')}>
            <AppText variant="body">{pickText(crop.why, locale)}</AppText>
            <Row label="Match score" value={`${crop.score}%`} />
          </ReportSection>

          <Button
            title="Market Buyers"
            variant="secondary"
            icon={<Ionicons name="storefront-outline" size={18} color={colors.primary} />}
            onPress={() => router.push({ pathname: '/crop/buyers', params: { id: crop.id } })}
          />
        </>
      )}
    </Screen>
  );
}

function Glance({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <View style={styles.glanceItem}>
      <AppText style={styles.glanceLabel} numberOfLines={1}>
        {label}
      </AppText>
      <AppText style={styles.glanceValue} numberOfLines={1}>
        {value}
      </AppText>
      {hint ? (
        <AppText style={styles.glanceHint} numberOfLines={1}>
          {hint}
        </AppText>
      ) : null}
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
  hero: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  heroText: { flex: 1, minWidth: 0, gap: 4 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  glance: { flexDirection: 'row', gap: 8 },
  glanceItem: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  glanceLabel: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  glanceValue: { fontFamily: fonts.extrabold, fontSize: 16, color: colors.text, marginTop: 4 },
  glanceHint: { fontFamily: fonts.medium, fontSize: 11, color: colors.primary },
  scheme: { gap: 2 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  rowLabel: { width: 120, flexShrink: 0 },
  rowValue: { flex: 1, minWidth: 0, fontSize: 15 },
});
