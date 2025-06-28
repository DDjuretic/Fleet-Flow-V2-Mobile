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

  Modal,
  FlatList,
  Switch,
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { showSuccessToast, showErrorToast, showWarningToast } from '../../utils/toastUtils';

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';

// Auth & API
import { useAuth } from '../../contexts/AuthContext';
import { 
  useGetExpenseCategoriesQuery, 
  useCreateExpenseMutation,
  useGetVehiclesQuery,
  DbVehicle,
  DbExpenseCategory
} from '../../store/api/supabaseApi';

interface FormData {
  amount: string;
  currency: string;
  category_id: string;
  description: string;
  expense_date: Date;
  vehicle_id: string;
  payment_method: string;
  is_reimbursable: boolean;
  
  // Fuel specific fields
  fuel_liters: string;
  fuel_price_per_liter: string;
  
  // Receipt
  receipt_image: string | null;
}

export default function EnhancedAddExpenseScreen({ navigation }: any) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  
  // API hooks
  const { data: expenseCategories = [], isLoading: isLoadingCategories } = useGetExpenseCategoriesQuery();
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useGetVehiclesQuery();
  const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();

  const screenColors = themeMode === 'dark' ? Colors.DARK : Colors.LIGHT;

  // Form state
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    currency: 'EUR',
    category_id: '',
    description: '',
    expense_date: new Date(),
    vehicle_id: '',
    payment_method: '',
    is_reimbursable: true,
    fuel_liters: '',
    fuel_price_per_liter: '',
    receipt_image: null
  });

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Get selected category and vehicle info
  const selectedCategory = expenseCategories.find(cat => cat.expense_category_id === formData.category_id);
  const selectedVehicle = vehicles.find(vehicle => vehicle.vehicle_id === formData.vehicle_id);
  const isFuelCategory = selectedCategory?.name?.toLowerCase().includes('fuel') || 
                        selectedCategory?.name?.toLowerCase().includes('gorivo');

  const paymentMethods = [
    { id: 'cash', name: 'Cash', icon: 'cash-outline' },
    { id: 'card', name: 'Credit Card', icon: 'card-outline' },
    { id: 'fuel_card', name: 'Fuel Card', icon: 'car-outline' },
    { id: 'company_account', name: 'Company Account', icon: 'business-outline' },
  ];

  const currencies = ['EUR', 'USD', 'GBP', 'BAM'];

  // Auto-calculate amount when fuel data changes
  useEffect(() => {
    if (isFuelCategory && formData.fuel_liters && formData.fuel_price_per_liter) {
      const liters = parseFloat(formData.fuel_liters);
      const pricePerLiter = parseFloat(formData.fuel_price_per_liter);
      if (!isNaN(liters) && !isNaN(pricePerLiter)) {
        const calculatedAmount = (liters * pricePerLiter).toFixed(2);
        setFormData(prev => ({ ...prev, amount: calculatedAmount }));
      }
    }
  }, [formData.fuel_liters, formData.fuel_price_per_liter, isFuelCategory]);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = t('enter_valid_amount', 'Please enter a valid amount');
    }

    if (!formData.category_id) {
      newErrors.category_id = t('please_select_category', 'Please select a category');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('description_required', 'Description is required');
    }

    if (isFuelCategory) {
      if (!formData.fuel_liters || parseFloat(formData.fuel_liters) <= 0) {
        newErrors.fuel_liters = t('fuel_liters_required', 'Fuel liters required for fuel expenses');
      }
      if (!formData.fuel_price_per_liter || parseFloat(formData.fuel_price_per_liter) <= 0) {
        newErrors.fuel_price_per_liter = t('fuel_price_required', 'Fuel price per liter required');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showErrorToast('validation_error', 'please_correct_errors');
      return;
    }

    if (!user) {
      showErrorToast('error', 'user_not_authenticated');
      return;
    }

    const expenseData = {
      user_id: user.id,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      expense_date: formData.expense_date.toISOString().split('T')[0],
      description: formData.description.trim(),
      expense_category_id: formData.category_id,
      vehicle_id: formData.vehicle_id || null,
      payment_method: formData.payment_method || null,
      fuel_liters: isFuelCategory && formData.fuel_liters ? parseFloat(formData.fuel_liters) : null,
      fuel_price_per_liter: isFuelCategory && formData.fuel_price_per_liter ? parseFloat(formData.fuel_price_per_liter) : null,
      is_reimbursable: formData.is_reimbursable,
    };

    try {
      console.log('💰 Creating expense:', expenseData);
      await createExpense(expenseData).unwrap();
      showSuccessToast('expense_saved', 'expense_created_successfully');
      navigation.goBack();
    } catch (error: any) {
      console.error('💰 Error creating expense:', error);
      showErrorToast('error', error.data ? null : 'failed_create_expense');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showWarningToast('permission_required', 'camera_permission_needed');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      updateFormData('receipt_image', result.assets[0].uri);
    }
  };

  const renderCategoryModal = () => (
    <Modal visible={showCategoryModal} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: screenColors.background }]}>
        <View style={[styles.modalHeader, { backgroundColor: screenColors.card, borderBottomColor: screenColors.border }]}>
          <Text style={[styles.modalTitle, { color: screenColors.text }]}>
            {t('select_category', 'Select Category')}
          </Text>
          <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
            <Ionicons name="close" size={24} color={screenColors.text} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={expenseCategories}
          keyExtractor={(item) => item.expense_category_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.listItem, { backgroundColor: screenColors.card }]}
              onPress={() => {
                updateFormData('category_id', item.expense_category_id);
                setShowCategoryModal(false);
              }}
            >
              <View style={styles.listItemContent}>
                <Text style={[styles.listItemText, { color: screenColors.text }]}>{item.name}</Text>
                {item.description && (
                  <Text style={[styles.listItemSubtext, { color: screenColors.textSecondary }]}>{item.description}</Text>
                )}
              </View>
              {formData.category_id === item.expense_category_id && (
                <Ionicons name="checkmark-circle" size={20} color={screenColors.primary} />
              )}
            </TouchableOpacity>
          )}
          style={styles.modalList}
        />
      </SafeAreaView>
    </Modal>
  );

  const renderVehicleModal = () => (
    <Modal visible={showVehicleModal} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: screenColors.background }]}>
        <View style={[styles.modalHeader, { backgroundColor: screenColors.card, borderBottomColor: screenColors.border }]}>
          <Text style={[styles.modalTitle, { color: screenColors.text }]}>
            {t('select_vehicle', 'Select Vehicle')}
          </Text>
          <TouchableOpacity onPress={() => setShowVehicleModal(false)}>
            <Ionicons name="close" size={24} color={screenColors.text} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.vehicle_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.listItem, { backgroundColor: screenColors.card }]}
              onPress={() => {
                updateFormData('vehicle_id', item.vehicle_id);
                setShowVehicleModal(false);
              }}
            >
              <View style={styles.vehicleItemIcon}>
                <Ionicons name="car-outline" size={20} color={screenColors.primary} />
              </View>
              <View style={styles.listItemContent}>
                <Text style={[styles.listItemText, { color: screenColors.text }]}>
                  {item.make} {item.model}
                </Text>
                <Text style={[styles.listItemSubtext, { color: screenColors.textSecondary }]}>
                  {item.license_plate} • {item.fuel_types?.name || 'Unknown fuel'}
                </Text>
              </View>
              {formData.vehicle_id === item.vehicle_id && (
                <Ionicons name="checkmark-circle" size={20} color={screenColors.primary} />
              )}
            </TouchableOpacity>
          )}
          style={styles.modalList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="car-outline" size={48} color={screenColors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: screenColors.textSecondary }]}>
                {t('no_vehicles_available', 'No vehicles available')}
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );

  const renderPaymentModal = () => (
    <Modal visible={showPaymentModal} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: screenColors.background }]}>
        <View style={[styles.modalHeader, { backgroundColor: screenColors.card, borderBottomColor: screenColors.border }]}>
          <Text style={[styles.modalTitle, { color: screenColors.text }]}>
            {t('select_payment_method', 'Select Payment Method')}
          </Text>
          <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
            <Ionicons name="close" size={24} color={screenColors.text} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={paymentMethods}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.listItem, { backgroundColor: screenColors.card }]}
              onPress={() => {
                updateFormData('payment_method', item.id);
                setShowPaymentModal(false);
              }}
            >
              <View style={styles.vehicleItemIcon}>
                <Ionicons name={item.icon as any} size={20} color={screenColors.primary} />
              </View>
              <View style={styles.listItemContent}>
                <Text style={[styles.listItemText, { color: screenColors.text }]}>{item.name}</Text>
              </View>
              {formData.payment_method === item.id && (
                <Ionicons name="checkmark-circle" size={20} color={screenColors.primary} />
              )}
            </TouchableOpacity>
          )}
          style={styles.modalList}
        />
      </SafeAreaView>
    </Modal>
  );

  if (isLoadingCategories || isLoadingVehicles) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={screenColors.primary} />
          <Text style={[styles.loadingText, { color: screenColors.textSecondary }]}>
            {t('loading', 'Loading...')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: screenColors.card, borderBottomColor: screenColors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={screenColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: screenColors.text }]}>
          {t('add_expense', 'Add Expense')}
        </Text>
        <TouchableOpacity onPress={handleSave} disabled={isCreating} style={styles.saveButton}>
          {isCreating ? (
            <ActivityIndicator size="small" color={screenColors.primary} />
          ) : (
            <Text style={[styles.saveButtonText, { color: screenColors.primary }]}>
              {t('save', 'Save')}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* BASIC EXPENSE FORM */}
        <View style={[styles.section, { backgroundColor: screenColors.card }]}>
          <Text style={[styles.sectionTitle, { color: screenColors.text }]}>
            {t('expense_details', 'Expense Details')}
          </Text>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: screenColors.textSecondary }]}>
              {t('amount', 'Amount')} (€) *
            </Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: screenColors.background,
                  borderColor: errors.amount ? screenColors.danger : screenColors.border,
                  color: screenColors.text
                }
              ]}
              value={formData.amount}
              onChangeText={(text) => updateFormData('amount', text)}
              placeholder="0.00"
              placeholderTextColor={screenColors.textSecondary}
              keyboardType="decimal-pad"
            />
            {errors.amount && (
              <Text style={[styles.errorText, { color: screenColors.danger }]}>{errors.amount}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: screenColors.textSecondary }]}>
              {t('description', 'Description')} *
            </Text>
            <TextInput
              style={[
                styles.textArea,
                { 
                  backgroundColor: screenColors.background,
                  borderColor: errors.description ? screenColors.danger : screenColors.border,
                  color: screenColors.text
                }
              ]}
              value={formData.description}
              onChangeText={(text) => updateFormData('description', text)}
              placeholder={t('enter_description', 'Enter expense description...')}
              placeholderTextColor={screenColors.textSecondary}
              multiline
              numberOfLines={3}
            />
            {errors.description && (
              <Text style={[styles.errorText, { color: screenColors.danger }]}>{errors.description}</Text>
            )}
          </View>
        </View>

        {/* Category */}
        <View style={[styles.section, { backgroundColor: screenColors.card }]}>
          <Text style={[styles.sectionTitle, { color: screenColors.text }]}>
            {t('category_details', 'Category Details')}
          </Text>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: screenColors.textSecondary }]}>
              {t('category', 'Category')} *
            </Text>
            <TouchableOpacity
              style={[
                styles.pickerButton,
                { 
                  backgroundColor: screenColors.background,
                  borderColor: errors.category_id ? screenColors.danger : screenColors.border
                }
              ]}
              onPress={() => setShowCategoryModal(true)}
            >
              <Text style={[
                styles.pickerButtonText, 
                { color: selectedCategory ? screenColors.text : screenColors.textSecondary }
              ]}>
                {selectedCategory?.name || t('select_category', 'Select Category')}
              </Text>
              <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
            </TouchableOpacity>
            {errors.category_id && (
              <Text style={[styles.errorText, { color: screenColors.danger }]}>{errors.category_id}</Text>
            )}
          </View>
        </View>

        {/* Fuel-specific fields */}
        {isFuelCategory && (
          <View style={[styles.section, { backgroundColor: screenColors.card }]}>
            <View style={styles.fuelHeader}>
              <MaterialCommunityIcons name="gas-station" size={20} color={screenColors.primary} />
              <Text style={[styles.sectionTitle, { color: screenColors.text, marginLeft: 8 }]}>
                {t('fuel_details', 'Fuel Details')}
              </Text>
            </View>
            
            <View style={styles.fuelRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.label, { color: screenColors.textSecondary }]}>
                  {t('fuel_liters', 'Liters')} *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: screenColors.background,
                      borderColor: errors.fuel_liters ? screenColors.danger : screenColors.border,
                      color: screenColors.text
                    }
                  ]}
                  value={formData.fuel_liters}
                  onChangeText={(text) => updateFormData('fuel_liters', text)}
                  placeholder="0.0"
                  placeholderTextColor={screenColors.textSecondary}
                  keyboardType="decimal-pad"
                />
                {errors.fuel_liters && (
                  <Text style={[styles.errorText, { color: screenColors.danger }]}>{errors.fuel_liters}</Text>
                )}
              </View>
              
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.label, { color: screenColors.textSecondary }]}>
                  {t('price_per_liter', 'Price/Liter')} *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: screenColors.background,
                      borderColor: errors.fuel_price_per_liter ? screenColors.danger : screenColors.border,
                      color: screenColors.text
                    }
                  ]}
                  value={formData.fuel_price_per_liter}
                  onChangeText={(text) => updateFormData('fuel_price_per_liter', text)}
                  placeholder="0.00"
                  placeholderTextColor={screenColors.textSecondary}
                  keyboardType="decimal-pad"
                />
                {errors.fuel_price_per_liter && (
                  <Text style={[styles.errorText, { color: screenColors.danger }]}>{errors.fuel_price_per_liter}</Text>
                )}
              </View>
            </View>
            
            {formData.fuel_liters && formData.fuel_price_per_liter && (
              <View style={[styles.calculationPreview, { backgroundColor: screenColors.background, borderColor: screenColors.border }]}>
                <Text style={[styles.calculationText, { color: screenColors.textSecondary }]}>
                  {formData.fuel_liters}L × €{formData.fuel_price_per_liter} = €{formData.amount}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Vehicle & Payment */}
        <View style={[styles.section, { backgroundColor: screenColors.card }]}>
          <Text style={[styles.sectionTitle, { color: screenColors.text }]}>
            {t('additional_details', 'Additional Details')}
          </Text>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: screenColors.textSecondary }]}>
              {t('vehicle', 'Vehicle')} {isFuelCategory && '*'}
            </Text>
            <TouchableOpacity
              style={[styles.pickerButton, { backgroundColor: screenColors.background, borderColor: screenColors.border }]}
              onPress={() => setShowVehicleModal(true)}
            >
              <Text style={[
                styles.pickerButtonText, 
                { color: selectedVehicle ? screenColors.text : screenColors.textSecondary }
              ]}>
                {selectedVehicle 
                  ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.license_plate})`
                  : t('select_vehicle_optional', 'Select Vehicle (Optional)')
                }
              </Text>
              <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: screenColors.textSecondary }]}>
              {t('payment_method', 'Payment Method')}
            </Text>
            <TouchableOpacity
              style={[styles.pickerButton, { backgroundColor: screenColors.background, borderColor: screenColors.border }]}
              onPress={() => setShowPaymentModal(true)}
            >
              <Text style={[
                styles.pickerButtonText, 
                { color: formData.payment_method ? screenColors.text : screenColors.textSecondary }
              ]}>
                {formData.payment_method 
                  ? paymentMethods.find(m => m.id === formData.payment_method)?.name
                  : t('select_payment_method', 'Select Payment Method')
                }
              </Text>
              <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: screenColors.textSecondary }]}>
              {t('expense_date', 'Expense Date')}
            </Text>
            <TouchableOpacity
              style={[styles.pickerButton, { backgroundColor: screenColors.background, borderColor: screenColors.border }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.pickerButtonText, { color: screenColors.text }]}>
                {formData.expense_date.toLocaleDateString()}
              </Text>
              <Ionicons name="calendar-outline" size={20} color={screenColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.switchRow}>
            <Text style={[styles.label, { color: screenColors.text, flex: 1 }]}>
              {t('is_reimbursable', 'Reimbursable')}
            </Text>
            <Switch
              value={formData.is_reimbursable}
              onValueChange={(value) => updateFormData('is_reimbursable', value)}
              trackColor={{ false: screenColors.border, true: screenColors.primary + '40' }}
              thumbColor={formData.is_reimbursable ? screenColors.primary : screenColors.textSecondary}
            />
          </View>
        </View>

        {/* Receipt */}
        <View style={[styles.section, { backgroundColor: screenColors.card }]}>
          <Text style={[styles.sectionTitle, { color: screenColors.text }]}>
            {t('receipt', 'Receipt')}
          </Text>
          
          <TouchableOpacity
            style={[styles.receiptButton, { backgroundColor: screenColors.background, borderColor: screenColors.border }]}
            onPress={pickImage}
          >
            <Ionicons name="camera-outline" size={24} color={screenColors.primary} />
            <Text style={[styles.receiptButtonText, { color: screenColors.text }]}>
              {formData.receipt_image ? t('receipt_added', 'Receipt Added') : t('add_receipt', 'Add Receipt Photo')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.expense_date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              updateFormData('expense_date', selectedDate);
            }
          }}
          maximumDate={new Date()}
        />
      )}

      {/* Modals */}
      {renderCategoryModal()}
      {renderVehicleModal()}
      {renderPaymentModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  fuelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  amountContainer: {
    flex: 1,
  },
  currencyContainer: {
    flex: 0,
    minWidth: 80,
  },
  fuelRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  pickerButtonText: {
    fontSize: 16,
    flex: 1,
  },
  calculationPreview: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  calculationText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  receiptButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
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
  modalList: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  vehicleItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listItemContent: {
    flex: 1,
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  listItemSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 12,
  },
}); 