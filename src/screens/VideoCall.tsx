import {Text, TouchableOpacity, View} from 'react-native';
import VideoPlayer from '../components/Video/VideoPlayer';
import AppIcon from '../components/common/AppIcon';
import {screenHeight, screenWidth} from '../utils/constants';
import {useState} from 'react';
import CameraScreen from '../components/Video/CameraScreen';
import {useNavigation} from '@react-navigation/native';

const VideoCall = () => {
  const navigation = useNavigation();
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [cameraPosition, setCameraPosition] = useState('back'); // Initially, use the back camera
  return (
    <View
      style={{
        width: screenWidth,
        height: screenHeight,
        // backgroundColor: 'red',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          left: 10,
          top: 10,
        }}>
        <AppIcon name="share-social" type="Ionicons" size={30} />
      </TouchableOpacity>
      <View
        style={{
          position: 'absolute',
          bottom: 10,
          width: screenWidth - 20,
          maxWidth: 500,
          backgroundColor: 'rgba(0,0,0, 0.6)',
          padding: 10,
          borderRadius: 20,
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => setIsVideoOff(prev => !prev)}>
          <AppIcon
            type="Ionicons"
            name={isVideoOff ? 'videocam-off' : 'videocam'}
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AppIcon type="Ionicons" name="mic" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            setCameraPosition(prevPosition =>
              prevPosition === 'back' ? 'front' : 'back',
            );
          }}>
          <AppIcon
            type="MaterialCommunityIcons"
            name="camera-flip"
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#F95454',
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <AppIcon
            type="MaterialIcons"
            name="call-end"
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          zIndex: -1,
        }}>
        <VideoPlayer />
      </View>
      <View
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          width: 120,
          height: 200,
          zIndex: 999,
        }}>
        <CameraScreen cameraPosition={cameraPosition} />
      </View>
    </View>
  );
};
export default VideoCall;
