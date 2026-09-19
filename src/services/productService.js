import api from './api';

export const getAllProducts = () => api.get('/products');
export const getLowStockProducts = () => api.get('/products/low-stock');
export const searchProducts = (q) => api.get(`/products/search?q=${q}`);
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
