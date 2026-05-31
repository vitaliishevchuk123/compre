import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = '@voice_id';

type VoiceContextValue = {
  voiceId: string | null;
  setVoiceId: (id: string | null) => void;
};

const VoiceContext = createContext<VoiceContextValue>({
  voiceId: null,
  setVoiceId: () => {},
});

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [voiceId, setVoiceIdState] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v) setVoiceIdState(v);
    });
  }, []);

  function setVoiceId(id: string | null) {
    setVoiceIdState(id);
    if (id) AsyncStorage.setItem(STORAGE_KEY, id);
    else AsyncStorage.removeItem(STORAGE_KEY);
  }

  return (
    <VoiceContext.Provider value={{ voiceId, setVoiceId }}>
      {children}
    </VoiceContext.Provider>
  );
}

export const useVoice = () => useContext(VoiceContext);
