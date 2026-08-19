import { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, ScrollView, Share, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConfidenceMeter } from '@/components/charts/ConfidenceMeter';
import { YieldChart } from '@/components/charts/YieldChart';
import { GovTopBar } from '@/components/gov/GovTopBar';
import { AppText, Card, Metric, PressableScale, SelectableChip, StatusChip } from '@/components/ui';
import {
  buildYieldReport,
  formatInr,
  pickText,
  yieldSpeechSummary,
  type Season,
} from '@/constants/crops';
import { farmer } from '@/constants/dummy';
import { colors, fonts, radius } from '@/constants/theme';
import { useLocale } from '@/context/LocaleContext';

export default function YieldScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, locale } = useLocale();
  const params = useLocalSearchParams<{ cropId?: string; acres?: string; season?: string }>();
  const cropId = typeof params.cropId === 'string' ? params.cropId : 'wheat-hd2967';
  const acres = params.acres ? Number(params.acres) : farmer.farmSize;
  const season = (params.season as Season) || 'Rabi';
  const report = useMemo(() => buildYieldReport(cropId, acres, season), [cropId, acres, season]);
  const [seriesId, setSeriesId] = useState(report.crop.id);

  useEffect(() => {
    setSeriesId(report.crop.id);
  }, [report.crop.id]);

  const series = seriesId === report.crop.id ? report.chart : report.previous.find((item) => item.id === seriesId) ?? report.chart;
  const speech = yieldSpeechSummary(report, locale);

  const mspDelta =
    report.mspRevenue != null ? report.mspRevenue - report.mandiRevenue : null;
  const mspBetter = mspDelta != null && mspDelta > 0;

  const shareText = [
    t('reportFor'),
    `${pickText(report.crop.name, locale)} — ${report.crop.variety}`,
    `${t('expectedYield')}: ${report.expected} ${t('quintals')} (${report.perAcre} ${t('perAcre')})`,
    `${t('mandiRevenue')}: ${formatInr(report.mandiRevenue)}`,
    report.crop.mspPrice
      ? `${t('mspRate')}: ${formatInr(report.crop.mspPrice)} / q · ${t('mspRevenue')}: ${formatInr(report.mspRevenue ?? 0)}`
      : t('noMsp'),
    `${farmer.name} · ${farmer.location} · ${report.acres} ${t('acres')}`,
  ].join('\n');

  const downloadPdf = () => {
    router.push({
      pathname: '/report',
      params: { type: 'yield', cropId, acres: String(acres), season },
    });
  };

  const shareWhatsapp = async () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    try {
      const can = await Linking.canOpenURL(url);
      if (can) {
        await Linking.openURL(url);
        return;
      }
    } catch {
      /* fall through */
    }
    try {
      await Share.share({ message: shareText, title: t('shareTitle') });
    } catch {
      Alert.alert(t('shareWhatsapp'), shareText);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <GovTopBar speechText={speech} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.toolbar}>
          <PressableScale onPress={() => router.back()} style={styles.back}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </PressableScale>
          <View style={styles.titles}>
            <AppText variant="h2" numberOfLines={1}>
              {t('yieldTitle')}
            </AppText>
            <AppText variant="caption" numberOfLines={1}>
              {report.seasonLabel}
            </AppText>
          </View>
        </View>
        <View style={styles.actions}>
          <PressableScale onPress={downloadPdf} style={styles.toolBtn}>
            <Ionicons name="download-outline" size={16} color={colors.primaryDark} />
            <AppText style={styles.toolLabel} numberOfLines={1}>
              {t('downloadPdf')}
            </AppText>
          </PressableScale>
          <PressableScale onPress={shareWhatsapp} style={[styles.toolBtn, styles.wa]}>
            <Ionicons name="logo-whatsapp" size={16} color={colors.white} />
            <AppText style={[styles.toolLabel, { color: colors.white }]} numberOfLines={1}>
              {t('shareWhatsapp')}
            </AppText>
          </PressableScale>
        </View>

        <Card>
          <AppText variant="label">{t('cropVariety')}</AppText>
          <AppText variant="h1" style={{ marginTop: 4 }} numberOfLines={2}>
            {pickText(report.crop.name, locale)}
          </AppText>
          <AppText variant="h2" color={colors.primaryDark}>
            {report.crop.variety}
          </AppText>
          <AppText variant="caption" style={{ marginTop: 4 }}>
            {report.crop.name.en} · {report.crop.name.hi} · {report.crop.name.mr}
          </AppText>

          <AppText variant="label" style={{ marginTop: 18 }}>
            {t('expectedYield')}
          </AppText>
          <View style={styles.hero}>
            <AppText variant="display">{report.expected}</AppText>
            <AppText variant="h2" color={colors.textSecondary}>
              {t('quintals')}
            </AppText>
          </View>
          <AppText variant="caption">
            {report.perAcre} {t('perAcre')} · {report.acres} {t('acres')} · {report.seasonLabel}
          </AppText>

          <View style={styles.split}>
            <Metric label={t('revenue')} value={formatInr(report.mandiRevenue)} hint={t('mandiRevenue')} />
            <StatusChip label={t('onTrack')} tone="good" />
          </View>

          <View style={styles.calc}>
            <AppText variant="label">{t('revenueCalc')}</AppText>
            <AppText variant="body" style={{ marginTop: 6 }}>
              {report.perAcre} × {report.acres} {t('acres')} = {report.expected} {t('quintals')}
            </AppText>
            <AppText variant="body">
              {report.expected} × {formatInr(report.crop.mandiPrice)} ({t('mandiRate')}) ={' '}
              {formatInr(report.mandiRevenue)}
            </AppText>
            {report.crop.mspPrice && report.mspRevenue != null ? (
              <AppText variant="body">
                {report.expected} × {formatInr(report.crop.mspPrice)} ({t('mspRate')}) ={' '}
                {formatInr(report.mspRevenue)}
              </AppText>
            ) : null}

            <View style={styles.mspBox}>
              <AppText variant="label">{t('vsMsp')}</AppText>
              {report.crop.mspPrice && mspDelta != null ? (
                <>
                  <View style={styles.mspRow}>
                    <AppText variant="caption">{t('mandiRevenue')}</AppText>
                    <AppText variant="title">{formatInr(report.mandiRevenue)}</AppText>
                  </View>
                  <View style={styles.mspRow}>
                    <AppText variant="caption">{t('mspRevenue')}</AppText>
                    <AppText variant="title" color={mspBetter ? colors.primary : colors.text}>
                      {formatInr(report.mspRevenue ?? 0)}
                    </AppText>
                  </View>
                  <StatusChip
                    label={mspBetter ? `MSP +${formatInr(mspDelta)}` : `Mandi +${formatInr(Math.abs(mspDelta))}`}
                    tone={mspBetter ? 'fair' : 'good'}
                  />
                  <AppText variant="caption">{mspBetter ? t('belowMsp') : t('aboveMsp')}</AppText>
                </>
              ) : (
                <AppText variant="caption" style={{ marginTop: 6 }}>
                  {t('noMsp')}
                </AppText>
              )}
            </View>
          </View>
        </Card>

        <Card>
          <AppText variant="h2">{t('yieldTrend')}</AppText>
          <AppText variant="caption" style={{ marginBottom: 10 }}>
            {t('yieldTrendHint')}
          </AppText>
          <AppText variant="label" style={{ marginBottom: 8 }}>
            {t('previousCrops')}
          </AppText>
          <View style={styles.chips}>
            <SelectableChip
              label={`${t('thisCrop')} · ${pickText(report.crop.name, locale)}`}
              selected={seriesId === report.crop.id}
              onPress={() => setSeriesId(report.crop.id)}
            />
            {report.previous.map((item) => (
              <SelectableChip
                key={item.id}
                label={pickText(item.name, locale)}
                selected={seriesId === item.id}
                onPress={() => setSeriesId(item.id)}
              />
            ))}
          </View>
          <AppText variant="caption" style={{ marginVertical: 8 }}>
            {t('tapPoint')}
          </AppText>
          <YieldChart
            labels={series.labels}
            values={series.values}
            years={series.years}
            yLabel={t('yAxis')}
          />
        </Card>

        <View style={styles.risks}>
          <Card style={styles.riskCard}>
            <View style={styles.riskHead}>
              <Ionicons name="leaf-outline" size={18} color={colors.primary} />
              <AppText variant="label">{t('soilRisk')}</AppText>
            </View>
            <AppText variant="body" style={{ marginTop: 8 }}>
              {pickText(report.crop.soilAdvisory, locale)}
            </AppText>
          </Card>
          <Card style={styles.riskCard}>
            <View style={styles.riskHead}>
              <Ionicons name="cloudy-outline" size={18} color={colors.accent} />
              <AppText variant="label">{t('weatherRisk')}</AppText>
            </View>
            <AppText variant="body" style={{ marginTop: 8 }}>
              {pickText(report.crop.weatherAdvisory, locale)}
            </AppText>
          </Card>
        </View>

        <Card>
          <AppText variant="h2">{t('schedule')}</AppText>
          <View style={{ marginTop: 12, gap: 12 }}>
            {report.crop.schedule.map((step, index) => (
              <View key={`${index}`} style={styles.step}>
                <View style={styles.dot} />
                {index < report.crop.schedule.length - 1 ? <View style={styles.line} /> : null}
                <View style={{ flex: 1 }}>
                  <AppText variant="label">{pickText(step.when, locale)}</AppText>
                  <AppText variant="body">{pickText(step.action, locale)}</AppText>
                </View>
              </View>
            ))}
          </View>
        </Card>

        <Card>
          <View style={styles.meter}>
            <ConfidenceMeter value={report.confidence} caption={t('confidence')} />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 36, gap: 16 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titles: { flex: 1, minWidth: 0 },
  back: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { flexDirection: 'row', gap: 8 },
  toolBtn: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 10,
    minHeight: 44,
  },
  wa: {
    backgroundColor: '#128C7E',
    borderColor: '#128C7E',
  },
  toolLabel: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.primaryDark,
    flexShrink: 1,
  },
  hero: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 4, marginBottom: 6 },
  split: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  calc: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  mspBox: {
    marginTop: 12,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mspRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  risks: { gap: 12 },
  riskCard: { flex: 1 },
  riskHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  step: {
    flexDirection: 'row',
    gap: 12,
    position: 'relative',
    paddingLeft: 4,
    minHeight: 56,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  line: {
    position: 'absolute',
    left: 9,
    top: 18,
    bottom: -12,
    width: 2,
    backgroundColor: colors.primarySoft,
  },
  meter: { alignItems: 'center', paddingVertical: 8 },
});
