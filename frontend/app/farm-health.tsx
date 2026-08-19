import { HealthCard } from '@/components/health/HealthCard';
import { AppText, Header, Screen } from '@/components/ui';
import { farmHealth } from '@/constants/dummy';
import { colors } from '@/constants/theme';
import { useLocale } from '@/context/LocaleContext';

export default function FarmHealthScreen() {
  const { t } = useLocale();

  return (
    <Screen>
      <Header title="Farm health" subtitle="Simple status, not raw sensors" showBack />
      <AppText variant="body" color={colors.textSecondary}>
        {t('healthParamsHint')}
      </AppText>
      {farmHealth.map(({ id, ...item }) => (
        <HealthCard key={id} {...item} />
      ))}
    </Screen>
  );
}
