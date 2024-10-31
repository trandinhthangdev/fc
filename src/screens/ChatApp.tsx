import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
} from 'react-native';
import socketIOClient from 'socket.io-client';

const host = 'http://192.168.0.105:3000';

interface Message {
  content: string;
  id: string;
}

const ChatApp: React.FC = () => {
  const [mess, setMess] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [id, setId] = useState<string | undefined>();

  const socketRef = useRef<any>();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host);

    socketRef.current.on('getId', (data: string) => {
      setId(data);
    });

    socketRef.current.on('sendDataServer', (dataGot: {data: Message}) => {
      setMess(oldMsgs => [...oldMsgs, dataGot.data]);
      scrollToBottom();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message) {
      const msg = {
        content: message,
        id: id!,
      };
      socketRef.current.emit('sendDataClient', msg);
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  };

  const renderMess = mess.map((m, index) => (
    <View
      key={index}
      style={[
        styles.chatItem,
        m.id === id ? styles.yourMessage : styles.otherMessage,
      ]}>
      <Text>{m.content}</Text>
    </View>
  ));

  const handleChange = (text: string) => {
    setMessage(text);
  };

  const onEnterPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView ref={scrollViewRef} style={styles.messageBox}>
        {renderMess}
      </ScrollView>

      <View style={styles.sendBox}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={handleChange}
          placeholder="Nhập tin nhắn ..."
          onSubmitEditing={sendMessage}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messageBox: {
    flex: 1,
    marginBottom: 10,
  },
  chatItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  yourMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f0f0',
  },
  sendBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});

export default ChatApp;
