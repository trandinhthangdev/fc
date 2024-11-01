import axios from 'axios';
import {Photo} from '../redux/features/collectionSlice';
import {EMessage, FAN_CHAT_BASE_URL} from '../utils/constants';
import {useMe} from './useMe';
import {ToastAndroid} from 'react-native';
import {useTranslation} from 'react-i18next';

export const useSendMessage = () => {
  const {t} = useTranslation();
  const {me} = useMe();
  const onSendPhoto = async (photo: Photo) => {
    const msgData = {
      uid: me.id,
      username: me.name,
      message: photo.url,
      type: EMessage.photo,
    };
    try {
      await axios.post(`${FAN_CHAT_BASE_URL}/messages`, msgData);
      ToastAndroid.showWithGravity(
        t('toast.sent_to_fan_Chat'),
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  const onSendQuiz = async (point: Number) => {
    const msgData = {
      uid: me.id,
      username: me.name,
      message: point,
      type: EMessage.quiz,
    };
    try {
      await axios.post(`${FAN_CHAT_BASE_URL}/messages`, msgData);
      ToastAndroid.showWithGravity(
        t('toast.sent_to_fan_Chat'),
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return {
    onSendPhoto,
    onSendQuiz,
  };
};
