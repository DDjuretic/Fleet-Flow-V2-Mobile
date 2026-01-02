
-- Create new table for travel_orders
CREATE TABLE IF NOT EXISTS public.travel_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(company_id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'pending_approval'
  purpose TEXT,
  notes TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  total_distance_km DECIMAL(10,2) DEFAULT 0,
  base_cost DECIMAL(10,2) DEFAULT 0,            -- Sum of individual trip costs
  calculated_total_cost DECIMAL(10,2) DEFAULT 0, -- Final travel order cost
  cost_calculation_rules_snapshot JSONB, -- Snapshot of rules used for calculation (for audit)
  cost_breakdown JSONB,                  -- Detailed cost breakdown (for analytics)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies for travel_orders (example, will need full policies)
ALTER TABLE public.travel_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own travel orders" ON public.travel_orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own travel orders" ON public.travel_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own travel orders" ON public.travel_orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Modify existing trips table
ALTER TABLE public.trips
ADD COLUMN travel_order_id UUID REFERENCES public.travel_orders(id) ON DELETE SET NULL, -- Link to Travel Order
ADD COLUMN path JSONB,                                -- Array of GPS coordinates [{latitude, longitude, timestamp}]
ADD COLUMN individual_cost DECIMAL(10,2),              -- Cost of individual trip (primarily fuel)
ADD COLUMN pause_details JSONB,                        -- Details about detected pauses during the trip
ADD COLUMN vehicle_type VARCHAR(50),                   -- Vehicle type (automobile, motor, scooter, truck, van)
ADD COLUMN fuel_cost_params_snapshot JSONB;            -- Snapshot of fuel parameters used for trip calculation

-- Add RLS policies for trips (example, will need full policies)
-- Assuming existing RLS for trips will need to be adapted to include travel_order_id in checks if applicable
-- For now, ensure existing policies are not broken by the new column or adapt if needed for multi-tenancy.
-- Example of adapting:
-- DROP POLICY IF EXISTS "Users can view their own trips" ON public.trips;
-- CREATE POLICY "Users can view their own trips" ON public.trips
--   FOR SELECT USING (auth.uid() = user_id);

-- Modify profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS average_consumption DECIMAL(10,2) DEFAULT 8.0, -- Default fuel consumption (L/100km)
ADD COLUMN IF NOT EXISTS fuel_price DECIMAL(10,2) DEFAULT 1.50;        -- Default fuel price (€/L)

-- Add current_mileage to vehicles table
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS current_mileage DECIMAL(15,2);

-- Add RLS policies for profiles (example, will need full policies)
-- Assuming existing RLS for profiles will need to be adapted to include the new columns.
-- CREATE POLICY "Users can update their own profile" ON public.profiles
--   FOR UPDATE USING (auth.uid() = id); -- Assuming id in profiles is user_id

-- Create new table for vehicle_cost_rules
CREATE TABLE IF NOT EXISTS public.vehicle_cost_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(company_id) ON DELETE CASCADE,
  vehicle_type VARCHAR(50) NOT NULL,                    -- 'automobile', 'motor', 'scooter', 'truck', 'van'
  ownership_type VARCHAR(20) DEFAULT 'company',         -- 'company', 'private'
  department_id UUID REFERENCES public.departments(department_id), -- For departmental rules
  has_fixed_limit BOOLEAN DEFAULT false,                -- Does it have a fixed distance limit
  fixed_limit_km DECIMAL(8,2) DEFAULT 0,                -- Fixed distance limit in km (e.g., 23km)
  fixed_cost DECIMAL(8,2) DEFAULT 0,                    -- Fixed cost for short distances
  amortization_rate DECIMAL(5,4) DEFAULT 0.10,          -- Amortization rate (e.g., 0.10 for 10%)
  time_based_multipliers JSONB,                         -- Factors based on time of day/working hours
  distance_brackets JSONB,                              -- Rules for different distances (e.g., by zones)
  priority INTEGER DEFAULT 100,                         -- Rule application priority
  active_from TIMESTAMPTZ DEFAULT NOW(),
  active_to TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies for vehicle_cost_rules (example, will need full policies)
ALTER TABLE public.vehicle_cost_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company admins can manage vehicle cost rules" ON public.vehicle_cost_rules
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.company_id = company_id AND profiles.role = 'admin'));

