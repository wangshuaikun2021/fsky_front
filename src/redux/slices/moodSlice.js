import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  moods: [],
  loading: false,
  error: null,
};

const moodSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {
    setMoods: (state, action) => {
      state.moods = action.payload;
    },
    addMood: (state, action) => {
      state.moods.unshift(action.payload);
    },
    updateMood: (state, action) => {
      const index = state.moods.findIndex(mood => mood.id === action.payload.id);
      if (index !== -1) {
        state.moods[index] = action.payload;
      }
    },
    deleteMood: (state, action) => {
      state.moods = state.moods.filter(mood => mood.id !== action.payload);
    },
  },
});

export const { setMoods, addMood, updateMood, deleteMood } = moodSlice.actions;
export default moodSlice.reducer; 