import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, radius } from '@/constants/theme';
import { AppText, Card, PressableScale } from '@/components/ui';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  summary?: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export function ReportSection({ icon, title, summary, open, onToggle, children }: Props) {
  return (
    <Card padded={false}>
      <PressableScale onPress={onToggle} style={styles.head}>
        <View style={styles.icon}>
          <Ionicons name={icon} size={18} color={colors.primary} />
        </View>
        <View style={styles.titles}>
          <AppText variant="title" numberOfLines={1}>
            {title}
          </AppText>
          {!open && summary ? (
            <AppText variant="caption" numberOfLines={1}>
              {summary}
            </AppText>
          ) : null}
        </View>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
      </PressableScale>
      {open ? <View style={styles.body}>{children}</View> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  head: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titles: { flex: 1, minWidth: 0 },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
});
