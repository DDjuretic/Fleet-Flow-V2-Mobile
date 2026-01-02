import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  FlatList,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useSelector } from 'react-redux';
import { RootState } from '../store/rootReducer';
import Colors from '../constants/Colors';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  license_plate: string;
  fuel_type: string;
  // Using only existing columns until database is updated
  consumption?: number; // fallback to existing column
  company_id: string;
  // Optional columns that may not exist yet
  average_consumption?: number;
  city_consumption?: number;
  highway_consumption?: number;
  is_favorite?: boolean;
  current_fuel_level?: number;
  tank_capacity?: number;
  fuel_capacity?: number;
}

interface FuelRecord {
  id: string;
  vehicle_id: string;
  amount: number;
  cost: number;
  fuel_price_per_unit: number;
  date: string;
  is_full_tank: boolean;
  location?: string;
  notes?: string;
}

interface FuelStats {
  totalRefilled: number;
  businessConsumption: number;
  privateConsumption: number;
  currentLevel: number;
  estimatedRange: number;
  totalCost: number;
  businessCost: number;
  fuelBalance: number;
  averagePrice: number;
}

interface FuelManagementModuleProps {
  onFuelExpenseAdded?: () => void;
}

const FuelManagementModule: React.FC<FuelManagementModuleProps> = ({ 
  onFuelExpenseAdded 
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  
  const screenColors = themeMode === 'dark' ? Colors.DARK : Colors.LIGHT;

  const [loading, setLoading] = useState(true);
  
  // Data states
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [fuelStats, setFuelStats] = useState<FuelStats | null>(null);
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);

  // Modal states
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Form states
  const [refillAmount, setRefillAmount] = useState('');
  const [refillCost, setRefillCost] = useState('');
  const [isFullTank, setIsFullTank] = useState(false);
  const [refillLocation, setRefillLocation] = useState('');

  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  useEffect(() => {
    if (selectedVehicle) {
      loadVehicleData();
    }
  }, [selectedVehicle]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await loadVehicles();
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadVehicles = async () => {
    try {
      // Get basic vehicle info that should exist
      const { data: basicVehicles, error: basicError } = await supabase
        .from('vehicles')
        .select(`
          id,
          make,
          model,
          license_plate,
          fuel_type,
          consumption,
          company_id
        `)
        .eq('company_id', (user as any)?.user_metadata?.company_id);

      if (basicError) {
        console.error('Error loading basic vehicles:', basicError);
        Alert.alert(t('common.error'), basicError.message);
        return;
      }

      if (basicVehicles && basicVehicles.length > 0) {
        // Try to get extended vehicle info, but don't fail if columns don't exist
        let vehiclesData = basicVehicles;
        
        try {
          const { data: extendedVehicles, error: extendedError } = await supabase
            .from('vehicles')
            .select(`
              id,
              make,
              model,
              license_plate,
              fuel_type,
              consumption,
              average_consumption,
              city_consumption,
              highway_consumption,
              is_favorite,
              current_fuel_level,
              tank_capacity,
              fuel_capacity,
              company_id
            `)
            .eq('company_id', (user as any)?.user_metadata?.company_id);

          if (!extendedError && extendedVehicles) {
            vehiclesData = extendedVehicles;
            console.log('Loaded extended vehicle data');
          } else {
            console.log('Using basic vehicle data, extended columns not available:', extendedError?.message);
          }
        } catch (extendedError) {
          console.log('Extended vehicle data not available, using basic data');
        }

        setVehicles(vehiclesData);
        
        // Set the first vehicle as default if none is selected
        if (vehiclesData.length > 0 && !selectedVehicle) {
          setSelectedVehicle(vehiclesData[0]);
        }
      } else {
        console.log('No vehicles found for company');
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
      Alert.alert(t('common.error'), 'Failed to load vehicles');
    }
  };

  const loadVehicleData = async () => {
    if (!selectedVehicle) return;

    try {
      await Promise.all([
        calculateFuelStats(),
        loadFuelRecords()
      ]);
    } catch (error) {
      console.error('Error loading vehicle data:', error);
    }
  };

  const loadFuelRecords = async () => {
    if (!selectedVehicle) return;

    try {
      // Check if fuel_records table exists
      const { data: records, error } = await supabase
        .from('fuel_records')
        .select('*')
        .eq('vehicle_id', selectedVehicle.id)
        .order('date', { ascending: false })
        .limit(20);

      if (error && error.code === 'PGRST204') {
        console.log('fuel_records table not found, creating empty records');
        setFuelRecords([]);
      } else if (error) {
        console.error('Error loading fuel records:', error);
        setFuelRecords([]);
      } else {
        setFuelRecords(records || []);
      }
    } catch (error) {
      console.error('Error loading fuel records:', error);
      setFuelRecords([]);
    }
  };

  const calculateFuelStats = async () => {
    if (!selectedVehicle) return;

    try {
      // Get total refilled amount from fuel_records if available
      let totalRefilled = 0;
      let totalCost = 0;
      
      try {
        const { data: refillData, error: refillError } = await supabase
          .from('fuel_records')
          .select('amount, cost')
          .eq('vehicle_id', selectedVehicle.id);

        if (!refillError && refillData) {
          totalRefilled = refillData.reduce((sum, record) => sum + record.amount, 0);
          totalCost = refillData.reduce((sum, record) => sum + record.cost, 0);
        }
      } catch (error) {
        console.log('fuel_records table not available, using default values');
      }

      // Get fuel level from vehicle_fuel_levels if available, otherwise use defaults
      let currentLevel = 50; // Default 50L
      
      try {
        const { data: levelData, error: levelError } = await supabase
          .from('vehicle_fuel_levels')
          .select('current_level')
          .eq('vehicle_id', selectedVehicle.id)
          .single();

        if (!levelError && levelData) {
          currentLevel = levelData.current_level;
        } else if (selectedVehicle.current_fuel_level) {
          currentLevel = selectedVehicle.current_fuel_level;
        }
      } catch (error) {
        console.log('vehicle_fuel_levels table not available, using default level');
      }
      
      // Calculate fuel balance (remaining fuel cost)
      const averagePrice = totalRefilled > 0 ? totalCost / totalRefilled : 1.5; // Default €1.5/L
      const fuelBalance = currentLevel * averagePrice;
      
      // Simplified calculation for demo
      const businessConsumption = totalRefilled * 0.7; // 70% business use
      const privateConsumption = totalRefilled * 0.3; // 30% private use
      const businessCost = totalCost * 0.7;
      
      // Use available consumption data or defaults
      const consumptionRate = selectedVehicle.city_consumption || 
                             selectedVehicle.average_consumption || 
                             selectedVehicle.consumption || 
                             8.0; // Default 8L/100km
      
      const estimatedRange = consumptionRate > 0 ? (currentLevel / consumptionRate) * 100 : 0;

      setFuelStats({
        totalRefilled,
        businessConsumption,
        privateConsumption,
        currentLevel,
        estimatedRange,
        totalCost,
        businessCost,
        fuelBalance,
        averagePrice
      });

    } catch (error) {
      console.error('Error calculating fuel stats:', error);
      // Set default stats if calculation fails
      setFuelStats({
        totalRefilled: 0,
        businessConsumption: 0,
        privateConsumption: 0,
        currentLevel: 50,
        estimatedRange: 625, // 50L * 100km / 8L per 100km
        totalCost: 0,
        businessCost: 0,
        fuelBalance: 75, // 50L * €1.5
        averagePrice: 1.5
      });
    }
  };

  const handleRefill = async () => {
    if (!selectedVehicle || !refillAmount || !refillCost) {
      Alert.alert(t('common.error'), t('fuel.errors.fillAllFields'));
      return;
    }

    try {
      const amount = parseFloat(refillAmount);
      const cost = parseFloat(refillCost);
      const pricePerUnit = cost / amount;

      // Insert fuel record
      const { error: recordError } = await supabase
        .from('fuel_records')
        .insert({
          vehicle_id: selectedVehicle.id,
          user_id: (user as any)?.id,
          amount,
          cost,
          fuel_price_per_unit: pricePerUnit,
          date: new Date().toISOString(),
          is_full_tank: isFullTank,
          location: refillLocation || null
        });

      if (recordError) throw recordError;

      // Update or insert fuel level
      const newLevel = (fuelStats?.currentLevel || 0) + amount;
      const { error: levelError } = await supabase
        .from('vehicle_fuel_levels')
        .upsert({
          vehicle_id: selectedVehicle.id,
          current_level: newLevel,
          last_updated: new Date().toISOString()
        }, { onConflict: 'vehicle_id' });

      if (levelError) console.error('Level update error:', levelError);

      // Update vehicle current fuel level
      const { error: vehicleError } = await supabase
        .from('vehicles')
        .update({ current_fuel_level: newLevel })
        .eq('id', selectedVehicle.id);

      if (vehicleError) console.error('Vehicle update error:', vehicleError);

      // Create expense record for business use
      const businessAmount = cost * 0.7; // Assume 70% business use
      if (businessAmount > 0) {
        const { error: expenseError } = await supabase
          .from('expenses')
          .insert({
            user_id: (user as any)?.id,
            vehicle_id: selectedVehicle.id,
            expense_category_id: 1, // Fuel category
            amount: businessAmount,
            description: `Fuel refill - ${selectedVehicle.make} ${selectedVehicle.model}`,
            expense_date: new Date().toISOString(),
            receipt_image: null,
            status: 'pending',
            currency: 'EUR'
          });

        if (expenseError) {
          console.error('Error creating expense:', expenseError);
        }
      }

      // Reset form
      setRefillAmount('');
      setRefillCost('');
      setRefillLocation('');
      setIsFullTank(false);
      setShowRefillModal(false);

      // Reload data
      await loadVehicleData();
      
      // Notify parent component
      if (onFuelExpenseAdded) {
        onFuelExpenseAdded();
      }
      
      Alert.alert(t('common.success'), t('fuel.refillAdded'));
    } catch (error) {
      console.error('Error adding refill:', error);
      Alert.alert(t('common.error'), t('fuel.errors.addingRefill'));
    }
  };

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
      case 'gasoline': return t('fuel.types.gasoline');
      case 'diesel': return t('fuel.types.diesel');
      case 'electric': return t('fuel.types.electric');
      case 'hybrid': return t('fuel.types.hybrid');
      default: return fuelType;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: screenColors.card }]}>
        <ActivityIndicator size="small" color={screenColors.primary} />
        <Text style={[styles.loadingText, { color: screenColors.text }]}>
          {t('fuel.loading')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: screenColors.card }]}>
      {/* Clickable Header with Fuel Balance */}
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setShowDetailsModal(true)}
        disabled={!selectedVehicle || !fuelStats}
      >
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name={getFuelTypeIcon(selectedVehicle?.fuel_type || 'gasoline')}
            size={24}
            color={screenColors.primary}
          />
          <Text style={[styles.title, { color: screenColors.text }]}>
            {t('fuel.title')}
          </Text>
        </View>
        <View style={styles.fuelBalance}>
          {fuelStats && selectedVehicle && (
            <>
              <Text style={[styles.balanceValue, { color: screenColors.primary }]}>
                €{fuelStats.fuelBalance.toFixed(2)}
              </Text>
              <Text style={[styles.balanceLabel, { color: screenColors.textSecondary }]}>
                {t('fuel.balance', 'Fuel Balance')}
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>

      {/* Vehicle Selector Only */}
      <TouchableOpacity
        style={[styles.vehicleSelector, { backgroundColor: screenColors.background }]}
        onPress={() => setShowVehicleSelector(true)}
      >
        <View style={styles.vehicleSelectorContent}>
          <View style={styles.vehicleDetails}>
            <Text style={[styles.vehicleName, { color: screenColors.text }]}>
              {selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : t('fuel.selectVehicle')}
            </Text>
            {selectedVehicle && (
              <Text style={[styles.vehiclePlate, { color: screenColors.textSecondary }]}>
                {selectedVehicle.license_plate} • {formatFuelType(selectedVehicle.fuel_type)}
                {selectedVehicle.city_consumption && (
                  ` • ${selectedVehicle.city_consumption}L/100km city`
                )}
              </Text>
            )}
          </View>
          <View style={styles.vehicleStats}>
            {fuelStats && selectedVehicle && (
              <>
                <Text style={[styles.levelValue, { color: screenColors.primary }]}>
                  {fuelStats.currentLevel.toFixed(1)} {selectedVehicle.fuel_type === 'electric' ? 'kWh' : 'L'}
                </Text>
                <Text style={[styles.rangeText, { color: screenColors.textSecondary }]}>
                  ~{fuelStats.estimatedRange.toFixed(0)} km
                </Text>
              </>
            )}
          </View>
          <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
        </View>
      </TouchableOpacity>

      {/* Vehicle Selector Modal */}
      <Modal
        visible={showVehicleSelector}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: screenColors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: screenColors.border }]}>
              <Text style={[styles.modalTitle, { color: screenColors.text }]}>
                {t('fuel.selectVehicle')}
              </Text>
              <TouchableOpacity onPress={() => setShowVehicleSelector(false)}>
                <Ionicons name="close" size={24} color={screenColors.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={vehicles}
              keyExtractor={(item) => item.id}
              renderItem={({ item: vehicle }) => (
                <TouchableOpacity
                  style={[
                    styles.vehicleOption,
                    { backgroundColor: screenColors.card },
                    selectedVehicle?.id === vehicle.id && { 
                      borderColor: screenColors.primary, 
                      borderWidth: 2,
                      backgroundColor: screenColors.primary + '20'
                    }
                  ]}
                  onPress={() => {
                    setSelectedVehicle(vehicle);
                    setShowVehicleSelector(false);
                  }}
                >
                  <View style={styles.vehicleOptionContent}>
                    <View style={styles.vehicleInfo}>
                      <Text style={[styles.vehicleName, { color: screenColors.text }]}>
                        {vehicle.make} {vehicle.model}
                      </Text>
                      <Text style={[styles.vehiclePlate, { color: screenColors.textSecondary }]}>
                        {vehicle.license_plate} • {formatFuelType(vehicle.fuel_type)}
                      </Text>
                      {vehicle.city_consumption && (
                        <Text style={[styles.consumptionText, { color: screenColors.textSecondary }]}>
                          City: {vehicle.city_consumption}L/100km
                          {vehicle.highway_consumption && ` • Highway: ${vehicle.highway_consumption}L/100km`}
                        </Text>
                      )}
                    </View>
                    {vehicle.is_favorite && (
                      <Ionicons name="heart" size={16} color={screenColors.primary} />
                    )}
                  </View>
                </TouchableOpacity>
              )}
              style={styles.vehicleList}
            />
          </View>
        </View>
      </Modal>

      {/* Fuel Details Modal */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.detailsModal, { backgroundColor: screenColors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: screenColors.border }]}>
              <Text style={[styles.modalTitle, { color: screenColors.text }]}>
                {t('fuel.details', 'Fuel Details')}
              </Text>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: screenColors.primary }]}
                  onPress={() => {
                    setShowDetailsModal(false);
                    setShowRefillModal(true);
                  }}
                >
                  <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                  <Ionicons name="close" size={24} color={screenColors.text} />
                </TouchableOpacity>
              </View>
            </View>
            
            <ScrollView style={styles.detailsContent}>
              {/* Stats Summary */}
              {fuelStats && selectedVehicle && (
                <View style={[styles.statsContainer, { backgroundColor: screenColors.card }]}>
                  <View style={styles.statRow}>
                    <Text style={[styles.statLabel, { color: screenColors.textSecondary }]}>
                      {t('fuel.currentLevel', 'Current Level')}
                    </Text>
                    <Text style={[styles.statValue, { color: screenColors.text }]}>
                      {fuelStats.currentLevel.toFixed(1)} {selectedVehicle.fuel_type === 'electric' ? 'kWh' : 'L'}
                    </Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={[styles.statLabel, { color: screenColors.textSecondary }]}>
                      {t('fuel.fuelBalance', 'Fuel Balance')}
                    </Text>
                    <Text style={[styles.statValue, { color: screenColors.primary }]}>
                      €{fuelStats.fuelBalance.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={[styles.statLabel, { color: screenColors.textSecondary }]}>
                      {t('fuel.estimatedRange', 'Estimated Range')}
                    </Text>
                    <Text style={[styles.statValue, { color: screenColors.text }]}>
                      ~{fuelStats.estimatedRange.toFixed(0)} km
                    </Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={[styles.statLabel, { color: screenColors.textSecondary }]}>
                      {t('fuel.totalCost', 'Total Cost')}
                    </Text>
                    <Text style={[styles.statValue, { color: screenColors.text }]}>
                      €{fuelStats.totalCost.toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}

              {/* Recent Fuel Records */}
              <Text style={[styles.sectionTitle, { color: screenColors.text }]}>
                {t('fuel.recentRefills', 'Recent Refills')}
              </Text>
              
              {fuelRecords.length > 0 ? (
                fuelRecords.map((record) => (
                  <View key={record.id} style={[styles.recordItem, { backgroundColor: screenColors.card }]}>
                    <View style={styles.recordHeader}>
                      <Text style={[styles.recordAmount, { color: screenColors.text }]}>
                        {record.amount.toFixed(1)} {selectedVehicle?.fuel_type === 'electric' ? 'kWh' : 'L'}
                      </Text>
                      <Text style={[styles.recordCost, { color: screenColors.primary }]}>
                        €{record.cost.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.recordDetails}>
                      <Text style={[styles.recordDate, { color: screenColors.textSecondary }]}>
                        {formatDate(record.date)}
                      </Text>
                      {record.location && (
                        <Text style={[styles.recordLocation, { color: screenColors.textSecondary }]}>
                          {record.location}
                        </Text>
                      )}
                      {record.is_full_tank && (
                        <View style={[styles.fullTankBadge, { backgroundColor: screenColors.primary }]}>
                          <Text style={styles.fullTankText}>Full Tank</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <Text style={[styles.noRecords, { color: screenColors.textSecondary }]}>
                  {t('fuel.noRecords', 'No fuel records found')}
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Refill Modal */}
      <Modal
        visible={showRefillModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.refillModal, { backgroundColor: screenColors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: screenColors.border }]}>
              <Text style={[styles.modalTitle, { color: screenColors.text }]}>
                {t('fuel.addRefill')}
              </Text>
              <TouchableOpacity onPress={() => setShowRefillModal(false)}>
                <Ionicons name="close" size={24} color={screenColors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.refillContent}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: screenColors.text }]}>
                  {selectedVehicle?.fuel_type === 'electric' ? t('fuel.energyAmount') : t('fuel.fuelAmount')}
                </Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: screenColors.card, color: screenColors.text, borderColor: screenColors.border }]}
                  value={refillAmount}
                  onChangeText={setRefillAmount}
                  placeholder={selectedVehicle?.fuel_type === 'electric' ? 'kWh' : 'L'}
                  keyboardType="numeric"
                  placeholderTextColor={screenColors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: screenColors.text }]}>
                  {t('fuel.totalCost')}
                </Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: screenColors.card, color: screenColors.text, borderColor: screenColors.border }]}
                  value={refillCost}
                  onChangeText={setRefillCost}
                  placeholder={t('fuel.costPlaceholder')}
                  keyboardType="numeric"
                  placeholderTextColor={screenColors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: screenColors.text }]}>
                  {t('fuel.location')} ({t('fuel.optional')})
                </Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: screenColors.card, color: screenColors.text, borderColor: screenColors.border }]}
                  value={refillLocation}
                  onChangeText={setRefillLocation}
                  placeholder={t('fuel.locationPlaceholder')}
                  placeholderTextColor={screenColors.textSecondary}
                />
              </View>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setIsFullTank(!isFullTank)}
              >
                <Ionicons
                  name={isFullTank ? "checkbox" : "checkbox-outline"}
                  size={24}
                  color={screenColors.primary}
                />
                <Text style={[styles.checkboxLabel, { color: screenColors.text }]}>
                  {t('fuel.fullTank')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: screenColors.primary }]}
                onPress={handleRefill}
              >
                <Text style={styles.saveButtonText}>
                  {t('fuel.addRefill')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
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
  vehicleSelector: {
    borderRadius: 8,
    padding: 12,
  },
  vehicleSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginRight: 8,
  },
  levelValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  rangeText: {
    fontSize: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    maxHeight: '70%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  detailsModal: {
    maxHeight: '90%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  refillModal: {
    maxHeight: '80%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleList: {
    maxHeight: 300,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  vehicleOption: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  vehicleOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vehicleInfo: {
    flex: 1,
  },
  consumptionText: {
    fontSize: 10,
    marginTop: 2,
  },
  detailsContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statsContainer: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  recordItem: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recordAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  recordCost: {
    fontSize: 14,
    fontWeight: '700',
  },
  recordDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordDate: {
    fontSize: 12,
  },
  recordLocation: {
    fontSize: 12,
  },
  fullTankBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  fullTankText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  noRecords: {
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 20,
  },
  refillContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  textInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
  },
  checkboxLabel: {
    fontSize: 14,
    marginLeft: 8,
  },
  saveButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FuelManagementModule;