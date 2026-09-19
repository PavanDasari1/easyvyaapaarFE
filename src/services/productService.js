import api from './api';

const notifyChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('easyvyaapaar-data-changed'));
  }
};

export const getAllProducts = () => api.get('/products');
export const getLowStockProducts = () => api.get('/products/low-stock');
export const searchProducts = (q) => api.get(`/products/search?q=${q}`);
export const getProduct = (id) => api.get(`/products/${id}`);

export const createProduct = async (data) => {
  const res = await api.post('/products', data);
  notifyChange();
  return res;
};

export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  notifyChange();
  return res;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  notifyChange();
  return res;
};
