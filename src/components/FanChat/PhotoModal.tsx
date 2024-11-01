import {Modal, Text, View} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import CollectionGrid, {ETabView} from '../Collection/CollectionGrid';
import {Photo} from '../../redux/features/collectionSlice';
import {useSendMessage} from '../../hooks/useSendMessage';

const PhotoModal = ({open, onClose}: {open: boolean; onClose: () => void}) => {
  const {paletteColor} = useTheme();
  const {onSendPhoto} = useSendMessage();

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
            onSendPhoto(photo);
            onClose();
          }}
        />
      </View>
    </Modal>
  );
};
export default PhotoModal;
