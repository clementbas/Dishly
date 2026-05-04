import api from './api';

export const userService = {
  getProfile: async () => {
    const res = await api.get('/users/me');
    return res.data.data.user;
  },
  updateProfile: async (data) => {
    const res = await api.put('/users/me', data);
    return res.data.data.user;
  },
  uploadAvatar: async (file) => {
    const form = new FormData();
    form.append('avatar', file);
    const res = await api.post('/users/me/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  getFavorites: async (params = {}) => {
    const res = await api.get('/users/me/favorites', { params });
    return res.data.data;
  },
  addFavorite: async (recipeId) => {
    await api.post(`/users/me/favorites/${recipeId}`);
  },
  removeFavorite: async (recipeId) => {
    await api.delete(`/users/me/favorites/${recipeId}`);
  },
  getPublicProfile: async (id) => {
    const res = await api.get(`/users/${id}`);
    return res.data.data;
  },
};
