import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointments: [],
  filter: 'all',
  loading: false,
  error: null
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointments(state, action) {
      state.appointments = action.payload;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    addAppointment(state, action) {
      state.appointments.push(action.payload);
    },
    updateAppointment(state, action) {
      const index = state.appointments.findIndex(app => app.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    deleteAppointment(state, action) {
      state.appointments = state.appointments.filter(app => app.id !== action.payload);
    }
  }
});

export const {
  setAppointments,
  setFilter,
  setLoading,
  setError,
  addAppointment,
  updateAppointment,
  deleteAppointment
} = appointmentSlice.actions;

export default appointmentSlice.reducer;