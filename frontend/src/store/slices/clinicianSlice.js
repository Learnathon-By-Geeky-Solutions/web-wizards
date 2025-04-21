import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: 'clinicians',
  clinicians: [],
  diagnosticCenters: [],
  specializations: [],
  filters: {
    searchTerm: '',
    city: '',
    specialization: '',
    rating: '',
    availableOnline: false,
    acceptingPatients: false,
    is24Hours: false,
    hasHomeCollection: false
  },
  loading: false,
  error: null
};

const clinicianSlice = createSlice({
  name: 'clinicians',
  initialState,
  reducers: {
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    setClinicians(state, action) {
      state.clinicians = action.payload;
    },
    setDiagnosticCenters(state, action) {
      state.diagnosticCenters = action.payload;
    },
    setSpecializations(state, action) {
      state.specializations = action.payload;
    },
    updateFilter(state, action) {
      state.filters = {
        ...state.filters,
        [action.payload.filterName]: action.payload.value
      };
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const {
  setActiveTab,
  setClinicians,
  setDiagnosticCenters,
  setSpecializations,
  updateFilter,
  resetFilters,
  setLoading,
  setError
} = clinicianSlice.actions;

export default clinicianSlice.reducer;