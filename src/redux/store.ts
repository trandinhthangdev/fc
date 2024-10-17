import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import playlistSlice from './features/playlistSlice';
import collectionSlice from './features/collectionSlice';
import settingSlice from './features/settingSlice';
// import your reducers

const store = configureStore({
  reducer: {
    // add reducers here
    playlist: playlistSlice,
    collection: collectionSlice,
    setting: settingSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
