import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { colors, fonts, radius } from '@/constants/theme';
import { AppText, PressableScale } from '@/components/ui';

const actions = [
  { label: 'Recommend', icon: 'leaf' as const, href: '/(tabs)/recommend', tint: '#E8F5E9', color: '#2E7D32' },
  { label: 'Yield', icon: 'trending-up' as const, href: '/yield', tint: '#E3F2FD', color: '#1565C0' },
  { label: 'Farm health', icon: 'heart' as const, href: '/farm-health', tint: '#FFEBEE', color: '#C62828' },
  { label: 'AI advisor', icon: 'sparkles' as const, href: '/(tabs)/advisor', tint: '#FFF8E1', color: '#F9A825' },
];

export function QuickActions() {
  const router = useRouter();

  return (
    <View style={styles.grid}>
      {actions.map((item) => (
        <PressableScale
          key={item.label}
          onPress={() => router.push(item.href as never)}
          style={styles.tile}>
          <View style={[styles.icon, { backgroundColor: item.tint }]}>
            <Ionicons name={item.icon} size={20} color={item.color} />
          </View>
          <AppText style={styles.label}>{item.label}</AppText>
        </PressableScale>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tile: {
    width: '47.5%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.text,
  },
});
