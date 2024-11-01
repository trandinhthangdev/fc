import {useEffect, useState} from 'react';
import Sound from 'react-native-sound';
Sound.setCategory('Playback');

export const usePlaySound = (fileName: string) => {
  const [sound, setSound] = useState<Sound | null>(null);

  useEffect(() => {
    const soundInstance = new Sound(
      fileName,
      Sound.MAIN_BUNDLE,
      (error: any) => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        console.log('Sound loaded successfully');
        playSound();
      },
    );

    setSound(soundInstance);

    return () => {
      if (soundInstance) {
        soundInstance.release();
      }
    };
  }, []);

  const playSound = () => {
    if (sound) {
      sound.play((success: boolean) => {
        if (success) {
          console.log('Sound played successfully');
        } else {
          console.log('Failed to play the sound');
        }
      });
    }
  };

  return {
    playSound,
  };
};
