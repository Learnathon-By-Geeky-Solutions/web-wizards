import apiService from './apiService';

export const labResultsApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // Get all test types
    getTestTypes: builder.query({
      query: () => 'medical-records/test-types/',
      providesTags: ['TestType'],
    }),
    
    // Get test results with optional filtering
    getTestResults: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value);
          }
        });
        
        const queryString = queryParams.toString();
        return queryString 
          ? `medical-records/test-results/?${queryString}` 
          : `medical-records/test-results/`;
      },
      providesTags: ['TestResult'],
    }),
    
    // Get a single test result by ID
    getTestResultById: builder.query({
      query: (id) => `medical-records/test-results/${id}/`,
      providesTags: (result, error, id) => [{ type: 'TestResult', id }],
    }),
    
    // Create a new test result
    createTestResult: builder.mutation({
      query: (data) => ({
        url: 'medical-records/test-results/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['TestResult'],
    }),
    
    // Upload and process a lab document
    uploadLabDocument: builder.mutation({
      query: (formData) => ({
        url: 'medical-records/test-results/upload/',
        method: 'POST',
        formData: true,
        body: formData,
      }),
      invalidatesTags: ['TestResult'],
    }),
  }),
});

export const {
  useGetTestTypesQuery,
  useGetTestResultsQuery,
  useGetTestResultByIdQuery,
  useCreateTestResultMutation,
  useUploadLabDocumentMutation,
} = labResultsApi;