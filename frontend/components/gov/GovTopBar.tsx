import { Alert, Linking, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { localeMeta, type Locale } from '@/constants/i18n';
import { colors, fonts, radius } from '@/constants/theme';
import { useLocale } from '@/context/LocaleContext';
import { AppText, PressableScale } from '@/components/ui';

type Props = {
  speechText: string;
};

export function GovTopBar({ speechText }: Props) {
  const { locale, setLocale, t, speak, stopSpeak, speaking, voiceEnabled } = useLocale();

  const callHelpline = async () => {
    try {
      await Linking.openURL('tel:18001801551');
    } catch {
      Alert.alert(t('callTitle'), t('callBody'));
    }
  };

  return (
    <View>
      <View style={styles.tricolor}>
        <View style={[styles.stripe, { backgroundColor: '#FF9933' }]} />
        <View style={[styles.stripe, { backgroundColor: colors.white }]} />
        <View style={[styles.stripe, { backgroundColor: '#138808' }]} />
      </View>

      <View style={styles.bar}>
        <View style={styles.brand}>
          <View style={styles.emblem}>
            <Ionicons name="leaf" size={16} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={styles.brandHi}>{t('govBrandHi')}</AppText>
            <AppText style={styles.brandEn}>{t('govBrand')}</AppText>
            <AppText style={styles.dept} numberOfLines={1}>
              {t('govDept')}
            </AppText>
          </View>
        </View>

        <View style={styles.actions}>
          <PressableScale onPress={callHelpline} style={styles.help}>
            <Ionicons name="call" size={14} color={colors.white} />
            <View>
              <AppText style={styles.helpLabel}>{t('helplineLabel')}</AppText>
              <AppText style={styles.helpNum}>{t('helpline')}</AppText>
            </View>
          </PressableScale>

          <View style={styles.langs}>
            {(Object.keys(localeMeta) as Locale[]).map((code) => (
              <PressableScale
                key={code}
                onPress={() => setLocale(code)}
                style={[styles.lang, locale === code && styles.langOn]}>
                <AppText style={[styles.langText, locale === code && styles.langTextOn]}>
                  {localeMeta[code].short}
                </AppText>
              </PressableScale>
            ))}
          </View>

          <PressableScale
            onPress={() => (speaking ? stopSpeak() : speak(speechText))}
            style={[styles.tts, speaking && styles.ttsOn, !voiceEnabled && styles.ttsOff]}>
            <Ionicons
              name={speaking ? 'stop' : voiceEnabled ? 'volume-high' : 'volume-mute'}
              size={18}
              color={speaking ? colors.white : colors.primaryDark}
            />
          </PressableScale>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tricolor: { flexDirection: 'row', height: 4 },
  stripe: { flex: 1 },
  bar: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  emblem: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0B3D91',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FF9933',
  },
  brandHi: {
    fontFamily: fonts.extrabold,
    fontSize: 15,
    color: colors.text,
    lineHeight: 18,
  },
  brandEn: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: '#0B3D91',
    lineHeight: 16,
  },
  dept: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.textMuted,
    lineHeight: 13,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  help: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0B3D91',
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 44,
  },
  helpLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  helpNum: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.white,
  },
  langs: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  lang: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    minWidth: 36,
    alignItems: 'center',
  },
  langOn: { backgroundColor: colors.primary },
  langText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.textSecondary,
  },
  langTextOn: { color: colors.white },
  tts: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  ttsOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  ttsOff: { opacity: 0.45 },
});
