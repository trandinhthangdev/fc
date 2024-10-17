import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export enum EMode {
  dark = 'dark',
  light = 'light',
  device = 'device',
}

interface SettingState {
  mode: EMode;
}

const initialState: SettingState = {
  mode: EMode.device,
};

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<EMode>) {
      state.mode = action.payload;
    },
  },
});

export const {setMode} = settingSlice.actions;

export default settingSlice.reducer;
