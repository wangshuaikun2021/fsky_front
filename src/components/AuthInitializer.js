import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFailure } from '../redux/slices/authSlice';
import axiosInstance from '../api/axios';
import { Spin } from 'antd';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);
  const [isAuthAttempted, setIsAuthAttempted] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          console.log('AuthInitializer: Fetching user info with token...', token);
          const response = await axiosInstance.get('/user-info/');
          console.log('AuthInitializer: Received user info response data', response);
          
          const payload = {
            user: response.user,
            token: token
          };
          
          console.log('AuthInitializer: Dispatching loginSuccess with payload', payload);
          dispatch(loginSuccess(payload));
          console.log('AuthInitializer: loginSuccess dispatched.');
          
        } catch (error) {
          console.error('AuthInitializer: Failed to restore session:', error);
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
        <Spin size="large" tip="加载认证信息..." />
      </div>
    );
  }

  return children;
};

export default AuthInitializer; 