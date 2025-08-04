import { Audio } from "expo-av";
import React, {
  createContext,
  ReactNode,
  useContext,
  useRef,
} from "react";

interface SoundContextProps {
  playSound: (soundName: string, repeat?: boolean) => Promise<void>;
  stopSound: (soundName: string) => Promise<void>;
}

interface SoundProviderProps {
  children: ReactNode;
}

const SoundContext = createContext<SoundContextProps | undefined>(undefined);

const soundPaths: { [key: string]: any } = {
  ui: require("../assets/sfx/ui.mp3"),
  candy_shuffle: require("@/assets/sfx/candy_shuffle.mp3"),
  candy_clear: require("@/assets/sfx/candy_clear.mp3"),
  bg: require("@/assets/sfx/bg.mp3"),
  cheer: require("@/assets/sfx/cheer.mp3"),
};

const SoundProvider = ({ children }: SoundProviderProps) => {
  const soundObjects = useRef<{ [key: string]: Audio.Sound }>({});

  const playSound = async (soundName: string, repeat = false) => {
    try {
      // Zaten oynatılıyorsa yeniden çalma
      if (soundObjects.current[soundName]) {
        await soundObjects.current[soundName].replayAsync();
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        soundPaths[soundName],
        { shouldPlay: true, isLooping: repeat, volume: 0.4 }
      );

      soundObjects.current[soundName] = sound;
    } catch (error) {
      console.error(`🎵 Error playing sound ${soundName}:`, error);
    }
  };

  const stopSound = async (soundName: string) => {
    try {
      const sound = soundObjects.current[soundName];
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        delete soundObjects.current[soundName];
      }
    } catch (error) {
      console.error(`🛑 Error stopping sound ${soundName}:`, error);
    }
  };

  return (
    <SoundContext.Provider value={{ playSound, stopSound }}>
      {children}
    </SoundContext.Provider>
  );
};

const useSound = (): SoundContextProps => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};

export { SoundProvider, useSound };
