-- =====================================================
-- Fleet Flow Performance Optimization Migration
-- =====================================================
-- Kreiran: 2025-01-22
-- Svrha: Optimizacija performansi aplikacije kroz database indexe i optimizacije

-- =====================================================
-- SYSTEM LOGS FIX - Allow NULL user_id for system operations
-- =====================================================

-- Make user_id nullable for system logs
ALTER TABLE system_logs ALTER COLUMN user_id DROP NOT NULL;

-- =====================================================
-- PERFORMANCE INDEXES
-- =====================================================

-- Optimizacija za trips queries
CREATE INDEX IF NOT EXISTS idx_trips_user_status ON trips(user_id, status);
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON trips(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trips_start_time ON trips(start_time);

-- Optimizacija za expenses queries
CREATE INDEX IF NOT EXISTS idx_expenses_user_created ON expenses(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_vehicle_date ON expenses(vehicle_id, expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(expense_category_id);

-- Optimizacija za reservations queries
CREATE INDEX IF NOT EXISTS idx_reservations_user_time ON reservations(user_id, start_time);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status_id);
CREATE INDEX IF NOT EXISTS idx_reservations_vehicle ON reservations(vehicle_id);

-- Optimizacija za reminders queries
CREATE INDEX IF NOT EXISTS idx_reminders_user_due ON reminders(user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_reminders_completed ON reminders(is_completed, due_date);

-- Optimizacija za vehicles queries
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(vehicle_status_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles(vehicle_type_id);

-- Optimizacija za users queries
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_company ON users(company_id);

-- =====================================================
-- QUERY OPTIMIZATION VIEWS
-- =====================================================

-- Optimizovani view za pending reservations
CREATE OR REPLACE VIEW pending_reservations_optimized AS
SELECT 
    r.reservation_id,
    r.user_id,
    r.purpose,
    r.start_time,
    r.end_time,
    r.created_at,
    rs.status_name,
    u.first_name,
    u.last_name,
    v.make,
    v.model,
    v.license_plate
FROM reservations r
JOIN reservation_status rs ON r.status_id = rs.reservation_status_id
JOIN users u ON r.user_id = u.user_id
LEFT JOIN vehicles v ON r.vehicle_id = v.vehicle_id
WHERE rs.status_name = 'PENDING_APPROVAL'
ORDER BY r.created_at DESC;

-- Optimizovani view za active trips
CREATE OR REPLACE VIEW active_trips_optimized AS
SELECT 
    t.trip_id,
    t.user_id,
    t.purpose_description,
    t.start_location_address,
    t.end_location_address,
    t.start_time,
    t.status,
    t.created_at,
    u.first_name,
    u.last_name,
    v.make,
    v.model,
    v.license_plate
FROM trips t
JOIN users u ON t.user_id = u.user_id
LEFT JOIN vehicles v ON t.vehicle_id = v.vehicle_id
WHERE t.status IN ('PLANNED', 'IN_PROGRESS')
ORDER BY t.start_time DESC;

-- =====================================================
-- MATERIALIZED VIEWS FOR HEAVY QUERIES
-- =====================================================

-- Materialized view za user statistics (refresh manually kada treba)
CREATE MATERIALIZED VIEW IF NOT EXISTS user_stats_mv AS
SELECT 
    u.user_id,
    u.first_name,
    u.last_name,
    COUNT(DISTINCT t.trip_id) as total_trips,
    COUNT(DISTINCT e.expense_id) as total_expenses,
    COUNT(DISTINCT r.reservation_id) as total_reservations,
    COALESCE(SUM(e.amount), 0) as total_expense_amount,
    MAX(t.created_at) as last_trip_date
FROM users u
LEFT JOIN trips t ON u.user_id = t.user_id
LEFT JOIN expenses e ON u.user_id = e.user_id
LEFT JOIN reservations r ON u.user_id = r.user_id
WHERE u.is_active = true
GROUP BY u.user_id, u.first_name, u.last_name;

-- Index za materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_stats_mv_user_id ON user_stats_mv(user_id);

-- =====================================================
-- PERFORMANCE OPTIMIZATION FUNCTIONS
-- =====================================================

-- Function za refresh materialized views
CREATE OR REPLACE FUNCTION refresh_performance_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY user_stats_mv;
    
    -- Log the refresh (system operation - no user)
    INSERT INTO system_logs (
        log_type, 
        severity, 
        title, 
        description,
        metadata,
        created_at
    ) VALUES (
        'PERFORMANCE',
        'INFO',
        'Performance views refreshed',
        'Materialized views have been refreshed for better performance',
        '{"action": "refresh_materialized_views"}'::jsonb,
        NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CLEANUP OLD DATA FUNCTION
-- =====================================================

-- Function za cleanup starih logova (starijih od 30 dana)
CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS void AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM system_logs 
    WHERE created_at < NOW() - INTERVAL '30 days'
    AND severity NOT IN ('ERROR', 'CRITICAL');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log cleanup action (system operation - no user)
    INSERT INTO system_logs (
        log_type, 
        severity, 
        title,
        description,
        metadata,
        created_at
    ) VALUES (
        'MAINTENANCE',
        'INFO',
        'Old logs cleaned up',
        'System maintenance: Old log entries have been removed',
        jsonb_build_object('deleted_count', deleted_count),
        NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PERFORMANCE MONITORING
-- =====================================================

-- Table za performance metrics
CREATE TABLE IF NOT EXISTS performance_metrics (
    metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL,
    metric_unit VARCHAR(20),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Index za performance metrics
CREATE INDEX IF NOT EXISTS idx_performance_metrics_name_time ON performance_metrics(metric_name, recorded_at DESC);

-- Function za recording performance metrics
CREATE OR REPLACE FUNCTION record_performance_metric(
    p_metric_name VARCHAR(100),
    p_metric_value DECIMAL,
    p_metric_unit VARCHAR(20) DEFAULT 'ms',
    p_metadata JSONB DEFAULT '{}'
)
RETURNS void AS $$
BEGIN
    INSERT INTO performance_metrics (
        metric_name,
        metric_value,
        metric_unit,
        metadata,
        recorded_at
    ) VALUES (
        p_metric_name,
        p_metric_value,
        p_metric_unit,
        p_metadata,
        NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SCHEDULED MAINTENANCE (za cron job)
-- =====================================================

-- Function za daily maintenance
CREATE OR REPLACE FUNCTION daily_maintenance()
RETURNS void AS $$
BEGIN
    -- Refresh materialized views
    PERFORM refresh_performance_views();
    
    -- Cleanup old logs
    PERFORM cleanup_old_logs();
    
    -- Analyze tables for better query planning
    ANALYZE trips;
    ANALYZE expenses;
    ANALYZE reservations;
    ANALYZE reminders;
    ANALYZE users;
    ANALYZE vehicles;
    
    -- Log maintenance completion (system operation - no user)
    INSERT INTO system_logs (
        log_type, 
        severity, 
        title,
        description,
        metadata,
        created_at
    ) VALUES (
        'MAINTENANCE',
        'INFO',
        'Daily maintenance completed',
        'All daily maintenance tasks have been completed successfully',
        '{"action": "daily_maintenance"}'::jsonb,
        NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- INITIAL DATA REFRESH
-- =====================================================

-- Refresh materialized views initially
SELECT refresh_performance_views();

-- Record initial performance baseline
SELECT record_performance_metric('migration_008_applied', 1, 'count', '{"version": "008", "type": "performance_optimization"}');

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON INDEX idx_trips_user_status IS 'Optimizacija za trips po user_id i status - HomeScreen active trip query';
COMMENT ON INDEX idx_expenses_user_created IS 'Optimizacija za expenses po user_id i datum - ExpensesScreen lista';
COMMENT ON INDEX idx_reservations_user_time IS 'Optimizacija za reservations po user_id i vremenu - ReservationsScreen';
COMMENT ON INDEX idx_reminders_user_due IS 'Optimizacija za reminders po user_id i due_date - RemindersScreen';

COMMENT ON VIEW pending_reservations_optimized IS 'Optimizovani view za pending reservations - smanjuje broj JOIN-ova';
COMMENT ON VIEW active_trips_optimized IS 'Optimizovani view za active trips - HomeScreen performance';

COMMENT ON MATERIALIZED VIEW user_stats_mv IS 'Materialized view za user statistike - refresh manually ili cron job';

COMMENT ON FUNCTION refresh_performance_views() IS 'Function za refresh svih materialized views - pozivati iz cron job-a';
COMMENT ON FUNCTION cleanup_old_logs() IS 'Function za brisanje starih logova - maintenance';
COMMENT ON FUNCTION daily_maintenance() IS 'Function za daily maintenance tasks - pozivati iz cron job-a';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Performance optimization migration 008 completed successfully!';
    RAISE NOTICE '📊 Created % indexes for query optimization', (
        SELECT COUNT(*) FROM pg_indexes 
        WHERE indexname LIKE 'idx_%' 
        AND schemaname = 'public'
    );
    RAISE NOTICE '🚀 Application performance should be significantly improved';
END $$; 