import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import TrackPlayer, {
  useTrackPlayerEvents,
  usePlaybackState,
  useProgress,
  Event,
  State,
} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/FontAwesome';
import {setupPlayer, addTracks} from '../screens/trackPlayerServices';
import {useSelector} from 'react-redux';
import {useAppSelector} from '../redux/store';

interface TrackInfo {
  title?: string;
  artist?: string;
}

function Header() {
  const [info, setInfo] = useState<TrackInfo>({});
  useEffect(() => {
    setTrackInfo();
  }, []);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], event => {
    if (event.state === State.nextTrack) {
      setTrackInfo();
    }
  });

  async function setTrackInfo() {
    const track = await TrackPlayer.getCurrentTrack();
    const info = (await TrackPlayer.getTrack(track)) as TrackInfo;
    setInfo(info);
  }

  return (
    <View>
      <Text style={styles.songTitle}>{info.title}</Text>
      <Text style={styles.artistName}>{info.artist}</Text>
    </View>
  );
}

function TrackProgress() {
  const {position, duration} = useProgress(200);

  function format(seconds: number): string {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  return (
    <View>
      <Text style={styles.trackProgress}>
        {format(position)} / {format(duration)}
      </Text>
    </View>
  );
}

function Playlist() {
  const [queue, setQueue] = useState<TrackInfo[]>([]);
  const [currentTrack, setCurrentTrack] = useState<number>(0);

  async function loadPlaylist() {
    const queue = (await TrackPlayer.getQueue()) as TrackInfo[];
    setQueue(queue);
  }

  useEffect(() => {
    loadPlaylist();
  }, []);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], event => {
    if (event.state === State.nextTrack) {
      TrackPlayer.getCurrentTrack().then(index => setCurrentTrack(index));
    }
  });

  function PlaylistItem({
    index,
    title,
    isCurrent,
  }: {
    index: number;
    title: string;
    isCurrent: boolean;
  }) {
    function handleItemPress() {
      TrackPlayer.skip(index);
    }

    return (
      <TouchableOpacity onPress={handleItemPress}>
        <Text
          style={{
            ...styles.playlistItem,
            backgroundColor: isCurrent ? '#666' : 'transparent',
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  async function handleShuffle() {
    const queue = (await TrackPlayer.getQueue()) as TrackInfo[];
    await TrackPlayer.reset();
    queue.sort(() => Math.random() - 0.5);
    await TrackPlayer.add(queue);

    loadPlaylist();
  }

  return (
    <View>
      <View style={styles.playlist}>
        <FlatList
          data={queue}
          renderItem={({item, index}) => (
            <PlaylistItem
              index={index}
              title={item.title || ''}
              isCurrent={currentTrack === index}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <Controls onShuffle={handleShuffle} />
    </View>
  );
}

function Controls({onShuffle}: {onShuffle: () => void}) {
  const playerState = usePlaybackState();

  async function handlePlayPress() {
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  }

  return (
    <View
      style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}>
      <Icon.Button
        name="arrow-left"
        size={28}
        backgroundColor="transparent"
        onPress={() => TrackPlayer.skipToPrevious()}
      />
      <Icon.Button
        name={playerState === State.Playing ? 'pause' : 'play'}
        size={28}
        backgroundColor="transparent"
        onPress={handlePlayPress}
      />
      <Icon.Button
        name="arrow-right"
        size={28}
        backgroundColor="transparent"
        onPress={() => TrackPlayer.skipToNext()}
      />
      <Icon.Button
        name="random"
        size={28}
        backgroundColor="transparent"
        onPress={onShuffle}
      />
    </View>
  );
}

function PlayAudio() {
  const {songs} = useAppSelector(state => state.playlist);
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);

  useEffect(() => {
    async function setup() {
      const isSetup = await setupPlayer();
      console.log('setup', isSetup);
      // TrackPlayer.reset();
      const queue = await TrackPlayer.getQueue();
      console.log(queue);
      if (isSetup && queue.length <= 0) {
        await addTracks(songs);
      }

      setIsPlayerReady(isSetup);
    }
    console.log(songs.length);
    if (songs.length > 0) setup();
  }, [songs]);

  if (!isPlayerReady) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#bbb" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <TrackProgress />
      <Playlist />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  songTitle: {
    fontSize: 32,
    marginTop: 50,
    color: '#ccc',
  },
  artistName: {
    fontSize: 24,
    color: '#888',
  },
  playlist: {
    marginTop: 40,
    marginBottom: 40,
  },
  playlistItem: {
    fontSize: 16,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 4,
  },
  trackProgress: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 24,
    color: '#eee',
  },
});

export default PlayAudio;
