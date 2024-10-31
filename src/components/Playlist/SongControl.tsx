import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import AppIcon from '../common/AppIcon';
import TrackPlayer, {
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import {useTheme} from '../../contexts/ThemeContext';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '../../redux/store';
import {
  ELoop,
  onToggleLoop,
  onToggleSuffle,
} from '../../redux/features/playlistSlice';
import _ from 'lodash';
import Slider from '@react-native-community/slider';
const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s]
    .filter((item, index) => !(index === 0 && h === 0))
    .map(unit => String(unit).padStart(2, '0'))
    .join(':');
};
const SongControl = ({isFullscreen}: {isFullscreen?: boolean}) => {
  const {position, duration} = useProgress();
  const {state} = usePlaybackState();
  const {paletteColor} = useTheme();
  const dispatch = useDispatch();
  const {shuffle, loop, songs} = useAppSelector(state => state.playlist);

  return (
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
          {formatTime(position)}
        </Text>
        <Slider
          style={{flex: 1, height: 20}}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onValueChange={(value: number) => {
            TrackPlayer.seekTo(value);
          }}
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
            if (shuffle) {
              const randomIndex = Math.floor(Math.random() * songs.length);
              TrackPlayer.skip(randomIndex);
            } else {
              TrackPlayer.skipToPrevious();
            }
          }}>
          <AppIcon
            type="MaterialCommunityIcons"
            name="skip-previous-outline"
            size={24}
            color={paletteColor.text}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (state === State.Playing) {
              TrackPlayer.pause();
            } else {
              TrackPlayer.play();
            }
          }}>
          {state === State.Playing ? (
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
            if (shuffle) {
              const randomIndex = Math.floor(Math.random() * songs.length);
              TrackPlayer.skip(randomIndex);
            } else {
              TrackPlayer.skipToNext();
            }
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
            TrackPlayer.setRepeatMode(
              loop === ELoop.loop_once ? RepeatMode.Queue : RepeatMode.Track,
            );
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
  );
};
export default SongControl;

const styles = StyleSheet.create({
  time_text: {
    fontSize: 12,
    fontWeight: 400,
  },
});
