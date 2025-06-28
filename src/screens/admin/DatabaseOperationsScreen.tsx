import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import Colors from '../../constants/Colors';
import { supabase } from '../../lib/supabase';

const DatabaseOperationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  
  const [isDeleteReservationsLoading, setIsDeleteReservationsLoading] = useState(false);
  const [isDeleteRemindersLoading, setIsDeleteRemindersLoading] = useState(false);
  const [isDeleteAllTestDataLoading, setIsDeleteAllTestDataLoading] = useState(false);

  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    card: Colors.DARK.card,
    border: Colors.DARK.border,
    primary: Colors.DARK.primary,
    danger: Colors.DANGER,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    white: '#FFFFFF',
  } : {
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    card: Colors.LIGHT.card,
    border: Colors.LIGHT.border,
    primary: Colors.LIGHT.primary,
    danger: Colors.DANGER,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    white: '#FFFFFF',
  };

  // Delete all reservations
  const handleDeleteAllReservations = () => {
    Alert.alert(
      'Delete All Reservations',
      'Are you sure you want to delete ALL reservations? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            setIsDeleteReservationsLoading(true);
            try {
              const { error } = await supabase
                .from('reservations')
                .delete()
                .neq('reservation_id', '00000000-0000-0000-0000-000000000000'); // Delete all except impossible ID

              if (error) {
                console.error('Error deleting reservations:', error);
                Alert.alert('Error', 'Failed to delete reservations');
              } else {
                Alert.alert('Success', 'All reservations have been deleted');
              }
            } catch (error) {
              console.error('Unexpected error:', error);
              Alert.alert('Error', 'An unexpected error occurred');
            } finally {
              setIsDeleteReservationsLoading(false);
            }
          }
        }
      ]
    );
  };

  // Delete all reminders
  const handleDeleteAllReminders = () => {
    Alert.alert(
      'Delete All Reminders',
      'Are you sure you want to delete ALL reminders? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            setIsDeleteRemindersLoading(true);
            try {
              const { error } = await supabase
                .from('reminders')
                .delete()
                .neq('reminder_id', '00000000-0000-0000-0000-000000000000'); // Delete all except impossible ID

              if (error) {
                console.error('Error deleting reminders:', error);
                Alert.alert('Error', 'Failed to delete reminders');
              } else {
                Alert.alert('Success', 'All reminders have been deleted');
              }
            } catch (error) {
              console.error('Unexpected error:', error);
              Alert.alert('Error', 'An unexpected error occurred');
            } finally {
              setIsDeleteRemindersLoading(false);
            }
          }
        }
      ]
    );
  };

  // Delete all test data (trips, expenses, notifications)
  const handleDeleteAllTestData = () => {
    Alert.alert(
      'Delete All Test Data',
      'This will delete ALL trips, expenses, notifications, reservations, and reminders. Are you absolutely sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            setIsDeleteAllTestDataLoading(true);
            try {
              // Delete in order to avoid foreign key constraints
              const deleteOperations = [
                supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
                supabase.from('expenses').delete().neq('expense_id', '00000000-0000-0000-0000-000000000000'),
                supabase.from('trips').delete().neq('trip_id', '00000000-0000-0000-0000-000000000000'),
                supabase.from('reservations').delete().neq('reservation_id', '00000000-0000-0000-0000-000000000000'),
                supabase.from('reminders').delete().neq('reminder_id', '00000000-0000-0000-0000-000000000000'),
              ];

              const results = await Promise.allSettled(deleteOperations);
              
              const errors = results.filter(result => result.status === 'rejected');
              if (errors.length > 0) {
                console.error('Some delete operations failed:', errors);
                Alert.alert('Partial Success', 'Some data was deleted, but some operations failed. Check console for details.');
              } else {
                Alert.alert('Success', 'All test data has been deleted');
              }
            } catch (error) {
              console.error('Unexpected error:', error);
              Alert.alert('Error', 'An unexpected error occurred');
            } finally {
              setIsDeleteAllTestDataLoading(false);
            }
          }
        }
      ]
    );
  };

  const operations = [
    {
      title: 'Delete All Reservations',
      description: 'Remove all vehicle reservations from the database',
      icon: 'calendar-outline',
      color: screenColors.danger,
      action: handleDeleteAllReservations,
      loading: isDeleteReservationsLoading,
    },
    {
      title: 'Delete All Reminders',
      description: 'Remove all reminders from the database',
      icon: 'notifications-outline',
      color: screenColors.danger,
      action: handleDeleteAllReminders,
      loading: isDeleteRemindersLoading,
    },
    {
      title: 'Delete All Test Data',
      description: 'Remove ALL trips, expenses, notifications, reservations, and reminders',
      icon: 'trash-outline',
      color: screenColors.danger,
      action: handleDeleteAllTestData,
      loading: isDeleteAllTestDataLoading,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
      <View style={[styles.header, { borderBottomColor: screenColors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={screenColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: screenColors.text }]}>Database Operations</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={[styles.warningCard, { backgroundColor: screenColors.warning + '20', borderColor: screenColors.warning }]}>
          <Ionicons name="warning" size={24} color={screenColors.warning} />
          <View style={styles.warningContent}>
            <Text style={[styles.warningTitle, { color: screenColors.warning }]}>
              Danger Zone
            </Text>
            <Text style={[styles.warningText, { color: screenColors.text }]}>
              These operations permanently delete data and cannot be undone. Use with extreme caution.
            </Text>
          </View>
        </View>

        {operations.map((operation, index) => (
          <View
            key={index}
            style={[styles.operationCard, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}
          >
            <View style={styles.operationContent}>
              <View style={[styles.operationIcon, { backgroundColor: operation.color + '20' }]}>
                <Ionicons name={operation.icon as any} size={24} color={operation.color} />
              </View>
              <View style={styles.operationDetails}>
                <Text style={[styles.operationTitle, { color: screenColors.text }]}>
                  {operation.title}
                </Text>
                <Text style={[styles.operationDescription, { color: screenColors.textSecondary }]}>
                  {operation.description}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.operationButton, { backgroundColor: operation.color }]}
              onPress={operation.action}
              disabled={operation.loading}
            >
              {operation.loading ? (
                <ActivityIndicator size="small" color={screenColors.white} />
              ) : (
                <Text style={[styles.operationButtonText, { color: screenColors.white }]}>
                  Execute
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ))}

        <View style={[styles.infoCard, { backgroundColor: screenColors.primary + '20', borderColor: screenColors.primary }]}>
          <Ionicons name="information-circle" size={24} color={screenColors.primary} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: screenColors.primary }]}>
              Database Information
            </Text>
            <Text style={[styles.infoText, { color: screenColors.text }]}>
              These operations work directly with the Supabase database. Make sure you have proper backups before executing any delete operations.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  warningCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
  },
  operationCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  operationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  operationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  operationDetails: {
    flex: 1,
  },
  operationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  operationDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  operationButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  operationButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default DatabaseOperationsScreen; 