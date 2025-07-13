-- Create the user_departments junction table
CREATE TABLE IF NOT EXISTS public.user_departments (
    user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES public.departments(department_id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, department_id)
);

-- Add comments for clarity
COMMENT ON TABLE public.user_departments IS 'Junction table to link users to one or more departments.';

-- Enable RLS for the new table
ALTER TABLE public.user_departments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_departments
DROP POLICY IF EXISTS "Allow users to view their own department assignments" ON public.user_departments;
CREATE POLICY "Allow users to view their own department assignments"
ON public.user_departments
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow admins to manage department assignments" ON public.user_departments;
CREATE POLICY "Allow admins to manage department assignments"
ON public.user_departments
FOR ALL
USING (check_user_has_role(auth.uid(), 'admin'))
WITH CHECK (check_user_has_role(auth.uid(), 'admin'));