-- Create new table for fuel_purchases
CREATE TABLE IF NOT EXISTS public.fuel_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(vehicle_id) ON DELETE CASCADE,
  purchase_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fuel_station TEXT,                                    -- Fuel station location (geocoded)
  fuel_type_id UUID NOT NULL REFERENCES public.fuel_types(fuel_type_id),
  quantity_liters DECIMAL(8,2) NOT NULL CHECK (quantity_liters > 0),
  price_per_liter DECIMAL(8,2) NOT NULL CHECK (price_per_liter > 0),
  total_cost DECIMAL(10,2) NOT NULL CHECK (total_cost > 0),
  receipt_number TEXT,
  receipt_photo TEXT,                                   -- URL to stored receipt
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies for fuel_purchases (example, will need full policies)
ALTER TABLE public.fuel_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own fuel purchases" ON public.fuel_purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fuel purchases" ON public.fuel_purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fuel purchases" ON public.fuel_purchases
  FOR UPDATE USING (auth.uid() = user_id);

-- Create new table for fuel_usage
CREATE TABLE IF NOT EXISTS public.fuel_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(trip_id) ON DELETE CASCADE,
  fuel_consumed_liters DECIMAL(8,2) NOT NULL CHECK (fuel_consumed_liters > 0),
  distance_km DECIMAL(8,2) NOT NULL CHECK (distance_km > 0),
  consumption_per_100km DECIMAL(8,2) GENERATED ALWAYS AS ((fuel_consumed_liters / distance_km) * 100) STORED,
  usage_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies for fuel_usage (example, will need full policies)
ALTER TABLE public.fuel_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own fuel usage" ON public.fuel_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fuel usage" ON public.fuel_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create new view for fuel_balance
CREATE OR REPLACE VIEW public.fuel_balance AS
SELECT
  users.user_id,
  COALESCE(SUM(purchases.total_liters), 0) - COALESCE(SUM(usage.total_consumed), 0) AS current_balance_liters,
  COALESCE(SUM(purchases.total_cost), 0) AS total_spent,
  COALESCE(SUM(usage.total_consumed), 0) AS total_consumed_liters,
  COALESCE(AVG(usage.avg_consumption), 0) AS average_consumption_per_100km
FROM (
  SELECT DISTINCT user_id FROM public.fuel_purchases 
  UNION 
  SELECT DISTINCT user_id FROM public.fuel_usage
) users
LEFT JOIN (
  SELECT 
    user_id, 
    SUM(quantity_liters) AS total_liters,
    SUM(total_cost) AS total_cost
  FROM public.fuel_purchases 
  GROUP BY user_id
) purchases ON users.user_id = purchases.user_id
LEFT JOIN (
  SELECT 
    user_id, 
    SUM(fuel_consumed_liters) AS total_consumed,
    AVG(consumption_per_100km) AS avg_consumption
  FROM public.fuel_usage 
  GROUP BY user_id
) usage ON users.user_id = usage.user_id
GROUP BY users.user_id;

-- Add RLS policies for fuel_balance (example, will need full policies)
-- ALTER VIEW public.fuel_balance ENABLE ROW LEVEL SECURITY -- RLS not supported for views;

-- CREATE POLICY "Users can view their own fuel balance" ON public.fuel_balance
--   FOR SELECT USING (auth.uid() = user_id) -- RLS not supported for views;


-- Create new function calculate_trip_fuel_usage
CREATE OR REPLACE FUNCTION public.calculate_trip_fuel_usage()
RETURNS TRIGGER AS $$
DECLARE
  user_avg_consumption DECIMAL(8,2);
  fuel_consumed DECIMAL(8,2);
BEGIN
  -- Get user's average consumption from profiles table
  SELECT average_consumption INTO user_avg_consumption
  FROM public.profiles 
  WHERE user_id = NEW.user_id;
  
  -- Default to 8.0 l/100km if no setting found
  IF user_avg_consumption IS NULL THEN
    user_avg_consumption := 8.0; -- Default value for calculation
  END IF;
  
  -- Calculate fuel consumption: (distance * consumption) / 100
  fuel_consumed := (NEW.distance_km * user_avg_consumption) / 100.0;
  
  -- Only insert if we have valid distance and the trip is completed
  IF NEW.distance_km > 0 AND NEW.end_time IS NOT NULL THEN
    INSERT INTO public.fuel_usage (
      user_id,
      trip_id, 
      fuel_consumed_liters,
      distance_km,
      usage_date
    ) VALUES (
      NEW.user_id,
      NEW.trip_id,
      fuel_consumed,
      NEW.distance_km,
      NEW.end_time
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically calculate fuel usage for completed trips
DROP TRIGGER IF EXISTS trip_fuel_usage_trigger ON public.trips;
CREATE TRIGGER trip_fuel_usage_trigger
  AFTER INSERT OR UPDATE ON public.trips
  FOR EACH ROW
  WHEN (NEW.end_time IS NOT NULL AND NEW.distance_km IS NOT NULL AND NEW.distance_km > 0)
  EXECUTE FUNCTION public.calculate_trip_fuel_usage();
