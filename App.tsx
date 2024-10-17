/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import Quiz from './src/screens/Quiz';
import {createStackNavigator} from '@react-navigation/stack';
import Info from './src/screens/Info';
import Collection from './src/screens/Collection';
import Playlist from './src/screens/Playlist';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import VerticalPiano from './src/restore/game/VerticalPiano';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AppIcon from './src/components/common/AppIcon';
import PhotoPreview from './src/screens/PhotoPreview';
import {EThemeMode, ThemeProvider, useTheme} from './src/contexts/ThemeContext';
import IdolChat from './src/screens/IdolChat';
import {PALETTE_COLOR} from './src/utils/constants';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function App(): React.JSX.Element {
  const isIOS = Platform.OS === 'ios';
  const TabCus = props => {
    const {themeColor, paletteColor} = useTheme();
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => {
            let iconName = '';
            let iconType = '';

            if (route.name === 'Playlist') {
              iconName = focused ? 'playlist-music' : 'playlist-music-outline';
              iconType = 'MaterialCommunityIcons';
            } else if (route.name === 'Collection') {
              iconName = focused ? 'collections' : 'collections';
              iconType = 'MaterialIcons';
            } else if (route.name === 'Quiz') {
              iconName = focused ? 'quiz' : 'quiz';
              iconType = 'MaterialIcons';
            } else if (route.name === 'Info') {
              iconName = focused
                ? 'information-circle'
                : 'information-circle-outline';
              iconType = 'Ionicons';
            } else if (route.name === 'IdolChat') {
              iconName = focused ? 'chatbubble' : 'chatbubble-outline';
              iconType = 'Ionicons';
            }

            // You can return any component that you like here!
            return (
              <AppIcon
                type={iconType}
                name={iconName}
                size={size}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: paletteColor.text,
          tabBarInactiveTintColor: '#9DB2BF',
          tabBarStyle: {
            borderTopWidth: 0,
            backgroundColor: paletteColor.bg,
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
          },
        })}>
        {!isIOS && <Stack.Screen name="Playlist" component={Playlist} />}
        <Stack.Screen name="Collection" component={Collection} />
        {/* <Stack.Screen name="Quiz" component={Quiz} /> */}
        <Stack.Screen name="IdolChat" component={IdolChat} />
        <Stack.Screen name="Info" component={Info} />
      </Tab.Navigator>
    );
  };
  return (
    <SafeAreaView
      style={{
        height: '100%',
      }}>
      <ThemeProvider>
        <Provider store={store}>
          {/* <View
        style={{
          height: '100%',
          backgroundColor: '#fff',
        }}> */}
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name={'TabCus'}
                component={TabCus}
                options={{
                  header: props => {
                    return <></>;
                  },
                }}
              />
              {/* <Stack.Screen name="Home" component={Home} /> */}
              <Stack.Screen name="VerticalPiano" component={VerticalPiano} />
              <Stack.Screen
                name="PhotoPreview"
                component={PhotoPreview}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
          {/* </View> */}
        </Provider>
      </ThemeProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

export default App;
