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
    throw {
      error: error.error || '登录失败，请检查用户名和密码'
    };
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
    throw {
      error: error.error || '注册失败，请稍后重试'
    };
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
    throw {
      error: error.error || '获取用户信息失败'
    };
  }
};

export const logout = () => {
  return axiosInstance.post('/logout/');
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
    throw {
      error: error.error || '绑定伴侣失败，请稍后重试'
    };
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
    throw {
      error: error.error || '解除绑定失败，请稍后重试'
    };
  }
}; 