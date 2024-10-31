import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';

import RunningDisk from './RunningDisk';
import {
  PLAYLIST_COVER_URL,
  screenHeight,
  ScreenName,
} from '../../utils/constants';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useTheme} from '../../contexts/ThemeContext';
import _ from 'lodash';
import SongControl from './SongControl';
import {useIsFocused, useNavigation} from '@react-navigation/native';

const PlaySong = props => {
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();
  const currentSong = useActiveTrack();
  const {position, duration} = useProgress();
  const {state} = usePlaybackState();
  const {paletteColor} = useTheme();
  const dispatch = useDispatch();
  const [isFullscreen, setIsFullscreen] = useState(false);
  return (
    <View
      style={{
        padding: 10,
      }}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          onPress={() => {
            navigation.navigate(ScreenName.PlaySongScreen);
          }}>
          <RunningDisk
            isFullscreen={isFullscreen}
            imageUri={PLAYLIST_COVER_URL.replace('SONG_ID', currentSong?.id)}
            isPlaying={state == State.Playing}
          />
        </TouchableOpacity>
        <SongControl />
      </View>
    </View>
  );
};
export default PlaySong;

const styles = StyleSheet.create({
  time_text: {
    fontSize: 12,
    fontWeight: 400,
  },
});
