import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  RefreshControl,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store/rootReducer';
import Colors from '../../constants/Colors';
import {
  useGetVehiclesQuery,
  useGetVehicleTypesQuery,
  useGetVehicleStatusesQuery,
  useGetFuelTypesQuery,
  useGetUsersQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  DbVehicle,
  DbVehicleType,
  DbFuelType
  } from '../../store/api/supabaseApi';
import { showSuccessToast, showErrorToast, showWarningToast } from '../../utils/toastUtils';

// Helper function to create styles dynamically
const getStyles = (screenColors: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: screenColors.background },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: screenColors.border },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: screenColors.text, marginLeft: 16 },
    addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, backgroundColor: screenColors.primary, margin: 16 },
    addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, color: screenColors.textSecondary },
    listContent: { paddingHorizontal: 16, paddingBottom: 16 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50, paddingHorizontal: 20 },
    emptyText: { fontSize: 18, fontWeight: 'bold', color: screenColors.textSecondary, textAlign: 'center' },
    emptySubtext: { fontSize: 14, color: screenColors.textSecondary, marginTop: 8, textAlign: 'center' },
    
    // Vehicle Item Styles
    vehicleItem: { backgroundColor: screenColors.card, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: screenColors.border, shadowColor: screenColors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, },
    vehicleHeader: { flexDirection: 'row', alignItems: 'center', },
    vehicleTitle: { flex: 1, marginLeft: 12 },
    vehicleName: { fontSize: 18, fontWeight: 'bold', color: screenColors.text },
    vehicleLicensePlate: { fontSize: 14, color: screenColors.textSecondary, marginTop: 2 },
    vehicleType: { fontSize: 14, color: screenColors.textSecondary, fontStyle: 'italic' },
    vehicleActions: { flexDirection: 'row', },
    editButton: { padding: 8, borderRadius: 20, backgroundColor: screenColors.primary + '20' },
    deleteButton: { padding: 8, borderRadius: 20, backgroundColor: screenColors.danger + '20', marginLeft: 8 },
    vehicleDetails: { borderTopWidth: 1, borderTopColor: screenColors.border, marginTop: 12, paddingTop: 12 },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    detailText: { marginLeft: 10, fontSize: 14, color: screenColors.text },
    privateVehicleBanner: { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
    privateVehicleText: { marginLeft: 8, fontWeight: 'bold', fontSize: 12 },

    // Modal Styles
    modalView: { flex: 1, backgroundColor: screenColors.background, paddingTop: Platform.OS === 'android' ? 25 : 0 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: screenColors.border },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: screenColors.text },
    modalContent: { flex: 1 },
    formScrollView: { flex: 1, padding: 16 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: screenColors.text, marginTop: 16, marginBottom: 12 },
    input: { borderWidth: 1, borderColor: screenColors.border, borderRadius: 8, padding: 12, color: screenColors.text, backgroundColor: screenColors.card, marginBottom: 12, fontSize: 16 },
    selectorButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: screenColors.border, borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: screenColors.card },
    selectorText: { fontSize: 16, color: screenColors.text, flex: 1 },
    clearButton: { padding: 4 },
    switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, marginBottom: 12 },
    switchLabel: { fontSize: 16, color: screenColors.text },
    saveButton: { padding: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 16, backgroundColor: screenColors.primary },
    saveButtonText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
    
    // Selector Modal Styles
    selectorModalView: { flex: 1, backgroundColor: screenColors.background },
    selectorModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: screenColors.border },
    selectorModalTitle: { fontSize: 20, fontWeight: 'bold', color: screenColors.text },
    selectorModalItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: screenColors.border },
    selectorModalItemName: { fontSize: 16, color: screenColors.text },
    selectorModalItemDescription: { fontSize: 12, color: screenColors.textSecondary, marginTop: 4 },
});

const initialFormData = {
  vehicle_type_id: '', make: '', model: '', year: '', license_plate: '', vin: '', color: '',
  engine_type: '', fuel_type_id: '', fuel_tank_capacity: '', battery_capacity_kwh: '',
  avg_consumption: '', current_odometer: '', registration_date: '', registration_expiry_date: '',
  insurance_policy_number: '', insurance_expiry_date: '', is_private_vehicle: false,
  notes: '', seats_count: '', trunk_capacity_liters: '', cargo_capacity_kg: '',
  cargo_volume_m3: '', pallet_capacity: '', required_license_category: '',
  engine_volume_cc: '', engine_power_kw: '', engine_power_hp: '',
  fuel_consumption_city: '', fuel_consumption_highway: '', fuel_consumption_combined: '',
  registration_cost_annual: '', insurance_cost_annual: '', service_interval_km: '',
  service_interval_months: '', private_owner_name: '', private_owner_contact: '', private_owner_id: '',
  is_public_transport: false, public_transport_type: '', transport_company_name: '',
  transport_company_license: '', fare_per_km: '', fare_base_price: '', ticket_price: '',
  route_description: '',
};

