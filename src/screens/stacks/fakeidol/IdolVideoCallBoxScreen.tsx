import {Image, Text, TouchableOpacity, View} from 'react-native';
import VideoPlayer from '../../../components/Video/VideoPlayer';
import AppIcon from '../../../components/common/AppIcon';
import {screenHeight, screenWidth} from '../../../utils/constants';
import {useEffect, useRef, useState} from 'react';
import CameraScreen from '../../../components/Video/CameraScreen';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../contexts/ThemeContext';
import {Camera, CameraPosition} from 'react-native-vision-camera';
import ViewShot, {captureRef} from 'react-native-view-shot';
import Share from 'react-native-share';
import {useTranslation} from 'react-i18next';
import LoadingCall from '../../../components/IdolChat/LoadingCall';

const IdolVideoCallBoxScreen = () => {
  const ref = useRef();
  const {t} = useTranslation();
  const {paletteColor} = useTheme();
  const navigation = useNavigation();
  const [isCalling, setIsCalling] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>('front');
  const [isMuted, setIsMuted] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<any>(null);
  const [isCapture, setIsCapture] = useState(false);
  const [checkCapture, setCheckCapture] = useState({
    idol: false,
    me: false,
  });
  const [loadingCam, setLoadingCam] = useState(false);

  useEffect(() => {
    onRequestPermission();
  }, []);
  const onRequestPermission = async () => {
    try {
      const status = await Camera.requestCameraPermission();
      setCameraStatus(status);
    } catch (e) {
      console.log('e', e);
    }
  };
  useEffect(() => {
    if (loadingCam) {
      setLoadingCam(false);
    }
  }, [loadingCam]);

  const onShare = async () => {
    setIsCapture(true);
  };

  useEffect(() => {
    if (checkCapture.idol && checkCapture.me) {
      try {
        setTimeout(() => {
          (async () => {
            const url = await ref.current.capture();
            await Share.open({
              url,
            });
            setCheckCapture({idol: false, me: false});
            setIsCapture(false);
            setLoadingCam(true);
          })();
        }, 1000);
      } catch (e) {
        console.log('e', e);
      }
    }
  }, [checkCapture]);

  if (cameraStatus === null || loadingCam) {
    return (
      <View
        style={{
          height: '100%',
          width: screenWidth,
          backgroundColor: paletteColor.bg,
        }}></View>
    );
  }
  if (cameraStatus === 'denied') {
    return (
      <View
        style={{
          // height: screenHeight,
          height: '100%',
          width: screenWidth,
          backgroundColor: paletteColor.bg,
        }}>
        <Text>request permission</Text>
        <TouchableOpacity onPress={() => onRequestPermission()}>
          <Text>Request again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isCalling) {
    return (
      <LoadingCall
        onReject={() => {
          navigation.goBack();
        }}
        onAccept={() => {
          setIsCalling(true);
        }}
      />
    );
  }

  return (
    <ViewShot ref={ref}>
      <View
        style={{
          width: screenWidth,
          height: '100%',
          alignItems: 'center',
          backgroundColor: paletteColor.bg,
        }}>
        {!(checkCapture.idol && checkCapture.me) && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              left: 10,
              top: 10,
              zIndex: 9999,
              backgroundColor: 'rgba(0,0,0, 0.6)',
              width: 48,
              height: 48,
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => onShare()}>
            <AppIcon
              name="share-social"
              type="Ionicons"
              size={30}
              color="#fff"
            />
          </TouchableOpacity>
        )}
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
            zIndex: 9999,
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
            }}
            onPress={() => setIsMuted(prev => !prev)}>
            <AppIcon
              type="Ionicons"
              name={isMuted ? 'mic-off' : 'mic'}
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
            // position: 'absolute',
            // left: 0,
            // right: 0,
            // top: 0,
            // bottom: 0,
            zIndex: -1,
            backgroundColor: paletteColor.bg,
            ...(screenHeight / screenWidth - 1024 / 576 > 0
              ? {
                  width:
                    screenWidth * (1 + screenHeight / screenWidth - 1024 / 576),
                }
              : {}),
          }}>
          <VideoPlayer
            isCapture={isCapture}
            onCapture={() => {
              setCheckCapture(prev => ({
                ...prev,
                idol: true,
              }));
            }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 120,
            height: 160,
            backgroundColor: paletteColor.bg,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: paletteColor.bg,
          }}>
          {isVideoOff ? (
            <AppIcon
              type="Ionicons"
              name={'videocam-off'}
              size={64}
              color={paletteColor.text}
            />
          ) : (
            <CameraScreen
              cameraPosition={cameraPosition}
              isCapture={isCapture}
              onCapture={() => {
                setCheckCapture(prev => ({
                  ...prev,
                  me: true,
                }));
              }}
            />
          )}
        </View>
      </View>
    </ViewShot>
  );
};
export default IdolVideoCallBoxScreen;
