import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, shadows } from '@/constants/theme';
import { AppText, PressableScale } from '@/components/ui';

const icons: Record<string, { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap; label: string }> = {
  index: { on: 'home', off: 'home-outline', label: 'Home' },
  recommend: { on: 'leaf', off: 'leaf-outline', label: 'Recommend' },
  advisor: { on: 'chatbubbles', off: 'chatbubbles-outline', label: 'Advisor' },
  deals: { on: 'pricetag', off: 'pricetag-outline', label: 'Deals' },
  profile: { on: 'person', off: 'person-outline', label: 'Profile' },
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route, index) => {
        const active = state.index === index;
        const meta = icons[route.name];
        if (!meta) return null;

        return (
          <PressableScale
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={styles.item}>
            <View style={[styles.icon, active && styles.iconOn]}>
              <Ionicons
                name={active ? meta.on : meta.off}
                size={20}
                color={active ? colors.white : colors.textMuted}
              />
            </View>
            <AppText style={[styles.label, active && styles.labelOn]}>{meta.label}</AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    paddingHorizontal: 8,
    ...shadows.card,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOn: {
    backgroundColor: colors.primary,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.textMuted,
  },
  labelOn: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
});