type VehicleFormData = typeof initialFormData;

interface SelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (item: any) => void;
  title: string;
  selectedId?: string | null;
  data: any[] | undefined;
  isLoading: boolean;
  renderItem: (item: any) => { id: string; name: string; description?: string };
}

const SelectorModal: React.FC<SelectorModalProps> = ({ visible, onClose, onSelect, title, selectedId, data, isLoading, renderItem }) => {
    const { t } = useTranslation();
    const themeMode = useSelector((state: RootState) => state.theme.mode);
    const screenColors = useMemo(() => (themeMode === 'dark' ? Colors.DARK : Colors.LIGHT), [themeMode]);
    const styles = useMemo(() => getStyles(screenColors), [screenColors]);

    const renderModalItem = ({ item }: { item: any }) => {
        const { id, name, description } = renderItem(item);
        const isSelected = selectedId === id;
        return (
            <TouchableOpacity
                style={[styles.selectorModalItem, { backgroundColor: isSelected ? screenColors.primary + '20' : 'transparent' }]}
                onPress={() => { onSelect(item); onClose(); }}
            >
                <View style={{ flex: 1 }}>
                    <Text style={styles.selectorModalItemName}>{name}</Text>
                    {description && <Text style={styles.selectorModalItemDescription}>{description}</Text>}
                </View>
                {isSelected && <Ionicons name="checkmark-circle" size={24} color={screenColors.primary} />}
            </TouchableOpacity>
        );
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
            <SafeAreaView style={styles.selectorModalView}>
                <View style={styles.selectorModalHeader}>
                    <Text style={styles.selectorModalTitle}>{title}</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color={screenColors.text} />
                    </TouchableOpacity>
                </View>
                {isLoading ? (
                    <View style={styles.loadingContainer}><ActivityIndicator color={screenColors.primary} /></View>
                ) : (
                    <FlatList
                        data={data}
                        keyExtractor={(item) => renderItem(item).id}
                        renderItem={renderModalItem}
                        ListEmptyComponent={<View style={styles.emptyContainer}><Text style={styles.emptyText}>{t('no_items_found')}</Text></View>}
                    />
                )}
            </SafeAreaView>
        </Modal>
    );
};

const VehicleManagementScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const screenColors = useMemo(() => (themeMode === 'dark' ? { ...Colors.DARK, shadow: 'rgba(255, 255, 255, 0.1)' } : { ...Colors.LIGHT, shadow: 'rgba(0, 0, 0, 0.1)' }), [themeMode]);
  const styles = useMemo(() => getStyles(screenColors), [screenColors]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<DbVehicle | null>(null);
  const [showVehicleTypeModal, setShowVehicleTypeModal] = useState(false);
  const [showFuelTypeModal, setShowFuelTypeModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  const { data: vehiclesData, isLoading: isLoadingVehicles, refetch: refetchVehicles } = useGetVehiclesQuery();
  const { data: vehicleTypesData, isLoading: isLoadingVehicleTypes } = useGetVehicleTypesQuery();
  const { data: vehicleStatusesData, isLoading: isLoadingVehicleStatuses } = useGetVehicleStatusesQuery();
  const { data: fuelTypesData, isLoading: isLoadingFuelTypes } = useGetFuelTypesQuery();
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsersQuery();

  // Debug logs
  console.log('🚗 Vehicle Management Debug:', {
    vehicleTypes: vehicleTypesData,
    vehicleStatuses: vehicleStatusesData,
    fuelTypes: fuelTypesData,
    isLoadingVehicleStatuses: isLoadingVehicleStatuses
  });

  const [createVehicle, { isLoading: isCreating }] = useCreateVehicleMutation();
  const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation();
  const [deleteVehicle] = useDeleteVehicleMutation();

  const [formData, setFormData] = useState<VehicleFormData>(initialFormData);

  const handleInputChange = (field: keyof VehicleFormData, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOpenModal = (vehicle: DbVehicle | null) => {
    console.log('Opening modal with vehicle:', vehicle);
    setEditingVehicle(vehicle);
    if (vehicle) {
        console.log('Vehicle ID:', vehicle.vehicle_id);
        const vehicleFormData = Object.keys(initialFormData).reduce((acc, key) => {
            const value = (vehicle as any)[key];
            (acc as any)[key] = value !== null && value !== undefined ? String(value) : '';
            return acc;
        }, {} as VehicleFormData);
        console.log('Form data created:', vehicleFormData);
        setFormData(vehicleFormData);
    } else {
        console.log('Creating new vehicle - using initial form data');
        setFormData(initialFormData);
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    // Basic validation for required fields
    if (!formData.make.trim()) {
      showErrorToast('common.error', 'vehicle_make_required');
      return;
    }
    
    if (!formData.model.trim()) {
      showErrorToast('common.error', 'vehicle_model_required');
      return;
    }
    
    if (!formData.license_plate.trim()) {
      showErrorToast('common.error', 'vehicle_license_plate_required');
      return;
    }

    const dataToSave: Partial<DbVehicle> = {};
    for (const key in formData) {
        const typedKey = key as keyof VehicleFormData;
        const value = formData[typedKey];

        if (value === '' || value === null || value === undefined) {
            (dataToSave as any)[typedKey] = null;
        } else if (['year', 'seats_count', 'pallet_capacity', 'engine_volume_cc', 'service_interval_km', 'service_interval_months'].includes(typedKey)) {
            (dataToSave as any)[typedKey] = parseInt(String(value), 10);
        } else if (typeof value === 'boolean') {
             (dataToSave as any)[typedKey] = value;
        } else if (!isNaN(Number(value))) {
             (dataToSave as any)[typedKey] = Number(value);
        } else {
             (dataToSave as any)[typedKey] = value;
        }
    }

    try {
      if (editingVehicle) {
        console.log('Updating vehicle with ID:', editingVehicle.vehicle_id);
        console.log('Data to save:', dataToSave);
        if (!editingVehicle.vehicle_id) {
          console.error('ERROR: editingVehicle has no vehicle_id!', editingVehicle);
          showErrorToast('common.error', 'invalid_vehicle_id');
          return;
        }
        await updateVehicle({ vehicle_id: editingVehicle.vehicle_id, ...dataToSave }).unwrap();
        showSuccessToast('common.success', 'vehicle_updated_success');
      } else {
        console.log('Creating new vehicle with data:', dataToSave);
        await createVehicle(dataToSave).unwrap();
        showSuccessToast('common.success', 'vehicle_added_success');
      }
      setModalVisible(false);
      refetchVehicles();
    } catch (error) {
      console.error('Failed to save vehicle:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      showErrorToast('common.error', 'failed_to_save_vehicle');
    }
  };

  const handleDelete = (vehicle: DbVehicle) => {
    Alert.alert(t('confirm_delete_vehicle_title'), t('confirm_delete_vehicle_message'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('delete'), style: 'destructive', onPress: async () => {
        try {
          await deleteVehicle(vehicle.vehicle_id).unwrap();
          showSuccessToast('common.success', 'vehicle_deleted_success');
          refetchVehicles();
        } catch (error) {
          showErrorToast('common.error', 'failed_to_delete_vehicle');
        }
      }}
    ]);
  };
  
  const getVehicleTypeName = (id: string | null | undefined) => {
      if (!id) return '';
      return vehicleTypesData?.find(vt => vt.vehicle_type_id === id)?.name || '';
  }
  const getFuelTypeName = (id: string | null | undefined) => {
      if (!id) return '';
      return fuelTypesData?.find(ft => ft.fuel_type_id === id)?.name || '';
  }
  const getUserName = (id: string | null | undefined) => {
      if (!id) return '';
      const user = usersData?.find(u => u.user_id === id);
      return user ? `${user.first_name} ${user.last_name}`.trim() : '';
  }
  
  const getVehicleIcon = (typeName: string) => {
    const type = typeName?.toLowerCase() || '';
    if (type.includes('truck') || type.includes('kamion')) return 'bus-outline';
    if (type.includes('van') || type.includes('kombi')) return 'bus-outline';
    return 'car-sport-outline';
  };

  const renderVehicleItem = ({ item }: { item: DbVehicle }) => {
    const vehicleTypeName = getVehicleTypeName(item.vehicle_type_id);
    const fuelTypeName = getFuelTypeName(item.fuel_type_id);
    const ownerName = getUserName(item.private_owner_id) || item.private_owner_name;

    return (
        <View style={styles.vehicleItem}>
            <View style={styles.vehicleHeader}>
                <Ionicons name={getVehicleIcon(vehicleTypeName)} size={24} color={screenColors.primary} />
                <View style={styles.vehicleTitle}>
                    <Text style={styles.vehicleName}>{item.make} {item.model} ({item.year})</Text>
                    <Text style={styles.vehicleLicensePlate}>{item.license_plate}</Text>
                    {vehicleTypeName ? <Text style={styles.vehicleType}>{t(`vehicle_types.${vehicleTypeName.toLowerCase()}`, vehicleTypeName)}</Text> : null}
                </View>
                <View style={styles.vehicleActions}>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleOpenModal(item)}>
                        <Ionicons name="pencil" size={20} color={screenColors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
                        <Ionicons name="trash" size={20} color={screenColors.danger} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.vehicleDetails}>
                {item.color && <View style={styles.detailRow}><Ionicons name="color-palette-outline" size={16} color={screenColors.textSecondary} /><Text style={styles.detailText}>{t('vehicle_details.color')}: {item.color}</Text></View>}
                {item.seats_count && <View style={styles.detailRow}><Ionicons name="people-outline" size={16} color={screenColors.textSecondary} /><Text style={styles.detailText}>{t('vehicle_details.seats')}: {item.seats_count}</Text></View>}
                {fuelTypeName && <View style={styles.detailRow}><Ionicons name="flame-outline" size={16} color={screenColors.textSecondary} /><Text style={styles.detailText}>{t('vehicle_details.fuel_type')}: {t(`fuel_types.${fuelTypeName.toLowerCase()}`, fuelTypeName)}</Text></View>}
                {item.avg_consumption && <View style={styles.detailRow}><Ionicons name="speedometer-outline" size={16} color={screenColors.textSecondary} /><Text style={styles.detailText}>{t('vehicle_details.consumption')}: {item.avg_consumption} L/100km</Text></View>}
                {item.current_odometer && <View style={styles.detailRow}><Ionicons name="analytics-outline" size={16} color={screenColors.textSecondary} /><Text style={styles.detailText}>{t('vehicle_details.odometer')}: {item.current_odometer} km</Text></View>}
                {item.engine_power_hp && <View style={styles.detailRow}><Ionicons name="cog-outline" size={16} color={screenColors.textSecondary} /><Text style={styles.detailText}>{t('vehicle_details.power')}: {item.engine_power_hp} HP</Text></View>}
                {item.cargo_capacity_kg && <View style={styles.detailRow}><Ionicons name="cube-outline" size={16} color={screenColors.textSecondary} /><Text style={styles.detailText}>{t('vehicle_details.cargo_capacity')}: {item.cargo_capacity_kg} kg</Text></View>}
                {item.required_license_category && <View style={styles.detailRow}><Ionicons name="id-card-outline" size={16} color={screenColors.textSecondary} /><Text style={styles.detailText}>{t('vehicle_details.license_category')}: {item.required_license_category}</Text></View>}
            </View>
            {item.is_private_vehicle && (
                <View style={[styles.privateVehicleBanner, { backgroundColor: screenColors.primary + '20' }]}>
                    <Ionicons name="person-outline" size={16} color={screenColors.primary} />
                    <Text style={[styles.privateVehicleText, { color: screenColors.primary }]}>{t('private_vehicle')}: {ownerName}</Text>
                </View>
            )}
        </View>
    );
  };
  
  const renderForm = () => {
    const selectedVehicleTypeName = getVehicleTypeName(formData.vehicle_type_id);
    const selectedFuelTypeName = getFuelTypeName(formData.fuel_type_id);
    const selectedUserName = getUserName(formData.private_owner_id);

    return (
        <ScrollView style={styles.formScrollView} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>{t('vehicle_information')}</Text>
            <TouchableOpacity style={styles.selectorButton} onPress={() => setShowVehicleTypeModal(true)}>
                <Text style={styles.selectorText}>{selectedVehicleTypeName ? t(`vehicle_types.${selectedVehicleTypeName.toLowerCase()}`, selectedVehicleTypeName) : t('select_vehicle_type')}</Text>
                <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
            </TouchableOpacity>
            
            <TextInput style={styles.input} placeholder={t('make')} value={formData.make} onChangeText={v => handleInputChange('make', v)} placeholderTextColor={screenColors.textSecondary} />
            <TextInput style={styles.input} placeholder={t('model')} value={formData.model} onChangeText={v => handleInputChange('model', v)} placeholderTextColor={screenColors.textSecondary} />
            <TextInput style={styles.input} placeholder={t('year')} value={formData.year} onChangeText={v => handleInputChange('year', v)} keyboardType="number-pad" placeholderTextColor={screenColors.textSecondary} />
            <TextInput style={styles.input} placeholder={t('license_plate')} value={formData.license_plate} onChangeText={v => handleInputChange('license_plate', v)} placeholderTextColor={screenColors.textSecondary} />
            <TextInput style={styles.input} placeholder={t('vin')} value={formData.vin} onChangeText={v => handleInputChange('vin', v)} placeholderTextColor={screenColors.textSecondary} />
            <TextInput style={styles.input} placeholder={t('color')} value={formData.color} onChangeText={v => handleInputChange('color', v)} placeholderTextColor={screenColors.textSecondary} />
            <TextInput style={styles.input} placeholder={t('seats')} value={String(formData.seats_count)} onChangeText={v => handleInputChange('seats_count', v)} keyboardType="number-pad" placeholderTextColor={screenColors.textSecondary} />

            <Text style={styles.sectionTitle}>{t('fuel_and_engine')}</Text>
             <TouchableOpacity style={styles.selectorButton} onPress={() => setShowFuelTypeModal(true)}>
                <Text style={styles.selectorText}>{selectedFuelTypeName ? t(`fuel_types.${selectedFuelTypeName.toLowerCase()}`, selectedFuelTypeName) : t('select_fuel_type')}</Text>
                <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
            </TouchableOpacity>
            <TextInput style={styles.input} placeholder={t('avg_consumption')} value={String(formData.avg_consumption)} onChangeText={v => handleInputChange('avg_consumption', v)} keyboardType="numeric" placeholderTextColor={screenColors.textSecondary} />
            <TextInput style={styles.input} placeholder={t('fuel_consumption_city')} value={String(formData.fuel_consumption_city)} onChangeText={v => handleInputChange('fuel_consumption_city', v)} keyboardType="numeric" placeholderTextColor={screenColors.textSecondary} />
            <TextInput style={styles.input} placeholder={t('fuel_consumption_highway')} value={String(formData.fuel_consumption_highway)} onChangeText={v => handleInputChange('fuel_consumption_highway', v)} keyboardType="numeric" placeholderTextColor={screenColors.textSecondary} />
            <TextInput style={styles.input} placeholder={t('engine_power_hp')} value={String(formData.engine_power_hp)} onChangeText={v => handleInputChange('engine_power_hp', v)} keyboardType="numeric" placeholderTextColor={screenColors.textSecondary} />
            <TextInput style={styles.input} placeholder={t('fuel_tank_capacity')} value={String(formData.fuel_tank_capacity)} onChangeText={v => handleInputChange('fuel_tank_capacity', v)} keyboardType="numeric" placeholderTextColor={screenColors.textSecondary} />

            <Text style={styles.sectionTitle}>{t('capacity_and_license')}</Text>
            <TextInput style={styles.input} placeholder={t('cargo_capacity_kg')} value={String(formData.cargo_capacity_kg)} onChangeText={v => handleInputChange('cargo_capacity_kg', v)} keyboardType="numeric" placeholderTextColor={screenColors.textSecondary} />
            <TextInput style={styles.input} placeholder={t('required_license_category')} value={formData.required_license_category} onChangeText={v => handleInputChange('required_license_category', v)} placeholderTextColor={screenColors.textSecondary} />

            <Text style={styles.sectionTitle}>{t('registration_and_insurance')}</Text>
            <TextInput style={styles.input} placeholder={t('registration_cost_annual')} value={String(formData.registration_cost_annual)} onChangeText={v => handleInputChange('registration_cost_annual', v)} keyboardType="numeric" placeholderTextColor={screenColors.textSecondary} />
            <TextInput style={styles.input} placeholder={t('insurance_cost_annual')} value={String(formData.insurance_cost_annual)} onChangeText={v => handleInputChange('insurance_cost_annual', v)} keyboardType="numeric" placeholderTextColor={screenColors.textSecondary} />

            <Text style={styles.sectionTitle}>{t('service_info')}</Text>
            <TextInput style={styles.input} placeholder={t('service_interval_km')} value={String(formData.service_interval_km)} onChangeText={v => handleInputChange('service_interval_km', v)} keyboardType="numeric" placeholderTextColor={screenColors.textSecondary} />
            <TextInput style={styles.input} placeholder={t('service_interval_months')} value={String(formData.service_interval_months)} onChangeText={v => handleInputChange('service_interval_months', v)} keyboardType="numeric" placeholderTextColor={screenColors.textSecondary} />

            <Text style={styles.sectionTitle}>{t('ownership')}</Text>
            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>{t('private_vehicle')}</Text>
                <Switch value={Boolean(formData.is_private_vehicle)} onValueChange={v => handleInputChange('is_private_vehicle', v)} />
            </View>
            {Boolean(formData.is_private_vehicle) && (
                <TouchableOpacity style={styles.selectorButton} onPress={() => setShowUserModal(true)}>
                    <Text style={styles.selectorText}>{selectedUserName || t('select_vehicle_owner', 'Select Vehicle Owner')}</Text>
                    <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
                </TouchableOpacity>
            )}
        </ScrollView>
    );
  }

  if (isLoadingVehicles) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={screenColors.primary} /><Text style={styles.loadingText}>{t('loading_vehicles')}</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={screenColors.text} /></TouchableOpacity>
        <Text style={styles.headerTitle}>{t('vehicle_management')}</Text>
      </View>

      <FlatList
        data={vehiclesData || []}
        renderItem={renderVehicleItem}
        keyExtractor={item => item.vehicle_id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={isLoadingVehicles} onRefresh={refetchVehicles} tintColor={screenColors.primary} />}
        ListEmptyComponent={<View style={styles.emptyContainer}><Text style={styles.emptyText}>{t('no_vehicles_found')}</Text><Text style={styles.emptySubtext}>{t('add_new_vehicle_to_start')}</Text></View>}
        ListHeaderComponent={
            <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal(null)}>
                <Ionicons name="add" size={24} color={'white'} />
                <Text style={styles.addButtonText}>{t('add_vehicle')}</Text>
            </TouchableOpacity>
        }
      />
      
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)} presentationStyle="formSheet">
        <SafeAreaView style={styles.modalView} edges={['top', 'left', 'right']}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editingVehicle ? t('edit_vehicle') : t('add_vehicle')}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={screenColors.text} />
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContent}>
            {renderForm()}
             <View style={{padding: 16}}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isCreating || isUpdating}>
                    {(isCreating || isUpdating) ? <ActivityIndicator color={'white'} /> : <Text style={styles.saveButtonText}>{t('common.save', 'Save')}</Text>}
                </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      <SelectorModal
        visible={showVehicleTypeModal}
        onClose={() => setShowVehicleTypeModal(false)}
        onSelect={item => handleInputChange('vehicle_type_id', item.vehicle_type_id)}
        title={t('select_vehicle_type')}
        selectedId={formData.vehicle_type_id}
        data={vehicleTypesData}
        isLoading={isLoadingVehicleTypes}
        renderItem={item => ({ id: item.vehicle_type_id, name: String(t(`vehicle_types.${item.name.toLowerCase()}`, item.name)), description: item.description ? String(t(`vehicle_type_descriptions.${item.name.toLowerCase()}`, item.description)) : undefined })}
      />

      <SelectorModal
        visible={showFuelTypeModal}
        onClose={() => setShowFuelTypeModal(false)}
        onSelect={item => handleInputChange('fuel_type_id', item.fuel_type_id)}
        title={t('select_fuel_type')}
        selectedId={formData.fuel_type_id}
        data={fuelTypesData}
        isLoading={isLoadingFuelTypes}
        renderItem={item => ({ id: item.fuel_type_id, name: String(t(`fuel_types.${item.name.toLowerCase()}`, item.name)) })}
      />

      <SelectorModal
        visible={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSelect={item => {
          handleInputChange('private_owner_id', item.user_id);
          handleInputChange('private_owner_name', `${item.first_name} ${item.last_name}`.trim());
        }}
        title={t('select_vehicle_owner', 'Select Vehicle Owner')}
        selectedId={formData.private_owner_id}
        data={usersData}
        isLoading={isLoadingUsers}
        renderItem={item => ({ 
          id: item.user_id, 
          name: `${item.first_name} ${item.last_name}`.trim(),
          description: item.email || undefined
        })}
      />

    </SafeAreaView>
  );
};

export default VehicleManagementScreen; 