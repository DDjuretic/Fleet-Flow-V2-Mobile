CREATE OR REPLACE FUNCTION update_user_profile_with_department(
  p_user_id UUID,
  p_updates JSONB,
  p_department_id UUID
)
RETURNS SETOF public.users AS $$
BEGIN
  -- Update the users table
  UPDATE public.users
  SET
    first_name = p_updates->>'first_name',
    last_name = p_updates->>'last_name',
    phone_number = p_updates->>'phone_number',
    -- Add all other updatable fields from your app
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Handle department assignment
  IF p_department_id IS NOT NULL THEN
    -- First, remove existing assignments for the user
    DELETE FROM public.user_departments WHERE user_id = p_user_id;
    -- Then, insert the new one
    INSERT INTO public.user_departments(user_id, department_id)
    VALUES (p_user_id, p_department_id);
  END IF;
  
  -- Return the updated user record
  RETURN QUERY SELECT * FROM public.users WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
