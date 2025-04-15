import apiService from './apiService';

export const medicationApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // Get all medication plans
    getMedicationPlans: builder.query({
      query: (filters = {}) => {
        const params = {};
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params[key] = value;
        });
        
        return {
          url: 'medications/medication-plans/',
          params
        };
      },
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
      query: (id) => `medications/medication-plans/${id}/`,
      providesTags: (result, error, id) => [{ type: 'MedicationPlan', id }],
    }),
    
    // Create a new medication plan
    createMedicationPlan: builder.mutation({
      query: (plan) => ({
        url: 'medications/medication-plans/',
        method: 'POST',
        body: plan,
      }),
      invalidatesTags: [{ type: 'MedicationPlan', id: 'LIST' }],
    }),
    
    // Update an existing medication plan
    updateMedicationPlan: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `medications/medication-plans/${id}/`,
        method: 'PUT',
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
        url: `medications/medication-plans/${id}/`,
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
    
    // Search for medications
    searchMedications: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
        return `medications/medications/search/?${queryParams}`;
      },
      providesTags: ['Medication'],
    }),
    
    // Get medication categories
    getMedicationCategories: builder.query({
      query: () => `medications/medications/categories/`,
      providesTags: ['MedicationCategory'],
    }),
    
    // Get medication by ID
    getMedicationById: builder.query({
      query: (id) => `medications/medications/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Medication', id }],
    }),
    
    // Get medication plan schedule
    getMedicationPlanSchedule: builder.query({
      query: (planId) => `medications/plans/${planId}/schedule/`,
      providesTags: (result, error, planId) => [{ type: 'MedicationSchedule', id: planId }],
    }),
    
    // Update medication schedule
    updateMedicationSchedule: builder.mutation({
      query: ({ planId, scheduleData }) => ({
        url: `medications/plans/${planId}/update_schedule/`,
        method: 'POST',
        body: scheduleData,
      }),
      invalidatesTags: (result, error, { planId }) => [
        { type: 'MedicationSchedule', id: planId },
        { type: 'MedicationPlan', id: planId },
      ],
    }),
    
    // Get today's schedule
    getTodaySchedule: builder.query({
      query: () => 'medications/plans/today_schedule/',
      providesTags: ['TodaySchedule'],
    }),
    
    // Get upcoming doses
    getUpcomingDoses: builder.query({
      query: () => 'medications/plans/upcoming_doses/',
      providesTags: ['UpcomingDoses'],
    }),
    
    // Toggle notifications for a plan
    toggleNotifications: builder.mutation({
      query: ({ planId, enabled }) => ({
        url: `medications/plans/${planId}/toggle_notifications/`,
        method: 'POST',
        body: { enabled },
      }),
      invalidatesTags: (result, error, { planId }) => [
        { type: 'MedicationPlan', id: planId },
      ],
    }),
    
    // Get plans by health issue
    getPlansByHealthIssue: builder.query({
      query: (healthIssueId) => `medications/plans/by_health_issue/?health_issue_id=${healthIssueId}`,
      providesTags: (result, error, healthIssueId) => [
        { type: 'MedicationPlansByHealthIssue', id: healthIssueId },
      ],
    }),
    
    // Get active plans
    getActivePlans: builder.query({
      query: () => 'medications/plans/active_plans/',
      providesTags: ['ActivePlans'],
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
  useSearchMedicationsQuery,
  useGetMedicationCategoriesQuery,
  useGetMedicationByIdQuery,
  useGetMedicationPlanScheduleQuery,
  useUpdateMedicationScheduleMutation,
  useGetTodayScheduleQuery,
  useGetUpcomingDosesQuery,
  useToggleNotificationsMutation,
  useGetPlansByHealthIssueQuery,
  useGetActivePlansQuery,
} = medicationApi;