import { configureStore } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { api } from './api/apiService';
import userReducer from './slices/userSlice';
import medicationReducer from './slices/medicationSlice';
import appointmentReducer from './slices/appointmentSlice';
import clinicianReducer from './slices/clinicianSlice';
import settingsReducer from './slices/settingsSlice';
import logbookReducer from './slices/logbookSlice';

// Root reducer configuration
const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  user: userReducer,
  medication: medicationReducer,
  appointments: appointmentReducer,
  clinicians: clinicianReducer,
  settings: settingsReducer,
  logbook: logbookReducer,
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'settings'], // Only persist these reducers
  blacklist: [api.reducerPath], // Don't persist API cache
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
          'logbook/addLogEntry',
          // Ignore RTK-Query actions that contain non-serializable values
          'api/executeMutation/pending',
          'api/executeMutation/fulfilled',
          'api/executeMutation/rejected',
          'api/executeQuery/pending',
          'api/executeQuery/fulfilled',
          'api/executeQuery/rejected'
        ],
        ignoredActionPaths: [
          'payload.createdAt',
          'meta.baseQueryMeta.request',
          'meta.baseQueryMeta.response'
        ],
        ignoredPaths: [
          'logbook.logs',
          `${api.reducerPath}.queries`,
          `${api.reducerPath}.mutations`
        ]
      }
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV === 'development',
});

export const persistor = persistStore(store);
export default store;