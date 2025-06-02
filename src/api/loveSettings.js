import axiosInstance from './axios';

// 获取恋爱设置
export const getLoveSettings = async () => {
  return await axiosInstance.get('/love-settings/');
};

// 新建或全量更新恋爱设置（POST）
export const updateLoveSettings = async (data) => {
  return await axiosInstance.post('/love-settings/', data);
};

// 部分字段更新恋爱设置（PUT）
export const updateLoveSettingsPut = async (data) => {
  return await axiosInstance.put('/love-settings/', data);
}; 