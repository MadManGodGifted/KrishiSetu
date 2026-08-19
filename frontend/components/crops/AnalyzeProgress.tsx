import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

import { colors, fonts, radius } from '@/constants/theme';
import { AppText, Card } from '@/components/ui';

const STEPS = [
  { key: 'soil', label: 'Reading soil health card', icon: 'leaf' as const },
  { key: 'weather', label: 'Checking weather forecast', icon: 'partly-sunny' as const },
  { key: 'market', label: 'Comparing mandi prices', icon: 'storefront' as const },
  { key: 'water', label: 'Measuring water availability', icon: 'water' as const },
  { key: 'season', label: 'Matching season window', icon: 'calendar' as const },
];

type Props = {
  running: boolean;
  onDone: () => void;
};

export function AnalyzeProgress({ running, onDone }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!running) {
      setStep(0);
      return;
    }
    let cancelled = false;
    setStep(0);
    const timers = STEPS.map((_, index) =>
      setTimeout(() => {
        if (cancelled) return;
        setStep(index + 1);
        if (index === STEPS.length - 1) onDone();
      }, 520 * (index + 1)),
    );
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [running, onDone]);

  if (!running) return null;

  const progress = Math.min(1, step / STEPS.length);
  const current = STEPS[Math.min(step, STEPS.length - 1)];

  return (
    <Animated.View entering={FadeIn.duration(200)}>
      <Card>
        <AppText variant="title">AI is studying your farm</AppText>
        <AppText variant="caption" style={{ marginTop: 4 }}>
          Soil, weather, market, water, and season — one step at a time.
        </AppText>

        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>
        <AppText style={styles.pct}>{Math.round(progress * 100)}%</AppText>

        <View style={{ gap: 8, marginTop: 8 }}>
          {STEPS.map((item, index) => {
            const done = step > index;
            const active = step === index;
            return (
              <View key={item.key} style={[styles.row, active && styles.rowOn]}>
                <View style={[styles.icon, done && styles.iconDone, active && styles.iconOn]}>
                  <Ionicons
                    name={done ? 'checkmark' : item.icon}
                    size={16}
                    color={done || active ? colors.white : colors.primary}
                  />
                </View>
                <AppText
                  style={[styles.label, done && styles.labelDone, active && styles.labelOn]}
                  numberOfLines={1}>
                  {item.label}
                </AppText>
              </View>
            );
          })}
        </View>

        <AppText variant="caption" style={{ marginTop: 10 }} numberOfLines={1}>
          Now: {current.label}
        </AppText>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
    overflow: 'hidden',
    marginTop: 16,
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 999,
  },
  pct: {
    fontFamily: fonts.extrabold,
    fontSize: 13,
    color: colors.primaryDark,
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: radius.sm,
    minWidth: 0,
  },
  rowOn: { backgroundColor: colors.primarySoft },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOn: { backgroundColor: colors.primary },
  iconDone: { backgroundColor: colors.primaryDark },
  label: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  labelOn: { fontFamily: fonts.bold, color: colors.text },
  labelDone: { color: colors.primaryDark },
});
