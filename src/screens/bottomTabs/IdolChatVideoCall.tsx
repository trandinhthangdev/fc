import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import ChatBox from '../../components/IdolChat/ChatBox';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import AppIcon from '../../components/common/AppIcon';
import LayoutApp from '../../components/layout/LayoutApp';

const IdolChatVideoCall = props => {
  const navigation = useNavigation();
  const {themeColor, paletteColor} = useTheme();
  const [isShowChatBot, setIsShowChatBot] = useState(false);
  return (
    <LayoutApp title="Trò chuyện với J97">
      <View
        style={{
          ...styles.container,
          backgroundColor: paletteColor.bg,
        }}>
        <TouchableOpacity
          style={{
            ...styles.start_chat_btn,
            backgroundColor: paletteColor.text,
          }}
          onPress={() => {
            navigation.navigate('IdolChatBox');
          }}>
          <AppIcon
            type="Ionicons"
            name="chatbubble"
            color={paletteColor.bg}
            size={24}
          />
          <Text
            style={{
              ...styles.start_chat_btn_text,
              color: paletteColor.bg,
            }}>
            Nhắn tin với Jack
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.start_chat_btn,
            backgroundColor: paletteColor.text,
          }}
          onPress={() => {
            navigation.navigate('IdolVideoCallBox');
          }}>
          <AppIcon
            type="Ionicons"
            name="videocam"
            color={paletteColor.bg}
            size={24}
          />
          <Text
            style={{
              ...styles.start_chat_btn_text,
              color: paletteColor.bg,
            }}>
            Gọi video với Jack
          </Text>
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
    flexDirection: 'row',
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
