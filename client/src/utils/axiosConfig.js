import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// ✅ Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Always read token from localStorage on each request
    const token = localStorage.getItem('accessToken');
    console.log("🔥 TOKEN USED:", token); // 👈 DEBUG

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Function to set token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
};

export default axiosInstance;