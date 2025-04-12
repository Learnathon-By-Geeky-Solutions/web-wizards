import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPage: 'LOGBOOK',
  logs: [],
  isLoading: false,
  error: null
};

const logbookSlice = createSlice({
  name: 'logbook',
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setLogs(state, action) {
      state.logs = action.payload;
    },
    addLogEntry(state, action) {
      state.logs.push({
        ...action.payload,
        id: state.logs.length + 1,
        createdAt: new Date().toISOString()
      });
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

export const {
  setCurrentPage,
  setLogs,
  addLogEntry,
  setLoading,
  setError
} = logbookSlice.actions;

export default logbookSlice.reducer;