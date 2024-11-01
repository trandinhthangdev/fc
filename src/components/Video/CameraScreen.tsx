import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {
  Camera,
  useCameraDevice,
  CameraPosition,
} from 'react-native-vision-camera';

const CameraScreen = ({
  cameraPosition,
  isCapture,
  onCapture,
}: {
  cameraPosition: CameraPosition;
  isCapture?: boolean;
  onCapture?: () => void;
}) => {
  const device = useCameraDevice(cameraPosition);
  const cameraRef = useRef(null);
  const [uri, setUri] = useState<any>(null);

  const capturePhoto = async () => {
    if (cameraRef.current != null) {
      const photo = await cameraRef.current.takePhoto();
      setUri(`file:///${photo?.path ?? ''}`);
      onCapture && onCapture();
    }
  };
  useEffect(() => {
    if (isCapture) {
      capturePhoto();
    }
  }, [isCapture]);

  return (
    <View style={styles.container}>
      {uri ? (
        <Image
          source={{uri}}
          style={{width: '100%', height: '100%'}}
          resizeMode="contain"
        />
      ) : device == null ? (
        <></>
      ) : (
        <Camera
          ref={cameraRef}
          style={{
            width: '100%',
            height: '100%',
          }}
          zoom={1}
          enableZoomGesture={true}
          device={device}
          isActive={true}
          photo={true}
          video={true}
          resizeMode={'contain'}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default CameraScreen;
