import apiService from './apiService';

export const testParameterApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // Get all test types with their parameters
    getTestTypes: builder.query({
      query: () => 'medical-records/test-types/',
      providesTags: ['TestType'],
    }),
    
    // Get parameter definitions
    getParameterDefinitions: builder.query({
      query: () => 'medical-records/parameter-definitions/',
      providesTags: ['Parameter'],
    }),
    
    // Get parameters for the dashboard with their recent history
    getDashboardParameters: builder.query({
      query: () => 'visualizations/dashboard-parameters/',
      providesTags: ['Parameter'],
    }),
    
    // Get specific parameter with all history
    getParameterHistory: builder.query({
      query: (parameterId) => `visualizations/parameter-history/${parameterId}/`,
      providesTags: (result, error, id) => [{ type: 'Parameter', id }],
    }),
    
    // Get details for text-type parameters (like ultrasonography)
    getTextParameter: builder.query({
      query: ({ parameterId, testResultId }) => 
        `visualizations/text-parameter/${parameterId}/${testResultId || ''}`,
      providesTags: (result, error, { parameterId }) => [{ type: 'Parameter', id: parameterId }],
    }),
    
    // Get parameter reference ranges
    getParameterReferenceRanges: builder.query({
      query: (parameterId) => `medical-records/parameter-reference/${parameterId}/`,
      providesTags: (result, error, id) => [{ type: 'Parameter', id }],
    }),
  }),
});

export const {
  useGetTestTypesQuery,
  useGetParameterDefinitionsQuery,
  useGetDashboardParametersQuery,
  useGetParameterHistoryQuery,
  useGetTextParameterQuery,
  useGetParameterReferenceRangesQuery,
} = testParameterApi;