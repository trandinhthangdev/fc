import React, {useEffect, useRef, useState} from 'react';
import {View, Animated, Dimensions, StyleSheet} from 'react-native';
import Firefly from '../components/Firefly';
import {getRandomInt} from '../utils/functions';

const {width, height} = Dimensions.get('window');

const generateRandomPosition = () => ({
  x: Math.random() * width,
  y: Math.random() * height,
});

const generateFireflies = (count: number) => {
  return Array.from({length: count}, () => ({
    id: Math.random().toString(),
    position: generateRandomPosition(),
    translateX: new Animated.Value(getRandomInt(0, 1000)),
    translateY: new Animated.Value(getRandomInt(0, 1000)),
    scale: new Animated.Value(Math.random()),
    opacity: new Animated.Value(Math.random()),
  }));
};

const FirefliesAnimation = () => {
  const [fireflies, setFireflies] = useState(generateFireflies(50));

  useEffect(() => {
    fireflies.forEach(firefly => {
      const animateFirefly = () => {
        const newPosition = generateRandomPosition();

        Animated.parallel([
          Animated.timing(firefly.translateX, {
            toValue: newPosition.x,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(firefly.translateY, {
            toValue: newPosition.y,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(firefly.scale, {
              toValue: 1.5,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(firefly.scale, {
              toValue: 0.5,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(firefly.opacity, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(firefly.opacity, {
              toValue: 0.3,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
        ]).start(animateFirefly);
      };

      animateFirefly();
    });
  }, [fireflies]);

  return (
    <View style={styles.container}>
      {fireflies.map(firefly => (
        <Animated.View
          key={firefly.id}
          style={[
            styles.firefly,
            {
              transform: [
                {translateX: firefly.translateX},
                {translateY: firefly.translateY},
                {scale: firefly.scale},
              ],
              opacity: firefly.opacity,
            },
          ]}>
          {/* <Firefly /> */}
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    position: 'relative',
  },
  firefly: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1.5,
    backgroundColor: 'yellow',
  },
});

export default FirefliesAnimation;
