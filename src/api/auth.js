import axiosInstance from './axios';

export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post('/login/', { username, password });
    if (response.token && response.user) {
      return {
        user: {
          ...response.user,
          is_partner: response.user.is_partner || false,
          partner: response.user.partner || null
        },
        token: response.token
      };
    }
    throw new Error('登录响应格式错误');
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.error || '登录失败，请检查用户名和密码');
  }
};

export const register = async (username, password, nickname) => {
  try {
    const response = await axiosInstance.post('/register/', { 
      username, 
      password, 
      nickname 
    });
    if (response.token && response.user) {
      return {
        user: {
          ...response.user,
          is_partner: response.user.is_partner || false,
          partner: response.user.partner || null
        },
        token: response.token
      };
    }
    throw new Error('注册响应格式错误');
  } catch (error) {
    console.error('Register error:', error);
    throw new Error(error.error || '注册失败，请稍后重试');
  }
};

export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get('/user-info/');
    return {
      user: {
        ...response.user,
        is_partner: response.user.is_partner || false,
        partner: response.user.partner || null
      }
    };
  } catch (error) {
    console.error('Get user info error:', error);
    throw new Error(error.error || '获取用户信息失败');
  }
};

export const updateUserInfo = async (userData) => {
  try {
    const formData = new FormData();

    // Append text fields from userData
    for (const key in userData) {
      if (userData.hasOwnProperty(key)) {
        // Handle nested profile data by stringifying or appending individually
        if (key === 'profile' && typeof userData[key] === 'object') {
           for (const profileKey in userData[key]) {
             if (userData[key].hasOwnProperty(profileKey)) {
               formData.append(`profile.${profileKey}`, userData[key][profileKey]);
             }
           }
        } else if (userData[key] !== undefined && userData[key] !== null) {
           formData.append(key, userData[key]);
        }
      }
    }

    // If avatar file exists, append it
    if (userData.avatar_file) {
      formData.append('avatar', userData.avatar_file);
    }

    // Log formData content for debugging (optional)
    // for (let [key, value] of formData.entries()) {
    //     console.log(`${key}: ${value}`);
    // }

    const response = await axiosInstance.patch('/user/update/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Update user info error:', error);
    throw new Error(error.error || '更新个人资料失败');
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await axiosInstance.post('/user/change-password/', passwordData);
    return response;
  } catch (error) {
    console.error('Change password error:', error);
    throw new Error(error.error || '修改密码失败');
  }
};

export const logout = () => {
  return axiosInstance.post('/logout/').catch(error => {
    console.error('Logout error:', error);
    throw new Error(error.error || '登出失败');
  });
};

export const bindPartner = async (partnerUsername) => {
  try {
    const response = await axiosInstance.post('/bind-partner/', { 
      partner_username: partnerUsername 
    });
    return {
      partner: response.partner,
      message: response.message
    };
  } catch (error) {
    console.error('Bind partner error:', error);
    throw new Error(error.error || '绑定伴侣失败，请稍后重试');
  }
};

export const unbindPartner = async () => {
  try {
    const response = await axiosInstance.post('/unbind-partner/');
    return {
      message: response.message
    };
  } catch (error) {
    console.error('Unbind partner error:', error);
    throw new Error(error.error || '解除绑定失败，请稍后重试');
  }
}; 