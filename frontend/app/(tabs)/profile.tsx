import { Alert, Linking, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { FarmSwitcher } from '@/components/profile/FarmSwitcher';
import { SettingsRow } from '@/components/profile/SettingsRow';
import { SettingsToggle } from '@/components/profile/SettingsToggle';
import { VerifiedBadge } from '@/components/profile/VerifiedBadge';
import { AppText, Avatar, Button, Card, Screen, Select, SelectableChip } from '@/components/ui';
import { farmer, images, mandis } from '@/constants/dummy';
import { localeMeta, type Locale } from '@/constants/i18n';
import { colors } from '@/constants/theme';
import { useLocale } from '@/context/LocaleContext';
import { useSettings } from '@/context/SettingsContext';

export default function ProfileScreen() {
  const { locale, setLocale, t, speak, voiceEnabled, setVoiceEnabled, stopSpeak } = useLocale();
  const {
    preferredMandi,
    setPreferredMandi,
    whatsappAlerts,
    setWhatsappAlerts,
    smsAlerts,
    setSmsAlerts,
  } = useSettings();

  const callHelpline = async () => {
    try {
      await Linking.openURL('tel:18001801551');
    } catch {
      Alert.alert(t('callTitle'), t('callBody'));
    }
  };

  const toggleVoice = (on: boolean) => {
    if (!on) stopSpeak();
    setVoiceEnabled(on);
    if (on) speak(t('voiceOnSpeech'), { force: true });
  };

  return (
    <Screen>
      <AppText variant="display">{t('profileTitle')}</AppText>

      <Card>
        <View style={styles.hero}>
          <Avatar uri={images.avatar} name={farmer.name} size={72} />
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="h1">{farmer.name}</AppText>
            <View style={styles.meta}>
              <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
              <AppText variant="caption">+91 {farmer.phone}</AppText>
            </View>
            <View style={styles.meta}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <AppText variant="caption">
                {farmer.district} / {farmer.state}
              </AppText>
            </View>
          </View>
        </View>
        <VerifiedBadge />
      </Card>

      <AppText variant="h2">{t('myFarms')}</AppText>
      <FarmSwitcher />

      <AppText variant="h2">{t('appSettings')}</AppText>
      <Card>
        <AppText variant="label" style={{ marginBottom: 10 }}>
          {t('language')}
        </AppText>
        <View style={styles.langs}>
          {(Object.keys(localeMeta) as Locale[]).map((code) => (
            <SelectableChip
              key={code}
              label={localeMeta[code].label}
              selected={locale === code}
              onPress={() => setLocale(code)}
            />
          ))}
        </View>
        <SettingsToggle
          icon="volume-high-outline"
          label={t('voiceAssistant')}
          hint={voiceEnabled ? t('voiceOn') : t('voiceOff')}
          value={voiceEnabled}
          onChange={toggleVoice}
        />
      </Card>

      <Card>
        <Select
          label={t('preferredMandi')}
          hint={t('mandiHint')}
          value={preferredMandi}
          options={mandis}
          onChange={setPreferredMandi}
          icon={<Ionicons name="storefront-outline" size={18} color={colors.textMuted} />}
        />
      </Card>

      <Card>
        <AppText variant="label">{t('notifications')}</AppText>
        <AppText variant="caption" style={{ marginTop: 4, marginBottom: 4 }}>
          {t('alertsHint')}
        </AppText>
        <SettingsToggle
          icon="logo-whatsapp"
          label={t('whatsappAlerts')}
          value={whatsappAlerts}
          onChange={setWhatsappAlerts}
        />
        <SettingsToggle
          icon="chatbubble-ellipses-outline"
          label={t('smsAlerts')}
          value={smsAlerts}
          onChange={setSmsAlerts}
        />
      </Card>

      <Button
        title={`${t('callHelpline')} (${t('helpline')})`}
        onPress={callHelpline}
        icon={<Ionicons name="call" size={18} color={colors.white} />}
      />

      <Card>
        <SettingsRow
          icon="help-circle-outline"
          label={t('help')}
          onPress={() => Alert.alert(t('help'), t('callBody'))}
        />
        <SettingsRow icon="information-circle-outline" label={t('about')} value="MVP" />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  langs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
});
