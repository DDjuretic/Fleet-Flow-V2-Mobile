import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabaseApi } from './api/supabaseApi';
import themeReducer from './slices/themeSlice';
import settingsReducer from './slices/settingsSlice';

const rootReducer = combineReducers({
  theme: themeReducer,
  settings: settingsReducer,
  [supabaseApi.reducerPath]: supabaseApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['theme', 'settings'], // Only theme and settings will be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Isključujemo immutability check u development modu za bolje performanse
      immutableCheck: false,
      // Isključujemo serializability check jer nam nije potreban
      serializabilityCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(supabaseApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 