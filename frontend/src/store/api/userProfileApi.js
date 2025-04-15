import apiService from './apiService';

export const userProfileApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => 'api/users/profile/',
      providesTags: ['Profile'],
    }),
    
    uploadProfileImage: builder.mutation({
      query: (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        return {
          url: 'api/users/upload-profile-image/',
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
        url: 'api/users/update-profile/',
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