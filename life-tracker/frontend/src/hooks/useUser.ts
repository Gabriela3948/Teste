import { useState, useEffect } from 'react';
import type { User } from '../types';
import { getUser } from '../services/api';

const USER_KEY = 'lifetracker_user_id';

export function useUser() {
  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem(USER_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    getUser(userId)
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(USER_KEY);
        setUserId(null);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const login = (id: string, userData: User) => {
    localStorage.setItem(USER_KEY, id);
    setUserId(id);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    setUserId(null);
    setUser(null);
  };

  const refreshUser = () => {
    if (!userId) return;
    getUser(userId).then(setUser);
  };

  return { userId, user, loading, login, logout, refreshUser };
}
