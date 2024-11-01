import {Dimensions} from 'react-native';
import {EThemeMode} from '../contexts/ThemeContext';

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;

export const PALETTE_COLOR = {
  [EThemeMode.dark]: {
    bg: '#151515',
    text: '#fff',
    // text_
  },
  [EThemeMode.light]: {
    bg: '#fff',
    text: '#151515',
  },
};

export const CHAT_WITH_IDOL_API_URL =
  'https://tarotapi.vercel.app/chat-with-idol-jack';

// collection
export const COLLECTION_PAGE_URL =
  'https://res.cloudinary.com/dieuruvm8/raw/upload/jack/collection/collections_pages.json';

export const COLLECTION_PHOTO_URL =
  'https://res.cloudinary.com/dieuruvm8/raw/upload/jack/collection/photos/PHOTO_ID.jpg';

// playlist
export const LAST_UPDATED_PLAYLIST_URL =
  'https://res.cloudinary.com/dieuruvm8/raw/upload/jack/playlist/last_updated_playlist.json';
export const PLAYLIST_URL =
  'https://res.cloudinary.com/dieuruvm8/raw/upload/jack/playlist/music.json';
export const PLAYLIST_AUDIO_URL =
  'https://res.cloudinary.com/dieuruvm8/raw/upload/jack/playlist/audio/SONG_ID.mp3';
export const PLAYLIST_COVER_URL =
  'https://res.cloudinary.com/dieuruvm8/raw/upload/jack/playlist/cover/SONG_ID.jpg';
export const PLAYLIST_SCRIPTS_URL =
  'https://res.cloudinary.com/dieuruvm8/raw/upload/jack/playlist/scripts/SONG_ID.json';

export enum EMessage {
  text = 'text',
  photo = 'photo',
  song = 'song',
  quiz = 'quiz',
}

export const LANG_CODE = 'vi';

export enum ScreenName {
  PlaylistScreen = 'PlaylistScreen',
  CollectionScreen = 'CollectionScreen',
  FakeIdolScreen = 'FakeIdolScreen',
  FanCommunityScreen = 'FanCommunityScreen',
  QuizScreen = 'QuizScreen',
  InfoScreen = 'InfoScreen',
  TabCustomScreen = 'TabCustomScreen',
  PlaySongScreen = 'PlaySongScreen',
  PhotoPreviewScreen = 'PhotoPreviewScreen',
  IdolChatBoxScreen = 'IdolChatBoxScreen',
  IdolVideoCallBoxScreen = 'IdolVideoCallBoxScreen',
}

export const FAN_CHAT_BASE_URL = 'http://192.168.0.108:3000';
