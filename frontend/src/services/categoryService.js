import api from './api';

export const categoryService = {
  getAll: async () => {
    const res = await api.get('/categories');
    return res.data.data.categories;
  },
  getById: async (id) => {
    const res = await api.get(`/categories/${id}`);
    return res.data.data;
  },
  create: async (data) => {
    const res = await api.post('/categories', data);
    return res.data.data.category;
  },
  update: async (id, data) => {
    const res = await api.put(`/categories/${id}`, data);
    return res.data.data.category;
  },
  delete: async (id) => {
    await api.delete(`/categories/${id}`);
  },
};
