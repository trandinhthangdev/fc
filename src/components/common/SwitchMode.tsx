// SwitchMode.tsx
import React from 'react';
import {View, Text, Switch, StyleSheet} from 'react-native';
import {EThemeMode, useTheme} from '../../contexts/ThemeContext';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AppIcon from '../common/AppIcon';

const SwitchMode: React.FC = () => {
  const {themeColor, theme, updateTheme, paletteColor} = useTheme();

  const handleToggle = () => {
    if (theme === EThemeMode.light) updateTheme(EThemeMode.dark);
    else if (theme === EThemeMode.dark) updateTheme(EThemeMode.device);
    else updateTheme(EThemeMode.light);
  };

  return (
    <TouchableOpacity
      onPress={() => handleToggle()}
      style={styles.switch_mode_btn}>
      {theme === EThemeMode.light && (
        <AppIcon
          type="Ionicons"
          name="sunny"
          color={paletteColor.text}
          size={24}
        />
      )}
      {theme === EThemeMode.dark && (
        <AppIcon
          type="Ionicons"
          name="moon"
          color={paletteColor.text}
          size={24}
        />
      )}
      {theme === EThemeMode.device && (
        <AppIcon
          type="Ionicons"
          name="phone-portrait-outline"
          color={paletteColor.text}
          size={24}
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
