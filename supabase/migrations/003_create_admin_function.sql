-- =============================================
-- ADMIN USER CREATION FUNCTION
-- =============================================
-- Problem: Kreiranje admin naloga direktno u auth.users tabeli
-- dovodi do "Database error querying schema" greške
-- Rešenje: Funkcija koja koristi Auth API pristup

CREATE OR REPLACE FUNCTION create_admin_user_safe(
    admin_email TEXT,
    admin_password TEXT,
    admin_first_name TEXT DEFAULT 'Admin',
    admin_last_name TEXT DEFAULT 'User'
)
RETURNS JSON AS $$
DECLARE
    new_user_id UUID;
    company_uuid UUID;
    admin_role_id UUID;
    result_json JSON;
BEGIN
    -- Check if user already exists in auth.users
    SELECT id INTO new_user_id 
    FROM auth.users 
    WHERE email = admin_email;
    
    IF new_user_id IS NOT NULL THEN
        -- User already exists, just ensure proper setup
        RAISE NOTICE 'User % already exists with ID %', admin_email, new_user_id;
    ELSE
        -- User doesn't exist, we need to create via Auth API
        -- This function should be called AFTER creating user via Auth API
        RAISE EXCEPTION 'User % must be created via Auth API first. Use: curl -X POST "http://127.0.0.1:54321/auth/v1/signup" -H "Content-Type: application/json" -H "apikey: YOUR_ANON_KEY" -d ''{"email": "%", "password": "%"}''', admin_email, admin_email, admin_password;
    END IF;
    
    -- Get default company
    SELECT company_id INTO company_uuid FROM companies LIMIT 1;
    
    -- Get admin role
    SELECT role_id INTO admin_role_id FROM roles WHERE role_name = 'admin' LIMIT 1;
    
    -- Create company if missing
    IF company_uuid IS NULL THEN
        INSERT INTO companies (
            company_id, name, address, contact_email, contact_phone, 
            subscription_plan, city, country, industry, founded_year, employee_count
        ) VALUES (
            gen_random_uuid(), 'Fleet Flow Demo', '4 jula 109/86', 
            'info@fleetflow.com', '+382 67 503 345', 'Premium', 
            'Podgorica', 'Montenegro', 'Fleet Management', '2024', '50'
        ) RETURNING company_id INTO company_uuid;
    END IF;
    
    -- Create admin role if missing
    IF admin_role_id IS NULL THEN
        INSERT INTO roles (role_id, role_name, description)
        VALUES (gen_random_uuid(), 'admin', 'Administrator role')
        RETURNING role_id INTO admin_role_id;
    END IF;
    
    -- Update or create public.users record
    INSERT INTO users (
        user_id, company_id, username, email, password_hash,
        first_name, last_name, phone_number, is_active, 
        is_email_verified, created_at, updated_at
    ) VALUES (
        new_user_id,
        company_uuid,
        REPLACE(admin_email, '@', '.'),
        admin_email,
        'auth_managed',
        admin_first_name,
        admin_last_name,
        '+382 67 503 345',
        true,
        true,
        NOW(),
        NOW()
    ) ON CONFLICT (user_id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        company_id = EXCLUDED.company_id,
        is_active = true,
        updated_at = NOW();
    
    -- Assign admin role
    INSERT INTO user_roles (user_id, role_id, assigned_at)
    VALUES (new_user_id, admin_role_id, NOW())
    ON CONFLICT (user_id, role_id) DO NOTHING;
    
    -- Build result JSON
    SELECT json_build_object(
        'success', true,
        'user_id', new_user_id,
        'email', admin_email,
        'first_name', admin_first_name,
        'last_name', admin_last_name,
        'company_id', company_uuid,
        'admin_role_id', admin_role_id,
        'message', 'Admin user setup completed successfully'
    ) INTO result_json;
    
    RETURN result_json;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM,
            'message', 'Failed to setup admin user'
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete admin setup for existing auth user
CREATE OR REPLACE FUNCTION complete_admin_setup(admin_email TEXT)
RETURNS JSON AS $$
DECLARE
    auth_user_id UUID;
    result_json JSON;
BEGIN
    -- Get auth user ID
    SELECT id INTO auth_user_id 
    FROM auth.users 
    WHERE email = admin_email;
    
    IF auth_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'message', 'User not found in auth.users. Create via Auth API first.'
        );
    END IF;
    
    -- Call the main function
    SELECT create_admin_user_safe(admin_email, 'password123', 'Danko', 'Đuretić') 
    INTO result_json;
    
    RETURN result_json;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Complete setup for current admin user
SELECT complete_admin_setup('djuretic.danko@gmail.com');

-- Function to check admin status
CREATE OR REPLACE FUNCTION check_admin_user_status(admin_email TEXT)
RETURNS JSON AS $$
DECLARE
    result_json JSON;
BEGIN
    SELECT json_build_object(
        'auth_exists', (SELECT id FROM auth.users WHERE email = admin_email) IS NOT NULL,
        'public_exists', (SELECT users.user_id FROM users WHERE users.email = admin_email) IS NOT NULL,
        'has_admin_role', EXISTS(
            SELECT 1 FROM users u
            JOIN user_roles ur ON u.user_id = ur.user_id
            JOIN roles r ON ur.role_id = r.role_id
            WHERE u.email = admin_email AND r.role_name = 'admin'
        ),
        'user_id', (SELECT users.user_id FROM users WHERE users.email = admin_email),
        'first_name', (SELECT users.first_name FROM users WHERE users.email = admin_email),
        'last_name', (SELECT users.last_name FROM users WHERE users.email = admin_email),
        'company_name', (SELECT c.name FROM users JOIN companies c ON users.company_id = c.company_id WHERE users.email = admin_email)
    ) INTO result_json;
    
    RETURN result_json;
END;
$$ LANGUAGE plpgsql;

-- Check current status
SELECT check_admin_user_status('djuretic.danko@gmail.com');

-- Create documentation comment
COMMENT ON FUNCTION create_admin_user_safe IS 'Safely creates admin user after Auth API signup. Prevents "Database error querying schema" by not creating auth.users directly.';
COMMENT ON FUNCTION complete_admin_setup IS 'Completes admin setup for existing auth user created via Auth API.';
COMMENT ON FUNCTION check_admin_user_status IS 'Checks complete admin user status across auth.users, public.users and roles.'; 