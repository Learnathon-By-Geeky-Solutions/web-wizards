import apiService from './apiService';

export const healthIssuesApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // Re-export the existing endpoints for consistency
    getHealthIssues: builder.query({
      query: () => 'medical-records/health-issues/',
      providesTags: ['HealthIssue'],
    }),
    
    getHealthIssue: builder.query({
      query: (id) => `medical-records/health-issues/${id}/`,
      providesTags: (result, error, id) => [{ type: 'HealthIssue', id }],
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
      invalidatesTags: (result, error, { id }) => [{ type: 'HealthIssue', id }, 'HealthIssue'],
    }),
    
    deleteHealthIssue: builder.mutation({
      query: (id) => ({
        url: `medical-records/health-issues/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HealthIssue'],
    }),
    
    searchHealthIssues: builder.query({
      query: (searchTerm) => `medical-records/health-issues/search/?q=${encodeURIComponent(searchTerm)}`,
      providesTags: ['HealthIssue'],
    }),
    
    // Logbook entries endpoints
    getLogbookEntriesByHealthIssue: builder.query({
      query: (healthIssueId) => `medical-records/health-issues/${healthIssueId}/logbook/`,
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'LogEntry', id })),
              { type: 'LogEntry', id: 'LIST' },
            ]
          : [{ type: 'LogEntry', id: 'LIST' }],
    }),
    
    // Add this for compatibility with existing components
    getHealthIssueLogEntries: builder.query({
      query: (healthIssueId) => healthIssueId ? 
        `medical-records/health-issues/${healthIssueId}/logbook/` :
        'medical-records/logbook/',
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'LogEntry', id })),
              { type: 'LogEntry', id: 'LIST' },
            ]
          : [{ type: 'LogEntry', id: 'LIST' }],
    }),
    
    createLogbookEntry: builder.mutation({
      query: (entryData) => ({
        url: `medical-records/health-issues/${entryData.health_issue}/logbook/`,
        method: 'POST',
        body: entryData,
      }),
      invalidatesTags: [{ type: 'LogEntry', id: 'LIST' }],
    }),
    
    // Added for VitalsModal component
    addHealthIssueLogEntry: builder.mutation({
      query: (data) => ({
        url: `medical-records/health-issues/${data.healthIssueId}/logbook/`,
        method: 'POST',
        body: {
          title: data.title,
          notes: data.notes,
          entry_date: data.entry_date,
          entry_time: data.entry_time,
          vital_signs: data.vital_signs
        }
      }),
      invalidatesTags: [{ type: 'LogEntry', id: 'LIST' }],
    }),
    
    updateLogbookEntry: builder.mutation({
      query: ({ healthIssueId, entryId, entryData }) => ({
        url: `medical-records/health-issues/${healthIssueId}/logbook/${entryId}/`,
        method: 'PUT',
        body: entryData,
      }),
      invalidatesTags: (result, error, { entryId }) => [
        { type: 'LogEntry', id: entryId },
        { type: 'LogEntry', id: 'LIST' },
      ],
    }),
    
    deleteLogbookEntry: builder.mutation({
      query: ({ healthIssueId, entryId }) => ({
        url: `medical-records/health-issues/${healthIssueId}/logbook/${entryId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { entryId }) => [
        { type: 'LogEntry', id: entryId },
        { type: 'LogEntry', id: 'LIST' },
      ],
    }),
    
    // Symptoms endpoints
    getSymptomsByHealthIssue: builder.query({
      query: (healthIssueId) => `medical-records/health-issues/${healthIssueId}/symptoms/`,
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Symptom', id })),
              { type: 'Symptom', id: 'LIST' },
            ]
          : [{ type: 'Symptom', id: 'LIST' }],
    }),
    
    createSymptomForHealthIssue: builder.mutation({
      query: ({ healthIssueId, symptomData }) => ({
        url: `medical-records/health-issues/${healthIssueId}/symptoms/`,
        method: 'POST',
        body: symptomData,
      }),
      invalidatesTags: [{ type: 'Symptom', id: 'LIST' }],
    }),
    
    updateSymptom: builder.mutation({
      query: ({ healthIssueId, symptomId, symptomData }) => ({
        url: `medical-records/health-issues/${healthIssueId}/symptoms/${symptomId}/`,
        method: 'PUT',
        body: symptomData,
      }),
      invalidatesTags: (result, error, { symptomId }) => [
        { type: 'Symptom', id: symptomId },
        { type: 'Symptom', id: 'LIST' },
      ],
    }),
    
    deleteSymptom: builder.mutation({
      query: ({ healthIssueId, symptomId }) => ({
        url: `medical-records/health-issues/${healthIssueId}/symptoms/${symptomId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { symptomId }) => [
        { type: 'Symptom', id: symptomId },
        { type: 'Symptom', id: 'LIST' },
      ],
    }),
    
    // Charts endpoints
    getChartsByHealthIssue: builder.query({
      query: (healthIssueId) => `medical-records/health-issues/${healthIssueId}/charts/`,
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Chart', id })),
              { type: 'Chart', id: 'LIST' },
            ]
          : [{ type: 'Chart', id: 'LIST' }],
    }),
    
    createChart: builder.mutation({
      query: ({ healthIssueId, chartData }) => ({
        url: `medical-records/health-issues/${healthIssueId}/charts/`,
        method: 'POST',
        body: chartData,
      }),
      invalidatesTags: [{ type: 'Chart', id: 'LIST' }],
    }),
    
    updateChart: builder.mutation({
      query: ({ healthIssueId, chartId, chartData }) => ({
        url: `medical-records/health-issues/${healthIssueId}/charts/${chartId}/`,
        method: 'PUT',
        body: chartData,
      }),
      invalidatesTags: (result, error, { chartId }) => [
        { type: 'Chart', id: chartId },
        { type: 'Chart', id: 'LIST' },
      ],
    }),
    
    deleteChart: builder.mutation({
      query: ({ healthIssueId, chartId }) => ({
        url: `medical-records/health-issues/${healthIssueId}/charts/${chartId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { chartId }) => [
        { type: 'Chart', id: chartId },
        { type: 'Chart', id: 'LIST' },
      ],
    }),
    
    // Lab Results endpoints
    getLabResultsByHealthIssue: builder.query({
      query: (healthIssueId) => `medical-records/health-issues/${healthIssueId}/lab-results/`,
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'LabResult', id })),
              { type: 'LabResult', id: 'LIST' },
            ]
          : [{ type: 'LabResult', id: 'LIST' }],
    }),
    
    createLabResult: builder.mutation({
      query: ({ healthIssueId, labResultData }) => {
        // Handle FormData if provided
        const isFormData = labResultData instanceof FormData;
        
        return {
          url: `medical-records/health-issues/${healthIssueId}/lab-results/`,
          method: 'POST',
          formData: isFormData,
          body: labResultData,
        };
      },
      invalidatesTags: [{ type: 'LabResult', id: 'LIST' }],
    }),
    
    updateLabResult: builder.mutation({
      query: ({ healthIssueId, labResultId, labResultData }) => {
        // Handle FormData if provided
        const isFormData = labResultData instanceof FormData;
        
        return {
          url: `medical-records/health-issues/${healthIssueId}/lab-results/${labResultId}/`,
          method: 'PUT',
          formData: isFormData,
          body: labResultData,
        };
      },
      invalidatesTags: (result, error, { labResultId }) => [
        { type: 'LabResult', id: labResultId },
        { type: 'LabResult', id: 'LIST' },
      ],
    }),
    
    deleteLabResult: builder.mutation({
      query: ({ healthIssueId, labResultId }) => ({
        url: `medical-records/health-issues/${healthIssueId}/lab-results/${labResultId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { labResultId }) => [
        { type: 'LabResult', id: labResultId },
        { type: 'LabResult', id: 'LIST' },
      ],
    }),
    
    // Health Issue Documents endpoints
    getDocumentsByHealthIssue: builder.query({
      query: (healthIssueId) => `medical-records/health-issues/${healthIssueId}/documents/`,
      providesTags: ['Document'],
    }),
    
    createDocumentForHealthIssue: builder.mutation({
      query: ({ healthIssueId, documentData }) => {
        // Handle FormData if provided
        const isFormData = documentData instanceof FormData;
        
        return {
          url: `medical-records/health-issues/${healthIssueId}/documents/`,
          method: 'POST',
          formData: isFormData,
          body: documentData,
        };
      },
      invalidatesTags: ['Document'],
    }),
    
    updateHealthIssueDocument: builder.mutation({
      query: ({ healthIssueId, documentId, documentData }) => {
        // Handle FormData if provided
        const isFormData = documentData instanceof FormData;
        
        return {
          url: `medical-records/health-issues/${healthIssueId}/documents/${documentId}/`,
          method: 'PUT',
          formData: isFormData,
          body: documentData,
        };
      },
      invalidatesTags: (result, error, { documentId }) => [
        { type: 'Document', id: documentId },
        'Document',
      ],
    }),
    
    deleteHealthIssueDocument: builder.mutation({
      query: ({ healthIssueId, documentId }) => ({
        url: `medical-records/health-issues/${healthIssueId}/documents/${documentId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { documentId }) => [
        { type: 'Document', id: documentId },
        'Document',
      ],
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
  useSearchHealthIssuesQuery,
  useLazySearchHealthIssuesQuery,
  
  // Logbook entries exports
  useGetLogbookEntriesByHealthIssueQuery,
  useGetHealthIssueLogEntriesQuery,
  useCreateLogbookEntryMutation,
  useAddHealthIssueLogEntryMutation,
  useUpdateLogbookEntryMutation,
  useDeleteLogbookEntryMutation,
  
  // Symptoms exports
  useGetSymptomsByHealthIssueQuery,
  useCreateSymptomForHealthIssueMutation,
  useUpdateSymptomMutation,
  useDeleteSymptomMutation,
  
  // Charts exports
  useGetChartsByHealthIssueQuery,
  useCreateChartMutation,
  useUpdateChartMutation,
  useDeleteChartMutation,
  
  // Lab Results exports
  useGetLabResultsByHealthIssueQuery,
  useCreateLabResultMutation,
  useUpdateLabResultMutation,
  useDeleteLabResultMutation,
  
  // Health Issue Documents exports
  useGetDocumentsByHealthIssueQuery,
  useCreateDocumentForHealthIssueMutation,
  useUpdateHealthIssueDocumentMutation,
  useDeleteHealthIssueDocumentMutation,
} = healthIssuesApi;