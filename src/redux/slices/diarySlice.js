import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  diaries: [],
  loading: false,
  error: null,
};

const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    setDiaries: (state, action) => {
      state.diaries = action.payload;
    },
    addDiary: (state, action) => {
      state.diaries.unshift(action.payload);
    },
    updateDiary: (state, action) => {
      const index = state.diaries.findIndex(diary => diary.id === action.payload.id);
      if (index !== -1) {
        state.diaries[index] = action.payload;
      }
    },
    deleteDiary: (state, action) => {
      state.diaries = state.diaries.filter(diary => diary.id !== action.payload);
    },
  },
});

export const { setDiaries, addDiary, updateDiary, deleteDiary } = diarySlice.actions;
export default diarySlice.reducer; 