import api from './api';

export const adminService = {
  getAllUsers: async (params = {}) => {
    const res = await api.get('/users/admin/all', { params });
    return res.data.data;
  },
  updateUserRole: async (id, role) => {
    const res = await api.put(`/users/admin/${id}`, { role });
    return res.data.data.user;
  },
  deleteUser: async (id) => {
    await api.delete(`/users/admin/${id}`);
  },
};
