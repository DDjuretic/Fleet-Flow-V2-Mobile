-- First, drop the existing trigger and function to avoid any conflicts.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a new, more robust function.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert essential data, and provide default empty strings for names
  -- to avoid any potential issues with NULL values, even in nullable columns.
  INSERT INTO public.users (user_id, email, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''), -- Use metadata if present, otherwise empty string
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')   -- Use metadata if present, otherwise empty string
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger to use the new, robust function.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add a log to confirm the migration ran.
COMMENT ON FUNCTION public.handle_new_user() IS 'Robust version - inserts user_id, email, and defaults names to empty strings.'; 