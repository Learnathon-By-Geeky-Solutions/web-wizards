import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { testParameterApi } from '../services/testParameterApi';
import userReducer from './slices/userSlice';
import medicationReducer from './slices/medicationSlice';
import appointmentReducer from './slices/appointmentSlice';
import clinicianReducer from './slices/clinicianSlice';
import settingsReducer from './slices/settingsSlice';
import logbookReducer from './slices/logbookSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user'], // Only persist auth and user state
  blacklist: [testParameterApi.reducerPath], // Don't persist API cache
};

const rootReducer = combineReducers({
  user: userReducer,
  medication: medicationReducer,
  appointments: appointmentReducer,
  clinicians: clinicianReducer,
  settings: settingsReducer,
  logbook: logbookReducer,
  [testParameterApi.reducerPath]: testParameterApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore all redux-persist actions
        ignoredPaths: ['meta.arg', 'payload.timestamp'],
      },
    }).concat(testParameterApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
export default store;