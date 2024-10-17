// ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Appearance, ColorSchemeName, useColorScheme} from 'react-native';
import StorageService from '../db/StorageService';
import {PALETTE_COLOR} from '../utils/constants';

export enum EThemeMode {
  light = 'light',
  dark = 'dark',
  device = 'device',
}

interface PaletteColor {
  bg: string;
  text: string;
}

interface ThemeContextProps {
  theme: EThemeMode;
  themeColor: string;
  paletteColor: PaletteColor;
  updateTheme: (theme: EThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: EThemeMode.device,
  themeColor: EThemeMode.light,
  updateTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [theme, setTheme] = useState<EThemeMode>(EThemeMode.device);

  const [themeColor, setThemeColor] = useState(
    theme === EThemeMode.device ? Appearance.getColorScheme() : theme,
  );
  useEffect(() => {
    getThemeInit();
  }, []);
  const getThemeInit = async () => {
    try {
      const storage = StorageService.getInstance();
      const {data: initTheme} = await storage.getItem('theme');
      if (initTheme) setTheme(initTheme);
    } catch (e) {
      console.log('e', e);
    }
  };

  useEffect(() => {
    setThemeColor(
      theme === EThemeMode.device ? Appearance.getColorScheme() : theme,
    );
    const listener = ({colorScheme}: {colorScheme: any}) => {
      if (theme === EThemeMode.device) {
        setThemeColor(colorScheme);
      }
    };

    const subscription = Appearance.addChangeListener(listener);

    return () => subscription.remove();
  }, [theme]);

  const updateTheme = async (theme: EThemeMode) => {
    setTheme(theme);

    const storage = StorageService.getInstance();
    await storage.setItem('theme', {
      data: theme,
    });
  };
  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeColor: themeColor ?? EThemeMode.light,
        paletteColor: PALETTE_COLOR[themeColor],
        updateTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};
