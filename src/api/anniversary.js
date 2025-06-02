import axiosInstance from './axios';

// 获取纪念日列表
export const getAnniversaries = async () => {
  const res = await axiosInstance.get('/anniversaries/');
  return res.anniversaries || res; // 兼容不同返回结构
};

// 添加纪念日
export const addAnniversary = async (data) => {
  return await axiosInstance.post('/anniversaries/', data);
};

// 编辑纪念日
export const updateAnniversary = async (id, data) => {
  return await axiosInstance.put(`/anniversaries/${id}/`, data);
};

// 删除纪念日
export const deleteAnniversary = async (id) => {
  return await axiosInstance.delete(`/anniversaries/${id}/`);
}; 