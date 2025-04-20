import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { loginUser, logoutUser, getUserProfile } from '../api/authUser';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const userData = await getUserProfile();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('accessToken');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      // Store both tokens
      localStorage.setItem('accessToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);
      
      // Get user profile after login
      const userData = await getUserProfile();
      setUser(userData);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};