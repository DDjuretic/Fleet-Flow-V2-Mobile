import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { supabase } from '../../lib/supabase'; // Sada je ovo standardni Supabase klijent
import type { PostgrestError } from '@supabase/supabase-js';

// Definicije tipova za podatke iz baze
export interface DbReminderType {
  reminder_type_id: string;
  name: string;
  description?: string | null;
  default_lead_time_days?: number | null;
  created_at: string;
  updated_at: string;
}

export interface DbExpenseCategory {
  expense_category_id: string;
  name: string;
  description?: string | null;
  default_gl_code?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbExpense {
  expense_id: string;
  user_id: string;
  trip_id?: string | null;
  vehicle_id?: string | null;
  expense_category_id: string;
  amount: number;
  currency: string;
  expense_date: string;
  description?: string | null;
  status: string;
  approved_by_user_id?: string | null;
  approval_date?: string | null;
  rejection_reason?: string | null;
  payment_method?: string | null;
  fuel_liters?: number | null;
  fuel_price_per_liter?: number | null;
  is_reimbursable: boolean;
  created_at: string;
  updated_at: string;
  
  // Joined data
  expense_categories?: { expense_category_id: string; name: string } | null;
  vehicles?: DbVehicle | null;
  users?: DbUserShort | null;
}

export interface DbVehicleType { // Added for joining with Vehicles
  vehicle_type_id: string; // Assuming UUID, adjust if INT
  name: string;
  description?: string | null;
}

export interface DbVehicleStatus { // Added for vehicle status
  vehicle_status_id: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbVehicle {
  vehicle_id: string;
  company_id?: string | null;
  vehicle_type_id: string;
  vehicle_status_id?: string | null;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  vin?: string | null;
  color?: string | null;
  engine_type?: string | null;
  fuel_type_id?: string | null;
  fuel_tank_capacity?: number | null;
  battery_capacity_kwh?: number | null;
  avg_consumption?: number | null;
  current_odometer?: number | null;
  last_odometer_update?: string | null;
  registration_date?: string | null;
  registration_expiry_date?: string | null;
  insurance_policy_number?: string | null;
  insurance_expiry_date?: string | null;
  is_private_vehicle: boolean;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  
  // New detailed vehicle specifications
  seats_count?: number | null;
  trunk_capacity_liters?: number | null;
  cargo_capacity_kg?: number | null;
  cargo_volume_m3?: number | null;
  pallet_capacity?: number | null;
  required_license_category?: string | null;
  engine_volume_cc?: number | null;
  engine_power_kw?: number | null;
  engine_power_hp?: number | null;
  fuel_consumption_city?: number | null;
  fuel_consumption_highway?: number | null;
  fuel_consumption_combined?: number | null;
  
  // Registration and insurance costs
  registration_cost_annual?: number | null;
  insurance_cost_annual?: number | null;
  service_interval_km?: number | null;
  service_interval_months?: number | null;
  
  // Private vehicle owner info
  private_owner_name?: string | null;
  private_owner_contact?: string | null;
  private_owner_id?: string | null;
  
  // Public transport info
  is_public_transport?: boolean | null;
  public_transport_type?: string | null; // 'bus', 'taxi', 'shuttle', etc.
  transport_company_name?: string | null;
  transport_company_license?: string | null;
  fare_per_km?: number | null;
  fare_base_price?: number | null;
  ticket_price?: number | null;
  route_description?: string | null;
  

  
  // Joined data
  vehicle_types?: DbVehicleType | null;
  fuel_types?: DbFuelType | null;
  vehicle_status?: { vehicle_status_id: string; name: string } | null;
}

export interface DbTripType {
  trip_type_id: string; // Assuming UUID, adjust if INT
  name: string;
  description?: string | null;
  is_billable: boolean;
}

export interface DbTripPurpose {
  trip_purpose_id: string;
  name: string;
  description?: string | null;
  is_active?: boolean | null;
  category?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbTrip {
  trip_id: string;
  user_id: string;
  vehicle_id: string;
  trip_type_id?: string | null;
  trip_purpose_id?: string | null;
  travel_order_id?: string | null;
  start_time: string;
  end_time?: string | null;
  start_location_address?: string | null;
  end_location_address?: string | null;
  distance_km?: number | null;
  duration_minutes?: number | null;
  status: string;
  notes?: string | null;
  purpose_description?: string | null;
  path?: any[] | null;
  pause_details?: any | null;
  individual_cost?: number | null;
  vehicle_type?: string | null;
  fuel_cost_params_snapshot?: any | null;
  created_at: string;
  updated_at: string;

  // Joined data
  vehicles?: DbVehicle | null;
  trip_types?: DbTripType | null;
  users?: DbUserShort | null;
  travel_orders?: DbTravelOrder | null;
}

export interface DbTravelOrder {
  id: string;
  user_id: string;
  company_id: string;
  status: string; // 'active', 'completed', 'pending_approval'
  purpose?: string | null;
  start_date: string;
  end_date?: string | null;
  total_distance_km: number;
  base_cost: number;
  calculated_total_cost: number;
  cost_calculation_rules_snapshot?: any | null;
  cost_breakdown?: any | null;
  created_at: string;
  updated_at: string;

