import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { 
  persistStore, 
  persistReducer, 
  FLUSH, 
  REHYDRATE, 
  PAUSE, 
  PERSIST, 
  PURGE, 
  REGISTER,
  createTransform 
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabaseApi } from './api/supabaseApi';
import themeReducer from './slices/themeSlice';
import settingsReducer from './slices/settingsSlice';
import authReducer from './slices/authSlice';

const rootReducer = combineReducers({
  theme: themeReducer,
  settings: settingsReducer,
  auth: authReducer,
  [supabaseApi.reducerPath]: supabaseApi.reducer,
});

// Custom transform to handle non-serializable values
const sanitizeTransform = createTransform(
  // transform state on its way to being serialized and persisted
  (inboundState: any) => {
    // Remove any functions or non-serializable values
    if (typeof inboundState === 'object' && inboundState !== null) {
      const sanitized = { ...inboundState };
      Object.keys(sanitized).forEach(key => {
        if (typeof sanitized[key] === 'function') {
          delete sanitized[key];
        }
      });
      return sanitized;
    }
    return inboundState;
  },
  // transform state being rehydrated
  (outboundState: any) => {
    return outboundState;
  }
);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['theme', 'settings'], // Only persist theme and settings
  blacklist: ['auth', supabaseApi.reducerPath], // Don't persist auth and API cache
  transforms: [sanitizeTransform], // Use custom transform
};

// @ts-ignore - redux-persist type compatibility issue
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer as any,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }).concat(supabaseApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;