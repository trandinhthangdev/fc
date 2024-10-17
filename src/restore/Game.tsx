import {Text, TouchableOpacity, View} from 'react-native';

const Game = ({navigation}) => {
  return (
    <View>
      <Text>Game</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('VerticalPiano', {});
        }}>
        <Text>Vertical Piano</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Game;
