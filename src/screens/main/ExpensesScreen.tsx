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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/Colors';

// Components
import FuelManagementCompact from '../../components/FuelManagementCompact';

// Redux & RTK Query
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { useGetExpensesQuery, useDeleteExpenseMutation, DbExpense } from '../../store/api/supabaseApi';

// Navigation
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';

// Types
interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  category: 'fuel' | 'parking' | 'tolls' | 'maintenance' | 'meals' | 'accommodation' | 'other';
  date: string;
  tripId?: string;
  tripName?: string;
  vehicleName?: string;
  status: 'pending' | 'approved' | 'rejected';
  receiptUrl?: string;
}

const mockExpenses: Expense[] = [
    {
      id: '1',
      description: 'Fuel - Podgorica Center',
      amount: 45.50,
      currency: 'EUR',
      category: 'fuel',
      date: '2025-01-30T10:30:00Z',
      tripId: '1',
      tripName: 'Business Meeting - Podgorica',
      status: 'pending',
    },
    {
      id: '2',
      description: 'Parking fees',
      amount: 2.00,
      currency: 'EUR',
      category: 'parking',
      date: '2025-01-30T14:15:00Z',
      tripId: '1',
      tripName: 'Business Meeting - Podgorica',
      status: 'pending',
    },
    {
      id: '3',
      description: 'Lunch with client',
      amount: 28.75,
      currency: 'EUR',
      category: 'meals',
      date: '2025-01-29T13:00:00Z',
      tripId: '2',
      tripName: 'Client Visit - Nikšić',
      status: 'approved',
    },
    {
      id: '4',
      description: 'Highway toll',
      amount: 1.50,
      currency: 'EUR',
      category: 'tolls',
      date: '2025-01-29T09:30:00Z',
      tripId: '2',
      tripName: 'Client Visit - Nikšić',
      status: 'approved',
    },
    {
      id: '5',
      description: 'Hotel Accommodation - Podgorica',
      amount: 75.00,
      currency: 'EUR' as const,
      category: 'accommodation' as const,
      date: '2025-01-30T20:00:00Z',
      tripId: '1',
      tripName: 'Business Meeting - Podgorica',
      status: 'rejected' as const,
    },
  ];

