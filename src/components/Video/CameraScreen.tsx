import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';

const CameraScreen = ({cameraPosition}: {cameraPosition: string}) => {
  const device = useCameraDevice(cameraPosition);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const status = await Camera.requestCameraPermission();
        setHasPermission(status === 'authorized');
      } catch (e) {
        console.log('e', e);
      }
    })();
  }, []);

  if (device == null) return <Text>Loading...</Text>;
  //   if (!hasPermission) return <Text>No permission to use the camera</Text>;

  return (
    <View style={styles.container}>
      <Camera
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          width: 120,
          height: 160,
          borderRadius: 20,
        }}
        zoom={1}
        enableZoomGesture={true}
        device={device}
        isActive={true}
        photo={true}
        resizeMode={'contain'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    // backgroundColor: 'red',
    // overflow: 'hidden',
  },
});

export default CameraScreen;
