-- Helper function to check user roles
CREATE OR REPLACE FUNCTION check_user_has_role(p_user_id UUID, p_role_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  has_role BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.role_id
    WHERE ur.user_id = p_user_id AND r.role_name = p_role_name
  ) INTO has_role;
  RETURN has_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS for the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts, if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read their own data" ON public.users;
DROP POLICY IF EXISTS "Allow users to update their own data" ON public.users;
DROP POLICY IF EXISTS "Allow admins to manage all users" ON public.users;

-- Policy: Allow authenticated users to read their own data
CREATE POLICY "Allow authenticated users to read their own data"
ON public.users
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Allow users to update their own data
CREATE POLICY "Allow users to update their own data"
ON public.users
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Allow administrators to perform any action on users table
CREATE POLICY "Allow admins to manage all users"
ON public.users
FOR ALL
USING (
  check_user_has_role(auth.uid(), 'admin')
)
WITH CHECK (
  check_user_has_role(auth.uid(), 'admin')
);
