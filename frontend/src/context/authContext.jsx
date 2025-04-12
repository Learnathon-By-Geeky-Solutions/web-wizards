import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { loginUser, logoutUser } from '../api/authUser';
import { processGoogleCallback } from '../api/oauthServices';
import { getUserProfile } from '../api/userProfile';
import { setUser as setSentryUser } from '../utils/sentry';
import { useDispatch } from 'react-redux';
import { setUser as setReduxUser, clearUser } from '../store/slices/userSlice';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const refresh = localStorage.getItem('refreshToken');
      if (token && refresh) {
        setIsAuthenticated(true);

        // Set up the auth service with this context
        authService.setAuthContext(AuthContext);
        
        // Initialize the token refresh mechanism
        authService.startTokenRefreshTimer();

        try {
          const userData = await getUserProfile();
          setUserState(userData);
          dispatch(setReduxUser(userData));
          
          // Set user information in Sentry
          if (userData) {
            setSentryUser({
              id: userData.id,
              email: userData.email,
              username: userData.name,
            });
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [dispatch]);

  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      
      // Store tokens
      if (response.access && response.refresh) {
        localStorage.setItem('accessToken', response.access);
        localStorage.setItem('refreshToken', response.refresh);
      }
      
      // Get user profile after successful login
      const userData = await getUserProfile();
      setUserState(userData);
      dispatch(setReduxUser(userData));
      setIsAuthenticated(true);
      
      // Set user information in Sentry
      if (userData) {
        setSentryUser({
          id: userData.id,
          email: userData.email,
          username: userData.name,
        });
      }
      
      // Initialize the token refresh mechanism
      authService.startTokenRefreshTimer();
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const loginWithGoogle = async (code) => {
    try {
      // Process the Google OAuth callback
      const response = await processGoogleCallback(code);
      
      // Set user information directly from the response
      if (response.user) {
        setUserState(response.user);
        dispatch(setReduxUser(response.user));
        setIsAuthenticated(true);
        
        // Set user information in Sentry
        setSentryUser({
          id: response.user.id,
          email: response.user.email,
          username: response.user.name,
        });
        
        // Initialize the token refresh mechanism
        authService.startTokenRefreshTimer();
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
      setUserState(null);
      dispatch(clearUser());
      setIsAuthenticated(false);
      
      // Clear user information in Sentry
      setSentryUser(null);

      // Clear token refresh timer
      if (authService.tokenRefreshInterval) {
        clearInterval(authService.tokenRefreshInterval);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      loginWithGoogle, 
      logout, 
      setUser: setUserState, 
      setIsAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};