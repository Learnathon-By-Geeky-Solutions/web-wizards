import apiService from './apiService';

export const authApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login/',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    
    register: builder.mutation({
      query: (userData) => ({
        url: 'auth/register/',
        method: 'POST',
        body: userData,
      }),
    }),
    
    getProfile: builder.query({
      query: () => 'users/profile/',
      providesTags: ['User'],
    }),
    
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: 'users/profile/',
        method: 'PATCH',
        body: profileData,
      }),
      invalidatesTags: ['User'],
    }),
    
    logout: builder.mutation({
      query: () => ({
        url: 'auth/logout/',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Clear local storage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          // Clear user from Redux state
          dispatch({ type: 'user/clearUser' });
          // Optionally reset API state
          dispatch(apiService.util.resetApiState());
        } catch (err) {
          console.error('Logout error:', err);
        }
      },
    }),
    
    googleLogin: builder.mutation({
      query: (code) => ({
        url: 'auth/google/callback/',
        method: 'POST',
        body: { code },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
  useGoogleLoginMutation,
} = authApi;