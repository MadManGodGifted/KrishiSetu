import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { HealthTone } from '@/constants/dummy';
import { colors } from '@/constants/theme';
import { AppText, Card, ScoreRing, StatusChip } from '@/components/ui';

const toneColor: Record<HealthTone, string> = {
  excellent: colors.primaryDark,
  good: colors.primary,
  fair: colors.warning,
  low: colors.primary,
  watch: colors.danger,
};

type Props = {
  title: string;
  status: string;
  tone: HealthTone;
  score: number;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export function HealthCard({ title, status, tone, score, description, icon }: Props) {
  return (
    <Card>
      <View style={styles.row}>
        <View style={{ flex: 1, gap: 8 }}>
          <View style={styles.titleRow}>
            <View style={styles.icon}>
              <Ionicons name={icon} size={18} color={toneColor[tone]} />
            </View>
            <AppText variant="h2">{title}</AppText>
          </View>
          <StatusChip label={status} tone={tone} />
          <AppText variant="caption">{description}</AppText>
        </View>
        <ScoreRing score={score} color={toneColor[tone]} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