  // Joined data
  users?: DbUserShort | null;
  companies?: any | null;
}

export interface DbReminder {
  reminder_id: string;
  user_id: string;
  reminder_type_id?: string;
  reminder_types: DbReminderType | null;
  vehicle_id?: string;
  vehicles: DbVehicle | null;
  title: string;
  description: string | null;
  due_date: string;
  is_system_generated: boolean;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  
  // Recurring reminder fields
  is_recurring?: boolean | null;
  recurrence_pattern?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  recurrence_interval?: number | null; // every N days/weeks/months/years
  recurrence_day_of_week?: number | null; // 0=Sunday, 1=Monday, etc. for weekly
  recurrence_day_of_month?: number | null; // 1-31 for monthly
  recurrence_end_date?: string | null;
  parent_reminder_id?: string | null; // for child reminders
}

// START NEW INTERFACES FOR RESERVATIONS
export interface DbUserShort {
  user_id?: string;
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  id?: string; // For compatibility
  user_metadata?: any; // For compatibility
}

export interface DbVehicleShort { // For joined data with Reservations
  vehicle_id: string;
  make?: string | null;
  model?: string | null;
  license_plate?: string | null;
  vehicle_types?: DbVehicleType | null; // If vehicle itself has a type linked
}

export interface DbVehicleTypeShort { // For direct link from Reservations to VehicleTypes
  vehicle_type_id: string;
  name?: string | null;
}

export interface DbReservationStatus {
  reservation_status_id: string; // Corrected field name
  status_name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbLocation {
  location_id: string;
  name: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_pickup_location: boolean;
  is_dropoff_location: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbPurposeOption {
  purpose_id: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

// POI (Points of Interest) Interface
export interface DbPoi {
  poi_id: string;
  company_id?: string | null;
  name: string;
  address?: string | null;
  latitude: number;
  longitude: number;
  category?: string | null;
  contact_info?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

// Standard Routes Interface
export interface DbStandardRoute {
  route_id: string;
  company_id?: string | null;
  name: string;
  start_poi_id?: string | null;
  end_poi_id?: string | null;
  start_address_manual?: string | null;
  end_address_manual?: string | null;
  predefined_distance_km?: number | null;
  estimated_duration_min?: number | null;
  predefined_cost?: number | null;
  cost_calculation_formula?: string | null;
  route_details_json?: Record<string, unknown> | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  
  // Joined data
  start_poi?: DbPoi | null;
  end_poi?: DbPoi | null;
}

// Fuel Types Interface
export interface DbFuelType {
  fuel_type_id: string;
  name: string;
  unit: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

// Fuel Prices Interface
export interface DbFuelPrice {
  price_id: string;
  fuel_type_id: string;
  price_per_unit: number;
  currency: string;
  effective_date: string;
  source?: string | null;
  region?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  
  // Joined data
  fuel_types?: DbFuelType | null;
}

export interface DbReservation {
  reservation_id: string; // UUID
  user_id: string; // UUID, FK to users
  vehicle_id?: string | null; // UUID, FK to vehicles
  vehicle_type_id?: string | null; // UUID, FK to vehicle_types
  start_time: string; // ISO Timestamp
  end_time: string; // ISO Timestamp
  purpose?: string | null;
  status_id: string; // UUID, FK to reservation_status
  approved_by_user_id?: string | null; // UUID, FK to users
  approval_notes?: string | null;
  rejection_reason?: string | null;
  requested_features?: Record<string, unknown> | null; // JSONB
  actual_vehicle_id?: string | null; // UUID, FK to vehicles
  pickup_location?: string | null;
  dropoff_location?: string | null;
  created_at: string; // ISO Timestamp
  updated_at: string; // ISO Timestamp

  // Joined data
  users?: DbUserShort | null; // User who made the reservation
  vehicles?: DbVehicleShort | null; // Specific vehicle reserved (if vehicle_id is set)
  vehicle_types?: DbVehicleTypeShort | null; // Vehicle type requested (if vehicle_type_id is set)
  reservation_status?: DbReservationStatus | null; // Status of the reservation
  approved_by_user_details?: DbUserShort | null; // User who approved/rejected the reservation
}
// END NEW INTERFACES FOR RESERVATIONS

// User Interface (Full)
export interface DbUser {
  user_id: string;
  company_id?: string | null;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string | null;
  avatar_url?: string | null;
  is_active: boolean;
  is_email_verified: boolean;
  last_login_at?: string | null;
  onboarding_status?: string | null;
  preferred_language?: string | null;
  preferred_theme?: string | null;
  preferred_units?: string | null;
  preferred_currency?: string | null;
  created_at: string;
  updated_at: string;
  
  // Extended profile fields - all optional
  alternative_phone?: string | null;
  date_of_birth?: string | null;
  position?: string | null;
  branch?: string | null;
  manager?: string | null;
  work_email?: string | null;
  
  // Address Information
  home_address?: string | null;
  home_city?: string | null;
  home_postal_code?: string | null;
  home_country?: string | null;
  work_address?: string | null;
  work_city?: string | null;
  work_postal_code?: string | null;
  work_country?: string | null;
  
  // Emergency Contact
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  emergency_contact_relationship?: string | null;
  
  // Vehicle & Licenses
  has_private_vehicle?: boolean | null;
  private_vehicle_plate?: string | null;
  private_vehicle_make?: string | null;
  private_vehicle_model?: string | null;
  driving_license_number?: string | null;
  driving_license_category?: string | null;
  driving_license_expiry?: string | null;
  preferred_vehicle_id?: string | null;
  
  // Additional Information
  biography?: string | null;
  skills?: string | null; // Stored as comma-separated string in database
  languages?: string | null; // Stored as comma-separated string in database
  certifications?: string | null; // Stored as comma-separated string in database
  
  // Joined data
  departments?: DbDepartment[] | null;
  roles?: DbRole[] | null;
  user_roles?: Array<{ roles: DbRoleMinimal[] }> | null;
}

export interface DbSystemLog {
  log_id: string;
  company_id?: string | null;
  user_id: string;
  log_type: string; // 'FUEL_EXCESS', 'HIGH_EXPENSE', 'SUSPICIOUS_PATTERN', 'SYSTEM_EVENT'
  severity: string; // 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  title: string;
  description?: string | null;
  metadata?: Record<string, unknown>; // JSONB data
  
  // Related entities
  related_expense_id?: string | null;
  related_vehicle_id?: string | null;
  related_trip_id?: string | null;
  
  // Status tracking
  is_resolved: boolean;
  resolved_by_user_id?: string | null;
  resolved_at?: string | null;
  resolution_notes?: string | null;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Joined data
  users?: DbUserShort | null;
  related_expense?: DbExpense | null;
  related_vehicle?: DbVehicle | null;
  resolved_by_user?: DbUserShort | null;
}

export interface DbRole {
  role_id: string;
  role_name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbRoleMinimal {
  role_id: string;
  role_name: string;
  description?: string | null;
}

export interface DbDepartment {
  department_id: string;
  company_id: string;
  name: string;
  parent_department_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbCompany {
  company_id: string;
  name: string;
  address?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  subscription_plan?: string | null;
  created_at: string;
  updated_at: string;
  
  // Extended company fields
  registration_number?: string | null;
  tax_number?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country?: string | null;
  website?: string | null;
  industry?: string | null;
  founded_year?: string | null;
  employee_count?: string | null;
  description?: string | null;
  bank_name?: string | null;
  bank_account?: string | null;
  swift_code?: string | null;
}

export interface DbExpenseReceipt {
  receipt_id: string;
  expense_id: string;
  file_url: string;
  file_name?: string | null;
  mime_type?: string | null;
  uploaded_at: string;
  uploaded_by_user_id: string;
  created_at: string;
}

// User Requests Interface
export interface DbUserRequest {
  request_id: string;
  user_id: string;
  requested_by_user_id: string;
  request_type: 'profile_update' | 'personal_info' | 'work_info' | 'contact_info' | 'emergency_contact' | 'vehicle_info';
  status: 'pending' | 'approved' | 'rejected';
  requested_changes: {
    changes: Array<{
      field: string;
      old_value: string;
      new_value: string;
      field_display: string;
    }>;
    user_name: string;
    user_email: string;
  };
  approval_notes?: string | null;
  rejection_reason?: string | null;
  approved_by_user_id?: string | null;
  approved_at?: string | null;
  created_at: string;
  updated_at: string;
  
  // Joined data
  users?: DbUserShort | null;
  requested_by_user?: DbUserShort | null;
  approved_by_user?: DbUserShort | null;
}

  // Definišemo tip za grešku koju naši queryFn endpointi vraćaju
// Ovo će pomoći TypeScriptu da razume strukturu greške.
interface SupabaseQueryError {
  status: string; // Supabase error code (npr. PGRST301)
  data: string; // Supabase error message
  originalError: PostgrestError;
}

// Dodajemo tip za baseQuery rezultat
type QueryResult<T> = {
  data: T;
  error?: SupabaseQueryError;
};

const baseQuery = async <T>(args: {
  url: string;
  method?: string;
  body?: Record<string, unknown>;
}): Promise<QueryResult<T>> => {
  const { url, method = 'GET', body } = args;
  
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();
    
    return { data: data as T };
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: {
          status: 'FETCH_ERROR',
          data: error.message,
          originalError: error
        }
      };
    }
    return {
      error: {
        status: 'UNKNOWN_ERROR',
        data: 'An unknown error occurred',
        originalError: new Error('Unknown error')
      }
    };
  }
};

// Menjamo fakeBaseQuery da koristi naš baseQuery
const fakeBaseQuery: BaseQueryFn<
  void,
  unknown,
  SupabaseQueryError,
  {}
> = () => ({ data: null });

export const supabaseApi = createApi({
  reducerPath: 'supabaseApi',
  baseQuery: fakeBaseQuery,
  tagTypes: ['Reminders', 'Vehicles', 'TripTypes', 'TripPurposes', 'VehicleTypes', 'VehicleStatuses', 'Reservations', 'Notifications', 'Trips', 'Expenses', 'ExpenseCategories', 'ReminderTypes', 'ReservationStatus', 'Locations', 'POIs', 'StandardRoutes', 'FuelTypes', 'FuelPrices', 'Users', 'Role', 'Department', 'SystemLogs', 'Company', 'ExpenseReceipts', 'UserRequests', 'TravelOrders'],
  endpoints: (builder) => ({
    // Expense Categories
    getExpenseCategories: builder.query<DbExpenseCategory[], void>({
      queryFn: async (_arg, _queryApi, _extraOptions, _baseQuery) => {
        const { data, error } = await supabase
          .from('expense_categories')
          .select('*');
        
        if (error) throw error;
        return { data: data || [] };
      },
      providesTags: [{ type: 'ExpenseCategories', id: 'LIST' }],
    }),

    // Reminder Types
    getReminderTypes: builder.query<DbReminderType[], void>({
      queryFn: async (_arg, _queryApi, _extraOptions, _baseQuery) => {
        const { data, error } = await supabase
          .from('reminder_types')
          .select('*');

        if (error) throw error;
        return { data: data || [] };
      },
      providesTags: [{ type: 'ReminderTypes', id: 'LIST' }],
    }),

    getReminders: builder.query<DbReminder[], void>({ 
      queryFn: async (_arg, _queryApi, _extraOptions, _baseQuery) => {
        const { data, error } = await supabase
          .from('reminders')
          .select('*, reminder_types(name), vehicles(make, model)');
        
        if (error) throw error;
        return { data: data || [] };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ reminder_id }) => ({ type: 'Reminders' as const, id: reminder_id })),
              { type: 'Reminders', id: 'LIST' },
            ]
          : [{ type: 'Reminders', id: 'LIST' }],
    }),
    getVehicles: builder.query<DbVehicle[], void>({
      queryFn: async (_arg, _queryApi, _extraOptions, _baseQuery) => {
        const { data, error } = await supabase
          .from('vehicles')
          .select(`
            *,
            vehicle_types (
              vehicle_type_id,
              name,
              description
            ),
            fuel_types (
              fuel_type_id,
              name,
              unit
            )
          `)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Supabase error fetching vehicles:', JSON.stringify(error, null, 2));
          return { error: { status: error.code, data: error.message, originalError: error } as SupabaseQueryError };
        }
        
        console.log('Fetched vehicles from database:', data?.length, 'vehicles');
        if (data && data.length > 0) {
          console.log('First vehicle sample:', {
            vehicle_id: data[0].vehicle_id,
            make: data[0].make,
            model: data[0].model,
            license_plate: data[0].license_plate
          });
        }
        
        return { data: data as DbVehicle[] };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ vehicle_id }) => ({ type: 'Vehicles' as const, id: vehicle_id })),
              { type: 'Vehicles', id: 'LIST' },
            ]
          : [{ type: 'Vehicles', id: 'LIST' }],
    }),
    createVehicle: builder.mutation<DbVehicle, Partial<DbVehicle>>({
      async queryFn(vehicleData) {
        try {
          console.log('Creating vehicle with data:', vehicleData);
          // Add required fields if not provided
          const dataToInsert = { ...vehicleData };
          
          // Clean up private vehicle fields if not private
          if (!dataToInsert.is_private_vehicle) {
            dataToInsert.private_owner_id = null;
            dataToInsert.private_owner_name = null;
            dataToInsert.private_owner_contact = null;
          }
          
          // Get company_id from current user if not provided
          if (!dataToInsert.company_id) {
            console.log('No company_id provided, fetching from current user...');
            const { data: { user } } = await supabase.auth.getUser();
            console.log('Current user:', user?.id);
            if (user) {
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('company_id')
                .eq('user_id', user.id)
                .single();
              console.log('User data:', userData, 'Error:', userError);
              if (userData && userData.company_id) {
                dataToInsert.company_id = userData.company_id;
                console.log('Set company_id from user:', userData.company_id);
              }
            }
          }
          
          // Fallback to first company if still no company_id
          if (!dataToInsert.company_id) {
            console.log('Still no company_id, trying fallback...');
            const { data: companies, error: companyError } = await supabase.from('companies').select('company_id').limit(1);
            console.log('Companies:', companies, 'Error:', companyError);
            if (companies && companies.length > 0) {
              dataToInsert.company_id = companies[0].company_id;
              console.log('Set fallback company_id:', companies[0].company_id);
            }
          }
          
          // Ensure company_id is set
          if (!dataToInsert.company_id) {
            console.error('ERROR: No company_id could be determined!');
            const validationError: PostgrestError = {
                name: 'ValidationError',
                message: 'Company ID is required but could not be determined',
                details: 'Validation failed internally before database call.',
                hint: 'Ensure company_id is provided or can be derived from the user session.',
                code: 'VALIDATION400'
            };
            return { error: { status: validationError.code, data: validationError.message, originalError: validationError } };
          }
          
          // Get default vehicle_status_id if not provided
          if (!dataToInsert.vehicle_status_id) {
            console.log('No vehicle_status_id provided, fetching default...');
            const { data: activeStatus, error: statusError } = await supabase
              .from('vehicle_status')
              .select('vehicle_status_id')
              .eq('status_name', 'ACTIVE')
              .single();
            console.log('Active status:', activeStatus, 'Error:', statusError);
            if (activeStatus) {
              dataToInsert.vehicle_status_id = activeStatus.vehicle_status_id;
              console.log('Set vehicle_status_id:', activeStatus.vehicle_status_id);
            }
          }
          
          console.log('Final data to insert:', dataToInsert);

          const { data, error } = await supabase
            .from('vehicles')
            .insert([dataToInsert])
            .select(`
              *,
              vehicle_types (
                vehicle_type_id,
                name,
                description
              ),
              fuel_types (
                fuel_type_id,
                name,
                unit
              )
            `)
            .single();

          if (error) {
            console.error('Error creating vehicle:', error);
            return { error: { status: error.code, data: error.message, originalError: error } };
          }

          // Create system log for vehicle creation
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && data) {
              await supabase
                .from('system_logs')
                .insert([{
                  company_id: data.company_id,
                  user_id: user.id,
                  log_type: 'SYSTEM_EVENT',
                  severity: 'LOW',
                  title: `New Vehicle Added: ${data.make} ${data.model}`,
                  description: `Vehicle ${data.license_plate} has been successfully added to the fleet`,
                  metadata: {
                    vehicle_id: data.vehicle_id,
                    make: data.make,
                    model: data.model,
                    license_plate: data.license_plate,
                    is_private_vehicle: data.is_private_vehicle
                  },
                  related_vehicle_id: data.vehicle_id,
                  is_resolved: true
                }]);
              console.log('System log created for new vehicle');
            }
          } catch (logError: any) {
            console.warn('Failed to create system log for vehicle creation:', logError.message);
            // Don't fail the vehicle creation if logging fails
          }

          return { data: data as DbVehicle };
        } catch (error) {
          console.error('Unexpected error creating vehicle:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: [{ type: 'Vehicles', id: 'LIST' }],
    }),
    updateVehicle: builder.mutation<DbVehicle, { vehicle_id: string } & Partial<DbVehicle>>({
      async queryFn({ vehicle_id, ...updates }) {
        try {
          console.log('Updating vehicle with ID:', vehicle_id);
          console.log('Updates:', updates);
          const { data, error } = await supabase
            .from('vehicles')
            .update(updates)
            .eq('vehicle_id', vehicle_id)
            .select(`
              *,
              vehicle_types (
                vehicle_type_id,
                name,
                description
              ),
              fuel_types (
                fuel_type_id,
                name,
                unit
              )
            `)
            .single();

          if (error) {
            console.error('Error updating vehicle:', error);
            return { error: { status: error.code, data: error.message, originalError: error } };
          }

          return { data: data as DbVehicle };
        } catch (error) {
          console.error('Unexpected error updating vehicle:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: (_result, _error, { vehicle_id }) => [
        { type: 'Vehicles', id: vehicle_id },
        { type: 'Vehicles', id: 'LIST' }
      ],
    }),
    deleteVehicle: builder.mutation<{ success: boolean }, string>({
      async queryFn(vehicle_id) {
        try {
          const { error } = await supabase
            .from('vehicles')
            .delete()
            .eq('vehicle_id', vehicle_id);

          if (error) {
            console.error('Error deleting vehicle:', error);
            return { error: { status: error.code, data: error.message, originalError: error } };
          }

          return { data: { success: true } };
        } catch (error) {
          console.error('Unexpected error deleting vehicle:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: (_result, _error, vehicle_id) => [
        { type: 'Vehicles', id: vehicle_id },
        { type: 'Vehicles', id: 'LIST' }
      ],
    }),
    getTripTypes: builder.query<DbTripType[], void>({
      queryFn: async (_arg, _queryApi, _extraOptions, _baseQuery) => {
        const { data, error } = await supabase
          .from('trip_types')
          .select(`
            trip_type_id,
            name,
            description,
            is_billable
          `);
        if (error) return { error: { status: error.code, data: error.message, originalError: error } as SupabaseQueryError };
        return { data: data || [] };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ trip_type_id }) => ({ type: 'TripTypes' as const, id: trip_type_id })),
              { type: 'TripTypes', id: 'LIST' },
            ]
          : [{ type: 'TripTypes', id: 'LIST' }],
    }),
    getTripPurposes: builder.query<DbTripPurpose[], void>({
      queryFn: async (_arg, _queryApi, _extraOptions, _baseQuery) => {
        const { data, error } = await supabase
          .from('trip_purposes')
          .select(`
            trip_purpose_id,
            name,
            description,
            category,
            is_active,
            created_at,
            updated_at
          `)
          .order('name', { ascending: true });
        if (error) return { error: { status: error.code, data: error.message, originalError: error } as SupabaseQueryError };
        return { data: data || [] };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ trip_purpose_id }) => ({ type: 'TripPurposes' as const, id: trip_purpose_id })),
              { type: 'TripPurposes', id: 'LIST' },
            ]
          : [{ type: 'TripPurposes', id: 'LIST' }],
    }),

