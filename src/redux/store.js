import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import diaryReducer from './slices/diarySlice';
import photoReducer from './slices/photoSlice';
import musicReducer from './slices/musicSlice';
import moodReducer from './slices/moodSlice';
import anniversaryReducer from './slices/anniversarySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    diary: diaryReducer,
    photo: photoReducer,
    music: musicReducer,
    mood: moodReducer,
    anniversary: anniversaryReducer,
  },
}); 