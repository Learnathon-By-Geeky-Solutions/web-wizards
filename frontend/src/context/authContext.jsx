import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { setUser as setSentryUser } from '../utils/sentry';
import { useDispatch } from 'react-redux';
import { setUser as setReduxUser, clearUser } from '../store/slices/userSlice';
import { authService } from '../services/authService';
import { tokenService } from '../services/tokenService';
// Import RTK Query hooks
import { useLoginMutation, useLogoutMutation } from '../store/api/authApi';
import { useProcessGoogleCallbackMutation } from '../store/api/oauthApi';
import { useGetUserProfileQuery } from '../store/api/userProfileApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  
  // RTK Query hooks
  const [login] = useLoginMutation();
  const [logout] = useLogoutMutation();
  const [processGoogleCallback] = useProcessGoogleCallbackMutation();
  const { refetch: refetchUserProfile } = useGetUserProfileQuery(undefined, {
    skip: !isAuthenticated, // Skip fetching if not authenticated
  });

  useEffect(() => {
    const initAuth = async () => {
      // Check for token in our secure storage instead of localStorage
      const token = tokenService.getAccessToken();
      const refreshToken = tokenService.getRefreshToken();
      
      if (token && refreshToken) {
        setIsAuthenticated(true);

        // Set up the auth service with this context
        authService.setAuthContext(AuthContext);
        
        // Initialize the token refresh mechanism
        authService.startTokenRefreshTimer();

        try {
          // Use RTK Query to fetch user profile
          const { data: userData } = await refetchUserProfile();
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
          // Use isPageRefresh=true to avoid clearing HttpOnly cookie during page refresh
          tokenService.clearTokens(true);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [dispatch, refetchUserProfile]);

  const handleLogin = async (credentials) => {
    try {
      // Use RTK Query mutation for login
      const { data: response } = await login(credentials).unwrap();
      
      // Store tokens securely
      if (response.access && response.refresh) {
        tokenService.setAccessToken(response.access);
        tokenService.setRefreshToken(response.refresh);
      }
      
      // Get user profile after successful login
      const { data: userData } = await refetchUserProfile();
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

  const loginWithGoogle = async (params) => {
    try {
      // Process the OAuth callback with the code and redirect URI
      // Handle both string code and object with code & redirectUri
      const code = typeof params === 'string' ? params : params.code;
      const redirectUri = typeof params === 'string' ? undefined : params.redirectUri;
      
      console.log("AuthContext: Processing Google login with redirectUri:", redirectUri);
      
      // Call the API with both code and redirect URI - only once
      const response = await processGoogleCallback({
        code,
        redirect_uri: redirectUri
      }).unwrap();
      
      console.log("Google login successful, processing user data");
      
      // Store tokens securely
      if (response.access) tokenService.setAccessToken(response.access);
      if (response.refresh) tokenService.setRefreshToken(response.refresh);
      
      // Set user information directly from the response
      if (response.user) {
        const userData = {
          ...response.user,
          // Ensure profile image is properly set
          image: response.user.image || null
        };
        
        setUserState(userData);
        dispatch(setReduxUser(userData));
        setIsAuthenticated(true);
        
        // Set user information in Sentry
        setSentryUser({
          id: userData.id,
          email: userData.email,
          username: userData.name,
        });
        
        // Initialize the token refresh mechanism
        authService.startTokenRefreshTimer();
      }
      
      return response;
    } catch (error) {
      console.error('Google login error:', error);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      // Use RTK Query mutation for logout
      await logout().unwrap();
    } finally {
      // Clear tokens securely
      tokenService.clearTokens();
      
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
      login: handleLogin, 
      loginWithGoogle, 
      logout: handleLogout, 
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