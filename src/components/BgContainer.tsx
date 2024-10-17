import React, {useState} from 'react';
import {ImageBackground, SafeAreaView, StyleSheet, View} from 'react-native';
function BgContainer({children}): JSX.Element {
  return (
    <SafeAreaView>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <ImageBackground
          style={styles.bgImg}
          source={require('./../assets/bg_1.jpg')}>
          <View
            style={{
              zIndex: 999,
              elevation: 999,
              //   backgroundColor: 'red',
              //   position: 'absolute',
              //   top: 0,
              //   left: 0,
              //   right: 0,
              //   bottom: 0,
            }}>
            {children}
          </View>
          <View style={styles.bgOpacity}></View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'relative',
  },
  bgOpacity: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    elevation: 1,
  },
  bgImg: {
    height: '100%',
  },
});

export default BgContainer;
