import api from './api';

export const addStock = (data) => api.post('/inventory/add', data);
export const removeStock = (data) => api.post('/inventory/remove', data);
export const getLowStock = () => api.get('/inventory/low-stock');
export const getTransactions = (page = 0, size = 20) => api.get(`/inventory/transactions?page=${page}&size=${size}`);
export const getRecentTransactions = () => api.get('/inventory/transactions/recent');
