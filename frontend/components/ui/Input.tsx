import { type ReactNode } from 'react';
import { StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';

import { colors, fonts, radius, spacing } from '@/constants/theme';

import { AppText } from './AppText';

type Props = TextInputProps & {
  label?: string;
  icon?: ReactNode;
  suffix?: ReactNode;
  error?: string;
  hint?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export function Input({ label, icon, suffix, error, hint, style, containerStyle, ...rest }: Props) {
  return (
    <View style={[styles.wrap, containerStyle]}>
      {label ? (
        <AppText variant="label" style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <View style={[styles.field, error ? styles.fieldError : null]}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, style]}
          {...rest}
        />
        {suffix}
      </View>
      {error ? (
        <AppText variant="caption" color={colors.danger} style={styles.meta}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" style={styles.meta}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  label: { marginLeft: 4 },
  field: {
    minHeight: 56,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: { width: 22, alignItems: 'center' },
  fieldError: { borderColor: colors.danger },
  input: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 14,
    outlineWidth: 0,
  },
  meta: { marginLeft: 4 },
});
