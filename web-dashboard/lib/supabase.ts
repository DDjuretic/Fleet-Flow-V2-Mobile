/**
 * FleetFlow Web Dashboard - Supabase Configuration
 * Server-side and client-side Supabase client setup
 */

import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side Supabase client
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch (error) {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

// Admin Supabase client (server-side only)
export function createAdminSupabaseClient() {
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  }

  return createServerClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Database types (shared with mobile app)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: string
          email: string
          first_name: string | null
          last_name: string | null
          company_id: string | null
          onboarding_status: string
          is_active: boolean
          created_at: string
          updated_at: string
          // ... other fields
        }
        Insert: {
          user_id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          company_id?: string | null
          onboarding_status?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          company_id?: string | null
          onboarding_status?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          company_id: string
          license_plate: string
          make: string
          model: string
          year: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          license_plate: string
          make: string
          model: string
          year: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          license_plate?: string
          make?: string
          model?: string
          year?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          user_id: string
          vehicle_id: string
          start_time: string
          end_time: string | null
          start_location: string
          end_location: string | null
          distance_km: number | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vehicle_id: string
          start_time: string
          end_time?: string | null
          start_location: string
          end_location?: string | null
          distance_km?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vehicle_id?: string
          start_time?: string
          end_time?: string | null
          start_location?: string
          end_location?: string | null
          distance_km?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      // ... other tables
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
