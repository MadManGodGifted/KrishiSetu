import { ScrollView, StyleSheet } from 'react-native';

import { suggestedQuestions } from '@/constants/dummy';
import { colors, fonts, radius } from '@/constants/theme';
import { AppText, PressableScale } from '@/components/ui';

type Props = {
  onSelect: (question: string) => void;
};

export function SuggestedQuestions({ onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {suggestedQuestions.map((q) => (
        <PressableScale key={q} onPress={() => onSelect(q)} style={styles.chip}>
          <AppText style={styles.text}>{q}</AppText>
        </PressableScale>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingVertical: 4 },
  chip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  text: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.text,
  },
});
