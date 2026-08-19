import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { aiTip } from '@/constants/dummy';
import { colors } from '@/constants/theme';
import { AppText, Card } from '@/components/ui';

export function AiTipCard() {
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={styles.icon}>
          <Ionicons name="sparkles" size={18} color={colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="label" color={colors.accent}>
            {aiTip.title}
          </AppText>
          <AppText variant="body" style={{ marginTop: 4 }}>
            {aiTip.body}
          </AppText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.accentSoft,
    borderColor: '#BBDEFB',
  },
  row: { flexDirection: 'row', gap: 12 },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
