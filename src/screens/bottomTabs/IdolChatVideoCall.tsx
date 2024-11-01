import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import LayoutApp from '../../components/layout/LayoutApp';
import {useTranslation} from 'react-i18next';

const IdolChatVideoCall = props => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {themeColor, paletteColor} = useTheme();
  return (
    <LayoutApp title="Trò chuyện với J97">
      <View
        style={{
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
        }}>
        <TouchableOpacity
          style={{
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderRadius: 16,
            alignItems: 'center',
            backgroundColor: '#F5EFFF',
          }}
          onPress={() => {
            navigation.navigate('IdolChatBox');
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 14,
              color: '#4A628A',
              marginBottom: 8,
            }}>
            {t('idol_fake.message_with')} {t('name_idol')}
          </Text>
          <Image
            source={require('./../../assets/chat.png')}
            style={{
              width: 120,
              height: 120,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderRadius: 16,
            alignItems: 'center',
            backgroundColor: '#D4F6FF',
          }}
          onPress={() => {
            navigation.navigate('IdolVideoCallBox');
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 14,
              color: '#6482AD',
              marginBottom: 8,
            }}>
            {t('idol_fake.videocall_with')} {t('name_idol')}
          </Text>
          <Image
            source={require('./../../assets/videocall.png')}
            style={{
              width: 120,
              height: 120,
            }}
          />
        </TouchableOpacity>
      </View>
    </LayoutApp>
  );
};

export default IdolChatVideoCall;
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  start_chat_wrapper: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chat_item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  chat_item_icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
  },
  chat_item_text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chat_item_sub_text: {
    fontWeight: 300,
  },
  start_chat_btn: {
    padding: 20,
    borderRadius: 40,

    alignItems: 'center',
    marginVertical: 10,
    width: 220,
  },
  start_chat_btn_text: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});
