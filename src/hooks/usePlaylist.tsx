import {useEffect} from 'react';
import TrackPlayer from 'react-native-track-player';
import {Song} from '../redux/features/playlistSlice';

export const usePlaylist = ({}) => {
  const onPlaySong = async (songPlaying: Song) => {
    try {
      const queue = await TrackPlayer.getQueue();
      const indexPlaying = [...queue].findIndex(
        song => song.id === songPlaying.code,
      );
      if (indexPlaying !== -1) TrackPlayer.skip(indexPlaying);
      TrackPlayer.play();
    } catch (e) {
      console.log(e);
    }
  };
  return {
    onPlaySong,
  };
};
