import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

import { AppText } from './AppText';

type Props = {
  title: string;
  action?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, action, onAction }: Props) {
  return (
    <View style={styles.row}>
      <AppText variant="h2">{title}</AppText>
      {action ? (
        <AppText variant="caption" color={colors.primary} onPress={onAction}>
          {action}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
