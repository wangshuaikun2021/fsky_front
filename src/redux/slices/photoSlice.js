import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  photos: [],
  loading: false,
  error: null,
};

const photoSlice = createSlice({
  name: 'photo',
  initialState,
  reducers: {
    setPhotos: (state, action) => {
      state.photos = action.payload;
    },
    addPhoto: (state, action) => {
      state.photos.unshift(action.payload);
    },
    updatePhoto: (state, action) => {
      const index = state.photos.findIndex(photo => photo.id === action.payload.id);
      if (index !== -1) {
        state.photos[index] = action.payload;
      }
    },
    deletePhoto: (state, action) => {
      state.photos = state.photos.filter(photo => photo.id !== action.payload);
    },
  },
});

export const { setPhotos, addPhoto, updatePhoto, deletePhoto } = photoSlice.actions;
export default photoSlice.reducer; 