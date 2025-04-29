import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API service using RTK Query
export const testParameterApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/v1/',
    prepareHeaders: (headers, { getState }) => {
      // Get the token from auth state
      const token = getState().auth?.token;
      
      // If we have a token, include it in the headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Get all test types with their parameters
    getTestTypes: builder.query({
      query: () => 'medical-records/test-types/',
      transformResponse: (response) => response.data || [],
    }),
    
    // Get parameter definitions
    getParameterDefinitions: builder.query({
      query: () => 'medical-records/parameter-definitions/',
      transformResponse: (response) => response.data || [],
    }),
    
    // Get parameters for the dashboard with their recent history
    getDashboardParameters: builder.query({
      query: () => 'visualizations/dashboard-parameters/',
      transformResponse: (response) => response.data || [],
    }),
    
    // Get specific parameter with all history
    getParameterHistory: builder.query({
      query: (parameterId) => `visualizations/parameter-history/${parameterId}/`,
      transformResponse: (response) => response.data || { history: [] },
    }),
    
    // Get details for text-type parameters (like ultrasonography)
    getTextParameter: builder.query({
      query: ({ parameterId, testResultId }) => 
        `visualizations/text-parameter/${parameterId}/${testResultId || ''}`,
      transformResponse: (response) => response.data || {
        value: '',
        date: new Date().toISOString(),
        keyFindings: [],
        history: []
      },
    }),
    
    // Get parameter reference ranges
    getParameterReferenceRanges: builder.query({
      query: (parameterId) => `medical-records/parameter-reference/${parameterId}/`,
      transformResponse: (response) => response.data || {},
    }),
  }),
});

// Export hooks for each endpoint
export const {
  useGetTestTypesQuery,
  useGetParameterDefinitionsQuery,
  useGetDashboardParametersQuery,
  useGetParameterHistoryQuery,
  useGetTextParameterQuery,
  useGetParameterReferenceRangesQuery,
} = testParameterApi;