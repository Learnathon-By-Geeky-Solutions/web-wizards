import apiService from './apiService';

export const healthIssuesApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // Get all health issues for the current user
    getHealthIssues: builder.query({
      query: () => 'medical-records/health-issues/',
      providesTags: (result) => 
        result 
          ? [
              ...result.map(({ id }) => ({ type: 'HealthIssue', id })),
              { type: 'HealthIssue', id: 'LIST' },
            ]
          : [{ type: 'HealthIssue', id: 'LIST' }],
    }),
    
    // Get a single health issue by ID
    getHealthIssue: builder.query({
      query: (id) => `medical-records/health-issues/${id}/`,
      providesTags: (result, error, id) => [{ type: 'HealthIssue', id }],
    }),
    
    // Create a new health issue
    createHealthIssue: builder.mutation({
      query: (data) => ({
        url: 'medical-records/health-issues/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'HealthIssue', id: 'LIST' }],
    }),
    
    // Update an existing health issue
    updateHealthIssue: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `medical-records/health-issues/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'HealthIssue', id },
        { type: 'HealthIssue', id: 'LIST' },
      ],
    }),
    
    // Delete a health issue
    deleteHealthIssue: builder.mutation({
      query: (id) => ({
        url: `medical-records/health-issues/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'HealthIssue', id },
        { type: 'HealthIssue', id: 'LIST' },
      ],
    }),
    
    // Get all log entries for a health issue
    getHealthIssueLogEntries: builder.query({
      query: (id) => id ? `medical-records/logbook-entries/by_health_issue/?health_issue_id=${id}` : 'medical-records/logbook-entries/',
      providesTags: (result, error, id) => [
        { type: 'LogEntry', id: id ? `HealthIssue-${id}` : 'LIST' },
      ],
    }),
    
    // Add a log entry to a health issue
    addHealthIssueLogEntry: builder.mutation({
      query: ({ healthIssueId, vital_signs, ...data }) => ({
        url: 'medical-records/logbook-entries/',
        method: 'POST',
        body: { 
          ...data, 
          health_issue: healthIssueId,
          vital_signs // Backend will handle JSON conversion
        },
      }),
      invalidatesTags: (result, error, { healthIssueId }) => [
        { type: 'LogEntry', id: `HealthIssue-${healthIssueId}` },
      ],
    }),
  }),
});

export const {
  useGetHealthIssuesQuery,
  useGetHealthIssueQuery,
  useCreateHealthIssueMutation,
  useUpdateHealthIssueMutation,
  useDeleteHealthIssueMutation,
  useGetHealthIssueLogEntriesQuery,
  useAddHealthIssueLogEntryMutation,
} = healthIssuesApi;