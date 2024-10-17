import {Image, Text, TouchableOpacity, View} from 'react-native';
import BgContainer from './components/BgContainer';
import AppIcon from './components/common/AppIcon';
import {useNavigation} from '@react-navigation/native';

const Home = props => {
  const navigation = useNavigation();

  return (
    <BgContainer>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          padding: 10,
        }}>
        <Text>Home</Text>
        <Image
          style={{
            width: 160,
            height: 240,
          }}
          source={require('./assets/logo.png')}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Info');
          }}>
          <AppIcon type="Ionicons" name="information-circle" />
          <Text>Info</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Playlist');
          }}>
          <AppIcon
            type="MaterialCommunityIcons"
            name="playlist-music-outline"
          />
          <Text>Playlist</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Collection');
          }}>
          <AppIcon type="MaterialIcons" name="collections" />
          <Text>Collection</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Game');
          }}>
          <AppIcon type="Ionicons" name="game-controller" />
          <Text>Game</Text>
        </TouchableOpacity>
      </View>
    </BgContainer>
  );
};

export default Home;
