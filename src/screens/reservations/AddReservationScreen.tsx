import React, { useState } from 'react';
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
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import DateTimePickerModal from "react-native-modal-datetime-picker";

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { supabaseApi } from '../../store/api/supabaseApi';
import { useTranslation } from 'react-i18next';

// Toast Utils
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';

// Supabase
import { useAuth } from '../../contexts/AuthContext';
import { 
  useGetVehiclesQuery, 
  useGetVehicleTypesQuery,
  useGetPurposeOptionsQuery,
  useGetPoisQuery,
  useGetStandardRoutesQuery,
  useCreateReservationMutation 
} from '../../store/api/supabaseApi';

export default function AddReservationScreen({ navigation }: any) {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  const { data: vehiclesData, isLoading: isLoadingVehicles } = useGetVehiclesQuery();
  const { data: vehicleTypesData, isLoading: isLoadingVehicleTypes } = useGetVehicleTypesQuery();
  const { data: purposeOptions, isLoading: isLoadingPurposes } = useGetPurposeOptionsQuery();
  const { data: poisData, isLoading: isLoadingLocations } = useGetPoisQuery();
  const { data: standardRoutesData, isLoading: isLoadingRoutes } = useGetStandardRoutesQuery();
  const [createReservation, { isLoading: isSaving }] = useCreateReservationMutation();

  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    primary: Colors.DARK.primary,
    card: Colors.DARK.card,
    border: Colors.DARK.border,
    danger: Colors.DARK.danger,
    placeholder: Colors.DARK.textSecondary,
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
    danger: Colors.LIGHT.danger,
    placeholder: Colors.LIGHT.textSecondary,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    disabled: Colors.LIGHT.textSecondary,
  };

  // State
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedVehicleTypeId, setSelectedVehicleTypeId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().getTime() + 60 * 60 * 1000));
  const [selectedPurpose, setSelectedPurpose] = useState<string>('');
  const [selectedPickupLocation, setSelectedPickupLocation] = useState<string>('');
  const [selectedDropoffLocation, setSelectedDropoffLocation] = useState<string>('');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const [useStandardRoute, setUseStandardRoute] = useState<boolean>(false);
  const [customPurpose, setCustomPurpose] = useState('');
  const [customPickupLocation, setCustomPickupLocation] = useState('');
  const [customDropoffLocation, setCustomDropoffLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Modal states
  const [isVehicleModalVisible, setIsVehicleModalVisible] = useState(false);
  const [isVehicleTypeModalVisible, setIsVehicleTypeModalVisible] = useState(false);
  const [isPurposeModalVisible, setIsPurposeModalVisible] = useState(false);
  const [isPickupModalVisible, setIsPickupModalVisible] = useState(false);
  const [isDropoffModalVisible, setIsDropoffModalVisible] = useState(false);
  const [isRouteModalVisible, setIsRouteModalVisible] = useState(false);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  const styles = getStyles(screenColors);

  // Date picker handlers
  const showStartDatePicker = () => setStartDatePickerVisibility(true);
  const hideStartDatePicker = () => setStartDatePickerVisibility(false);
  const handleConfirmStartDate = (date: Date) => {
    setStartDate(date);
    setErrors(prev => ({ ...prev, startDate: '' }));
    hideStartDatePicker();
  };

  const showEndDatePicker = () => setEndDatePickerVisibility(true);
  const hideEndDatePicker = () => setEndDatePickerVisibility(false);
  const handleConfirmEndDate = (date: Date) => {
    setEndDate(date);
    setErrors(prev => ({ ...prev, endDate: '' }));
    hideEndDatePicker();
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!selectedVehicleId && !selectedVehicleTypeId) {
      newErrors.vehicleSelection = t('error_vehicle_selection');
      isValid = false;
    }

    const finalPurpose = selectedPurpose === 'custom' ? customPurpose.trim() : selectedPurpose;
    if (!finalPurpose) {
      newErrors.purpose = t('error_purpose_required');
      isValid = false;
    } else if (finalPurpose.length < 5) {
      newErrors.purpose = t('error_purpose_min_length');
      isValid = false;
    }
    
    if (endDate <= startDate) {
      newErrors.endDate = t('error_end_date_after_start');
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Save reservation
  const handleSaveReservation = async () => {
    if (!validateForm()) {
      return;
    }

          if (!user) {
        showErrorToast(t('alert_user_not_authenticated'));
        return;
      }

    const finalPurpose = selectedPurpose === 'custom' ? customPurpose.trim() : selectedPurpose;
    
    let finalPickupLocation, finalDropoffLocation;
    
    if (useStandardRoute && selectedRouteId) {
      const selectedRoute = standardRoutesData?.find(r => r.route_id === selectedRouteId);
      if (selectedRoute) {
        finalPickupLocation = selectedRoute.start_address_manual || selectedRoute.start_poi?.address || selectedRoute.start_poi?.name;
        finalDropoffLocation = selectedRoute.end_address_manual || selectedRoute.end_poi?.address || selectedRoute.end_poi?.name;
      }
    } else {
      finalPickupLocation = selectedPickupLocation === 'custom' ? customPickupLocation.trim() : selectedPickupLocation;
      finalDropoffLocation = selectedDropoffLocation === 'custom' ? customDropoffLocation.trim() : selectedDropoffLocation;
    }

    const reservationData = {
      user_id: user.user_id,
      vehicle_id: selectedVehicleId || undefined,
      vehicle_type_id: selectedVehicleTypeId || undefined,
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      purpose: finalPurpose,
      pickup_location: finalPickupLocation || undefined,
      dropoff_location: finalDropoffLocation || undefined,
      requested_features: notes.trim() ? { 
        user_notes: notes.trim(),
        selected_route_id: useStandardRoute ? selectedRouteId : undefined 
      } : useStandardRoute ? { selected_route_id: selectedRouteId } : undefined,
    };

    try {
      const result = await createReservation(reservationData).unwrap();
      console.log('Reservation created successfully:', result);
      
      dispatch(supabaseApi.util.invalidateTags([{ type: 'Reservations', id: 'LIST' }]));
      
              showSuccessToast(t('alert_reservation_submitted_successfully'));
        navigation.goBack();
      } catch (error: any) {
        console.error('Error saving reservation:', error);
        showErrorToast('common.error', 'failed_to_save_reservation');
    }
  };

  // Modal renderers
  const renderVehicleModal = () => (
    <Modal
      visible={isVehicleModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setIsVehicleModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: screenColors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: screenColors.text }]}>{t('select_specific_vehicle')}</Text>
            <TouchableOpacity onPress={() => setIsVehicleModalVisible(false)}>
              <Ionicons name="close" size={24} color={screenColors.text} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={vehiclesData || []}
            keyExtractor={(item) => item.vehicle_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  selectedVehicleId === item.vehicle_id && styles.selectedModalItem
                ]}
                onPress={() => {
                  setSelectedVehicleId(item.vehicle_id);
                  setSelectedVehicleTypeId(null); // Clear vehicle type when specific vehicle selected
                  setIsVehicleModalVisible(false);
                  if (errors.vehicleSelection) setErrors(prev => ({ ...prev, vehicleSelection: '' }));
                }}
              >
                <Text style={[styles.modalItemText, { color: screenColors.text }]}>
                  {`${item.make} ${item.model}`}
                </Text>
                <Text style={[styles.modalItemDescription, { color: screenColors.textSecondary }]}>
                  {item.license_plate}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: screenColors.textSecondary }]}>
                {t('no_vehicles_found')}
              </Text>
            }
          />
        </View>
      </View>
    </Modal>
  );

  const renderVehicleTypeModal = () => (
    <Modal
      visible={isVehicleTypeModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setIsVehicleTypeModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: screenColors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: screenColors.text }]}>{t('select_vehicle_type')}</Text>
            <TouchableOpacity onPress={() => setIsVehicleTypeModalVisible(false)}>
              <Ionicons name="close" size={24} color={screenColors.text} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={vehicleTypesData || []}
            keyExtractor={(item) => item.vehicle_type_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  selectedVehicleTypeId === item.vehicle_type_id && styles.selectedModalItem
                ]}
                onPress={() => {
                  setSelectedVehicleTypeId(item.vehicle_type_id);
                  setSelectedVehicleId(null); // Clear specific vehicle when type selected
                  setIsVehicleTypeModalVisible(false);
                  if (errors.vehicleSelection) setErrors(prev => ({ ...prev, vehicleSelection: '' }));
                }}
              >
                <Text style={[styles.modalItemText, { color: screenColors.text }]}>
                  {t(`vehicle_type_${item.name.replace(/\s+/g, '_')}`)}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: screenColors.textSecondary }]}>
                {t('no_vehicle_types_found')}
              </Text>
            }
          />
        </View>
      </View>
    </Modal>
  );

  const renderPurposeModal = () => (
    <Modal
      visible={isPurposeModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setIsPurposeModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: screenColors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: screenColors.text }]}>{t('select_purpose')}</Text>
            <TouchableOpacity onPress={() => setIsPurposeModalVisible(false)}>
              <Ionicons name="close" size={24} color={screenColors.text} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={[
              ...(purposeOptions || []),
              { purpose_id: 'custom', name: t('custom_purpose'), description: t('enter_your_own_purpose') }
            ]}
            keyExtractor={(item) => item.purpose_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  selectedPurpose === (item.purpose_id === 'custom' ? 'custom' : item.name) && styles.selectedModalItem
                ]}
                onPress={() => {
                  setSelectedPurpose(item.purpose_id === 'custom' ? 'custom' : item.name);
                  setIsPurposeModalVisible(false);
                  if (errors.purpose) setErrors(prev => ({ ...prev, purpose: '' }));
                }}
              >
                <Text style={[styles.modalItemText, { color: screenColors.text }]}>{item.name}</Text>
                {item.description && (
                  <Text style={[styles.modalItemDescription, { color: screenColors.textSecondary }]}>
                    {item.description}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  const renderLocationModal = (
    isVisible: boolean,
    onClose: () => void,
    onSelect: (location: string) => void,
    selectedValue: string,
    title: string
  ) => (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: screenColors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: screenColors.text }]}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={screenColors.text} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={[
              ...(poisData || []),
              { poi_id: 'custom', name: t('custom_location'), address: t('enter_your_own_location') }
            ]}
            keyExtractor={(item) => item.poi_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  selectedValue === (item.poi_id === 'custom' ? 'custom' : item.name) && styles.selectedModalItem
                ]}
                onPress={() => {
                  onSelect(item.poi_id === 'custom' ? 'custom' : item.name);
                  onClose();
                }}
              >
                <Text style={[styles.modalItemText, { color: screenColors.text }]}>{item.name}</Text>
                {item.address && (
                  <Text style={[styles.modalItemDescription, { color: screenColors.textSecondary }]}>
                    {item.address}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  // Loading state
  if (isLoadingVehicles || isLoadingVehicleTypes || isLoadingPurposes || isLoadingLocations) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: screenColors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={screenColors.primary} />
        <Text style={[styles.loadingText, { color: screenColors.textSecondary }]}>{t('loading')}</Text>
      </SafeAreaView>
    );
  }

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
        <Text style={[styles.headerTitle, { color: screenColors.text }]}>{t('add_reservation')}</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
        {/* Specific Vehicle Selection */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: screenColors.text }]}>
            {t('specific_vehicle')} ({t('optional')})
          </Text>
          <TouchableOpacity 
            style={[
              styles.pickerButton, 
              { 
                backgroundColor: screenColors.card, 
                borderColor: errors.vehicleSelection && !selectedVehicleId ? screenColors.danger : screenColors.border 
              }
            ]}
            onPress={() => setIsVehicleModalVisible(true)}
          >
            <Text style={[
              styles.pickerButtonText, 
              { color: selectedVehicleId ? screenColors.text : screenColors.placeholder }
            ]}>
              {selectedVehicleId 
                ? `${vehiclesData?.find(v => v.vehicle_id === selectedVehicleId)?.make} ${vehiclesData?.find(v => v.vehicle_id === selectedVehicleId)?.model} (${vehiclesData?.find(v => v.vehicle_id === selectedVehicleId)?.license_plate})`
                : t('select_specific_vehicle')
              }
            </Text>
            <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Vehicle Type Selection - Only show if no specific vehicle selected */}
        {!selectedVehicleId && (
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: screenColors.text }]}>
              {t('vehicle_type')} ({t('optional')})
            </Text>
            <TouchableOpacity 
              style={[
                styles.pickerButton, 
                { 
                  backgroundColor: screenColors.card, 
                  borderColor: errors.vehicleSelection && !selectedVehicleTypeId && !selectedVehicleId ? screenColors.danger : screenColors.border 
                }
              ]}
              onPress={() => setIsVehicleTypeModalVisible(true)}
            >
              <Text style={[
                styles.pickerButtonText, 
                { color: selectedVehicleTypeId ? screenColors.text : screenColors.placeholder }
              ]}>
                {selectedVehicleTypeId 
                  ? t(`vehicle_type_${vehicleTypesData?.find(vt => vt.vehicle_type_id === selectedVehicleTypeId)?.name.replace(/\s+/g, '_')}`)
                  : t('select_vehicle_type')
                }
              </Text>
              <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
            </TouchableOpacity>
            {errors.vehicleSelection && <Text style={[styles.errorText, { color: screenColors.danger }]}>{errors.vehicleSelection}</Text>}
          </View>
        )}

        {/* Start Date & Time */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: screenColors.text }]}>{t('start_date')} & {t('time')}</Text>
          <TouchableOpacity 
            style={[
              styles.pickerButton, 
              { 
                backgroundColor: screenColors.card, 
                borderColor: errors.startDate ? screenColors.danger : screenColors.border 
              }
            ]}
            onPress={showStartDatePicker}
          >
            <Text style={[styles.pickerButtonText, { color: screenColors.text }]}>
              {startDate.toLocaleString()}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={screenColors.textSecondary} />
          </TouchableOpacity>
          {errors.startDate && <Text style={[styles.errorText, { color: screenColors.danger }]}>{errors.startDate}</Text>}
        </View>

        {/* End Date & Time */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: screenColors.text }]}>{t('end_date')} & {t('time')}</Text>
          <TouchableOpacity 
            style={[
              styles.pickerButton, 
              { 
                backgroundColor: screenColors.card, 
                borderColor: errors.endDate ? screenColors.danger : screenColors.border 
              }
            ]}
            onPress={showEndDatePicker}
          >
            <Text style={[styles.pickerButtonText, { color: screenColors.text }]}>
              {endDate.toLocaleString()}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={screenColors.textSecondary} />
          </TouchableOpacity>
          {errors.endDate && <Text style={[styles.errorText, { color: screenColors.danger }]}>{errors.endDate}</Text>}
        </View>

        {/* Purpose */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: screenColors.text }]}>{t('purpose')}</Text>
          <TouchableOpacity 
            style={[
              styles.pickerButton, 
              { 
                backgroundColor: screenColors.card, 
                borderColor: errors.purpose ? screenColors.danger : screenColors.border 
              }
            ]}
            onPress={() => setIsPurposeModalVisible(true)}
          >
            <Text style={[
              styles.pickerButtonText, 
              { color: selectedPurpose ? screenColors.text : screenColors.placeholder }
            ]}>
              {selectedPurpose === 'custom' ? t('custom_purpose') : selectedPurpose || t('purpose_placeholder')}
            </Text>
            <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
          </TouchableOpacity>
          {errors.purpose && <Text style={[styles.errorText, { color: screenColors.danger }]}>{errors.purpose}</Text>}
          
          {selectedPurpose === 'custom' && (
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: screenColors.card, 
                  color: screenColors.text, 
                  borderColor: screenColors.border,
                  marginTop: 8 
                }
              ]}
              value={customPurpose}
              onChangeText={setCustomPurpose}
              placeholder={t('enter_custom_purpose')}
              placeholderTextColor={screenColors.placeholder}
            />
          )}
        </View>
        
        {/* Location Selection Toggle */}
        <View style={[styles.toggleSection, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
          <Text style={[styles.toggleTitle, { color: screenColors.text }]}>
            {t('choose_location_type', 'Choose Location Type')}
          </Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                !useStandardRoute && { backgroundColor: screenColors.primary }
              ]}
              onPress={() => {
                setUseStandardRoute(false);
                setSelectedRouteId('');
              }}
            >
              <Ionicons 
                name="location-outline" 
                size={20} 
                color={!useStandardRoute ? 'white' : screenColors.textSecondary} 
              />
              <Text style={[
                styles.toggleButtonText,
                { color: !useStandardRoute ? 'white' : screenColors.textSecondary }
              ]}>
                {t('individual_locations', 'Individual Locations')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.toggleButton,
                useStandardRoute && { backgroundColor: screenColors.primary }
              ]}
              onPress={() => {
                setUseStandardRoute(true);
                setSelectedPickupLocation('');
                setSelectedDropoffLocation('');
              }}
            >
              <Ionicons 
                name="map-outline" 
                size={20} 
                color={useStandardRoute ? 'white' : screenColors.textSecondary} 
              />
              <Text style={[
                styles.toggleButtonText,
                { color: useStandardRoute ? 'white' : screenColors.textSecondary }
              ]}>
                {t('standard_routes', 'Standard Routes')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Standard Route Selection */}
        {useStandardRoute ? (
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: screenColors.text }]}>
              {t('select_route', 'Select Route')}
            </Text>
            <TouchableOpacity 
              style={[styles.pickerButton, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}
              onPress={() => setIsRouteModalVisible(true)}
            >
              <Text style={[
                styles.pickerButtonText, 
                { color: selectedRouteId ? screenColors.text : screenColors.placeholder }
              ]}>
                {selectedRouteId ? 
                  standardRoutesData?.find(r => r.route_id === selectedRouteId)?.name :
                  t('select_route_placeholder', 'Select a standard route')
                }
              </Text>
              <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Pickup Location */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>
                {t('pickup_location')} ({t('optional')})
              </Text>
          <TouchableOpacity 
            style={[styles.pickerButton, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}
            onPress={() => setIsPickupModalVisible(true)}
          >
            <Text style={[
              styles.pickerButtonText, 
              { color: selectedPickupLocation ? screenColors.text : screenColors.placeholder }
            ]}>
              {selectedPickupLocation === 'custom' ? t('custom_location') : selectedPickupLocation || t('pickup_placeholder')}
            </Text>
            <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
          </TouchableOpacity>
          
          {selectedPickupLocation === 'custom' && (
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: screenColors.card, 
                  color: screenColors.text, 
                  borderColor: screenColors.border,
                  marginTop: 8 
                }
              ]}
              value={customPickupLocation}
              onChangeText={setCustomPickupLocation}
              placeholder={t('enter_custom_pickup_location')}
              placeholderTextColor={screenColors.placeholder}
            />
          )}
        </View>

        {/* Dropoff Location */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: screenColors.text }]}>
            {t('dropoff_location')} ({t('optional')})
          </Text>
          <TouchableOpacity 
            style={[styles.pickerButton, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}
            onPress={() => setIsDropoffModalVisible(true)}
          >
            <Text style={[
              styles.pickerButtonText, 
              { color: selectedDropoffLocation ? screenColors.text : screenColors.placeholder }
            ]}>
              {selectedDropoffLocation === 'custom' ? t('custom_location') : selectedDropoffLocation || t('dropoff_placeholder')}
            </Text>
            <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
          </TouchableOpacity>
          
          {selectedDropoffLocation === 'custom' && (
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: screenColors.card, 
                  color: screenColors.text, 
                  borderColor: screenColors.border,
                  marginTop: 8 
                }
              ]}
              value={customDropoffLocation}
              onChangeText={setCustomDropoffLocation}
              placeholder={t('enter_custom_dropoff_location')}
              placeholderTextColor={screenColors.placeholder}
            />
          )}
        </View>
          </>
        )}
        
        {/* Notes */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: screenColors.text }]}>
            {t('notes')} ({t('optional')})
          </Text>
          <TextInput
            style={[
              styles.textArea, 
              { 
                backgroundColor: screenColors.card, 
                color: screenColors.text, 
                borderColor: screenColors.border 
              }
            ]}
            value={notes}
            onChangeText={setNotes}
            placeholder={t('notes_placeholder')}
            placeholderTextColor={screenColors.placeholder}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[
            styles.saveButton, 
            { 
              backgroundColor: isSaving ? screenColors.disabled : screenColors.primary,
              opacity: isSaving ? 0.7 : 1
            }
          ]} 
          onPress={handleSaveReservation}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={Colors.WHITE} />
          ) : (
            <Text style={[styles.saveButtonText, { color: Colors.WHITE }]}>
              {t('request_reservation_button')}
            </Text>
          )}
        </TouchableOpacity>

      </ScrollView>

      {/* Date Pickers */}
      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirmStartDate}
        onCancel={hideStartDatePicker}
        date={startDate}
        minimumDate={new Date()}
      />
      
      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirmEndDate}
        onCancel={hideEndDatePicker}
        date={endDate}
        minimumDate={startDate}
      />

      {/* Modals */}
      {renderVehicleModal()}
      {renderVehicleTypeModal()}
      {renderPurposeModal()}
      {renderLocationModal(
        isPickupModalVisible,
        () => setIsPickupModalVisible(false),
        setSelectedPickupLocation,
        selectedPickupLocation,
        t('select_pickup_location')
      )}
      {renderLocationModal(
        isDropoffModalVisible,
        () => setIsDropoffModalVisible(false),
        setSelectedDropoffLocation,
        selectedDropoffLocation,
        t('select_dropoff_location')
      )}
      
      {/* Route Modal */}
      <Modal
        visible={isRouteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsRouteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: screenColors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: screenColors.text }]}>{t('select_route', 'Select Route')}</Text>
              <TouchableOpacity onPress={() => setIsRouteModalVisible(false)}>
                <Ionicons name="close" size={24} color={screenColors.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={standardRoutesData || []}
              keyExtractor={(item) => item.route_id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedRouteId === item.route_id && styles.selectedModalItem
                  ]}
                  onPress={() => {
                    setSelectedRouteId(item.route_id);
                    setIsRouteModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalItemText, { color: screenColors.text }]}>
                    {item.name}
                  </Text>
                  {(item.start_poi?.name || item.start_address_manual) && (item.end_poi?.name || item.end_address_manual) && (
                    <Text style={[styles.modalItemDescription, { color: screenColors.textSecondary }]}>
                      {item.start_poi?.name || item.start_address_manual} → {item.end_poi?.name || item.end_address_manual}
                    </Text>
                  )}
                  {item.predefined_distance_km && (
                    <Text style={[styles.modalItemDescription, { color: screenColors.textSecondary }]}>
                      {item.predefined_distance_km}km • {item.estimated_duration_min}min
                    </Text>
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={[styles.emptyText, { color: screenColors.textSecondary }]}>
                  {t('no_routes_found', 'No routes found')}
                </Text>
              }
            />
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  placeholderButton: {
    width: 44,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  formGroup: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 56,
  },
  pickerButtonText: {
    fontSize: 16,
    flex: 1,
  },
  errorText: {
    fontSize: 14,
    marginTop: 6,
    fontWeight: '500',
  },
  saveButton: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 56,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: screenColors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalItem: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: screenColors.border,
  },
  selectedModalItem: {
    backgroundColor: screenColors.primary + '15',
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalItemDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    padding: 32,
    fontStyle: 'italic',
  },
  toggleSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
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
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 8,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});