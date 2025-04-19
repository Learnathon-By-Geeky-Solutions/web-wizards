import apiService from './apiService';

export const cliniciansApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // Get all clinicians with optional filtering
    getClinicians: builder.query({
      query: (filters = {}) => {
        const params = {};
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params[key] = value;
          }
        });
        
        return {
          url: 'clinicians/clinicians/',
          params
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Clinician', id })),
              { type: 'Clinician', id: 'LIST' },
            ]
          : [{ type: 'Clinician', id: 'LIST' }],
    }),
    
    // Get a single clinician by ID
    getClinicianById: builder.query({
      query: (id) => `clinicians/clinicians/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Clinician', id }],
    }),
    
    // Get top-rated clinicians
    getTopRatedClinicians: builder.query({
      query: () => 'clinicians/clinicians/top_rated/',
      providesTags: [{ type: 'Clinician', id: 'TOP_RATED' }],
    }),
    
    // Get clinicians by specialization
    getCliniciansBySpecialization: builder.query({
      query: (specializationId) => `clinicians/clinicians/by_specialization/?specialization_id=${specializationId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Clinician', id })),
              { type: 'Clinician', id: 'BY_SPEC' },
            ]
          : [{ type: 'Clinician', id: 'BY_SPEC' }],
    }),
    
    // Get all specializations
    getSpecializations: builder.query({
      query: () => 'clinicians/specializations/',
      providesTags: ['Specialization'],
    }),
    
    // Get all diagnostic centers with optional filtering
    getDiagnosticCenters: builder.query({
      query: (filters = {}) => {
        const params = {};
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params[key] = value;
          }
        });
        
        return {
          url: 'clinicians/diagnostic-centers/',
          params
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'DiagnosticCenter', id })),
              { type: 'DiagnosticCenter', id: 'LIST' },
            ]
          : [{ type: 'DiagnosticCenter', id: 'LIST' }],
    }),
    
    // Get a single diagnostic center by ID
    getDiagnosticCenterById: builder.query({
      query: (id) => `clinicians/diagnostic-centers/${id}/`,
      providesTags: (result, error, id) => [{ type: 'DiagnosticCenter', id }],
    }),
    
    // Get top-rated diagnostic centers
    getTopRatedDiagnosticCenters: builder.query({
      query: () => 'clinicians/diagnostic-centers/top_rated/',
      providesTags: [{ type: 'DiagnosticCenter', id: 'TOP_RATED' }],
    }),
    
    // Get diagnostic centers by service
    getDiagnosticCentersByService: builder.query({
      query: (service) => `clinicians/diagnostic-centers/by_service/?service=${encodeURIComponent(service)}`,
      providesTags: [{ type: 'DiagnosticCenter', id: 'BY_SERVICE' }],
    }),
    
    // Get reviews for a clinician
    getReviewsForClinician: builder.query({
      query: (clinicianId) => `clinicians/reviews/?clinician_id=${clinicianId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Review', id })),
              { type: 'Review', id: 'LIST' },
            ]
          : [{ type: 'Review', id: 'LIST' }],
    }),
    
    // Get reviews for a diagnostic center
    getReviewsForDiagnosticCenter: builder.query({
      query: (centerId) => `clinicians/reviews/?diagnostic_center_id=${centerId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Review', id })),
              { type: 'Review', id: 'LIST' },
            ]
          : [{ type: 'Review', id: 'LIST' }],
    }),
    
    // Submit a review
    submitReview: builder.mutation({
      query: (reviewData) => ({
        url: 'clinicians/reviews/',
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: ['Review'],
    }),
  }),
});

export const {
  useGetCliniciansQuery,
  useGetClinicianByIdQuery,
  useGetTopRatedCliniciansQuery,
  useGetCliniciansBySpecializationQuery,
  useGetSpecializationsQuery,
  useGetDiagnosticCentersQuery,
  useGetDiagnosticCenterByIdQuery,
  useGetTopRatedDiagnosticCentersQuery,
  useGetDiagnosticCentersByServiceQuery,
  useGetReviewsForClinicianQuery,
  useGetReviewsForDiagnosticCenterQuery,
  useSubmitReviewMutation,
} = cliniciansApi;