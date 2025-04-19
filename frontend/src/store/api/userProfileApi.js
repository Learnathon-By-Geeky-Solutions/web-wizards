import apiService from './apiService';

export const userProfileApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => 'users/profile/',
      providesTags: ['Profile'],
    }),
    
    uploadProfileImage: builder.mutation({
      query: (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        return {
          url: 'users/profile/upload-image/',
          method: 'POST',
          // Don't set Content-Type when using FormData
          formData: true,
          body: formData,
        };
      },
      invalidatesTags: ['Profile'],
    }),
    
    updatePatientProfile: builder.mutation({
      query: (profileData) => ({
        url: 'users/profile/update/',
        method: 'PATCH',
        body: profileData,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUploadProfileImageMutation,
  useUpdatePatientProfileMutation,
} = userProfileApi;