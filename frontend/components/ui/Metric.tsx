import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

import { AppText } from './AppText';

type Props = {
  label: string;
  value: string;
  hint?: string;
};

export function Metric({ label, value, hint }: Props) {
  return (
    <View style={styles.wrap}>
      <AppText variant="label">{label}</AppText>
      <AppText variant="title" style={styles.value}>
        {value}
      </AppText>
      {hint ? (
        <AppText variant="caption" color={colors.primary}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4, flex: 1 },
  value: { fontSize: 16 },
});
