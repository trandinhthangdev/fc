import {
  Animated,
  Easing,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {screenWidth} from '../../utils/constants';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../../contexts/ThemeContext';
import AppIcon from '../common/AppIcon';
import Sound from 'react-native-sound';
import {useEffect, useRef, useState} from 'react';
Sound.setCategory('Playback');

const LoadingCall = ({
  onReject,
  onAccept,
}: {
  onReject: () => void;
  onAccept: () => void;
}) => {
  const {t} = useTranslation();
  const {paletteColor} = useTheme();
  const bounceValue = useRef(new Animated.Value(1)).current;
  const [sound, setSound] = useState<Sound | null>(null);

  useEffect(() => {
    const soundInstance = new Sound(
      'ringtone.mp3',
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
          onReject();
          console.log('Sound played successfully');
        } else {
          console.log('Failed to play the sound');
        }
      });
      // Set an event listener for when the sound finishes
    }
    // Start the bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: 1.2, // scale up
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 1,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  useEffect(() => {
    if (sound) {
      setTimeout(() => {
        console.log('sound', sound);
        playSound();
      }, 2000);
    }
  }, [sound]);
  return (
    <View
      style={{
        // height: screenHeight,
        height: '100%',
        width: screenWidth,
        backgroundColor: paletteColor.bg,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <View
        style={{
          //   flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={require('./../../assets/jack.jpeg')}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 2,
            borderColor: paletteColor.text,
          }}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginVertical: 8,
            color: paletteColor.text,
          }}>
          {t('name_idol')}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: paletteColor.text,
            opacity: 0.6,
          }}>
          {t('idol_fake.videocall_desc')}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          gap: 80,
          marginVertical: 16,
        }}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#F95454',
              width: 60,
              height: 60,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => onReject()}>
            <AppIcon type="Ionicons" name={'close'} size={30} color="#fff" />
          </TouchableOpacity>
          <Text
            style={{
              color: paletteColor.text,
              fontSize: 12,
              fontWeight: 'bold',
            }}>
            Từ chối
          </Text>
        </View>
        <Animated.View
          style={{
            transform: [{scale: bounceValue}],
          }}>
          <View
            style={{
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#06D001',
                width: 60,
                height: 60,
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => onAccept()}>
              <AppIcon
                type="Ionicons"
                name={'videocam'}
                size={30}
                color="#fff"
              />
            </TouchableOpacity>
            <Text
              style={{
                color: paletteColor.text,
                fontSize: 12,
                fontWeight: 'bold',
              }}>
              Chấp nhận
            </Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

export default LoadingCall;
