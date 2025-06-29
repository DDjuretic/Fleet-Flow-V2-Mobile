-- Drop existing, potentially incorrect policies on public.users
DROP POLICY IF EXISTS "Allow authenticated users to manage users" ON public.users;
DROP POLICY IF EXISTS "Allow public read-only access to users" ON public.users;
DROP POLICY IF EXISTS "Allow anon users to manage users" ON public.users;


-- POLICY: Enable read access for all authenticated users to their own user record
CREATE POLICY "Enable read access for authenticated users to their own data"
ON public.users FOR SELECT
USING (auth.uid() = user_id);

-- POLICY: Enable update access for users to their own user record
-- This is the key policy that allows users to edit their own profile.
CREATE POLICY "Enable update for users to their own data"
ON public.users FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Note: We are deliberately not creating an INSERT policy for public.users here.
-- The `handle_new_user` trigger is responsible for creating a new user record
-- in public.users when a new user signs up in auth.users. This is a security measure.

-- Note: We are deliberately not creating a DELETE policy.
-- Deleting users should be a protected admin action, not something a user can do to themselves. 