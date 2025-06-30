-- Seed basic roles
INSERT INTO roles (role_id, role_name, description) VALUES
('00000000-0000-4000-a000-000000000001', 'Administrator', 'Full system access'),
('00000000-0000-4000-a000-000000000002', 'Driver', 'Vehicle driver with basic access'),
('00000000-0000-4000-a000-000000000003', 'Manager', 'Fleet manager with moderate access'),
('00000000-0000-4000-a000-000000000004', 'User', 'Basic user with limited access'),
('00000000-0000-4000-a000-000000000005', 'Mechanic', 'Vehicle maintenance specialist');

-- Seed vehicle types
INSERT INTO vehicle_types (vehicle_type_id, name, description) VALUES
('00000000-0000-4000-b000-000000000001', 'Car', 'Standard passenger car'),
('00000000-0000-4000-b000-000000000002', 'Van', 'Cargo van or minivan'),
('00000000-0000-4000-b000-000000000003', 'Truck', 'Commercial truck'),
('00000000-0000-4000-b000-000000000004', 'Bus', 'Passenger bus'),
('00000000-0000-4000-b000-000000000005', 'Motorcycle', 'Two-wheeled vehicle'),
('00000000-0000-4000-b000-000000000006', 'Pickup', 'Pickup truck'),
('00000000-0000-4000-b000-000000000007', 'SUV', 'Sport utility vehicle');

-- Seed vehicle status
INSERT INTO vehicle_status (vehicle_status_id, name, description) VALUES
('00000000-0000-4000-c000-000000000001', 'Available', 'Vehicle is available for use'),
('00000000-0000-4000-c000-000000000002', 'In Use', 'Vehicle is currently in use'),
('00000000-0000-4000-c000-000000000003', 'Maintenance', 'Vehicle is under maintenance'),
('00000000-0000-4000-c000-000000000004', 'Repair', 'Vehicle needs repairs'),
('00000000-0000-4000-c000-000000000005', 'Reserved', 'Vehicle is reserved for future use'),
('00000000-0000-4000-c000-000000000006', 'Out of Service', 'Vehicle is not available for use');

-- Seed fuel types
INSERT INTO fuel_types (fuel_type_id, name, unit) VALUES
('00000000-0000-4000-d000-000000000001', 'Gasoline', 'liters'),
('00000000-0000-4000-d000-000000000002', 'Diesel', 'liters'),
('00000000-0000-4000-d000-000000000003', 'Electric', 'kWh'),
('00000000-0000-4000-d000-000000000004', 'LPG', 'liters'),
('00000000-0000-4000-d000-000000000005', 'CNG', 'kg');

-- Seed expense categories
INSERT INTO expense_categories (expense_category_id, name, description) VALUES
('00000000-0000-4000-e000-000000000001', 'Fuel', 'Fuel expenses'),
('00000000-0000-4000-e000-000000000002', 'Maintenance', 'Vehicle maintenance expenses'),
('00000000-0000-4000-e000-000000000003', 'Repair', 'Vehicle repair expenses'),
('00000000-0000-4000-e000-000000000004', 'Toll', 'Road toll expenses'),
('00000000-0000-4000-e000-000000000005', 'Parking', 'Parking expenses'),
('00000000-0000-4000-e000-000000000006', 'Insurance', 'Vehicle insurance expenses'),
('00000000-0000-4000-e000-000000000007', 'Other', 'Other vehicle-related expenses'); 