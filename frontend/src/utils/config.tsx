import axios from 'axios';

// Set the base URL for your API
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Add an interceptor to attach the Authorization header
axios.interceptors.request.use(
  (config) => {
    // Retrieve the token from wherever you store it (localStorage, cookies, etc.)
    const token = localStorage.getItem('accessToken');

    // Attach the token to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  },
);

export default axios;
