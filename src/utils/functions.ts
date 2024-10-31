import {NativeModules, ToastAndroid, Platform} from 'react-native';
const {WallpaperModule, DeviceIdModule} = NativeModules;

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

export const getDeviceId = async () => {
  try {
    if (Platform.OS === 'android') {
      const androidId = await DeviceIdModule.getAndroidId();
      console.log('Android ID:', androidId);
      return androidId;
    } else if (Platform.OS === 'ios') {
      const vendorId = await DeviceIdModule.getVendorId();
      console.log('iOS Vendor ID:', vendorId);
      return vendorId;
    }
  } catch (error) {
    console.error(error);
  }
};

export const formatDate = (date: Date) => {
  const now = new Date();

  // Format parts
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Check if the date is today
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return `${hours}:${minutes}`;
  } else {
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
};
