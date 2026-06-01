import { useEffect, useState } from 'react';
import { api, getStoredTokens, setStoredTokens, clearTokens } from '../api';
import { User, AuthTokens } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokens = getStoredTokens();
    if (!tokens) {
      setLoading(false);
      return;
    }

    api.get('/users/me')
      .then(response => {
        setUser(response.data.user);
      })
      .catch(() => {
        clearTokens();
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    const tokens = response.data as AuthTokens & { user: User };
    setStoredTokens({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
    setUser(tokens.user);
    return tokens.user;
  }

  async function register(username: string, email: string, password: string) {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data.user as User;
  }

  function logout() {
    const tokens = getStoredTokens();
    if (tokens) {
      api.post('/auth/logout', { refreshToken: tokens.refreshToken }).catch(() => null);
    }
    clearTokens();
    setUser(null);
  }

  return { user, loading, login, register, logout };
}
