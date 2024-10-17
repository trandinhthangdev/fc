import React, {useEffect, useRef} from 'react';
import {View, Image, StyleSheet, Animated, Easing} from 'react-native';

const RunningDisk = ({imageUri, isFullscreen, isPlaying}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let animation;

    const startAnimation = () => {
      animation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 5000 * 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      animation.start();
    };

    if (isPlaying) {
      startAnimation();
    } else {
      rotateAnim.stopAnimation();
    }

    return () => {
      rotateAnim.stopAnimation();
    };
  }, [isPlaying, rotateAnim]);
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${360 * 100}deg`],
  });
  return (
    <View style={styles.container}>
      <Animated.Image
        source={{uri: imageUri}}
        style={[
          isFullscreen ? styles.disk : styles.disk_mini,
          {transform: [{rotate}]},
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  disk: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  disk_mini: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#ddd',
  },
});

export default RunningDisk;
