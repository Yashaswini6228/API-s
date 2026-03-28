import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// 🔥 Global variable
let authToken = localStorage.getItem('accessToken') || null;

// ✅ Function to set token
export const setAuthToken = (token) => {
  authToken = token;
};

// ✅ Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("🔥 TOKEN USED:", authToken); // 👈 DEBUG

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;