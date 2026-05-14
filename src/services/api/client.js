import axios from 'axios';
import { API_TIMEOUT } from '../../utils/constants';
import { getStoredToken } from '../../utils/auth';

const PROD_GATEWAY_URL = 'https://api-gateway-a7ax.onrender.com';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? PROD_GATEWAY_URL : '/api-gw');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default apiClient;

