import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { CropCard } from '@/components/crops/CropCard';
import { CropFilterBar } from '@/components/crops/CropFilterBar';
import { AppText, Button, Card, Input, PressableScale, Screen, Select, SelectableChip } from '@/components/ui';
import {
  applyCropFilters,
  countActiveFilters,
  defaultFilters,
  rankCrops,
  sortSummary,
  topologies,
  type CropFilters,
  type Season,
  type Topology,
} from '@/constants/crops';
import { farmer } from '@/constants/dummy';
import { colors, radius } from '@/constants/theme';

const seasons: Season[] = ['Kharif', 'Rabi', 'Zaid'];

export default function RecommendScreen() {
  const router = useRouter();
  const [location, setLocation] = useState(farmer.location);
  const [season, setSeason] = useState<Season>('Rabi');
  const [topology, setTopology] = useState<Topology>('plateau');
  const [size, setSize] = useState(farmer.farmSize);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(true);
  const [filters, setFilters] = useState<CropFilters>(defaultFilters);

  const ranked = useMemo(
    () => rankCrops({ season, topology, location }),
    [season, topology, location],
  );
  const visible = useMemo(() => applyCropFilters(ranked, filters), [ranked, filters]);
  const activeFilters = countActiveFilters(filters);
  const landLabel = topologies.find((item) => item.value === topology)?.label.toLowerCase();

  const analyze = () => {
    setLoading(true);
    setShowResult(false);
    setFilters(defaultFilters);
    setTimeout(() => {
      setLoading(false);
      setShowResult(true);
    }, 700);
  };

  const openYield = (cropId: string) => {
    router.push({ pathname: '/yield', params: { cropId, acres: String(size), season } });
  };

  return (
    <Screen>
      <AppText variant="display">Crop recommendation</AppText>
      <AppText variant="body" color={colors.textSecondary}>
        Match the field — soil, climate, and terrain — then pick from a ranked list of every suitable crop.
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

          <Select
            label="Land topology"
            value={topology}
            onChange={(value) => setTopology(value as Topology)}
            options={topologies.map((item) => ({
              value: item.value,
              label: `${item.label} — ${item.hint}`,
            }))}
            icon={<Ionicons name="map-outline" size={18} color={colors.textMuted} />}
            hint="Hills favour millets. Low-lying land favours cane. Plateau is the Nashik default."
          />

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

          <Button title="Analyze suitable crops" loading={loading} onPress={analyze} />
        </View>
      </Card>

      {showResult ? (
        <Animated.View entering={FadeInDown.duration(420)} style={{ gap: 16 }}>
          <View>
            <AppText variant="h2">
              {visible.length} of {ranked.length} suitable crops
            </AppText>
            <AppText variant="caption">
              {sortSummary(filters.sort)} for {season} on {landLabel} land near {location}.
            </AppText>
          </View>

          <CropFilterBar value={filters} onChange={setFilters} />

          {visible.length === 0 ? (
            <Card>
              <AppText variant="title">No crops match these filters</AppText>
              <AppText variant="caption" style={{ marginTop: 6, marginBottom: 14 }}>
                {activeFilters
                  ? 'Clear duration, water, MSP, or climate filters to see the full ranked list again.'
                  : 'Try another season or land topology.'}
              </AppText>
              {activeFilters ? (
                <Button
                  title="Clear filters"
                  variant="secondary"
                  onPress={() => setFilters({ ...defaultFilters, sort: filters.sort })}
                />
              ) : null}
            </Card>
          ) : (
            visible.map((crop, index) => (
              <Animated.View
                key={crop.id}
                entering={FadeInDown.delay(Math.min(index, 6) * 50).duration(360)}>
                <CropCard
                  crop={crop}
                  index={index}
                  sort={filters.sort}
                  onSelect={() => openYield(crop.id)}
                />
              </Animated.View>
            ))
          )}
        </Animated.View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
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
