import {useRef} from 'react';
import {StyleSheet} from 'react-native';
import Video, {VideoRef} from 'react-native-video';
import {screenHeight, screenWidth} from '../../utils/constants';

// const url =
//   'https://v16-webapp-prime.tiktok.com/video/tos/alisg/tos-alisg-pve-0037c001/oICxrBiEIAwzutAPlIiqEz0SFMeLoCAjBAgIQ3/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=3034&bt=1517&cs=0&ds=6&ft=4fUEKM3a8Zmo0xz3Ob4jV6uZ4pWrKsd.&mime_type=video_mp4&qs=0&rc=M2hlNjw4ZTNmZjg5Njc4M0BpamVnc3E5cmg0cjMzODczNEA0YGBhLmNjXjMxNWExLzVfYSMvMjZlMmQ0cS9gLS1kMTFzcw%3D%3D&btag=e00088000&expire=1729290741&l=20241018163204DF22B3D77188B51CE34C&ply_type=2&policy=2&signature=fa9e0fcd28cb7570039b4f4882eab2a9&tk=tt_chain_token';

const url =
  'https://res.cloudinary.com/doekkj5sy/video/upload/v1729270569/download_u4w4ws.mp4';
const VideoPlayer = () => {
  const videoRef = useRef<VideoRef>(null);
  //   const background = require('./background.mp4');
  const onBuffer = e => {
    console.log('onBuffer', e);
  };
  const onError = () => {
    console.log('onError');
  };
  const ratio = '576 × 1024';
  console.log(screenHeight / screenWidth);
  console.log(1024 / 576);
  return (
    <Video
      source={{uri: url}}
      ref={videoRef}
      onBuffer={onBuffer}
      onError={onError}
      style={styles.backgroundVideo}
      repeat={true}
      //   controls={true}
    />
  );
};
export default VideoPlayer;
const styles = StyleSheet.create({
  backgroundVideo: {
    // position: 'absolute',
    width: '100%',
    height: '100%',
    // height: 400,
    // backgroundColor: 'red',
  },
});
