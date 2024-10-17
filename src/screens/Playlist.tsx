import {Animated, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useAppSelector} from '../redux/store';
import {useDispatch} from 'react-redux';
import {
  addSongs,
  setLoop,
  setSongPlaying,
  setSuffle,
  Song,
} from '../redux/features/playlistSlice';
import PlaySong from '../components/Playlist/PlaySong';
import {useTheme} from '../contexts/ThemeContext';
import SongItem from '../components/Playlist/SongItem';
import axios from 'axios';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import db from './../db/Database';
import {LAST_UPDATED_PLAYLIST_URL, PLAYLIST_URL} from '../utils/constants';
import _ from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageService from '../db/StorageService';

const LAST_FETCH_CODE = 'lastFetchCode';
const NUMBER_PAGE = 20;
const Playlist = () => {
  const scrollRef = useRef<ScrollView>(null);
  const {songs, shuffle, loop} = useAppSelector(state => state.playlist);
  const playlistSettings = useMemo(() => ({shuffle, loop}), [shuffle, loop]);

  useEffect(() => {
    (async () => {
      const storage = StorageService.getInstance();
      const playlistSettings = await storage.getItem('playlistSettings');
      if (playlistSettings) {
        dispatch(setSuffle(!!playlistSettings?.shuffle));
        dispatch(setLoop(playlistSettings?.loop));
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const storage = StorageService.getInstance();
      await storage.setItem('playlistSettings', playlistSettings);
    })();
  }, [playlistSettings]);
  const {paletteColor} = useTheme();
  const [data, setData] = useState<{
    items: Song[];
    page: number;
    loadMore: boolean;
  }>({
    items: [],
    page: 0,
    loadMore: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    getLastFetchCodeInit();
  }, []);
  const getLastFetchCodeInit = async () => {
    const data = await AsyncStorage.getItem(LAST_FETCH_CODE);
    console.log('data', data);
    if (data) {
      const songs_init = await db.getAllSongs();
      dispatch(addSongs(songs_init));
      getLastFetchCode(data);
    } else {
      getSongs();
    }
  };
  useEffect(() => {
    if (data.items.length === 0) {
      const pageItems = songs.slice(0, NUMBER_PAGE);
      setData({
        items: pageItems,
        page: 1,
        loadMore: pageItems.length === NUMBER_PAGE,
      });
    }
  }, [songs]);
  // console.log(LAST_UPDATED_PLAYLIST_URL);
  const getLastFetchCode = async (init?: string) => {
    const res = await axios.get(
      `${LAST_UPDATED_PLAYLIST_URL}?time=${Date.now()}`,
    );
    console.log(res.data);
    if (!res.data?.last_updated_code) {
      return;
    }
    if (init && init !== res.data?.last_updated_code) {
      await AsyncStorage.setItem(LAST_FETCH_CODE, res.data?.last_updated_code);
      getSongs();
      return;
    }
    if (!init) {
      await AsyncStorage.setItem(LAST_FETCH_CODE, res.data?.last_updated_code);
    }
  };
  const getSongs = async () => {
    try {
      const res = await axios.get(`${PLAYLIST_URL}?time=${Date.now()}`);
      console.log(res.data);
      if (Array.isArray(res.data)) {
        let songs_init = _.uniqBy(
          res.data.map(song => ({
            code: song.id,
            name: song.title,
            has_lyric: !!song.hasLyric,
          })),
          'code',
        );
        dispatch(addSongs(songs_init));
        console.log('songs_init', songs_init.length);
        await db.addMultipleSongs(songs_init);
        await getLastFetchCode();
      }
    } catch (e) {}
  };

  const handleScroll = (event: any) => {
    const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;
    const isAtBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isAtBottom && !isLoading && data.loadMore && data.page >= 1) {
      loadMore();
    }
  };
  const loadMore = () => {
    setIsLoading(true);
    scrollRef.current?.scrollToEnd({animated: true});
    setTimeout(() => {
      const pageItems = songs.slice(
        data.page * NUMBER_PAGE,
        (data.page + 1) * NUMBER_PAGE,
      );
      setData(prev => ({
        page: prev.page + 1,
        loadMore: pageItems.length === NUMBER_PAGE,
        items: _.uniqBy([...prev.items, ...pageItems], 'code'),
      }));
      setIsLoading(false);
    }, 1000);
  };

  const showSkeletonItem = () => {
    return (
      <View style={styles.skeleton_wrapper}>
        <Animated.View style={{...styles.skeleton, ...styles.skeleton_icon}} />
        <Animated.View style={{...styles.skeleton, ...styles.skeleton_text}} />
      </View>
    );
  };
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: paletteColor.bg,
      }}>
      <ScrollView
        style={{
          flex: 1,
        }}
        ref={scrollRef}
        onScroll={handleScroll}>
        {data.items.length === 0 && (
          <>
            {new Array(10).fill(1).map((item, index) => (
              <React.Fragment key={index}>{showSkeletonItem()}</React.Fragment>
            ))}
          </>
        )}
        {data.items.map(song => {
          return (
            <SongItem
              key={song.code}
              song={song}
              onPlay={() => {
                dispatch(setSongPlaying(song));
              }}
            />
          );
        })}
        {isLoading && (
          <>
            {showSkeletonItem()}
            {showSkeletonItem()}
          </>
        )}
      </ScrollView>
      <PlaySong />
    </View>
  );
};

export default Playlist;
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  skeleton_wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  skeleton: {
    backgroundColor: '#e0e0e0',
  },
  skeleton_icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  skeleton_text: {
    flex: 1,
    fontWeight: 'bold',
    marginLeft: 20,
    height: 15,
    borderRadius: 10,
    maxWidth: 200,
  },
});
