import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';

// Import slices
import authReducer from './Slice/authSlice';
import ridersReducer from './Slice/ridersSlice';
import reservationsReducer from './Slice/reservationsSlice';

// Import API services
import { authApi } from './Api/authApi';
import { ridersApi } from './Api/ridersApi';
import { reservationsApi } from './Api/reservationsApi';
import { driversApi } from './Api/driversApi';

// Configure persist
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'karnue_admin',
  storage,
  whitelist: ['auth', 'riders', 'reservations'],
  blacklist: [authApi.reducerPath, ridersApi.reducerPath, reservationsApi.reducerPath, driversApi.reducerPath],
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  riders: ridersReducer,
  reservations: reservationsReducer,
  [authApi.reducerPath]: authApi.reducer,
  [ridersApi.reducerPath]: ridersApi.reducer,
  [reservationsApi.reducerPath]: reservationsApi.reducer,
  [driversApi.reducerPath]: driversApi.reducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authApi.middleware, ridersApi.middleware, reservationsApi.middleware, driversApi.middleware),
});

// Enable refetchOnFocus and other RTK Query features
setupListeners(store.dispatch);

// Create persistor
export const persistor = persistStore(store);

// Inferred Types
export type RootState = ReturnType<typeof rootReducer>;
export type PersistedRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
