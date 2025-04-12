import apiService from './apiService';

export const appointmentsApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    // Get all appointments
    getAppointments: builder.query({
      query: () => 'appointments/',
      providesTags: (result) => 
        result 
          ? [
              ...result.map(({ id }) => ({ type: 'Appointment', id })),
              { type: 'Appointment', id: 'LIST' },
            ]
          : [{ type: 'Appointment', id: 'LIST' }],
    }),
    
    // Get a single appointment by ID
    getAppointment: builder.query({
      query: (id) => `appointments/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Appointment', id }],
    }),
    
    // Create a new appointment
    createAppointment: builder.mutation({
      query: (data) => ({
        url: 'appointments/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Appointment', id: 'LIST' }],
    }),
    
    // Update an existing appointment
    updateAppointment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `appointments/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Appointment', id },
        { type: 'Appointment', id: 'LIST' },
      ],
    }),
    
    // Delete an appointment
    deleteAppointment: builder.mutation({
      query: (id) => ({
        url: `appointments/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Appointment', id },
        { type: 'Appointment', id: 'LIST' },
      ],
    }),
    
    // Get available time slots for a clinician
    getAvailableTimeSlots: builder.query({
      query: ({ clinicianId, date }) => `appointments/available-slots/?clinician_id=${clinicianId}&date=${date}`,
    }),
    
    // Reschedule an appointment
    rescheduleAppointment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `appointments/${id}/reschedule/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Appointment', id },
        { type: 'Appointment', id: 'LIST' },
      ],
    }),
    
    // Cancel an appointment
    cancelAppointment: builder.mutation({
      query: (id) => ({
        url: `appointments/${id}/cancel/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Appointment', id },
        { type: 'Appointment', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useGetAppointmentQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAvailableTimeSlotsQuery,
  useRescheduleAppointmentMutation,
  useCancelAppointmentMutation,
} = appointmentsApi;