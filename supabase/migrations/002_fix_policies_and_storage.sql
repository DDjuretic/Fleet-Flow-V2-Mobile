-- Fix RLS policies and add storage bucket
-- =============================================
-- STORAGE SETUP
-- =============================================

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Note: RLS on storage.objects is handled by Supabase automatically in newer versions
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage policies for avatars
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Anyone can upload an avatar" ON storage.objects;
CREATE POLICY "Anyone can upload an avatar" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Anyone can update own avatar" ON storage.objects;
CREATE POLICY "Anyone can update own avatar" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars');

-- =============================================
-- ADD MISSING COLUMNS
-- =============================================

-- Add route_details_json column to trips table
ALTER TABLE trips ADD COLUMN IF NOT EXISTS route_details_json JSONB;

-- Add module column to permissions table
ALTER TABLE permissions ADD COLUMN IF NOT EXISTS module VARCHAR(100);

-- Update existing permissions with module values
UPDATE permissions SET module = 'dashboard' WHERE permission_name LIKE 'dashboard:%';
UPDATE permissions SET module = 'reservations' WHERE permission_name LIKE 'reservations:%';
UPDATE permissions SET module = 'vehicles' WHERE permission_name LIKE 'vehicles:%';
UPDATE permissions SET module = 'trips' WHERE permission_name LIKE 'trips:%';
UPDATE permissions SET module = 'expenses' WHERE permission_name LIKE 'expenses:%';
UPDATE permissions SET module = 'users' WHERE permission_name LIKE 'users:%';

-- =============================================
-- FIX RLS POLICIES
-- =============================================

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

DROP POLICY IF EXISTS "Users can insert reservations" ON reservations;
CREATE POLICY "Users can insert reservations" ON reservations
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update reservations" ON reservations;
CREATE POLICY "Users can update reservations" ON reservations
FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete reservations" ON reservations;
CREATE POLICY "Users can delete reservations" ON reservations
FOR DELETE USING (true);

-- Expense policies
DROP POLICY IF EXISTS "Users can view all expenses" ON expenses;
CREATE POLICY "Users can view all expenses" ON expenses
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert expenses" ON expenses;
CREATE POLICY "Users can insert expenses" ON expenses
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update expenses" ON expenses;
CREATE POLICY "Users can update expenses" ON expenses
FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete expenses" ON expenses;
CREATE POLICY "Users can delete expenses" ON expenses
FOR DELETE USING (true);

-- Reminder policies
DROP POLICY IF EXISTS "Users can view all reminders" ON reminders;
CREATE POLICY "Users can view all reminders" ON reminders
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert reminders" ON reminders;
CREATE POLICY "Users can insert reminders" ON reminders
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update reminders" ON reminders;
CREATE POLICY "Users can update reminders" ON reminders
FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete reminders" ON reminders;
CREATE POLICY "Users can delete reminders" ON reminders
FOR DELETE USING (true);

-- User policies
DROP POLICY IF EXISTS "Users can view all users" ON users;
CREATE POLICY "Users can view all users" ON users
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update users" ON users;
CREATE POLICY "Users can update users" ON users
FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can insert users" ON users;
CREATE POLICY "Users can insert users" ON users
FOR INSERT WITH CHECK (true); 