import { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatBubble, type ChatMessage } from '@/components/advisor/ChatBubble';
import { SuggestedQuestions } from '@/components/advisor/SuggestedQuestions';
import { AppText, PressableScale } from '@/components/ui';
import { aiReplies, defaultAiReply, welcomeAiMessage } from '@/constants/dummy';
import { colors, fonts, radius } from '@/constants/theme';

export default function AdvisorScreen() {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const [text, setText] = useState('');
  const [hint, setHint] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'ai', text: welcomeAiMessage },
  ]);

  const send = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setText('');

    const reply = aiReplies[trimmed] ?? defaultAiReply;
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'ai', text: reply }]);
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={8}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <AppText variant="h1">AI Advisor</AppText>
        <AppText variant="caption">Ask anything about your farm</AppText>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={[styles.composerWrap, { paddingBottom: 8 }]}>
        <SuggestedQuestions onSelect={send} />
        {hint ? (
          <AppText variant="caption" align="center" style={{ marginTop: 6 }}>
            {hint}
          </AppText>
        ) : null}
        <View style={styles.composer}>
          <PressableScale
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setHint('Voice is UI-only in this preview.');
              setTimeout(() => setHint(''), 1800);
            }}
            style={styles.mic}>
            <Ionicons name="mic-outline" size={20} color={colors.primary} />
          </PressableScale>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Ask about crops, soil, yield..."
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={() => send(text)}
          />
          <PressableScale onPress={() => send(text)} style={styles.send}>
            <Ionicons name="arrow-up" size={18} color={colors.white} />
          </PressableScale>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  list: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  composerWrap: {
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 6,
  },
  mic: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 10,
  },
  send: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
