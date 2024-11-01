import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Photo {
  url: string;
  width: number;
  height: number;
  loved_at: string | null;
}

interface Page {
  id: number;
  url: string;
}

interface PlayListState {
  collection: Photo[];
  pagesFetched: Page[] | null;
}

const initialState: PlayListState = {
  collection: [],
  pagesFetched: null,
};

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    addPhotos(state, action: PayloadAction<Photo[]>) {
      state.collection = [...state.collection, ...action.payload];
    },
    setCollection(state, action: PayloadAction<Photo[]>) {
      state.collection = action.payload;
    },
    addPagesFetched(state, action: PayloadAction<Page>) {
      state.pagesFetched = state.pagesFetched
        ? [...state.pagesFetched, action.payload]
        : [action.payload];
    },
    setPageFetched(state, action: PayloadAction<Page[]>) {
      state.pagesFetched = action.payload;
    },
    updatePhotoCollection(state, action: PayloadAction<Photo>) {
      state.collection = state.collection.map(item =>
        item.url === action.payload.url ? action.payload : item,
      );
    },
  },
});

export const {
  addPhotos,
  setCollection,
  addPagesFetched,
  setPageFetched,
  updatePhotoCollection,
} = collectionSlice.actions;

export default collectionSlice.reducer;
