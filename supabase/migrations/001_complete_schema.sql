-- Fleet Flow Next Gen - Complete Schema Migration
-- Generated: 2025-01-22
-- Description: Complete database schema with all tables, functions, policies and seed data
-- Consolidated from existing backup data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom types
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE trip_status AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE reservation_status_enum AS ENUM ('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED');

-- =============================================
-- COMPANIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS companies (
    company_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    subscription_plan VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Extended company fields
    registration_number VARCHAR(100),
    tax_number VARCHAR(100),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    website VARCHAR(255),
    industry VARCHAR(100),
    founded_year VARCHAR(4),
    employee_count VARCHAR(50),
    description TEXT,
    bank_name VARCHAR(255),
    bank_account VARCHAR(100),
    swift_code VARCHAR(50)
);

-- =============================================
-- DEPARTMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS departments (
    department_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    parent_department_id UUID REFERENCES departments(department_id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROLES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS roles (
    role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PERMISSIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS permissions (
    permission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    permission_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    module VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROLE_PERMISSIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(permission_id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(company_id),
    username VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(50),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    onboarding_status VARCHAR(50) DEFAULT 'pending',
    preferred_language VARCHAR(10) DEFAULT 'en',
    preferred_theme VARCHAR(20) DEFAULT 'light',
    preferred_units VARCHAR(20) DEFAULT 'metric',
    preferred_currency VARCHAR(10) DEFAULT 'EUR',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Extended profile fields
    alternative_phone VARCHAR(50),
    date_of_birth DATE,
    position VARCHAR(100),
    branch VARCHAR(100),
    manager VARCHAR(100),
    work_email VARCHAR(255),
    
    -- Address Information
    home_address TEXT,
    home_city VARCHAR(100),
    home_postal_code VARCHAR(20),
    home_country VARCHAR(100),
    work_address TEXT,
    work_city VARCHAR(100),
    work_postal_code VARCHAR(20),
    work_country VARCHAR(100),
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(50),
    emergency_contact_relationship VARCHAR(50),
    
    -- Vehicle & Licenses
    has_private_vehicle BOOLEAN DEFAULT FALSE,
    private_vehicle_plate VARCHAR(20),
    private_vehicle_make VARCHAR(50),
    private_vehicle_model VARCHAR(50),
    driving_license_number VARCHAR(100),
    driving_license_category VARCHAR(50),
    driving_license_expiry DATE,
    preferred_vehicle_id UUID,
    
    -- Additional Information
    biography TEXT,
    skills TEXT,
    languages TEXT,
    certifications TEXT
);

-- =============================================
-- USER_ROLES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- FUEL_TYPES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS fuel_types (
    fuel_type_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    unit VARCHAR(20) NOT NULL DEFAULT 'liters',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- VEHICLE_TYPES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS vehicle_types (
    vehicle_type_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- VEHICLE_STATUS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS vehicle_status (
    vehicle_status_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- VEHICLES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(company_id),
    vehicle_type_id UUID NOT NULL REFERENCES vehicle_types(vehicle_type_id),
    vehicle_status_id UUID REFERENCES vehicle_status(vehicle_status_id),
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    vin VARCHAR(50),
    color VARCHAR(50),
    engine_type VARCHAR(50),
    fuel_type_id UUID REFERENCES fuel_types(fuel_type_id),
    fuel_tank_capacity DECIMAL(10,2),
    battery_capacity_kwh DECIMAL(10,2),
    avg_consumption DECIMAL(10,2),
    current_odometer DECIMAL(15,2),
    last_odometer_update TIMESTAMPTZ,
    registration_date DATE,
    registration_expiry_date DATE,
    insurance_policy_number VARCHAR(100),
    insurance_expiry_date DATE,
    is_private_vehicle BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Detailed vehicle specifications
    seats_count INTEGER,
    trunk_capacity_liters INTEGER,
    cargo_capacity_kg DECIMAL(10,2),
    cargo_volume_m3 DECIMAL(10,3),
    pallet_capacity INTEGER,
    required_license_category VARCHAR(10),
    engine_volume_cc INTEGER,
    engine_power_kw DECIMAL(10,2),
    engine_power_hp DECIMAL(10,2),
    fuel_consumption_city DECIMAL(5,2),
    fuel_consumption_highway DECIMAL(5,2),
    fuel_consumption_combined DECIMAL(5,2),
    
    -- Registration and insurance costs
    registration_cost_annual DECIMAL(10,2),
    insurance_cost_annual DECIMAL(10,2),
    service_interval_km INTEGER,
    service_interval_months INTEGER,
    
    -- Private vehicle owner info
    private_owner_name VARCHAR(100),
    private_owner_contact VARCHAR(100),
    private_owner_id UUID, -- References users table, but not as a strict FK to allow flexibility
    FOREIGN KEY (private_owner_id) REFERENCES users(user_id) ON DELETE SET NULL,
    
    -- Public transport info
    is_public_transport BOOLEAN DEFAULT FALSE,
    public_transport_type VARCHAR(50),
    transport_company_name VARCHAR(100),
    transport_company_license VARCHAR(100),
    fare_per_km DECIMAL(10,2),
    fare_base_price DECIMAL(10,2),
    ticket_price DECIMAL(10,2),
    route_description TEXT
);

-- =============================================
-- VEHICLE_ASSIGNMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS vehicle_assignments (
    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    assignment_type VARCHAR(50), -- e.g., 'default_driver', 'temporary'
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE vehicle_assignments IS 'Tracks which user is currently assigned to or primarily uses a vehicle.';

-- =============================================
-- TRIP_TYPES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS trip_types (
    trip_type_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_billable BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TRIP_PURPOSES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS trip_purposes (
    trip_purpose_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    category VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TRIPS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS trips (
    trip_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id),
    trip_type_id UUID REFERENCES trip_types(trip_type_id),
    trip_purpose_id UUID REFERENCES trip_purposes(trip_purpose_id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    start_location_address TEXT,
    end_location_address TEXT,
    distance_km DECIMAL(10,2),
    duration_minutes INTEGER,
    status trip_status DEFAULT 'PLANNED',
    notes TEXT,
    purpose_description TEXT,
    route_details_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RESERVATION_STATUS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS reservation_status (
    reservation_status_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RESERVATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS reservations (
    reservation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    vehicle_id UUID REFERENCES vehicles(vehicle_id),
    vehicle_type_id UUID REFERENCES vehicle_types(vehicle_type_id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    purpose TEXT,
    status_id UUID NOT NULL REFERENCES reservation_status(reservation_status_id),
    approved_by_user_id UUID REFERENCES users(user_id),
    approval_notes TEXT,
    rejection_reason TEXT,
    requested_features JSONB,
    actual_vehicle_id UUID REFERENCES vehicles(vehicle_id),
    pickup_location TEXT,
    dropoff_location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- EXPENSE_CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS expense_categories (
    expense_category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    default_gl_code VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- EXPENSES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS expenses (
    expense_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    trip_id UUID REFERENCES trips(trip_id),
    vehicle_id UUID REFERENCES vehicles(vehicle_id),
    expense_category_id UUID NOT NULL REFERENCES expense_categories(expense_category_id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    expense_date DATE NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    approved_by_user_id UUID REFERENCES users(user_id),
    approval_date TIMESTAMPTZ,
    rejection_reason TEXT,
    payment_method VARCHAR(50),
    fuel_liters DECIMAL(10,2),
    fuel_price_per_liter DECIMAL(10,4),
    is_reimbursable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- FUEL_PRICES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS fuel_prices (
    price_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fuel_type_id UUID NOT NULL REFERENCES fuel_types(fuel_type_id),
    price_per_unit DECIMAL(10,4) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    effective_date DATE NOT NULL,
    source VARCHAR(100),
    region VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- POIS (Points of Interest) TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS pois (
    poi_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(company_id),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    category VARCHAR(100),
    contact_info TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- STANDARD_ROUTES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS standard_routes (
    route_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(company_id),
    name VARCHAR(255) NOT NULL,
    start_poi_id UUID REFERENCES pois(poi_id),
    end_poi_id UUID REFERENCES pois(poi_id),
    start_address_manual TEXT,
    end_address_manual TEXT,
    predefined_distance_km DECIMAL(10,2),
    estimated_duration_min INTEGER,
    predefined_cost DECIMAL(10,2),
    cost_calculation_formula TEXT,
    route_details_json JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- REMINDER_TYPES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS reminder_types (
    reminder_type_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    default_lead_time_days INTEGER DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- REMINDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS reminders (
    reminder_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    reminder_type_id UUID REFERENCES reminder_types(reminder_type_id),
    vehicle_id UUID REFERENCES vehicles(vehicle_id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    is_system_generated BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Recurring reminder fields
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern VARCHAR(20), -- 'daily', 'weekly', 'monthly', 'yearly'
    recurrence_interval INTEGER DEFAULT 1,
    recurrence_day_of_week INTEGER, -- 0=Sunday, 1=Monday, etc.
    recurrence_day_of_month INTEGER, -- 1-31
    recurrence_end_date DATE,
    parent_reminder_id UUID REFERENCES reminders(reminder_id)
);

-- =============================================
-- SYSTEM_LOGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS system_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(company_id),
    user_id UUID NOT NULL REFERENCES users(user_id),
    log_type VARCHAR(50) NOT NULL, -- 'FUEL_EXCESS', 'HIGH_EXPENSE', 'SUSPICIOUS_PATTERN', 'SYSTEM_EVENT'
    severity VARCHAR(20) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    metadata JSONB,
    
    -- Related entities
    related_expense_id UUID REFERENCES expenses(expense_id),
    related_vehicle_id UUID REFERENCES vehicles(vehicle_id),
    related_trip_id UUID REFERENCES trips(trip_id),
    
    -- Status tracking
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_by_user_id UUID REFERENCES users(user_id),
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- EXPENSE_RECEIPTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS expense_receipts (
    receipt_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID NOT NULL REFERENCES expenses(expense_id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    uploaded_by_user_id UUID NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- USER_REQUESTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS user_requests (
    request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    requested_by_user_id UUID NOT NULL REFERENCES users(user_id),
    request_type VARCHAR(50) NOT NULL, -- 'profile_update', 'personal_info', etc.
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    requested_changes JSONB NOT NULL,
    approval_notes TEXT,
    rejection_reason TEXT,
    approved_by_user_id UUID REFERENCES users(user_id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_vehicle_id ON trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_start_time ON trips(start_time);
CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_vehicle_id ON reservations(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status_id ON reservations(status_id);
CREATE INDEX IF NOT EXISTS idx_reservations_start_time ON reservations(start_time);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_expenses_vehicle_id ON expenses(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_pois_location ON pois(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE pois ENABLE ROW LEVEL SECURITY;
ALTER TABLE standard_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_requests ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can see their own data)
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own trips" ON trips FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create own trips" ON trips FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own trips" ON trips FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own reservations" ON reservations FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create own reservations" ON reservations FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own expenses" ON expenses FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create own expenses" ON expenses FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own reminders" ON reminders FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create own reminders" ON reminders FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Public read policies for reference data
CREATE POLICY "Anyone can view vehicle types" ON vehicle_types FOR SELECT USING (true);
CREATE POLICY "Anyone can view fuel types" ON fuel_types FOR SELECT USING (true);
CREATE POLICY "Anyone can view trip types" ON trip_types FOR SELECT USING (true);
CREATE POLICY "Anyone can view trip purposes" ON trip_purposes FOR SELECT USING (true);
CREATE POLICY "Anyone can view expense categories" ON expense_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view reservation status" ON reservation_status FOR SELECT USING (true);
CREATE POLICY "Anyone can view vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Anyone can view pois" ON pois FOR SELECT USING (true);
CREATE POLICY "Anyone can view standard routes" ON standard_routes FOR SELECT USING (true);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Vehicle policies
DROP POLICY IF EXISTS "Anyone can view vehicles" ON vehicles;
CREATE POLICY "Anyone can view vehicles" ON vehicles
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update vehicles" ON vehicles;
CREATE POLICY "Users can update vehicles" ON vehicles
FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can insert vehicles" ON vehicles;
CREATE POLICY "Users can insert vehicles" ON vehicles
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete vehicles" ON vehicles;
CREATE POLICY "Users can delete vehicles" ON vehicles
FOR DELETE USING (true);

-- Trip policies
DROP POLICY IF EXISTS "Users can view all trips" ON trips;
CREATE POLICY "Users can view all trips" ON trips
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert trips" ON trips;
CREATE POLICY "Users can insert trips" ON trips
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update trips" ON trips;
CREATE POLICY "Users can update trips" ON trips
FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete trips" ON trips;
CREATE POLICY "Users can delete trips" ON trips
FOR DELETE USING (true);

-- Reservation policies
DROP POLICY IF EXISTS "Users can view all reservations" ON reservations;
CREATE POLICY "Users can view all reservations" ON reservations
FOR SELECT USING (true);

CREATE POLICY "Users can insert reservations" ON reservations
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update reservations" ON reservations
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Users can delete reservations" ON reservations
FOR DELETE USING (true);

-- Expense policies
CREATE POLICY "Users can view all expenses" ON expenses
FOR SELECT USING (true);

CREATE POLICY "Users can insert expenses" ON expenses
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update expenses" ON expenses
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Users can delete expenses" ON expenses
FOR DELETE USING (true);

-- Reminder policies
CREATE POLICY "Users can view all reminders" ON reminders
FOR SELECT USING (true);

CREATE POLICY "Users can insert reminders" ON reminders
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update reminders" ON reminders
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Users can delete reminders" ON reminders
FOR DELETE USING (true);

-- User policies
CREATE POLICY "Users can view all users" ON users
FOR SELECT USING (true);

CREATE POLICY "Users can update users" ON users
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Users can insert users" ON users
FOR INSERT WITH CHECK (true);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update the `updated_at` column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create a user profile when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    user_id,
    email,
    username,
    first_name,
    last_name,
    password_hash
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', new.email),
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    'PASSWORD_MANAGED_BY_AUTH'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attaching the trigger to the auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Attaching update triggers to all relevant tables
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pois_updated_at BEFORE UPDATE ON pois FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_standard_routes_updated_at BEFORE UPDATE ON standard_routes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON reminders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_logs_updated_at BEFORE UPDATE ON system_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SEED DATA
-- =============================================

-- Insert default company
INSERT INTO companies (company_id, name, address, contact_email, contact_phone, subscription_plan)
VALUES (
  '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe',
  'Fleet Flow',
  'Podgorica, Montenegro',
  'info@fleetflow.me',
  '+382 20 123 456',
  'premium'
) ON CONFLICT (company_id) DO NOTHING;

-- Insert default departments
INSERT INTO departments (department_id, company_id, name) VALUES
  ('11111111-1111-1111-1111-111111111111', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', 'General'),
  ('22222222-2222-2222-2222-222222222222', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', 'Fleet Management'),
  ('33333333-3333-3333-3333-333333333333', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', 'Operations')
ON CONFLICT (department_id) DO NOTHING;

-- Insert default roles
INSERT INTO roles (role_id, role_name, description) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin', 'System Administrator'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'fleet_manager', 'Fleet Manager'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'driver', 'Driver'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'employee', 'Regular Employee')
ON CONFLICT (role_id) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (permission_id, permission_name, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'dashboard:admin', 'Access admin dashboard'),
  ('22222222-2222-2222-2222-222222222222', 'dashboard:fleet_manager', 'Access fleet manager dashboard'),
  ('33333333-3333-3333-3333-333333333333', 'reservations:approve', 'Approve reservations'),
  ('44444444-4444-4444-4444-444444444444', 'reservations:manage', 'Manage all reservations'),
  ('55555555-5555-5555-5555-555555555555', 'vehicles:manage', 'Manage vehicles'),
  ('66666666-6666-6666-6666-666666666666', 'trips:view_all', 'View all trips'),
  ('77777777-7777-7777-7777-777777777777', 'expenses:approve', 'Approve expenses'),
  ('88888888-8888-8888-8888-888888888888', 'users:manage', 'Manage users')
ON CONFLICT (permission_id) DO NOTHING;

-- Insert role-permission mappings
INSERT INTO role_permissions (role_id, permission_id) VALUES
  -- Admin permissions
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '77777777-7777-7777-7777-777777777777'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '88888888-8888-8888-8888-888888888888'),
  -- Fleet manager permissions
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '66666666-6666-6666-6666-666666666666'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '77777777-7777-7777-7777-777777777777')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Insert fuel types
INSERT INTO fuel_types (fuel_type_id, name, unit, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Diesel', 'liters', 'Diesel fuel'),
  ('22222222-2222-2222-2222-222222222222', 'Gasoline', 'liters', 'Gasoline fuel'),
  ('33333333-3333-3333-3333-333333333333', 'Electric', 'kWh', 'Electric energy'),
  ('44444444-4444-4444-4444-444444444444', 'Hybrid', 'liters', 'Hybrid fuel system')
ON CONFLICT (fuel_type_id) DO NOTHING;

-- Insert vehicle types
INSERT INTO vehicle_types (vehicle_type_id, name, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Car', 'Passenger car'),
  ('22222222-2222-2222-2222-222222222222', 'Van', 'Cargo van'),
  ('33333333-3333-3333-3333-333333333333', 'Truck', 'Heavy truck'),
  ('44444444-4444-4444-4444-444444444444', 'Motorcycle', 'Motorcycle'),
  ('55555555-5555-5555-5555-555555555555', 'Bus', 'Passenger bus')
ON CONFLICT (vehicle_type_id) DO NOTHING;

-- Insert vehicle status
INSERT INTO vehicle_status (vehicle_status_id, name, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Available', 'Vehicle is available for use'),
  ('22222222-2222-2222-2222-222222222222', 'In Use', 'Vehicle is currently in use'),
  ('33333333-3333-3333-3333-333333333333', 'Maintenance', 'Vehicle is under maintenance'),
  ('44444444-4444-4444-4444-444444444444', 'Out of Service', 'Vehicle is out of service')
ON CONFLICT (vehicle_status_id) DO NOTHING;

-- Insert sample vehicles
INSERT INTO vehicles (vehicle_id, company_id, vehicle_type_id, vehicle_status_id, make, model, year, license_plate, fuel_type_id) VALUES
  ('11111111-1111-1111-1111-111111111111', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Citroen', 'Jumper', 2020, 'PG123AB', '11111111-1111-1111-1111-111111111111'),
  ('959729d5-180d-4f7a-8107-351d783e8f39', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Citroen', 'Jumper', 2021, 'PG456CD', '11111111-1111-1111-1111-111111111111'),
  ('65a3765a-9578-4ae1-aca8-2d1da0a65b92', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Iveco', 'Eurocargo', 2019, 'PGKR258', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (vehicle_id) DO NOTHING;

-- Insert trip types
INSERT INTO trip_types (trip_type_id, name, description, is_billable) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Business', 'Business trip', true),
  ('22222222-2222-2222-2222-222222222222', 'Personal', 'Personal trip', false),
  ('33333333-3333-3333-3333-333333333333', 'Maintenance', 'Vehicle maintenance', false),
  ('44444444-4444-4444-4444-444444444444', 'Emergency', 'Emergency trip', true)
ON CONFLICT (trip_type_id) DO NOTHING;

-- Insert trip purposes
INSERT INTO trip_purposes (trip_purpose_id, name, description, category) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Site Visit', 'Visit to client site', 'business'),
  ('22222222-2222-2222-2222-222222222222', 'Delivery', 'Package delivery', 'business'),
  ('33333333-3333-3333-3333-333333333333', 'Meeting', 'Business meeting', 'business'),
  ('44444444-4444-4444-4444-444444444444', 'Training', 'Employee training', 'business'),
  ('55555555-5555-5555-5555-555555555555', 'Other', 'Other purpose', 'general')
ON CONFLICT (trip_purpose_id) DO NOTHING;

-- Insert reservation status
INSERT INTO reservation_status (reservation_status_id, status_name, description) VALUES
  ('c9171953-bd5f-49bd-b85f-15e4e9ce7bb1', 'PENDING_APPROVAL', 'Waiting for approval'),
  ('545ad731-755f-42ed-b896-f383fdf48b51', 'APPROVED', 'Reservation approved'),
  ('33333333-3333-3333-3333-333333333333', 'REJECTED', 'Reservation rejected'),
  ('44444444-4444-4444-4444-444444444444', 'CANCELLED', 'Reservation cancelled'),
  ('55555555-5555-5555-5555-555555555555', 'COMPLETED', 'Reservation completed')
ON CONFLICT (reservation_status_id) DO NOTHING;

-- Insert expense categories
INSERT INTO expense_categories (expense_category_id, name, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Fuel', 'Fuel expenses'),
  ('22222222-2222-2222-2222-222222222222', 'Maintenance', 'Vehicle maintenance'),
  ('33333333-3333-3333-3333-333333333333', 'Insurance', 'Insurance costs'),
  ('44444444-4444-4444-4444-444444444444', 'Parking', 'Parking fees'),
  ('55555555-5555-5555-5555-555555555555', 'Tolls', 'Highway tolls'),
  ('66666666-6666-6666-6666-666666666666', 'Other', 'Other expenses')
ON CONFLICT (expense_category_id) DO NOTHING;

-- Insert reminder types
INSERT INTO reminder_types (reminder_type_id, name, description, default_lead_time_days) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Insurance Renewal', 'Vehicle insurance renewal', 30),
  ('22222222-2222-2222-2222-222222222222', 'Registration Renewal', 'Vehicle registration renewal', 30),
  ('33333333-3333-3333-3333-333333333333', 'Service Due', 'Vehicle service due', 7),
  ('44444444-4444-4444-4444-444444444444', 'Inspection Due', 'Vehicle inspection due', 14)
ON CONFLICT (reminder_type_id) DO NOTHING;

-- Insert sample POIs
INSERT INTO pois (poi_id, company_id, name, address, latitude, longitude, category) VALUES
  ('11111111-1111-1111-1111-111111111111', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', 'H.Office', 'Dr Vukašina Markovića, Kruševac, Podgorica', 42.4307, 19.2478, 'office'),
  ('22222222-2222-2222-2222-222222222222', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', 'WH (Warehouse)', 'Manastirska, Podgorica', 42.4304, 19.2594, 'warehouse'),
  ('33333333-3333-3333-3333-333333333333', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', 'Studio Mouse', 'Studio Mouse, Podgorica', 42.4697, 19.3047, 'client')
ON CONFLICT (poi_id) DO NOTHING;

-- Insert sample standard routes
INSERT INTO standard_routes (route_id, company_id, name, start_poi_id, end_poi_id, predefined_distance_km, estimated_duration_min) VALUES
  ('11111111-1111-1111-1111-111111111111', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', 'Office to Warehouse', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 3.2, 15),
  ('22222222-2222-2222-2222-222222222222', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', 'Office to Studio Mouse', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 8.1, 44)
ON CONFLICT (route_id) DO NOTHING;

-- Note: Sample trips and user assignments will be created after auth.users are properly set up

-- =============================================
-- FINAL CHECKS AND CLEANUP
-- =============================================

-- Refresh materialized views if any exist
-- (None currently defined)

-- Update statistics
ANALYZE;

-- Migration completed successfully
SELECT 'Fleet Flow Next Gen - Complete Schema Migration completed successfully!' as status; 