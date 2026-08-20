import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { colors, fonts } from '@/constants/theme';

import { AppText } from './AppText';

type Props = {
  uri?: number | string;
  name?: string;
  size?: number;
};

export function Avatar({ uri, name = 'R', size = 48 }: Props) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const showImage = Boolean(uri) && !failed;

  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }]}>
      {showImage ? (
        <Image
          source={uri}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          contentFit="cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <AppText style={[styles.initials, { fontSize: size * 0.34 }]}>{initials}</AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.white,
  },
  initials: {
    fontFamily: fonts.bold,
    color: colors.primaryDark,
  },
});
