import { Text, type TextProps, type TextStyle } from 'react-native';

import { colors, fonts } from '@/constants/theme';

type Variant = 'display' | 'h1' | 'h2' | 'title' | 'body' | 'caption' | 'label' | 'number';

const variants: Record<Variant, TextStyle> = {
  display: { fontFamily: fonts.extrabold, fontSize: 34, lineHeight: 40, color: colors.text },
  h1: { fontFamily: fonts.bold, fontSize: 26, lineHeight: 32, color: colors.text },
  h2: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 26, color: colors.text },
  title: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 22, color: colors.text },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.text },
  caption: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.textSecondary },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  number: { fontFamily: fonts.bold, fontSize: 28, lineHeight: 34, color: colors.text },
};

type Props = TextProps & {
  variant?: Variant;
  color?: string;
  align?: TextStyle['textAlign'];
};

export function AppText({ variant = 'body', color, align, style, ...rest }: Props) {
  return (
    <Text
      style={[variants[variant], color ? { color } : null, align ? { textAlign: align } : null, style]}
      {...rest}
    />
  );
}
