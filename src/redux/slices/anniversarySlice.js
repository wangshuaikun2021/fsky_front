import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  anniversaries: [],
  loading: false,
  error: null,
};

const anniversarySlice = createSlice({
  name: 'anniversary',
  initialState,
  reducers: {
    setAnniversaries: (state, action) => {
      state.anniversaries = action.payload;
    },
    addAnniversary: (state, action) => {
      state.anniversaries.push(action.payload);
    },
    updateAnniversary: (state, action) => {
      const index = state.anniversaries.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.anniversaries[index] = action.payload;
      }
    },
    deleteAnniversary: (state, action) => {
      state.anniversaries = state.anniversaries.filter(a => a.id !== action.payload);
    },
  },
});

export const { setAnniversaries, addAnniversary, updateAnniversary, deleteAnniversary } = anniversarySlice.actions;
export default anniversarySlice.reducer; 