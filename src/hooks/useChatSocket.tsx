import io, {Socket} from 'socket.io-client';
import {FAN_CHAT_BASE_URL} from '../utils/constants';
import {IMessage} from '../components/FanChat/FanChatBox';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {addNb, setNewMessage} from '../redux/features/chatSlice';
import {useMe} from './useMe';

const socket = io(FAN_CHAT_BASE_URL);

export const useChatSocket = () => {
  const {me} = useMe();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('receiveMessage', (msg: IMessage) => {
      onReceiveMessage(msg);
    });
    return () => {
      socket.off('receiveMessage');
    };
  }, [me]);
  const onReceiveMessage = (msg: IMessage) => {
    dispatch(setNewMessage(msg));
    console.log(me?.id);
    console.log(msg?.uid);
    if (me?.id !== msg?.uid) {
      dispatch(addNb(1));
    }
  };
  return {};
};
