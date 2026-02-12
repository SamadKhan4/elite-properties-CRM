import React, { useState, useEffect } from 'react';
import { authApi, setCookie, getCookie, deleteCookie } from '../services/api';
import { AuthContext } from '../hooks/useAuth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getCookie('adminToken') || null);
  const [loading, setLoading] = useState(true);

  // Define logout function first to avoid hoisting issues
  const logout = () => {
    deleteCookie('adminToken');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    // Check if user is authenticated on initial load
    const checkAuthStatus = async () => {
      if (token) {
        try {
          // Here we would typically verify the token with the backend
          // For now, we'll just set the user based on stored token
          setUser({ isAdmin: true }); // Simplified for now
        } catch (error) {
          console.error('Failed to verify token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      const { token: newToken } = response.data;
      
      setCookie('adminToken', newToken, 7); // Store for 7 days
      setToken(newToken);
      setUser({ isAdmin: true });
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};