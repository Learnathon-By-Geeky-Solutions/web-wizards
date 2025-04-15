import apiService from './apiService';
import { tokenService } from '../../services/tokenService';

/**
 * OAuth API service for handling third-party authentication providers.
 * All OAuth flows (Google, etc.) should be managed here rather than in authApi.
 */
export const oauthApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // Get Google OAuth URL
    getGoogleAuthUrl: builder.query({
      query: (redirectUri = window.location.origin + '/google-callback') => ({
        url: `/api/users/google/login/?redirect_uri=${encodeURIComponent(redirectUri)}`,
        method: 'GET',
      }),
    }),

    // Initiate Google OAuth login process
    initiateGoogleLogin: builder.mutation({
      query: (redirectUri = window.location.origin + '/google-callback') => ({
        url: `/api/users/google/login/?redirect_uri=${encodeURIComponent(redirectUri)}`,
        method: 'GET',
      }),
      // Custom response handler for redirects
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (data.auth_url) {
            window.location.href = data.auth_url;
          }
        } catch (err) {
          console.error('Google login initiation error:', err);
        }
      },
    }),
    
    // Process Google OAuth callback
    processGoogleCallback: builder.mutation({
      query: (code) => ({
        url: '/api/users/google/callback/',
        method: 'POST',
        body: { code },
        credentials: 'include', // Include cookies in requests
      }),
      // Handle successful login by securely storing tokens
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data.access) tokenService.setAccessToken(data.access);
          if (data.refresh) tokenService.setRefreshToken(data.refresh);
          
          // Optionally dispatch user data if provided in response
          if (data.user) {
            dispatch({ type: 'user/setUser', payload: data.user });
          }
        } catch (err) {
          console.error('Google login failed:', err);
        }
      },
    }),

    // Template for adding future OAuth providers
    // Example: processGithubCallback, processMicrosoftCallback, etc.
  }),
});

export const {
  useGetGoogleAuthUrlQuery,
  useInitiateGoogleLoginMutation,
  useProcessGoogleCallbackMutation,
} = oauthApi;