import React, {useState, useRef} from 'react';
import {
  View,
  TextInput,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import axios from 'axios';
import {EThemeMode, useTheme} from '../../../contexts/ThemeContext';
import TypingAnimation from '../../../components/TypingAnimation';
import {CHAT_WITH_IDOL_API_URL} from '../../../utils/constants';
import AppIcon from '../../../components/common/AppIcon';
import {useNavigation} from '@react-navigation/native';

type Message = {
  id: string;
  sender: 'user' | 'idol';
  text: string;
};

const IdolChatBoxScreen = () => {
  const navigation = useNavigation();
  const {themeColor, paletteColor} = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    setIsLoading(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 100);

    try {
      const response = await axios.post(CHAT_WITH_IDOL_API_URL, {
        conversations: [
          'Chào em bạn, mình là ca sĩ J97',
          ...messages.map(item => item.text),
          input,
        ],
      });
      const idolMessage: Message = {
        id: Date.now().toString(),
        sender: 'idol',
        text: response.data?.message ?? '',
      };
      setMessages(prevMessages => [...prevMessages, idolMessage]);
      scrollViewRef.current?.scrollToEnd({animated: true});
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        sender: 'idol',
        text: 'Hihi😘',
      };

      setMessages(prevMessages => [...prevMessages, errorMessage]);
      scrollViewRef.current?.scrollToEnd({animated: true});
    }
    setIsLoading(false);
  };
  const idol_hello = {
    id: Date.now().toString(),
    sender: 'idol',
    text: 'Chào em! Anh J97 đây! Rất vui được trò chuyện với em!',
  };
  return (
    <View style={styles[`${themeColor}_container`]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles[`${themeColor}_exit_btn`]}
          onPress={() => {
            navigation.goBack();
          }}>
          <AppIcon
            type="Ionicons"
            name="exit"
            size={24}
            color={themeColor === 'dark' ? '#fff' : '#3C4048'}
          />
        </TouchableOpacity>
        <Text style={styles[`${themeColor}_header_text`]}>
          Phòng chat riêng của bạn với J97
        </Text>
      </View>
      <ScrollView
        style={styles.messagesList}
        ref={scrollViewRef}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({animated: true})
        }>
        {[idol_hello, ...messages].map((message, index) => (
          <View
            key={index}
            style={[
              styles.message_container,
              message.sender === 'user'
                ? styles.user_message_container
                : styles.idol_message_container,
            ]}>
            {message.sender === 'idol' && (
              <Image
                style={styles.message_avatar}
                source={require('./../../../assets/jack.jpeg')}
              />
            )}
            <View
              key={message.id}
              style={[
                styles.message_content,
                message.sender === 'user'
                  ? {
                      ...styles.user_message_content,
                      backgroundColor:
                        themeColor === EThemeMode.dark ? '#EE66A6' : '#EE66A6',
                    }
                  : {
                      ...styles.idol_message_content,
                      backgroundColor:
                        themeColor === EThemeMode.dark ? '#4A4947' : '#F5F5F7',
                    },
              ]}>
              <Text
                style={{
                  ...styles.message_content_text,
                  ...(message.sender === 'user'
                    ? {color: '#fff'}
                    : {color: paletteColor.text}),
                }}>
                {message.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      {isLoading && <TypingAnimation />}
      <View style={styles.input_container}>
        <TextInput
          style={{
            ...styles.input,
            borderWidth: 0.5,
            borderColor: paletteColor.text,
            color: paletteColor.text,
          }}
          placeholderTextColor={paletteColor.text}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          editable={!isLoading}
        />
        <TouchableOpacity onPress={() => sendMessage()} disabled={isLoading}>
          <AppIcon
            type="Ionicons"
            name="send"
            size={24}
            color={paletteColor.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  light_container: {
    flex: 1,
  },
  dark_container: {
    flex: 1,
  },
  header: {
    padding: 10,
    alignItems: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  light_exit_btn: {
    position: 'absolute',
    left: 10,
    top: 10,
    transform: [{rotate: '180deg'}],
  },
  dark_exit_btn: {
    position: 'absolute',
    left: 10,
    top: 10,
    transform: [{rotate: '180deg'}],
  },
  light_header_text: {},
  dark_header_text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messagesContent: {
    paddingBottom: 10,
  },
  message_container: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  user_message_container: {justifyContent: 'flex-end'},
  idol_message_container: {},
  message_content: {
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  user_message_content: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  idol_message_content: {
    backgroundColor: '#EAEAEA',
    alignSelf: 'flex-start',
  },
  message_avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 5,
  },
  message_content_text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  input_container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
});

export default IdolChatBoxScreen;
