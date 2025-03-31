import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { loginUser, logoutUser } from '../api/authUser';
import { processGoogleCallback } from '../api/oauthServices';
import { getUserProfile } from '../api/userProfile';
import { setUser as setSentryUser } from '../utils/sentry';

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
      
      // Set user information in Sentry
      if (userData) {
        setSentryUser({
          id: userData.id,
          email: userData.email,
          username: userData.name,
        });
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async (code) => {
    try {
      // Process the Google OAuth callback
      const response = await processGoogleCallback(code);
      
      // Set user information directly from the response
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Set user information in Sentry
        setSentryUser({
          id: response.user.id,
          email: response.user.email,
          username: response.user.name,
        });
      }
      
      return response;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear user information in Sentry
      setSentryUser(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, loginWithGoogle, logout, setUser, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};