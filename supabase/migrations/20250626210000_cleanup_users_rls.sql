-- First, drop all existing policies on public.users to ensure a clean slate.
DROP POLICY IF EXISTS "Enable read access for authenticated users to their own data" ON public.users;
DROP POLICY IF EXISTS "Enable update for users to their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update users" ON public.users;
DROP POLICY IF EXISTS "Users can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;

-- POLICY: Enable every authenticated user to read their own user record.
CREATE POLICY "Enable read for users based on user_id"
ON public.users FOR SELECT
USING (auth.uid() = user_id);

-- POLICY: Enable users to update their own user record.
-- This is the key policy that allows users to edit their own profile.
CREATE POLICY "Enable update for users based on user_id"
ON public.users FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Note: INSERT is handled by the `handle_new_user` trigger.
-- Note: DELETE is a protected admin-only action. 