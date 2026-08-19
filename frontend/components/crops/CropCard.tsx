import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  durationLabel,
  formatInr,
  pickText,
  priceSecurityHint,
  priceSecurityLabel,
  rankLabel,
  regionalName,
  waterLabel,
  type CropSort,
  type RankedCrop,
} from '@/constants/crops';
import { colors, fonts, radius } from '@/constants/theme';
import { useOptionalLocale } from '@/context/LocaleContext';
import { AppText, Button, Card, PressableScale, StatusChip } from '@/components/ui';

type Props = {
  crop: RankedCrop;
  index: number;
  sort: CropSort;
  onSelect: () => void;
};

export function CropCard({ crop, index, sort, onSelect }: Props) {
  const locale = useOptionalLocale()?.locale ?? 'en';
  const [open, setOpen] = useState(index === 0);
  const featured = index === 0;
  const msp = crop.mspSupported;
  const scoreTone = crop.score >= 88 ? 'good' : crop.score >= 75 ? 'fair' : 'watch';

  return (
    <Card style={featured ? styles.featured : undefined}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <View style={[styles.rank, featured && styles.rankOn]}>
            <AppText style={[styles.rankText, featured && styles.rankTextOn]}>
              {rankLabel(index, sort)}
            </AppText>
          </View>
          <StatusChip label={`${crop.score}% Soil & Climate Match`} tone={scoreTone} />
        </View>

        <AppText variant="h1">{crop.name.en}</AppText>
        <AppText variant="title" color={colors.textSecondary} style={styles.regional}>
          {regionalName(crop, locale)}
        </AppText>
        <AppText variant="title" color={colors.primaryDark}>
          Variety {crop.variety}
        </AppText>
      </View>

      <View style={styles.grid}>
        <Glance
          icon="cash-outline"
          label="Estimated net income"
          value={formatInr(crop.netIncomePerAcre)}
          hint="₹ / acre"
        />
        <Glance
          icon="time-outline"
          label="Growth duration"
          value={durationLabel(crop)}
          hint={crop.perennial ? 'Long / perennial' : 'Days to harvest'}
        />
        <Glance icon="water-outline" label="Water need" value={waterLabel(crop.waterNeed)} />
        <Glance
          icon={msp ? 'shield-checkmark-outline' : 'trending-up-outline'}
          label="Price security"
          value={priceSecurityLabel(crop)}
          hint={priceSecurityHint(crop)}
          tone={msp ? 'msp' : crop.marketDemand === 'high' ? 'demand' : 'plain'}
        />
      </View>

      {sort === 'input' ? (
        <AppText variant="caption" style={styles.inputNote}>
          Starting capital {formatInr(crop.inputCostPerAcre)} / acre for seed, fertilizer, and labour.
        </AppText>
      ) : null}

      <PressableScale onPress={() => setOpen((v) => !v)} style={styles.accordion}>
        <AppText variant="title">Why this crop?</AppText>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
      </PressableScale>

      {open ? (
        <View style={styles.why}>
          <AppText variant="body">{pickText(crop.why, locale)}</AppText>

          <AppText variant="label" style={styles.whyHead}>
            Soil nutrient match
          </AppText>
          <View style={styles.npk}>
            <NpkCell label="N" value={crop.npk.n} />
            <NpkCell label="P" value={crop.npk.p} />
            <NpkCell label="K" value={crop.npk.k} />
            <NpkCell label="pH" value={crop.npk.ph} />
          </View>
          <AppText variant="caption">{pickText(crop.soilMatch, locale)}</AppText>
          <AppText variant="caption">
            Terrain fit · {crop.topologyFit === 'strong' ? 'Strong' : 'Fair'} for this land shape
          </AppText>

          <AppText variant="label" style={styles.whyHead}>
            Required inputs
          </AppText>
          <AppText variant="caption">{pickText(crop.inputs, locale)}</AppText>
          <AppText variant="caption">
            Starting capital · {formatInr(crop.inputCostPerAcre)} / acre
          </AppText>

          <AppText variant="label" style={styles.whyHead}>
            Pest & climate risk
          </AppText>
          <AppText variant="caption">{pickText(crop.pestRisk, locale)}</AppText>
          <AppText variant="caption">
            Resilience · {crop.resilience === 'high' ? 'High' : crop.resilience === 'medium' ? 'Medium' : 'Low'}{' '}
            against dry spells, floods, and local pests
          </AppText>
        </View>
      ) : null}

      <Button title="Select for Detailed Yield & Revenue Analysis" onPress={onSelect} />
    </Card>
  );
}

function Glance({
  icon,
  label,
  value,
  hint,
  tone = 'plain',
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  hint?: string;
  tone?: 'plain' | 'msp' | 'demand';
}) {
  const iconColor = tone === 'demand' ? colors.accent : colors.primary;
  return (
    <View
      style={[
        styles.glance,
        tone === 'msp' && styles.glanceMsp,
        tone === 'demand' && styles.glanceDemand,
      ]}>
      <Ionicons name={icon} size={16} color={iconColor} />
      <AppText style={styles.glanceLabel}>{label}</AppText>
      <AppText style={styles.glanceValue}>{value}</AppText>
      {hint ? (
        <AppText style={[styles.glanceHint, tone === 'demand' && { color: colors.accent }]} numberOfLines={1}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

function NpkCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.npkCell}>
      <AppText style={styles.npkLabel}>{label}</AppText>
      <AppText style={styles.npkValue} numberOfLines={2}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  featured: {
    borderColor: colors.primary,
    borderWidth: 1.5,
    backgroundColor: colors.white,
  },
  header: { gap: 4 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 8 },
  rank: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  rankOn: { backgroundColor: colors.primary },
  rankText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.accent,
  },
  rankTextOn: { color: colors.white },
  regional: { fontFamily: fonts.semibold },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  glance: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    padding: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 96,
  },
  glanceMsp: {
    backgroundColor: colors.primarySoft,
    borderColor: '#C8E6C9',
  },
  glanceDemand: {
    backgroundColor: colors.accentSoft,
    borderColor: '#BBDEFB',
  },
  glanceLabel: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  glanceValue: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.text,
    lineHeight: 18,
  },
  glanceHint: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.primary,
  },
  inputNote: { marginTop: 10 },
  accordion: {
    marginTop: 14,
    marginBottom: 6,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  why: { gap: 8, marginBottom: 14 },
  whyHead: { marginTop: 6 },
  npk: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  npkCell: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 64,
  },
  npkLabel: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  npkValue: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.text,
    lineHeight: 16,
  },
});
