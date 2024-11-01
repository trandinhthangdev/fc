import {useEffect, useRef, useState} from 'react';
import {Image, StyleSheet} from 'react-native';
import Video, {VideoRef} from 'react-native-video';
import ViewShot from 'react-native-view-shot';

const url =
  'https://res.cloudinary.com/doekkj5sy/video/upload/v1729270569/download_u4w4ws.mp4';
const VideoPlayer = ({
  isCapture,
  onCapture,
}: {
  isCapture?: boolean;
  onCapture?: () => void;
}) => {
  const videoRef = useRef<VideoRef>(null);
  const viewShotRef = useRef(null);
  const [uri, setUri] = useState<any>(null);

  const captureFrame = () => {
    viewShotRef.current?.capture().then((uri: string) => {
      setUri(uri);
      onCapture && onCapture();
    });
  };

  useEffect(() => {
    if (isCapture) {
      captureFrame();
    }
  }, [isCapture]);
  if (uri) {
    return (
      <Image
        source={{uri}}
        style={{width: '100%', height: '100%'}}
        resizeMode="contain"
      />
    );
  }
  return (
    <ViewShot ref={viewShotRef} options={{format: 'jpg', quality: 0.9}}>
      <Video
        source={{uri: url}}
        ref={videoRef}
        style={{
          width: '100%',
          height: '100%',
        }}
        repeat={true}
        useTextureView={true}
      />
    </ViewShot>
  );
};
export default VideoPlayer;
