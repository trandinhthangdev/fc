import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IMessage} from '../../components/FanChat/FanChatBox';

interface ChatState {
  nbM: number;
  newMessage: IMessage | null;
}

const initialState: ChatState = {
  nbM: 0,
  newMessage: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addNb(state, action: PayloadAction<number>) {
      state.nbM += action.payload;
    },
    setNb(state, action: PayloadAction<number>) {
      state.nbM = action.payload;
    },
    setNewMessage(state, action: PayloadAction<IMessage>) {
      state.newMessage = action.payload;
    },
  },
});

export const {addNb, setNb, setNewMessage} = chatSlice.actions;

export default chatSlice.reducer;
