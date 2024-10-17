import {NativeModules, ToastAndroid} from 'react-native';
const {WallpaperModule} = NativeModules;

export const getRandomItems = <T>(arr: T[], num: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

export const handleSetWallpaper = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const reader = new FileReader();

  reader.onloadend = () => {
    setWallpaper(reader.result.split(',')[1]);
  };

  reader.readAsDataURL(blob);
};

const setWallpaper = async (base64Image: string) => {
  try {
    const result = await WallpaperModule.setWallpaper(base64Image);
    console.log(result);
    ToastAndroid.show('Ảnh đã được sử dụng làm hình nền', 2000);
  } catch (e) {
    console.error(e);
  }
};

export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
