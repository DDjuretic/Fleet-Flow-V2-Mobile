import { combineReducers } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import settingsReducer from './slices/settingsSlice';
import authReducer from './slices/authSlice';
import { supabaseApi } from './api/supabaseApi';

const rootReducer = combineReducers({
  theme: themeReducer,
  settings: settingsReducer,
  auth: authReducer,
  [supabaseApi.reducerPath]: supabaseApi.reducer,
  // Add other reducers here as the app grows
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer; 