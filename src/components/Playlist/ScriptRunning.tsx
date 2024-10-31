import axios from 'axios';
import {useEffect, useMemo, useRef, useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from '../../contexts/ThemeContext';
import TrackPlayer, {useProgress} from 'react-native-track-player';
import _ from 'lodash';
import {useAppSelector} from '../../redux/store';
import {useDispatch} from 'react-redux';
import {addScripts} from '../../redux/features/playlistSlice';
import {PLAYLIST_SCRIPTS_URL} from '../../utils/constants';
import StorageService from '../../db/StorageService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScriptRunning = ({code}: {code: string}) => {
  const {position} = useProgress();

  const {paletteColor} = useTheme();
  const itemRefs = useRef([]);
  const scrollViewRef = useRef();
  const [scrollHeight, setScrollHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0); // Keep track of scroll position
  const dispatch = useDispatch();
  const {scripts} = useAppSelector(state => state.playlist);

  useEffect(() => {
    if (!scripts.code) {
      try {
        (async () => {
          const res = await axios.get(
            `${PLAYLIST_SCRIPTS_URL.replace('SONG_ID', code)}`,
          );
          if (Array.isArray(res.data)) {
            dispatch(
              addScripts({
                code,
                data: res.data,
              }),
            );
          }
        })();
      } catch (e) {}
    }
  }, [code]);

  const transcripts = useMemo(() => scripts[code] ?? [], [scripts, code]);

  const currentIndexActive = useMemo(() => {
    return _.findLastIndex(
      transcripts,
      transcript =>
        position * 1000 >= transcript.startTime - 1000 &&
        position * 1000 <= transcript.endTime + 500,
    );
  }, [position, transcripts]);

  useEffect(() => {
    if (currentIndexActive !== -1 && itemRefs.current[currentIndexActive]) {
      itemRefs.current[currentIndexActive].measureLayout(
        scrollViewRef.current,
        (x, y, width, height) => {
          if (
            y < scrollY ||
            (y + height > scrollY + scrollHeight && scrollViewRef.current)
          ) {
            scrollViewRef.current.scrollTo({
              y: y - scrollHeight / 2 + height / 2,
              animated: true,
            });
          }
        },
      );
    }
  }, [currentIndexActive, scrollY, scrollHeight, transcripts]);

  return (
    <ScrollView
      style={{
        width: '100%',
      }}
      contentContainerStyle={{
        alignItems: 'center',
      }}
      ref={scrollViewRef}
      onLayout={event => {
        const {height} = event.nativeEvent.layout;
        setScrollHeight(height);
      }}
      onScroll={event => {
        setScrollY(event.nativeEvent.contentOffset.y);
      }}
      scrollEventThrottle={16} // For smooth scrolling
    >
      {transcripts.map((transcript, index) => {
        return (
          <TouchableOpacity
            key={index}
            ref={ref => (itemRefs.current[index] = ref)}
            onPress={() => {
              TrackPlayer.seekTo(transcript.startTime / 1000);
            }}
            // onLayout={event => {
            //   const {height} = event.nativeEvent.layout;
            //   setItemHeight(index, height);
            // }}
          >
            <Text
              style={{
                color: paletteColor.text,
                marginVertical: 2,
                paddingVertical: 2,
                ...(currentIndexActive === index
                  ? {
                      fontWeight: 'bold',
                      fontSize: 15,
                    }
                  : {
                      opacity: 0.6,
                      fontSize: 15,
                    }),
              }}>
              {transcript.text}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default ScriptRunning;
