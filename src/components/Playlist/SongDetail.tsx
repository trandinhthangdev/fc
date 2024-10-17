import React, {useState} from 'react';
import {ScrollView, View, Text, Dimensions, StyleSheet} from 'react-native';
import RunningDisk from './RunningDisk';
import {useAppSelector} from '../../redux/store';
import ScriptRunning from './ScriptRunning';
import {PLAYLIST_COVER_URL} from '../../utils/constants';

const screenWidth = Dimensions.get('window').width;

const SongDetail = ({isPlaying}) => {
  const {songPlaying} = useAppSelector(state => state.playlist);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setCurrentIndex(index); // Update current index based on scroll position
  };
  if (!songPlaying) return <></>;
  return (
    <View style={styles.container}>
      <View style={[styles.item]}>
        <RunningDisk
          isFullscreen={true}
          imageUri={PLAYLIST_COVER_URL.replace('SONG_ID', songPlaying.code)}
          isPlaying={isPlaying}
        />
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        scrollEventThrottle={16} // Capture scroll event every 16ms (smooth updates)
        showsHorizontalScrollIndicator={false}>
        <View style={[styles.item]}>
          <RunningDisk isFullscreen={true} imageUri={songPlaying.cover_url} />
        </View>
        <View style={[styles.item]}>
          {currentIndex === 1 && (
            <ScriptRunning
              code={songPlaying.code}
              onSliderValueChange={() => {}}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    width: screenWidth - 40,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  text: {
    fontSize: 24,
  },
  indexText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SongDetail;
