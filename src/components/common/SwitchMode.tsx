import React, {useEffect, useState} from 'react';
import {StyleSheet, ToastAndroid} from 'react-native';
import {EThemeMode, useTheme} from '../../contexts/ThemeContext';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AppIcon from '../common/AppIcon';
import {useTranslation} from 'react-i18next';

const SwitchMode: React.FC = () => {
  const {t} = useTranslation();
  const {themeColor, theme, updateTheme, paletteColor} = useTheme();
  const [isHide, setIsHide] = useState(false);

  const handleToggle = () => {
    setIsHide(true);
    if (theme === EThemeMode.light) {
      updateTheme(EThemeMode.dark);
      ToastAndroid.showWithGravity(
        t('toast.theme_dark'),
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    } else if (theme === EThemeMode.dark) {
      updateTheme(EThemeMode.device);
      ToastAndroid.showWithGravity(
        t('toast.theme_system'),
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    } else {
      updateTheme(EThemeMode.light);
      ToastAndroid.showWithGravity(
        t('toast.theme_light'),
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    }
  };
  useEffect(() => {
    if (isHide) {
      setTimeout(() => {
        setIsHide(false);
      }, 200);
    }
  }, [isHide]);

  if (isHide) {
    return <></>;
  }
  return (
    <TouchableOpacity
      onPress={() => handleToggle()}
      style={styles.switch_mode_btn}>
      {theme === EThemeMode.light && (
        <AppIcon
          type="Ionicons"
          name="sunny"
          color={paletteColor.text}
          size={16}
        />
      )}
      {theme === EThemeMode.dark && (
        <AppIcon
          type="Ionicons"
          name="moon"
          color={paletteColor.text}
          size={16}
        />
      )}
      {theme === EThemeMode.device && (
        <AppIcon
          type="Ionicons"
          name="phone-portrait-outline"
          color={paletteColor.text}
          size={16}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switch_mode_btn: {
    zIndex: 999,
    elevation: 999,
  },
});

export default SwitchMode;
