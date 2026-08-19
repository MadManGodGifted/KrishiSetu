import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { CropCard } from '@/components/crops/CropCard';
import { AppText, Button, Card, Input, PressableScale, Screen, SelectableChip } from '@/components/ui';
import { farmer } from '@/constants/dummy';
import { colors, radius } from '@/constants/theme';

const seasons = ['Kharif', 'Rabi', 'Zaid'];

export default function RecommendScreen() {
  const router = useRouter();
  const [location, setLocation] = useState(farmer.location);
  const [season, setSeason] = useState('Rabi');
  const [size, setSize] = useState(farmer.farmSize);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const analyze = () => {
    setLoading(true);
    setShowResult(false);
    setTimeout(() => {
      setLoading(false);
      setShowResult(true);
    }, 800);
  };

  return (
    <Screen>
      <AppText variant="display">Crop recommendation</AppText>
      <AppText variant="body" color={colors.textSecondary}>
        Tell us about the field. We will turn it into a simple crop call.
      </AppText>

      <Card>
        <View style={{ gap: 16 }}>
          <Input
            label="Location"
            value={location}
            onChangeText={setLocation}
            icon={<Ionicons name="location-outline" size={18} color={colors.textMuted} />}
          />

          <View style={{ gap: 8 }}>
            <AppText variant="label">Season</AppText>
            <View style={styles.chips}>
              {seasons.map((item) => (
                <SelectableChip
                  key={item}
                  label={item}
                  selected={season === item}
                  onPress={() => setSeason(item)}
                />
              ))}
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <AppText variant="label">Farm size</AppText>
            <View style={styles.stepper}>
              <PressableScale onPress={() => setSize((v) => Math.max(0.5, v - 0.5))} style={styles.step}>
                <AppText variant="h2">–</AppText>
              </PressableScale>
              <View style={styles.sizeValue}>
                <AppText variant="h1">{size.toFixed(1)}</AppText>
                <AppText variant="caption">acres</AppText>
              </View>
              <PressableScale onPress={() => setSize((v) => v + 0.5)} style={styles.step}>
                <AppText variant="h2">+</AppText>
              </PressableScale>
            </View>
          </View>

          <Button title="Analyze" loading={loading} onPress={analyze} />
        </View>
      </Card>

      {showResult ? (
        <Animated.View entering={FadeInDown.duration(420)}>
          <CropCard onDeals={() => router.push('/(tabs)/deals')} />
        </Animated.View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', gap: 8 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  step: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  sizeValue: { flex: 1, alignItems: 'center' },
});
