import { Alert, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { SettingsRow } from '@/components/profile/SettingsRow';
import { AppText, Avatar, Card, Metric, Screen } from '@/components/ui';
import { farmer, images } from '@/constants/dummy';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <Screen>
      <AppText variant="display">Profile</AppText>

      <Card>
        <View style={styles.hero}>
          <Avatar uri={images.avatar} name={farmer.name} size={72} />
          <View style={{ flex: 1 }}>
            <AppText variant="h1">{farmer.name}</AppText>
            <AppText variant="caption">{farmer.location}</AppText>
            <AppText variant="caption">+91 {farmer.phone}</AppText>
          </View>
        </View>
      </Card>

      <Card>
        <AppText variant="h2" style={{ marginBottom: 14 }}>
          Farm information
        </AppText>
        <View style={styles.metrics}>
          <Metric label="Size" value={`${farmer.farmSize} acres`} />
          <Metric label="Soil" value={farmer.soilType} />
        </View>
        <View style={[styles.metrics, { marginTop: 14 }]}>
          <Metric label="Season" value={farmer.season} />
          <Metric label="Crop" value={farmer.primaryCrop} />
        </View>
      </Card>

      <Card>
        <SettingsRow icon="notifications-outline" label="Notifications" value="On" />
        <SettingsRow icon="language-outline" label="Language" value="English" />
        <SettingsRow icon="help-circle-outline" label="Help" onPress={() => Alert.alert('Help', 'Support is UI-only in this preview.')} />
        <SettingsRow icon="information-circle-outline" label="About Krishi Setu" value="MVP" />
        <SettingsRow
          icon="log-out-outline"
          label="Log out"
          danger
          onPress={() => router.replace('/login')}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  metrics: { flexDirection: 'row', gap: 12 },
});
