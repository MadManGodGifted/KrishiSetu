import { useRouter } from 'expo-router';

import { AppText, Button, Screen } from '@/components/ui';
import { colors } from '@/constants/theme';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <Screen scroll={false} style={{ justifyContent: 'center', gap: 16 }}>
      <AppText variant="display">This page is missing.</AppText>
      <AppText variant="body" color={colors.textSecondary}>
        Head back to the farm dashboard.
      </AppText>
      <Button title="Go home" onPress={() => router.replace('/(tabs)')} />
    </Screen>
  );
}
