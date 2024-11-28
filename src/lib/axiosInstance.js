import axios from 'axios';
import { getCookie } from './CookieUtil'; // lib 디렉토리 안에 CookieUtil.js가 있는 경우

// const gatewayURL = import.meta.env.VITE_GATEWAY_URL;

const axiosInstance = axios.create({
  baseURL: 'https://gachon-adore.duckdns.org',
  timeout: 10000,
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