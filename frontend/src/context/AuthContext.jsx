import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vierp_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('vierp_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('vierp_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('vierp_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem('vierp_token', newToken);
      localStorage.setItem('vierp_user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      return res.data;
    }
  };

  const signup = async (formData) => {
    const res = await authAPI.signup(formData);
    if (res.data.success) {
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem('vierp_token', newToken);
      localStorage.setItem('vierp_user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('vierp_token');
    localStorage.removeItem('vierp_user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const res = await authAPI.updateProfile(updates);
    if (res.data.success && res.data.user) {
      setUser(res.data.user);
      localStorage.setItem('vierp_user', JSON.stringify(res.data.user));
      return res.data.user;
    }
  };

  const forgotPassword = async (email) => {
    const res = await authAPI.forgotPassword(email);
    return res.data;
  };

  const verifyEmailOtp = async (email, otp) => {
    const res = await authAPI.verifyOtp({ email, otp });
    return res.data;
  };

  const resetPassword = async (email, otp, newPassword) => {
    const res = await authAPI.resetPassword({ email, otp, newPassword });
    if (res.data?.success && res.data?.token) {
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem('vierp_token', newToken);
      localStorage.setItem('vierp_user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
    }
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        signup,
        register: signup,
        logout,
        updateProfile,
        forgotPassword,
        verifyEmailOtp,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
