import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LearnSettings {
  mode: 'learn' | 'test';
  autoAdvance: boolean;
  repeatCount: number;
  pauseSeconds: number;
}

const DEFAULTS: LearnSettings = {
  mode: 'learn',
  autoAdvance: false,
  repeatCount: 1,
  pauseSeconds: 2,
};

const KEYS = {
  mode: '@learn_mode',
  autoAdvance: '@learn_auto_advance',
  repeatCount: '@learn_repeat_count',
  pauseSeconds: '@learn_pause_seconds',
};

interface LearnSettingsCtx extends LearnSettings {
  setMode: (v: 'learn' | 'test') => void;
  setAutoAdvance: (v: boolean) => void;
  setRepeatCount: (v: number) => void;
  setPauseSeconds: (v: number) => void;
}

const Ctx = createContext<LearnSettingsCtx>({
  ...DEFAULTS,
  setMode: () => {},
  setAutoAdvance: () => {},
  setRepeatCount: () => {},
  setPauseSeconds: () => {},
});

export function LearnSettingsProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<'learn' | 'test'>(DEFAULTS.mode);
  const [autoAdvance, setAutoAdvanceState] = useState(DEFAULTS.autoAdvance);
  const [repeatCount, setRepeatCountState] = useState(DEFAULTS.repeatCount);
  const [pauseSeconds, setPauseSecondsState] = useState(DEFAULTS.pauseSeconds);

  useEffect(() => {
    AsyncStorage.multiGet(Object.values(KEYS)).then((pairs) => {
      const map = new Map(pairs);
      const m = map.get(KEYS.mode);
      const aa = map.get(KEYS.autoAdvance);
      const rc = map.get(KEYS.repeatCount);
      const ps = map.get(KEYS.pauseSeconds);
      if (m) setModeState(m as 'learn' | 'test');
      if (aa !== null && aa !== undefined) setAutoAdvanceState(aa === 'true');
      if (rc !== null && rc !== undefined) setRepeatCountState(parseInt(rc, 10));
      if (ps !== null && ps !== undefined) setPauseSecondsState(parseInt(ps, 10));
    });
  }, []);

  function setMode(v: 'learn' | 'test') {
    setModeState(v);
    AsyncStorage.setItem(KEYS.mode, v);
  }
  function setAutoAdvance(v: boolean) {
    setAutoAdvanceState(v);
    AsyncStorage.setItem(KEYS.autoAdvance, String(v));
  }
  function setRepeatCount(v: number) {
    setRepeatCountState(v);
    AsyncStorage.setItem(KEYS.repeatCount, String(v));
  }
  function setPauseSeconds(v: number) {
    setPauseSecondsState(v);
    AsyncStorage.setItem(KEYS.pauseSeconds, String(v));
  }

  return (
    <Ctx.Provider value={{ mode, autoAdvance, repeatCount, pauseSeconds, setMode, setAutoAdvance, setRepeatCount, setPauseSeconds }}>
      {children}
    </Ctx.Provider>
  );
}

export const useLearnSettings = () => useContext(Ctx);
