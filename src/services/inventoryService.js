import api from './api';

const notifyChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('easyvyaapaar-data-changed'));
  }
};

export const addStock = async (data) => {
  const res = await api.post('/inventory/add', data);
  notifyChange();
  return res;
};

export const removeStock = async (data) => {
  const res = await api.post('/inventory/remove', data);
  notifyChange();
  return res;
};

export const getLowStock = () => api.get('/inventory/low-stock');
export const getTransactions = (page = 0, size = 20) => api.get(`/inventory/transactions?page=${page}&size=${size}`);
export const getRecentTransactions = () => api.get('/inventory/transactions/recent');
