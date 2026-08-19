import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { images } from '@/constants/dummy';
import { colors, fonts, radius } from '@/constants/theme';
import { AppText, Button, Input } from '@/components/ui';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.inner, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }]}>
        <Image source={images.loginHero} style={styles.hero} contentFit="cover" />

        <View style={styles.brand}>
          <View style={styles.mark}>
            <Ionicons name="leaf" size={18} color={colors.white} />
          </View>
          <AppText variant="h2">Krishi Setu</AppText>
        </View>

        <View style={styles.copy}>
          <AppText variant="display">Grow with clarity.</AppText>
          <AppText variant="body" color={colors.textSecondary} style={{ marginTop: 8 }}>
            An AI companion for crop choice, yield, farm health, and the right deals.
          </AppText>
        </View>

        <Input
          label="Mobile number"
          placeholder="98765 43210"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          icon={<AppText variant="caption">+91</AppText>}
        />

        <Button title="Continue" onPress={() => router.replace('/(tabs)')} />

        <AppText variant="caption" align="center" style={styles.fine}>
          Continue to explore the demo. No OTP in this preview.
        </AppText>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 16,
  },
  hero: {
    height: 240,
    width: '100%',
    borderRadius: radius.xl,
    backgroundColor: colors.primarySoft,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { marginBottom: 4 },
  fine: { marginTop: 4, fontFamily: fonts.medium },
});
