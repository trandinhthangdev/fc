import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
function createRandomArray(length, n) {
  // Create an empty array
  let randomArray = [];

  // Fill the array with random numbers from 0 to n
  for (let i = 0; i < length; i++) {
    let randomNum = Math.floor(Math.random() * (n + 1));
    randomArray.push(randomNum);
  }

  return randomArray;
}
const PianoGame = props => {
  const data = createRandomArray(100, 3);
  console.log(data);

  return (
    <ScrollView style={{}}>
      {data.map((item, index) => {
        return (
          <View
            style={{
              flexDirection: 'row',
            }}>
            {[0, 1, 2, 3].map(col => {
              if (col === item) {
                return (
                  <View
                    style={{
                      height: 180,
                      flex: 1,
                      paddingVertical: 2,
                    }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: 'red',
                        width: '100%',
                        height: '100%',
                        padding: 10,
                        borderRadius: 10,
                      }}>
                      {index % 10 == 0 && (
                        <Image
                          style={{
                            width: '100%',
                            height: 120,
                            resizeMode: 'cover',
                          }}
                          source={{
                            uri: 'https://i.pinimg.com/564x/65/e6/29/65e629ecd8a30f5a94767f84b3c76aa6.jpg',
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                );
              }
              return (
                <View
                  style={{
                    height: 180,
                    flex: 1,
                    paddingVertical: 2,
                  }}></View>
              );
            })}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default PianoGame;
