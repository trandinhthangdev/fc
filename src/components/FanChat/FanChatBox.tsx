import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  FlatList,
  TextInput,
  Button,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import io, {Socket} from 'socket.io-client';
import axios from 'axios';
import AppIcon from '../common/AppIcon';
import {useTheme} from '../../contexts/ThemeContext';
import {formatDate} from '../../utils/functions';
import {
  COLLECTION_PHOTO_URL,
  EMessage,
  FAN_CHAT_BASE_URL,
  screenWidth,
} from '../../utils/constants';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import PhotoModal from './PhotoModal';
import {useIsFocused} from '@react-navigation/native';
import {useAppSelector} from '../../redux/store';
import {useDispatch} from 'react-redux';
import {setNb} from '../../redux/features/chatSlice';
export interface IMessage {
  username: string;
  message: string;
  time: Date;
  type: EMessage;
}

const socket = io(FAN_CHAT_BASE_URL);

const FanChatBox = ({me}: {me: any}) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {newMessage} = useAppSelector(state => state.chat);

  const flatListRef = useRef(null);
  const {paletteColor} = useTheme();
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [openPhotoModal, setOpenPhotoModal] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    fetchMessages(page);
  }, []);
  useEffect(() => {
    if (isFocused) {
      dispatch(setNb(0));
    }
  }, [isFocused]);

  useEffect(() => {
    if (newMessage) {
      setMessages(currentMessages =>
        _.uniqBy([newMessage, ...currentMessages], '_id'),
      );
    }
  }, [newMessage]);

  const fetchMessages = async (pageNum: number) => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `${FAN_CHAT_BASE_URL}/messages?page=${pageNum}&limit=10`,
      );
      const {messages: fetchedMessages, totalPages} = response.data;
      setMessages(prevMessages =>
        _.uniqBy([...prevMessages, ...fetchedMessages], '_id'),
      );
      setHasMore(pageNum < totalPages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (message.trim()) {
      const msgData = {
        uid: me.id,
        username: me.name,
        message,
      };
      try {
        await axios.post(`${FAN_CHAT_BASE_URL}/messages`, msgData);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const loadMoreMessages = () => {
    console.log('hasMorehasMore', hasMore);
    if (hasMore && !loading) {
      // flatListRef.current?.scrollToEnd({animated: false});

      setPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchMessages(nextPage);
        return nextPage;
      });
    }
  };
  console.log(messages[0]);
  return (
    <>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <FlatList
          ref={flatListRef}
          style={{
            padding: 4,
          }}
          data={messages}
          inverted
          keyExtractor={(item, index) => item._id}
          renderItem={({item}) => {
            const isMe = item?.uid === me?.id;
            const isPhoto = item.type === EMessage.photo;
            const isQuiz = item.type === EMessage.quiz;
            return (
              <View
                style={{
                  marginVertical: 10,
                  flexDirection: 'row',
                  ...(isMe
                    ? {
                        justifyContent: 'flex-end',
                      }
                    : {}),
                }}>
                <View style={{}}>
                  {!isMe && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 4,
                      }}>
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          backgroundColor: '#FFC746',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 4,
                        }}>
                        <Image
                          source={require('./../../assets/domdom.png')}
                          style={{
                            width: 24,
                            height: 24,
                          }}
                        />
                      </View>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: '#000E08',
                          fontSize: 14,
                        }}>
                        {item.username}
                      </Text>
                    </View>
                  )}
                  <View
                    style={{
                      ...(isPhoto
                        ? {
                            width: 150,
                          }
                        : {
                            maxWidth: screenWidth - 80,
                          }),
                      ...(isMe
                        ? {paddingRight: 8}
                        : {alignItems: 'flex-end', paddingLeft: 16}),
                    }}>
                    <View
                      style={{
                        borderRadius: 16,
                        ...(isPhoto
                          ? {
                              paddingVertical: 4,
                              paddingHorizontal: 8,
                            }
                          : {paddingVertical: 8, paddingHorizontal: 16}),
                        width: '100%',
                        ...(isMe
                          ? {
                              borderTopRightRadius: 0,
                              backgroundColor: '#20A090',
                            }
                          : {
                              borderTopLeftRadius: 0,
                              backgroundColor: '#F2F7FB',
                            }),
                      }}>
                      {isPhoto ? (
                        <View
                          style={{
                            width: '100%',
                            maxHeight: 120,
                          }}>
                          <FastImage
                            source={{
                              uri: COLLECTION_PHOTO_URL.replace(
                                'PHOTO_ID',
                                item.message.trim(),
                              ),
                            }}
                            style={{
                              height: '100%',
                            }}
                            resizeMode={'contain'}
                          />
                        </View>
                      ) : isQuiz ? (
                        <View
                          style={{
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontSize: 12,
                              ...(isMe ? {color: '#fff'} : {color: '#000E08'}),
                            }}>
                            Ai là Đóm Đóm
                          </Text>
                          <Image
                            source={require('./../../assets/quiz.png')}
                            style={{
                              width: 60,
                              height: 60,
                            }}
                          />
                          <Text
                            style={{
                              ...(isMe ? {color: '#fff'} : {color: '#000E08'}),
                            }}>
                            <Text>Điểm số: </Text>
                            <Text
                              style={{
                                fontWeight: 'bold',
                              }}>
                              {item.message}
                            </Text>
                          </Text>
                        </View>
                      ) : (
                        <Text
                          style={{
                            ...(isMe
                              ? {textAlign: 'right', color: '#fff'}
                              : {textAlign: 'left', color: '#000E08'}),
                          }}>
                          {item.message.trim()}
                        </Text>
                      )}
                    </View>
                    <Text
                      style={{
                        color: '#797C7B',
                        fontSize: 12,
                        ...(isMe
                          ? {
                              marginLeft: 8,
                            }
                          : {marginRight: 8}),
                      }}>
                      {formatDate(new Date(item.time))}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
          onEndReached={loadMoreMessages}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && (
              <View
                style={{
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ActivityIndicator size="small" />
              </View>
            )
          }
        />

        {me && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 4,
              gap: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 48,
                backgroundColor: '#F3F6F6',
                borderRadius: 16,
                flex: 1,
                paddingLeft: 8,
              }}>
              <TouchableOpacity onPress={() => setOpenPhotoModal(true)}>
                <AppIcon
                  type="Ionicons"
                  name="image"
                  size={24}
                  color={'#20A090'}
                />
              </TouchableOpacity>
              <TextInput
                placeholder="Write your message"
                value={message}
                onChangeText={text => setMessage(text)}
                style={{
                  height: '100%',
                  paddingHorizontal: 8,
                }}
                placeholderTextColor={'#797C7B'}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                sendMessage();
              }}>
              <AppIcon
                type="Ionicons"
                name="send"
                size={24}
                color={'#20A090'}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {openPhotoModal && (
        <PhotoModal
          open={openPhotoModal}
          onClose={() => setOpenPhotoModal(false)}
        />
      )}
    </>
  );
};

export default FanChatBox;
