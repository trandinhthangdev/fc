import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Song {
  code: string;
  name: string;
  has_lyric: boolean;
  loved_at?: string | null;
}

export enum ELoop {
  loop_once = 'loop_once',
  loop_all = 'loop_all',
}

export interface IScript {
  code: string;
  data: any[];
}

interface PlayListState {
  songPlaying: Song | null;
  songs: Song[];
  shuffle: boolean;
  loop: ELoop;
  scripts: Record<string, any[]>;
}

const initialState: PlayListState = {
  songPlaying: null,
  songs: [],
  shuffle: false,
  loop: ELoop.loop_all,
  scripts: {},
};

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setSongPlaying(state, action: PayloadAction<Song>) {
      state.songPlaying = action.payload;
    },
    addSongs(state, action: PayloadAction<Song[]>) {
      state.songs = [...action.payload];
    },
    onNextSong(state) {
      if (state.shuffle) {
        const songsExpectPlaying = state.songs.filter(
          song => song.code !== state.songPlaying?.code,
        );
        state.songPlaying =
          songsExpectPlaying[
            Math.floor(Math.random() * songsExpectPlaying.length)
          ];
      } else {
        const indexPlaying = state.songs.findIndex(
          song => song.code === state.songPlaying?.code,
        );
        if (indexPlaying === state.songs.length - 1) {
          state.songPlaying = state.songs[0];
        } else {
          state.songPlaying = state.songs[indexPlaying + 1];
        }
      }
    },
    onPrevSong(state) {
      if (state.shuffle) {
        const songsExpectPlaying = state.songs.filter(
          song => song.code !== state.songPlaying?.code,
        );
        state.songPlaying =
          songsExpectPlaying[
            Math.floor(Math.random() * songsExpectPlaying.length)
          ];
      } else {
        const indexPlaying = state.songs.findIndex(
          song => song.code === state.songPlaying?.code,
        );
        if (indexPlaying === 0) {
          state.songPlaying = state.songs[state.songs.length - 1];
        } else {
          state.songPlaying = state.songs[indexPlaying - 1];
        }
      }
    },
    onToggleSuffle(state) {
      state.shuffle = !state.shuffle;
    },
    setSuffle(state, action: PayloadAction<boolean>) {
      state.shuffle = action.payload;
    },
    onToggleLoop(state) {
      state.loop =
        state.loop === ELoop.loop_all ? ELoop.loop_once : ELoop.loop_all;
    },
    setLoop(state, action: PayloadAction<ELoop>) {
      state.loop = action.payload;
    },
    addScripts(state, action: PayloadAction<IScript>) {
      state.scripts = {
        ...state.scripts,
        [action.payload.code]: action.payload.data,
      };
    },
  },
});

export const {
  setSongPlaying,
  addSongs,
  onNextSong,
  onPrevSong,
  onToggleSuffle,
  onToggleLoop,
  setSuffle,
  setLoop,
  addScripts,
} = playlistSlice.actions;

export default playlistSlice.reducer;
