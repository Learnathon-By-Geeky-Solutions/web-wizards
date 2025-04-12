import apiService from './apiService';

export const medicationApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // Get all medication plans
    getMedicationPlans: builder.query({
      query: () => 'medications/',
      providesTags: (result) => 
        result 
          ? [
              ...result.map(({ id }) => ({ type: 'MedicationPlan', id })),
              { type: 'MedicationPlan', id: 'LIST' },
            ]
          : [{ type: 'MedicationPlan', id: 'LIST' }],
    }),
    
    // Get a single medication plan by ID
    getMedicationPlan: builder.query({
      query: (id) => `medications/${id}/`,
      providesTags: (result, error, id) => [{ type: 'MedicationPlan', id }],
    }),
    
    // Create a new medication plan
    createMedicationPlan: builder.mutation({
      query: (plan) => ({
        url: 'medications/',
        method: 'POST',
        body: plan,
      }),
      invalidatesTags: [{ type: 'MedicationPlan', id: 'LIST' }],
    }),
    
    // Update an existing medication plan
    updateMedicationPlan: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `medications/${id}/`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'MedicationPlan', id },
        { type: 'MedicationPlan', id: 'LIST' },
      ],
    }),
    
    // Delete a medication plan
    deleteMedicationPlan: builder.mutation({
      query: (id) => ({
        url: `medications/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'MedicationPlan', id },
        { type: 'MedicationPlan', id: 'LIST' },
      ],
    }),
    
    // Get notifications related to medications
    getNotifications: builder.query({
      query: () => 'medications/notifications/',
      providesTags: ['Notification'],
    }),
    
    // Mark notification as read
    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `medications/notifications/${id}/read/`,
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetMedicationPlansQuery,
  useGetMedicationPlanQuery,
  useCreateMedicationPlanMutation,
  useUpdateMedicationPlanMutation,
  useDeleteMedicationPlanMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} = medicationApi;