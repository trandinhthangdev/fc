import {Text, TouchableOpacity, View} from 'react-native';
import AppIcon from '../components/common/AppIcon';
import {
  State,
  useActiveTrack,
  usePlaybackState,
} from 'react-native-track-player';
import {useTheme} from '../contexts/ThemeContext';
import SongDetail from '../components/Playlist/SongDetail';
import SongControl from '../components/Playlist/SongControl';
import {useNavigation} from '@react-navigation/native';
import {screenHeight, screenWidth} from '../utils/constants';

const PlaySongScreen = () => {
  const navigation = useNavigation();
  const currentSong = useActiveTrack();
  const {paletteColor} = useTheme();
  const {state} = usePlaybackState();

  return (
    <View
      style={{
        height: screenHeight,
        width: screenWidth,
        padding: 8,
        backgroundColor: paletteColor.bg,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: '100%',
          padding: 8,
          // backgroundColor: 'red',
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 0,
            borderRadius: 20,
          }}
          onPress={() => {
            navigation.goBack();
            // closeFullScreen();
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
            fontSize: 16,
          }}>
          {currentSong?.title}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
        }}>
        <SongDetail isPlaying={state == State.Playing} />
      </View>
      <View
        style={{
          padding: 8,
        }}>
        <SongControl isFullscreen={true} />
      </View>
    </View>
  );
};
export default PlaySongScreen;
