import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';
import { AppText, ScoreRing } from '@/components/ui';

type Props = {
  value: number;
  caption?: string;
};

export function ConfidenceMeter({ value, caption = 'Confidence' }: Props) {
  return (
    <View style={styles.wrap}>
      <ScoreRing score={value} size={132} stroke={12} color={colors.primary} />
      <AppText variant="caption" style={{ marginTop: 10 }}>
        {caption}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
});
