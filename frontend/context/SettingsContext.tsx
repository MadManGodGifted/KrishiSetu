import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { mandis } from '@/constants/dummy';

type SettingsContextValue = {
  preferredMandi: string;
  setPreferredMandi: (id: string) => void;
  preferredMandiLabel: string;
  whatsappAlerts: boolean;
  setWhatsappAlerts: (on: boolean) => void;
  smsAlerts: boolean;
  setSmsAlerts: (on: boolean) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [preferredMandi, setPreferredMandi] = useState(mandis[0].value);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const value = useMemo<SettingsContextValue>(() => {
    const preferredMandiLabel = mandis.find((item) => item.value === preferredMandi)?.label ?? mandis[0].label;
    return {
      preferredMandi,
      setPreferredMandi,
      preferredMandiLabel,
      whatsappAlerts,
      setWhatsappAlerts,
      smsAlerts,
      setSmsAlerts,
    };
  }, [preferredMandi, whatsappAlerts, smsAlerts]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used inside SettingsProvider');
  }
  return ctx;
}
