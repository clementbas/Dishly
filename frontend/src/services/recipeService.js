import api from './api';

export const recipeService = {
  getAll: async (params = {}) => {
    const res = await api.get('/recipes', { params });
    return res.data.data;
  },
  getMine: async (params = {}) => {
    const res = await api.get('/recipes/mine', { params });
    return res.data.data;
  },
  getById: async (id) => {
    const res = await api.get(`/recipes/${id}`);
    return res.data.data.recipe;
  },
  create: async (data) => {
    const res = await api.post('/recipes', data);
    return res.data.data.recipe;
  },
  update: async (id, data) => {
    const res = await api.put(`/recipes/${id}`, data);
    return res.data.data.recipe;
  },
  delete: async (id) => {
    await api.delete(`/recipes/${id}`);
  },
  uploadImage: async (id, file) => {
    const form = new FormData();
    form.append('image', file);
    const res = await api.post(`/recipes/${id}/image`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data.imageUrl;
  },
};
