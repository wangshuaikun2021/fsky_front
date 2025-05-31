import axiosInstance from './axios';

// API functions for Diary Management

// 4.1 获取日记列表（支持分页和搜索）
export const getDiaries = async ({ page = 1, page_size = 10, search = '' } = {}) => {
  try {
    const response = await axiosInstance.get('/diaries/', {
      params: { page, page_size, search }
    });
    // 适配后端新结构 { total, page, page_size, diaries }
    return {
      total: response.total,
      page: response.page,
      page_size: response.page_size,
      diaries: response.diaries || []
    };
  } catch (error) {
    console.error('Error fetching diaries:', error);
    throw new Error(error.error || '获取日记列表失败');
  }
};

// 4.2 获取日记详情
export const getDiaryDetail = async (diaryId) => {
  try {
    const response = await axiosInstance.get(`/diaries/${diaryId}/`);
    return response; // 直接返回对象
  } catch (error) {
    console.error(`Error fetching diary ${diaryId}:`, error);
    throw new Error(error.error || '获取日记详情失败');
  }
};

// 4.3 创建日记
export const createDiary = async (diaryData) => {
  try {
    const response = await axiosInstance.post('/diaries/', diaryData);
    return response; // Assuming backend returns { "diary_id": integer }
  } catch (error) {
    console.error('Error creating diary:', error);
    throw new Error(error.error || '创建日记失败');
  }
};

// 4.4 更新日记
export const updateDiary = async (diaryId, diaryData) => {
  try {
    const response = await axiosInstance.put(`/diaries/${diaryId}/`, diaryData);
    return response; // Assuming backend returns { "status": "success" }
  } catch (error) {
    console.error(`Error updating diary ${diaryId}:`, error);
    throw new Error(error.error || '更新日记失败');
  }
};

// 4.5 删除日记
export const deleteDiary = async (diaryId) => {
  try {
    const response = await axiosInstance.delete(`/diaries/${diaryId}/`);
    return response; // Assuming backend returns { "status": "success" }
  } catch (error) {
    console.error(`Error deleting diary ${diaryId}:`, error);
    throw new Error(error.error || '删除日记失败');
  }
}; 