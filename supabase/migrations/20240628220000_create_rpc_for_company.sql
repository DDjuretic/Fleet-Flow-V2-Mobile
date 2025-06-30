-- Create an RPC function to handle company creation and admin assignment
CREATE OR REPLACE FUNCTION create_company_and_assign_admin(company_name TEXT)
RETURNS UUID AS $$
DECLARE
  new_company_id UUID;
  admin_role_id UUID;
  requesting_user_id UUID;
BEGIN
  -- Get the ID of the user calling this function
  requesting_user_id := auth.uid();

  -- The `handle_new_user` trigger is expected to have already created a user
  -- in `public.users`. This function will now only handle the company logic.

  -- 1. Create a new company
  INSERT INTO public.companies (name)
  VALUES (company_name)
  RETURNING company_id INTO new_company_id;

  -- 2. Update the user's profile with the new company_id
  UPDATE public.users
  SET company_id = new_company_id
  WHERE user_id = requesting_user_id;

  -- Verify that the user existed and was updated. If not, the trigger failed.
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found in public.users for ID %. The handle_new_user trigger may have failed.', requesting_user_id;
  END IF;

  -- 3. Find the 'admin' role_id
  SELECT r.role_id INTO admin_role_id
  FROM public.roles r
  WHERE r.role_name = 'admin';

  -- If admin role doesn't exist for some reason, raise an error
  IF admin_role_id IS NULL THEN
    RAISE EXCEPTION 'Admin role not found';
  END IF;

  -- 4. Assign the 'admin' role to the user
  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (requesting_user_id, admin_role_id);

  RETURN requesting_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;