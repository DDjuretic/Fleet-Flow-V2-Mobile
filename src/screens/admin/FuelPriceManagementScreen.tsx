import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store/rootReducer';
import Colors from '../../constants/Colors';
import {
  useGetFuelPricesQuery,
  useGetFuelTypesQuery,
  useCreateFuelPriceMutation,
  useUpdateFuelPriceMutation,
  useDeleteFuelPriceMutation,
  DbFuelPrice,
  DbFuelType
} from '../../store/api/supabaseApi';
import DateTimePicker from '@react-native-community/datetimepicker';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';

interface FuelPriceFormData {
  fuel_type_id: string;
  fuel_subtype: string;
  price_per_unit: string;
  currency: string;
  effective_date: string;
  source: string;
  region: string;
  supplier_company: string;
  gas_station: string;
  notes: string;
}

interface FuelTypeSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (fuelType: DbFuelType) => void;
  title: string;
  selectedFuelTypeId?: string;
}

const FuelTypeSelectorModal: React.FC<FuelTypeSelectorModalProps> = ({ 
  visible, 
  onClose, 
  onSelect, 
  title, 
  selectedFuelTypeId 
}) => {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const { data: fuelTypes, isLoading } = useGetFuelTypesQuery();

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

  const renderFuelType = ({ item }: { item: DbFuelType }) => (
    <TouchableOpacity
      style={[
        styles.fuelTypeItem, 
        { 
          backgroundColor: selectedFuelTypeId === item.fuel_type_id ? screenColors.primary + '20' : screenColors.card,
          borderColor: selectedFuelTypeId === item.fuel_type_id ? screenColors.primary : screenColors.border 
        }
      ]}
      onPress={() => {
        onSelect(item);
        onClose();
      }}
    >
      <View style={styles.fuelTypeInfo}>
        <Text style={[styles.fuelTypeName, { color: screenColors.text }]}>{item.name}</Text>
        <Text style={[styles.fuelTypeUnit, { color: screenColors.textSecondary }]}>{t('unit')}: {item.unit}</Text>
        {item.description && (
          <Text style={[styles.fuelTypeDescription, { color: screenColors.textSecondary }]}>{item.description}</Text>
        )}
      </View>
      {selectedFuelTypeId === item.fuel_type_id && (
        <Ionicons name="checkmark-circle" size={24} color={screenColors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: screenColors.background }]}>
        <View style={[styles.modalHeader, { borderBottomColor: screenColors.border }]}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={screenColors.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: screenColors.text }]}>{title}</Text>
          <View style={{ width: 24 }} />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={screenColors.primary} />
            <Text style={[styles.loadingText, { color: screenColors.textSecondary }]}>
              {t('loading_fuel_types')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={fuelTypes}
            keyExtractor={(item) => item.fuel_type_id}
            renderItem={renderFuelType}
            contentContainerStyle={styles.fuelTypeList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="car-sport-outline" size={64} color={screenColors.textSecondary} />
                <Text style={[styles.emptyText, { color: screenColors.textSecondary }]}>
                  {t('no_fuel_types_found')}
                </Text>
                <Text style={[styles.emptySubtext, { color: screenColors.textSecondary }]}>
                  {t('contact_system_admin')}
                </Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const FuelPriceManagementScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFuelTypeModal, setShowFuelTypeModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingFuelPrice, setEditingFuelPrice] = useState<DbFuelPrice | null>(null);
  const [formData, setFormData] = useState<FuelPriceFormData>({
    fuel_type_id: '',
    fuel_subtype: '',
    price_per_unit: '',
    currency: 'EUR',
    effective_date: new Date().toISOString().split('T')[0],
    source: 'Manual',
    region: '',
    supplier_company: '',
    gas_station: '',
    notes: '',
  });

  // API hooks
  const { data: fuelPrices, isLoading, refetch } = useGetFuelPricesQuery({ latest_only: false });
  const { data: fuelTypes } = useGetFuelTypesQuery();
  const [createPrice, { isLoading: creating }] = useCreateFuelPriceMutation();
  const [updatePrice, { isLoading: updating }] = useUpdateFuelPriceMutation();
  const [deletePrice, { isLoading: deleting }] = useDeleteFuelPriceMutation();

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
  };

  const resetForm = () => {
    setFormData({
      fuel_type_id: '',
      fuel_subtype: '',
      price_per_unit: '',
      currency: 'EUR',
      effective_date: new Date().toISOString().split('T')[0],
      source: 'Manual',
      region: '',
      supplier_company: '',
      gas_station: '',
      notes: '',
    });
  };

  const handleAdd = () => {
    resetForm();
    setEditingFuelPrice(null);
    setShowAddModal(true);
  };

  const handleEdit = (price: DbFuelPrice) => {
    setEditingFuelPrice(price);
    
    // Parse existing source field for additional data (company:gas_station:subtype format)
    const sourceData = price.source?.split(':') || [];
    const actualSource = sourceData[0] || 'Manual';
    const supplierCompany = sourceData[1] || '';
    const gasStation = sourceData[2] || '';
    const fuelSubtype = sourceData[3] || '';
    
    setFormData({
      fuel_type_id: price.fuel_type_id || '',
      fuel_subtype: fuelSubtype,
      price_per_unit: price.price_per_unit?.toString() || '',
      currency: price.currency || 'EUR',
      effective_date: price.effective_date?.split('T')[0] || '',
      source: actualSource,
      region: price.region || '',
      supplier_company: supplierCompany,
      gas_station: gasStation,
      notes: price.notes || '',
    });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    // Validation
    if (!formData.fuel_type_id || !formData.price_per_unit || !formData.effective_date) {
      showErrorToast('common.error', 'fill_required_fields');
      return;
    }

    const price = parseFloat(formData.price_per_unit);
    if (isNaN(price) || price <= 0) {
      showErrorToast('common.error', 'invalid_price_error');
      return;
    }

    try {
      // Combine additional fields into source field (source:company:station:subtype format)
      const combinedSource = [
        formData.source || 'Manual',
        formData.supplier_company || '',
        formData.gas_station || '',
        formData.fuel_subtype || ''
      ].join(':');

      const priceData = {
        fuel_type_id: formData.fuel_type_id,
        price_per_unit: price,
        currency: formData.currency || 'EUR',
        effective_date: formData.effective_date,
        source: combinedSource,
        region: formData.region || null,
        notes: formData.notes || null,
      };

      if (showEditModal && editingFuelPrice) {
        await updatePrice({ 
          price_id: editingFuelPrice.price_id, 
          ...priceData 
        }).unwrap();
        showSuccessToast('common.success', 'fuel_price_updated_success');
      } else {
        await createPrice(priceData).unwrap();
        showSuccessToast('common.success', 'fuel_price_created_success');
      }

      setShowAddModal(false);
      setShowEditModal(false);
      resetForm();
      setEditingFuelPrice(null);
    } catch (error) {
      console.error('Error saving fuel price:', error);
      showErrorToast('common.error', 'fuel_price_save_error');
    }
  };

  const handleDelete = async (price: DbFuelPrice) => {
    try {
      await deletePrice(price.price_id).unwrap();
      showSuccessToast('common.success', 'fuel_price_deleted_success');
    } catch (error) {
      console.error('Error deleting fuel price:', error);
      showErrorToast('common.error', 'fuel_price_delete_error');
    }
  };

  const getFuelTypeName = (fuelTypeId: string) => {
    const fuelType = fuelTypes?.find(ft => ft.fuel_type_id === fuelTypeId);
    return fuelType?.name || t('unknown_fuel_type');
  };

  const getFuelTypeUnit = (fuelTypeId: string) => {
    const fuelType = fuelTypes?.find(ft => ft.fuel_type_id === fuelTypeId);
    return fuelType?.unit || 'unit';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleFuelTypeSelect = (fuelType: DbFuelType) => {
    setFormData(prev => ({ ...prev, fuel_type_id: fuelType.fuel_type_id }));
  };

  const clearFuelType = () => {
    setFormData(prev => ({ ...prev, fuel_type_id: '' }));
  };

  const renderPriceItem = ({ item }: { item: DbFuelPrice }) => {
    // Parse additional data from source field
    const sourceData = item.source?.split(':') || [];
    const actualSource = sourceData[0] || 'Manual';
    const supplierCompany = sourceData[1] || '';
    const gasStation = sourceData[2] || '';
    const fuelSubtype = sourceData[3] || '';

    return (
      <View style={[styles.priceCard, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
        <View style={styles.priceHeader}>
          <View style={styles.priceInfo}>
            <Text style={[styles.fuelTypeName, { color: screenColors.text }]}>
              {getFuelTypeName(item.fuel_type_id)}
              {fuelSubtype && <Text style={[styles.fuelSubtype, { color: screenColors.textSecondary }]}> ({fuelSubtype})</Text>}
            </Text>
            <Text style={[styles.priceAmount, { color: screenColors.success }]}>
              {item.price_per_unit} {item.currency}/{getFuelTypeUnit(item.fuel_type_id)}
            </Text>
          </View>
          <View style={styles.priceActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: screenColors.primary }]}
              onPress={() => handleEdit(item)}
            >
              <Ionicons name="pencil" size={16} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: screenColors.danger }]}
              onPress={() => handleDelete(item)}
            >
              <Ionicons name="trash" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.priceDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color={screenColors.primary} />
            <Text style={[styles.detailText, { color: screenColors.textSecondary }]}>
              Effective: {formatDate(item.effective_date)}
            </Text>
          </View>
          {item.region && (
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color={screenColors.primary} />
              <Text style={[styles.detailText, { color: screenColors.textSecondary }]}>
                {t('region')}: {item.region}
              </Text>
            </View>
          )}
          {supplierCompany && (
            <View style={styles.detailItem}>
              <Ionicons name="business-outline" size={16} color={screenColors.primary} />
              <Text style={[styles.detailText, { color: screenColors.textSecondary }]}>
                Supplier: {supplierCompany}
              </Text>
            </View>
          )}
          {gasStation && (
            <View style={styles.detailItem}>
              <Ionicons name="car-sport-outline" size={16} color={screenColors.primary} />
              <Text style={[styles.detailText, { color: screenColors.textSecondary }]}>
                {t('gas_station')}: {gasStation}
              </Text>
            </View>
          )}
          <View style={styles.detailItem}>
            <Ionicons name="document-text-outline" size={16} color={screenColors.primary} />
            <Text style={[styles.detailText, { color: screenColors.textSecondary }]}>
              {t('source')}: {actualSource}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderFormModal = (visible: boolean, onClose: () => void, title: string) => (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: screenColors.background }]}>
        <View style={[styles.modalHeader, { borderBottomColor: screenColors.border }]}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={screenColors.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: screenColors.text }]}>{title}</Text>
          <TouchableOpacity 
            onPress={handleSave}
            disabled={creating || updating}
          >
            {creating || updating ? (
              <ActivityIndicator size="small" color={screenColors.primary} />
            ) : (
              <Text style={[styles.saveButton, { color: screenColors.primary }]}>{t('save')}</Text>
            )}
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          style={styles.modalContent}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Fuel Type Selection */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>{t('fuel_type')} *</Text>
              <TouchableOpacity
                style={[styles.fuelTypeSelector, { 
                  backgroundColor: screenColors.card, 
                  borderColor: screenColors.border 
                }]}
                onPress={() => setShowFuelTypeModal(true)}
              >
                <View style={styles.fuelTypeSelectorContent}>
                  <Ionicons name="car-sport" size={20} color={screenColors.primary} />
                  <Text style={[styles.fuelTypeSelectorText, { 
                    color: formData.fuel_type_id ? screenColors.text : screenColors.textSecondary 
                  }]}>
                    {formData.fuel_type_id ? getFuelTypeName(formData.fuel_type_id) : t('select_fuel_type_placeholder')}
                  </Text>
                </View>
                {formData.fuel_type_id ? (
                  <TouchableOpacity onPress={clearFuelType}>
                    <Ionicons name="close-circle" size={20} color={screenColors.danger} />
                  </TouchableOpacity>
                ) : (
                  <Ionicons name="chevron-forward" size={20} color={screenColors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>{t('fuel_subtype')}</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.card, 
                  borderColor: screenColors.border,
                  color: screenColors.text 
                }]}
                value={formData.fuel_subtype}
                onChangeText={(text) => setFormData(prev => ({ ...prev, fuel_subtype: text }))}
                placeholder={t('fuel_subtype_placeholder')}
                placeholderTextColor={screenColors.textSecondary}
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 2, marginRight: 8 }]}>
                <Text style={[styles.label, { color: screenColors.text }]}>{t('price_per_unit')} *</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: screenColors.card, 
                    borderColor: screenColors.border,
                    color: screenColors.text 
                  }]}
                  value={formData.price_per_unit}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, price_per_unit: text }))}
                  placeholder={t('price_placeholder')}
                  placeholderTextColor={screenColors.textSecondary}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.label, { color: screenColors.text }]}>{t('currency')}</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: screenColors.card, 
                    borderColor: screenColors.border,
                    color: screenColors.text 
                  }]}
                  value={formData.currency}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, currency: text.toUpperCase() }))}
                  placeholder={t('currency_placeholder')}
                  placeholderTextColor={screenColors.textSecondary}
                  maxLength={3}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>{t('effective_date')} *</Text>
              <TouchableOpacity
                style={[styles.dateButton, { 
                  backgroundColor: screenColors.card, 
                  borderColor: screenColors.border 
                }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[styles.dateText, { color: screenColors.text }]}>
                  {formatDate(formData.effective_date)}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={screenColors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>{t('region')}</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.card, 
                  borderColor: screenColors.border,
                  color: screenColors.text 
                }]}
                value={formData.region}
                onChangeText={(text) => setFormData(prev => ({ ...prev, region: text }))}
                placeholder={t('region_placeholder')}
                placeholderTextColor={screenColors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>{t('supplier_company')}</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.card, 
                  borderColor: screenColors.border,
                  color: screenColors.text 
                }]}
                value={formData.supplier_company}
                onChangeText={(text) => setFormData(prev => ({ ...prev, supplier_company: text }))}
                placeholder={t('supplier_placeholder')}
                placeholderTextColor={screenColors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>{t('gas_station')}</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.card, 
                  borderColor: screenColors.border,
                  color: screenColors.text 
                }]}
                value={formData.gas_station}
                onChangeText={(text) => setFormData(prev => ({ ...prev, gas_station: text }))}
                placeholder={t('gas_station_placeholder')}
                placeholderTextColor={screenColors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>{t('source')}</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.card, 
                  borderColor: screenColors.border,
                  color: screenColors.text 
                }]}
                value={formData.source}
                onChangeText={(text) => setFormData(prev => ({ ...prev, source: text }))}
                placeholder={t('source_placeholder')}
                placeholderTextColor={screenColors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>{t('notes')}</Text>
              <TextInput
                style={[styles.textArea, { 
                  backgroundColor: screenColors.card, 
                  borderColor: screenColors.border,
                  color: screenColors.text 
                }]}
                value={formData.notes}
                onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                placeholder={t('notes_placeholder')}
                placeholderTextColor={screenColors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: screenColors.background, borderBottomColor: screenColors.border }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={screenColors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: screenColors.text }]}>{t('fuel_price_management')}</Text>
          <Text style={[styles.headerSubtitle, { color: screenColors.textSecondary }]}>
            {t('fuel_price_management_desc')}
          </Text>
        </View>
      </View>

      {/* Add Button */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: screenColors.primary }]}
          onPress={handleAdd}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>{t('add_fuel_price')}</Text>
        </TouchableOpacity>
      </View>

      {/* Fuel Prices List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={screenColors.primary} />
          <Text style={[styles.loadingText, { color: screenColors.textSecondary }]}>
            {t('loading_fuel_prices')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={fuelPrices}
          keyExtractor={(item) => item.price_id}
          renderItem={renderPriceItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor={screenColors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="car-sport-outline" size={64} color={screenColors.textSecondary} />
              <Text style={[styles.emptyText, { color: screenColors.textSecondary }]}>
                {t('no_fuel_prices_found')}
              </Text>
              <Text style={[styles.emptySubtext, { color: screenColors.textSecondary }]}>
                {t('add_first_fuel_price')}
              </Text>
            </View>
          }
        />
      )}

      {/* Modals */}
      {renderFormModal(showAddModal, () => setShowAddModal(false), t('add_new_fuel_price'))}
      {renderFormModal(showEditModal, () => setShowEditModal(false), t('edit_fuel_price'))}
      
      <FuelTypeSelectorModal
        visible={showFuelTypeModal}
        onClose={() => setShowFuelTypeModal(false)}
        onSelect={handleFuelTypeSelect}
        title={t('select_fuel_type')}
        selectedFuelTypeId={formData.fuel_type_id}
      />

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date(formData.effective_date)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setFormData(prev => ({ 
                ...prev, 
                effective_date: selectedDate.toISOString().split('T')[0] 
              }));
            }
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 10,
  },
  headerContent: {
    flex: 1,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  actionContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  priceCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceInfo: {
    flex: 1,
  },
  fuelTypeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  fuelSubtype: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  priceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
  },
  form: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  fuelTypeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  fuelTypeSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fuelTypeSelectorText: {
    fontSize: 16,
    marginLeft: 8,
  },
  // Fuel Type Modal styles
  fuelTypeList: {
    padding: 20,
  },
  fuelTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  fuelTypeInfo: {
    flex: 1,
  },
  fuelTypeUnit: {
    fontSize: 14,
  },
  fuelTypeDescription: {
    fontSize: 12,
    marginTop: 4,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
});

export default FuelPriceManagementScreen; 