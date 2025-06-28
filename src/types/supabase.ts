export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      backup_data: {
        Row: {
          backup_data: Json
          backup_data_id: string
          backup_id: string
          created_at: string | null
          data_type: string
          record_count: number
          table_name: string
        }
        Insert: {
          backup_data: Json
          backup_data_id?: string
          backup_id: string
          created_at?: string | null
          data_type: string
          record_count?: number
          table_name: string
        }
        Update: {
          backup_data?: Json
          backup_data_id?: string
          backup_id?: string
          created_at?: string | null
          data_type?: string
          record_count?: number
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "backup_data_backup_id_fkey"
            columns: ["backup_id"]
            isOneToOne: false
            referencedRelation: "user_backup_summary"
            referencedColumns: ["backup_id"]
          },
          {
            foreignKeyName: "backup_data_backup_id_fkey"
            columns: ["backup_id"]
            isOneToOne: false
            referencedRelation: "user_backups"
            referencedColumns: ["backup_id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          bank_account: string | null
          bank_name: string | null
          city: string | null
          company_id: string
          contact_email: string | null
          contact_phone: string | null
          country: string | null
          created_at: string | null
          description: string | null
          employee_count: string | null
          founded_year: string | null
          industry: string | null
          name: string
          owner_id: string | null
          postal_code: string | null
          registration_number: string | null
          subscription_id: string | null
          swift_code: string | null
          tax_number: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          bank_account?: string | null
          bank_name?: string | null
          city?: string | null
          company_id?: string
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          employee_count?: string | null
          founded_year?: string | null
          industry?: string | null
          name: string
          owner_id?: string | null
          postal_code?: string | null
          registration_number?: string | null
          subscription_id?: string | null
          swift_code?: string | null
          tax_number?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          bank_account?: string | null
          bank_name?: string | null
          city?: string | null
          company_id?: string
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          employee_count?: string | null
          founded_year?: string | null
          industry?: string | null
          name?: string
          owner_id?: string | null
          postal_code?: string | null
          registration_number?: string | null
          subscription_id?: string | null
          swift_code?: string | null
          tax_number?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "user_stats_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "companies_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "companies_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["subscription_id"]
          },
        ]
      }
      departments: {
        Row: {
          company_id: string
          created_at: string | null
          department_id: string
          name: string
          parent_department_id: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          department_id?: string
          name: string
          parent_department_id?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          department_id?: string
          name?: string
          parent_department_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "departments_parent_department_id_fkey"
            columns: ["parent_department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["department_id"]
          },
        ]
      }
      expense_categories: {
        Row: {
          created_at: string | null
          default_gl_code: string | null
          description: string | null
          expense_category_id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_gl_code?: string | null
          description?: string | null
          expense_category_id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_gl_code?: string | null
          description?: string | null
          expense_category_id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      expense_receipts: {
        Row: {
          created_at: string | null
          expense_id: string
          file_name: string | null
          file_url: string
          mime_type: string | null
          receipt_id: string
          uploaded_at: string | null
          uploaded_by_user_id: string
        }
        Insert: {
          created_at?: string | null
          expense_id: string
          file_name?: string | null
          file_url: string
          mime_type?: string | null
          receipt_id?: string
          uploaded_at?: string | null
          uploaded_by_user_id: string
        }
        Update: {
          created_at?: string | null
          expense_id?: string
          file_name?: string | null
          file_url?: string
          mime_type?: string | null
          receipt_id?: string
          uploaded_at?: string | null
          uploaded_by_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_receipts_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["expense_id"]
          },
          {
            foreignKeyName: "expense_receipts_uploaded_by_user_id_fkey"
            columns: ["uploaded_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "expense_receipts_uploaded_by_user_id_fkey"
            columns: ["uploaded_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          approval_date: string | null
          approved_by_user_id: string | null
          company_id: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          expense_category_id: string
          expense_date: string
          expense_id: string
          fuel_liters: number | null
          fuel_price_per_liter: number | null
          is_reimbursable: boolean | null
          payment_method: string | null
          rejection_reason: string | null
          status: string | null
          trip_id: string | null
          updated_at: string | null
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          amount: number
          approval_date?: string | null
          approved_by_user_id?: string | null
          company_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          expense_category_id: string
          expense_date: string
          expense_id?: string
          fuel_liters?: number | null
          fuel_price_per_liter?: number | null
          is_reimbursable?: boolean | null
          payment_method?: string | null
          rejection_reason?: string | null
          status?: string | null
          trip_id?: string | null
          updated_at?: string | null
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          approval_date?: string | null
          approved_by_user_id?: string | null
          company_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          expense_category_id?: string
          expense_date?: string
          expense_id?: string
          fuel_liters?: number | null
          fuel_price_per_liter?: number | null
          is_reimbursable?: boolean | null
          payment_method?: string | null
          rejection_reason?: string | null
          status?: string | null
          trip_id?: string | null
          updated_at?: string | null
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "expenses_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "expenses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "expenses_expense_category_id_fkey"
            columns: ["expense_category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["expense_category_id"]
          },
          {
            foreignKeyName: "expenses_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "active_trips_optimized"
            referencedColumns: ["trip_id"]
          },
          {
            foreignKeyName: "expenses_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["trip_id"]
          },
          {
            foreignKeyName: "expenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "expenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "expenses_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["vehicle_id"]
          },
        ]
      }
      fuel_prices: {
        Row: {
          created_at: string | null
          currency: string | null
          effective_date: string
          fuel_type_id: string
          notes: string | null
          price_id: string
          price_per_unit: number
          region: string | null
          source: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          effective_date: string
          fuel_type_id: string
          notes?: string | null
          price_id?: string
          price_per_unit: number
          region?: string | null
          source?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          effective_date?: string
          fuel_type_id?: string
          notes?: string | null
          price_id?: string
          price_per_unit?: number
          region?: string | null
          source?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fuel_prices_fuel_type_id_fkey"
            columns: ["fuel_type_id"]
            isOneToOne: false
            referencedRelation: "fuel_types"
            referencedColumns: ["fuel_type_id"]
          },
        ]
      }
      fuel_types: {
        Row: {
          created_at: string | null
          description: string | null
          fuel_type_id: string
          name: string
          unit: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          fuel_type_id?: string
          name: string
          unit?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          fuel_type_id?: string
          name?: string
          unit?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          metadata: Json | null
          metric_id: string
          metric_name: string
          metric_unit: string | null
          metric_value: number | null
          recorded_at: string | null
        }
        Insert: {
          metadata?: Json | null
          metric_id?: string
          metric_name: string
          metric_unit?: string | null
          metric_value?: number | null
          recorded_at?: string | null
        }
        Update: {
          metadata?: Json | null
          metric_id?: string
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number | null
          recorded_at?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          created_at: string | null
          description: string | null
          module: string | null
          permission_id: string
          permission_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          module?: string | null
          permission_id?: string
          permission_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          module?: string | null
          permission_id?: string
          permission_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pois: {
        Row: {
          address: string | null
          category: string | null
          company_id: string | null
          contact_info: string | null
          created_at: string | null
          latitude: number
          longitude: number
          name: string
          notes: string | null
          poi_id: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          company_id?: string | null
          contact_info?: string | null
          created_at?: string | null
          latitude: number
          longitude: number
          name: string
          notes?: string | null
          poi_id?: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          category?: string | null
          company_id?: string | null
          contact_info?: string | null
          created_at?: string | null
          latitude?: number
          longitude?: number
          name?: string
          notes?: string | null
          poi_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pois_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      reminder_types: {
        Row: {
          created_at: string | null
          default_lead_time_days: number | null
          description: string | null
          name: string
          reminder_type_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_lead_time_days?: number | null
          description?: string | null
          name: string
          reminder_type_id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_lead_time_days?: number | null
          description?: string | null
          name?: string
          reminder_type_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reminders: {
        Row: {
          company_id: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string
          is_completed: boolean | null
          is_recurring: boolean | null
          is_system_generated: boolean | null
          parent_reminder_id: string | null
          recurrence_day_of_month: number | null
          recurrence_day_of_week: number | null
          recurrence_end_date: string | null
          recurrence_interval: number | null
          recurrence_pattern: string | null
          reminder_id: string
          reminder_type_id: string | null
          title: string
          updated_at: string | null
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          company_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date: string
          is_completed?: boolean | null
          is_recurring?: boolean | null
          is_system_generated?: boolean | null
          parent_reminder_id?: string | null
          recurrence_day_of_month?: number | null
          recurrence_day_of_week?: number | null
          recurrence_end_date?: string | null
          recurrence_interval?: number | null
          recurrence_pattern?: string | null
          reminder_id?: string
          reminder_type_id?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          company_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string
          is_completed?: boolean | null
          is_recurring?: boolean | null
          is_system_generated?: boolean | null
          parent_reminder_id?: string | null
          recurrence_day_of_month?: number | null
          recurrence_day_of_week?: number | null
          recurrence_end_date?: string | null
          recurrence_interval?: number | null
          recurrence_pattern?: string | null
          reminder_id?: string
          reminder_type_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reminders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "reminders_parent_reminder_id_fkey"
            columns: ["parent_reminder_id"]
            isOneToOne: false
            referencedRelation: "reminders"
            referencedColumns: ["reminder_id"]
          },
          {
            foreignKeyName: "reminders_reminder_type_id_fkey"
            columns: ["reminder_type_id"]
            isOneToOne: false
            referencedRelation: "reminder_types"
            referencedColumns: ["reminder_type_id"]
          },
          {
            foreignKeyName: "reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "reminders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["vehicle_id"]
          },
        ]
      }
      reservation_status: {
        Row: {
          created_at: string | null
          description: string | null
          reservation_status_id: string
          status_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          reservation_status_id?: string
          status_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          reservation_status_id?: string
          status_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reservations: {
        Row: {
          actual_vehicle_id: string | null
          approval_notes: string | null
          approved_by_user_id: string | null
          company_id: string | null
          created_at: string | null
          dropoff_location: string | null
          end_time: string
          pickup_location: string | null
          purpose: string | null
          rejection_reason: string | null
          requested_features: Json | null
          reservation_id: string
          start_time: string
          status_id: string
          updated_at: string | null
          user_id: string
          vehicle_id: string | null
          vehicle_type_id: string | null
        }
        Insert: {
          actual_vehicle_id?: string | null
          approval_notes?: string | null
          approved_by_user_id?: string | null
          company_id?: string | null
          created_at?: string | null
          dropoff_location?: string | null
          end_time: string
          pickup_location?: string | null
          purpose?: string | null
          rejection_reason?: string | null
          requested_features?: Json | null
          reservation_id?: string
          start_time: string
          status_id: string
          updated_at?: string | null
          user_id: string
          vehicle_id?: string | null
          vehicle_type_id?: string | null
        }
        Update: {
          actual_vehicle_id?: string | null
          approval_notes?: string | null
          approved_by_user_id?: string | null
          company_id?: string | null
          created_at?: string | null
          dropoff_location?: string | null
          end_time?: string
          pickup_location?: string | null
          purpose?: string | null
          rejection_reason?: string | null
          requested_features?: Json | null
          reservation_id?: string
          start_time?: string
          status_id?: string
          updated_at?: string | null
          user_id?: string
          vehicle_id?: string | null
          vehicle_type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_actual_vehicle_id_fkey"
            columns: ["actual_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["vehicle_id"]
          },
          {
            foreignKeyName: "reservations_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "reservations_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "reservations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "reservations_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "reservation_status"
            referencedColumns: ["reservation_status_id"]
          },
          {
            foreignKeyName: "reservations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "reservations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "reservations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["vehicle_id"]
          },
          {
            foreignKeyName: "reservations_vehicle_type_id_fkey"
            columns: ["vehicle_type_id"]
            isOneToOne: false
            referencedRelation: "vehicle_types"
            referencedColumns: ["vehicle_type_id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string | null
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string | null
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["permission_id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["role_id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          role_id: string
          role_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          role_id?: string
          role_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          role_id?: string
          role_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      standard_routes: {
        Row: {
          company_id: string | null
          cost_calculation_formula: string | null
          created_at: string | null
          end_address_manual: string | null
          end_poi_id: string | null
          estimated_duration_min: number | null
          name: string
          notes: string | null
          predefined_cost: number | null
          predefined_distance_km: number | null
          route_details_json: Json | null
          route_id: string
          start_address_manual: string | null
          start_poi_id: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          cost_calculation_formula?: string | null
          created_at?: string | null
          end_address_manual?: string | null
          end_poi_id?: string | null
          estimated_duration_min?: number | null
          name: string
          notes?: string | null
          predefined_cost?: number | null
          predefined_distance_km?: number | null
          route_details_json?: Json | null
          route_id?: string
          start_address_manual?: string | null
          start_poi_id?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          cost_calculation_formula?: string | null
          created_at?: string | null
          end_address_manual?: string | null
          end_poi_id?: string | null
          estimated_duration_min?: number | null
          name?: string
          notes?: string | null
          predefined_cost?: number | null
          predefined_distance_km?: number | null
          route_details_json?: Json | null
          route_id?: string
          start_address_manual?: string | null
          start_poi_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "standard_routes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "standard_routes_end_poi_id_fkey"
            columns: ["end_poi_id"]
            isOneToOne: false
            referencedRelation: "pois"
            referencedColumns: ["poi_id"]
          },
          {
            foreignKeyName: "standard_routes_start_poi_id_fkey"
            columns: ["start_poi_id"]
            isOneToOne: false
            referencedRelation: "pois"
            referencedColumns: ["poi_id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          features: Json | null
          max_users: number
          max_vehicles: number
          plan_name: string
          price_annual: number | null
          price_monthly: number | null
          subscription_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          features?: Json | null
          max_users?: number
          max_vehicles?: number
          plan_name: string
          price_annual?: number | null
          price_monthly?: number | null
          subscription_id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          features?: Json | null
          max_users?: number
          max_vehicles?: number
          plan_name?: string
          price_annual?: number | null
          price_monthly?: number | null
          subscription_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          company_id: string | null
          created_at: string | null
          description: string | null
          is_resolved: boolean | null
          log_id: string
          log_type: string
          metadata: Json | null
          related_expense_id: string | null
          related_trip_id: string | null
          related_vehicle_id: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by_user_id: string | null
          severity: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          is_resolved?: boolean | null
          log_id?: string
          log_type: string
          metadata?: Json | null
          related_expense_id?: string | null
          related_trip_id?: string | null
          related_vehicle_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by_user_id?: string | null
          severity: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          is_resolved?: boolean | null
          log_id?: string
          log_type?: string
          metadata?: Json | null
          related_expense_id?: string | null
          related_trip_id?: string | null
          related_vehicle_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by_user_id?: string | null
          severity?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "system_logs_related_expense_id_fkey"
            columns: ["related_expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["expense_id"]
          },
          {
            foreignKeyName: "system_logs_related_trip_id_fkey"
            columns: ["related_trip_id"]
            isOneToOne: false
            referencedRelation: "active_trips_optimized"
            referencedColumns: ["trip_id"]
          },
          {
            foreignKeyName: "system_logs_related_trip_id_fkey"
            columns: ["related_trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["trip_id"]
          },
          {
            foreignKeyName: "system_logs_related_vehicle_id_fkey"
            columns: ["related_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["vehicle_id"]
          },
          {
            foreignKeyName: "system_logs_resolved_by_user_id_fkey"
            columns: ["resolved_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "system_logs_resolved_by_user_id_fkey"
            columns: ["resolved_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "system_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "system_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      trip_purposes: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          is_active: boolean | null
          name: string
          trip_purpose_id: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          is_active?: boolean | null
          name: string
          trip_purpose_id?: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          is_active?: boolean | null
          name?: string
          trip_purpose_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trip_types: {
        Row: {
          created_at: string | null
          description: string | null
          is_billable: boolean | null
          name: string
          trip_type_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          is_billable?: boolean | null
          name: string
          trip_type_id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          is_billable?: boolean | null
          name?: string
          trip_type_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trips: {
        Row: {
          company_id: string | null
          created_at: string | null
          distance_km: number | null
          duration_minutes: number | null
          end_location_address: string | null
          end_time: string | null
          notes: string | null
          purpose_description: string | null
          route_details_json: Json | null
          start_location_address: string | null
          start_time: string
          status: Database["public"]["Enums"]["trip_status"] | null
          trip_id: string
          trip_purpose_id: string | null
          trip_type_id: string | null
          updated_at: string | null
          user_id: string
          vehicle_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          distance_km?: number | null
          duration_minutes?: number | null
          end_location_address?: string | null
          end_time?: string | null
          notes?: string | null
          purpose_description?: string | null
          route_details_json?: Json | null
          start_location_address?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["trip_status"] | null
          trip_id?: string
          trip_purpose_id?: string | null
          trip_type_id?: string | null
          updated_at?: string | null
          user_id: string
          vehicle_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          distance_km?: number | null
          duration_minutes?: number | null
          end_location_address?: string | null
          end_time?: string | null
          notes?: string | null
          purpose_description?: string | null
          route_details_json?: Json | null
          start_location_address?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["trip_status"] | null
          trip_id?: string
          trip_purpose_id?: string | null
          trip_type_id?: string | null
          updated_at?: string | null
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "trips_trip_purpose_id_fkey"
            columns: ["trip_purpose_id"]
            isOneToOne: false
            referencedRelation: "trip_purposes"
            referencedColumns: ["trip_purpose_id"]
          },
          {
            foreignKeyName: "trips_trip_type_id_fkey"
            columns: ["trip_type_id"]
            isOneToOne: false
            referencedRelation: "trip_types"
            referencedColumns: ["trip_type_id"]
          },
          {
            foreignKeyName: "trips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "trips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "trips_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["vehicle_id"]
          },
        ]
      }
      user_backups: {
        Row: {
          backup_description: string | null
          backup_id: string
          backup_metadata: Json
          backup_name: string
          backup_size_bytes: number
          backup_type: string
          created_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          backup_description?: string | null
          backup_id?: string
          backup_metadata?: Json
          backup_name: string
          backup_size_bytes?: number
          backup_type?: string
          created_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          backup_description?: string | null
          backup_id?: string
          backup_metadata?: Json
          backup_name?: string
          backup_size_bytes?: number
          backup_type?: string
          created_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_backups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_backups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_requests: {
        Row: {
          approval_notes: string | null
          approved_at: string | null
          approved_by_user_id: string | null
          created_at: string | null
          rejection_reason: string | null
          request_id: string
          request_type: string
          requested_by_user_id: string
          requested_changes: Json
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approval_notes?: string | null
          approved_at?: string | null
          approved_by_user_id?: string | null
          created_at?: string | null
          rejection_reason?: string | null
          request_id?: string
          request_type: string
          requested_by_user_id: string
          requested_changes: Json
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approval_notes?: string | null
          approved_at?: string | null
          approved_by_user_id?: string | null
          created_at?: string | null
          rejection_reason?: string | null
          request_id?: string
          request_type?: string
          requested_by_user_id?: string
          requested_changes?: Json
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_requests_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_requests_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_requests_requested_by_user_id_fkey"
            columns: ["requested_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_requests_requested_by_user_id_fkey"
            columns: ["requested_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          company_id: string | null
          created_at: string | null
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          company_id?: string | null
          created_at?: string | null
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          company_id?: string | null
          created_at?: string | null
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          alternative_phone: string | null
          avatar_url: string | null
          biography: string | null
          branch: string | null
          certifications: string | null
          company_id: string | null
          created_at: string | null
          date_of_birth: string | null
          driving_license_category: string | null
          driving_license_expiry: string | null
          driving_license_number: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          first_name: string | null
          has_private_vehicle: boolean | null
          home_address: string | null
          home_city: string | null
          home_country: string | null
          home_postal_code: string | null
          is_active: boolean | null
          is_email_verified: boolean | null
          languages: string | null
          last_login_at: string | null
          last_name: string | null
          manager: string | null
          onboarding_status: string | null
          password_hash: string | null
          phone_number: string | null
          position: string | null
          preferred_currency: string | null
          preferred_language: string | null
          preferred_theme: string | null
          preferred_units: string | null
          preferred_vehicle_id: string | null
          private_vehicle_make: string | null
          private_vehicle_model: string | null
          private_vehicle_plate: string | null
          skills: string | null
          updated_at: string | null
          user_id: string
          username: string | null
          work_address: string | null
          work_city: string | null
          work_country: string | null
          work_email: string | null
          work_postal_code: string | null
        }
        Insert: {
          alternative_phone?: string | null
          avatar_url?: string | null
          biography?: string | null
          branch?: string | null
          certifications?: string | null
          company_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          driving_license_category?: string | null
          driving_license_expiry?: string | null
          driving_license_number?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          first_name?: string | null
          has_private_vehicle?: boolean | null
          home_address?: string | null
          home_city?: string | null
          home_country?: string | null
          home_postal_code?: string | null
          is_active?: boolean | null
          is_email_verified?: boolean | null
          languages?: string | null
          last_login_at?: string | null
          last_name?: string | null
          manager?: string | null
          onboarding_status?: string | null
          password_hash?: string | null
          phone_number?: string | null
          position?: string | null
          preferred_currency?: string | null
          preferred_language?: string | null
          preferred_theme?: string | null
          preferred_units?: string | null
          preferred_vehicle_id?: string | null
          private_vehicle_make?: string | null
          private_vehicle_model?: string | null
          private_vehicle_plate?: string | null
          skills?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          work_address?: string | null
          work_city?: string | null
          work_country?: string | null
          work_email?: string | null
          work_postal_code?: string | null
        }
        Update: {
          alternative_phone?: string | null
          avatar_url?: string | null
          biography?: string | null
          branch?: string | null
          certifications?: string | null
          company_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          driving_license_category?: string | null
          driving_license_expiry?: string | null
          driving_license_number?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          first_name?: string | null
          has_private_vehicle?: boolean | null
          home_address?: string | null
          home_city?: string | null
          home_country?: string | null
          home_postal_code?: string | null
          is_active?: boolean | null
          is_email_verified?: boolean | null
          languages?: string | null
          last_login_at?: string | null
          last_name?: string | null
          manager?: string | null
          onboarding_status?: string | null
          password_hash?: string | null
          phone_number?: string | null
          position?: string | null
          preferred_currency?: string | null
          preferred_language?: string | null
          preferred_theme?: string | null
          preferred_units?: string | null
          preferred_vehicle_id?: string | null
          private_vehicle_make?: string | null
          private_vehicle_model?: string | null
          private_vehicle_plate?: string | null
          skills?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          work_address?: string | null
          work_city?: string | null
          work_country?: string | null
          work_email?: string | null
          work_postal_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      vehicle_assignments: {
        Row: {
          assignment_id: string
          assignment_type: string | null
          company_id: string | null
          created_at: string
          end_date: string | null
          notes: string | null
          start_date: string
          updated_at: string
          user_id: string
          vehicle_id: string
        }
        Insert: {
          assignment_id?: string
          assignment_type?: string | null
          company_id?: string | null
          created_at?: string
          end_date?: string | null
          notes?: string | null
          start_date: string
          updated_at?: string
          user_id: string
          vehicle_id: string
        }
        Update: {
          assignment_id?: string
          assignment_type?: string | null
          company_id?: string | null
          created_at?: string
          end_date?: string | null
          notes?: string | null
          start_date?: string
          updated_at?: string
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_assignments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "vehicle_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "vehicle_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "vehicle_assignments_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["vehicle_id"]
          },
        ]
      }
      vehicle_status: {
        Row: {
          created_at: string | null
          description: string | null
          name: string
          updated_at: string | null
          vehicle_status_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          name: string
          updated_at?: string | null
          vehicle_status_id?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          name?: string
          updated_at?: string | null
          vehicle_status_id?: string
        }
        Relationships: []
      }
      vehicle_types: {
        Row: {
          created_at: string | null
          description: string | null
          name: string
          updated_at: string | null
          vehicle_type_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          name: string
          updated_at?: string | null
          vehicle_type_id?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          name?: string
          updated_at?: string | null
          vehicle_type_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          avg_consumption: number | null
          battery_capacity_kwh: number | null
          cargo_capacity_kg: number | null
          cargo_volume_m3: number | null
          color: string | null
          company_id: string | null
          created_at: string | null
          current_odometer: number | null
          engine_power_hp: number | null
          engine_power_kw: number | null
          engine_type: string | null
          engine_volume_cc: number | null
          fare_base_price: number | null
          fare_per_km: number | null
          fuel_consumption_city: number | null
          fuel_consumption_combined: number | null
          fuel_consumption_highway: number | null
          fuel_tank_capacity: number | null
          fuel_type_id: string | null
          insurance_cost_annual: number | null
          insurance_expiry_date: string | null
          insurance_policy_number: string | null
          is_private_vehicle: boolean | null
          is_public_transport: boolean | null
          last_odometer_update: string | null
          license_plate: string
          make: string
          model: string
          notes: string | null
          pallet_capacity: number | null
          private_owner_contact: string | null
          private_owner_id: string | null
          private_owner_name: string | null
          public_transport_type: string | null
          registration_cost_annual: number | null
          registration_date: string | null
          registration_expiry_date: string | null
          required_license_category: string | null
          route_description: string | null
          seats_count: number | null
          service_interval_km: number | null
          service_interval_months: number | null
          ticket_price: number | null
          transport_company_license: string | null
          transport_company_name: string | null
          trunk_capacity_liters: number | null
          updated_at: string | null
          vehicle_id: string
          vehicle_status_id: string | null
          vehicle_type_id: string
          vin: string | null
          year: number
        }
        Insert: {
          avg_consumption?: number | null
          battery_capacity_kwh?: number | null
          cargo_capacity_kg?: number | null
          cargo_volume_m3?: number | null
          color?: string | null
          company_id?: string | null
          created_at?: string | null
          current_odometer?: number | null
          engine_power_hp?: number | null
          engine_power_kw?: number | null
          engine_type?: string | null
          engine_volume_cc?: number | null
          fare_base_price?: number | null
          fare_per_km?: number | null
          fuel_consumption_city?: number | null
          fuel_consumption_combined?: number | null
          fuel_consumption_highway?: number | null
          fuel_tank_capacity?: number | null
          fuel_type_id?: string | null
          insurance_cost_annual?: number | null
          insurance_expiry_date?: string | null
          insurance_policy_number?: string | null
          is_private_vehicle?: boolean | null
          is_public_transport?: boolean | null
          last_odometer_update?: string | null
          license_plate: string
          make: string
          model: string
          notes?: string | null
          pallet_capacity?: number | null
          private_owner_contact?: string | null
          private_owner_id?: string | null
          private_owner_name?: string | null
          public_transport_type?: string | null
          registration_cost_annual?: number | null
          registration_date?: string | null
          registration_expiry_date?: string | null
          required_license_category?: string | null
          route_description?: string | null
          seats_count?: number | null
          service_interval_km?: number | null
          service_interval_months?: number | null
          ticket_price?: number | null
          transport_company_license?: string | null
          transport_company_name?: string | null
          trunk_capacity_liters?: number | null
          updated_at?: string | null
          vehicle_id?: string
          vehicle_status_id?: string | null
          vehicle_type_id: string
          vin?: string | null
          year: number
        }
        Update: {
          avg_consumption?: number | null
          battery_capacity_kwh?: number | null
          cargo_capacity_kg?: number | null
          cargo_volume_m3?: number | null
          color?: string | null
          company_id?: string | null
          created_at?: string | null
          current_odometer?: number | null
          engine_power_hp?: number | null
          engine_power_kw?: number | null
          engine_type?: string | null
          engine_volume_cc?: number | null
          fare_base_price?: number | null
          fare_per_km?: number | null
          fuel_consumption_city?: number | null
          fuel_consumption_combined?: number | null
          fuel_consumption_highway?: number | null
          fuel_tank_capacity?: number | null
          fuel_type_id?: string | null
          insurance_cost_annual?: number | null
          insurance_expiry_date?: string | null
          insurance_policy_number?: string | null
          is_private_vehicle?: boolean | null
          is_public_transport?: boolean | null
          last_odometer_update?: string | null
          license_plate?: string
          make?: string
          model?: string
          notes?: string | null
          pallet_capacity?: number | null
          private_owner_contact?: string | null
          private_owner_id?: string | null
          private_owner_name?: string | null
          public_transport_type?: string | null
          registration_cost_annual?: number | null
          registration_date?: string | null
          registration_expiry_date?: string | null
          required_license_category?: string | null
          route_description?: string | null
          seats_count?: number | null
          service_interval_km?: number | null
          service_interval_months?: number | null
          ticket_price?: number | null
          transport_company_license?: string | null
          transport_company_name?: string | null
          trunk_capacity_liters?: number | null
          updated_at?: string | null
          vehicle_id?: string
          vehicle_status_id?: string | null
          vehicle_type_id?: string
          vin?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "vehicles_fuel_type_id_fkey"
            columns: ["fuel_type_id"]
            isOneToOne: false
            referencedRelation: "fuel_types"
            referencedColumns: ["fuel_type_id"]
          },
          {
            foreignKeyName: "vehicles_private_owner_id_fkey"
            columns: ["private_owner_id"]
            isOneToOne: false
            referencedRelation: "user_stats_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "vehicles_private_owner_id_fkey"
            columns: ["private_owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "vehicles_vehicle_status_id_fkey"
            columns: ["vehicle_status_id"]
            isOneToOne: false
            referencedRelation: "vehicle_status"
            referencedColumns: ["vehicle_status_id"]
          },
          {
            foreignKeyName: "vehicles_vehicle_status_id_fkey"
            columns: ["vehicle_status_id"]
            isOneToOne: false
            referencedRelation: "vehicle_statuses"
            referencedColumns: ["vehicle_status_id"]
          },
          {
            foreignKeyName: "vehicles_vehicle_type_id_fkey"
            columns: ["vehicle_type_id"]
            isOneToOne: false
            referencedRelation: "vehicle_types"
            referencedColumns: ["vehicle_type_id"]
          },
        ]
      }
    }
    Views: {
      active_trips_optimized: {
        Row: {
          created_at: string | null
          end_location_address: string | null
          first_name: string | null
          last_name: string | null
          license_plate: string | null
          make: string | null
          model: string | null
          purpose_description: string | null
          start_location_address: string | null
          start_time: string | null
          status: Database["public"]["Enums"]["trip_status"] | null
          trip_id: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "trips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown | null
          f_table_catalog: unknown | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown | null
          f_table_catalog: string | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      pending_reservations_optimized: {
        Row: {
          created_at: string | null
          end_time: string | null
          first_name: string | null
          last_name: string | null
          license_plate: string | null
          make: string | null
          model: string | null
          purpose: string | null
          reservation_id: string | null
          start_time: string | null
          status_name: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "reservations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_backup_summary: {
        Row: {
          backup_description: string | null
          backup_id: string | null
          backup_name: string | null
          backup_size_bytes: number | null
          backup_type: string | null
          chat_group_count: number | null
          created_at: string | null
          email: string | null
          expense_count: number | null
          message_count: number | null
          notification_count: number | null
          poi_count: number | null
          reminder_count: number | null
          reservation_count: number | null
          route_count: number | null
          total_records: number | null
          trip_count: number | null
          user_id: string | null
          username: string | null
          vehicle_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_backups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_mv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_backups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_stats_mv: {
        Row: {
          first_name: string | null
          last_name: string | null
          last_trip_date: string | null
          total_expense_amount: number | null
          total_expenses: number | null
          total_reservations: number | null
          total_trips: number | null
          user_id: string | null
        }
        Relationships: []
      }
      vehicle_statuses: {
        Row: {
          created_at: string | null
          description: string | null
          status_name: string | null
          updated_at: string | null
          vehicle_status_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          status_name?: string | null
          updated_at?: string | null
          vehicle_status_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          status_name?: string | null
          updated_at?: string | null
          vehicle_status_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: {
          oldname: string
          newname: string
          version: string
        }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: {
          tbl: unknown
          col: string
        }
        Returns: unknown
      }
      _postgis_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_scripts_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_selectivity: {
        Args: {
          tbl: unknown
          att_name: string
          geom: unknown
          mode?: string
        }
        Returns: number
      }
      _st_3dintersects: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_bestsrid: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      _st_contains: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_coveredby:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
            }
            Returns: boolean
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: boolean
          }
      _st_covers:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
            }
            Returns: boolean
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: boolean
          }
      _st_crosses: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_intersects: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: {
          line1: unknown
          line2: unknown
        }
        Returns: number
      }
      _st_longestline: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      _st_orderingequals: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_overlaps: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_pointoutside: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      _st_sortablehash: {
        Args: {
          geom: unknown
        }
        Returns: number
      }
      _st_touches: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          g1: unknown
          clip?: unknown
          tolerance?: number
          return_polygons?: boolean
        }
        Returns: unknown
      }
      _st_within: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      addauth: {
        Args: {
          "": string
        }
        Returns: boolean
      }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
              column_name: string
              new_srid_in: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              schema_name: string
              table_name: string
              column_name: string
              new_srid: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              table_name: string
              column_name: string
              new_srid: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
            Returns: string
          }
      box:
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      box2d:
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      box2d_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box2d_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box2df_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box2df_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box3d:
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      box3d_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box3d_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      box3dtobox: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      bytea:
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      check_admin_user_status: {
        Args: {
          admin_email: string
        }
        Returns: Json
      }
      check_vehicle_data: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      cleanup_old_backups: {
        Args: {
          p_user_id: string
          p_keep_count?: number
        }
        Returns: number
      }
      cleanup_old_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      complete_admin_setup: {
        Args: {
          admin_email: string
        }
        Returns: Json
      }
      create_admin_user_safe: {
        Args: {
          admin_email: string
          admin_password: string
          admin_first_name?: string
          admin_last_name?: string
        }
        Returns: Json
      }
      create_user_backup: {
        Args: {
          p_backup_name?: string
          p_backup_description?: string
          p_is_automatic?: boolean
        }
        Returns: string
      }
      daily_maintenance: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      disablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
              column_name: string
            }
            Returns: string
          }
        | {
            Args: {
              schema_name: string
              table_name: string
              column_name: string
            }
            Returns: string
          }
        | {
            Args: {
              table_name: string
              column_name: string
            }
            Returns: string
          }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              table_name: string
            }
            Returns: string
          }
      enablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      equals: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geography:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      geography_analyze: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      geography_gist_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geography_gist_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geography_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geography_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      geography_spgist_compress_nd: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geography_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      geography_typmod_out: {
        Args: {
          "": number
        }
        Returns: unknown
      }
      geometry:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      geometry_above: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_analyze: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      geometry_below: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_cmp: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      geometry_contained_3d: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_contains: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      geometry_eq: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_ge: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_gist_compress_2d: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_gist_compress_nd: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_gist_decompress_2d: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_gist_decompress_nd: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_gist_sortsupport_2d: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      geometry_gt: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_hash: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      geometry_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_le: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_left: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_lt: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_overabove: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_overleft: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_overright: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_right: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_same: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometry_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      geometry_sortsupport: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      geometry_spgist_compress_2d: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_spgist_compress_3d: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_spgist_compress_nd: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      geometry_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      geometry_typmod_out: {
        Args: {
          "": number
        }
        Returns: unknown
      }
      geometry_within: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      geometrytype:
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      geomfromewkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      geomfromewkt: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      get_proj4_from_srid: {
        Args: {
          "": number
        }
        Returns: string
      }
      gettransactionid: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      gidx_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gidx_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      json: {
        Args: {
          "": unknown
        }
        Returns: Json
      }
      jsonb: {
        Args: {
          "": unknown
        }
        Returns: Json
      }
      longtransactionsenabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      path: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      pgis_asflatgeobuf_finalfn: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      pgis_asgeobuf_finalfn: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      pgis_asmvt_finalfn: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      pgis_asmvt_serialfn: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      pgis_geometry_clusterintersecting_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown[]
      }
      pgis_geometry_clusterwithin_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown[]
      }
      pgis_geometry_collect_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      pgis_geometry_makeline_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      pgis_geometry_polygonize_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      pgis_geometry_union_parallel_finalfn: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      pgis_geometry_union_parallel_serialfn: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      point: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      polygon: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      populate_geometry_columns:
        | {
            Args: {
              tbl_oid: unknown
              use_typmod?: boolean
            }
            Returns: number
          }
        | {
            Args: {
              use_typmod?: boolean
            }
            Returns: string
          }
      postgis_addbbox: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_constraint_dims: {
        Args: {
          geomschema: string
          geomtable: string
          geomcolumn: string
        }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: {
          geomschema: string
          geomtable: string
          geomcolumn: string
        }
        Returns: number
      }
      postgis_constraint_type: {
        Args: {
          geomschema: string
          geomtable: string
          geomcolumn: string
        }
        Returns: string
      }
      postgis_dropbbox: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_extensions_upgrade: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_full_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_geos_noop: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_geos_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_getbbox: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_hasbbox: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      postgis_index_supportfn: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_lib_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_revision: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libjson_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_liblwgeom_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libprotobuf_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libxml_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_noop: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      postgis_proj_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_installed: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_released: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_svn_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_type_name: {
        Args: {
          geomname: string
          coord_dimension: number
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_typmod_dims: {
        Args: {
          "": number
        }
        Returns: number
      }
      postgis_typmod_srid: {
        Args: {
          "": number
        }
        Returns: number
      }
      postgis_typmod_type: {
        Args: {
          "": number
        }
        Returns: string
      }
      postgis_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_wagyu_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      record_performance_metric: {
        Args: {
          p_metric_name: string
          p_metric_value: number
          p_metric_unit?: string
          p_metadata?: Json
        }
        Returns: undefined
      }
      refresh_performance_views: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      restore_user_backup: {
        Args: {
          p_user_id: string
          p_backup_id: string
          p_restore_vehicles?: boolean
          p_restore_pois?: boolean
          p_restore_routes?: boolean
          p_restore_expenses?: boolean
          p_restore_reminders?: boolean
          p_restore_trips?: boolean
          p_restore_reservations?: boolean
          p_restore_messages?: boolean
          p_restore_notifications?: boolean
          p_restore_chat_groups?: boolean
        }
        Returns: Json
      }
      spheroid_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      spheroid_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_3dclosestpoint: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_3ddistance: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_3dintersects: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_3dlength: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_3dlongestline: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_3dperimeter: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_3dshortestline: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_addpoint: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_angle:
        | {
            Args: {
              line1: unknown
              line2: unknown
            }
            Returns: number
          }
        | {
            Args: {
              pt1: unknown
              pt2: unknown
              pt3: unknown
              pt4?: unknown
            }
            Returns: number
          }
      st_area:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              geog: unknown
              use_spheroid?: boolean
            }
            Returns: number
          }
      st_area2d: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_asbinary:
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      st_asencodedpolyline: {
        Args: {
          geom: unknown
          nprecision?: number
        }
        Returns: string
      }
      st_asewkb: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      st_asewkt:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      st_asgeojson:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              maxdecimaldigits?: number
              options?: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              maxdecimaldigits?: number
              options?: number
            }
            Returns: string
          }
        | {
            Args: {
              r: Record<string, unknown>
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
            }
            Returns: string
          }
      st_asgml:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              maxdecimaldigits?: number
              options?: number
            }
            Returns: string
          }
        | {
            Args: {
              version: number
              geog: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
            Returns: string
          }
        | {
            Args: {
              version: number
              geom: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
            Returns: string
          }
      st_ashexewkb: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      st_askml:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              maxdecimaldigits?: number
              nprefix?: string
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              maxdecimaldigits?: number
              nprefix?: string
            }
            Returns: string
          }
      st_aslatlontext: {
        Args: {
          geom: unknown
          tmpl?: string
        }
        Returns: string
      }
      st_asmarc21: {
        Args: {
          geom: unknown
          format?: string
        }
        Returns: string
      }
      st_asmvtgeom: {
        Args: {
          geom: unknown
          bounds: unknown
          extent?: number
          buffer?: number
          clip_geom?: boolean
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              rel?: number
              maxdecimaldigits?: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              rel?: number
              maxdecimaldigits?: number
            }
            Returns: string
          }
      st_astext:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      st_astwkb:
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_z?: number
              prec_m?: number
              with_sizes?: boolean
              with_boxes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_z?: number
              prec_m?: number
              with_sizes?: boolean
              with_boxes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: {
          geom: unknown
          maxdecimaldigits?: number
          options?: number
        }
        Returns: string
      }
      st_azimuth:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
            }
            Returns: number
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: number
          }
      st_boundary: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_boundingdiagonal: {
        Args: {
          geom: unknown
          fits?: boolean
        }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: {
              geom: unknown
              radius: number
              options?: string
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              radius: number
              quadsegs: number
            }
            Returns: unknown
          }
      st_buildarea: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_centroid:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      st_cleangeometry: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_clipbybox2d: {
        Args: {
          geom: unknown
          box: unknown
        }
        Returns: unknown
      }
      st_closestpoint: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_clusterintersecting: {
        Args: {
          "": unknown[]
        }
        Returns: unknown[]
      }
      st_collect:
        | {
            Args: {
              "": unknown[]
            }
            Returns: unknown
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: unknown
          }
      st_collectionextract: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_collectionhomogenize: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_concavehull: {
        Args: {
          param_geom: unknown
          param_pctconvex: number
          param_allow_holes?: boolean
        }
        Returns: unknown
      }
      st_contains: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_containsproperly: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_convexhull: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_coorddim: {
        Args: {
          geometry: unknown
        }
        Returns: number
      }
      st_coveredby:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
            }
            Returns: boolean
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: boolean
          }
      st_covers:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
            }
            Returns: boolean
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: boolean
          }
      st_crosses: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_curvetoline: {
        Args: {
          geom: unknown
          tol?: number
          toltype?: number
          flags?: number
        }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: {
          g1: unknown
          tolerance?: number
          flags?: number
        }
        Returns: unknown
      }
      st_difference: {
        Args: {
          geom1: unknown
          geom2: unknown
          gridsize?: number
        }
        Returns: unknown
      }
      st_dimension: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_disjoint: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_distance:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
              use_spheroid?: boolean
            }
            Returns: number
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: number
          }
      st_distancesphere:
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: number
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
              radius: number
            }
            Returns: number
          }
      st_distancespheroid: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_dump: {
        Args: {
          "": unknown
        }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumppoints: {
        Args: {
          "": unknown
        }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumprings: {
        Args: {
          "": unknown
        }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumpsegments: {
        Args: {
          "": unknown
        }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_endpoint: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_envelope: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_equals: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_expand:
        | {
            Args: {
              box: unknown
              dx: number
              dy: number
            }
            Returns: unknown
          }
        | {
            Args: {
              box: unknown
              dx: number
              dy: number
              dz?: number
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              dx: number
              dy: number
              dz?: number
              dm?: number
            }
            Returns: unknown
          }
      st_exteriorring: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_flipcoordinates: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_force2d: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_force3d: {
        Args: {
          geom: unknown
          zvalue?: number
        }
        Returns: unknown
      }
      st_force3dm: {
        Args: {
          geom: unknown
          mvalue?: number
        }
        Returns: unknown
      }
      st_force3dz: {
        Args: {
          geom: unknown
          zvalue?: number
        }
        Returns: unknown
      }
      st_force4d: {
        Args: {
          geom: unknown
          zvalue?: number
          mvalue?: number
        }
        Returns: unknown
      }
      st_forcecollection: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_forcecurve: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_forcepolygonccw: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_forcepolygoncw: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_forcerhr: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_forcesfs: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_generatepoints:
        | {
            Args: {
              area: unknown
              npoints: number
            }
            Returns: unknown
          }
        | {
            Args: {
              area: unknown
              npoints: number
              seed: number
            }
            Returns: unknown
          }
      st_geogfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geogfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geographyfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geohash:
        | {
            Args: {
              geog: unknown
              maxchars?: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              maxchars?: number
            }
            Returns: string
          }
      st_geomcollfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomcollfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geometricmedian: {
        Args: {
          g: unknown
          tolerance?: number
          max_iter?: number
          fail_if_not_converged?: boolean
        }
        Returns: unknown
      }
      st_geometryfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geometrytype: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      st_geomfromewkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfromewkt: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfromgeojson:
        | {
            Args: {
              "": Json
            }
            Returns: unknown
          }
        | {
            Args: {
              "": Json
            }
            Returns: unknown
          }
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
      st_geomfromgml: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfromkml: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfrommarc21: {
        Args: {
          marc21xml: string
        }
        Returns: unknown
      }
      st_geomfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfromtwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_geomfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_gmltosql: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_hasarc: {
        Args: {
          geometry: unknown
        }
        Returns: boolean
      }
      st_hausdorffdistance: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_hexagon: {
        Args: {
          size: number
          cell_i: number
          cell_j: number
          origin?: unknown
        }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: {
          size: number
          bounds: unknown
        }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: {
          line: unknown
          point: unknown
        }
        Returns: number
      }
      st_intersection: {
        Args: {
          geom1: unknown
          geom2: unknown
          gridsize?: number
        }
        Returns: unknown
      }
      st_intersects:
        | {
            Args: {
              geog1: unknown
              geog2: unknown
            }
            Returns: boolean
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: boolean
          }
      st_isclosed: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_iscollection: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_isempty: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_ispolygonccw: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_ispolygoncw: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_isring: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_issimple: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_isvalid: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_isvaliddetail: {
        Args: {
          geom: unknown
          flags?: number
        }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
      }
      st_isvalidreason: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      st_isvalidtrajectory: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      st_length:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              geog: unknown
              use_spheroid?: boolean
            }
            Returns: number
          }
      st_length2d: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_letters: {
        Args: {
          letters: string
          font?: Json
        }
        Returns: unknown
      }
      st_linecrossingdirection: {
        Args: {
          line1: unknown
          line2: unknown
        }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: {
          txtin: string
          nprecision?: number
        }
        Returns: unknown
      }
      st_linefrommultipoint: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_linefromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_linefromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_linelocatepoint: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_linemerge: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_linestringfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_linetocurve: {
        Args: {
          geometry: unknown
        }
        Returns: unknown
      }
      st_locatealong: {
        Args: {
          geometry: unknown
          measure: number
          leftrightoffset?: number
        }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          geometry: unknown
          frommeasure: number
          tomeasure: number
          leftrightoffset?: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: {
          geometry: unknown
          fromelevation: number
          toelevation: number
        }
        Returns: unknown
      }
      st_longestline: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_m: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_makebox2d: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_makeline:
        | {
            Args: {
              "": unknown[]
            }
            Returns: unknown
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: unknown
          }
      st_makepolygon: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_makevalid:
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              params: string
            }
            Returns: unknown
          }
      st_maxdistance: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: number
      }
      st_maximuminscribedcircle: {
        Args: {
          "": unknown
        }
        Returns: Record<string, unknown>
      }
      st_memsize: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: {
          inputgeom: unknown
          segs_per_quarter?: number
        }
        Returns: unknown
      }
      st_minimumboundingradius: {
        Args: {
          "": unknown
        }
        Returns: Record<string, unknown>
      }
      st_minimumclearance: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_minimumclearanceline: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_mlinefromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_mlinefromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_mpointfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_mpointfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_mpolyfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_mpolyfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multi: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_multilinefromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multilinestringfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multipointfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multipointfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multipolyfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_multipolygonfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_ndims: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_node: {
        Args: {
          g: unknown
        }
        Returns: unknown
      }
      st_normalize: {
        Args: {
          geom: unknown
        }
        Returns: unknown
      }
      st_npoints: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_nrings: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_numgeometries: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_numinteriorring: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_numinteriorrings: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_numpatches: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_numpoints: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_offsetcurve: {
        Args: {
          line: unknown
          distance: number
          params?: string
        }
        Returns: unknown
      }
      st_orderingequals: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_orientedenvelope: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_overlaps: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_perimeter:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              geog: unknown
              use_spheroid?: boolean
            }
            Returns: number
          }
      st_perimeter2d: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_pointfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_pointfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_pointm: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          mcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_pointonsurface: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_points: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
          mcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_polyfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_polyfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_polygonfromtext: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_polygonfromwkb: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_polygonize: {
        Args: {
          "": unknown[]
        }
        Returns: unknown
      }
      st_project: {
        Args: {
          geog: unknown
          distance: number
          azimuth: number
        }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_x: number
          prec_y?: number
          prec_z?: number
          prec_m?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: {
          geom: unknown
          gridsize: number
        }
        Returns: unknown
      }
      st_relate: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: string
      }
      st_removerepeatedpoints: {
        Args: {
          geom: unknown
          tolerance?: number
        }
        Returns: unknown
      }
      st_reverse: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_segmentize: {
        Args: {
          geog: unknown
          max_segment_length: number
        }
        Returns: unknown
      }
      st_setsrid:
        | {
            Args: {
              geog: unknown
              srid: number
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              srid: number
            }
            Returns: unknown
          }
      st_sharedpaths: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_shiftlongitude: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_shortestline: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: {
          geom: unknown
          vertex_fraction: number
          is_outer?: boolean
        }
        Returns: unknown
      }
      st_split: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_square: {
        Args: {
          size: number
          cell_i: number
          cell_j: number
          origin?: unknown
        }
        Returns: unknown
      }
      st_squaregrid: {
        Args: {
          size: number
          bounds: unknown
        }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | {
            Args: {
              geog: unknown
            }
            Returns: number
          }
        | {
            Args: {
              geom: unknown
            }
            Returns: number
          }
      st_startpoint: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      st_subdivide: {
        Args: {
          geom: unknown
          maxvertices?: number
          gridsize?: number
        }
        Returns: unknown[]
      }
      st_summary:
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      st_swapordinates: {
        Args: {
          geom: unknown
          ords: unknown
        }
        Returns: unknown
      }
      st_symdifference: {
        Args: {
          geom1: unknown
          geom2: unknown
          gridsize?: number
        }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          zoom: number
          x: number
          y: number
          bounds?: unknown
          margin?: number
        }
        Returns: unknown
      }
      st_touches: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_transform:
        | {
            Args: {
              geom: unknown
              from_proj: string
              to_proj: string
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              from_proj: string
              to_srid: number
            }
            Returns: unknown
          }
        | {
            Args: {
              geom: unknown
              to_proj: string
            }
            Returns: unknown
          }
      st_triangulatepolygon: {
        Args: {
          g1: unknown
        }
        Returns: unknown
      }
      st_union:
        | {
            Args: {
              "": unknown[]
            }
            Returns: unknown
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              geom1: unknown
              geom2: unknown
              gridsize: number
            }
            Returns: unknown
          }
      st_voronoilines: {
        Args: {
          g1: unknown
          tolerance?: number
          extend_to?: unknown
        }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: {
          g1: unknown
          tolerance?: number
          extend_to?: unknown
        }
        Returns: unknown
      }
      st_within: {
        Args: {
          geom1: unknown
          geom2: unknown
        }
        Returns: boolean
      }
      st_wkbtosql: {
        Args: {
          wkb: string
        }
        Returns: unknown
      }
      st_wkttosql: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      st_wrapx: {
        Args: {
          geom: unknown
          wrap: number
          move: number
        }
        Returns: unknown
      }
      st_x: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_xmax: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_xmin: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_y: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_ymax: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_ymin: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_z: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_zmax: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_zmflag: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      st_zmin: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      text: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      unlockrows: {
        Args: {
          "": string
        }
        Returns: number
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          schema_name: string
          table_name: string
          column_name: string
          new_srid_in: number
        }
        Returns: string
      }
    }
    Enums: {
      reservation_status_enum:
        | "PENDING_APPROVAL"
        | "APPROVED"
        | "REJECTED"
        | "CANCELLED"
        | "COMPLETED"
      trip_status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
      user_status: "active" | "inactive" | "suspended"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown | null
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

