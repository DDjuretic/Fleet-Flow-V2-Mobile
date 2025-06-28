import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService, StoredNotification } from '../../services/notificationService';
import Colors from '../../constants/Colors';
import { RootState } from '../../store/rootReducer';
import { useFocusEffect } from '@react-navigation/native';

interface NotificationItemProps {
  notification: StoredNotification;
  onPress: () => void;
  onMarkAsRead: () => void;
  screenColors: any;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onPress, 
  onMarkAsRead, 
  screenColors 
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reservation_approved':
        return { name: 'checkmark-circle', color: Colors.SUCCESS };
      case 'reservation_rejected':
        return { name: 'close-circle', color: Colors.DANGER };
      case 'expense_approved':
        return { name: 'card', color: Colors.SUCCESS };
      case 'expense_rejected':
        return { name: 'card-outline', color: Colors.DANGER };
      case 'system':
        return { name: 'information-circle', color: screenColors.primary };
      case 'reminder':
        return { name: 'alarm', color: Colors.WARNING };
      default:
        return { name: 'notifications', color: screenColors.primary };
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const icon = getNotificationIcon(notification.type);

  return (
    <TouchableOpacity 
      style={[
        styles.notificationItem, 
        { 
          backgroundColor: notification.is_read ? screenColors.card : `${screenColors.primary}10`,
          borderLeftColor: notification.is_read ? screenColors.border : screenColors.primary,
        }
      ]} 
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon.name as any} size={24} color={icon.color} />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[
            styles.title, 
            { 
              color: screenColors.text,
              fontWeight: notification.is_read ? '500' : 'bold',
            }
          ]}>
            {notification.title}
          </Text>
          <Text style={[styles.time, { color: screenColors.textSecondary }]}>
            {formatTime(notification.created_at)}
          </Text>
        </View>
        
        <Text style={[
          styles.body, 
          { 
            color: screenColors.textSecondary,
            fontWeight: notification.is_read ? 'normal' : '500',
          }
        ]}>
          {notification.body}
        </Text>
        
        {!notification.is_read && (
          <TouchableOpacity 
            style={[styles.markAsReadButton, { borderColor: screenColors.primary }]}
            onPress={onMarkAsRead}
          >
            <Text style={[styles.markAsReadText, { color: screenColors.primary }]}>
              Mark as Read
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {!notification.is_read && (
        <View style={[styles.unreadIndicator, { backgroundColor: screenColors.primary }]} />
      )}
    </TouchableOpacity>
  );
};

export default function NotificationsScreen({ navigation }: any) {
  const { user } = useAuth();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  
  const [notifications, setNotifications] = useState<StoredNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    card: Colors.DARK.card,
    border: Colors.DARK.border,
    primary: Colors.DARK.primary,
  } : {
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    card: Colors.LIGHT.card,
    border: Colors.LIGHT.border,
    primary: Colors.LIGHT.primary,
  };

  const loadNotifications = async () => {
    if (!user?.id) return;
    
    try {
      const [notifs, count] = await Promise.all([
        notificationService.getUserNotifications(user.id),
        notificationService.getUnreadCount(user.id)
      ]);
      
      setNotifications(notifs);
      setUnreadCount(count);
    } catch (error) {
      console.error('❌ Error loading notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const handleNotificationPress = (notification: StoredNotification) => {
    console.log('📱 Notification pressed:', notification);
    
    // Mark as read if not already read
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    
    // Navigate based on type
    switch (notification.type) {
      case 'reservation_approved':
      case 'reservation_rejected':
        navigation.navigate('Reservations');
        break;
      case 'expense_approved':
      case 'expense_rejected':
        navigation.navigate('Expenses');
        break;
      default:
        // Stay on notifications screen
        break;
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount === 0) return;
    
    Alert.alert(
      'Mark All as Read',
      'Mark all notifications as read?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mark All', 
          onPress: async () => {
            try {
              if (!user?.id) return;
              
              await notificationService.markAllAsRead(user.id);
              
              // Update local state
              setNotifications(prev => 
                prev.map(n => ({ ...n, is_read: true }))
              );
              setUnreadCount(0);
              
            } catch (error) {
              console.error('❌ Error marking all as read:', error);
            }
          }
        }
      ]
    );
  };

  const handleTestNotification = async () => {
    if (!user?.id) return;
    
    await notificationService.sendSystemNotification(
      user.id,
      'Test Notification 🧪',
      'This is a test notification to verify the system is working correctly.',
      { test: true, timestamp: new Date().toISOString() }
    );
    
    // Refresh to show new notification
    setTimeout(() => loadNotifications(), 1000);
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [user?.id])
  );

  const renderNotification = ({ item }: { item: StoredNotification }) => (
    <NotificationItem
      notification={item}
      onPress={() => handleNotificationPress(item)}
      onMarkAsRead={() => markAsRead(item.id)}
      screenColors={screenColors}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-outline" size={64} color={screenColors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: screenColors.text }]}>
        No Notifications
      </Text>
      <Text style={[styles.emptySubtitle, { color: screenColors.textSecondary }]}>
        You're all caught up! Notifications will appear here when you receive them.
      </Text>
      <TouchableOpacity 
        style={[styles.testButton, { backgroundColor: screenColors.primary }]}
        onPress={handleTestNotification}
      >
        <Text style={styles.testButtonText}>Send Test Notification</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: screenColors.text }]}>
            Notifications
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={screenColors.primary} />
          <Text style={[styles.loadingText, { color: screenColors.textSecondary }]}>
            Loading notifications...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={screenColors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: screenColors.text }]}>
            Notifications
          </Text>
          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: Colors.DANGER }]}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        
        {unreadCount > 0 && (
          <TouchableOpacity 
            style={styles.markAllButton}
            onPress={handleMarkAllAsRead}
          >
            <Text style={[styles.markAllText, { color: screenColors.primary }]}>
              Mark All Read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={screenColors.primary}
          />
        }
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={notifications.length === 0 ? styles.emptyListContainer : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: Colors.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
  },
  markAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderLeftWidth: 3,
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  markAsReadButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 4,
  },
  markAsReadText: {
    fontSize: 12,
    fontWeight: '500',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    marginTop: 8,
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  testButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  testButtonText: {
    color: Colors.WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
}); 