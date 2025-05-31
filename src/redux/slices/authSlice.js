import { createSlice } from '@reduxjs/toolkit';
// Import baseURL from axios config
import axiosInstance from '../../api/axios';
const baseURL = axiosInstance.defaults.baseURL;

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null,
  partnerInfo: null, // 伴侣信息
  isPartner: false, // 是否是伴侣
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      console.log('loginSuccess: received payload', action.payload);
      const userPayload = action.payload?.user;
      console.log('loginSuccess: user payload', userPayload);

      state.loading = false;
      state.isAuthenticated = true;

      if (userPayload) {
        // Construct full avatar URL if it's a relative path
        if (userPayload.avatar && typeof userPayload.avatar === 'string' && userPayload.avatar.startsWith('/')) {
           userPayload.avatar = `${baseURL}${userPayload.avatar}`;
        }
        // Ensure partner avatar is also a full URL if it exists
        if (userPayload.partner?.avatar && typeof userPayload.partner.avatar === 'string' && userPayload.partner.avatar.startsWith('/')) {
           userPayload.partner.avatar = `${baseURL}${userPayload.partner.avatar}`;
        }

        state.user = userPayload;
        state.isPartner = userPayload.is_partner || false;
        state.partnerInfo = userPayload.partner || null;
      } else {
        // Fallback if user payload is unexpectedly missing
        state.user = null;
        state.isPartner = false;
        state.partnerInfo = null;
      }

      state.token = action.payload?.token || null;
      
      if (state.token) {
         localStorage.setItem('token', state.token);
      } else {
         localStorage.removeItem('token');
      }

      console.log('loginSuccess: state after update', { 
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        isPartner: state.isPartner,
        partnerInfo: state.partnerInfo,
        token: state.token
      });
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.isPartner = false;
      state.partnerInfo = null;
      localStorage.removeItem('token');
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.partnerInfo = null;
      state.isPartner = false;
      localStorage.removeItem('token');
    },
    updateUser: (state, action) => {
      // Create a mutable copy to modify avatar URL
      const updatedUser = { ...action.payload };

      // Construct full avatar URL if it's a relative path in the payload
      if (updatedUser.avatar && typeof updatedUser.avatar === 'string' && updatedUser.avatar.startsWith('/')) {
         updatedUser.avatar = `${baseURL}${updatedUser.avatar}`;
      }
      // Ensure partner avatar in updated user is also a full URL if it exists
      if (updatedUser.partner?.avatar && typeof updatedUser.partner.avatar === 'string' && updatedUser.partner.avatar.startsWith('/')) {
         updatedUser.partner.avatar = `${baseURL}${updatedUser.partner.avatar}`;
      }

      // Ensure the user object reference changes by creating a new object
      state.user = { ...state.user, ...updatedUser };

      // Update partner info if user object in payload has these fields
      if (updatedUser.is_partner !== undefined) {
          state.isPartner = updatedUser.is_partner;
      }
      if (updatedUser.partner !== undefined) {
          state.partnerInfo = updatedUser.partner;
      }
    },
    setPartnerInfo: (state, action) => {
      state.partnerInfo = action.payload;
      state.isPartner = true; // Setting partner info implies user is now a partner
    },
    removePartner: (state) => {
      state.partnerInfo = null;
      state.isPartner = false;
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  updateUser,
  setPartnerInfo,
  removePartner
} = authSlice.actions;

export default authSlice.reducer; 