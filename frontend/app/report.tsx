import { useMemo } from 'react';
import { Alert, Platform, ScrollView, Share, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PdfFrame } from '@/components/reports/PdfFrame';
import { AppText, PressableScale } from '@/components/ui';
import { buildYieldReport, formatInr, pickText, type Season } from '@/constants/crops';
import { farmer } from '@/constants/dummy';
import { getCropMarket, overlayContract, type CropContract } from '@/constants/market';
import { colors, fonts, radius } from '@/constants/theme';
import { useLocale } from '@/context/LocaleContext';
import { buildContractHtml, buildYieldReportHtml, printHtml } from '@/lib/pdf';

export default function ReportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { locale, t } = useLocale();
  const params = useLocalSearchParams<{
    type?: string;
    cropId?: string;
    acres?: string;
    season?: string;
    buyer?: string;
    quantity?: string;
    price?: string;
    pickup?: string;
    earnings?: string;
    agreementNo?: string;
  }>();

  const type = params.type === 'contract' ? 'contract' : 'yield';
  const cropId = typeof params.cropId === 'string' ? params.cropId : 'wheat-hd2967';
  const acres = params.acres ? Number(params.acres) : farmer.farmSize;
  const season = (params.season as Season) || 'Rabi';
  const report = useMemo(() => buildYieldReport(cropId, acres, season), [cropId, acres, season]);
  const market = getCropMarket(report.crop.id);
  const cropName = pickText(report.crop.name, locale);
  const earnings = typeof params.earnings === 'string' ? params.earnings : undefined;
  const contract =
    overlayContract(report.crop.id, {
      buyer: typeof params.buyer === 'string' ? params.buyer : undefined,
      quantity: typeof params.quantity === 'string' ? params.quantity : undefined,
      price: typeof params.price === 'string' ? params.price : undefined,
      pickup: params.pickup ? params.pickup === '1' : undefined,
      agreementNo: typeof params.agreementNo === 'string' ? params.agreementNo : undefined,
    }) ?? market?.contract;

  const html = useMemo(() => {
    if (type === 'contract' && contract) {
      return buildContractHtml({
        cropName,
        variety: report.crop.variety,
        acres,
        contract,
        expectedEarnings: earnings,
      });
    }
    return buildYieldReportHtml(report, locale);
  }, [type, contract, cropName, acres, report, locale, earnings]);

  const title = type === 'contract' ? 'Sample contract' : t('reportFor');

  const download = () => {
    const printed = printHtml(html);
    if (!printed) {
      Alert.alert(t('downloadPdf'), t('pdfHint'));
    }
  };

  const share = async () => {
    const text =
      type === 'contract' && contract
        ? [
            'Krishi Setu sample contract',
            `${farmer.name} · ${contract.buyer}`,
            `${cropName} ${report.crop.variety}`,
            contract.quantity,
            contract.price,
            earnings ? `Expected earnings ${earnings}` : '',
            contract.agreementNo,
          ]
            .filter(Boolean)
            .join('\n')
        : [
            t('reportFor'),
            `${cropName} — ${report.crop.variety}`,
            `${t('expectedYield')}: ${report.expected} ${t('quintals')}`,
            `${t('mandiRevenue')}: ${formatInr(report.mandiRevenue)}`,
          ].join('\n');
    try {
      await Share.share({ message: text, title });
    } catch {
      Alert.alert(title, text);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.toolbar}>
        <PressableScale onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </PressableScale>
        <View style={styles.titles}>
          <AppText variant="h2" numberOfLines={1}>
            {title}
          </AppText>
          <AppText variant="caption" numberOfLines={1}>
            {cropName} · A4 portrait
          </AppText>
        </View>
      </View>
      <View style={styles.actions}>
        <PressableScale onPress={download} style={[styles.action, styles.primary]}>
          <Ionicons name="download-outline" size={18} color={colors.white} />
          <AppText style={styles.primaryText} numberOfLines={1}>
            Save PDF
          </AppText>
        </PressableScale>
        <PressableScale onPress={share} style={styles.action}>
          <Ionicons name="share-outline" size={18} color={colors.primaryDark} />
          <AppText style={styles.actionText} numberOfLines={1}>
            Share
          </AppText>
        </PressableScale>
      </View>

      {Platform.OS === 'web' ? (
        <PdfFrame html={html} />
      ) : (
        <NativePreview
          type={type}
          report={report}
          cropName={cropName}
          acres={acres}
          contract={contract}
          earnings={earnings}
        />
      )}
    </View>
  );
}

