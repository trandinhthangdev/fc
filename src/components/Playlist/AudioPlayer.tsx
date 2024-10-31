import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Button,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';
import AppIcon from '../common/AppIcon';
import RunningDisk from './RunningDisk';
import {
  ELoop,
  onNextSong,
  onPrevSong,
  onToggleLoop,
  onToggleSuffle,
  Song,
} from '../../redux/features/playlistSlice';
import ScriptRunning from './ScriptRunning';
import {useAppSelector} from '../../redux/store';
import {useDispatch} from 'react-redux';
import {EThemeMode, useTheme} from '../../contexts/ThemeContext';
import {
  PALETTE_COLOR,
  PLAYLIST_AUDIO_URL,
  PLAYLIST_COVER_URL,
} from '../../utils/constants';
import SongDetail from './SongDetail';

interface AudioPlayerProps {
  songPlaying: Song;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({songPlaying}) => {
  const {paletteColor} = useTheme();
  const dispatch = useDispatch();
  const {shuffle, loop} = useAppSelector(state => state.playlist);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const url = `${PLAYLIST_AUDIO_URL.replace('SONG_ID', songPlaying.code)}`;
  const [sound, setSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (sound) {
      sound.stop();
      setSound(null);
      setDuration(0);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [songPlaying]);
  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m, s]
      .filter((item, index) => !(index === 0 && h === 0))
      .map(unit => String(unit).padStart(2, '0'))
      .join(':');
  };

  useEffect(() => {
    setCurrentTime(0);
    const soundInstance = new Sound(url, Sound.MAIN_BUNDLE, err => {
      if (err) {
      } else {
        setSound(soundInstance);
        setDuration(soundInstance.getDuration());
      }
    });

    return () => {
      if (soundInstance) {
        soundInstance.release();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [url]);

  const playSound = () => {
    if (sound) {
      sound.play(success => {
        if (success) {
          console.log('Sound played successfully');
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      });
      setIsPlaying(true);

      // Update current time every second
      intervalRef.current = setInterval(() => {
        if (sound) {
          sound.getCurrentTime(seconds => setCurrentTime(seconds));
        }
      }, 1000);
    }
  };

  const stopSound = () => {
    if (sound) {
      sound.stop(() => {
        setIsPlaying(false);
      });
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const onSliderValueChange = (value: number) => {
    if (sound) {
      sound.setCurrentTime(value);
      setCurrentTime(value);
    }
  };
  const pauseSound = () => {
    if (sound && isPlaying) {
      sound.pause(() => {
        setIsPlaying(false);
        // setIsPaused(true);
      });
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };
  useEffect(() => {
    // console.log('currentTime', currentTime, sound?.getDuration());
    if (sound?.getDuration() && sound?.getDuration() - currentTime < 1) {
      if (loop === ELoop.loop_once) {
        console.log('setCurrentTime');
        sound.setCurrentTime(0);
        setCurrentTime(0);
        // playSound();
      } else {
        dispatch(onNextSong());
      }
    }
  }, [currentTime]);

  useEffect(() => {
    if (sound) playSound();
  }, [sound]);

  return (
    <View
      style={{
        padding: 10,
        ...(isFullscreen
          ? {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: paletteColor.bg,
              alignItems: 'center',
            }
          : {}),
      }}>
      {isFullscreen && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            width: '100%',
            height: 20,
          }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              left: 0,
              borderRadius: 20,
            }}
            onPress={() => {
              setIsFullscreen(false);
            }}>
            <AppIcon
              name="arrow-back"
              type="Ionicons"
              size={24}
              color={paletteColor.text}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontWeight: 'bold',
              color: paletteColor.text,
            }}>
            {songPlaying.name}
          </Text>
        </View>
      )}
      {/* {isFullscreen && songPlaying.has_lyric && (
        <ScriptRunning
          code={songPlaying.code}
          onSliderValueChange={onSliderValueChange}
        />
      )} */}
      {isFullscreen && <SongDetail isPlaying={isPlaying} />}

      <View
        style={{
          width: '100%',
          alignItems: 'center',
          ...(isFullscreen ? {} : {flexDirection: 'row'}),
        }}>
        {isFullscreen ? (
          <></>
        ) : (
          // <RunningDisk
          //   isFullscreen={isFullscreen}
          //   imageUri={songPlaying.cover_url}
          // />
          // <TouchableOpacity
          //   style={{
          //     marginRight: 10,
          //   }}
          // onPress={() => setIsFullscreen(true)}>
          <RunningDisk
            isFullscreen={isFullscreen}
            imageUri={PLAYLIST_COVER_URL.replace('SONG_ID', songPlaying.code)}
            isPlaying={isPlaying}
          />
          // </TouchableOpacity>
        )}

        <View
          style={{
            width: '100%',
            ...(isFullscreen ? {} : {flex: 1}),
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                ...styles.time_text,
                color: paletteColor.text,
              }}>
              {formatTime(currentTime)}
            </Text>
            <Slider
              style={{flex: 1, height: 20}}
              minimumValue={0}
              maximumValue={duration}
              value={currentTime}
              onValueChange={onSliderValueChange}
              thumbTintColor={paletteColor.text}
              maximumTrackTintColor={paletteColor.text}
              minimumTrackTintColor={paletteColor.text}
            />
            <Text
              style={{
                ...styles.time_text,
                color: paletteColor.text,
              }}>
              {formatTime(duration)}
            </Text>
          </View>

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              onPress={() => {
                dispatch(onToggleSuffle());
                ToastAndroid.show(
                  shuffle
                    ? 'Bạn chọn phát theo thứ tự'
                    : 'Bạn chọn phát ngẫu nhiên',
                  ToastAndroid.SHORT,
                );
              }}>
              {shuffle ? (
                <AppIcon
                  type="Ionicons"
                  name="shuffle"
                  size={24}
                  color={paletteColor.text}
                />
              ) : (
                <AppIcon
                  type="MaterialCommunityIcons"
                  name="shuffle-disabled"
                  size={24}
                  color={paletteColor.text}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                dispatch(onPrevSong());
              }}>
              <AppIcon
                type="MaterialCommunityIcons"
                name="skip-previous-outline"
                size={24}
                color={paletteColor.text}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={isPlaying ? pauseSound : playSound}>
              {isPlaying ? (
                <AppIcon
                  type="Ionicons"
                  name="pause-circle-outline"
                  size={36}
                  color={paletteColor.text}
                />
              ) : (
                <AppIcon
                  type="Ionicons"
                  name="play-circle-outline"
                  size={36}
                  color={paletteColor.text}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dispatch(onNextSong());
              }}>
              <AppIcon
                type="MaterialCommunityIcons"
                name="skip-next-outline"
                size={24}
                color={paletteColor.text}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dispatch(onToggleLoop());
                ToastAndroid.show(
                  loop === ELoop.loop_once
                    ? 'Bạn chọn lặp lại tất cả bài hát'
                    : 'Bạn chọn lặp lại một bài hát',
                  ToastAndroid.SHORT,
                );
              }}>
              <AppIcon
                type="MaterialCommunityIcons"
                name={loop === ELoop.loop_once ? 'repeat-once' : 'repeat'}
                size={24}
                color={paletteColor.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AudioPlayer;

const styles = StyleSheet.create({
  time_text: {
    fontSize: 12,
    fontWeight: 400,
  },
});
