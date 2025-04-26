import React, { useState, useEffect } from 'react';
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
// Import AuthContext from the new file
import { AuthContext } from './authContextDefinition';

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

  // This useEffect runs only once on component mount
  useEffect(() => {
    console.log("AuthProvider initializing...");
    
    const initAuth = async () => {
      console.log("Checking for existing tokens...");
      
      // Check for token in our secure storage
      const token = tokenService.getAccessToken();
      const refreshToken = tokenService.getRefreshToken();
      
      console.log("Tokens found:", { 
        accessToken: !!token, 
        refreshToken: !!refreshToken 
      });
      
      if (token && refreshToken) {
        console.log("Valid tokens found, restoring session...");
        setIsAuthenticated(true);

        // Set up the auth service with this context
        authService.setAuthContext({
          login: handleLogin,
          loginWithGoogle,
          logout: handleLogout,
          setUser: setUserState,
          setIsAuthenticated
        });
        
        // Initialize the token refresh mechanism
        authService.startTokenRefreshTimer();

        try {
          console.log("Fetching user profile...");
          // Use RTK Query to fetch user profile
          const { data: userData } = await refetchUserProfile();
          console.log("User profile fetched successfully:", userData ? "success" : "failed");
          
          // Gracefully handle if userData is not available
          if (userData) {
            setUserState(userData);
            dispatch(setReduxUser(userData));
            
            // Set user information in Sentry
            setSentryUser({
              id: userData.id,
              email: userData.email,
              username: userData.name,
            });
          } else {
            throw new Error("Failed to fetch user data");
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          
          // Check if token refresh would help
          try {
            console.log("Attempting token refresh...");
            await authService.refreshToken();
            console.log("Token refreshed, retrying profile fetch...");
            
            // Retry profile fetch with new token
            const { data: userData } = await refetchUserProfile();
            if (userData) {
              setUserState(userData);
              dispatch(setReduxUser(userData));
              
              // Set user information in Sentry
              setSentryUser({
                id: userData.id,
                email: userData.email,
                username: userData.name,
              });
              console.log("Auth restored after token refresh");
              setLoading(false);
              return;
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
          }
          
          // If we get here, both initial fetch and refresh attempts failed
          console.log("Authentication restoration failed, clearing tokens...");
          // Use isPageRefresh=false to ensure complete logout
          tokenService.clearTokens(false);
          setIsAuthenticated(false);
          setUserState(null);
          dispatch(clearUser());
        }
      } else {
        console.log("No valid tokens found");
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    initAuth();
    
    // Clean up function for token refresh timer
    return () => {
      if (authService.tokenRefreshInterval) {
        console.log("Cleaning up token refresh timer");
        clearInterval(authService.tokenRefreshInterval);
      }
    };
  }, [dispatch, refetchUserProfile]);

  // Helper function for login
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