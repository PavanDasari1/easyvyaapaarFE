import api from './api';

export const getAdminSummary = async () => {
  return await api.get('/admin/summary');
};

export const getAdminUsers = async () => {
  return await api.get('/admin/users');
};

export const getAdminShops = async () => {
  return await api.get('/admin/shops');
};
