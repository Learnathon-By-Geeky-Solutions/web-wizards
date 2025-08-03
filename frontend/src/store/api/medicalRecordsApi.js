import apiService from './apiService';

export const medicalRecordsApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // Get test types
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
          : 'medical-records/test-results/';
      },
      providesTags: ['TestResult'],
    }),

    // Get parameters by test type
    getParameters: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value);
          }
        });
        
        const queryString = queryParams.toString();
        return queryString 
          ? `medical-records/parameters/?${queryString}` 
          : 'medical-records/parameters/';
      },
      providesTags: ['Parameter'],
    }),

    // Get common parameters
    getCommonParameters: builder.query({
      query: () => 'medical-records/parameters/common/',
      providesTags: ['Parameter'],
    }),

    // Get parameter history
    getParameterHistory: builder.query({
      query: (id) => `medical-records/parameters/${id}/history/`,
      providesTags: (result, error, id) => [{ type: 'Parameter', id }],
    }),

    // Upload test document
    uploadTestDocument: builder.mutation({
      query: (formData) => ({
        url: 'medical-records/test-results/upload/',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['TestResult', 'Parameter'],
    }),
  }),
});

export const {
  useGetTestTypesQuery,
  useGetTestResultsQuery,
  useGetParametersQuery,
  useGetCommonParametersQuery,
  useGetParameterHistoryQuery,
  useUploadTestDocumentMutation,
} = medicalRecordsApi;