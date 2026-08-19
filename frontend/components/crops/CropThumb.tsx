import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { cropArt } from '@/constants/cropVisuals';
import { colors, fonts } from '@/constants/theme';
import { AppText } from '@/components/ui';

type Props = {
  cropId: string;
  name: string;
  size?: number;
  radius?: number;
};

export function CropThumb({ cropId, name, size = 72, radius = 16 }: Props) {
  const art = cropArt[cropId];
  const [failed, setFailed] = useState(!art?.source);

  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: radius, backgroundColor: art?.color ?? colors.primarySoft }]}>
      {!failed && art?.source ? (
        <Image
          source={art.source}
          style={{ width: size, height: size, borderRadius: radius }}
          contentFit="cover"
          cachePolicy="memory-disk"
          recyclingKey={cropId}
          onError={() => setFailed(true)}
        />
      ) : (
        <View style={styles.fallback}>
          <Ionicons name={art?.icon ?? 'leaf'} size={size * 0.38} color={colors.primaryDark} />
          <AppText style={styles.letter}>{name.slice(0, 1)}</AppText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  fallback: { alignItems: 'center', justifyContent: 'center', gap: 2 },
  letter: { fontFamily: fonts.extrabold, fontSize: 12, color: colors.primaryDark },
});
