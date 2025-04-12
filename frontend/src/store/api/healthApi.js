import apiService from './apiService';

export const healthApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // Get service health status
    getHealthStatus: builder.query({
      query: () => 'health/',
      keepUnusedDataFor: 60, // Keep data for 60 seconds
    }),
    
    // Get backend version
    getVersion: builder.query({
      query: () => 'health/version/',
    }),
    
    // Check database connectivity
    getDatabaseStatus: builder.query({
      query: () => 'health/db/',
    }),
    
    // Check Redis connectivity
    getRedisStatus: builder.query({
      query: () => 'health/redis/',
    }),
  }),
});

export const {
  useGetHealthStatusQuery,
  useGetVersionQuery,
  useGetDatabaseStatusQuery,
  useGetRedisStatusQuery,
} = healthApi;