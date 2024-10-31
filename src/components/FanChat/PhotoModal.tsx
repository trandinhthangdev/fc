import {Modal, Text, View} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {useCollection} from '../../hooks/useCollection';
import CollectionGrid, {ETabView} from '../Collection/CollectionGrid';
import {Photo} from '../../redux/features/collectionSlice';
import axios from 'axios';
import {EMessage} from '../../utils/constants';
import {useMe} from '../../hooks/useMe';

const PhotoModal = ({open, onClose}: {open: boolean; onClose: () => void}) => {
  const {me} = useMe();
  const {paletteColor} = useTheme();
  const onSend = async (photo: Photo) => {
    const msgData = {
      uid: me.id,
      username: me.name,
      message: photo.url,
      type: EMessage.photo,
    };

    console.log('msgData', msgData);
    try {
      // Send the message to the backend API
      const response = await axios.post(
        'http://192.168.0.104:3000/messages',
        msgData,
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={() => {
        onClose();
      }}>
      <View
        style={{
          // backgroundColor:
          backgroundColor: paletteColor.bg,
          width: '100%',
          height: '100%',
        }}>
        <CollectionGrid
          type={ETabView.tab_all}
          onPressPhoto={(photo: Photo) => {
            console.log(photo);
            onSend(photo);
            onClose();
          }}
        />
      </View>
    </Modal>
  );
};
export default PhotoModal;