function NativePreview({
  type,
  report,
  cropName,
  acres,
  contract,
  earnings,
}: {
  type: string;
  report: ReturnType<typeof buildYieldReport>;
  cropName: string;
  acres: number;
  contract?: CropContract;
  earnings?: string;
}) {

  return (
    <ScrollView style={styles.stage} contentContainerStyle={styles.stageInner}>
      <View style={styles.page}>
        <View style={styles.tricolor}>
          <View style={[styles.stripe, { backgroundColor: '#FF9933' }]} />
          <View style={[styles.stripe, { backgroundColor: colors.white }]} />
          <View style={[styles.stripe, { backgroundColor: '#138808' }]} />
        </View>
        <AppText style={styles.brandHi}>कृषि सेतु</AppText>
        <AppText style={styles.brandEn}>Krishi Setu</AppText>
        <AppText variant="caption">Department of Agriculture & Farmers Welfare</AppText>
        <View style={styles.stamp}>
          <AppText style={styles.stampText}>SAMPLE</AppText>
        </View>

        <AppText variant="h2" style={{ marginTop: 16 }}>
          Farmer
        </AppText>
        <Line label="Name" value={farmer.name} />
        <Line label="Farmer ID" value={farmer.farmerId} />
        <Line label="Place" value={farmer.location} />
        <Line label="Farm size" value={`${acres} acres`} />

        <AppText variant="h2" style={{ marginTop: 16 }}>
          Crop
        </AppText>
        <Line label="Crop" value={cropName} />
        <Line label="Variety" value={report.crop.variety} />
        <Line label="Season" value={report.seasonLabel} />

        {type === 'contract' && contract ? (
          <>
            <AppText variant="h2" style={{ marginTop: 16 }}>
              Contract
            </AppText>
            <Line label="Agreement" value={contract.agreementNo} />
            <Line label="Buyer" value={contract.buyer} />
            <Line label="Quantity" value={contract.quantity} />
            <Line label="Grade" value={contract.grade} />
            <Line label="Price" value={contract.price} />
            {earnings ? <Line label="Expected earnings" value={earnings} /> : null}
            <Line label="Expires" value={contract.expiry} />
            <Line label="Pickup" value={contract.pickup ? 'Farm-gate pickup' : 'Farmer delivers'} />
            <AppText variant="caption" style={{ marginTop: 12 }}>
              This is a demonstration sample. It is not a legally binding contract.
            </AppText>
          </>
        ) : (
          <>
            <AppText variant="h2" style={{ marginTop: 16 }}>
              Expected yield
            </AppText>
            <Line label="Total" value={`${report.expected} quintals`} />
            <Line label="Per acre" value={`${report.perAcre} q`} />
            <Line label="Mandi revenue" value={formatInr(report.mandiRevenue)} />
            {report.crop.mspPrice ? <Line label="MSP" value={`${formatInr(report.crop.mspPrice)} / q`} /> : null}
            <AppText variant="caption" style={{ marginTop: 12 }}>
              {report.perAcre} × {acres} acres = {report.expected} quintals. Confidence {report.confidence}%.
            </AppText>
          </>
        )}
      </View>
    </ScrollView>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.line}>
      <AppText variant="caption" style={styles.lineLabel} numberOfLines={2}>
        {label}
      </AppText>
      <AppText variant="title" style={styles.lineValue} numberOfLines={4}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#5c6560' },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titles: { flex: 1, minWidth: 0 },
  actions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  action: {
    flex: 1,
    minWidth: 0,
    minHeight: 48,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  primaryText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white, flexShrink: 1 },
  actionText: { fontFamily: fonts.bold, fontSize: 14, color: colors.primaryDark, flexShrink: 1 },
  stage: { flex: 1, backgroundColor: '#5c6560' },
  stageInner: { padding: 16, paddingBottom: 40 },
  page: {
    backgroundColor: colors.white,
    borderRadius: 4,
    padding: 20,
    maxWidth: 720,
    alignSelf: 'center',
    width: '100%',
  },
  tricolor: { flexDirection: 'row', height: 6, marginBottom: 12 },
  stripe: { flex: 1 },
  brandHi: { fontFamily: fonts.extrabold, fontSize: 18, color: colors.text },
  brandEn: { fontFamily: fonts.bold, fontSize: 22, color: '#0B3D91', marginBottom: 2 },
  stamp: {
    alignSelf: 'flex-start',
    marginTop: 10,
    borderWidth: 2,
    borderColor: colors.primaryDark,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stampText: { fontFamily: fonts.extrabold, fontSize: 11, color: colors.primaryDark, letterSpacing: 1 },
  line: { flexDirection: 'row', gap: 12, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border },
  lineLabel: { width: 110, flexShrink: 0 },
  lineValue: { flex: 1, minWidth: 0, fontSize: 15 },
});
