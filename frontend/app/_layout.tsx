import 'react-native-gesture-handler';

import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/manrope';

import { colors } from '@/constants/theme';
import { LocaleProvider } from '@/context/LocaleContext';
import { SettingsProvider } from '@/context/SettingsContext';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const FONT_WAIT_MS = 2000;

function BootSplash() {
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <View style={styles.splash}>
      <Image
        source={require('../assets/images/splash-icon.png')}
        style={styles.logo}
        contentFit="contain"
      />
    </View>
  );
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [loaded, error] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  useEffect(() => {
    if (loaded || error) {
      setReady(true);
      void SplashScreen.hideAsync();
      return;
    }

    const timeout = setTimeout(() => {
      setReady(true);
      void SplashScreen.hideAsync();
    }, FONT_WAIT_MS);

    return () => clearTimeout(timeout);
  }, [loaded, error]);

  if (!ready) return <BootSplash />;

  return (
    <GestureHandlerRootView style={styles.root}>
      <LocaleProvider>
        <SettingsProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: 'fade',
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="yield" />
            <Stack.Screen name="farm-health" />
            <Stack.Screen name="crop/[id]" />
            <Stack.Screen name="crop/buyers" />
            <Stack.Screen name="report" />
          </Stack>
        </SettingsProvider>
      </LocaleProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  splash: {
    flex: 1,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
