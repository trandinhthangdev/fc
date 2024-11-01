import {
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Photo,
  updatePhotoCollection,
} from '../../redux/features/collectionSlice';
import {useTheme} from '../../contexts/ThemeContext';
import {COLLECTION_PHOTO_URL, screenWidth} from '../../utils/constants';
import FastImage from 'react-native-fast-image';
import AppIcon from '../common/AppIcon';
import {useMe} from '../../hooks/useMe';
import db from './../../db/Database';
import {fetchImageAsBase64, handleSetWallpaper} from '../../utils/functions';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import Share from 'react-native-share';
import {useSendMessage} from '../../hooks/useSendMessage';
import {useDispatch} from 'react-redux';

const PhotoView = ({photo}: {photo: Photo}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [item, setItem] = useState(photo);
  const {me} = useMe();
  const {paletteColor} = useTheme();
  const isIOS = Platform.OS === 'ios';
  const {onSendPhoto} = useSendMessage();

  const onToggleLove = async () => {
    const currentDateTime = new Date().toISOString();

    dispatch(
      updatePhotoCollection({
        ...item,
        loved_at: item.loved_at ? null : currentDateTime,
      }),
    );
    setItem(prev => ({
      ...prev,
      loved_at: prev.loved_at ? null : currentDateTime,
    }));
    await db.toggleLove(item.url);
    if (item.loved_at) {
      ToastAndroid.showWithGravity(
        t('toast.photo_unlove'),
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    } else {
      ToastAndroid.showWithGravity(
        t('toast.photo_love'),
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    }
  };

  const onShare = async () => {
    try {
      const base64Image = await fetchImageAsBase64(
        COLLECTION_PHOTO_URL.replace('PHOTO_ID', item.url),
      );
      if (base64Image) {
        await Share.open({
          url: `data:image/jpeg;base64,${base64Image}`,
          title: t('name_idol'),
        });
      }
    } catch (e) {
      console.log('e', e);
    }
  };

  return (
    <View
      style={{
        height: '100%',
        width: screenWidth - 16,
        position: 'relative',
      }}>
      <View
        style={{
          padding: 8,
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
        {me && (
          <TouchableOpacity
            style={styles.action_btn}
            onPress={() => onSendPhoto(photo)}>
            <AppIcon
              name={'send'}
              type="FontAwesome"
              size={24}
              color={paletteColor.bg}
            />
            <Text style={{...styles.action_btn_text, color: paletteColor.bg}}>
              {t('collection.send')}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.action_btn} onPress={() => onShare()}>
          <AppIcon
            name={'share-social'}
            type="Ionicons"
            size={24}
            color={paletteColor.bg}
          />
          <Text style={{...styles.action_btn_text, color: paletteColor.bg}}>
            {t('collection.share')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.action_btn}
          onPress={() => onToggleLove()}>
          <AppIcon
            name={item.loved_at ? 'heart' : 'heart-outline'}
            type="Ionicons"
            size={24}
            color={paletteColor.bg}
          />
          <Text style={{...styles.action_btn_text, color: paletteColor.bg}}>
            {t('collection.favorite')}
          </Text>
        </TouchableOpacity>
        {!isIOS && (
          <TouchableOpacity
            onPress={() => {
              handleSetWallpaper(
                COLLECTION_PHOTO_URL.replace('PHOTO_ID', photo.url),
              );
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
              {t('collection.set_wallpaper')}
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
