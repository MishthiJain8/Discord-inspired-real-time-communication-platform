import axios from 'axios';
import { AuthTokens } from './types';

const api = axios.create({ baseURL: '/api', withCredentials: true });

function getStoredTokens() {
  const raw = localStorage.getItem('authTokens');
  return raw ? (JSON.parse(raw) as AuthTokens) : null;
}

function setStoredTokens(tokens: AuthTokens) {
  localStorage.setItem('authTokens', JSON.stringify(tokens));
}

function clearTokens() {
  localStorage.removeItem('authTokens');
}

api.interceptors.request.use(config => {
  const tokens = getStoredTokens();
  if (tokens && config.headers) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const tokens = getStoredTokens();
        if (!tokens) throw new Error('Missing tokens');
        const response = await axios.post('/api/auth/refresh', { refreshToken: tokens.refreshToken });
        const nextTokens = response.data;
        setStoredTokens(nextTokens);
        originalRequest.headers.Authorization = `Bearer ${nextTokens.accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        clearTokens();
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export { api, getStoredTokens, setStoredTokens, clearTokens };
