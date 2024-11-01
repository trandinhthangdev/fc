import React, {useEffect, useRef, useState} from 'react';
import {View, Animated, StyleSheet, Text, Button, Easing} from 'react-native';

interface ProgressBarProps {
  progress: number; // Progress percentage (0 to 100)
  duration?: number; // Optional animation duration in ms
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  duration = 1000,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress, // Target value for the animation
      duration: duration, // Duration of animation
      easing: Easing.inOut(Easing.ease), // Smooth easing function
      useNativeDriver: false, // We are animating width, so we don't use native driver
    }).start();
  }, [progress]);

  const widthInterpolation = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={{
        ...styles.progressBar,
        ...(progress === 100 ? {backgroundColor: '#640D5F'} : {}),
      }}>
      <Animated.View style={[styles.progress, {width: widthInterpolation}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#F5EFFF',
    borderRadius: 10,
    overflow: 'hidden',
    maxWidth: 240,
  },
  progress: {
    height: '100%',
    backgroundColor: '#640D5F',
  },
});
export default ProgressBar;
