import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, User, Session } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

// Use environment variables for both URL and Anon Key.
// These are set in your .env file and imported via babel-plugin-dotenv.
const supabaseUrlFromEnv = SUPABASE_URL;
const supabaseAnonKeyFromEnv = SUPABASE_ANON_KEY;

let supabaseUrl;
let supabaseAnonKey;

// In development, you might still want to override for emulators if not using .env for local dev
if (__DEV__) {
  // Fallback to old logic if .env is not set for local dev
  if (Platform.OS === 'android') {
    supabaseUrl = 'http://10.0.2.2:54321';
  } else {
    supabaseUrl = 'http://localhost:54321';
  }
  // Fallback for local anon key
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
} else {
  // For production, rely on environment variables
  supabaseUrl = supabaseUrlFromEnv;
  supabaseAnonKey = supabaseAnonKeyFromEnv;
}

// For production (and any case where .env is used), these variables are mandatory.
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 'Supabase URL or Anon Key is not defined. Ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set in your .env file.';
  console.error(errorMessage);
  throw new Error(errorMessage);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Eksportovanje User i Session tipova direktno iz @supabase/supabase-js ako su potrebni globalno,
// inače se mogu importovati tamo gde su potrebni. Za sada, ostavićemo ih ovde radi kompatibilnosti
// sa prethodnim očekivanjima, ali je bolje da se importuju gde treba.
export type { User, Session };

// Test connection function
export async function testConnection() {
  const { data, error } = await supabase.from('companies').select('*')
  if (error) {
    console.error('Supabase error:', error)
    return false
  } else {
    console.log('Supabase connection successful! First record:', data)
    return true
  }
} 