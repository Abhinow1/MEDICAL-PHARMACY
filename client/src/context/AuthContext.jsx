import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('medicare_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('medicare_token');
      const storedUser = localStorage.getItem('medicare_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Verify with profile endpoint
          const res = await api.get('/auth/profile');
          if (res.data.success) {
            setUser(res.data.data.user);
            localStorage.setItem('medicare_user', JSON.stringify(res.data.data.user));
          }
        } catch (err) {
          console.error('Session validation error:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('medicare_token', receivedToken);
      localStorage.setItem('medicare_user', JSON.stringify(receivedUser));
      return { success: true, user: receivedUser };
    }
    return { success: false, message: res.data.message };
  };

  const adminLogin = async (email, password) => {
    const res = await api.post('/auth/admin-login', { email, password });
    if (res.data.success) {
      const { token: receivedToken, admin: receivedAdmin } = res.data.data;
      setToken(receivedToken);
      setUser(receivedAdmin);
      localStorage.setItem('medicare_token', receivedToken);
      localStorage.setItem('medicare_user', JSON.stringify(receivedAdmin));
      return { success: true, admin: receivedAdmin };
    }
    return { success: false, message: res.data.message };
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('medicare_token', receivedToken);
      localStorage.setItem('medicare_user', JSON.stringify(receivedUser));
      return { success: true, user: receivedUser };
    }
    return { success: false, message: res.data.message };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('medicare_token');
    localStorage.removeItem('medicare_user');
  };

  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);
    localStorage.setItem('medicare_user', JSON.stringify(merged));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    isAdmin: user?.role === 'ADMIN',
    login,
    adminLogin,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
