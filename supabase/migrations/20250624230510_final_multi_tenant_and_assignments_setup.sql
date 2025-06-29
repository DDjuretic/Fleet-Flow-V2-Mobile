-- =============================================
-- FINAL MULTI-TENANT & ASSIGNMENTS SETUP
-- =============================================
-- Description: This single migration handles the complete setup for
-- a multi-tenant architecture and fixes the missing vehicle_assignments table.

-- =============================================
-- 1. SUBSCRIPTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_name VARCHAR(100) NOT NULL UNIQUE,
    max_users INT NOT NULL DEFAULT 1,
    max_vehicles INT NOT NULL DEFAULT 1,
    price_monthly DECIMAL(10, 2) DEFAULT 0.00,
    price_annual DECIMAL(10, 2) DEFAULT 0.00,
    features JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. VEHICLE_ASSIGNMENTS TABLE
-- =============================================
-- This table was missing from the main schema and is created here.
CREATE TABLE IF NOT EXISTS vehicle_assignments (
    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    assignment_type VARCHAR(50),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 3. MODIFY COMPANIES TABLE
-- =============================================
ALTER TABLE companies
    ADD COLUMN IF NOT EXISTS subscription_id UUID REFERENCES subscriptions(subscription_id),
    ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    DROP COLUMN IF EXISTS subscription_plan;

-- =============================================
-- 4. ENSURE company_id IN ALL RELEVANT TABLES
-- =============================================
ALTER TABLE trips ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE;
ALTER TABLE reminders ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE;
ALTER TABLE pois ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE;
ALTER TABLE standard_routes ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE;
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE;

-- =============================================
-- 5. SEED INITIAL SUBSCRIPTION PLANS
-- =============================================
INSERT INTO subscriptions (plan_name, max_users, max_vehicles, price_monthly, price_annual, features)
VALUES
    ('Free', 1, 1, 0.00, 0.00, '["BASIC_REPORTS"]'),
    ('Basic', 10, 10, 49.00, 499.00, '["BASIC_REPORTS", "ROUTE_OPTIMIZATION"]'),
    ('Pro', 50, 50, 199.00, 1999.00, '["ADVANCED_REPORTS", "ROUTE_OPTIMIZATION", "API_ACCESS"]'),
    ('Enterprise', 1000, 1000, 999.00, 9999.00, '["ALL_FEATURES", "DEDICATED_SUPPORT"]')
ON CONFLICT (plan_name) DO NOTHING;
