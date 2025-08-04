import { Audio } from 'expo-av';

const soundRefs: { [key: string]: Audio.Sound } = {};

export const playSound = async (soundName: string, loop = false) => {
  try {
    // Zaten oynatılıyorsa yeniden çal
    if (soundRefs[soundName]) {
      await soundRefs[soundName].replayAsync();
      return;
    }

    const { sound } = await Audio.Sound.createAsync(
      getSoundPath(soundName),
      {
        shouldPlay: true,
        isLooping: loop,
        volume: 0.4,
      }
    );

    soundRefs[soundName] = sound;
  } catch (e) {
    console.log(`❌ cannot play the sound file`, e);
  }
};

export const stopSound = async (soundName: string) => {
  const sound = soundRefs[soundName];
  if (sound) {
    await sound.stopAsync();
    await sound.unloadAsync();
    delete soundRefs[soundName];
  }
};

const getSoundPath = (soundName: string) => {
  switch (soundName) {
    case 'ui':
      return require('../assets/sfx/ui.mp3');
    case 'candy_shuffle':
      return require('../assets/sfx/candy_shuffle.mp3');
    case 'candy_clear':
      return require('../assets/sfx/candy_clear.mp3');
    case 'bg':
      return require('../assets/sfx/bg.mp3');
    default:
      throw new Error(`Sound ${soundName} not found`);
  }
};
