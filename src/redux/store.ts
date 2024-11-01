import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import playlistSlice from './features/playlistSlice';
import collectionSlice from './features/collectionSlice';
import settingSlice from './features/settingSlice';
import userSlice from './features/userSlice';
import chatSlice from './features/chatSlice';
// import your reducers

const store = configureStore({
  reducer: {
    // add reducers here
    playlist: playlistSlice,
    collection: collectionSlice,
    setting: settingSlice,
    user: userSlice,
    chat: chatSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
