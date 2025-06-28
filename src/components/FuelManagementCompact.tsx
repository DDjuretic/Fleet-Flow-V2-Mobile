import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useSelector } from 'react-redux';
import { RootState } from '../store/rootReducer';
import Colors from '../constants/Colors';
import { useGetVehiclesQuery, useGetExpensesQuery, DbVehicle, DbExpense } from '../store/api/supabaseApi';

interface FuelManagementCompactProps {
  onPress?: () => void;
}

const FuelManagementCompact: React.FC<FuelManagementCompactProps> = ({ onPress }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  
  const screenColors = themeMode === 'dark' ? Colors.DARK : Colors.LIGHT;

  // Use same API as Vehicle Management
  const { data: vehicles = [], isLoading: loading, error } = useGetVehiclesQuery();
  const { data: expenses = [], isLoading: expensesLoading } = useGetExpensesQuery();
  const [selectedVehicle, setSelectedVehicle] = useState<DbVehicle | null>(null);
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);
  
  // Calculate real fuel data from expenses
  const calculateFuelData = (vehicleId: string) => {
    if (!expenses.length) return { balance: 0, totalLiters: 0, totalCost: 0, avgPrice: 0 };
    
    console.log('⛽ DEBUG: All expenses for vehicle:', vehicleId);
    const vehicleExpenses = expenses.filter((expense: DbExpense) => expense.vehicle_id === vehicleId);
    console.log('⛽ DEBUG: Vehicle expenses count:', vehicleExpenses.length);
    
    vehicleExpenses.forEach((expense: DbExpense) => {
      console.log('⛽ DEBUG: Expense details:', {
        id: expense.expense_id,
        amount: expense.amount,
        category: expense.expense_categories?.name,
        status: expense.status,
        fuel_liters: expense.fuel_liters,
        description: expense.description
      });
    });
    
    // Filter fuel expenses for selected vehicle (relaxed filtering)
    const fuelExpenses = expenses.filter((expense: DbExpense) => 
      expense.vehicle_id === vehicleId && 
      (
        expense.expense_categories?.name?.toLowerCase().includes('fuel') ||
        expense.expense_categories?.name?.toLowerCase().includes('goriv') ||
        expense.fuel_liters !== null
      ) &&
      (expense.status?.toUpperCase() === 'APPROVED' || expense.status?.toUpperCase() === 'PENDING')
    );
    
    console.log('⛽ Found fuel expenses:', fuelExpenses.length, 'for vehicle:', vehicleId);
    
    let totalCost = 0;
    let totalLiters = 0;
    
    fuelExpenses.forEach((expense: DbExpense) => {
      totalCost += expense.amount;
      if (expense.fuel_liters) {
        totalLiters += expense.fuel_liters;
      }
    });
    
    const avgPrice = totalLiters > 0 ? totalCost / totalLiters : 0;
    
    // Get vehicle tank capacity 
    const selectedVehicleData = vehicles.find(v => v.vehicle_id === vehicleId);
    const tankCapacity = selectedVehicleData?.fuel_tank_capacity || 50; // Default 50L
    
    // Current fuel balance in liters (limited by tank capacity)
    const currentFuelBalance = Math.min(totalLiters, tankCapacity);
    
    console.log('⛽ FUEL CALCULATION:');
    console.log('- Total liters added:', totalLiters);
    console.log('- Tank capacity:', tankCapacity + 'L');
    console.log('- Current balance:', currentFuelBalance + 'L');
    console.log('- Total cost:', totalCost + ' EUR');
    
    return {
      balance: currentFuelBalance, // Now in LITERS
      totalLiters,
      totalCost,
      avgPrice
    };
  };
  
  const fuelData = selectedVehicle ? calculateFuelData(selectedVehicle.vehicle_id) : { balance: 0, totalLiters: 0, totalCost: 0, avgPrice: 0 };
  const estimatedRange = fuelData.totalLiters > 0 ? Math.round(fuelData.totalLiters * 12) : 0; // Assume 12km per liter

  useEffect(() => {
    console.log('⛽ FuelManagementCompact: Vehicles loaded:', vehicles.length);
    console.log('⛽ FuelManagementCompact: Expenses loaded:', expenses.length);
    
    // Auto-select first vehicle if none selected
    if (vehicles.length > 0 && !selectedVehicle) {
      setSelectedVehicle(vehicles[0]);
      console.log('⛽ Auto-selected vehicle:', vehicles[0].make, vehicles[0].model);
    }
  }, [vehicles, selectedVehicle, expenses]);

  // Log fuel data when vehicle changes
  useEffect(() => {
    if (selectedVehicle) {
      console.log('⛽ Selected vehicle fuel data:', fuelData);
    }
  }, [selectedVehicle, fuelData]);

  const getFuelTypeIcon = (vehicle: DbVehicle | null) => {
    if (!vehicle) return 'car-outline';
    const fuelType = vehicle.fuel_types?.name?.toLowerCase();
    switch (fuelType) {
      case 'electric':
        return 'flash';
      case 'diesel':
        return 'car-outline';
      case 'gasoline':
      case 'petrol':
        return 'car-sport-outline';
      case 'hybrid':
        return 'leaf-outline';
      default:
        return 'car-outline';
    }
  };

  const getFuelTypeColor = (vehicle: DbVehicle | null) => {
    if (!vehicle) return screenColors.primary;
    const fuelType = vehicle.fuel_types?.name?.toLowerCase();
    switch (fuelType) {
      case 'electric':
        return '#10B981'; // green
      case 'diesel':
        return '#F59E0B'; // amber
      case 'gasoline':
      case 'petrol':
        return '#EF4444'; // red
      case 'hybrid':
        return '#8B5CF6'; // purple
      default:
        return screenColors.primary;
    }
  };

  const handleHeaderPress = () => {
    const tankCapacity = selectedVehicle?.fuel_tank_capacity || 50;
    Alert.alert(
      t('fuel_details', 'Fuel Details'),
      `${t('vehicle', 'Vehicle')}: ${selectedVehicle?.make} ${selectedVehicle?.model}\n\n🔋 ${t('fuel_in_tank', 'Fuel in Tank')}: ${fuelData.balance.toFixed(1)}L / ${tankCapacity}L\n⛽ Total Added: ${fuelData.totalLiters.toFixed(1)}L\n💰 Total Cost: €${fuelData.totalCost.toFixed(2)}\n💸 Avg Price: €${fuelData.avgPrice.toFixed(2)}/L\n🛣️ ${t('estimated_range', 'Est. Range')}: ${estimatedRange} km\n\n${t('based_on_fuel_expenses', 'Based on approved fuel expenses')}`,
      [
        { text: t('ok', 'OK'), style: 'cancel' }
      ]
    );
  };

  const handleVehicleSelect = (vehicle: DbVehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleSelector(false);
  };

    if (loading || expensesLoading) {
    return (
      <View style={[styles.container, { backgroundColor: screenColors.card }]}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="small" color={screenColors.primary} />
          <Text style={[styles.loadingText, { color: screenColors.textSecondary }]}>
            Loading fuel data...
          </Text>
        </View>
      </View>
    );
  }

  if (error || vehicles.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: screenColors.card }]}>
        <TouchableOpacity 
          style={styles.errorContent}
                     onPress={() => Alert.alert(t('no_vehicles_found', 'No Vehicles'), t('add_vehicles_in_management', 'Please add vehicles in Vehicle Management first.'))}
        >
          <Ionicons name="warning-outline" size={20} color={screenColors.textSecondary} />
                     <Text style={[styles.errorText, { color: screenColors.textSecondary }]}>
             {t('no_vehicle_found', 'No vehicles available')}
           </Text>
           <Text style={[styles.errorSubtext, { color: screenColors.textSecondary }]}>
             {t('tap_to_retry', 'Tap to retry')}
           </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: screenColors.card }]}>
      {/* Header with fuel balance */}
      <TouchableOpacity 
        style={styles.header}
        onPress={handleHeaderPress}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.fuelIcon, { backgroundColor: getFuelTypeColor(selectedVehicle) + '20' }]}>
            <Ionicons 
              name={getFuelTypeIcon(selectedVehicle)} 
              size={20} 
              color={getFuelTypeColor(selectedVehicle)} 
            />
          </View>
          <View style={styles.fuelInfo}>
                       <Text style={[styles.fuelBalance, { color: screenColors.text }]}>
             {fuelData.balance.toFixed(1)}L
           </Text>
                         <Text style={[styles.fuelLabel, { color: screenColors.textSecondary }]}>
               {t('fuel_in_tank', 'Fuel in Tank')}
             </Text>
          </View>
        </View>
                 <View style={styles.headerRight}>
           <Text style={[styles.rangeText, { color: screenColors.text }]}>
             {estimatedRange > 0 ? `${estimatedRange} km` : 'No data'}
           </Text>
           <Text style={[styles.rangeLabel, { color: screenColors.textSecondary }]}>
             {t('estimated_range', 'Est. Range')}
           </Text>
         </View>
      </TouchableOpacity>

      {/* Vehicle selector */}
      <TouchableOpacity 
        style={[styles.vehicleSelector, { borderTopColor: screenColors.border }]}
        onPress={() => setShowVehicleSelector(true)}
        activeOpacity={0.7}
      >
        <View style={styles.vehicleInfo}>
          <Ionicons 
            name="car-outline" 
            size={16} 
            color={screenColors.primary} 
          />
                     <Text style={[styles.vehicleName, { color: screenColors.text }]} numberOfLines={1}>
             {selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : t('select_vehicle', 'Select Vehicle')}
           </Text>
        </View>
        <View style={styles.vehicleRight}>
          <Text style={[styles.vehiclePlate, { color: screenColors.textSecondary }]} numberOfLines={1}>
            {selectedVehicle?.license_plate}
          </Text>
          <Ionicons name="chevron-down" size={16} color={screenColors.textSecondary} />
        </View>
      </TouchableOpacity>

      {/* Vehicle Selection Modal */}
      <Modal
        visible={showVehicleSelector}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: screenColors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: screenColors.card, borderBottomColor: screenColors.border }]}>
                         <Text style={[styles.modalTitle, { color: screenColors.text }]}>
               {t('select_vehicle', 'Select Vehicle')}
             </Text>
            <TouchableOpacity onPress={() => setShowVehicleSelector(false)}>
              <Ionicons name="close" size={24} color={screenColors.text} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={vehicles}
            keyExtractor={(item) => item.vehicle_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.vehicleItem,
                  { backgroundColor: screenColors.card },
                  selectedVehicle?.vehicle_id === item.vehicle_id && { backgroundColor: screenColors.primary + '20' }
                ]}
                onPress={() => handleVehicleSelect(item)}
              >
                <View style={[styles.vehicleItemIcon, { backgroundColor: getFuelTypeColor(item) + '20' }]}>
                  <Ionicons 
                    name={getFuelTypeIcon(item)} 
                    size={20} 
                    color={getFuelTypeColor(item)} 
                  />
                </View>
                <View style={styles.vehicleItemInfo}>
                  <Text style={[styles.vehicleItemName, { color: screenColors.text }]}>
                    {item.make} {item.model}
                  </Text>
                  <Text style={[styles.vehicleItemDetails, { color: screenColors.textSecondary }]}>
                    {item.license_plate} • {item.fuel_types?.name || 'Unknown fuel'}
                  </Text>
                </View>
                {selectedVehicle?.vehicle_id === item.vehicle_id && (
                  <Ionicons name="checkmark-circle" size={20} color={screenColors.primary} />
                )}
              </TouchableOpacity>
            )}
            style={styles.vehicleList}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
  },
  errorContent: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  errorSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fuelIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fuelInfo: {
    flex: 1,
  },
  fuelBalance: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  fuelLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  rangeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  rangeLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  vehicleSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  vehicleRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehiclePlate: {
    fontSize: 12,
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  vehicleList: {
    flex: 1,
  },
  vehicleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  vehicleItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vehicleItemInfo: {
    flex: 1,
  },
  vehicleItemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  vehicleItemDetails: {
    fontSize: 14,
    marginTop: 2,
  },
});

export default FuelManagementCompact; 