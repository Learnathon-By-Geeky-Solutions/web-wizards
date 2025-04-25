import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { tokenService } from '../../services/tokenService';

// List of endpoints that don't require authentication
const publicEndpoints = [
  'users/register',
  'users/login',
  'users/auth/verify-email',
  'users/auth/check-email',
  'users/auth/forgot-password',
  'users/auth/reset-password',
  'token/'
];

// Get API URL from environment variables or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}/api/`,
  prepareHeaders: (headers) => {
    // Get the access token from the token service
    const token = tokenService.getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'HealthIssue', 
    'LogEntry', 
    'Symptom', 
    'LabResult', 
    'Document', 
    'MedicationPlan',
    'User',
    'Appointment',
    'Chart',
    'Profile'
  ],
  endpoints: (builder) => ({
    // Health Issues endpoints
    getHealthIssues: builder.query({
      query: () => 'medical-records/health-issues/',
      providesTags: ['HealthIssue'],
    }),
    getHealthIssue: builder.query({
      query: (id) => `medical-records/health-issues/${id}/`,
      providesTags: ['HealthIssue'],
    }),
    createHealthIssue: builder.mutation({
      query: (data) => ({
        url: 'medical-records/health-issues/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['HealthIssue'],
    }),
    updateHealthIssue: builder.mutation({
      query: ({ id, data }) => ({
        url: `medical-records/health-issues/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['HealthIssue'],
    }),
    deleteHealthIssue: builder.mutation({
      query: (id) => ({
        url: `medical-records/health-issues/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HealthIssue'],
    }),

    // Symptom endpoints
    createSymptom: builder.mutation({
      query: (data) => ({
        url: 'medical-records/symptoms/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          health_issue: data.health_issue,
          name: data.name,
          severity: data.severity,
          recorded_date: data.recorded_date,
          recorded_time: data.recorded_time,
          description: data.description || '',
        },
      }),
      invalidatesTags: ['Symptom'],
    }),
    getHealthIssueSymptoms: builder.query({
      query: (healthIssueId) => `medical-records/symptoms/by_health_issue/?health_issue_id=${healthIssueId}`,
      providesTags: ['Symptom'],
    }),

    // Medication Plans endpoints
    getMedicationPlans: builder.query({
      query: (filters = {}) => {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
        const queryString = queryParams.toString();
        return queryString 
          ? `medications/medication-plans/?${queryString}` 
          : 'medications/medication-plans/';
      },
      providesTags: ['MedicationPlan'],
    }),
    getMedicationPlanById: builder.query({
      query: (id) => `medications/medication-plans/${id}/`,
      providesTags: ['MedicationPlan'],
    }),
    createMedicationPlan: builder.mutation({
      query: (data) => ({
        url: 'medications/medication-plans/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MedicationPlan'],
    }),
    updateMedicationPlan: builder.mutation({
      query: ({ id, data }) => ({
        url: `medications/medication-plans/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['MedicationPlan'],
    }),
    deleteMedicationPlan: builder.mutation({
      query: (id) => ({
        url: `medications/medication-plans/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MedicationPlan'],
    }),
  }),
});

export const {
  // Health Issues exports
  useGetHealthIssuesQuery,
  useGetHealthIssueQuery,
  useCreateHealthIssueMutation,
  useUpdateHealthIssueMutation,
  useDeleteHealthIssueMutation,
  // Symptom exports
  useCreateSymptomMutation,
  useGetHealthIssueSymptomsQuery,
  // Medication Plans exports
  useGetMedicationPlansQuery,
  useGetMedicationPlanByIdQuery,
  useCreateMedicationPlanMutation,
  useUpdateMedicationPlanMutation,
  useDeleteMedicationPlanMutation,
} = api;

export default api;