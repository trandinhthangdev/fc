import {Image, Text, View} from 'react-native';
import {useAppSelector} from '../../redux/store';
import AudioPlayer from './AudioPlayer';

const PlaySong = props => {
  const {songPlaying} = useAppSelector(state => state.playlist);
  if (!songPlaying) {
    return <></>;
  }
  return <AudioPlayer songPlaying={songPlaying} />;
};
export default PlaySong;
