import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme} from '../../contexts/ThemeContext';
import {Song} from '../../redux/features/playlistSlice';
import {useAppSelector} from '../../redux/store';
import RunningDisk from './RunningDisk';
import {PLAYLIST_COVER_URL} from '../../utils/constants';

interface SongItemProps {
  song: Song;
  onPlay: () => void;
  isActive?: boolean;
}
const SongItem = ({song, onPlay, isActive}: SongItemProps) => {
  const {songPlaying} = useAppSelector(state => state.playlist);
  const {themeColor, paletteColor} = useTheme();
  return (
    <TouchableOpacity
      style={{...styles.song_item}}
      onPress={() => {
        onPlay();
      }}>
      {isActive ? (
        <RunningDisk
          isFullscreen={false}
          imageUri={PLAYLIST_COVER_URL.replace('SONG_ID', song.code)}
          isPlaying={true}
        />
      ) : (
        <Image
          style={styles.song_item_img}
          source={{
            uri: PLAYLIST_COVER_URL.replace('SONG_ID', song.code),
          }}
        />
      )}

      <Text
        style={{
          ...styles.song_text,
          color: paletteColor.text,
          ...(isActive ? {color: '#6A9AB0'} : {}),
        }}>
        {song.name}
      </Text>
      {/* <View>
        <TouchableOpacity style={{}} onPress={() => {}}>
          <AppIcon
            name={song.loved_at ? 'heart' : 'heart-outline'}
            type="Ionicons"
            size={24}
            color={paletteColor.text}
          />
        </TouchableOpacity>
      </View> */}
    </TouchableOpacity>
  );
};

export default SongItem;
const styles = StyleSheet.create({
  song_item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  song_item_img: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  song_text: {
    flex: 1,
    fontWeight: 'bold',
    marginLeft: 20,
  },
});
