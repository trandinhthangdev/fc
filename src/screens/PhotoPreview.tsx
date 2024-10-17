import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {
  COLLECTION_PHOTO_URL,
  screenHeight,
  screenWidth,
} from '../utils/constants';
import {useEffect, useRef, useState} from 'react';
import AppIcon from '../components/common/AppIcon';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {handleSetWallpaper} from '../utils/functions';
import {useNavigation} from '@react-navigation/native';
import db from './../db/Database';
import {Photo} from '../redux/features/collectionSlice';
import Share from 'react-native-share';
import {useTheme} from '../contexts/ThemeContext';

const PhotoPreview = ({route}) => {
  const isIOS = Platform.OS === 'ios';
  const {paletteColor} = useTheme();
  const navigation = useNavigation();
  const {item, onRefreshPhoto} = route.params;
  const [photo, setPhoto] = useState<Photo>(item);
  const onToggleLove = async () => {
    const currentDateTime = new Date().toISOString();
    onRefreshPhoto({
      ...photo,
      loved_at: photo.loved_at ? null : currentDateTime,
    });
    setPhoto(prev => ({
      ...prev,
      loved_at: prev.loved_at ? null : currentDateTime,
    }));
    await db.toggleLove(photo.url);
    if (photo.loved_at) {
      ToastAndroid.show('Bạn đã bỏ hình ảnh khỏi mục yêu thích', 2000);
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
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: paletteColor.bg,
      }}>
      <Image
        style={styles.photo}
        source={{
          uri: COLLECTION_PHOTO_URL.replace('PHOTO_ID', item.url),
        }}
      />
      <View style={styles.layer}>
        <TouchableOpacity
          style={{...styles.back_btn, backgroundColor: paletteColor.text}}
          onPress={() => {
            navigation.goBack();
          }}>
          <AppIcon
            name="arrow-back"
            type="Ionicons"
            size={24}
            color={paletteColor.bg}
          />
        </TouchableOpacity>
      </View>
      <View style={{...styles.action_bar, backgroundColor: paletteColor.text}}>
        {/* <TouchableOpacity
          style={styles.action_btn}
          onPress={() => onToggleLove()}>
          <AppIcon
            name="download"
            type="Ionicons"
            size={24}
            color={'#001F3F'}
          />
          <Text style={styles.action_btn_text}>Tải về</Text>
        </TouchableOpacity> */}
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
            <Text style={{...styles.action_btn_text, color: paletteColor.bg}}>
              Đặt hình nền
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default PhotoPreview;

const styles = StyleSheet.create({
  container: {
    padding: 5,
    height: '100%',
    width: screenWidth,
    position: 'relative',
  },
  layer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'flex-start',
    padding: 10,
  },
  back_btn: {
    // backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 2,
    paddingHorizontal: 20,
    borderRadius: 20,
    zIndex: 999,
    elevation: 999,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 20,
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
