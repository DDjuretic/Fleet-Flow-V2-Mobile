-- =============================================
-- BACKUP SYSTEM MIGRATION
-- =============================================
-- Kreiranje kompletnog backup sistema za Fleet Flow aplikaciju
-- Omogućava kreiranje i vraćanje backup-a korisničkih podataka

-- =============================================
-- USER_BACKUPS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS user_backups (
    backup_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    backup_name VARCHAR(255) NOT NULL,
    backup_description TEXT,
    backup_type VARCHAR(20) NOT NULL DEFAULT 'manual', -- 'manual' or 'automatic'
    backup_size_bytes BIGINT NOT NULL DEFAULT 0,
    backup_metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BACKUP_DATA TABLE - stores actual backup data
-- =============================================
CREATE TABLE IF NOT EXISTS backup_data (
    backup_data_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    backup_id UUID NOT NULL REFERENCES user_backups(backup_id) ON DELETE CASCADE,
    table_name VARCHAR(100) NOT NULL,
    data_type VARCHAR(50) NOT NULL, -- 'vehicles', 'pois', 'routes', etc.
    backup_data JSONB NOT NULL,
    record_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_user_backups_user_id ON user_backups(user_id);
CREATE INDEX IF NOT EXISTS idx_user_backups_created_at ON user_backups(created_at);
CREATE INDEX IF NOT EXISTS idx_backup_data_backup_id ON backup_data(backup_id);
CREATE INDEX IF NOT EXISTS idx_backup_data_table_name ON backup_data(table_name);

-- =============================================
-- RLS POLICIES
-- =============================================
ALTER TABLE user_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_data ENABLE ROW LEVEL SECURITY;

-- Users can only access their own backups
CREATE POLICY "Users can view own backups" ON user_backups
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own backups" ON user_backups
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own backups" ON user_backups
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own backups" ON user_backups
    FOR DELETE USING (auth.uid() = user_id);

-- Backup data policies
CREATE POLICY "Users can view own backup data" ON backup_data
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_backups ub 
            WHERE ub.backup_id = backup_data.backup_id 
            AND ub.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create own backup data" ON backup_data
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_backups ub 
            WHERE ub.backup_id = backup_data.backup_id 
            AND ub.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own backup data" ON backup_data
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_backups ub 
            WHERE ub.backup_id = backup_data.backup_id 
            AND ub.user_id = auth.uid()
        )
    );

-- =============================================
-- BACKUP SUMMARY VIEW
-- =============================================
CREATE OR REPLACE VIEW user_backup_summary AS
SELECT 
    ub.backup_id,
    ub.user_id,
    ub.backup_name,
    ub.backup_description,
    ub.backup_type,
    ub.backup_size_bytes,
    ub.created_at,
    
    -- Extract metadata counts
    COALESCE((ub.backup_metadata->>'vehicle_count')::INTEGER, 0) as vehicle_count,
    COALESCE((ub.backup_metadata->>'poi_count')::INTEGER, 0) as poi_count,
    COALESCE((ub.backup_metadata->>'route_count')::INTEGER, 0) as route_count,
    COALESCE((ub.backup_metadata->>'expense_count')::INTEGER, 0) as expense_count,
    COALESCE((ub.backup_metadata->>'reminder_count')::INTEGER, 0) as reminder_count,
    COALESCE((ub.backup_metadata->>'trip_count')::INTEGER, 0) as trip_count,
    COALESCE((ub.backup_metadata->>'reservation_count')::INTEGER, 0) as reservation_count,
    COALESCE((ub.backup_metadata->>'message_count')::INTEGER, 0) as message_count,
    COALESCE((ub.backup_metadata->>'notification_count')::INTEGER, 0) as notification_count,
    COALESCE((ub.backup_metadata->>'chat_group_count')::INTEGER, 0) as chat_group_count,
    COALESCE((ub.backup_metadata->>'total_records')::INTEGER, 0) as total_records,
    
    -- User info
    u.first_name || ' ' || u.last_name as username,
    u.email
FROM user_backups ub
JOIN users u ON ub.user_id = u.user_id;

