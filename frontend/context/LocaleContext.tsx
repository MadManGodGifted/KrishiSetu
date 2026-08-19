import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { Alert } from 'react-native';

import {
  localeMeta,
  translate,
  type Locale,
  type TranslationKey,
} from '@/constants/i18n';

type SpeakOptions = {
  force?: boolean;
};

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  speak: (text: string, opts?: SpeakOptions) => void;
  stopSpeak: () => void;
  speaking: boolean;
  voiceEnabled: boolean;
  setVoiceEnabled: (on: boolean) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getSynth(): SpeechSynthesis | null {
  if (typeof window === 'undefined') return null;
  return window.speechSynthesis ?? null;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [speaking, setSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const value = useMemo<LocaleContextValue>(() => {
    const t = (key: TranslationKey) => translate(locale, key);

    const stopSpeak = () => {
      getSynth()?.cancel();
      setSpeaking(false);
    };

    const speak = (text: string, opts?: SpeakOptions) => {
      if (!voiceEnabled && !opts?.force) {
        Alert.alert(t('voiceAssistant'), t('voiceOffHint'));
        return;
      }
      const synth = getSynth();
      if (!synth) {
        Alert.alert(t('tts'), text);
        return;
      }
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = localeMeta[locale].speech;
      utterance.rate = 0.95;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      synth.speak(utterance);
    };

    return {
      locale,
      setLocale,
      t,
      speak,
      stopSpeak,
      speaking,
      voiceEnabled,
      setVoiceEnabled,
    };
  }, [locale, speaking, voiceEnabled]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used inside LocaleProvider');
  }
  return ctx;
}

export function useOptionalLocale() {
  return useContext(LocaleContext);
}
