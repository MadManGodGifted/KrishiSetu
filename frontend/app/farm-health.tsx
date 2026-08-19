import { HealthCard } from '@/components/health/HealthCard';
import { AppText, Header, Screen } from '@/components/ui';
import { farmHealth } from '@/constants/dummy';
import { colors } from '@/constants/theme';

export default function FarmHealthScreen() {
  return (
    <Screen>
      <Header title="Farm health" subtitle="Simple status, not raw sensors" showBack />
      <AppText variant="body" color={colors.textSecondary}>
        Each card is a plain-language read of soil, water, weather, vegetation, and risk.
      </AppText>
      {farmHealth.map((item) => (
        <HealthCard key={item.id} {...item} />
      ))}
    </Screen>
  );
}
