import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UserState {
  me: any;
}

const initialState: UserState = {
  me: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setMe(state, action: PayloadAction<any>) {
      state.me = action.payload;
    },
  },
});

export const {setMe} = userSlice.actions;

export default userSlice.reducer;
