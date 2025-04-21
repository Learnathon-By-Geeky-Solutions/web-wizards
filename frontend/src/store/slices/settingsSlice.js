import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fullName: 'Faysal Ahammed',
  isLoading: false,
  isDropdownOpen: false,
  message: '',
  unitOfMeasurement: 'metric',
  cholesterolUnit: 'mmol/L',
  classificationMethod: 'ESC/ESH',
  glucoseUnit: 'mmol/L',
  ketonesUnit: 'mmol/L',
  hbA1cUnit: '%',
  dateFormat: 'yyyy-MM-dd',
  morningTime: '07:00',
  noonTime: '12:00',
  eveningTime: '18:00',
  bedTime: '23:00',
  use24HourClock: true
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSetting(state, action) {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetSettings(state) {
      return {
        ...state,
        unitOfMeasurement: 'metric',
        cholesterolUnit: 'mmol/L',
        classificationMethod: 'ESC/ESH',
        glucoseUnit: 'mmol/L',
        ketonesUnit: 'mmol/L',
        hbA1cUnit: '%',
        dateFormat: 'yyyy-MM-dd',
        morningTime: '07:00',
        noonTime: '12:00',
        eveningTime: '18:00',
        bedTime: '23:00',
        use24HourClock: true
      };
    },
    setMessage(state, action) {
      state.message = action.payload;
    },
    clearMessage(state) {
      state.message = '';
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    }
  }
});

export const {
  updateSetting,
  resetSettings,
  setMessage,
  clearMessage,
  setLoading
} = settingsSlice.actions;

export default settingsSlice.reducer;