-- =============================================
-- CREATE_USER_BACKUP FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION create_user_backup(
    p_backup_name TEXT DEFAULT NULL,
    p_backup_description TEXT DEFAULT NULL,
    p_is_automatic BOOLEAN DEFAULT FALSE
)
RETURNS UUID AS $$
DECLARE
    v_user_id UUID;
    v_backup_id UUID;
    v_backup_name TEXT;
    v_backup_type TEXT;
    v_total_size BIGINT := 0;
    v_metadata JSONB := '{}';
    
    -- Counters
    v_vehicle_count INTEGER := 0;
    v_poi_count INTEGER := 0;
    v_route_count INTEGER := 0;
    v_expense_count INTEGER := 0;
    v_reminder_count INTEGER := 0;
    v_trip_count INTEGER := 0;
    v_reservation_count INTEGER := 0;
    v_notification_count INTEGER := 0;
    v_total_records INTEGER := 0;
    
    -- Data variables
    v_vehicles_data JSONB;
    v_pois_data JSONB;
    v_routes_data JSONB;
    v_expenses_data JSONB;
    v_reminders_data JSONB;
    v_trips_data JSONB;
    v_reservations_data JSONB;
    v_notifications_data JSONB;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;
    
    -- Generate backup name if not provided
    IF p_backup_name IS NULL OR p_backup_name = '' THEN
        v_backup_name := 'Backup ' || TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI');
    ELSE
        v_backup_name := p_backup_name;
    END IF;
    
    -- Set backup type
    v_backup_type := CASE WHEN p_is_automatic THEN 'automatic' ELSE 'manual' END;
    
    -- Generate backup ID
    v_backup_id := gen_random_uuid();
    
    -- Backup vehicles data (user's private vehicles or vehicles they've used)
    SELECT json_agg(row_to_json(v.*)), COUNT(*)
    INTO v_vehicles_data, v_vehicle_count
    FROM vehicles v
    WHERE v.private_owner_id = v_user_id OR v.vehicle_id IN (
        SELECT DISTINCT vehicle_id FROM trips WHERE user_id = v_user_id
    );
    
    -- Backup POIs data (company POIs)
    SELECT json_agg(row_to_json(p.*)), COUNT(*)
    INTO v_pois_data, v_poi_count
    FROM pois p
    WHERE p.company_id = (SELECT company_id FROM users WHERE user_id = v_user_id);
    
    -- Backup routes data (company routes)
    SELECT json_agg(row_to_json(r.*)), COUNT(*)
    INTO v_routes_data, v_route_count
    FROM standard_routes r
    WHERE r.company_id = (SELECT company_id FROM users WHERE user_id = v_user_id);
    
    -- Backup expenses data (user's expenses)
    SELECT json_agg(row_to_json(e.*)), COUNT(*)
    INTO v_expenses_data, v_expense_count
    FROM expenses e
    WHERE e.user_id = v_user_id;
    
    -- Backup reminders data (user's reminders)
    SELECT json_agg(row_to_json(r.*)), COUNT(*)
    INTO v_reminders_data, v_reminder_count
    FROM reminders r
    WHERE r.user_id = v_user_id;
    
    -- Backup trips data (user's trips)
    SELECT json_agg(row_to_json(t.*)), COUNT(*)
    INTO v_trips_data, v_trip_count
    FROM trips t
    WHERE t.user_id = v_user_id;
    
    -- Backup reservations data (user's reservations)
    SELECT json_agg(row_to_json(res.*)), COUNT(*)
    INTO v_reservations_data, v_reservation_count
    FROM reservations res
    WHERE res.user_id = v_user_id;
    
    -- Backup notifications data (user's notifications)
    SELECT json_agg(row_to_json(n.*)), COUNT(*)
    INTO v_notifications_data, v_notification_count
    FROM notifications n
    WHERE n.user_id = v_user_id;
    
    -- Calculate total records
    v_total_records := COALESCE(v_vehicle_count, 0) + COALESCE(v_poi_count, 0) + COALESCE(v_route_count, 0) + 
                      COALESCE(v_expense_count, 0) + COALESCE(v_reminder_count, 0) + COALESCE(v_trip_count, 0) + 
                      COALESCE(v_reservation_count, 0) + COALESCE(v_notification_count, 0);
    
    -- Build metadata
    v_metadata := json_build_object(
        'vehicle_count', COALESCE(v_vehicle_count, 0),
        'poi_count', COALESCE(v_poi_count, 0),
        'route_count', COALESCE(v_route_count, 0),
        'expense_count', COALESCE(v_expense_count, 0),
        'reminder_count', COALESCE(v_reminder_count, 0),
        'trip_count', COALESCE(v_trip_count, 0),
        'reservation_count', COALESCE(v_reservation_count, 0),
        'message_count', 0,
        'notification_count', COALESCE(v_notification_count, 0),
        'chat_group_count', 0,
        'total_records', v_total_records
    );
    
    -- Calculate backup size (approximate)
    v_total_size := LENGTH(v_metadata::TEXT) + 
                   COALESCE(LENGTH(v_vehicles_data::TEXT), 0) +
                   COALESCE(LENGTH(v_pois_data::TEXT), 0) +
                   COALESCE(LENGTH(v_routes_data::TEXT), 0) +
                   COALESCE(LENGTH(v_expenses_data::TEXT), 0) +
                   COALESCE(LENGTH(v_reminders_data::TEXT), 0) +
                   COALESCE(LENGTH(v_trips_data::TEXT), 0) +
                   COALESCE(LENGTH(v_reservations_data::TEXT), 0) +
                   COALESCE(LENGTH(v_notifications_data::TEXT), 0);
    
    -- Create backup record
    INSERT INTO user_backups (
        backup_id, user_id, backup_name, backup_description, 
        backup_type, backup_size_bytes, backup_metadata
    ) VALUES (
        v_backup_id, v_user_id, v_backup_name, p_backup_description,
        v_backup_type, v_total_size, v_metadata
    );
    
    -- Store backup data
    IF v_vehicles_data IS NOT NULL THEN
        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)
        VALUES (v_backup_id, 'vehicles', 'vehicles', v_vehicles_data, v_vehicle_count);
    END IF;
    
    IF v_pois_data IS NOT NULL THEN
        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)
        VALUES (v_backup_id, 'pois', 'pois', v_pois_data, v_poi_count);
    END IF;
    
    IF v_routes_data IS NOT NULL THEN
        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)
        VALUES (v_backup_id, 'standard_routes', 'routes', v_routes_data, v_route_count);
    END IF;
    
    IF v_expenses_data IS NOT NULL THEN
        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)
        VALUES (v_backup_id, 'expenses', 'expenses', v_expenses_data, v_expense_count);
    END IF;
    
    IF v_reminders_data IS NOT NULL THEN
        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)
        VALUES (v_backup_id, 'reminders', 'reminders', v_reminders_data, v_reminder_count);
    END IF;
    
    IF v_trips_data IS NOT NULL THEN
        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)
        VALUES (v_backup_id, 'trips', 'trips', v_trips_data, v_trip_count);
    END IF;
    
    IF v_reservations_data IS NOT NULL THEN
        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)
        VALUES (v_backup_id, 'reservations', 'reservations', v_reservations_data, v_reservation_count);
    END IF;
    
    IF v_notifications_data IS NOT NULL THEN
        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)
        VALUES (v_backup_id, 'notifications', 'notifications', v_notifications_data, v_notification_count);
    END IF;
    
    RETURN v_backup_id;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error creating backup: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- RESTORE_USER_BACKUP FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION restore_user_backup(
    p_user_id UUID,
    p_backup_id UUID,
    p_restore_vehicles BOOLEAN DEFAULT TRUE,
    p_restore_pois BOOLEAN DEFAULT TRUE,
    p_restore_routes BOOLEAN DEFAULT TRUE,
    p_restore_expenses BOOLEAN DEFAULT FALSE,
    p_restore_reminders BOOLEAN DEFAULT TRUE,
    p_restore_trips BOOLEAN DEFAULT FALSE,
    p_restore_reservations BOOLEAN DEFAULT TRUE,
    p_restore_messages BOOLEAN DEFAULT TRUE,
    p_restore_notifications BOOLEAN DEFAULT TRUE,
    p_restore_chat_groups BOOLEAN DEFAULT TRUE
)
RETURNS JSON AS $$
DECLARE
    v_backup_record user_backups%ROWTYPE;
    v_vehicles_restored INTEGER := 0;
    v_pois_restored INTEGER := 0;
    v_routes_restored INTEGER := 0;
    v_expenses_restored INTEGER := 0;
    v_reminders_restored INTEGER := 0;
    v_trips_restored INTEGER := 0;
    v_reservations_restored INTEGER := 0;
    v_notifications_restored INTEGER := 0;
    v_total_restored INTEGER := 0;
    v_backup_data_record backup_data%ROWTYPE;
    v_data_item JSONB;
