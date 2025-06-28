import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { supabaseApi } from './api/supabaseApi';
import themeReducer from './slices/themeSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    settings: settingsReducer,
    [supabaseApi.reducerPath]: supabaseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Isključujemo immutability check u development modu za bolje performanse
      immutableCheck: false,
      // Isključujemo serializability check jer nam nije potreban
      serializabilityCheck: false,
    }).concat(supabaseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 