import axios from 'axios';

// Create a global Axios instance for non-Firebase HTTP requests
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example request interceptor (e.g., attaching tokens)
api.interceptors.request.use(
  (config) => {
    // Modify config here before request is sent
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Example response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
