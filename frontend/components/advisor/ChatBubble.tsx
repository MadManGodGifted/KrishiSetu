import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, radius } from '@/constants/theme';
import { AppText } from '@/components/ui';

export type ChatMessage = {
  id: string;
  role: 'user' | 'ai';
  text: string;
};

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.row, isUser && styles.rowUser]}>
      {!isUser ? (
        <View style={styles.avatar}>
          <Ionicons name="leaf" size={14} color={colors.white} />
        </View>
      ) : null}
      <View style={[styles.bubble, isUser ? styles.user : styles.ai]}>
        <AppText style={[styles.text, { color: isUser ? colors.white : colors.text }]}>
          {message.text}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
    maxWidth: '92%',
  },
  rowUser: { alignSelf: 'flex-end' },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    maxWidth: '88%',
  },
  user: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 6,
  },
  ai: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 21,
  },
});
