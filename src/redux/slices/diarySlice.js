import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createDiary, updateDiary } from '../../api/diary';

const initialState = {
  diaries: [], // 日记列表
  currentDiary: null, // 当前查看的日记详情
  loading: false, // 加载状态
  error: null, // 错误信息
};

const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    // Action for fetching diaries
    fetchDiariesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDiariesSuccess: (state, action) => {
      state.loading = false;
      state.diaries = action.payload; // Assuming payload is an array of diaries
    },
    fetchDiariesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload; // Assuming payload is an error message
    },

    // Action for fetching single diary detail
    fetchDiaryDetailStart: (state) => {
      state.loading = true;
      state.error = null;
      state.currentDiary = null; // Clear previous detail when fetching new one
    },
    fetchDiaryDetailSuccess: (state, action) => {
      state.loading = false;
      state.currentDiary = action.payload; // Assuming payload is the diary object
    },
    fetchDiaryDetailFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload; // Assuming payload is an error message
      state.currentDiary = null;
    },

    // Action for creating a diary
    createDiaryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createDiarySuccess: (state, action) => {
      state.loading = false;
      // Optionally add the new diary to the list, or refetch the list
      // state.diaries.push(action.payload); // If backend returns full new diary
    },
    createDiaryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Action for updating a diary
    updateDiaryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateDiarySuccess: (state, action) => {
      state.loading = false;
      // Optionally update the diary in the list, or refetch the list
      // const index = state.diaries.findIndex(diary => diary.id === action.payload.id);
      // if (index !== -1) { state.diaries[index] = action.payload; }
      // If currentDiary is the one updated, update it as well
      // if (state.currentDiary?.id === action.payload.id) { state.currentDiary = action.payload; }
    },
    updateDiaryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Action for deleting a diary
    deleteDiaryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteDiarySuccess: (state, action) => {
      state.loading = false;
      // Optionally remove the diary from the list, or refetch the list
      // state.diaries = state.diaries.filter(diary => diary.id !== action.payload.id); // Assuming payload is { id: diaryId }
    },
    deleteDiaryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear current diary detail when leaving the detail page
    clearCurrentDiary: (state) => {
      state.currentDiary = null;
    }
  },
});

export const { 
  fetchDiariesStart,
  fetchDiariesSuccess,
  fetchDiariesFailure,
  fetchDiaryDetailStart,
  fetchDiaryDetailSuccess,
  fetchDiaryDetailFailure,
  createDiaryStart,
  createDiarySuccess,
  createDiaryFailure,
  updateDiaryStart,
  updateDiarySuccess,
  updateDiaryFailure,
  deleteDiaryStart,
  deleteDiarySuccess,
  deleteDiaryFailure,
  clearCurrentDiary
} = diarySlice.actions;

// 创建日记的异步 action
export const createDiaryAsync = createAsyncThunk(
  'diary/createDiary',
  async (diaryData, { rejectWithValue, dispatch }) => {
    try {
      dispatch(createDiaryStart());
      const response = await createDiary(diaryData);
      dispatch(createDiarySuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(createDiaryFailure(error.response?.data?.message || '创建日记失败'));
      return rejectWithValue(error.response?.data?.message || '创建日记失败');
    }
  }
);

// 更新日记的异步 action
export const updateDiaryAsync = createAsyncThunk(
  'diary/updateDiary',
  async ({ id, ...diaryData }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(updateDiaryStart());
      const response = await updateDiary(id, diaryData);
      dispatch(updateDiarySuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(updateDiaryFailure(error.response?.data?.message || '更新日记失败'));
      return rejectWithValue(error.response?.data?.message || '更新日记失败');
    }
  }
);

export default diarySlice.reducer; 