export default function ExpensesScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  
  // Fetch expenses from Supabase
  const { data: expensesData, isLoading: isLoadingExpenses, error: expensesError, refetch } = useGetExpensesQuery();
  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation();

  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    primary: Colors.DARK.primary,
    secondary: Colors.DARK.secondary,
    card: Colors.DARK.card,
    border: Colors.DARK.border,
    white: Colors.WHITE,
    black: Colors.BLACK,
    gray: Colors.GRAY,
    lightGray: Colors.LIGHT_GRAY,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    danger: Colors.DANGER,
    // Boje za kategorije - mogu biti deo Colors.ts ili definisane ovde
    categoryFuel: '#FF6B35', // Primer, možda je bolje da ove boje budu u Colors.ts
    categoryParking: '#4ECDC4',
    categoryTolls: '#45B7D1',
    categoryMeals: '#98D8C8',
    categoryAccommodation: '#85C1E9',
    filterActiveBackground: Colors.DARK.primary,
    filterInactiveBackground: Colors.DARK.card,
    filterActiveText: Colors.WHITE,
    filterInactiveText: Colors.DARK.textSecondary,
  } : {
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    primary: Colors.LIGHT.primary,
    secondary: Colors.LIGHT.secondary,
    card: Colors.LIGHT.card,
    border: Colors.LIGHT.border,
    white: Colors.WHITE,
    black: Colors.BLACK,
    gray: Colors.GRAY,
    lightGray: Colors.LIGHT_GRAY,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    danger: Colors.DANGER,
    categoryFuel: '#FF6B35',
    categoryParking: '#4ECDC4',
    categoryTolls: '#45B7D1',
    categoryMeals: '#98D8C8',
    categoryAccommodation: '#85C1E9',
    filterActiveBackground: Colors.LIGHT.primary,
    filterInactiveBackground: Colors.LIGHT.card,
    filterActiveText: Colors.WHITE,
    filterInactiveText: Colors.LIGHT.textSecondary,
  };

  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Convert DbExpense to Expense format
  const convertDbExpenseToExpense = (dbExpense: DbExpense): Expense => {
    // Map status
    let status: 'pending' | 'approved' | 'rejected';
    switch (dbExpense.status?.toUpperCase()) {
      case 'APPROVED':
        status = 'approved';
        break;
      case 'REJECTED':
        status = 'rejected';
        break;
      default:
        status = 'pending';
    }

    // Map category
    let category: 'fuel' | 'parking' | 'tolls' | 'maintenance' | 'meals' | 'accommodation' | 'other' = 'other';
    const categoryName = dbExpense.expense_categories?.name?.toLowerCase();
    if (categoryName) {
      if (categoryName.includes('fuel') || categoryName.includes('gas')) category = 'fuel';
      else if (categoryName.includes('parking')) category = 'parking';
      else if (categoryName.includes('toll')) category = 'tolls';
      else if (categoryName.includes('maintenance') || categoryName.includes('repair')) category = 'maintenance';
      else if (categoryName.includes('meal') || categoryName.includes('food') || categoryName.includes('restaurant')) category = 'meals';
      else if (categoryName.includes('accommodation') || categoryName.includes('hotel')) category = 'accommodation';
    }

    return {
      id: dbExpense.expense_id,
      description: dbExpense.description || t('no_description', 'No description'),
      amount: dbExpense.amount,
      currency: dbExpense.currency,
      category,
      date: dbExpense.expense_date,
      status,
      tripId: dbExpense.trip_id || undefined,
      vehicleName: dbExpense.vehicles ? `${dbExpense.vehicles.make} ${dbExpense.vehicles.model} (${dbExpense.vehicles.license_plate})` : undefined,
      tripName: undefined, // We could join trip data later if needed
    };
  };

  // Convert expenses data
  const expenses: Expense[] = expensesData ? expensesData.map(convertDbExpenseToExpense) : [];

  const fetchExpenses = async () => {
    setIsLoading(true);
    await refetch();
    setIsLoading(false);
  };

  const getCategoryIconDetails = (category: string): { name: string; type: 'ionicon' | 'material' } => {
    switch (category) {
      case 'fuel': return { name: 'gas-station', type: 'material' };
      case 'parking': return { name: 'car-sport-outline', type: 'ionicon' };
      case 'tolls': return { name: 'card-outline', type: 'ionicon' };
      case 'maintenance': return { name: 'settings-outline', type: 'ionicon' };
      case 'meals': return { name: 'restaurant-outline', type: 'ionicon' };
      case 'accommodation': return { name: 'bed-outline', type: 'ionicon' };
      default: return { name: 'receipt-outline', type: 'ionicon' };
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fuel': return screenColors.categoryFuel;
      case 'parking': return screenColors.categoryParking;
      case 'tolls': return screenColors.categoryTolls;
      case 'maintenance': return screenColors.warning;
      case 'meals': return screenColors.categoryMeals;
      case 'accommodation': return screenColors.categoryAccommodation;
      default: return screenColors.gray;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return screenColors.warning;
      case 'approved': return screenColors.success;
      case 'rejected': return screenColors.danger;
      default: return screenColors.gray;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return t('pending', 'Pending');
      case 'approved': return t('approved', 'Approved');
      case 'rejected': return t('rejected', 'Rejected');
      default: return t('unknown', 'Unknown');
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    if (activeFilter === 'all') return true;
    return expense.status === activeFilter;
  });

  const handleAddExpense = () => {
    navigation.navigate('AddExpense');
  };

  const handleDeleteExpense = async (expenseId: string, description: string) => {
    try {
      await deleteExpense(expenseId).unwrap();
      Alert.alert(
        t('success', 'Success'),
        t('expense_deleted_successfully', 'Expense deleted successfully'),
        [{ text: t('ok', 'OK'), style: 'default' }]
      );
    } catch (error) {
      console.error('Error deleting expense:', error);
      Alert.alert(
        t('error', 'Error'),
        t('failed_delete_expense', 'Failed to delete expense. Please try again.'),
        [{ text: t('ok', 'OK'), style: 'default' }]
      );
    }
  };

  const handleExpensePress = (expense: Expense) => {
    Alert.alert(
      `${t('expense', 'Expense')}: ${expense.description}`,
      `${t('amount', 'Amount')}: ${expense.amount.toFixed(2)} ${expense.currency}\n${t('category', 'Category')}: ${expense.category}\n${t('date', 'Date')}: ${formatDate(expense.date)} at ${formatTime(expense.date)}\n${t('status', 'Status')}: ${getStatusText(expense.status)}${expense.tripName ? '\n' + t('trip', 'Trip') + ': ' + expense.tripName : ''}`,
      [
        { text: t('edit', 'Edit'), onPress: () => navigation.navigate('EditExpense', { expenseId: expense.id }) },
        { 
          text: t('delete', 'Delete'), 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              t('confirm_delete', 'Confirm Delete'),
              t('are_you_sure_delete_expense', 'Are you sure you want to delete this expense?'),
              [
                { text: t('cancel', 'Cancel'), style: 'cancel' },
                { 
                  text: t('delete', 'Delete'), 
                  style: 'destructive',
                  onPress: () => handleDeleteExpense(expense.id, expense.description)
                }
              ]
            );
          }
        },
        { text: t('cancel', 'Cancel'), style: 'cancel' }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateTotal = () => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const styles = getStyles(screenColors);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
      <StatusBar 
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={screenColors.background}
      />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle]}>{t('expenses_title', 'Expenses')}</Text>
      </View>

      <View style={[styles.summaryCard]}>
        <View style={styles.summaryContent}>
            <Ionicons name="wallet-outline" size={28} color={screenColors.primary} />
            <View style={styles.summaryTextContainer}>
                <Text style={[styles.summaryLabel, { color: screenColors.text }]}>{`${t('total', 'Total')} ${activeFilter !== 'all' ? t(activeFilter, activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)) : ''} ${t('expenses', 'Expenses')}`.trim()}</Text>
                <View style={styles.summaryTotalContainer}>
                  <Text style={[styles.summaryTotalLabel, { color: screenColors.textSecondary }]}>
                    {filteredExpenses.length > 0 ? t('total', 'Total') + ": " : ""}
                  </Text>
                  <Text style={[styles.summaryTotalAmount, { color: screenColors.text }]}>
                    {calculateTotal().toFixed(2)} {expenses.length > 0 ? expenses[0].currency : 'EUR'}
                  </Text>
                </View>
            </View>
        </View>
        <Text style={[styles.summaryDetails, { color: screenColors.textSecondary }]}>
            {filteredExpenses.length === 1 
              ? `1 ${t('expense', 'expense')}` 
              : `${filteredExpenses.length} ${t('expenses', 'expenses')}`}
        </Text>
      </View>

      <View style={styles.filterContainer}>
        {['all', 'pending', 'approved', 'rejected'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              {
                backgroundColor: activeFilter === filter ? screenColors.filterActiveBackground : screenColors.filterInactiveBackground,
                borderColor: activeFilter === filter ? screenColors.primary : screenColors.border,
              }
            ]}
            onPress={() => setActiveFilter(filter as any)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: activeFilter === filter ? screenColors.filterActiveText : screenColors.filterInactiveText,
                }
              ]}
            >
              {t(filter, filter.charAt(0).toUpperCase() + filter.slice(1))}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Fuel Management Module */}
      <FuelManagementCompact />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchExpenses}
            tintColor={screenColors.primary}
            colors={[screenColors.primary]}
            title={t('refreshing', 'Refreshing...')}
            titleColor={screenColors.textSecondary}
          />
        }
      >
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => {
            const iconDetails = getCategoryIconDetails(expense.category);
            const iconColor = getCategoryColor(expense.category);
            return (
              <TouchableOpacity 
                key={expense.id} 
                style={styles.expenseCard}
                onPress={() => handleExpensePress(expense)}
              >
                <View style={[styles.categoryIndicator, { backgroundColor: iconColor }]} />
                <View style={styles.expenseDetails}>
                  <View style={styles.expenseRow}>
                    <Text style={styles.expenseDescription} numberOfLines={1}>{expense.description}</Text>
                    <Text style={styles.expenseAmount}>{expense.amount.toFixed(2)} {expense.currency}</Text>
                  </View>
                  <View style={styles.expenseRow}>
                    <Text style={styles.expenseMeta}>
                      {formatDate(expense.date)} at {formatTime(expense.date)}
                      {expense.vehicleName ? ` - ${t('vehicle', 'Vehicle')}: ${expense.vehicleName}` : ""}
                      {expense.tripName ? ` - ${t('trip', 'Trip')}: ${expense.tripName}` : ""}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(expense.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(expense.status)}</Text>
                    </View>
                  </View>
                </View>
                {iconDetails.type === 'ionicon' ? (
                  <Ionicons name={iconDetails.name as any} size={22} color={iconColor} style={styles.categoryIcon} />
                ) : (
                  <MaterialCommunityIcons name={iconDetails.name as any} size={22} color={iconColor} style={styles.categoryIcon} />
                )}
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="receipt-outline" size={48} color={screenColors.textSecondary} />
            <Text style={[styles.emptyStateText, { color: screenColors.textSecondary }]}>
              {t('no_expenses_found_for_filter', 'No expenses found for "{{filter}}" filter.', { filter: t(activeFilter, activeFilter) })}
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: screenColors.textSecondary }]}>
              {t('try_different_filter_or_add_expense', 'Try selecting a different filter or add a new expense.')}
            </Text>
          </View>
        )}
        <View style={{ height: 80 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleAddExpense}>
        <Ionicons name="add" size={30} color={screenColors.white} />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const getStyles = (screenColors: any) => StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor direktno na SafeAreaView
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: screenColors.border,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: screenColors.text,
  },
  summaryCard: {
    backgroundColor: screenColors.card,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 12,
    padding: 15,
    shadowColor: screenColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: screenColors.textSecondary,
    marginBottom: 2,
  },
  summaryTotalContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  summaryTotalLabel: {
    fontSize: 14,
    color: screenColors.textSecondary,
    marginRight: 4,
  },
  summaryTotalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: screenColors.primary,
  },
  summaryDetails: {
    fontSize: 12,
    color: screenColors.textSecondary,
    marginTop: 8,
    textAlign: 'right',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: screenColors.background,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  fuelModuleContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 10,
  },
  expenseCard: {
    backgroundColor: screenColors.card,
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: screenColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIndicator: {
    width: 6,
    height: '80%', // Malo manje od visine kartice
    borderRadius: 3,
    marginRight: 12,
  },
  expenseDetails: {
    flex: 1,
    marginRight: 8,
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4, // Mali razmak između redova unutar kartice
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: screenColors.text,
    flexShrink: 1, // Da ne gura iznos
    marginRight: 5,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: screenColors.primary,
  },
  expenseMeta: {
    fontSize: 12,
    color: screenColors.textSecondary,
    flexShrink: 1, // Da može da se smanji
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 5, // Mali razmak od meta teksta
  },
  statusText: {
    color: screenColors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryIcon: {
    // Nema potrebe za stilom ovde, boja se postavlja direktno
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: screenColors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: screenColors.gray,
    textAlign: 'center',
    marginTop: 5,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: screenColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: screenColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
}); 