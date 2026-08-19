import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { farmHealth, farmer, weather } from '@/constants/dummy';
import { colors, fonts, radius } from '@/constants/theme';
import { AppText, Card } from '@/components/ui';

const soil = farmHealth.find((item) => item.id === 'soil');
const water = farmHealth.find((item) => item.id === 'water');

export function FarmContextCard() {
  return (
    <Card>
      <View style={styles.badge}>
        <Ionicons name="sparkles" size={14} color={colors.primaryDark} />
        <AppText style={styles.badgeText} numberOfLines={1}>
          Based on your farm profile
        </AppText>
      </View>
      <AppText variant="title" numberOfLines={1} style={{ marginTop: 8 }}>
        {farmer.location}
      </AppText>
      <AppText variant="caption" numberOfLines={1}>
        {farmer.soilType} · {farmer.farmSize} acres
      </AppText>

      <View style={styles.row}>
        <Stat icon="leaf" label="Soil" value={`${soil?.score ?? 82}`} hint={soil?.status ?? 'Good'} />
        <Stat icon="sunny" label="Weather" value={`${weather.temp}°`} hint={weather.condition} />
        <Stat icon="water" label="Water" value={water?.status ?? 'Fair'} hint="Borewell" />
        <Stat icon="analytics" label="AI" value="87%" hint="Confidence" />
      </View>
    </Card>
  );
}

function Stat({
  icon,
  label,
  value,
  hint,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={16} color={colors.primary} />
      <AppText style={styles.statLabel} numberOfLines={1}>
        {label}
      </AppText>
      <AppText style={styles.statValue} numberOfLines={1}>
        {value}
      </AppText>
      <AppText style={styles.statHint} numberOfLines={1}>
        {hint}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
    maxWidth: '100%',
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.primaryDark,
    flexShrink: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  stat: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    padding: 10,
    gap: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  statValue: {
    fontFamily: fonts.extrabold,
    fontSize: 16,
    color: colors.text,
  },
  statHint: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.textSecondary,
  },
});
