import { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { farms, type FarmPlot } from '@/constants/dummy';
import { colors, fonts, radius, shadows, spacing } from '@/constants/theme';
import { useLocale } from '@/context/LocaleContext';
import { AppText, Card, Metric, PressableScale, SelectableChip, StatusChip } from '@/components/ui';

export function FarmSwitcher() {
  const { t } = useLocale();
  const [activeId, setActiveId] = useState(farms[0].id);
  const [cardOpen, setCardOpen] = useState(false);
  const farm = farms.find((item) => item.id === activeId) ?? farms[0];
  const tested = farm.soilHealthCard.status === 'tested';

  const uploadCard = () => {
    Alert.alert(t('shcUploadTitle'), t('shcUploadBody'));
  };

  return (
    <View style={styles.block}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}>
        {farms.map((item) => (
          <SelectableChip
            key={item.id}
            label={`${item.shortName} · ${item.name.split(' ')[0]}`}
            selected={item.id === activeId}
            onPress={() => setActiveId(item.id)}
          />
        ))}
      </ScrollView>

      <Card>
        <AppText variant="label">{farm.shortName}</AppText>
        <AppText variant="h2" style={{ marginTop: 2 }}>
          {farm.name}
        </AppText>
        <AppText variant="caption" style={{ marginTop: 2 }}>
          {farm.size} {farm.unit}
        </AppText>

        <View style={styles.metrics}>
          <Metric label={t('surveyKhasra')} value={`${farm.surveyNo} · ${farm.khasraNo}`} />
          <Metric label={t('soilTypeLabel')} value={farm.soilType} />
        </View>
        <View style={[styles.metrics, { marginTop: 12 }]}>
          <Metric label={t('irrigation')} value={farm.irrigation} />
          <Metric
            label={t('soilHealthCard')}
            value={tested ? `${t('tested')} ${farm.soilHealthCard.testedOn}` : t('due')}
          />
        </View>

        <View style={styles.shc}>
          <View style={styles.shcHead}>
            <Ionicons name="document-text-outline" size={18} color={colors.primaryDark} />
            <View style={{ flex: 1 }}>
              <AppText variant="title">{t('soilHealthCard')}</AppText>
              <AppText variant="caption">
                {tested
                  ? `${t('tested')} ${farm.soilHealthCard.testedOn} · ${farm.soilHealthCard.lab}`
                  : t('shcDue')}
              </AppText>
            </View>
            <StatusChip label={tested ? t('tested') : t('due')} tone={tested ? 'good' : 'watch'} />
          </View>
          <View style={styles.shcActions}>
            <PressableScale onPress={() => setCardOpen(true)} style={styles.linkBtn}>
              <Ionicons name="eye-outline" size={16} color={colors.primaryDark} />
              <AppText variant="title" color={colors.primaryDark} style={styles.linkText}>
                {t('viewCard')}
              </AppText>
            </PressableScale>
            <PressableScale onPress={uploadCard} style={styles.linkBtn}>
              <Ionicons name="cloud-upload-outline" size={16} color={colors.primaryDark} />
              <AppText variant="title" color={colors.primaryDark} style={styles.linkText}>
                {t('uploadCard')}
              </AppText>
            </PressableScale>
          </View>
        </View>

        <View style={styles.history}>
          <AppText variant="label">{t('pastCrops')}</AppText>
          {farm.pastCrops.map((item) => (
            <View key={`${item.season}-${item.crop}`} style={styles.historyRow}>
              <View style={{ flex: 1 }}>
                <AppText variant="title">{item.crop}</AppText>
                <AppText variant="caption">{item.season}</AppText>
              </View>
              {item.yield ? <AppText variant="caption">{item.yield}</AppText> : null}
            </View>
          ))}
        </View>
      </Card>

      <SoilHealthCardModal farm={farm} visible={cardOpen} onClose={() => setCardOpen(false)} />
    </View>
  );
}

function SoilHealthCardModal({
  farm,
  visible,
  onClose,
}: {
  farm: FarmPlot;
  visible: boolean;
  onClose: () => void;
}) {
  const { t } = useLocale();
  const card = farm.soilHealthCard;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.overlay} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHead}>
            <AppText variant="h2">{t('shcViewTitle')}</AppText>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>
          <AppText variant="caption">{farm.name}</AppText>
          <View style={styles.sheetBody}>
            <Row label={t('shcId')} value={card.cardId} />
            <Row label={t('tested')} value={card.testedOn} />
            <Row label={t('shcLab')} value={card.lab} />
            <Row label={t('soilTypeLabel')} value={farm.soilType} />
            <Row label={t('surveyKhasra')} value={`${farm.surveyNo} · ${farm.khasraNo}`} />
          </View>
          <PressableScale onPress={onClose} style={styles.closeBtn}>
            <AppText variant="title" color={colors.white}>
              {t('close')}
            </AppText>
          </PressableScale>
        </View>
      </View>
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.sheetRow}>
      <AppText variant="caption">{label}</AppText>
      <AppText variant="title" style={{ textAlign: 'right', flex: 1, marginLeft: 12 }}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 12 },
  tabs: { gap: 8, paddingRight: 8 },
  metrics: { flexDirection: 'row', gap: 12, marginTop: 16 },
  shc: {
    marginTop: 16,
    padding: 12,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  shcHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  shcActions: { flexDirection: 'row', gap: 8 },
  linkBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  linkText: { fontFamily: fonts.semibold, fontSize: 13 },
  history: { marginTop: 16, gap: 10 },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlay },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: 12,
    ...shadows.floating,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetBody: { gap: 10, marginTop: 4 },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeBtn: {
    marginTop: 8,
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
