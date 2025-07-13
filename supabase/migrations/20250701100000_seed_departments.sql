-- Seed basic departments
-- Note: In a real multi-tenant app, these would be created per company,
-- but for seeding/testing purposes, we can add some defaults.
-- The RLS policies should prevent companies from seeing each other's departments.

INSERT INTO departments (department_id, company_id, name, description) VALUES
('d0000001-0000-4000-8000-000000000001', (SELECT company_id FROM companies LIMIT 1), 'Management', 'General Management and Administration'),
('d0000001-0000-4000-8000-000000000002', (SELECT company_id FROM companies LIMIT 1), 'Logistics', 'Vehicle and Trip Logistics'),
('d0000001-0000-4000-8000-000000000003', (SELECT company_id FROM companies LIMIT 1), 'IT Support', 'Technical and IT Support'); 