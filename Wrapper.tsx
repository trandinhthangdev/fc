import React from 'react';
import {Platform, SafeAreaView, Text, View} from 'react-native';
import QuizScreen from './src/screens/bottomTabs/QuizScreen';
import {createStackNavigator} from '@react-navigation/stack';
import InfoScreen from './src/screens/bottomTabs/InfoScreen';
import CollectionScreen from './src/screens/bottomTabs/CollectionScreen';
import PlaylistScreen from './src/screens/bottomTabs/PlaylistScreen';
import {NavigationContainer} from '@react-navigation/native';
import {useAppSelector} from './src/redux/store';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AppIcon from './src/components/common/AppIcon';
import PhotoPreviewScreen from './src/screens/stacks/collections/PhotoPreviewScreen';
import {ThemeProvider, useTheme} from './src/contexts/ThemeContext';
import FakeIdolScreen from './src/screens/bottomTabs/FakeIdolScreen';
import IdolChatBoxScreen from './src/screens/stacks/fakeidol/IdolChatBoxScreen';
import FanCommunityScreen from './src/screens/bottomTabs/FanCommunityScreen';
import PlaySongScreen from './src/screens/stacks/playlist/PlaySongScreen';
import IdolVideoCallBoxScreen from './src/screens/stacks/fakeidol/IdolVideoCallBoxScreen';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n';
import {useChatSocket} from './src/hooks/useChatSocket';
import {ScreenName} from './src/utils/constants';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Wrapper(): React.JSX.Element {
  const isIOS = Platform.OS === 'ios';
  useChatSocket();
  const TabCus = () => {
    const {themeColor, paletteColor} = useTheme();
    const {nbM} = useAppSelector(state => state.chat);
    console.log('nbM', nbM);
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => {
            let iconName = '';
            let iconType = '';
            switch (route.name) {
              case ScreenName.PlaylistScreen:
                iconName = focused
                  ? 'playlist-music'
                  : 'playlist-music-outline';
                iconType = 'MaterialCommunityIcons';
                break;
              case ScreenName.CollectionScreen:
                iconName = focused ? 'collections' : 'collections';
                iconType = 'MaterialIcons';
                break;
              case ScreenName.FakeIdolScreen:
                iconName = focused ? 'videocam' : 'videocam-outline';
                iconType = 'Ionicons';
                break;
              case ScreenName.FanCommunityScreen:
                iconName = focused ? 'wechat' : 'wechat';
                iconType = 'MaterialCommunityIcons';
                break;
              case ScreenName.QuizScreen:
                iconName = focused ? 'quiz' : 'quiz';
                iconType = 'MaterialIcons';
                break;
              case ScreenName.InfoScreen:
                iconName = focused
                  ? 'information-circle'
                  : 'information-circle-outline';
                iconType = 'Ionicons';
                break;
              default:
                break;
            }

            return (
              <View>
                <AppIcon
                  type={iconType}
                  name={iconName}
                  size={size}
                  color={color}
                />
                {!focused &&
                  route.name === ScreenName.FanCommunityScreen &&
                  nbM > 0 && (
                    <View
                      style={{
                        position: 'absolute',
                        right: -2,
                        top: -2,
                        backgroundColor: '#CC2B52',
                        paddingVertical: 0,
                        paddingHorizontal: 4,
                        borderRadius: 20,
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 9,
                          fontWeight: 'bold',
                        }}>
                        {nbM > 99 ? '99+' : nbM > 9 ? '9+' : nbM}
                      </Text>
                    </View>
                  )}
              </View>
            );
          },
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
        {!isIOS && (
          <Stack.Screen
            name={ScreenName.PlaylistScreen}
            component={PlaylistScreen}
          />
        )}
        <Stack.Screen
          name={ScreenName.CollectionScreen}
          component={CollectionScreen}
        />
        <Stack.Screen
          name={ScreenName.FakeIdolScreen}
          component={FakeIdolScreen}
        />
        <Stack.Screen
          name={ScreenName.FanCommunityScreen}
          component={FanCommunityScreen}
        />
        <Stack.Screen name={ScreenName.QuizScreen} component={QuizScreen} />
        <Stack.Screen name={ScreenName.InfoScreen} component={InfoScreen} />
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
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name={ScreenName.TabCustomScreen}
                component={TabCus}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name={ScreenName.PhotoPreviewScreen}
                component={PhotoPreviewScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name={ScreenName.IdolChatBoxScreen}
                component={IdolChatBoxScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name={ScreenName.IdolVideoCallBoxScreen}
                component={IdolVideoCallBoxScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name={ScreenName.PlaySongScreen}
                component={PlaySongScreen}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaView>
    </I18nextProvider>
  );
}

export default Wrapper;
