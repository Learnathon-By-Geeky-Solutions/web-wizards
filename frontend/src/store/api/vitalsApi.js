import apiService from './apiService';

export const vitalsApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // Get vital measurements with optional filtering
    getVitalMeasurements: builder.query({
      query: (params = {}) => ({
        url: 'medical-records/charts/',
        params
      }),
      providesTags: ['Chart'],
    }),
    
    // Save a new vital measurement
    saveVitalMeasurement: builder.mutation({
      query: (data) => ({
        url: 'medical-records/charts/',
        method: 'POST',
        body: {
          chart_type: data.type,
          title: data.vital,
          measurement_date: data.date,
          measurement_time: data.time,
          value: parseFloat(data.value),
          unit: data.unit,
          notes: data.notes,
          health_issue: data.health_issue || null
        }
      }),
      invalidatesTags: ['Chart'],
    }),
    
    // Get a single vital measurement by ID
    getVitalMeasurementById: builder.query({
      query: (id) => `medical-records/charts/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Chart', id }],
    }),
    
    // Update a vital measurement
    updateVitalMeasurement: builder.mutation({
      query: ({ id, data }) => ({
        url: `medical-records/charts/${id}/`,
        method: 'PUT',
        body: {
          chart_type: data.type,
          title: data.vital,
          measurement_date: data.date,
          measurement_time: data.time,
          value: parseFloat(data.value),
          unit: data.unit,
          notes: data.notes,
          health_issue: data.health_issue || null
        }
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Chart', id },
        'Chart',
      ],
    }),
    
    // Delete a vital measurement
    deleteVitalMeasurement: builder.mutation({
      query: (id) => ({
        url: `medical-records/charts/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Chart'],
    }),
  }),
});

export const {
  useGetVitalMeasurementsQuery,
  useSaveVitalMeasurementMutation,
  useGetVitalMeasurementByIdQuery,
  useUpdateVitalMeasurementMutation,
  useDeleteVitalMeasurementMutation,
} = vitalsApi;