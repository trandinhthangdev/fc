import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import ChatBox from '../components/IdolChat/ChatBox';
import {useState} from 'react';

const IdolChat = props => {
  const {themeColor, paletteColor} = useTheme();
  const [isShowChatBot, setIsShowChatBot] = useState(false);
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: paletteColor.bg,
      }}>
      {isShowChatBot ? (
        <ChatBox onExitChat={() => setIsShowChatBot(false)} />
      ) : (
        <View style={styles.start_chat_wrapper}>
          <View style={styles.chat_item}>
            <Image
              style={styles.chat_item_icon}
              source={require('./../assets/jack.jpeg')}
            />
            <View>
              <Text
                style={{
                  ...styles.chat_item_text,
                  color: paletteColor.text,
                }}>
                Chào Đom Đóm!
              </Text>
              <Text
                style={{
                  ...styles.chat_item_sub_text,
                  color: paletteColor.text,
                }}>
                Trò chuyện chút với mình nha!
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              ...styles.start_chat_btn,
              backgroundColor: paletteColor.text,
            }}
            onPress={() => setIsShowChatBot(true)}>
            <Text
              style={{
                ...styles.start_chat_btn_text,
                color: paletteColor.bg,
              }}>
              Bắt đầu chat
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default IdolChat;
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  start_chat_btn_text: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
