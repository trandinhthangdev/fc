import {
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {Photo} from '../../redux/features/collectionSlice';
import {useTheme} from '../../contexts/ThemeContext';
import {
  COLLECTION_PHOTO_URL,
  EMessage,
  screenHeight,
  screenWidth,
} from '../../utils/constants';
import FastImage from 'react-native-fast-image';
import AppIcon from '../common/AppIcon';
import axios from 'axios';
import {useMe} from '../../hooks/useMe';
import {useRoute} from '@react-navigation/native';
import db from './../../db/Database';
import {handleSetWallpaper} from '../../utils/functions';

const PhotoView = ({
  photo,
  onRefreshPhoto,
}: {
  photo: Photo;
  onRefreshPhoto?: (photo: Photo) => void;
}) => {
  const {me} = useMe();
  const {paletteColor} = useTheme();
  const route = useRoute();
  const isIOS = Platform.OS === 'ios';

  const onToggleLove = async () => {
    const currentDateTime = new Date().toISOString();
    onRefreshPhoto &&
      onRefreshPhoto({
        ...photo,
        loved_at: photo.loved_at ? null : currentDateTime,
      });
    await db.toggleLove(photo.url);
    if (photo.loved_at) {
      ToastAndroid.showWithGravityAndOffset(
        'Bạn đã bỏ hình ảnh khỏi mục yêu thích',
        2000,
        0,
        0,
        0,
      );
    } else {
      ToastAndroid.show('Bạn đã thêm hình ảnh vào mục yêu thích', 2000);
    }
  };

  const onShare = () => {
    try {
      Share.open({
        url: COLLECTION_PHOTO_URL.replace('PHOTO_ID', item.url),
      });
    } catch (e) {
      console.log('e', e);
    }
  };
  const onSend = async () => {
    const msgData = {
      uid: me.id,
      username: me.name,
      message: photo.url,
      type: EMessage.photo,
    };

    console.log('msgData', msgData);
    try {
      const response = await axios.post(
        'http://192.168.0.104:3000/messages',
        msgData,
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  return (
    <View
      style={{
        // padding: 4,
        height: '100%',
        width: screenWidth,
        position: 'relative',
        backgroundColor: paletteColor.bg,
      }}>
      <View
        style={{
          width: screenWidth - 8,
          height: screenHeight - 8,
        }}>
        <FastImage
          style={styles.photo}
          source={{
            uri: COLLECTION_PHOTO_URL.replace('PHOTO_ID', photo.url),
          }}
          resizeMode={'contain'}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          right: 10,
          padding: 10,
          borderRadius: 30,
          zIndex: 99999,
          elevation: 99999,
          flexDirection: 'row',
          justifyContent: 'space-around',
          backgroundColor: paletteColor.text,
        }}>
        <TouchableOpacity style={styles.action_btn} onPress={() => onSend()}>
          <AppIcon
            name={'send'}
            type="FontAwesome"
            size={24}
            color={paletteColor.bg}
          />
          <Text style={{...styles.action_btn_text, color: paletteColor.bg}}>
            Gửi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action_btn} onPress={() => onShare()}>
          <AppIcon
            name={'share-social'}
            type="Ionicons"
            size={24}
            color={paletteColor.bg}
          />
          <Text style={{...styles.action_btn_text, color: paletteColor.bg}}>
            Chia sẻ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.action_btn}
          onPress={() => onToggleLove()}>
          <AppIcon
            name={photo.loved_at ? 'heart' : 'heart-outline'}
            type="Ionicons"
            size={24}
            color={paletteColor.bg}
          />
          <Text style={{...styles.action_btn_text, color: paletteColor.bg}}>
            Yêu thích
          </Text>
        </TouchableOpacity>
        {!isIOS && (
          <TouchableOpacity
            onPress={() => {
              handleSetWallpaper(photo.url);
            }}
            style={styles.action_btn}>
            <AppIcon
              name="wallpaper"
              type="MaterialCommunityIcons"
              size={24}
              color={paletteColor.bg}
            />
            <Text
              style={{
                ...styles.action_btn_text,
                color: paletteColor.bg,
              }}>
              Đặt hình nền
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default PhotoView;
const styles = StyleSheet.create({
  container: {
    // padding: 5,
    height: '100%',
    width: screenWidth,
    position: 'relative',
  },
  // layer: {
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   width: '100%',
  //   height: '100%',
  //   alignItems: 'flex-start',
  //   padding: 10,
  //   // zIndex: 8,
  // },
  back_btn: {
    paddingVertical: 2,
    paddingHorizontal: 20,
    borderRadius: 20,
    zIndex: 999,
    elevation: 999,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    zIndex: 99999,
  },
  action_bar: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    padding: 10,
    borderRadius: 30,
    zIndex: 999,
    elevation: 999,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  action_btn: {
    alignItems: 'center',
  },
  action_btn_text: {
    fontSize: 12,
  },
});
