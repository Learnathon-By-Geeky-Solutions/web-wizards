import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { setUser as setSentryUser } from '../utils/sentry';
import { useDispatch } from 'react-redux';
import { setUser as setReduxUser, clearUser } from '../store/slices/userSlice';
import { authService } from '../services/authService';
import { tokenService } from '../services/tokenService';
// Import RTK Query hooks
import { useLoginMutation, useLogoutMutation } from '../store/api/authApi';
import { useProcessGoogleCallbackMutation } from '../store/api/oauthApi';
import { userProfileApi } from '../store/api/userProfileApi';
// Import AuthContext from the new file
import { AuthContext } from './authContextDefinition';
import { secureStore, secureRetrieve } from '../utils/security';

// Store user profile data for faster restoration after refres
const USER_PROFILE_CACHE_KEY = '_user_profile_cache';

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useDispatch();
  
  // RTK Query hooks - use manual triggering instead of automatic queries
  const [login] = useLoginMutation();
  const [logout] = useLogoutMutation();
  const [processGoogleCallback] = useProcessGoogleCallbackMutation();
  
  // Skip the profile query during initial load to avoid premature requests
  // We'll manually trigger it after proper token initialization
  const { refetch: refetchUserProfile } = userProfileApi.endpoints.getUserProfile.useQuery(undefined, {
    skip: true, // Always skip automatic query
  });

  // Helper function to normalize user data structure
  const normalizeUserData = (userData) => {
    if (!userData) return null;
    
    // Now we only care about the name
    return {
      name: userData.name || '',
      // Keep any additional fields that might be needed by the app
      ...userData 
    };
  };
  
  // Helper function to update user state
  const updateUserState = useCallback((userData) => {
    // Normalize the structure to ensure consistency
    const normalizedUser = normalizeUserData(userData);
    
    if (normalizedUser) {
      console.log("Setting user state:", normalizedUser);
      
      // Update state
      setUserState(normalizedUser);
      
      // Update Redux
      dispatch(setReduxUser(normalizedUser));
      
      // Cache user data for page refreshes
      secureStore(USER_PROFILE_CACHE_KEY, normalizedUser, true);
      
      // Set user information in Sentry
      setSentryUser({
        id: normalizedUser.id,
        email: normalizedUser.email,
        username: normalizedUser.name,
      });
      
      return normalizedUser;
    }
    
    return null;
  }, [dispatch]);
  
  // Fetch user profile safely
  const fetchUserProfile = useCallback(async () => {
    try {
      console.log("Fetching user profile...");
      
      // Get the API endpoint from RTK Query
      const { data: userApiData, error } = await dispatch(
        userProfileApi.endpoints.getUserProfile.initiate()
      );
      
      if (error) {
        console.error("Error fetching user profile with initiate:", error);
        return null;
      }
      
      if (userApiData) {
        updateUserState(userApiData);
        console.log("User state updated with:", userApiData);
        return userApiData;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }, [dispatch, updateUserState]);

  // Helper function for login
  const handleLogin = useCallback(async (credentials) => {
    try {
      // Use RTK Query mutation for login
      const response = await login(credentials).unwrap();
      
      // Store tokens securely
      if (response.access && response.refresh) {
        tokenService.setAccessToken(response.access);
        tokenService.setRefreshToken(response.refresh);
      }
      
      // Get user profile after successful login
      const userData = await fetchUserProfile();
      if (userData) {
        setIsAuthenticated(true);
      }
      
      // Initialize the token refresh mechanism
      authService.startTokenRefreshTimer();
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      throw error;
    }
  }, [login, fetchUserProfile]);

  const loginWithGoogle = useCallback(async (params) => {
    try {
      // Process the OAuth callback with the code and redirect URI
      // Handle both string code and object with code & redirectUri
      const code = typeof params === 'string' ? params : params.code;
      const redirectUri = typeof params === 'string' ? undefined : params.redirectUri;
      
      console.log("AuthContext: Processing Google login with redirectUri:", redirectUri);
      
      // Call the API with both code and redirect URI
      const response = await processGoogleCallback({
        code,
        redirect_uri: redirectUri
      }).unwrap();
      
      console.log("Google login successful, storing tokens");
      
      // Store tokens securely
      if (response.access) tokenService.setAccessToken(response.access);
      if (response.refresh) tokenService.setRefreshToken(response.refresh);
      
      // Fetch user profile from API instead of using response data
      const userData = await fetchUserProfile();
      if (userData) {
        setIsAuthenticated(true);
      }
      
      // Initialize the token refresh mechanism
      authService.startTokenRefreshTimer();
      
      return response;
    } catch (error) {
      console.error('Google login error:', error);
      setIsAuthenticated(false);
      throw error;
    }
  }, [processGoogleCallback, fetchUserProfile]);

  const handleLogout = useCallback(async () => {
    try {
      // Use RTK Query mutation for logout
      await logout().unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens securely
      tokenService.clearTokens();
      
      // Clear cached user profile
      sessionStorage.removeItem(USER_PROFILE_CACHE_KEY);
      
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
  }, [logout, dispatch]);

  // This useEffect runs only once on component mount
  useEffect(() => {
    console.log("AuthProvider initializing...");
    
    const initAuth = async () => {
      try {
        console.log("Checking for existing tokens...");
        
        // Check for token in our secure storage
        const token = tokenService.getAccessToken();
        const refreshToken = tokenService.getRefreshToken();
        
        console.log("Tokens found:", { 
          accessToken: !!token, 
          refreshToken: !!refreshToken 
        });
        
        // Try to restore user from cache first for immediate UI display
        const cachedUser = secureRetrieve(USER_PROFILE_CACHE_KEY, true);
        if (cachedUser) {
          console.log("Found cached user data:", cachedUser);
          setUserState(normalizeUserData(cachedUser));
          dispatch(setReduxUser(normalizeUserData(cachedUser)));
        }
        
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
          
          // Now that auth state is properly initialized, mark as ready
          setIsInitialized(true);
  
          try {
            // Fetch user profile in a safe way - this will not trigger the RTK error
            console.log("Fetching user profile after init...");
            const userData = await fetchUserProfile();
            
            if (!userData && cachedUser) {
              console.log("Using cached user data since API fetch failed");
              // Keep using the cached data
            } else if (!userData && !cachedUser) {
              console.log("No user data available, attempting token refresh");
              
              // Try refreshing token
              try {
                await authService.refreshToken();
                // Retry profile fetch
                const refreshedUserData = await fetchUserProfile();
                
                if (!refreshedUserData) {
                  throw new Error("Still failed to fetch user data after token refresh");
                }
              } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                throw refreshError;
              }
            }
          } catch (profileError) {
            console.error("Failed to fetch profile after multiple attempts:", profileError);
            // If we have cached data, we can still keep user logged in
            if (!cachedUser) {
              console.log("No cached data available, logging out");
              await handleLogout();
            }
          }
        } else {
          console.log("No valid tokens found");
          setIsAuthenticated(false);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Critical initialization error:", error);
        setIsAuthenticated(false);
        setIsInitialized(true);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
    
    // Clean up function for token refresh timer
    return () => {
      if (authService.tokenRefreshInterval) {
        console.log("Cleaning up token refresh timer");
        clearInterval(authService.tokenRefreshInterval);
      }
    };
  }, [dispatch, fetchUserProfile, handleLogin, handleLogout, loginWithGoogle, updateUserState]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isInitialized, 
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