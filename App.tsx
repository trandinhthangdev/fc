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

import Quiz from './src/screens/bottomTabs/Quiz';
import {createStackNavigator} from '@react-navigation/stack';
import Info from './src/screens/bottomTabs/Info';
import Collection from './src/screens/bottomTabs/Collection';
import Playlist from './src/screens/bottomTabs/Playlist';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import VerticalPiano from './src/restore/game/VerticalPiano';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AppIcon from './src/components/common/AppIcon';
import PhotoPreview from './src/screens/PhotoPreview';
import {EThemeMode, ThemeProvider, useTheme} from './src/contexts/ThemeContext';
import IdolChatVideoCall from './src/screens/bottomTabs/IdolChatVideoCall';
import {PALETTE_COLOR} from './src/utils/constants';
import GroupChat from './src/components/FanChat/FanChatBox';
import VideoCall from './src/screens/VideoCall';
import IdolChatBox from './src/screens/fakeidol/IdolChatBox';
import ChatApp from './src/screens/ChatApp';
import FanChat from './src/screens/bottomTabs/FanChat';
import PlayAudio from './src/screens/PlayAudio';
import TrackPlayer from 'react-native-track-player';
import playbackService from './service';
import PlaySongScreen from './src/screens/PlaySongScreen';
import IdolVideoCallBox from './src/screens/fakeidol/IdolVideoCallBox';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n';

TrackPlayer.registerPlaybackService(() => playbackService);

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
            } else if (route.name === 'IdolChatVideoCall') {
              iconName = focused ? 'chatbubble' : 'chatbubble-outline';
              iconType = 'Ionicons';
            } else if (route.name === 'GroupChat') {
              iconName = focused ? 'wechat' : 'wechat';
              iconType = 'MaterialCommunityIcons';
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
          // tabBarLabel: ({focused}) => {
          //   const labelByName = {
          //     Playlist: 'Danh sách nhạc',
          //     Collection: 'Bộ ảnh',
          //     IdolChatVideoCall: 'Trò chuyện J97',
          //     GroupChat: 'Cộng đồng fan',
          //     Quiz: 'Quiz',
          //     Info: 'Thông tin',
          //   };
          //   return focused ? (
          //     <Text
          //       style={{
          //         fontSize: 8,
          //         textAlign: 'center',
          //         marginTop: -8,
          //       }}>
          //       {labelByName[route.name]}
          //     </Text>
          //   ) : (
          //     ''
          //   );
          // },
          tabBarShowLabel: false,
          tabBarActiveTintColor: paletteColor.text,
          tabBarInactiveTintColor: '#9DB2BF',
          tabBarStyle: {
            borderTopWidth: 0,
            backgroundColor: paletteColor.bg,
            elevation: 0,
            shadowOpacity: 0,
          },
        })}>
        {!isIOS && <Stack.Screen name="Playlist" component={Playlist} />}
        <Stack.Screen name="Collection" component={Collection} />
        <Stack.Screen name="IdolChatVideoCall" component={IdolChatVideoCall} />
        <Stack.Screen name="GroupChat" component={FanChat} />
        <Stack.Screen name="Quiz" component={Quiz} />
        <Stack.Screen name="Info" component={Info} />
      </Tab.Navigator>
    );
  };
  return (
    <I18nextProvider i18n={i18n}>
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
                <Stack.Screen
                  name="VideoCall"
                  component={VideoCall}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="IdolChatBox"
                  component={IdolChatBox}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="IdolVideoCallBox"
                  component={IdolVideoCallBox}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="PlaySongScreen"
                  component={PlaySongScreen}
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
    </I18nextProvider>
  );
}

const styles = StyleSheet.create({});

export default App;
