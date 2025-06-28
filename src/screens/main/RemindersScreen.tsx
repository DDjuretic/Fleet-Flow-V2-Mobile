import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/Colors';

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer'; // UPDATED PATH
// import { ThemeMode } from '../../store/slices/themeSlice'; // ThemeMode type is not explicitly used, can be removed if not needed elsewhere in future

// RTK Query
import { useGetRemindersQuery, DbReminder } from '../../store/api/supabaseApi';

// Auth Context
import { useAuth } from '../../contexts/AuthContext'; // Added AuthContext import

// Navigation
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';

// Types - Original Reminder interface is now replaced by DbReminder, or we map DbReminder to this structure
// For simplicity, we'll try to adapt to DbReminder structure where possible
// interface Reminder {
//   id: string;
//   title: string;
//   description: string;
//   type: 'maintenance' | 'inspection' | 'insurance' | 'registration' | 'fuel' | 'custom';
//   dueDate: string;
//   isCompleted: boolean;
//   vehicleId?: string;
//   vehicleName?: string;
//   priority: 'low' | 'medium' | 'high';
// }

export default function RemindersScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const { session, loading: authLoading } = useAuth(); // Get session and authLoading state

  // Define colors based on themeMode
  const colors = themeMode === 'dark' ? {
    primary: Colors.DARK.primary,
    secondary: Colors.DARK.secondary,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    danger: Colors.DANGER,
    background: Colors.DARK.background,
    card: Colors.DARK.card,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    border: Colors.DARK.border,
    white: Colors.WHITE,
  } : {
    primary: Colors.LIGHT.primary,
    secondary: Colors.LIGHT.secondary, // Assuming LIGHT theme has a secondary, or use a default
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    danger: Colors.DANGER,
    background: Colors.LIGHT.background,
    card: Colors.LIGHT.card,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    border: Colors.LIGHT.border,
    white: Colors.WHITE,
  };

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // RTK Query hook for fetching reminders
  // Skip query if auth is loading or session is not available
  const { 
    data: remindersData, 
    error: remindersError, 
    isLoading: isLoadingReminders, 
    refetch: refetchReminders 
  } = useGetRemindersQuery(undefined, { skip: authLoading || !session });

  const getTypeIcon = (reminderType?: string) => { // reminderType is now reminder_types.name
    switch (reminderType?.toLowerCase()) { // Use toLowerCase for case-insensitive matching
      case 'maintenance':
        return 'construct-outline';
      case 'inspection':
        return 'checkmark-circle-outline';
      case 'insurance':
        return 'shield-outline';
      case 'registration':
        return 'document-text-outline';
      case 'fuel':
        return 'car-outline';
      default:
        return 'alarm-outline';
    }
  };

  const getTypeColor = (reminderType?: string) => {
    switch (reminderType?.toLowerCase()) {
      case 'maintenance':
        return '#FF6B35';
      case 'inspection':
        return '#4ECDC4';
      case 'insurance':
        return '#45B7D1';
      case 'registration':
        return '#FFA07A';
      case 'fuel':
        return '#98D8C8';
      default:
        return colors.secondary;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDueDate = (dueDate: string) => {
    const daysUntil = getDaysUntilDue(dueDate);
    
    if (daysUntil < 0) {
      const days = Math.abs(daysUntil);
      return days === 1 
        ? t('overdue_by_day', 'Overdue by {{count}} day', { count: days })
        : t('overdue_by_days', 'Overdue by {{count}} days', { count: days });
    } else if (daysUntil === 0) {
      return t('due_today', 'Due today');
    } else if (daysUntil === 1) {
      return t('due_tomorrow', 'Due tomorrow');
    } else if (daysUntil <= 7) {
      return t('due_in_days', 'Due in {{count}} days', { count: daysUntil });
    } else {
      const date = new Date(dueDate);
      return `${t('due', 'Due')} ${date.toLocaleDateString()}`;
    }
  };

  const getDueDateColor = (dueDate: string, isCompleted: boolean) => {
    if (isCompleted) return colors.success;
    
    const daysUntil = getDaysUntilDue(dueDate);
    if (daysUntil < 0) return colors.danger;
    if (daysUntil <= 3) return colors.danger;
    if (daysUntil <= 7) return colors.warning;
    return colors.textSecondary;
  };

  const filteredReminders = (remindersData || []).filter(reminder => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return !reminder.is_completed;
    if (activeFilter === 'completed') return reminder.is_completed;
    return true;
  });

  const handleAddReminder = () => {
    navigation.navigate('AddReminder');
  };

  const handleReminderPress = (reminder: DbReminder) => {
    const vehicleDisplayName = reminder.vehicles ? `${reminder.vehicles.make} ${reminder.vehicles.model}` : t('not_available', 'N/A');
    Alert.alert(
      t('reminder_details', 'Reminder Details'),
      `${reminder.title}\n${reminder.description || ''}\n${t('vehicle', 'Vehicle')}: ${vehicleDisplayName}\n${formatDueDate(reminder.due_date)}`,
      [
        { text: t('edit', 'Edit'), onPress: () => navigation.navigate('EditReminder', { reminderId: reminder.reminder_id }) },
        { text: t('ok', 'OK'), style: 'cancel' }
      ]
    );
  };

  // toggleReminderStatus will be replaced by an RTK Query mutation
  // For now, a refetch can be triggered if a local toggle is desired, or simply wait for mutation
  // const toggleReminderStatus = (reminderId: string) => {
  //   // Placeholder: Implement mutation later
  //   console.log("Toggling status for:", reminderId);
  //   // refetchReminders(); // Optionally refetch after a local optimistic update or server mutation
  // };

  // Styles need to be created inside the component to access themed 'colors'
  const styles = getStyles(colors);

  // Handle auth loading state
  if (authLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 10 }}>{t('loading_session', 'Loading session...')}</Text>
      </SafeAreaView>
    );
  }

  // Handle no session state
  if (!session) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="log-in-outline" size={64} color={colors.textSecondary} />
        <Text style={{ color: colors.text, marginTop: 20, fontSize: 18, textAlign: 'center', paddingHorizontal: 20 }}>
          {t('please_login_to_view_reminders', 'Please log in to view your reminders.')}
        </Text>
        {/* Optionally, add a button to navigate to Login screen */}
        {/* <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity> */}
      </SafeAreaView>
    );
  }
  
  // Original logic for fetching and displaying reminders starts here,
  // now only executed if session exists and auth is not loading.

  if (isLoadingReminders) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (remindersError) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>{t('error_loading_reminders', 'Error loading reminders.')}</Text>
        <TouchableOpacity onPress={refetchReminders} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>{t('try_again', 'Try Again')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background} 
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('reminders_title', 'Reminders')}</Text>
      </View>

      {/* Summary Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statNumber, { color: colors.danger }]}>
            {filteredReminders.filter(r => !r.is_completed && getDaysUntilDue(r.due_date) <= 7).length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('urgent', 'Urgent')}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statNumber, { color: colors.warning }]}>
            {filteredReminders.filter(r => !r.is_completed).length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('pending', 'Pending')}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statNumber, { color: colors.success }]}>
            {filteredReminders.filter(r => r.is_completed).length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('completed', 'Completed')}</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'all' && styles.activeFilterButton,
            activeFilter === 'all' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setActiveFilter('all')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: activeFilter === 'all' ? colors.white : colors.textSecondary },
            ]}
          >
            {t('all', 'All')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'pending' && styles.activeFilterButton,
            activeFilter === 'pending' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setActiveFilter('pending')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: activeFilter === 'pending' ? colors.white : colors.textSecondary },
            ]}
          >
            {t('pending', 'Pending')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'completed' && styles.activeFilterButton,
            activeFilter === 'completed' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setActiveFilter('completed')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: activeFilter === 'completed' ? colors.white : colors.textSecondary },
            ]}
          >
            {t('completed', 'Completed')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoadingReminders} onRefresh={refetchReminders} tintColor={colors.primary}/>
        }
      >
        {filteredReminders.length === 0 && !isLoadingReminders ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="notifications-off-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>{t('no_reminders_found', 'No reminders found.')}</Text>
            <Text style={styles.emptyStateSubText}>
              {activeFilter === 'pending' ? t('no_pending_reminders', 'You have no pending reminders.') : 
               activeFilter === 'completed' ? t('no_completed_reminders', 'You have no completed reminders.') :
               t('try_adding_reminder_or_adjust_filters', 'Try adding a new reminder or adjusting your filters.')}
            </Text>
          </View>
        ) : (
          filteredReminders.map((reminder) => (
            <TouchableOpacity 
              key={reminder.reminder_id} 
              style={[styles.reminderCard, { backgroundColor: colors.card }]}
              onPress={() => handleReminderPress(reminder)}
            >
              <View style={styles.reminderHeader}>
                <Ionicons 
                  name={getTypeIcon(reminder.reminder_types?.name) as any} 
                  size={24} 
                  color={getTypeColor(reminder.reminder_types?.name)} 
                  style={styles.typeIcon} 
                />
                <View style={styles.titleContainer}>
                  <Text style={[styles.reminderTitle, { color: colors.text }]}>{reminder.title}</Text>
                  {reminder.vehicles && (
                    <Text style={[styles.vehicleName, { color: colors.textSecondary }]}>
                      {`${reminder.vehicles.make} ${reminder.vehicles.model}`}
                    </Text>
                  )}
                </View>
              </View>
              {reminder.description ? (
                <Text style={[styles.reminderDescription, { color: colors.textSecondary }]}>
                  {reminder.description}
                </Text>
              ) : null}
              <View style={styles.reminderFooter}>
                <Text style={[styles.dueDate, { color: getDueDateColor(reminder.due_date, reminder.is_completed) }]}>
                  {formatDueDate(reminder.due_date)}
                </Text>
                {reminder.is_completed && (
                  <Ionicons name="checkmark-done-circle" size={24} color={colors.success} />
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
        {/* Spacer for FAB */}
        <View style={{ height: 80 }} /> 
      </ScrollView>

      {/* FAB for adding a new reminder */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={handleAddReminder}
      >
        <Ionicons name="add" size={30} color={colors.white} />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

// Moved StyleSheet.create into a function that accepts themed colors
const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor will be set dynamically by SafeAreaView
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5, 
    borderColor: colors.border, // USE THEMED COLORS
  },
  activeFilterButton: {
    // backgroundColor will be set by active state in component
    borderColor: colors.primary, // USE THEMED COLORS
    borderWidth: 1.5,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  reminderCard: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reminderDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  vehicleName: {
    fontSize: 12,
    marginTop: 2,
  },
  reminderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
    marginBottom: 4,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginTop: 10,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
}); 