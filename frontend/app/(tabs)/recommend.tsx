import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { CropCard } from '@/components/crops/CropCard';
import { CropCardSkeleton } from '@/components/crops/CropCardSkeleton';
import { FarmContextCard } from '@/components/crops/FarmContextCard';
import { AppText, Button, Card, Screen } from '@/components/ui';
import { colors, fonts, radius } from '@/constants/theme';
import { getRecommendSnapshot, refreshRecommendations } from '@/lib/recommendStore';

export default function RecommendScreen() {
  const router = useRouter();
  const initial = useMemo(() => getRecommendSnapshot(), []);
  const [snapshot, setSnapshot] = useState(initial);
  const [refreshing, setRefreshing] = useState(false);

  const findCrops = useCallback(() => {
    setRefreshing(true);
    const next = refreshRecommendations();
    setTimeout(() => {
      setSnapshot(next);
      setRefreshing(false);
    }, 280);
  }, []);

  const openDetails = (cropId: string) => {
    router.push({ pathname: '/crop/[id]', params: { id: cropId } });
  };

  const openBuyers = (cropId: string) => {
    router.push({ pathname: '/crop/buyers', params: { id: cropId } });
  };

  return (
    <Screen>
      <AppText variant="h1">Recommended crops</AppText>
      <AppText variant="caption">Based on your saved farm profile. No extra details needed.</AppText>

      <FarmContextCard />

      <View style={styles.season}>
        <Ionicons name="calendar-outline" size={16} color={colors.primaryDark} />
        <AppText style={styles.seasonText} numberOfLines={1}>
          Recommendations for Current Season ({snapshot.season})
        </AppText>
      </View>

      <Button
        title="Find Crops"
        loading={refreshing}
        icon={<Ionicons name="leaf" size={18} color={colors.white} />}
        onPress={findCrops}
      />

      {refreshing ? (
        <View style={{ gap: 14 }}>
          <CropCardSkeleton />
          <CropCardSkeleton />
          <CropCardSkeleton />
        </View>
      ) : (
        <View style={{ gap: 14 }}>
          <AppText variant="h2">
            {snapshot.crops.length} crops for this season
          </AppText>
          {snapshot.crops.length === 0 ? (
            <Card>
              <AppText variant="title">No matching crops</AppText>
              <AppText variant="caption" style={{ marginTop: 6 }}>
                Try Find Crops again after your farm profile is updated.
              </AppText>
            </Card>
          ) : (
            snapshot.crops.map((crop, index) => (
              <CropCard
                key={crop.id}
                crop={crop}
                best={index === 0}
                onDetails={() => openDetails(crop.id)}
                onBuyers={() => openBuyers(crop.id)}
              />
            ))
          )}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  season: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '100%',
  },
  seasonText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.primaryDark,
    flexShrink: 1,
  },
});
