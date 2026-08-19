import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { CropThumb } from '@/components/crops/CropThumb';
import {
  durationLabel,
  formatInr,
  waterLabel,
  type RankedCrop,
} from '@/constants/crops';
import { riskFromResilience, waterIcon } from '@/constants/cropVisuals';
import { colors, fonts, radius } from '@/constants/theme';
import { AppText, Card, PressableScale, StatusChip } from '@/components/ui';

type Props = {
  crop: RankedCrop;
  best?: boolean;
  onDetails: () => void;
  onBuyers: () => void;
};

export function CropCard({ crop, best, onDetails, onBuyers }: Props) {
  const risk = riskFromResilience(crop.resilience);
  const scoreTone = crop.score >= 88 ? 'good' : crop.score >= 75 ? 'fair' : 'watch';

  return (
    <Card>
      <View style={styles.top}>
        <CropThumb cropId={crop.id} name={crop.name.en} size={72} />
        <View style={styles.identity}>
          <AppText variant="h2" numberOfLines={1}>
            {crop.name.en}
          </AppText>
          <View style={styles.badges}>
            <StatusChip label={`${crop.score}% match`} tone={scoreTone} />
            <StatusChip label={risk.label} tone={risk.tone} />
            {crop.mspSupported ? <StatusChip label="MSP" tone="good" /> : null}
            {best ? <StatusChip label="Best for you" tone="good" /> : null}
          </View>
        </View>
      </View>

      <View style={styles.metrics}>
        <Metric icon="cash-outline" label="Profit" value={formatInr(crop.netIncomePerAcre)} hint="/ acre" />
        <Metric icon={waterIcon(crop.waterNeed)} label="Water" value={waterLabel(crop.waterNeed)} />
        <Metric icon="time-outline" label="Duration" value={durationLabel(crop)} />
      </View>

      <View style={styles.actions}>
        <PressableScale onPress={onDetails} style={[styles.btn, styles.btnPrimary]}>
          <AppText style={styles.btnPrimaryText} numberOfLines={1}>
            View Details
          </AppText>
        </PressableScale>
        <PressableScale onPress={onBuyers} style={styles.btn}>
          <Ionicons name="storefront-outline" size={18} color={colors.primaryDark} />
          <AppText style={styles.btnText} numberOfLines={1}>
            Market Buyers
          </AppText>
        </PressableScale>
      </View>
    </Card>
  );
}

function Metric({
  icon,
  label,
  value,
  hint,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <View style={styles.metric}>
      <Ionicons name={icon} size={16} color={colors.primary} />
      <AppText style={styles.metricLabel} numberOfLines={1}>
        {label}
      </AppText>
      <AppText style={styles.metricValue} numberOfLines={1}>
        {value}
      </AppText>
      {hint ? (
        <AppText style={styles.metricHint} numberOfLines={1}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  identity: { flex: 1, minWidth: 0, gap: 6 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  metrics: { flexDirection: 'row', gap: 8, marginTop: 14 },
  metric: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    padding: 10,
    gap: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricLabel: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  metricValue: { fontFamily: fonts.bold, fontSize: 13, color: colors.text },
  metricHint: { fontFamily: fonts.medium, fontSize: 11, color: colors.primary },
  actions: { flexDirection: 'row', gap: 8, marginTop: 14 },
  btn: {
    flex: 1,
    minWidth: 0,
    minHeight: 52,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  btnPrimary: { backgroundColor: colors.primary, borderColor: colors.primary },
  btnPrimaryText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
  btnText: { fontFamily: fonts.bold, fontSize: 13, color: colors.primaryDark, flexShrink: 1 },
});
