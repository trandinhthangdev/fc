import React from 'react';
import {View, StyleSheet, Animated} from 'react-native';

const SkeletonLoader = () => {
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.skeleton, styles.skeletonTitle]} />
      <Animated.View style={[styles.skeleton, styles.skeletonText]} />
      <Animated.View style={[styles.skeleton, styles.skeletonText]} />
      <Animated.View style={[styles.skeleton, styles.skeletonButton]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  skeleton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonTitle: {
    height: 20,
    width: '80%',
  },
  skeletonText: {
    height: 15,
    width: '100%',
  },
  skeletonButton: {
    height: 40,
    width: '50%',
    alignSelf: 'flex-start',
  },
});

export default SkeletonLoader;
