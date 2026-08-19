import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { colors } from '@/constants/theme';

import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

type Props = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: ReactNode;
};

export function Header({ title, subtitle, showBack, right }: Props) {
  const router = useRouter();

  return (
    <View style={styles.row}>
      {showBack ? (
        <PressableScale onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </PressableScale>
      ) : (
        <View style={styles.back} />
      )}
      <View style={styles.center}>
        <AppText variant="h2" align="center">
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" align="center">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, paddingHorizontal: 8 },
  right: { width: 40, alignItems: 'flex-end' },
});
