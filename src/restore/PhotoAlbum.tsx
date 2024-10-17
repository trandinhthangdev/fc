import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {NativeModules} from 'react-native';

// console.log('NativeModules', NativeModules);
const {WallpaperModule} = NativeModules;
const data = [
  'https://i.pinimg.com/564x/f9/9f/f3/f99ff3dcbd75f3074cec35e32dd34e69.jpg',
  'https://i.pinimg.com/564x/cb/3c/29/cb3c29a61cddc85d01f2f9b1716c046d.jpg',
  'https://i.pinimg.com/564x/bc/cc/b4/bcccb4d6e1df8574403baaf24b88b98e.jpg',
  'https://i.pinimg.com/564x/37/f4/89/37f489d5582e18825725105d24c75fe4.jpg',
  'https://i.pinimg.com/564x/51/a1/15/51a1156deeab8e501f21da5843a617b5.jpg',
  'https://i.pinimg.com/736x/57/47/86/574786349d32db0247aeaba91adf60de.jpg',
];

const setWallpaper = async (base64Image: string) => {
  try {
    const result = await WallpaperModule.setWallpaper(base64Image);
    console.log(result);
  } catch (e) {
    console.error(e);
  }
};

const PhotoAlbum = props => {
  const handleSetWallpaper = async url => {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();

    reader.onloadend = () => {
      setWallpaper(reader.result.split(',')[1]);
    };

    reader.readAsDataURL(blob);
  };
  return (
    <ScrollView>
      {/* <Text>PhotoAlbum</Text> */}
      <View>
        {data.map(item => {
          return (
            <TouchableOpacity
              onPress={() => {
                handleSetWallpaper(item);
              }}>
              <Image
                source={{uri: item}}
                style={{
                  width: 120,
                  height: 180,
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default PhotoAlbum;
