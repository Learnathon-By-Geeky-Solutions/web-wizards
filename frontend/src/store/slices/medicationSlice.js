import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  statusFilter: 'active',
  healthIssueFilter: 'All',
  searchTerm: '',
  medicationPlans: [],
  notifications: [],
  loading: false,
  error: null,
  editingPlan: null
};

const medicationSlice = createSlice({
  name: 'medication',
  initialState,
  reducers: {
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setHealthIssueFilter: (state, action) => {
      state.healthIssueFilter = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setMedicationPlans: (state, action) => {
      state.medicationPlans = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setEditingPlan: (state, action) => {
      state.editingPlan = action.payload;
    },
    addMedicationPlan: (state, action) => {
      state.medicationPlans.push(action.payload);
    },
    updateMedicationPlan: (state, action) => {
      const index = state.medicationPlans.findIndex(plan => plan.id === action.payload.id);
      if (index !== -1) {
        state.medicationPlans[index] = action.payload;
      }
    },
    deleteMedicationPlan: (state, action) => {
      state.medicationPlans = state.medicationPlans.filter(plan => plan.id !== action.payload);
    },
    updateNotification: (state, action) => {
      const index = state.notifications.findIndex(n => n.id === action.payload.id);
      if (index !== -1) {
        state.notifications[index] = action.payload;
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    }
  }
});

export const {
  setStatusFilter,
  setHealthIssueFilter,
  setSearchTerm,
  setMedicationPlans,
  setNotifications,
  setLoading,
  setError,
  setEditingPlan,
  addMedicationPlan,
  updateMedicationPlan,
  deleteMedicationPlan,
  updateNotification,
  removeNotification
} = medicationSlice.actions;

export default medicationSlice.reducer;