import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { weather } from '@/constants/dummy';
import { colors, fonts, radius } from '@/constants/theme';
import { AppText } from '@/components/ui';

export function WeatherCard() {
  return (
    <LinearGradient
      colors={['#1B5E20', '#2E7D32', '#1565C0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}>
      <View style={styles.top}>
        <View>
          <AppText variant="label" color="rgba(255,255,255,0.7)">
            Today · {weather.location}
          </AppText>
          <AppText variant="display" color={colors.white} style={styles.temp}>
            {weather.temp}°
          </AppText>
          <AppText variant="title" color="rgba(255,255,255,0.9)">
            {weather.condition}
          </AppText>
        </View>
        <View style={styles.iconWrap}>
          <Ionicons name="sunny" size={42} color="#FFE082" />
        </View>
      </View>
      <View style={styles.meta}>
        <Meta icon="thermometer-outline" label={`${weather.high}° / ${weather.low}°`} />
        <Meta icon="water-outline" label={`${weather.humidity}%`} />
        <Meta icon="rainy-outline" label={`${weather.rainChance}%`} />
      </View>
    </LinearGradient>
  );
}

function Meta({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={14} color="rgba(255,255,255,0.85)" />
      <AppText style={styles.metaText}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: 20,
    overflow: 'hidden',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  temp: { marginTop: 6, marginBottom: 2 },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 16,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
});
