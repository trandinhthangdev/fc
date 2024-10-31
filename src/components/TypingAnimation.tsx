import React, {useEffect, useRef} from 'react';
import {Animated, Text, View, StyleSheet} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';

const TypingAnimation = () => {
  const {themeColor} = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeInOut = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => fadeInOut());
    };

    fadeInOut();
  }, [opacity]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles[`${themeColor}_typing_text`], {opacity}]}>
        Typing...
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  light_typing_text: {
    fontSize: 12,
    color: '#555',
  },
  dark_typing_text: {
    fontSize: 12,
    color: '#fff',
  },
});

export default TypingAnimation;
