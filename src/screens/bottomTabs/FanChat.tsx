import {useEffect, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import FanChatBox from '../../components/FanChat/FanChatBox';
import StorageService from '../../db/StorageService';
import uuid from 'react-native-uuid';
import {useIsFocused} from '@react-navigation/native';
import AppIcon from '../../components/common/AppIcon';
import {useTheme} from '../../contexts/ThemeContext';
import {useMe} from '../../hooks/useMe';

const FanChat = () => {
  const {paletteColor} = useTheme();
  const isFocused = useIsFocused();
  const {me, setMe} = useMe();
  const [name, setName] = useState('');

  const onStartChat = async () => {
    const id = uuid.v4();
    const storage = StorageService.getInstance();
    setMe({
      name,
      id,
    });
    await storage.setItem('me', {
      data: {name, id},
    });
  };

  if (me === undefined) {
    return <></>;
  }
  return (
    <View
      style={{
        height: '100%',
        backgroundColor: paletteColor.bg,
      }}>
      {isFocused && (
        <View
          style={{
            flex: 1,
          }}>
          <FanChatBox me={me} />
        </View>
      )}
      {!me && (
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 4,
            paddingHorizontal: 8,
            alignItems: 'flex-end',
          }}>
          <View
            style={{
              flex: 1,
              paddingRight: 8,
            }}>
            <Text
              style={{
                fontSize: 12,
                color: paletteColor.text,
              }}>
              Để trò chuyện với mọi người hay nhập tên của bạn
            </Text>
            <TextInput
              value={name}
              onChangeText={text => setName(text)}
              placeholder="Nhập tên của bạn"
              style={{
                backgroundColor: paletteColor.text,
                borderRadius: 20,
                height: 40,
                paddingVertical: 0,
                paddingHorizontal: 8,
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              onStartChat();
            }}>
            <AppIcon
              type="Ionicons"
              name="enter"
              size={36}
              color={paletteColor.text}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default FanChat;
