import apiService from './apiService';
import { tokenService } from '../../services/tokenService';
import { setUser } from '../slices/userSlice';

export const authApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'users/login/',  // Add leading slash for absolute path from baseUrl
        method: 'POST',
        body: credentials,
        credentials: 'include', // Important for HttpOnly cookies
      }),
      invalidatesTags: ['User'],
      // Handle successful login by securely storing tokens
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.access) tokenService.setAccessToken(data.access);
          if (data.refresh) tokenService.setRefreshToken(data.refresh);
          
          // Update authentication state with user data
          if (data.user) {
            dispatch(setUser(data.user));
          }
        } catch (err) {
          console.error('Login failed:', err);
        }
      },
    }),
    
    register: builder.mutation({
      query: (userData) => ({
        url: 'users/register/',  // Add leading slash for absolute path from baseUrl
        method: 'POST',
        body: userData,
      }),
    }),
    
    verifyEmail: builder.query({
      query: (token) => `users/verify-email/${token}/`,
    }),
    
    resendVerificationEmail: builder.mutation({
      query: (emailData) => ({
        url: 'users/resend-verification/',
        method: 'POST',
        body: emailData,
      }),
    }),
    
    checkEmailExists: builder.mutation({
      query: (email) => ({
        url: 'users/check-email/',
        method: 'POST',
        body: { email },
      }),
    }),
    
    getProfile: builder.query({
      query: () => 'users/profile/',  // Add leading slash for absolute path from baseUrl
      providesTags: ['User'],
    }),
    
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: 'users/profile/',  // Add leading slash for absolute path from baseUrl
        method: 'PATCH',
        body: profileData,
      }),
      invalidatesTags: ['User'],
    }),
    
    logout: builder.mutation({
      query: () => ({
        url: 'users/logout/',  // Add leading slash for absolute path from baseUrl
        method: 'POST',
        credentials: 'include', // Important for HttpOnly cookies
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Securely clear tokens
          tokenService.clearTokens();
          
          // Clear user from Redux state
          dispatch({ type: 'user/clearUser' });
          // Optionally reset API state
          dispatch(apiService.util.resetApiState());
        } catch (err) {
          console.error('Logout error:', err);
        }
      },
    }),

    forgotPassword: builder.mutation({
      query: (email) => ({
        url: 'users/forgot-password/',  // Add leading slash for absolute path from baseUrl
        method: 'POST',
        body: { email },
      }),
    }),
    
    resetPassword: builder.mutation({
      query: (credentials) => ({
        url: 'users/reset-password/',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    // googleLogin mutation removed as it is now handled in oauthApi.js
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailQuery,
  useResendVerificationEmailMutation,
  useCheckEmailExistsMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  // useGoogleLoginMutation removed from exports
} = authApi;