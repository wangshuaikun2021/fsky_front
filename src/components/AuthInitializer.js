import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFailure, updateLoveSettings, setLoveSettingsLoading } from '../redux/slices/authSlice';
import axiosInstance from '../api/axios';
import { getLoveSettings } from '../api/loveSettings';
import { Spin } from 'antd';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);
  const [isAuthAttempted, setIsAuthAttempted] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const response = await axiosInstance.get('/user-info/');
          
          const payload = {
            user: response.user,
            token: token
          };
          
          dispatch(loginSuccess(payload));
          
          // 获取用户信息成功后，也获取恋爱设置
          try {
            dispatch(setLoveSettingsLoading(true));
            const loveSettingsRes = await getLoveSettings();
            dispatch(updateLoveSettings(loveSettingsRes));
          } catch (loveError) {
            console.error('Failed to fetch love settings:', loveError);
            // 获取恋爱设置失败不影响整体登录流程
            dispatch(setLoveSettingsLoading(false));
          }
          
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.removeItem('token');
          dispatch(loginFailure(error.error || 'Failed to restore session'));
        } finally {
          setIsAuthAttempted(true);
        }
      } else {
        setIsAuthAttempted(true);
      }
    };

    if (token && !isAuthAttempted) {
      initializeAuth();
    } else if (!token) {
      setIsAuthAttempted(true);
    }
  }, [dispatch, token, isAuthAttempted]);

  if (!isAuthAttempted) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return children;
};

export default AuthInitializer; 