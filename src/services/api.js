import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept responses to unwrap ApiResponse
api.interceptors.response.use(
  (response) => {
    return response.data; // Return the body directly
  },
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

export default api;
