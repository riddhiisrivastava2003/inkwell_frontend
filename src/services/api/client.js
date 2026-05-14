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

const PUBLIC_PATH_PREFIXES = [
  '/auth/login',
  '/auth/register',
  '/auth/register-admin',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/validate',
  '/posts/published',
  '/posts/slug',
  '/posts/category',
  '/posts/tag',
  '/categories',
  '/tags',
  '/newsletter/subscribe',
  '/newsletter/confirm',
  '/newsletter/unsubscribe',
  '/media/files/',
];

const isPublicPath = (url = '') => PUBLIC_PATH_PREFIXES.some((prefix) => url.startsWith(prefix));

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  const requestPath = config?.url || '';
  if (token && !isPublicPath(requestPath)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config?.headers?.Authorization) {
    delete config.headers.Authorization;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default apiClient;

