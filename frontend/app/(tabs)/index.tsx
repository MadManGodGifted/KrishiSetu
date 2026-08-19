import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AiTipCard } from '@/components/home/AiTipCard';
import { FarmSummary } from '@/components/home/FarmSummary';
import { QuickActions } from '@/components/home/QuickActions';
import { WeatherCard } from '@/components/weather/WeatherCard';
import { AppText, Avatar, Card, Metric, Screen, SectionHeader, StatusChip } from '@/components/ui';
import { farmer, images, recentRecommendation, recentYield } from '@/constants/dummy';
import { colors } from '@/constants/theme';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Screen>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.hello}>
        <View style={{ flex: 1 }}>
          <AppText variant="caption">{greeting()},</AppText>
          <AppText variant="display">{farmer.firstName}</AppText>
        </View>
        <Avatar uri={images.avatar} name={farmer.name} size={52} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(60).duration(400)}>
        <WeatherCard />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).duration(400)}>
        <FarmSummary />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(180).duration(400)}>
        <SectionHeader title="Quick actions" />
        <View style={{ height: 12 }} />
        <QuickActions />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(240).duration(400)}>
        <SectionHeader title="Recent" action="See all" onAction={() => router.push('/(tabs)/recommend')} />
        <View style={{ height: 12 }} />
        <Card onPress={() => router.push('/(tabs)/recommend')}>
          <View style={styles.recentTop}>
            <AppText variant="label">Recommendation</AppText>
            <StatusChip label={recentRecommendation.risk} tone="low" />
          </View>
          <AppText variant="h2">{recentRecommendation.crop}</AppText>
          <View style={styles.metrics}>
            <Metric label="Confidence" value={`${recentRecommendation.confidence}%`} />
            <Metric label="Yield" value={recentRecommendation.expectedYield} />
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).duration(400)}>
        <Card onPress={() => router.push('/yield')}>
          <View style={styles.recentTop}>
            <AppText variant="label">Yield forecast</AppText>
            <AppText variant="caption" color={colors.primary}>
              {recentYield.change}
            </AppText>
          </View>
          <AppText variant="h1">{recentYield.value}</AppText>
          <AppText variant="caption">Estimated revenue {recentYield.revenue}</AppText>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(360).duration(400)}>
        <AiTipCard />
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hello: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  recentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metrics: { flexDirection: 'row', marginTop: 12, gap: 12 },
});
