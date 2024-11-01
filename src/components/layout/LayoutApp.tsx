import {Text, View} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {useRoute} from '@react-navigation/native';
import SwitchMode from '../common/SwitchMode';
import {ScrollView} from 'react-native-gesture-handler';

const LayoutApp = ({title, children, customStyle, left}) => {
  const {paletteColor} = useTheme();
  const route = useRoute();
  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: paletteColor.bg,
        ...(customStyle ? customStyle : {}),
      }}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 8,
          // backgroundColor: 'red',
        }}>
        {left && (
          <View
            style={{
              position: 'absolute',
              left: 8,
            }}>
            {left}
          </View>
        )}
        <Text
          style={{
            color: paletteColor.text,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 16,
          }}>
          {title ?? ''}
        </Text>
        <View
          style={{
            position: 'absolute',
            right: 8,
          }}>
          <SwitchMode />
        </View>
      </View>
      <View
        style={{
          flex: 1,
        }}>
        {children}
      </View>
    </View>
  );
};

export default LayoutApp;
