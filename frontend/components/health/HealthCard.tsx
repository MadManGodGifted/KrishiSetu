import { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, UIManager, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { HealthParameter, HealthTone } from '@/constants/dummy';
import { colors, radius } from '@/constants/theme';
import { useOptionalLocale } from '@/context/LocaleContext';
import { AppText, Card, PressableScale, ScoreRing, StatusChip } from '@/components/ui';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
  parameters?: HealthParameter[];
  advice?: string;
};

export function HealthCard({
  title,
  status,
  tone,
  score,
  description,
  icon,
  parameters = [],
  advice,
}: Props) {
  const [open, setOpen] = useState(false);
  const locale = useOptionalLocale();
  const viewLabel = open
    ? (locale?.t('hideDetails') ?? 'Hide details')
    : (locale?.t('viewDetails') ?? 'View details');
  const adviceLabel = locale?.t('advice') ?? 'Advice';

  const toggle = () => {
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setOpen((prev) => !prev);
  };

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

      {parameters.length > 0 ? (
        <View style={styles.detailsWrap}>
          <PressableScale onPress={toggle} style={styles.detailsBtn}>
            <AppText variant="title" color={colors.primaryDark}>
              {viewLabel}
            </AppText>
            <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.primaryDark} />
          </PressableScale>

          {open ? (
            <View style={styles.panel}>
              {parameters.map((item, index) => (
                <View
                  key={item.label}
                  style={[styles.param, index < parameters.length - 1 && styles.paramBorder]}>
                  <View style={{ flex: 1, paddingRight: 12 }}>
                    <AppText variant="caption">{item.label}</AppText>
                    {item.hint ? (
                      <AppText variant="caption" color={colors.textMuted}>
                        {item.hint}
                      </AppText>
                    ) : null}
                  </View>
                  <AppText
                    variant="title"
                    color={item.tone === 'watch' || item.tone === 'fair' ? '#B78103' : colors.text}
                    style={styles.paramValue}>
                    {item.value}
                  </AppText>
                </View>
              ))}
              {advice ? (
                <View style={styles.advice}>
                  <AppText variant="label">{adviceLabel}</AppText>
                  <AppText variant="body" style={{ marginTop: 4 }}>
                    {advice}
                  </AppText>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      ) : null}
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
  detailsWrap: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 4,
  },
  detailsBtn: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  panel: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  param: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  paramBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  paramValue: {
    fontSize: 15,
    textAlign: 'right',
    maxWidth: '46%',
  },
  advice: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.primarySoft,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
