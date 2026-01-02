import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Platform,
  Modal,
  Switch,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useTranslation } from 'react-i18next';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/rootReducer';

// Auth and Navigation
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

// Import RTK Query hooks
import {
  useGetVehiclesQuery,
  useGetTripTypesQuery,
  useGetTripPurposesQuery,
  useGetStandardRoutesQuery,
  useGetCurrentUserProfileQuery,
  useCreateTripMutation,
  useCreateTravelOrderMutation,
  DbVehicle,
  DbTripType,
  DbTripPurpose,
  DbStandardRoute,
  supabaseApi
} from '../../store/api/supabaseApi';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';

// Trip tracking
import { useTripTracking } from '../../hooks/useTripTracking';

interface TripFormData {
  purpose: string;
  purposeId: string | null;
  startLocation: string;
  endLocation: string;
  selectedRouteId: string | null;
  selectedVehicleId: string | null;
  selectedTripTypeId: string | null;
  notes: string;
  useStandardRoute: boolean;
  estimatedCost: number | null;
}

export default function AddTripScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();

  // RTK Query hooks
  const { data: vehiclesData, isLoading: isLoadingVehicles, error: vehiclesError } = useGetVehiclesQuery();
  const { data: tripTypesData, isLoading: isLoadingTripTypes, error: tripTypesError } = useGetTripTypesQuery();
  const { data: tripPurposesData, isLoading: isLoadingPurposes, error: purposesError } = useGetTripPurposesQuery();
  const { data: standardRoutesData, isLoading: isLoadingRoutes, error: routesError, refetch: refetchRoutes } = useGetStandardRoutesQuery();
  const { data: userProfile } = useGetCurrentUserProfileQuery(user?.user_id || '', { skip: !user?.user_id });
  const [createTrip] = useCreateTripMutation();
  const [createTravelOrder] = useCreateTravelOrderMutation();

  // Trip tracking hook
  const tripTracking = useTripTracking();

  // Screen colors based on theme
  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    primary: Colors.DARK.primary,
    card: Colors.DARK.card,
    border: Colors.DARK.border,
    danger: Colors.DANGER,
    placeholder: Colors.DARK.textSecondary,
    white: Colors.WHITE,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    disabled: Colors.DARK.textSecondary,
  } : {
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    primary: Colors.LIGHT.primary,
    card: Colors.LIGHT.card,
    border: Colors.LIGHT.border,
    danger: Colors.DANGER,
    placeholder: Colors.LIGHT.textSecondary,
    white: Colors.WHITE,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    disabled: Colors.LIGHT.textSecondary,
  };

  // Form state
  const [formData, setFormData] = useState<TripFormData>({
    purpose: '',
    purposeId: null,
    startLocation: '',
    endLocation: '',
    selectedRouteId: null,
    selectedVehicleId: null,
    selectedTripTypeId: null,
    notes: '',
    useStandardRoute: true,
    estimatedCost: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Modal states
  const [showVehiclePicker, setShowVehiclePicker] = useState(false);
  const [showTripTypePicker, setShowTripTypePicker] = useState(false);
  const [showPurposePicker, setShowPurposePicker] = useState(false);
  const [showRoutePicker, setShowRoutePicker] = useState(false);

  // Predefined options
  const commonPurposes = [
    'Client Meeting',
    'Site Visit', 
    'Business Trip',
    'Delivery',
    'Maintenance',
    'Training',
    'Conference',
    'Other'
  ];

  // Sort vehicles to show preferred first
  const sortedVehicles = React.useMemo(() => {
    if (!vehiclesData) return [];
    
    const userPreferredVehicleId = userProfile?.preferred_vehicle_id;
    const sorted = [...vehiclesData];
    
    if (userPreferredVehicleId) {
      const preferredIndex = sorted.findIndex(v => v.vehicle_id === userPreferredVehicleId);
      if (preferredIndex > -1) {
        const preferred = sorted.splice(preferredIndex, 1)[0];
        sorted.unshift(preferred);
      }
    }
    
    return sorted;
  }, [vehiclesData, userProfile?.preferred_vehicle_id]);

  // Auto-select preferred vehicle when component loads
  useEffect(() => {
    if (userProfile?.preferred_vehicle_id && !formData.selectedVehicleId) {
      setFormData(prev => ({
        ...prev,
        selectedVehicleId: userProfile.preferred_vehicle_id || null
      }));
    }
  }, [userProfile?.preferred_vehicle_id, formData.selectedVehicleId]);

  // Calculate estimated cost when route or vehicle changes
  useEffect(() => {
    calculateEstimatedCost();
  }, [formData.selectedRouteId, formData.selectedVehicleId, formData.useStandardRoute]);

  // Force refresh routes data when component mounts
  useEffect(() => {
    refetchRoutes();
  }, []);

  // Debug log for routes data
  useEffect(() => {
    if (standardRoutesData) {
      console.log('🗺️ AddTripScreen routes loaded:', standardRoutesData.length, 'routes');
    }
  }, [standardRoutesData]);

  // GPS Location Function
  const getCurrentLocation = async (type: 'start' | 'end') => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showErrorToast(t('location_permission_required', 'Location permission is required to get current location'));
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Reverse geocoding to get address
      const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
      const formattedAddress = `${address.street || ''} ${address.streetNumber || ''}, ${address.city || ''}`.trim();
      
      updateFormField(type === 'start' ? 'startLocation' : 'endLocation', formattedAddress);
    } catch (error) {
      console.error('Error getting location:', error);
      showErrorToast(t('failed_get_location', 'Failed to get current location'));
    }
  };

  const calculateEstimatedCost = () => {
    let cost = null;
    
    if (formData.useStandardRoute && formData.selectedRouteId) {
      // Use predefined route cost
      const selectedRoute = standardRoutesData?.find(r => r.route_id === formData.selectedRouteId);
      if (selectedRoute?.predefined_cost) {
        cost = selectedRoute.predefined_cost;
      }
    } else if (!formData.useStandardRoute && formData.selectedVehicleId) {
      // Calculate using formula: km * consumption * fuel_price * 1.1
      const selectedVehicle = vehiclesData?.find(v => v.vehicle_id === formData.selectedVehicleId);
      if (selectedVehicle?.avg_consumption) {
        // Estimate 20km for custom destinations (this would normally be calculated based on GPS route)
        const estimatedDistance = 20;
        const consumption = selectedVehicle.avg_consumption;
        const fuelPrice = 1.50; // This should come from fuel_prices table
        cost = (estimatedDistance * (consumption / 100) * fuelPrice * 1.1);
        cost = Math.round(cost * 100) / 100; // Round to 2 decimal places
      }
    }
    
    setFormData(prev => ({ ...prev, estimatedCost: cost }));
  };

  const updateFormField = (field: keyof TripFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    if (!formData.purpose.trim()) {
      newErrors.purpose = t('purpose_required', 'Purpose is required');
      isValid = false;
    }

    if (formData.useStandardRoute) {
      if (!formData.selectedRouteId) {
        newErrors.route = t('route_required', 'Please select a route');
        isValid = false;
      }
    } else {
      if (!formData.endLocation.trim()) {
        newErrors.endLocation = t('end_location_required', 'End location is required');
        isValid = false;
      }
    }

    if (!formData.selectedVehicleId) {
      newErrors.vehicle = t('vehicle_required', 'Please select a vehicle');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveTrip = async () => {
    if (!validateForm()) {
      const errorMessages = Object.values(errors).filter(msg => msg.trim() !== '').join(', ');
              showErrorToast('common.error', 'correct_form_errors');
      return;
    }

    if (!user) {
      showErrorToast(t('user_not_authenticated', 'User not authenticated'));
      return;
    }

    setIsLoading(true);

    try {
      const selectedRoute = formData.selectedRouteId ?
        standardRoutesData?.find(r => r.route_id === formData.selectedRouteId) : null;

      // Debug selected route
      if (selectedRoute) {
        console.log('🗺️ Selected route:', selectedRoute.name);
        console.log('🗺️ Start POI:', selectedRoute.start_poi);
        console.log('🗺️ End POI:', selectedRoute.end_poi);
      }

      // 1. Create Travel Order first
      const travelOrderData = {
        user_id: user.user_id,
        company_id: user.company_id || '',
        purpose: formData.purpose.trim(),
        start_date: new Date().toISOString(),
        notes: formData.notes.trim() || null,
        status: 'active',
      };

      console.log('📋 Creating travel order:', travelOrderData);
      const travelOrderResult = await createTravelOrder(travelOrderData).unwrap();
      const travelOrderId = travelOrderResult.id;

      console.log('✅ Travel order created:', travelOrderId);

      // 2. Create Trip within the travel order
      const tripData = {
        user_id: user.user_id,
        vehicle_id: formData.selectedVehicleId!,
        travel_order_id: travelOrderId,
        trip_type_id: formData.selectedTripTypeId,
        trip_purpose_id: formData.purposeId,
        start_time: new Date().toISOString(),
        end_time: null,
        start_location_address: formData.useStandardRoute ?
          selectedRoute?.start_address_manual || selectedRoute?.start_poi?.address || selectedRoute?.start_poi?.name || 'Unknown Start' :
          formData.startLocation.trim(),
        end_location_address: formData.useStandardRoute ?
          selectedRoute?.end_address_manual || selectedRoute?.end_poi?.address || selectedRoute?.end_poi?.name || 'Unknown Destination' :
          formData.endLocation.trim(),
        purpose_description: formData.purpose.trim(),
        notes: formData.notes.trim() || null,
        status: 'IN_PROGRESS',
        route_details_json: null,
      };

      console.log('🚗 Creating trip:', tripData);
      const tripResult = await createTrip(tripData).unwrap();
      const tripId = tripResult.trip_id;

      console.log('✅ Trip created:', tripId);

      // 3. Start GPS tracking
      console.log('🎯 Starting GPS tracking for trip:', tripId);
      await tripTracking.startTrip({
        userId: user.user_id,
        purposeId: formData.purposeId,
        routeId: formData.selectedRouteId,
        tripId: tripId,
        orderId: travelOrderId,
      });

      // Invalidate cache to refresh data
      dispatch(supabaseApi.util.invalidateTags(['Trips', 'TravelOrders']));

      showSuccessToast(t('trip_started_successfully', 'Trip started successfully! GPS tracking is now active.'));

      // Navigate back to home screen where ActiveTripCard will be displayed
      navigation.goBack();

    } catch (error: any) {
      console.error('❌ Error starting trip:', error);
      showErrorToast(t('trip_start_failed', 'Failed to start trip. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const renderVehicleItem = (vehicle: DbVehicle) => {
    const isPreferred = vehicle.vehicle_id === userProfile?.preferred_vehicle_id;
    return (
      <TouchableOpacity
        key={vehicle.vehicle_id}
        style={[
          styles.modalItem,
          { 
            backgroundColor: formData.selectedVehicleId === vehicle.vehicle_id ? 
              screenColors.primary + '20' : 'transparent',
            borderBottomColor: screenColors.border 
          }
        ]}
        onPress={() => {
          updateFormField('selectedVehicleId', vehicle.vehicle_id);
          setShowVehiclePicker(false);
        }}
      >
        <View style={styles.vehicleItemContent}>
          <View style={styles.vehicleInfo}>
            <Text style={[styles.modalItemText, { color: screenColors.text }]}>
              {`${vehicle.make} ${vehicle.model}`}
            </Text>
            <Text style={[styles.vehicleSubText, { color: screenColors.textSecondary }]}>
              {vehicle.license_plate}
            </Text>
          </View>
          {isPreferred && (
            <View style={[styles.preferredBadge, { backgroundColor: screenColors.success }]}>
              <Ionicons name="star" size={12} color="white" />
              <Text style={styles.preferredText}>{t('preferred_vehicle', 'Preferred')}</Text>
            </View>
          )}
          {formData.selectedVehicleId === vehicle.vehicle_id && (
            <Ionicons name="checkmark" size={20} color={screenColors.primary} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderRouteItem = (route: DbStandardRoute) => (
    <TouchableOpacity
      key={route.route_id}
      style={[
        styles.modalItem,
        { 
          backgroundColor: formData.selectedRouteId === route.route_id ? 
            screenColors.primary + '20' : 'transparent',
          borderBottomColor: screenColors.border 
        }
      ]}
      onPress={() => {
        updateFormField('selectedRouteId', route.route_id);
        setShowRoutePicker(false);
      }}
    >
      <View style={styles.routeItemContent}>
        <View style={styles.routeInfo}>
          <Text style={[styles.modalItemText, { color: screenColors.text }]}>
            {route.name}
          </Text>
          {route.predefined_distance_km && (
            <Text style={[styles.routeSubText, { color: screenColors.textSecondary }]}>
              {route.predefined_distance_km}km • {route.estimated_duration_min}min
            </Text>
          )}
        </View>
        {route.predefined_cost && (
          <View style={styles.costBadge}>
            <Text style={[styles.costText, { color: screenColors.primary }]}>
              €{route.predefined_cost.toFixed(2)}
            </Text>
          </View>
        )}
        {formData.selectedRouteId === route.route_id && (
          <Ionicons name="checkmark" size={20} color={screenColors.primary} />
        )}
      </View>
    </TouchableOpacity>
  );

  const selectedRoute = formData.selectedRouteId ? 
    standardRoutesData?.find(r => r.route_id === formData.selectedRouteId) : null;
  const selectedVehicle = formData.selectedVehicleId ? 
    vehiclesData?.find(v => v.vehicle_id === formData.selectedVehicleId) : null;

  const styles = getStyles(screenColors);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: screenColors.background }]}>
      <StatusBar 
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={screenColors.background} 
      />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: screenColors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={28} color={screenColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: screenColors.text }]}>
          {t('add_new_trip', 'Add New Trip')}
        </Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
        {/* Route Selection Toggle */}
        <View style={[styles.toggleSection, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
          <Text style={[styles.toggleTitle, { color: screenColors.text }]}>
            {t('choose_route_or_destination', 'Choose Route or Destination')}
          </Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                formData.useStandardRoute && { backgroundColor: screenColors.primary }
              ]}
              onPress={() => updateFormField('useStandardRoute', true)}
            >
              <Ionicons 
                name="map-outline" 
                size={20} 
                color={formData.useStandardRoute ? 'white' : screenColors.textSecondary} 
              />
              <Text style={[
                styles.toggleButtonText,
                { color: formData.useStandardRoute ? 'white' : screenColors.textSecondary }
              ]}>
                {t('standard_routes', 'Standard Routes')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.toggleButton,
                !formData.useStandardRoute && { backgroundColor: screenColors.primary }
              ]}
              onPress={() => updateFormField('useStandardRoute', false)}
            >
              <Ionicons 
                name="location-outline" 
                size={20} 
                color={!formData.useStandardRoute ? 'white' : screenColors.textSecondary} 
              />
              <Text style={[
                styles.toggleButtonText,
                { color: !formData.useStandardRoute ? 'white' : screenColors.textSecondary }
              ]}>
                {t('custom_destination', 'Custom Destination')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Route/Destination Selection */}
        {formData.useStandardRoute ? (
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: screenColors.textSecondary }]}>
              {t('select_route', 'Select Route')}
            </Text>
            {isLoadingRoutes ? (
              <ActivityIndicator size="small" color={screenColors.primary} />
            ) : routesError ? (
              <Text style={[styles.errorText, { color: screenColors.danger }]}>
                {t('error_loading_routes', 'Error loading routes')}
              </Text>
            ) : (
              <TouchableOpacity 
                style={[
                  styles.pickerButton, 
                  { 
                    backgroundColor: screenColors.card, 
                    borderColor: errors.route ? screenColors.danger : screenColors.border 
                  }
                ]}
                onPress={() => setShowRoutePicker(true)}
              >
                <View style={styles.pickerContent}>
                  {selectedRoute ? (
                    <View>
                      <Text style={[styles.pickerText, { color: screenColors.text }]}>
                        {selectedRoute.name}
                      </Text>
                      {selectedRoute.predefined_cost && (
                        <Text style={[styles.pickerSubText, { color: screenColors.textSecondary }]}>
                          {t('route_cost', 'Route Cost')}: €{selectedRoute.predefined_cost.toFixed(2)}
                        </Text>
                      )}
                    </View>
                  ) : (
                    <Text style={[styles.pickerText, { color: screenColors.placeholder }]}>
                      {t('select_route', 'Select Route')}
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
              </TouchableOpacity>
            )}
            {errors.route && <Text style={[styles.errorText, { color: screenColors.danger }]}>{errors.route}</Text>}
          </View>
        ) : (
          <>
            {/* Start Location for Custom Trip */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.textSecondary }]}>
                {t('start_location', 'Start Location')}
              </Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[
                    styles.inputFlex, 
                    { 
                      backgroundColor: screenColors.card, 
                      color: screenColors.text, 
                      borderColor: errors.startLocation ? screenColors.danger : screenColors.border 
                    }
                  ]}
                  value={formData.startLocation}
                  onChangeText={(text) => updateFormField('startLocation', text)}
                  placeholder={t('start_location_placeholder', 'e.g., Current Location, Office')}
                  placeholderTextColor={screenColors.placeholder}
                />
                <TouchableOpacity
                  style={[styles.dropdownButton, { backgroundColor: screenColors.primary }]}
                  onPress={() => getCurrentLocation('start')}
                >
                  <Ionicons name="location" size={20} color="white" />
                </TouchableOpacity>
              </View>
              {errors.startLocation && <Text style={[styles.errorText, { color: screenColors.danger }]}>{errors.startLocation}</Text>}
            </View>

            {/* End Location for Custom Trip */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.textSecondary }]}>
                {t('end_location', 'End Location')}
              </Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[
                    styles.inputFlex, 
                    { 
                      backgroundColor: screenColors.card, 
                      color: screenColors.text, 
                      borderColor: errors.endLocation ? screenColors.danger : screenColors.border 
                    }
                  ]}
                  value={formData.endLocation}
                  onChangeText={(text) => updateFormField('endLocation', text)}
                  placeholder={t('end_location_placeholder', 'e.g., Client Office, Destination')}
                  placeholderTextColor={screenColors.placeholder}
                />
                <TouchableOpacity
                  style={[styles.dropdownButton, { backgroundColor: screenColors.primary }]}
                  onPress={() => getCurrentLocation('end')}
                >
                  <Ionicons name="location" size={20} color="white" />
                </TouchableOpacity>
              </View>
              {errors.endLocation && <Text style={[styles.errorText, { color: screenColors.danger }]}>{errors.endLocation}</Text>}
            </View>
          </>
        )}

        {/* Purpose */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: screenColors.textSecondary }]}>
            {t('purpose', 'Purpose')}
          </Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[
                styles.inputFlex, 
                { 
                  backgroundColor: screenColors.card, 
                  color: screenColors.text, 
                  borderColor: errors.purpose ? screenColors.danger : screenColors.border 
                }
              ]}
              value={formData.purpose}
              onChangeText={(text) => updateFormField('purpose', text)}
              placeholder={t('trip_purpose_placeholder', 'e.g., Client Meeting, Site Visit')}
              placeholderTextColor={screenColors.placeholder}
            />
            <TouchableOpacity
              style={[styles.dropdownButton, { backgroundColor: screenColors.primary }]}
              onPress={() => setShowPurposePicker(true)}
            >
              <Ionicons name="chevron-down" size={20} color="white" />
            </TouchableOpacity>
          </View>
          {errors.purpose && <Text style={[styles.errorText, { color: screenColors.danger }]}>{errors.purpose}</Text>}
        </View>

        {/* Vehicle Selection */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: screenColors.textSecondary }]}>
            {t('vehicle', 'Vehicle')}
          </Text>
          {isLoadingVehicles ? (
            <ActivityIndicator size="small" color={screenColors.primary} />
          ) : vehiclesError ? (
            <Text style={[styles.errorText, { color: screenColors.danger }]}>
              {t('error_loading_vehicles', 'Error loading vehicles')}
            </Text>
          ) : (
            <TouchableOpacity 
              style={[
                styles.pickerButton, 
                { 
                  backgroundColor: screenColors.card, 
                  borderColor: errors.vehicle ? screenColors.danger : screenColors.border 
                }
              ]}
              onPress={() => setShowVehiclePicker(true)}
            >
              <View style={styles.pickerContent}>
                {selectedVehicle ? (
                  <View>
                    <Text style={[styles.pickerText, { color: screenColors.text }]}>
                      {`${selectedVehicle.make} ${selectedVehicle.model}`}
                    </Text>
                    <Text style={[styles.pickerSubText, { color: screenColors.textSecondary }]}>
                      {selectedVehicle.license_plate}
                      {selectedVehicle.vehicle_id === userProfile?.preferred_vehicle_id && 
                        ` • ${t('preferred_vehicle', 'Preferred')}`}
                    </Text>
                  </View>
                ) : (
                  <Text style={[styles.pickerText, { color: screenColors.placeholder }]}>
                    {t('select_vehicle', 'Select Vehicle')}
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
            </TouchableOpacity>
          )}
          {errors.vehicle && <Text style={[styles.errorText, { color: screenColors.danger }]}>{errors.vehicle}</Text>}
        </View>

        {/* Trip Type (Optional) */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: screenColors.textSecondary }]}>
            {t('trip_type', 'Trip Type')} ({t('optional', 'Optional')})
          </Text>
          {isLoadingTripTypes ? (
            <ActivityIndicator size="small" color={screenColors.primary} />
          ) : tripTypesError ? (
            <Text style={[styles.errorText, { color: screenColors.danger }]}>
              {t('error_loading_types', 'Error loading trip types')}
            </Text>
          ) : (
            <TouchableOpacity 
              style={[styles.pickerButton, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}
              onPress={() => setShowTripTypePicker(true)}
            >
              <View style={styles.pickerContent}>
                {formData.selectedTripTypeId ? (
                  <Text style={[styles.pickerText, { color: screenColors.text }]}>
                    {tripTypesData?.find(t => t.trip_type_id === formData.selectedTripTypeId)?.name}
                  </Text>
                ) : (
                  <Text style={[styles.pickerText, { color: screenColors.placeholder }]}>
                    {t('select_type', 'Select trip type')}
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Estimated Cost Display */}
        {formData.estimatedCost && (
          <View style={[styles.costDisplay, { backgroundColor: screenColors.success + '20', borderColor: screenColors.success }]}>
            <Ionicons name="calculator-outline" size={20} color={screenColors.success} />
            <Text style={[styles.costDisplayText, { color: screenColors.success }]}>
              {t('estimated_cost', 'Estimated Cost')}: €{formData.estimatedCost.toFixed(2)}
            </Text>
          </View>
        )}

        {/* Notes */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: screenColors.textSecondary }]}>
            {t('notes', 'Notes')} ({t('optional', 'Optional')})
          </Text>
          <TextInput
            style={[
              styles.textArea, 
              { 
                backgroundColor: screenColors.card, 
                color: screenColors.text,
                borderColor: screenColors.border,
                textAlignVertical: 'top' 
              }
            ]}
            value={formData.notes}
            onChangeText={(text) => updateFormField('notes', text)}
            placeholder={t('trip_notes_placeholder', 'Any additional information about the trip...')}
            placeholderTextColor={screenColors.placeholder}
            multiline={true}
            numberOfLines={4}
          />
        </View>

        {/* Start Trip Button */}
        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: screenColors.primary }]}
          onPress={handleSaveTrip}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="play-circle-outline" size={24} color="white" />
              <Text style={[styles.submitButtonText, { color: 'white' }]}>
                {t('start_trip_now', 'Start Trip Now')}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Vehicle Picker Modal */}
      <Modal
        visible={showVehiclePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowVehiclePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: screenColors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: screenColors.text }]}>
                {t('select_vehicle', 'Select Vehicle')}
              </Text>
              <TouchableOpacity onPress={() => setShowVehiclePicker(false)}>
                <Ionicons name="close" size={24} color={screenColors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {sortedVehicles.map(renderVehicleItem)}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Route Picker Modal */}
      <Modal
        visible={showRoutePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRoutePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: screenColors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: screenColors.text }]}>
                {t('select_route', 'Select Route')}
              </Text>
              <TouchableOpacity onPress={() => setShowRoutePicker(false)}>
                <Ionicons name="close" size={24} color={screenColors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {standardRoutesData?.map(renderRouteItem)}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Purpose Picker Modal */}
      <Modal
        visible={showPurposePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPurposePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: screenColors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: screenColors.text }]}>
                {t('select_category', 'Select Category')}
              </Text>
              <TouchableOpacity onPress={() => setShowPurposePicker(false)}>
                <Ionicons name="close" size={24} color={screenColors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {commonPurposes.map((purpose) => (
                <TouchableOpacity
                  key={purpose}
                  style={[
                    styles.modalItem,
                    { 
                      backgroundColor: formData.purpose === purpose ? 
                        screenColors.primary + '20' : 'transparent',
                      borderBottomColor: screenColors.border 
                    }
                  ]}
                  onPress={() => {
                    updateFormField('purpose', purpose);
                    setShowPurposePicker(false);
                  }}
                >
                  <Text style={[styles.modalItemText, { color: screenColors.text }]}>
                    {purpose}
                  </Text>
                  {formData.purpose === purpose && (
                    <Ionicons name="checkmark" size={20} color={screenColors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Trip Type Picker Modal */}
      <Modal
        visible={showTripTypePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTripTypePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: screenColors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: screenColors.text }]}>
                {t('select_type', 'Select Trip Type')}
              </Text>
              <TouchableOpacity onPress={() => setShowTripTypePicker(false)}>
                <Ionicons name="close" size={24} color={screenColors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {tripTypesData?.map((type: DbTripType) => (
                <TouchableOpacity
                  key={type.trip_type_id}
                  style={[
                    styles.modalItem,
                    { 
                      backgroundColor: formData.selectedTripTypeId === type.trip_type_id ? 
                        screenColors.primary + '20' : 'transparent',
                      borderBottomColor: screenColors.border 
                    }
                  ]}
                  onPress={() => {
                    updateFormField('selectedTripTypeId', type.trip_type_id);
                    setShowTripTypePicker(false);
                  }}
                >
                  <Text style={[styles.modalItemText, { color: screenColors.text }]}>
                    {type.name}
                  </Text>
                  {formData.selectedTripTypeId === type.trip_type_id && (
                    <Ionicons name="checkmark" size={20} color={screenColors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const getStyles = (screenColors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholderButton: {
    width: 38,
  },
  toggleSection: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: screenColors.border,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputWithButton: {
    flexDirection: 'row',
    gap: 8,
  },
  inputFlex: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  dropdownButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerContent: {
    flex: 1,
  },
  pickerText: {
    fontSize: 16,
  },
  pickerSubText: {
    fontSize: 12,
    marginTop: 2,
  },
  costDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  costDisplayText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: { 
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 0,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: screenColors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalItemText: {
    fontSize: 16,
    flex: 1,
  },
  vehicleItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleSubText: {
    fontSize: 12,
    marginTop: 2,
  },
  preferredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  preferredText: {
    fontSize: 10,
    color: 'white',
    marginLeft: 4,
  },
  routeItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  routeInfo: {
    flex: 1,
  },
  routeSubText: {
    fontSize: 12,
    marginTop: 2,
  },
  costBadge: {
    marginRight: 8,
  },
  costText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 