    getTrips: builder.query<DbTrip[], { userId?: string } | void>({
      async queryFn(args) {
        let query = supabase
          .from('trips')
          .select(`
            *,
            vehicles(vehicle_id, make, model, license_plate),
            trip_types(trip_type_id, name),
            users!trips_user_id_fkey(first_name, last_name, avatar_url)
          `)
          .order('created_at', { ascending: false });

        if (args && 'userId' in args && args.userId) {
          query = query.eq('user_id', args.userId);
        }

        const { data, error } = await query;
        
        if (error) {
          console.error('Supabase error fetching trips:', JSON.stringify(error, null, 2));
          return { error: { status: error.code, data: error.message, originalError: error } as SupabaseQueryError }; 
        }
        return { data: data as DbTrip[] }; 
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ trip_id }) => ({ type: 'Trips' as const, id: trip_id })),
              { type: 'Trips', id: 'LIST' },
            ]
          : [{ type: 'Trips', id: 'LIST' }],
    }),

    // Expenses
    getExpenses: builder.query<DbExpense[], void>({
      queryFn: async (_arg, _queryApi, _extraOptions, _baseQuery) => {
        const { data, error } = await supabase
          .from('expenses')
          .select(`
            *,
            expense_categories(expense_category_id, name),
            vehicles(vehicle_id, make, model, license_plate),
            users!expenses_user_id_fkey(first_name, last_name, avatar_url)
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Supabase error fetching expenses:', JSON.stringify(error, null, 2));
          return { error: { status: error.code, data: error.message, originalError: error } as SupabaseQueryError }; 
        }
        return { data: data || [] }; 
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ expense_id }) => ({ type: 'Expenses' as const, id: expense_id })),
              { type: 'Expenses', id: 'LIST' },
            ]
          : [{ type: 'Expenses', id: 'LIST' }],
    }),
    getVehicleTypes: builder.query<DbVehicleType[], void>({
      queryFn: async (_arg, _queryApi, _extraOptions, _baseQuery) => {
        const { data, error } = await supabase
          .from('vehicle_types')
          .select(`
            vehicle_type_id,
            name,
            description
          `);
        if (error) return { error: { status: error.code, data: error.message, originalError: error } as SupabaseQueryError };
        return { data: data || [] };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ vehicle_type_id }) => ({ type: 'VehicleTypes' as const, id: vehicle_type_id })),
              { type: 'VehicleTypes', id: 'LIST' },
            ]
          : [{ type: 'VehicleTypes', id: 'LIST' }],
    }),
    getVehicleStatuses: builder.query<DbVehicleStatus[], void>({
      queryFn: async (_arg, _queryApi, _extraOptions, _baseQuery) => {
        const { data, error } = await supabase
          .from('vehicle_status')
          .select(`
            vehicle_status_id,
            name,
            description,
            created_at,
            updated_at
          `)
          .order('name', { ascending: true });
        if (error) {
          console.error('Supabase error fetching vehicle statuses:', JSON.stringify(error, null, 2));
          return { error: { status: error.code, data: error.message, originalError: error } as SupabaseQueryError };
        }
        return { data: data || [] };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ vehicle_status_id }) => ({ type: 'VehicleStatuses' as const, id: vehicle_status_id })),
              { type: 'VehicleStatuses', id: 'LIST' },
            ]
          : [{ type: 'VehicleStatuses', id: 'LIST' }],
    }),
    getReservations: builder.query<DbReservation[], void>({
      queryFn: async (_arg, _queryApi, _extraOptions, _baseQuery) => {
        const selectString = 'reservation_id, user_id, vehicle_id, vehicle_type_id, start_time, end_time, purpose, status_id, approved_by_user_id, approval_notes, rejection_reason, requested_features, actual_vehicle_id, pickup_location, dropoff_location, created_at, updated_at,'
          + 'created_by_user_details:user_id(user_id, first_name, last_name, avatar_url),'
          + 'approved_by_user_details:approved_by_user_id(user_id, first_name, last_name, avatar_url),'
          + 'vehicle_details:vehicle_id(vehicle_id, make, model, license_plate),'
          + 'status_details:status_id(status_name, description)';

        const { data, error } = await supabase
          .from('reservations')
          .select(selectString);
        
        if (error) throw error;
        return { data: data || [] };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ reservation_id }) => ({ type: 'Reservations' as const, id: reservation_id })),
              { type: 'Reservations', id: 'LIST' },
            ]
          : [{ type: 'Reservations', id: 'LIST' }],
    }),
    getReservationById: builder.query<DbReservation, string>({
      async queryFn(reservationId) {
        try {
          console.log('Fetching reservation with ID:', reservationId);

          const { data, error } = await supabase
            .from('reservations')
            .select(`
              *,
              users:user_id (
                first_name,
                last_name,
                avatar_url
              ),
              vehicles:vehicle_id (
                vehicle_id,
                make,
                model,
                license_plate,
                vehicle_types (
                  vehicle_type_id,
                  name
                )
              ),
              vehicle_types:vehicle_type_id (
                vehicle_type_id,
                name
              ),
              reservation_status:status_id (
                reservation_status_id,
                status_name
              ),
              approved_by_user_details:approved_by_user_id (
                first_name,
                last_name,
                avatar_url
              )
            `)
            .eq('reservation_id', reservationId)
            .maybeSingle();

          if (error) {
            console.error('Supabase error:', error);
            return { error: { status: error.code, data: error.message, originalError: error } };
          }

          if (!data) {
            console.log('No reservation found for ID:', reservationId);
            return { error: { status: 'NOT_FOUND', data: 'Reservation not found', originalError: null } };
          }

          // Mapiramo podatke u format koji odgovara DbReservation interfejsu
          const mappedData: DbReservation = {
            reservation_id: data.reservation_id,
            user_id: data.user_id,
            vehicle_id: data.vehicle_id,
            vehicle_type_id: data.vehicle_type_id,
            start_time: data.start_time,
            end_time: data.end_time,
            purpose: data.purpose,
            status_id: data.status_id,
            approved_by_user_id: data.approved_by_user_id,
            approval_notes: data.approval_notes,
            rejection_reason: data.rejection_reason,
            requested_features: data.requested_features,
            actual_vehicle_id: data.actual_vehicle_id,
            pickup_location: data.pickup_location,
            dropoff_location: data.dropoff_location,
            created_at: data.created_at,
            updated_at: data.updated_at,
            users: data.users || null,
            vehicles: data.vehicles ? {
              vehicle_id: data.vehicles.vehicle_id,
              make: data.vehicles.make,
              model: data.vehicles.model,
              license_plate: data.vehicles.license_plate,
              vehicle_types: data.vehicles.vehicle_types
            } : null,
            vehicle_types: data.vehicle_types ? {
              vehicle_type_id: data.vehicle_types.vehicle_type_id,
              name: data.vehicle_types.name
            } : null,
            reservation_status: data.reservation_status ? {
              reservation_status_id: data.reservation_status.reservation_status_id,
              status_name: data.reservation_status.status_name,
              description: data.reservation_status.description,
              created_at: data.reservation_status.created_at,
              updated_at: data.reservation_status.updated_at
            } : null,
            approved_by_user_details: data.approved_by_user_details || null
          };

          console.log('Successfully mapped reservation data');
          return { data: mappedData };
        } catch (error) {
          console.error('Unexpected error in getReservationById:', error);
          return { error: { status: 'UNKNOWN', data: 'Unknown error occurred', originalError: error as any } };
        }
      },
      providesTags: (result, error, id) => [{ type: 'Reservations', id }],
    }),
    updateReservation: builder.mutation<DbReservation, Partial<DbReservation> & { id: string }>({
      async queryFn({ id, ...data }) {
        try {
          const { data: updatedData, error } = await supabase
            .from('reservations')
            .update(data)
            .eq('reservation_id', id)
            .select(`
              *,
              users:user_id (first_name, last_name, avatar_url),
              vehicles:vehicle_id (vehicle_id, make, model, license_plate, vehicle_types(vehicle_type_id, name)),
              vehicle_types:vehicle_type_id (vehicle_type_id, name),
              reservation_status:status_id (reservation_status_id, status_name),
              approved_by_user_details:approved_by_user_id (first_name, last_name, avatar_url)
            `)
            .maybeSingle();

          if (error) throw error;
          return { data: updatedData };
        } catch (error) {
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Reservations', id }],
    }),
    deleteReservation: builder.mutation<void, string>({
      async queryFn(id) {
        try {
          const { error } = await supabase
            .from('reservations')
            .delete()
            .eq('reservation_id', id);

          if (error) {
            console.error('Error deleting reservation:', error);
            return { error: { status: error.code, data: error.message, originalError: error } };
          }

          return { data: undefined };
        } catch (error) {
          console.error('Error deleting reservation:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['Reservations'],
    }),
    
    // NEW: Approval Workflow Endpoints
    approveReservation: builder.mutation<DbReservation, { 
      reservationId: string; 
      approvedByUserId: string; 
      approvalNotes?: string;
      actualVehicleId?: string;
    }>({
      async queryFn({ reservationId, approvedByUserId, approvalNotes, actualVehicleId }) {
        try {
          console.log('🔄 Starting reservation approval for:', reservationId);
          
          // Get approved status ID
          const { data: statusData, error: statusError } = await supabase
            .from('reservation_status')
            .select('reservation_status_id')
            .eq('status_name', 'APPROVED')
            .single();

          if (statusError || !statusData) {
            console.error('❌ Could not find APPROVED status:', statusError);
            throw new Error('Could not find APPROVED status');
          }

          console.log('✅ Found APPROVED status ID:', statusData.reservation_status_id);

          // Update reservation
          const { data, error } = await supabase
            .from('reservations')
            .update({
              status_id: statusData.reservation_status_id,
              approved_by_user_id: approvedByUserId,
              approval_notes: approvalNotes || null,
              actual_vehicle_id: actualVehicleId || null,
              updated_at: new Date().toISOString()
            })
            .eq('reservation_id', reservationId)
            .select(`
              *,
              users:user_id (first_name, last_name, avatar_url),
              vehicles:vehicle_id (vehicle_id, make, model, license_plate, vehicle_types(vehicle_type_id, name)),
              vehicle_types:vehicle_type_id (vehicle_type_id, name),
              reservation_status:status_id (reservation_status_id, status_name),
              approved_by_user_details:approved_by_user_id (first_name, last_name, avatar_url)
            `)
            .single();

          if (error) {
            console.error('❌ Error updating reservation:', error);
            throw error;
          }

          console.log('✅ Reservation approved successfully:', data.reservation_id, 'New status:', data.status_id);

          // Create notification for user who made reservation
          await supabase.from('system_notifications').insert({
            user_id: data.user_id,
            type: 'RESERVATION_APPROVED',
            title: 'Reservation Approved',
            message: `Your reservation has been approved. ${approvalNotes ? `Notes: ${approvalNotes}` : ''}`,
            related_entity_type: 'Reservation',
            related_entity_id: reservationId
          });

          console.log('✅ Notification created for reservation approval');
          return { data };
        } catch (error) {
          console.error('❌ Error in approveReservation:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['Reservations', { type: 'Reservations', id: 'PENDING' }],
      async onQueryStarted({ reservationId }, { dispatch, queryFulfilled }) {
        // Optimistic update - remove reservation from pending list immediately
        const patchResult = dispatch(
          supabaseApi.util.updateQueryData('getPendingReservations', undefined, (draft) => {
            const index = draft.findIndex(reservation => reservation.reservation_id === reservationId);
            if (index !== -1) {
              console.log('🔄 Optimistically removing reservation from pending list:', reservationId);
              draft.splice(index, 1);
            }
          })
        );
        
        try {
          await queryFulfilled;
          console.log('✅ Reservation approval confirmed, optimistic update kept');
        } catch {
          console.log('❌ Reservation approval failed, reverting optimistic update');
          patchResult.undo();
        }
      },
    }),

    rejectReservation: builder.mutation<DbReservation, { 
      reservationId: string; 
      approvedByUserId: string; 
      rejectionReason: string;
    }>({
      async queryFn({ reservationId, approvedByUserId, rejectionReason }) {
        try {
          // Get rejected status ID
          const { data: statusData, error: statusError } = await supabase
            .from('reservation_status')
            .select('reservation_status_id')
            .eq('status_name', 'REJECTED')
            .single();

          if (statusError || !statusData) {
            throw new Error('Could not find REJECTED status');
          }

          // Update reservation
          const { data, error } = await supabase
            .from('reservations')
            .update({
              status_id: statusData.reservation_status_id,
              approved_by_user_id: approvedByUserId,
              rejection_reason: rejectionReason,
              updated_at: new Date().toISOString()
            })
            .eq('reservation_id', reservationId)
            .select(`
              *,
              users:user_id (first_name, last_name, avatar_url),
              vehicles:vehicle_id (vehicle_id, make, model, license_plate, vehicle_types(vehicle_type_id, name)),
              vehicle_types:vehicle_type_id (vehicle_type_id, name),
              reservation_status:status_id (reservation_status_id, status_name),
              approved_by_user_details:approved_by_user_id (first_name, last_name, avatar_url)
            `)
            .single();

          if (error) {
            console.error('Error rejecting reservation:', error);
            throw error;
          }

          // Create notification for user who made reservation
          await supabase.from('system_notifications').insert({
            user_id: data.user_id,
            type: 'RESERVATION_REJECTED',
            title: 'Reservation Rejected',
            message: `Your reservation has been rejected. Reason: ${rejectionReason}`,
            related_entity_type: 'Reservation',
            related_entity_id: reservationId
          });

          return { data };
        } catch (error) {
          console.error('Error in rejectReservation:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['Reservations', { type: 'Reservations', id: 'PENDING' }],
      async onQueryStarted({ reservationId }, { dispatch, queryFulfilled }) {
        // Optimistic update - remove reservation from pending list immediately
        const patchResult = dispatch(
          supabaseApi.util.updateQueryData('getPendingReservations', undefined, (draft) => {
            const index = draft.findIndex(reservation => reservation.reservation_id === reservationId);
            if (index !== -1) {
              console.log('🔄 Optimistically removing reservation from pending list:', reservationId);
              draft.splice(index, 1);
            }
          })
        );
        
        try {
          await queryFulfilled;
          console.log('✅ Reservation approval confirmed, optimistic update kept');
        } catch {
          console.log('❌ Reservation approval failed, reverting optimistic update');
          patchResult.undo();
        }
      },
    }),

    getPendingReservations: builder.query<DbReservation[], void>({
      queryFn() {
        return { data: null };
      },
      providesTags: [{ type: 'Reservations', id: 'PENDING' }],
    }),

    // Notification System
    createNotification: builder.mutation<void, {
      userId: string;
      type: string;
      title: string;
      message: string;
      relatedEntityType?: string;
      relatedEntityId?: string;
    }>({
      async queryFn({ userId, type, title, message, relatedEntityType, relatedEntityId }) {
        try {
          const { error } = await supabase
            .from('system_notifications')
            .insert({
              user_id: userId,
              type,
              title,
              message,
              related_entity_type: relatedEntityType || null,
              related_entity_id: relatedEntityId || null
            });

          if (error) {
            console.error('Error creating notification:', error);
            throw error;
          }

          return { data: undefined };
        } catch (error) {
          console.error('Error in createNotification:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['Notifications'],
    }),

    // Trip Management
    deleteTrip: builder.mutation<void, string>({
      async queryFn(tripId) {
        try {
          const { error } = await supabase
            .from('trips')
            .delete()
            .eq('trip_id', tripId);

          if (error) {
            console.error('Error deleting trip:', error);
            throw error;
          }

          return { data: undefined };
        } catch (error) {
          console.error('Error in deleteTrip:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['Trips'],
    }),

    updateTrip: builder.mutation<DbTrip, { tripId: string; updates: Partial<DbTrip> }>({
      async queryFn({ tripId, updates }) {
        try {
          const { data, error } = await supabase
            .from('trips')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('trip_id', tripId)
            .select(`
              *,
              vehicles(vehicle_id, make, model, license_plate),
              trip_types(trip_type_id, name),
              users!trips_user_id_fkey(first_name, last_name, avatar_url)
            `)
            .single();

          if (error) {
            console.error('Error updating trip:', error);
            throw error;
          }

          return { data: data as DbTrip };
        } catch (error) {
          console.error('Error in updateTrip:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['Trips'],
    }),

    // Create Trip
    createTrip: builder.mutation<DbTrip, {
      user_id: string;
      vehicle_id: string;
      trip_type_id?: string | null;
      start_time: string;
      end_time?: string | null;
      start_location_address?: string | null;
      end_location_address?: string | null;
      distance_km?: number | null;
      duration_minutes?: number | null;
      purpose_description?: string | null;
      notes?: string | null;
      path?: any[] | null;
      pause_details?: any | null;
      status?: string;
    }>({
      async queryFn(tripData) {
        try {
          const { data, error } = await supabase
            .from('trips')
            .insert([{
              ...tripData,
              status: tripData.status || 'IN_PROGRESS',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }])
            .select(`
              *,
              vehicles(vehicle_id, make, model, license_plate),
              trip_types(trip_type_id, name),
              users!trips_user_id_fkey(first_name, last_name, avatar_url)
            `)
            .single();

          if (error) {
            console.error('Error creating trip:', error);
            throw error;
          }

          return { data: data as DbTrip };
        } catch (error) {
          console.error('Error in createTrip:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['Trips'],
    }),

    // Create Expense
    createExpense: builder.mutation<DbExpense, {
      user_id: string;
      trip_id?: string | null;
      vehicle_id?: string | null;
      expense_category_id: string;
      amount: number;
      currency: string;
      expense_date: string;
      description?: string | null;
      payment_method?: string | null;
      fuel_liters?: number | null;
      fuel_price_per_liter?: number | null;
      is_reimbursable?: boolean;
    }>({
      async queryFn(expenseData) {
        try {
          const { data, error } = await supabase
            .from('expenses')
            .insert([{
              ...expenseData,
              status: 'PENDING',
              is_reimbursable: expenseData.is_reimbursable ?? true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }])
            .select(`
              *,
              expense_categories(expense_category_id, name),
              vehicles(vehicle_id, make, model, license_plate),
              users!expenses_user_id_fkey(first_name, last_name, avatar_url)
            `)
            .single();

          if (error) {
            console.error('Error creating expense:', error);
            throw error;
          }

          return { data: data as DbExpense };
        } catch (error) {
          console.error('Error in createExpense:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['Expenses'],
    }),

    // Update Expense
    updateExpense: builder.mutation<DbExpense, { expenseId: string; updates: Partial<DbExpense> }>({
      async queryFn({ expenseId, updates }) {
        try {
          const { data, error } = await supabase
            .from('expenses')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('expense_id', expenseId)
            .select(`
              *,
              expense_categories(expense_category_id, name),
              vehicles(vehicle_id, make, model, license_plate),
              users!expenses_user_id_fkey(first_name, last_name, avatar_url)
            `)
            .single();

          if (error) {
            console.error('Error updating expense:', error);
            throw error;
          }

          return { data: data as DbExpense };
        } catch (error) {
          console.error('Error in updateExpense:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['Expenses'],
    }),

    // Delete Expense
    deleteExpense: builder.mutation<void, string>({
      async queryFn(expenseId) {
        try {
          const { error } = await supabase
            .from('expenses')
            .delete()
            .eq('expense_id', expenseId);

          if (error) {
            console.error('Error deleting expense:', error);
            throw error;
          }

          return { data: undefined };
        } catch (error) {
          console.error('Error in deleteExpense:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['Expenses'],
    }),

    // Create Reminder
    createReminder: builder.mutation<DbReminder, {
      user_id: string;
      reminder_type_id?: string | null;
      vehicle_id?: string | null;
      title: string;
      description?: string | null;
      due_date: string;
      is_system_generated?: boolean;
      notification_preferences?: any;
    }>({
      async queryFn(reminderData) {
        try {
          const { data, error } = await supabase
            .from('reminders')
            .insert([{
              ...reminderData,
              is_system_generated: reminderData.is_system_generated ?? false,
              is_completed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }])
            .select(`
              *,
              reminder_types(reminder_type_id, name),
              vehicles(vehicle_id, make, model, license_plate)
            `)
            .single();

          if (error) {
            console.error('Error creating reminder:', error);
            throw error;
          }

          return { data: data as DbReminder };
        } catch (error) {
          console.error('Error in createReminder:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['Reminders'],
    }),

    // Update Reminder
    updateReminder: builder.mutation<DbReminder, { reminderId: string; updates: Partial<DbReminder> }>({
      async queryFn({ reminderId, updates }) {
        try {
          const { data, error } = await supabase
            .from('reminders')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('reminder_id', reminderId)
            .select(`
              *,
              reminder_types(reminder_type_id, name),
              vehicles(vehicle_id, make, model, license_plate)
            `)
            .single();

          if (error) {
            console.error('Error updating reminder:', error);
            throw error;
          }

          return { data: data as DbReminder };
        } catch (error) {
          console.error('Error in updateReminder:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['Reminders'],
    }),

    // End Trip
    endTrip: builder.mutation<DbTrip, string>({
      async queryFn(tripId) {
        try {
          const { data, error } = await supabase
            .from('trips')
            .update({ 
              status: 'COMPLETED',
              end_time: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('trip_id', tripId)
            .select(`
              *,
              vehicles(vehicle_id, make, model, license_plate),
              trip_types(trip_type_id, name),
              users!trips_user_id_fkey(first_name, last_name, avatar_url)
            `)
            .single();

          if (error) {
            console.error('Error ending trip:', error);
            throw error;
          }

          return { data: data as DbTrip };
        } catch (error) {
          console.error('Error in endTrip:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['Trips'],
    }),

    // Get Reservation Statuses
    getReservationStatuses: builder.query<DbReservationStatus[], void>({
      queryFn() {
        return { data: null };
      },
      providesTags: [{ type: 'ReservationStatus', id: 'LIST' }],
    }),

    // Create Reservation with proper status handling
    createReservation: builder.mutation<DbReservation, {
      user_id: string;
      vehicle_id?: string;
      vehicle_type_id?: string;
      start_time: string;
      end_time: string;
      purpose: string;
      pickup_location?: string;
      dropoff_location?: string;
      requested_features?: any;
    }>({
      async queryFn(reservationData) {
        try {
          console.log('Creating reservation with data:', reservationData);
          
          // Get the default "PENDING_APPROVAL" status
          const { data: statusData, error: statusError } = await supabase
            .from('reservation_status')
            .select('reservation_status_id')
            .eq('status_name', 'PENDING_APPROVAL')
            .single();

          if (statusError || !statusData) {
            console.error('Error getting default status:', statusError);
            return { error: { status: 'STATUS_ERROR', data: 'Could not find PENDING_APPROVAL status', originalError: statusError } };
          }

          const dataToInsert = {
            ...reservationData,
            status_id: statusData.reservation_status_id,
          };

          console.log('Inserting reservation data:', dataToInsert);

          const { data, error } = await supabase
            .from('reservations')
            .insert([dataToInsert])
            .select(`
              *,
              users:user_id (first_name, last_name, avatar_url),
              vehicles:vehicle_id (vehicle_id, make, model, license_plate, vehicle_types(vehicle_type_id, name)),
              vehicle_types:vehicle_type_id (vehicle_type_id, name),
              reservation_status:status_id (reservation_status_id, status_name, description, created_at, updated_at)
            `)
            .single();

          if (error) {
            console.error('Error creating reservation:', error);
            return { error: { status: error.code, data: error.message, originalError: error } };
          }

          console.log('Reservation created successfully:', data);
          return { data: data as DbReservation };
        } catch (error) {
          console.error('Unexpected error creating reservation:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: [{ type: 'Reservations', id: 'LIST' }],
    }),

    // Get Purpose Options (hardcoded for now, can be moved to DB later)
    getPurposeOptions: builder.query<DbPurposeOption[], void>({
      queryFn() {
        try {
          const purposes: DbPurposeOption[] = [
            {
              purpose_id: '1',
              name: 'Business Meeting',
              description: 'Client meetings and business appointments',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              purpose_id: '2',
              name: 'Site Visit',
              description: 'On-site inspections and visits',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              purpose_id: '3',
              name: 'Delivery',
              description: 'Equipment or document delivery',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              purpose_id: '4',
              name: 'Training',
              description: 'Staff training and workshops',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              purpose_id: '5',
              name: 'Maintenance',
              description: 'Vehicle or equipment maintenance',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              purpose_id: '6',
              name: 'Emergency',
              description: 'Urgent business needs',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            { purpose_id: '7', name: 'Meeting', description: 'Scheduled meetings', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { purpose_id: '8', name: 'Other', description: 'Any other purpose', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          ];

          return { data: purposes };
        } catch (error) {
          console.error('Unexpected error fetching purpose options:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      providesTags: [{ type: 'Locations', id: 'PURPOSE_LIST' }],
    }),

    // Get Location Options (hardcoded for now, can be moved to DB later)
    getLocationOptions: builder.query<DbLocation[], void>({
      queryFn() {
        try {
          const locations: DbLocation[] = [
            {
              location_id: '1',
              name: 'Main Office',
              address: 'Knez Mihailova 42, Belgrade',
              latitude: 44.8176,
              longitude: 20.4633,
              is_pickup_location: true,
              is_dropoff_location: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              location_id: '2',
              name: 'Warehouse',
              address: 'Batajnička cesta 23, Belgrade',
              latitude: 44.8512,
              longitude: 20.4112,
              is_pickup_location: true,
              is_dropoff_location: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              location_id: '3',
              name: 'Client Office Downtown',
              address: 'Terazije 25, Belgrade',
              latitude: 44.8125,
              longitude: 20.4612,
              is_pickup_location: false,
              is_dropoff_location: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              location_id: '4',
              name: 'Airport',
              address: 'Nikola Tesla Airport, Belgrade',
              latitude: 44.8184,
              longitude: 20.3091,
              is_pickup_location: true,
              is_dropoff_location: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              location_id: '5',
              name: 'Branch Office Novi Sad',
              address: 'Zmaj Jovina 15, Novi Sad',
              latitude: 45.2671,
              longitude: 19.8335,
              is_pickup_location: true,
              is_dropoff_location: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              location_id: '6',
              name: 'Service Center',
              address: 'Bulevar Oslobođenja 124, Belgrade',
              latitude: 44.7866,
              longitude: 20.4489,
              is_pickup_location: true,
              is_dropoff_location: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            { location_id: '7', name: 'Other', address: 'Specify address', is_pickup_location: true, is_dropoff_location: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          ];

          return { data: locations };
        } catch (error) {
          console.error('Unexpected error fetching location options:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      providesTags: [{ type: 'Locations', id: 'LIST' }],
    }),

    // ===== POIS ENDPOINTS =====
    getPois: builder.query<DbPoi[], void>({
      queryFn: async (_arg, _queryApi, _extraOptions, _baseQuery) => {
        const { data, error } = await supabase
          .from('pois')
          .select('*');
        
        if (error) throw error;
        return { data: data || [] };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ poi_id }) => ({ type: 'POIs' as const, id: poi_id })),
              { type: 'POIs', id: 'LIST' },
            ]
          : [{ type: 'POIs', id: 'LIST' }],
    }),

    createPoi: builder.mutation<DbPoi, Partial<DbPoi>>({
      async queryFn(poiData) {
        try {
          const { data, error } = await supabase
            .from('pois')
            .insert([poiData])
            .select('*')
            .single();

          if (error) {
            console.error('Error creating POI:', error);
            return { error: { status: error.code, data: error.message, originalError: error } };
          }

          return { data: data as DbPoi };
        } catch (error) {
          console.error('Unexpected error creating POI:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: [{ type: 'POIs', id: 'LIST' }],
    }),

    updatePoi: builder.mutation<DbPoi, { poi_id: string } & Partial<DbPoi>>({
      async queryFn({ poi_id, ...updates }) {
        try {
          const { data, error } = await supabase
            .from('pois')
            .update(updates)
            .eq('poi_id', poi_id)
            .select('*')
            .single();

          if (error) {
            console.error('Error updating POI:', error);
            return { error: { status: error.code, data: error.message, originalError: error } };
          }

          return { data: data as DbPoi };
        } catch (error) {
          console.error('Unexpected error updating POI:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: (_result, _error, { poi_id }) => [
        { type: 'POIs', id: poi_id },
        { type: 'POIs', id: 'LIST' }
      ],
    }),

    deletePoi: builder.mutation<void, string>({
      async queryFn(poi_id) {
        try {
          const { error } = await supabase
            .from('pois')
            .delete()
            .eq('poi_id', poi_id);

          if (error) {
            console.error('Error deleting POI:', error);
            return { error: { status: error.code, data: error.message, originalError: error } };
          }

          return { data: undefined };
        } catch (error) {
          console.error('Unexpected error deleting POI:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: (_result, _error, poi_id) => [
        { type: 'POIs', id: poi_id },
        { type: 'POIs', id: 'LIST' }
      ],
    }),

    // ===== STANDARD ROUTES ENDPOINTS =====
    getStandardRoutes: builder.query<DbStandardRoute[], void>({
      queryFn: async (_arg, _queryApi, _extraOptions, _baseQuery) => {
        const { data, error } = await supabase
          .from('standard_routes')
          .select(`
            *,
            start_poi:start_poi_id(name, address),
            end_poi:end_poi_id(name, address)
          `);

        if (error) throw error;
        return { data: data || [] };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ route_id }) => ({ type: 'StandardRoutes' as const, id: route_id })),
              { type: 'StandardRoutes', id: 'LIST' },
            ]
          : [{ type: 'StandardRoutes', id: 'LIST' }],
    }),

    createStandardRoute: builder.mutation<DbStandardRoute, Partial<DbStandardRoute>>({
      async queryFn(routeData) {
        try {
          const { data, error } = await supabase
            .from('standard_routes')
            .insert([routeData])
            .select(`
              *,
              start_poi:start_poi_id(name, address),
              end_poi:end_poi_id(name, address)
            `)
            .single();

          if (error) {
            console.error('Error creating standard route:', error);
            return { error: { status: error.code, data: error.message, originalError: error } };
          }

          return { data: data as DbStandardRoute };
        } catch (error) {
          console.error('Unexpected error creating standard route:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: [{ type: 'StandardRoutes', id: 'LIST' }],
    }),

    updateStandardRoute: builder.mutation<DbStandardRoute, { route_id: string } & Partial<DbStandardRoute>>({
      async queryFn({ route_id, ...updates }) {
        try {
          const { data, error } = await supabase
            .from('standard_routes')
            .update(updates)
            .eq('route_id', route_id)
            .select(`
              *,
              start_poi:start_poi_id(name, address),
              end_poi:end_poi_id(name, address)
            `)
            .single();

          if (error) {
            console.error('Error updating standard route:', error);
            return { error: { status: error.code, data: error.message, originalError: error } };
          }

          return { data: data as DbStandardRoute };
        } catch (error) {
          console.error('Unexpected error updating standard route:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: (_result, _error, { route_id }) => [
        { type: 'StandardRoutes', id: route_id },
        { type: 'StandardRoutes', id: 'LIST' }
      ],
    }),

    deleteStandardRoute: builder.mutation<void, string>({
      async queryFn(route_id) {
        try {
          const { error } = await supabase
            .from('standard_routes')
            .delete()
            .eq('route_id', route_id);

          if (error) {
            console.error('Error deleting standard route:', error);
            return { error: { status: error.code, data: error.message, originalError: error } };
          }

          return { data: undefined };
        } catch (error) {
          console.error('Unexpected error deleting standard route:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: (_result, _error, route_id) => [
        { type: 'StandardRoutes', id: route_id },
        { type: 'StandardRoutes', id: 'LIST' }
      ],
    }),

    // ===== FUEL TYPES ENDPOINTS =====
    getFuelTypes: builder.query<DbFuelType[], void>({
      queryFn: async (_arg, _queryApi, _extraOptions, _baseQuery) => {
        const { data, error } = await supabase
          .from('fuel_types')
          .select('*');
        
        if (error) throw error;
        return { data: data || [] };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ fuel_type_id }) => ({ type: 'FuelTypes' as const, id: fuel_type_id })),
              { type: 'FuelTypes', id: 'LIST' },
            ]
          : [{ type: 'FuelTypes', id: 'LIST' }],
    }),

    // ===== FUEL PRICES ENDPOINTS =====
    getFuelPrices: builder.query<DbFuelPrice[], { fuel_type_id?: string; latest_only?: boolean }>({
      queryFn: async ({ fuel_type_id, latest_only = true }, _queryApi, _extraOptions, _baseQuery) => {
        let query = supabase
          .from('fuel_prices')
          .select(`
            *,
            fuel_types(name, unit)
          `);

        if (fuel_type_id) {
          query = query.eq('fuel_type_id', fuel_type_id);
        }

        if (latest_only) {
          const { data: latestPrices, error: latestError } = await supabase.rpc('get_latest_fuel_prices');
          if (latestError) throw latestError;
          return { data: latestPrices || [] };
        } else {
          const { data, error } = await query.order('effective_date', { ascending: false });
          if (error) throw error;
          return { data: data || [] };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ price_id }) => ({ type: 'FuelPrices' as const, id: price_id })),
              { type: 'FuelPrices', id: 'LIST' },
            ]
          : [{ type: 'FuelPrices', id: 'LIST' }],
    }),

    createFuelPrice: builder.mutation<DbFuelPrice, Partial<DbFuelPrice>>({
      async queryFn(priceData) {
        try {
          const { data, error } = await supabase
            .from('fuel_prices')
            .insert([priceData])
            .select(`
              *,
              fuel_types(name, unit)
            `)
            .single();

          if (error) {
            console.error('Error creating fuel price:', error);
            return { error: { status: error.code, data: error.message, originalError: error } };
          }

          return { data: data as DbFuelPrice };
        } catch (error) {
          console.error('Unexpected error creating fuel price:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: [{ type: 'FuelPrices', id: 'LIST' }],
    }),

    updateFuelPrice: builder.mutation<DbFuelPrice, { price_id: string } & Partial<DbFuelPrice>>({
      async queryFn({ price_id, ...updates }) {
        try {
          const { data, error } = await supabase
            .from('fuel_prices')
            .update(updates)
            .eq('price_id', price_id)
            .select(`
              *,
              fuel_types(name, unit)
            `)
            .single();

          if (error) {
            console.error('Error updating fuel price:', error);
            return { error: { status: error.code, data: error.message, originalError: error } };
          }

          return { data: data as DbFuelPrice };
        } catch (error) {
          console.error('Unexpected error updating fuel price:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: (_result, _error, { price_id }) => [
        { type: 'FuelPrices', id: price_id },
        { type: 'FuelPrices', id: 'LIST' }
      ],
    }),

    deleteFuelPrice: builder.mutation<{ success: boolean }, string>({
      async queryFn(price_id) {
        try {
          const { error } = await supabase
            .from('fuel_prices')
            .delete()
            .eq('price_id', price_id);

          if (error) {
            console.error('Error deleting fuel price:', error);
            return { error: { status: error.code, data: error.message, originalError: error } };
          }

          return { data: { success: true } };
        } catch (error) {
          console.error('Unexpected error deleting fuel price:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: (_result, _error, price_id) => [
        { type: 'FuelPrices', id: price_id },
        { type: 'FuelPrices', id: 'LIST' }
      ],
    }),

    // ============ USER MANAGEMENT ENDPOINTS ============
    getUsers: builder.query<DbUser[], void>({
      async queryFn() {
        const { data, error } = await supabase
          .from('users')
          .select(`
            user_id,
            company_id,
            username,
            email,
            first_name,
            last_name,
            phone_number,
            avatar_url,
            is_active,
            is_email_verified,
            last_login_at,
            onboarding_status,
            preferred_language,
            preferred_theme,
            preferred_units,
            preferred_currency,
            created_at,
            updated_at
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error fetching users:', JSON.stringify(error, null, 2));
          return { error: { status: error.code, data: error.message, originalError: error } as SupabaseQueryError };
        }
        return { data: data as DbUser[] };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ user_id }) => ({ type: 'Users' as const, id: user_id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    createUser: builder.mutation<any, { userData: Partial<DbUser>; password?: string, companyId?: string }>({
      queryFn: async ({ userData, password, companyId }) => {
        // The actual logic is handled by the Edge Function
        // This is just a wrapper to call it via RTK Query.
        if (!password) {
          return { error: { status: '400', data: 'Password is required when creating a new user.', originalError: new Error('Password is required') as PostgrestError } };
        }

        // Note: The Edge Function 'create-user' handles the actual creation process.
        // This mutation invokes that function.
        try {
          const { data, error } = await supabase.functions.invoke('create-user', {
            body: { 
              email: userData.email,
              password,
              userData,
              company_id: companyId, // Pass company_id to the edge function
            },
          });

          if (error) throw error;
          
          return { data };
        } catch (error) {
          console.error('Error creating user:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['Users'],
    }),

    updateUser: builder.mutation<DbUser, Partial<DbUser> & { user_id: string }>({
      async queryFn({ user_id, ...updates }) {
        // Separate auth updates from public profile updates
        const authUpdates: { email?: string; phone?: string; } = {};
        if (updates.email) authUpdates.email = updates.email;
        if (updates.phone_number) authUpdates.phone = updates.phone_number;

        // 1. Update auth.users if necessary
        if (Object.keys(authUpdates).length > 0) {
          const { error: authError } = await supabase.auth.admin.updateUserById(user_id, authUpdates);
          if (authError) {
            console.error('Failed to update auth user:', authError);
            return { error: { status: '500', data: `Failed to update auth user: ${authError.message}`, originalError: authError as any } };
          }
        }
        
        // 2. Update public.users
          const { data, error } = await supabase
            .from('users')
          .update(updates)
            .eq('user_id', user_id)
            .select()
            .single();

          if (error) {
            return { error: { status: error.code, data: error.message, originalError: error } };
          }

        return { data };
      },
      invalidatesTags: (_result, _error, { user_id }) => [{ type: 'Users', id: user_id }, 'Users'],
    }),

    deleteUser: builder.mutation<{ success: boolean }, string>({
      async queryFn(user_id) {
        // First, delete from public.users table to respect foreign key constraints if any
        const { error: publicError } = await supabase
          .from('users')
          .delete()
          .eq('user_id', user_id);

        if (publicError) {
          console.error("Error deleting from public.users:", publicError);
          // Depending on the policy, you might want to stop here or continue
        }

        // Then, delete the user from auth.users
        const { error: authError } = await supabase.auth.admin.deleteUser(user_id);

        if (authError) {
          // If auth deletion fails, we might have an orphaned profile.
          // Handle this case, e.g., by logging or trying to restore the public user.
          console.error('Failed to delete auth user:', authError);
          return { error: { status: '500', data: `Failed to delete auth user: ${authError.message}`, originalError: authError as any } };
          }

          return { data: { success: true } };
      },
      invalidatesTags: ['Users'],
    }),

    // Get Roles
    getRoles: builder.query<DbRole[], void>({
      queryFn: async (_arg, _queryApi, _extraOptions, _baseQuery) => {
        const { data, error } = await supabase
          .from('roles')
          .select('*');

        if (error) throw error;
        return { data: data || [] };
      },
      providesTags: [{ type: 'Role', id: 'LIST' }],
    }),

    // Get Departments - DISABLED (departments table doesn't exist)
    getDepartments: builder.query<DbDepartment[], void>({
      queryFn: async (_arg, _queryApi, _extraOptions, _baseQuery) => {
        return { data: [] as DbDepartment[] };
      },
      providesTags: [{ type: 'Department', id: 'LIST' }],
    }),

    // Get Current User Profile with detailed information
    getCurrentUserProfile: builder.query<DbUser, string>({
      queryFn: async (userId, _queryApi, _extraOptions, _baseQuery) => {

        
        const { data, error } = await supabase
          .from('users')
          .select(`
            user_id,
            company_id,
            username,
            email,
            first_name,
            last_name,
            phone_number,
            avatar_url,
            is_active,
            is_email_verified,
            last_login_at,
            onboarding_status,
            preferred_language,
            preferred_theme,
            preferred_units,
            preferred_currency,
            created_at,
            updated_at,
            alternative_phone,
            date_of_birth,
            position,
            branch,
            manager,
            work_email,
            home_address,
            home_city,
            home_postal_code,
            home_country,
            work_address,
            work_city,
            work_postal_code,
            work_country,
            emergency_contact_name,
            emergency_contact_phone,
            emergency_contact_relationship,
            has_private_vehicle,
            private_vehicle_plate,
            private_vehicle_make,
            private_vehicle_model,
            driving_license_number,
            driving_license_category,
            driving_license_expiry,
            biography,
            skills,
            languages,
            certifications,
            user_roles(roles(role_id, role_name, description))
          `)
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error('❌ Supabase error fetching user profile:', JSON.stringify(error, null, 2));
          return { error: { status: error.code, data: error.message, originalError: error } as SupabaseQueryError };
        }
        

        
        return { data: data as any as DbUser };
      },
      providesTags: (_result, _error, userId) => [{ type: 'Users', id: userId }],
    }),

    // Update Current User Profile
    updateCurrentUserProfile: builder.mutation<DbUser, { userId: string; updates: Partial<DbUser> }>({
      async queryFn({ userId, updates }) {
        try {
          console.log('🔄 API: Starting user profile update');
          console.log('🔄 API: User ID:', userId);
          console.log('🔄 API: Updates to apply:', updates);
          
          const { data, error } = await supabase
            .from('users')
            .update({
              ...updates,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
            .select(`
              user_id,
              company_id,
              username,
              email,
              password_hash,
              first_name,
              last_name,
              phone_number,
              avatar_url,
              is_active,
              is_email_verified,
              last_login_at,
              onboarding_status,
              preferred_language,
              preferred_theme,
              preferred_units,
              preferred_currency,
              created_at,
              updated_at,
              alternative_phone,
              date_of_birth,
              position,
              branch,
              manager,
              work_email,
              home_address,
              home_city,
              home_postal_code,
              home_country,
              work_address,
              work_city,
              work_postal_code,
              work_country,
              emergency_contact_name,
              emergency_contact_phone,
              emergency_contact_relationship,
              has_private_vehicle,
              private_vehicle_plate,
              private_vehicle_make,
              private_vehicle_model,
              driving_license_number,
              driving_license_category,
              driving_license_expiry,
              biography,
              skills,
              languages,
              certifications,
              user_roles(roles(role_id, role_name, description))
            `)
            .single();

          console.log('🔄 API: Database response:', { data, error });

          if (error) {
            console.error('❌ API: Error updating user profile:', error);
            return { error: { status: error.code, data: error.message, originalError: error } };
          }

          console.log('✅ API: Profile update successful:', data);
          return { data: data as any as DbUser };
        } catch (error) {
          console.error('❌ API: Unexpected error updating user profile:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: (_result, _error, { userId }) => [
        { type: 'Users', id: userId },
        { type: 'Users', id: 'LIST' }
      ],
    }),

    // System Logs API
    getSystemLogs: builder.query<DbSystemLog[], {
      limit?: number;
      severity?: string;
      logType?: string;
      resolved?: boolean;
      userId?: string;
    }>({
      async queryFn({ limit = 50, severity, logType, resolved, userId }) {
        try {
          let query = supabase
            .from('system_logs')
            .select(`
              *
            `)
            .order('created_at', { ascending: false })
            .limit(limit);

          // Apply filters
          if (severity) query = query.eq('severity', severity);
          if (logType) query = query.eq('log_type', logType);
          if (resolved !== undefined) query = query.eq('is_resolved', resolved);
          if (userId) query = query.eq('user_id', userId);

          const { data, error } = await query;

          if (error) {
            console.error('Error fetching system logs:', error);
            return { error: { status: error.code, data: error.message, originalError: error } };
          }

          return { data: data || [] };
        } catch (error) {
          console.error('Unexpected error fetching system logs:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      providesTags: [{ type: 'SystemLogs', id: 'LIST' }],
    }),

    // Create System Log
    createSystemLog: builder.mutation<DbSystemLog, {
      log_type: string;
      severity: string;
      title: string;
      description?: string;
      metadata?: Record<string, unknown>;
      related_expense_id?: string;
      related_vehicle_id?: string;
      related_trip_id?: string;
    }>({
      async queryFn(logData) {
        try {
          // Get current user info
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('User not authenticated');

          const { data, error } = await supabase
            .from('system_logs')
            .insert([{
              ...logData,
              user_id: user.id,
              company_id: user.user_metadata?.company_id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }])
            .select('*')
            .single();

          if (error) {
            console.error('Error creating system log:', error);
            throw error;
          }

          // Create notification for HIGH or CRITICAL severity logs
          if (logData.severity === 'HIGH' || logData.severity === 'CRITICAL') {
            try {
              await supabase
                .from('notifications')
                .insert([{
                  user_id: user.id,
                  type: 'system_alert',
                  title: `${logData.severity} Alert: ${logData.title}`,
                  message: logData.description || 'System alert requires attention',
                  related_entity_type: 'system_log',
                  related_entity_id: data.log_id,
                  created_at: new Date().toISOString()
                }]);
              console.log('Notification created for critical system log');
            } catch (notifError) {
              console.warn('Failed to create notification for system log:', notifError);
              // Don't fail the system log creation if notification fails
            }
          }

          return { data: data as DbSystemLog };
        } catch (error) {
          console.error('Error in createSystemLog:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['SystemLogs'],
    }),

    // Resolve System Log
    resolveSystemLog: builder.mutation<DbSystemLog, {
      logId: string;
      resolutionNotes?: string;
    }>({
      async queryFn({ logId, resolutionNotes }) {
        try {
          // Get current user info
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('User not authenticated');

          const { data, error } = await supabase
            .from('system_logs')
            .update({
              is_resolved: true,
              resolved_by_user_id: user.id,
              resolved_at: new Date().toISOString(),
              resolution_notes: resolutionNotes,
              updated_at: new Date().toISOString()
            })
            .eq('log_id', logId)
            .select('*')
            .single();

          if (error) {
            console.error('Error resolving system log:', error);
            throw error;
          }

          return { data: data as DbSystemLog };
        } catch (error) {
          console.error('Error in resolveSystemLog:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['SystemLogs'],
    }),

    // Get System Log Statistics
    getSystemLogStats: builder.query<{
      total: number;
      unresolved: number;
      byType: Record<string, number>;
      bySeverity: Record<string, number>;
      recent24h: number;
    }, void>({
      async queryFn() {
        try {
          // Get total and unresolved counts
          const { data: allLogs, error: allError } = await supabase
            .from('system_logs')
            .select('log_type, severity, is_resolved, created_at');

          if (allError) throw allError;

          const logs = allLogs || [];
          const now = new Date();
          const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

          const stats = {
            total: logs.length,
            unresolved: logs.filter(log => !log.is_resolved).length,
            byType: {} as Record<string, number>,
            bySeverity: {} as Record<string, number>,
            recent24h: logs.filter(log => new Date(log.created_at) > yesterday).length
          };

          // Count by type and severity
          logs.forEach(log => {
            stats.byType[log.log_type] = (stats.byType[log.log_type] || 0) + 1;
            stats.bySeverity[log.severity] = (stats.bySeverity[log.severity] || 0) + 1;
          });

          return { data: stats };
        } catch (error) {
          console.error('Error fetching system log stats:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      providesTags: [{ type: 'SystemLogs', id: 'STATS' }],
    }),

    // Company Settings API
    getCompanySettings: builder.query<DbCompany | null, string | void>({
      async queryFn(companyId) {
        try {
          // If no companyId is provided, try to get it from the logged-in user
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            console.warn('Company Settings: User not authenticated, skipping query');
            // Return null data instead of error to prevent Redux state issues
            return { data: null };
          }

          // First get user's company_id from users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('company_id')
            .eq('user_id', user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            return { error: { status: userError.code || 'USER_ERROR', data: userError.message, originalError: userError } };
          }

          if (!userData?.company_id) {
            console.warn('User has no company_id, using default company');
            // Get the first available company instead of creating new one
            const { data: defaultCompany, error: defaultError } = await supabase
              .from('companies')
              .select('*')
              .limit(1)
              .single();

            if (defaultError || !defaultCompany) {
              console.error('No company found:', defaultError);
              const errorToReturn: PostgrestError = defaultError || {
                message: 'No company configured in the database.',
                details: 'The query for a default company returned no results.',
                hint: 'Ensure at least one company exists in the companies table.',
                code: 'FF404', // Custom code for Fleet Flow Not Found
                name: 'NotFoundError'
              };
              return { error: { status: errorToReturn.code, data: errorToReturn.message, originalError: errorToReturn } };
            }

            // Update user with default company_id
            await supabase
              .from('users')
              .update({ company_id: defaultCompany.company_id })
              .eq('user_id', user.id);

            return { data: defaultCompany as DbCompany };
          }

          const { data, error } = await supabase
            .from('companies')
            .select('*')
            .eq('company_id', userData.company_id)
            .single();

          if (error) {
            console.error('Error fetching company settings:', error);
            return { error: { status: error.code || 'FETCH_ERROR', data: error.message, originalError: error } };
          }

          return { data: data as DbCompany };
        } catch (error: any) {
          console.error('Unexpected error fetching company settings:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      providesTags: (result) =>
        result ? [{ type: 'Company', id: result.company_id }] : [{ type: 'Company', id: 'DETAIL' }],
    }),

    // Update Company Settings
    updateCompanySettings: builder.mutation<DbCompany, {
      name?: string;
      address?: string;
      contact_email?: string;
      contact_phone?: string;
      subscription_plan?: string;
    }>({
      async queryFn(updates) {
        try {
          // Get current user's company_id from users table
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            console.warn('Update Company Settings: User not authenticated, skipping update');
            return { error: { status: 'UNAUTHENTICATED', data: 'User not authenticated' } as SupabaseQueryError };
          }

          // Get user's company_id from users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('company_id')
            .eq('user_id', user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data for company update:', userError);
            return { error: { status: userError.code || 'USER_ERROR', data: userError.message, originalError: userError } as SupabaseQueryError };
          }

          if (!userData?.company_id) {
            console.error('User company not found for update');
            return { error: { status: 'NO_COMPANY', data: 'User company not found' } as SupabaseQueryError };
          }

          const { data, error } = await supabase
            .from('companies')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('company_id', userData.company_id)
            .select('*')
            .single();

          if (error) {
            console.error('Error updating company settings:', error);
            return { error: { status: error.code || 'UPDATE_ERROR', data: error.message, originalError: error } as SupabaseQueryError };
          }

          return { data: data as DbCompany };
        } catch (error: any) {
          console.error('Error in updateCompanySettings:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: [{ type: 'Company', id: 'SETTINGS' }],
    }),

    // Expense Receipts endpoints
    createExpenseReceipt: builder.mutation<DbExpenseReceipt, {
      expense_id: string;
      file_url: string;
      file_name?: string;
      mime_type?: string;
    }>({
      async queryFn(receiptData) {
        try {
          const { data, error } = await supabase
            .from('expense_receipts')
            .insert({
              expense_id: receiptData.expense_id,
              file_url: receiptData.file_url,
              file_name: receiptData.file_name || null,
              mime_type: receiptData.mime_type || null,
              uploaded_by_user_id: (await supabase.auth.getUser()).data.user?.id,
            })
            .select('*')
            .single();

          if (error) {
            console.error('Error creating expense receipt:', error);
            return { error: { status: error.code || 'UNKNOWN', data: error.message, originalError: error } };
          }

          return { data };
        } catch (error: any) {
          console.error('Error creating expense receipt:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: (_result, _error, arg) => [
        'ExpenseReceipts',
        { type: 'ExpenseReceipts', id: arg.expense_id }
      ],
    }),

    getExpenseReceipts: builder.query<DbExpenseReceipt[], string>({
      async queryFn(expense_id) {
        try {
          const { data, error } = await supabase
            .from('expense_receipts')
            .select('*')
            .eq('expense_id', expense_id)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching expense receipts:', error);
            return { error: { status: error.code || 'UNKNOWN', data: error.message, originalError: error } };
          }

          return { data: data || [] };
        } catch (error: any) {
          console.error('Error fetching expense receipts:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      providesTags: (_result, _error, expense_id) => [
        { type: 'ExpenseReceipts', id: expense_id },
        'ExpenseReceipts',
      ],
    }),

    deleteExpenseReceipt: builder.mutation<{ success: boolean }, string>({
      async queryFn(receipt_id) {
        try {
          const { error } = await supabase
            .from('expense_receipts')
            .delete()
            .eq('receipt_id', receipt_id);

          if (error) {
            console.error('Error deleting expense receipt:', error);
            return { error: { status: error.code || 'UNKNOWN', data: error.message, originalError: error } };
          }

          return { data: { success: true } };
        } catch (error: any) {
          console.error('Error deleting expense receipt:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['ExpenseReceipts'],
    }),

    // ============ USER REQUESTS ENDPOINTS ============
    getUserRequests: builder.query<DbUserRequest[], { status?: string; limit?: number }>({
      async queryFn({ status, limit = 50 }) {
        try {
          let query = supabase
            .from('user_requests')
            .select(`
              *,
              users:user_id (first_name, last_name, avatar_url),
              requested_by_user:requested_by_user_id (first_name, last_name, avatar_url),
              approved_by_user:approved_by_user_id (first_name, last_name, avatar_url)
            `)
            .order('created_at', { ascending: false })
            .limit(limit);

          if (status) {
            query = query.eq('status', status);
          }

          const { data, error } = await query;

          if (error) {
            console.error('Error fetching user requests:', error);
            return { error: { status: error.code || 'UNKNOWN', data: error.message, originalError: error } };
          }

          // Transform data to match interface expectations
          const transformedData = (data || []).map((request: DbUserRequest) => ({
            ...request,
            requested_changes: request.requested_changes || {
              changes: [],
              user_name: 'Unknown User',
              user_email: 'unknown@email.com'
            }
          }));

          return { data: transformedData };
        } catch (error: any) {
          console.error('Error fetching user requests:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ request_id }) => ({ type: 'UserRequests' as const, id: request_id })),
              { type: 'UserRequests', id: 'LIST' },
            ]
          : [{ type: 'UserRequests', id: 'LIST' }],
    }),

    getPendingUserRequests: builder.query<DbUserRequest[], void>({
      queryFn() {
        return { data: null };
      },
      providesTags: [{ type: 'UserRequests', id: 'PENDING' }],
    }),

    approveUserRequest: builder.mutation<DbUserRequest, {
      requestId: string;
      approvedByUserId: string;
      approvalNotes?: string;
    }>({
      async queryFn({ requestId, approvedByUserId, approvalNotes }) {
        try {
          console.log('🔄 Approving user request:', requestId);

          const { data, error } = await supabase
            .from('user_requests')
            .update({
              status: 'approved',
              approved_by_user_id: approvedByUserId,
              approval_notes: approvalNotes || null,
              approved_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('request_id', requestId)
            .select(`
              *,
              users:user_id (first_name, last_name, avatar_url),
              requested_by_user:requested_by_user_id (first_name, last_name, avatar_url),
              approved_by_user:approved_by_user_id (first_name, last_name, avatar_url)
            `)
            .single();

          if (error) {
            console.error('❌ Error approving user request:', error);
            throw error;
          }

          console.log('✅ User request approved successfully:', data.request_id);
          
          // Transform data to match interface expectations
          const transformedData = {
            ...data,
            requested_changes: data.requested_changes || {
              changes: [],
              user_name: 'Unknown User',
              user_email: 'unknown@email.com'
            }
          };
          
          return { data: transformedData };
        } catch (error: any) {
          console.error('❌ Error in approveUserRequest:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['UserRequests', { type: 'UserRequests', id: 'PENDING' }],
      async onQueryStarted({ requestId }, { dispatch, queryFulfilled }) {
        // Optimistic update - remove request from pending list immediately
        const patchResult = dispatch(
          supabaseApi.util.updateQueryData('getPendingUserRequests', undefined, (draft) => {
            const index = draft.findIndex(request => request.request_id === requestId);
            if (index !== -1) {
              console.log('🔄 Optimistically removing user request from pending list:', requestId);
              draft.splice(index, 1);
            }
          })
        );
        
        try {
          await queryFulfilled;
          console.log('✅ User request approval confirmed, optimistic update kept');
        } catch {
          console.log('❌ User request approval failed, reverting optimistic update');
          patchResult.undo();
        }
      },
    }),

    rejectUserRequest: builder.mutation<DbUserRequest, {
      requestId: string;
      approvedByUserId: string;
      rejectionReason: string;
    }>({
      async queryFn({ requestId, approvedByUserId, rejectionReason }) {
        try {
          console.log('🔄 Rejecting user request:', requestId);

          const { data, error } = await supabase
            .from('user_requests')
            .update({
              status: 'rejected',
              approved_by_user_id: approvedByUserId,
              rejection_reason: rejectionReason,
              approved_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('request_id', requestId)
            .select(`
              *,
              users:user_id (first_name, last_name, avatar_url),
              requested_by_user:requested_by_user_id (first_name, last_name, avatar_url),
              approved_by_user:approved_by_user_id (first_name, last_name, avatar_url)
            `)
            .single();

          if (error) {
            console.error('❌ Error rejecting user request:', error);
            throw error;
          }

          console.log('✅ User request rejected successfully:', data.request_id);
          
          // Transform data to match interface expectations
          const transformedData = {
            ...data,
            requested_changes: data.requested_changes || {
              changes: [],
              user_name: 'Unknown User',
              user_email: 'unknown@email.com'
            }
          };
          
          return { data: transformedData };
        } catch (error: any) {
          console.error('❌ Error in rejectUserRequest:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['UserRequests', { type: 'UserRequests', id: 'PENDING' }],
      async onQueryStarted({ requestId }, { dispatch, queryFulfilled }) {
        // Optimistic update - remove request from pending list immediately
        const patchResult = dispatch(
          supabaseApi.util.updateQueryData('getPendingUserRequests', undefined, (draft) => {
            const index = draft.findIndex(request => request.request_id === requestId);
            if (index !== -1) {
              console.log('🔄 Optimistically removing user request from pending list:', requestId);
              draft.splice(index, 1);
            }
          })
        );
        
        try {
          await queryFulfilled;
          console.log('✅ User request rejection confirmed, optimistic update kept');
        } catch {
          console.log('❌ User request rejection failed, reverting optimistic update');
          patchResult.undo();
        }
      },
    }),

    createUserRequest: builder.mutation<DbUserRequest, {
      user_id: string;
      requested_by_user_id: string;
      request_type: string;
      requested_changes: any;
    }>({
      async queryFn({ user_id, requested_by_user_id, request_type, requested_changes }) {
        try {
          const { data, error } = await supabase
            .from('user_requests')
            .insert({
              user_id,
              requested_by_user_id,
              request_type,
              requested_changes, // Use correct column name
              status: 'pending'
            })
            .select(`
              *,
              users:user_id (first_name, last_name, avatar_url),
              requested_by_user:requested_by_user_id (first_name, last_name, avatar_url)
            `)
            .single();

          if (error) {
            console.error('Error creating user request:', error);
            throw error;
          }

          return { data };
        } catch (error: any) {
          console.error('Error in createUserRequest:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['UserRequests', { type: 'UserRequests', id: 'PENDING' }],
    }),

    // Hardcoded for now, should be moved to DB
    getPurposeOptions: builder.query<DbPurposeOption[], void>({
       queryFn() {
        try {
          const purposes: DbPurposeOption[] = [
            { purpose_id: '1', name: 'Business Meeting', description: 'Client meetings and business appointments', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { purpose_id: '2', name: 'Site Visit', description: 'On-site inspections and visits', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { purpose_id: '3', name: 'Delivery', description: 'Equipment or document delivery', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { purpose_id: '4', name: 'Training', description: 'Staff training and workshops', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { purpose_id: '5', name: 'Maintenance', description: 'Vehicle or equipment maintenance', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { purpose_id: '6', name: 'Emergency', description: 'Urgent business needs', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { purpose_id: '7', name: 'Meeting', description: 'Scheduled meetings', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { purpose_id: '8', name: 'Other', description: 'Any other purpose', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          ];
          return { data: purposes };
        } catch (error) {
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      providesTags: ['Hardcoded'],
    }),

    // Hardcoded for now, should be moved to DB
    getLocationOptions: builder.query<DbLocation[], void>({
       queryFn() {
        try {
          const locations: DbLocation[] = [
            { location_id: '1', name: 'Main Office', address: 'Knez Mihailova 42, Belgrade', latitude: 44.8176, longitude: 20.4633, is_pickup_location: true, is_dropoff_location: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { location_id: '2', name: 'Warehouse', address: 'Batajnička cesta 23, Belgrade', latitude: 44.8512, longitude: 20.4112, is_pickup_location: true, is_dropoff_location: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { location_id: '3', name: 'Client Office Downtown', address: 'Terazije 25, Belgrade', latitude: 44.8125, longitude: 20.4612, is_pickup_location: false, is_dropoff_location: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { location_id: '4', name: 'Airport', address: 'Nikola Tesla Airport, Belgrade', latitude: 44.8184, longitude: 20.3091, is_pickup_location: true, is_dropoff_location: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { location_id: '5', name: 'Branch Office Novi Sad', address: 'Zmaj Jovina 15, Novi Sad', latitude: 45.2671, longitude: 19.8335, is_pickup_location: true, is_dropoff_location: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { location_id: '6', name: 'Service Center', address: 'Bulevar Oslobođenja 124, Belgrade', latitude: 44.7866, longitude: 20.4489, is_pickup_location: true, is_dropoff_location: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { location_id: '7', name: 'Other', address: 'Specify address', is_pickup_location: true, is_dropoff_location: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          ];
          return { data: locations };
        } catch (error) {
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      providesTags: ['Hardcoded'],
    }),

    // === TRAVEL ORDERS ===

    // Get active travel order for user
    getActiveTravelOrder: builder.query<DbTravelOrder | null, { userId: string }>({
      async queryFn({ userId }) {
        try {
          const { data, error } = await supabase
            .from('travel_orders')
            .select(`
              *,
              users!travel_orders_user_id_fkey(first_name, last_name)
            `)
            .eq('user_id', userId)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Error fetching active travel order:', error);
            throw error;
          }

          return { data: data as DbTravelOrder | null };
        } catch (error) {
          console.error('Error in getActiveTravelOrder:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      providesTags: ['TravelOrders'],
    }),

    // Create new travel order
    createTravelOrder: builder.mutation<DbTravelOrder, {
      user_id: string;
      company_id: string;
      purpose?: string;
      start_date: string;
    }>({
      async queryFn(travelOrderData) {
        try {
          const { data, error } = await supabase
            .from('travel_orders')
            .insert([travelOrderData])
            .select(`
              *,
              users!travel_orders_user_id_fkey(first_name, last_name)
            `)
            .single();

          if (error) {
            console.error('Error creating travel order:', error);
            throw error;
          }

          return { data: data as DbTravelOrder };
        } catch (error) {
          console.error('Error in createTravelOrder:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['TravelOrders'],
    }),

    // Update travel order
    updateTravelOrder: builder.mutation<DbTravelOrder, { travelOrderId: string; updates: Partial<DbTravelOrder> }>({
      async queryFn({ travelOrderId, updates }) {
        try {
          const { data, error } = await supabase
            .from('travel_orders')
            .update({
              ...updates,
              updated_at: new Date().toISOString()
            })
            .eq('id', travelOrderId)
            .select(`
              *,
              users!travel_orders_user_id_fkey(first_name, last_name)
            `)
            .single();

          if (error) {
            console.error('Error updating travel order:', error);
            throw error;
          }

          return { data: data as DbTravelOrder };
        } catch (error) {
          console.error('Error in updateTravelOrder:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      invalidatesTags: ['TravelOrders'],
    }),

    // Get travel orders for user
    getTravelOrders: builder.query<DbTravelOrder[], { userId: string; limit?: number }>({
      async queryFn({ userId, limit = 50 }) {
        try {
          const { data, error } = await supabase
            .from('travel_orders')
            .select(`
              *,
              users!travel_orders_user_id_fkey(first_name, last_name)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

          if (error) {
            console.error('Error fetching travel orders:', error);
            throw error;
          }

          return { data: data as DbTravelOrder[] };
        } catch (error) {
          console.error('Error in getTravelOrders:', error);
          const postgrestError = error as PostgrestError;
          return { error: { status: postgrestError.code, data: postgrestError.message, originalError: postgrestError } };
        }
      },
      providesTags: ['TravelOrders'],
    }),

  }),
});

export const { 
  useGetRemindersQuery,
  useGetVehiclesQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useGetTripTypesQuery,
  useGetTripPurposesQuery,
  useGetTripsQuery,
  useGetExpensesQuery,
  useGetVehicleTypesQuery,
  useGetVehicleStatusesQuery,
  useGetReservationsQuery,
  useGetReservationByIdQuery,
  useUpdateReservationMutation,
  useDeleteReservationMutation,
  useApproveReservationMutation,
  useRejectReservationMutation,
  useGetPendingReservationsQuery,
  useCreateNotificationMutation,
  useDeleteTripMutation,
  useUpdateTripMutation,
  useCreateTripMutation,
  useGetExpenseCategoriesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetReminderTypesQuery,
  useCreateReminderMutation,
  useUpdateReminderMutation,
  useEndTripMutation,
  useGetReservationStatusesQuery,
  useCreateReservationMutation,
  useGetPurposeOptionsQuery,
  useGetLocationOptionsQuery,
  // Travel Orders
  useGetActiveTravelOrderQuery,
  useCreateTravelOrderMutation,
  useUpdateTravelOrderMutation,
  useGetTravelOrdersQuery,
  // POIs
  useGetPoisQuery,
  useCreatePoiMutation,
  useUpdatePoiMutation,
  useDeletePoiMutation,
  // Standard Routes
  useGetStandardRoutesQuery,
  useCreateStandardRouteMutation,
  useUpdateStandardRouteMutation,
  useDeleteStandardRouteMutation,
  // Fuel Types
  useGetFuelTypesQuery,
  // Fuel Prices
  useGetFuelPricesQuery,
  useCreateFuelPriceMutation,
  useUpdateFuelPriceMutation,
  useDeleteFuelPriceMutation,
  // User Management
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetRolesQuery,
  useGetDepartmentsQuery,
  useGetCurrentUserProfileQuery,
  useUpdateCurrentUserProfileMutation,
  // System Logs
  useGetSystemLogsQuery,
  useCreateSystemLogMutation,
  useResolveSystemLogMutation,
  useGetSystemLogStatsQuery,
  // Company Settings
  useGetCompanySettingsQuery,
  useUpdateCompanySettingsMutation,
  useCreateExpenseReceiptMutation,
  useGetExpenseReceiptsQuery,
  useDeleteExpenseReceiptMutation,
  // User Requests
  useGetUserRequestsQuery,
  useGetPendingUserRequestsQuery,
  useApproveUserRequestMutation,
  useRejectUserRequestMutation,
  useCreateUserRequestMutation,

} = supabaseApi; 