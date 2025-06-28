import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For persisting state in React Native
import rootReducer, { RootState } from './rootReducer';
import { supabaseApi } from './api/supabaseApi'; // Import supabaseApi

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['theme', 'settings'], // Add 'settings' to whitelist
  // blacklist: ['someEphemeralState'], // Example: state we don't want to persist
  // Važno: API slice (RTK Query) obično ne treba da se perzistira
  // jer upravlja keširanjem podataka sa servera.
  // Ako ga dodate u whitelist, možete imati problema sa zastarelim podacima.
  // blacklist: [supabaseApi.reducerPath] // Primer eksplicitnog blacklistovanja ako je potrebno
};

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux-persist, as they are not serializable by design
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
      },
    }).concat(supabaseApi.middleware), // Dodajemo supabaseApi.middleware
});

export const persistor = persistStore(store);

// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch; 