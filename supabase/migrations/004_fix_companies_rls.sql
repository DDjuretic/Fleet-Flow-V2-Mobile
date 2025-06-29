-- =============================================
-- FIX COMPANIES RLS POLICIES
-- =============================================
-- Problem: Companies tabela ima RLS uključen ali nema policies
-- što blokira sve API pozive za company settings
-- Rešenje: Kreiranje proper RLS policies

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow authenticated users to read companies" ON companies;
DROP POLICY IF EXISTS "Allow authenticated users to update companies" ON companies;
DROP POLICY IF EXISTS "Allow users to read their company" ON companies;
DROP POLICY IF EXISTS "Allow users to update their company" ON companies;

-- Create RLS policies for companies table
-- Policy 1: Allow authenticated users to read companies
CREATE POLICY "Allow authenticated users to read companies" 
ON companies FOR SELECT 
TO authenticated 
USING (true);

-- Policy 2: Allow authenticated users to update their own company
CREATE POLICY "Allow users to update their company" 
ON companies FOR UPDATE 
TO authenticated 
USING (
  company_id IN (
    SELECT u.company_id 
    FROM users u 
    WHERE u.user_id = auth.uid()
  )
)
WITH CHECK (
  company_id IN (
    SELECT u.company_id 
    FROM users u 
    WHERE u.user_id = auth.uid()
  )
);

-- Policy 3: Allow authenticated users to insert companies (for admin)
CREATE POLICY "Allow authenticated users to insert companies" 
ON companies FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Policy 4: Allow service role full access
CREATE POLICY "Allow service role full access to companies" 
ON companies FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'companies'; 