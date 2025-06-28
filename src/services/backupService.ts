/**
 * Backup/Restore Service za Fleet Flow aplikaciju
 * Omogućava kreiranje i vraćanje backup-a korisničkih podataka
 */

import { supabase } from '../lib/supabase';

export interface BackupMetadata {
  vehicle_count: number;
  poi_count: number;
  route_count: number;
  expense_count: number;
  reminder_count: number;
  trip_count: number;
  reservation_count: number;
  message_count: number;
  notification_count: number;
  chat_group_count: number;
  total_records: number;
}

export interface UserBackup {
  backup_id: string;
  user_id: string;
  backup_name: string;
  backup_description?: string;
  backup_type: 'manual' | 'automatic';
  backup_size_bytes: number;
  backup_metadata: BackupMetadata;
  created_at: string;
  updated_at: string;
}

export interface BackupSummary {
  backup_id: string;
  user_id: string;
  backup_name: string;
  backup_description?: string;
  backup_type: 'manual' | 'automatic';
  backup_size_bytes: number;
  created_at: string;
  vehicle_count: number;
  poi_count: number;
  route_count: number;
  expense_count: number;
  reminder_count: number;
  trip_count: number;
  reservation_count: number;
  message_count: number;
  notification_count: number;
  chat_group_count: number;
  total_records: number;
  username: string;
  email: string;
}

export interface RestoreOptions {
  restore_vehicles?: boolean;
  restore_pois?: boolean;
  restore_routes?: boolean;
  restore_expenses?: boolean;
  restore_reminders?: boolean;
  restore_trips?: boolean;
  restore_reservations?: boolean;
  restore_messages?: boolean;
  restore_notifications?: boolean;
  restore_chat_groups?: boolean;
}

export interface RestoreResult {
  success: boolean;
  backup_id: string;
  backup_name: string;
  restored_counts: {
    vehicles: number;
    pois: number;
    routes: number;
    expenses: number;
    reminders: number;
    trips: number;
    reservations: number;
    messages: number;
    notifications: number;
    chat_groups: number;
  };
  total_restored: number;
  error?: string;
}

export class BackupService {
  /**
   * Creates a new backup for the current user
   */
  static async createBackup(
    backupName?: string,
    backupDescription?: string,
    backupType: 'manual' | 'automatic' = 'manual'
  ): Promise<{ success: boolean; backup_id?: string; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase.rpc('create_user_backup', {
        p_backup_name: backupName,
        p_backup_description: backupDescription,
        p_is_automatic: backupType === 'automatic'
      });

      if (error) {
        console.error('❌ Error creating backup:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Backup created successfully:', data);
      return { success: true, backup_id: data };
    } catch (error) {
      console.error('❌ Error in createBackup:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Gets all backups for the current user
   */
  static async getUserBackups(): Promise<{ success: boolean; backups?: BackupSummary[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('user_backup_summary')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching backups:', error);
        return { success: false, error: error.message };
      }

      return { success: true, backups: data || [] };
    } catch (error) {
      console.error('❌ Error in getUserBackups:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Restores data from a backup
   */
  static async restoreBackup(
    backupId: string,
    options: RestoreOptions = {}
  ): Promise<RestoreResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { 
          success: false, 
          backup_id: backupId, 
          backup_name: '', 
          restored_counts: {
            vehicles: 0, pois: 0, routes: 0, expenses: 0, reminders: 0, trips: 0,
            reservations: 0, messages: 0, notifications: 0, chat_groups: 0
          },
          total_restored: 0,
          error: 'User not authenticated' 
        };
      }

      const { data, error } = await supabase.rpc('restore_user_backup', {
        p_user_id: user.id,
        p_backup_id: backupId,
        p_restore_vehicles: options.restore_vehicles ?? true,
        p_restore_pois: options.restore_pois ?? true,
        p_restore_routes: options.restore_routes ?? true,
        p_restore_expenses: options.restore_expenses ?? true,
        p_restore_reminders: options.restore_reminders ?? true,
        p_restore_trips: options.restore_trips ?? true,
        p_restore_reservations: options.restore_reservations ?? true,
        p_restore_messages: options.restore_messages ?? true,
        p_restore_notifications: options.restore_notifications ?? true,
        p_restore_chat_groups: options.restore_chat_groups ?? true
      });

      if (error) {
        console.error('❌ Error restoring backup:', error);
        return { 
          success: false, 
          backup_id: backupId, 
          backup_name: '', 
          restored_counts: {
            vehicles: 0, pois: 0, routes: 0, expenses: 0, reminders: 0, trips: 0,
            reservations: 0, messages: 0, notifications: 0, chat_groups: 0
          },
          total_restored: 0,
          error: error.message 
        };
      }

      console.log('✅ Backup restored successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error in restoreBackup:', error);
      return { 
        success: false, 
        backup_id: backupId, 
        backup_name: '', 
        restored_counts: {
          vehicles: 0, pois: 0, routes: 0, expenses: 0, reminders: 0, trips: 0,
          reservations: 0, messages: 0, notifications: 0, chat_groups: 0
        },
        total_restored: 0,
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Deletes a backup
   */
  static async deleteBackup(backupId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('user_backups')
        .delete()
        .eq('backup_id', backupId)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Error deleting backup:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Backup deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Error in deleteBackup:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Cleans up old backups, keeping only the specified number of recent backups
   */
  static async cleanupOldBackups(keepCount: number = 10): Promise<{ success: boolean; deleted_count?: number; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase.rpc('cleanup_old_backups', {
        p_user_id: user.id,
        p_keep_count: keepCount
      });

      if (error) {
        console.error('❌ Error cleaning up backups:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ Cleaned up ${data} old backups`);
      return { success: true, deleted_count: data };
    } catch (error) {
      console.error('❌ Error in cleanupOldBackups:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Gets backup statistics for the current user
   */
  static async getBackupStats(): Promise<{ 
    success: boolean; 
    stats?: {
      total_backups: number;
      total_size_bytes: number;
      latest_backup_date?: string;
      automatic_backups: number;
      manual_backups: number;
    }; 
    error?: string 
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('user_backup_summary')
        .select('backup_type, backup_size_bytes, created_at')
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Error fetching backup stats:', error);
        return { success: false, error: error.message };
      }

      const backups = data || [];
      const stats = {
        total_backups: backups.length,
        total_size_bytes: backups.reduce((sum, backup) => sum + backup.backup_size_bytes, 0),
        latest_backup_date: backups.length > 0 ? backups[0].created_at : undefined,
        automatic_backups: backups.filter(b => b.backup_type === 'automatic').length,
        manual_backups: backups.filter(b => b.backup_type === 'manual').length,
      };

      return { success: true, stats };
    } catch (error) {
      console.error('❌ Error in getBackupStats:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Formats backup size in human-readable format
   */
  static formatBackupSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Validates restore options
   */
  static validateRestoreOptions(options: RestoreOptions): boolean {
    // At least one option should be true
    return Object.values(options).some(value => value === true);
  }
}

export const backupService = new BackupService();
export default backupService; 