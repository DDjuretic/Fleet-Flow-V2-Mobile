import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  type: 'reservation_approved' | 'reservation_rejected' | 'expense_approved' | 'expense_rejected' | 'system' | 'reminder';
  title: string;
  body: string;
  data?: any;
  userId: string;
}

export interface StoredNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  data?: any;
  is_read: boolean;
  created_at: string;
  sent_at?: string;
}

export class NotificationService {
  private static instance: NotificationService;
  private expoPushToken: string | null = null;

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize notification service - should be called on app startup
   */
  public async initialize(): Promise<void> {
    try {
      console.log('🔔 Initializing notification service...');
      
      // Request permissions
      const permissionResult = await this.requestPermissions();
      if (!permissionResult) {
        console.log('❌ Notification permissions denied');
        return;
      }

      // Get push token
      const token = await this.registerForPushNotifications();
      if (token) {
        this.expoPushToken = token;
        console.log('✅ Push token obtained:', token);
        // TODO: Save token to user profile in database
      }

      // Set up notification listeners
      this.setupNotificationListeners();
      
      console.log('✅ Notification service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize notification service:', error);
    }
  }

  /**
   * Request notification permissions
   */
  private async requestPermissions(): Promise<boolean> {
    try {
      if (!Device.isDevice) {
        console.log('⚠️ Must use physical device for push notifications');
        return false;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('❌ Failed to get push token for push notification!');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Register for push notifications and get token
   */
  private async registerForPushNotifications(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return token.data;
    } catch (error) {
      console.error('❌ Error getting push token:', error);
      return null;
    }
  }

  /**
   * Set up notification event listeners
   */
  private setupNotificationListeners(): void {
    // Listener for notifications received while app is in foreground
    Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Notification received in foreground:', notification);
      // Handle foreground notification
    });

    // Listener for notification responses (user tapped notification)
    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification tapped:', response);
      this.handleNotificationResponse(response);
    });
  }

  /**
   * Handle notification tap/response
   */
  private handleNotificationResponse(response: Notifications.NotificationResponse): void {
    const data = response.notification.request.content.data;
    console.log('📱 Handling notification response:', data);
    
    // TODO: Navigate to specific screen based on notification type
    switch (data?.type) {
      case 'reservation_approved':
      case 'reservation_rejected':
        // Navigate to reservations screen
        break;
      case 'expense_approved':
      case 'expense_rejected':
        // Navigate to expenses screen
        break;
      default:
        // Navigate to notifications screen
        break;
    }
  }

  /**
   * Send local notification
   */
  public async sendLocalNotification(notification: NotificationData): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: {
            type: notification.type,
            ...notification.data,
          },
        },
        trigger: null, // Show immediately
      });
      
      console.log('✅ Local notification sent:', notification.title);
    } catch (error) {
      console.error('❌ Error sending local notification:', error);
    }
  }

  /**
   * Create notification in database
   */
  public async createNotification(notification: NotificationData): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: notification.userId,
            type: notification.type,
            title: notification.title,
            body: notification.body,
            data: notification.data || {},
            is_read: false,
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        console.error('❌ Error creating notification in database:', error);
        return;
      }

      console.log('✅ Notification created in database:', notification.title);
      
      // Also send local notification
      await this.sendLocalNotification(notification);
      
    } catch (error) {
      console.error('❌ Error in createNotification:', error);
    }
  }

  /**
   * Get user notifications from database
   */
  public async getUserNotifications(userId: string, limit: number = 50): Promise<StoredNotification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Error fetching notifications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Error in getUserNotifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  public async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('❌ Error marking notification as read:', error);
        return;
      }

      console.log('✅ Notification marked as read:', notificationId);
    } catch (error) {
      console.error('❌ Error in markAsRead:', error);
    }
  }

  /**
   * Mark all notifications as read for user
   */
  public async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('❌ Error marking all notifications as read:', error);
        return;
      }

      console.log('✅ All notifications marked as read for user:', userId);
    } catch (error) {
      console.error('❌ Error in markAllAsRead:', error);
    }
  }

  /**
   * Get unread notification count
   */
  public async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('❌ Error getting unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('❌ Error in getUnreadCount:', error);
      return 0;
    }
  }

  /**
   * Send reservation approved notification
   */
  public async sendReservationApprovedNotification(
    userId: string, 
    reservationId: string, 
    reservationName: string,
    approvedBy: string
  ): Promise<void> {
    const notification: NotificationData = {
      type: 'reservation_approved',
      title: 'Reservation Approved ✅',
      body: `Your reservation "${reservationName}" has been approved by ${approvedBy}`,
      data: {
        reservationId,
        approvedBy,
      },
      userId,
    };

    await this.createNotification(notification);
  }

  /**
   * Send reservation rejected notification
   */
  public async sendReservationRejectedNotification(
    userId: string, 
    reservationId: string, 
    reservationName: string,
    rejectedBy: string,
    reason?: string
  ): Promise<void> {
    const notification: NotificationData = {
      type: 'reservation_rejected',
      title: 'Reservation Rejected ❌',
      body: `Your reservation "${reservationName}" was rejected by ${rejectedBy}${reason ? `. Reason: ${reason}` : ''}`,
      data: {
        reservationId,
        rejectedBy,
        reason,
      },
      userId,
    };

    await this.createNotification(notification);
  }

  /**
   * Send expense approved notification
   */
  public async sendExpenseApprovedNotification(
    userId: string, 
    expenseId: string, 
    expenseDescription: string,
    amount: number,
    approvedBy: string
  ): Promise<void> {
    const notification: NotificationData = {
      type: 'expense_approved',
      title: 'Expense Approved ✅',
      body: `Your expense "${expenseDescription}" (${amount} EUR) has been approved by ${approvedBy}`,
      data: {
        expenseId,
        approvedBy,
        amount,
      },
      userId,
    };

    await this.createNotification(notification);
  }

  /**
   * Send expense rejected notification
   */
  public async sendExpenseRejectedNotification(
    userId: string, 
    expenseId: string, 
    expenseDescription: string,
    amount: number,
    rejectedBy: string,
    reason?: string
  ): Promise<void> {
    const notification: NotificationData = {
      type: 'expense_rejected',
      title: 'Expense Rejected ❌',
      body: `Your expense "${expenseDescription}" (${amount} EUR) was rejected by ${rejectedBy}${reason ? `. Reason: ${reason}` : ''}`,
      data: {
        expenseId,
        rejectedBy,
        reason,
        amount,
      },
      userId,
    };

    await this.createNotification(notification);
  }

  /**
   * Send system notification
   */
  public async sendSystemNotification(
    userId: string, 
    title: string, 
    body: string,
    data?: any
  ): Promise<void> {
    const notification: NotificationData = {
      type: 'system',
      title,
      body,
      data,
      userId,
    };

    await this.createNotification(notification);
  }

  /**
   * Get push token for current device
   */
  public getPushToken(): string | null {
    return this.expoPushToken;
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance(); 