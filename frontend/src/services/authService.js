import api from './api';

export const authService = {
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data.data; // { email }
  },
  verifyEmail: async (token) => {
    const res = await api.get(`/auth/verify/${token}`);
    return res.data;
  },
  forgotPassword: async (email) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },
  resetPassword: async (token, password) => {
    const res = await api.post(`/auth/reset-password/${token}`, { password });
    return res.data;
  },
  login: async (data) => {
    const res = await api.post('/auth/login', data);
    return res.data.data;
  },
  logout: async () => {
    await api.post('/auth/logout');
  },
  refresh: async (refreshToken) => {
    const res = await api.post('/auth/refresh', { refreshToken });
    return res.data.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data.data;
  },
};
