import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useSelector } from 'react-redux';
import { RootState } from '../store/rootReducer';
import Colors from '../constants/Colors';
import { useGetVehiclesQuery, useGetExpensesQuery } from '../store/api/supabaseApi';

interface FuelManagementModuleFixedProps {
  onPress?: () => void;
}

const FuelManagementModuleFixed: React.FC<FuelManagementModuleFixedProps> = ({ onPress }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  
  const screenColors = themeMode === 'dark' ? Colors.DARK : Colors.LIGHT;

  // Use RTK Query hooks with error handling
  const { data: vehicles = [], isLoading: vehiclesLoading, error: vehiclesError } = useGetVehiclesQuery();
  const { data: expenses = [], isLoading: expensesLoading, error: expensesError } = useGetExpensesQuery();
  
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [fuelStats, setFuelStats] = useState({
    balance: 0,
    totalLiters: 0,
    totalCost: 0,
    estimatedRange: 0
  });

  // Calculate fuel data from expenses (safe approach)
  const calculateFuelData = (vehicleId: string) => {
    try {
      if (!expenses.length || !vehicleId) {
        return { balance: 0, totalLiters: 0, totalCost: 0, estimatedRange: 0 };
      }
      
      // Filter fuel expenses for selected vehicle
      const fuelExpenses = expenses.filter((expense: any) => 
        expense.vehicle_id === vehicleId && 
        (
          expense.expense_categories?.name?.toLowerCase().includes('fuel') ||
          expense.expense_categories?.name?.toLowerCase().includes('goriv') ||
          expense.fuel_liters !== null
        ) &&
        (expense.status?.toUpperCase() === 'APPROVED' || expense.status?.toUpperCase() === 'PENDING')
      );
      
      let totalCost = 0;
      let totalLiters = 0;
      
      fuelExpenses.forEach((expense: any) => {
        totalCost += expense.amount || 0;
        if (expense.fuel_liters) {
          totalLiters += expense.fuel_liters;
        }
      });
      
             // Get vehicle tank capacity safely
       const selectedVehicleData = vehicles.find(v => v.vehicle_id === vehicleId);
       const tankCapacity = selectedVehicleData?.fuel_tank_capacity || 
                           selectedVehicleData?.battery_capacity_kwh || 
                           50; // Default 50L
      
      // Current fuel balance in liters (limited by tank capacity)
      const currentFuelBalance = Math.min(totalLiters, tankCapacity);
      const estimatedRange = totalLiters > 0 ? Math.round(totalLiters * 12) : 0; // Assume 12km per liter
      
      return {
        balance: currentFuelBalance,
        totalLiters,
        totalCost,
        estimatedRange
      };
    } catch (error) {
      console.error('Error calculating fuel data:', error);
      return { balance: 0, totalLiters: 0, totalCost: 0, estimatedRange: 0 };
    }
  };

  useEffect(() => {
    // Auto-select first vehicle if none selected and vehicles are loaded
    if (vehicles.length > 0 && !selectedVehicle && !vehiclesLoading) {
      setSelectedVehicle(vehicles[0]);
    }
  }, [vehicles, selectedVehicle, vehiclesLoading]);

  useEffect(() => {
    // Calculate fuel stats when vehicle or expenses change
    if (selectedVehicle && !expensesLoading) {
      const stats = calculateFuelData(selectedVehicle.vehicle_id);
      setFuelStats(stats);
    }
  }, [selectedVehicle, expenses, expensesLoading]);

  const getFuelTypeIcon = (fuelType: string) => {
    switch (fuelType?.toLowerCase()) {
      case 'electric':
        return 'lightning-bolt';
      case 'diesel':
        return 'gas-station';
      case 'gasoline':
      case 'petrol':
        return 'gas-station';
      case 'hybrid':
        return 'leaf';
      default:
        return 'gas-station';
    }
  };

  const formatFuelType = (fuelType: string) => {
    switch (fuelType?.toLowerCase()) {
      case 'gasoline': return t('fuel.types.gasoline', 'Gasoline');
      case 'diesel': return t('fuel.types.diesel', 'Diesel');
      case 'electric': return t('fuel.types.electric', 'Electric');
      case 'hybrid': return t('fuel.types.hybrid', 'Hybrid');
      default: return fuelType || 'Unknown';
    }
  };

  // Handle loading states
  if (vehiclesLoading || expensesLoading) {
    return (
      <View style={[styles.container, { backgroundColor: screenColors.card }]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons
              name="gas-station"
              size={24}
              color={screenColors.primary}
            />
            <Text style={[styles.title, { color: screenColors.text }]}>
              {t('fuel.title', 'Fuel Management')}
            </Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={screenColors.primary} />
          <Text style={[styles.loadingText, { color: screenColors.textSecondary }]}>
            {t('fuel.loading', 'Loading fuel data...')}
          </Text>
        </View>
      </View>
    );
  }

  // Handle error states
  if (vehiclesError || expensesError) {
    return (
      <View style={[styles.container, { backgroundColor: screenColors.card }]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={24}
              color={screenColors.danger}
            />
            <Text style={[styles.title, { color: screenColors.text }]}>
              {t('fuel.title', 'Fuel Management')}
            </Text>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: screenColors.danger }]}>
            {t('fuel.errors.loadingData', 'Error loading fuel data')}
          </Text>
          <Text style={[styles.errorSubtext, { color: screenColors.textSecondary }]}>
            {vehiclesError ? 'Vehicles error' : 'Expenses error'}
          </Text>
        </View>
      </View>
    );
  }

  // Handle no vehicles state
  if (!vehicles.length) {
    return (
      <View style={[styles.container, { backgroundColor: screenColors.card }]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons
              name="car-off"
              size={24}
              color={screenColors.textSecondary}
            />
            <Text style={[styles.title, { color: screenColors.text }]}>
              {t('fuel.title', 'Fuel Management')}
            </Text>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: screenColors.textSecondary }]}>
            {t('please_add_vehicles_first', 'Please add vehicles first')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: screenColors.card }]}
      onPress={onPress}
      disabled={!selectedVehicle}
    >
      {/* Header with Fuel Balance */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name={getFuelTypeIcon(selectedVehicle?.fuel_type || 'gasoline')}
            size={24}
            color={screenColors.primary}
          />
          <Text style={[styles.title, { color: screenColors.text }]}>
            {t('fuel.title', 'Fuel Management')}
          </Text>
        </View>
        <View style={styles.fuelBalance}>
          <Text style={[styles.balanceValue, { color: screenColors.primary }]}>
            {fuelStats.balance.toFixed(1)} {selectedVehicle?.fuel_type === 'electric' ? 'kWh' : 'L'}
          </Text>
          <Text style={[styles.balanceLabel, { color: screenColors.textSecondary }]}>
            {t('fuel.balance', 'Fuel Balance')}
          </Text>
        </View>
      </View>

      {/* Vehicle Info */}
      <View style={styles.vehicleInfo}>
        <View style={styles.vehicleDetails}>
          <Text style={[styles.vehicleName, { color: screenColors.text }]}>
            {selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : t('fuel.selectVehicle', 'Select Vehicle')}
          </Text>
          {selectedVehicle && (
            <Text style={[styles.vehiclePlate, { color: screenColors.textSecondary }]}>
              {selectedVehicle.license_plate} • {formatFuelType(selectedVehicle.fuel_type)}
            </Text>
          )}
        </View>
        <View style={styles.vehicleStats}>
          <Text style={[styles.rangeText, { color: screenColors.textSecondary }]}>
            ~{fuelStats.estimatedRange} km
          </Text>
          <Text style={[styles.costText, { color: screenColors.textSecondary }]}>
            €{fuelStats.totalCost.toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  fuelBalance: {
    alignItems: 'flex-end',
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  balanceLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  vehicleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  vehiclePlate: {
    fontSize: 12,
  },
  vehicleStats: {
    alignItems: 'flex-end',
  },
  rangeText: {
    fontSize: 12,
    marginBottom: 2,
  },
  costText: {
    fontSize: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  errorSubtext: {
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
  },
});

export default FuelManagementModuleFixed; 