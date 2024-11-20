import axios from 'axios';
import { getCookie } from './CookieUtil'; // utils 디렉토리 안에 CookieUtil.js가 있는 경우

const axiosInstance = axios.create({
  baseURL: 'https://gachon-adore.duckdns.org:8111',
  timeout: 5000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  console.log('accessToken:', getCookie('accessToken')),
  (error) => Promise.reject(error)
);

export default axiosInstance;