BEGIN
    -- Verify user owns the backup
    SELECT * INTO v_backup_record
    FROM user_backups
    WHERE backup_id = p_backup_id AND user_id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Backup not found or access denied';
    END IF;
    
    -- Restore reminders if requested (safe to restore)
    IF p_restore_reminders THEN
        SELECT * INTO v_backup_data_record
        FROM backup_data
        WHERE backup_id = p_backup_id AND data_type = 'reminders';
        
        IF FOUND THEN
            FOR v_data_item IN SELECT * FROM jsonb_array_elements(v_backup_data_record.backup_data)
            LOOP
                INSERT INTO reminders (
                    reminder_id, user_id, reminder_type_id, vehicle_id,
                    title, description, due_date, is_system_generated,
                    is_completed, completed_at
                ) VALUES (
                    gen_random_uuid(), -- Generate new ID to avoid conflicts
                    p_user_id, -- Always assign to current user
                    (v_data_item->>'reminder_type_id')::UUID,
                    (v_data_item->>'vehicle_id')::UUID,
                    v_data_item->>'title',
                    v_data_item->>'description',
                    (v_data_item->>'due_date')::TIMESTAMPTZ,
                    (v_data_item->>'is_system_generated')::BOOLEAN,
                    false, -- Reset completion status
                    NULL -- Reset completion date
                ) ON CONFLICT DO NOTHING;
                
                v_reminders_restored := v_reminders_restored + 1;
            END LOOP;
        END IF;
    END IF;
    
    -- Calculate total restored
    v_total_restored := v_vehicles_restored + v_pois_restored + v_routes_restored + 
                       v_expenses_restored + v_reminders_restored + v_trips_restored + 
                       v_reservations_restored + v_notifications_restored;
    
    -- Build result
    RETURN json_build_object(
        'success', true,
        'backup_id', p_backup_id,
        'backup_name', v_backup_record.backup_name,
        'restored_counts', json_build_object(
            'vehicles', v_vehicles_restored,
            'pois', v_pois_restored,
            'routes', v_routes_restored,
            'expenses', v_expenses_restored,
            'reminders', v_reminders_restored,
            'trips', v_trips_restored,
            'reservations', v_reservations_restored,
            'messages', 0,
            'notifications', v_notifications_restored,
            'chat_groups', 0
        ),
        'total_restored', v_total_restored
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'backup_id', p_backup_id,
            'backup_name', '',
            'restored_counts', json_build_object(
                'vehicles', 0, 'pois', 0, 'routes', 0, 'expenses', 0,
                'reminders', 0, 'trips', 0, 'reservations', 0,
                'messages', 0, 'notifications', 0, 'chat_groups', 0
            ),
            'total_restored', 0,
            'error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- CLEANUP_OLD_BACKUPS FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION cleanup_old_backups(
    p_user_id UUID,
    p_keep_count INTEGER DEFAULT 10
)
RETURNS INTEGER AS $$
DECLARE
    v_deleted_count INTEGER := 0;
BEGIN
    -- Delete old backups, keeping only the most recent p_keep_count
    DELETE FROM user_backups
    WHERE user_id = p_user_id
    AND backup_id NOT IN (
        SELECT backup_id
        FROM user_backups
        WHERE user_id = p_user_id
        ORDER BY created_at DESC
        LIMIT p_keep_count
    );
    
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    
    RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS
-- =============================================
CREATE TRIGGER update_user_backups_updated_at
    BEFORE UPDATE ON user_backups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- PERMISSIONS
-- =============================================
-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON user_backups TO authenticated;
GRANT SELECT, INSERT, DELETE ON backup_data TO authenticated;
GRANT SELECT ON user_backup_summary TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION create_user_backup TO authenticated;
GRANT EXECUTE ON FUNCTION restore_user_backup TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_backups TO authenticated;

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
SELECT 'BACKUP SYSTEM CREATED SUCCESSFULLY' as status; 