import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { farmer } from '@/constants/dummy';
import { colors } from '@/constants/theme';
import { useLocale } from '@/context/LocaleContext';
import { AppText, StatusChip } from '@/components/ui';

export function VerifiedBadge() {
  const { t } = useLocale();
  const { pmKisan, aadhaar, aadhaarLast4 } = farmer.verification;
  const verified = pmKisan || aadhaar;

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <View style={[styles.shield, !verified && styles.shieldOff]}>
          <Ionicons
            name={verified ? 'shield-checkmark' : 'shield-outline'}
            size={16}
            color={verified ? colors.white : colors.textMuted}
          />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="title">{t('officialVerified')}</AppText>
          <AppText variant="caption">
            {t('farmerId')} {farmer.farmerId}
          </AppText>
        </View>
      </View>

      <View style={styles.pills}>
        <StatusChip label={t('pmKisan')} tone={pmKisan ? 'good' : 'watch'} />
        <StatusChip
          label={aadhaar ? `${t('aadhaar')} · ××${aadhaarLast4}` : t('aadhaar')}
          tone={aadhaar ? 'good' : 'watch'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 10,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  shield: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldOff: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
