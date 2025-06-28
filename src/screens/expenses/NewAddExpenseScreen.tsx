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
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
  Switch
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';

// Auth & API
import { useAuth } from '../../contexts/AuthContext';
import { 
  useGetExpenseCategoriesQuery, 
  useCreateExpenseMutation,
  useGetVehiclesQuery,
  useCreateSystemLogMutation
} from '../../store/api/supabaseApi';

// Toast utils
import { showSuccessToast, showErrorToast, showWarningToast } from '../../utils/toastUtils';

// Image upload utils
import { uploadReceiptImage, createExpenseReceiptRecord } from '../../utils/imageUploadUtils';

export default function NewAddExpenseScreen({ navigation }: any) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  
  // API hooks
  const { data: expenseCategories = [], isLoading: isLoadingCategories } = useGetExpenseCategoriesQuery();
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useGetVehiclesQuery();
  const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
  const [createSystemLog] = useCreateSystemLogMutation();

  const screenColors = themeMode === 'dark' ? Colors.DARK : Colors.LIGHT;

  // Form state
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [fuelLiters, setFuelLiters] = useState('');
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isReimbursable, setIsReimbursable] = useState(true);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);

  // Get selected category and vehicle
  const selectedCategory = expenseCategories.find(cat => cat.expense_category_id === selectedCategoryId);
  const selectedVehicle = vehicles.find(veh => veh.vehicle_id === selectedVehicleId);
  const isFuelCategory = selectedCategory?.name?.toLowerCase().includes('fuel') || 
                        selectedCategory?.name?.toLowerCase().includes('gorivo') ||
                        selectedCategory?.name?.toLowerCase().includes('gas');

  const paymentMethods = [
    { id: 'cash', name: 'Cash', icon: 'cash-outline' },
    { id: 'card', name: 'Credit Card', icon: 'card-outline' },
    { id: 'fuel_card', name: 'Fuel Card', icon: 'car-outline' },
    { id: 'company_account', name: 'Company Account', icon: 'business-outline' },
  ];

  // Auto-calculate amount for fuel expenses
  useEffect(() => {
    if (isFuelCategory && fuelLiters && fuelPricePerLiter) {
      const liters = parseFloat(fuelLiters);
      const pricePerLiter = parseFloat(fuelPricePerLiter);
      if (!isNaN(liters) && !isNaN(pricePerLiter)) {
        setAmount((liters * pricePerLiter).toFixed(2));
      }
    }
  }, [fuelLiters, fuelPricePerLiter, isFuelCategory]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!selectedCategoryId) {
      newErrors.category = 'Please select a category';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (isFuelCategory) {
      if (!fuelLiters || parseFloat(fuelLiters) <= 0) {
        newErrors.fuelLiters = 'Fuel liters required for fuel expenses';
      }
      if (!fuelPricePerLiter || parseFloat(fuelPricePerLiter) <= 0) {
        newErrors.fuelPricePerLiter = 'Fuel price per liter required';
      }
      if (!selectedVehicleId) {
        newErrors.vehicle = 'Vehicle is required for fuel expenses';
      }
      
      // Tank capacity info (no error, just visual warning)
      // Actual validation will be handled in handleSave with user confirmation
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showErrorToast('common.error', 'please_correct_form_errors');
      return;
    }

    if (!user) {
      showErrorToast(t('user_not_authenticated', 'User not authenticated. Please log in again.'));
      return;
    }

    // Tank capacity warning check
    if (isFuelCategory && fuelLiters && selectedVehicle) {
      const liters = parseFloat(fuelLiters);
      const tankCapacity = selectedVehicle.fuel_tank_capacity || 50;
      
      if (liters > tankCapacity) {
        showWarningToast(`⚠️ ${liters}L exceeds tank capacity (${tankCapacity}L). Please verify the amount.`);
        // For now, we'll still proceed with the save, but with the warning shown
        // In the future, we could add a confirmation modal here
      }
    }

    proceedWithSave();
  };

  const proceedWithSave = async () => {
    const expenseData = {
      user_id: user.id,
      amount: parseFloat(amount),
      currency: 'EUR',
      expense_date: expenseDate.toISOString().split('T')[0],
      description: description.trim(),
      expense_category_id: selectedCategoryId,
      vehicle_id: selectedVehicleId || null,
      payment_method: paymentMethod,
      fuel_liters: isFuelCategory && fuelLiters ? parseFloat(fuelLiters) : null,
      fuel_price_per_liter: isFuelCategory && fuelPricePerLiter ? parseFloat(fuelPricePerLiter) : null,
      is_reimbursable: isReimbursable,
    };

    try {
      // Create the expense first
      const createdExpense = await createExpense(expenseData).unwrap();
      console.log('✅ Expense created successfully:', createdExpense);
      console.log('📋 Expense ID for receipt:', createdExpense.expense_id);
      
      // Auto-create system logs for monitoring purposes
      await createSystemLogsIfNeeded(createdExpense);
      
      // Upload receipt image to Supabase Storage if exists
      if (receiptImage && createdExpense.expense_id) {
        console.log('📷 Uploading receipt image:', receiptImage);
        setIsUploadingReceipt(true);
        
        const uploadResult = await uploadReceiptImage(
          receiptImage, 
          createdExpense.expense_id, 
          user.id
        );
        
        setIsUploadingReceipt(false);
        
        if (uploadResult.success && uploadResult.url) {
          // Create receipt record in database
          const receiptCreated = await createExpenseReceiptRecord(
            createdExpense.expense_id,
            uploadResult.url,
            `receipt_${createdExpense.expense_id}_${Date.now()}.jpg`,
            user.id,
            uploadResult.path || ''
          );
          
          if (receiptCreated) {
            console.log('✅ Receipt uploaded and recorded successfully');
            showSuccessToast(t('expense_and_receipt_saved', 'Expense and receipt saved successfully!'));
          } else {
            console.warn('⚠️ Receipt uploaded but database record failed');
            showWarningToast(t('expense_saved_receipt_warning', 'Expense saved, but receipt upload had issues.'));
          }
        } else {
          console.error('❌ Receipt upload failed:', uploadResult.error);
          showWarningToast(t('expense_saved_receipt_failed', 'Expense saved, but receipt upload failed.'));
        }
      } else {
        showSuccessToast(t('expense_recorded_successfully', 'New expense has been successfully recorded.'));
      }
      
      navigation.goBack();
    } catch (error: any) {
      console.error('💰 Error creating expense:', error);
      showErrorToast('common.error', 'failed_create_expense');
    }
  };

  // Helper function to create system logs for monitoring
  const createSystemLogsIfNeeded = async (expense: any) => {
    try {
      const expenseAmount = parseFloat(amount);
      
      // 1. Log fuel capacity excess
      if (isFuelCategory && fuelLiters && selectedVehicle) {
        const liters = parseFloat(fuelLiters);
        const tankCapacity = selectedVehicle.fuel_tank_capacity || 50;
        
        if (liters > tankCapacity) {
          await createSystemLog({
            log_type: 'FUEL_EXCESS',
            severity: 'MEDIUM',
            title: 'Fuel Capacity Exceeded',
            description: `User added ${liters}L to a ${tankCapacity}L tank, exceeding capacity by ${(liters - tankCapacity).toFixed(1)}L`,
            metadata: {
              vehicle_tank_capacity: tankCapacity,
              fuel_amount: liters,
              excess_amount: liters - tankCapacity,
              expense_amount: expenseAmount,
              fuel_price_per_liter: parseFloat(fuelPricePerLiter || '0'),
              vehicle_make: selectedVehicle.make,
              vehicle_model: selectedVehicle.model,
              license_plate: selectedVehicle.license_plate
            },
            related_expense_id: expense.expense_id,
            related_vehicle_id: selectedVehicleId,
          }).unwrap();
          
          console.log('🛡️ FUEL_EXCESS log created for capacity violation');
        }
      }
      
      // 2. Log high expense amounts
      if (expenseAmount > 200) {
        const severity = expenseAmount > 500 ? 'HIGH' : expenseAmount > 300 ? 'MEDIUM' : 'LOW';
        
        await createSystemLog({
          log_type: 'HIGH_EXPENSE',
          severity: severity,
          title: 'High Value Expense Submitted',
          description: `User submitted expense of €${expenseAmount} which exceeds normal spending patterns`,
          metadata: {
            expense_amount: expenseAmount,
            expense_category: selectedCategory?.name,
            payment_method: paymentMethod,
            currency: 'EUR',
            expense_description: description.trim(),
            threshold_exceeded: expenseAmount > 500 ? 'CRITICAL' : expenseAmount > 300 ? 'HIGH' : 'MEDIUM'
          },
          related_expense_id: expense.expense_id,
          related_vehicle_id: selectedVehicleId || undefined,
        }).unwrap();
        
        console.log('🛡️ HIGH_EXPENSE log created for amount:', expenseAmount);
      }
      
      // 3. Log unusual fuel expenses (high price per liter)
      if (isFuelCategory && fuelPricePerLiter) {
        const pricePerLiter = parseFloat(fuelPricePerLiter);
        const normalPriceRange = { min: 1.20, max: 1.80 }; // Normal fuel price range in EUR
        
        if (pricePerLiter > normalPriceRange.max * 1.5) { // 50% above normal max
          await createSystemLog({
            log_type: 'SUSPICIOUS_PATTERN',
            severity: 'MEDIUM',
            title: 'Unusually High Fuel Price',
            description: `Fuel price of €${pricePerLiter}/L is significantly above normal range (€${normalPriceRange.min}-€${normalPriceRange.max}/L)`,
            metadata: {
              fuel_price_per_liter: pricePerLiter,
              normal_price_range: normalPriceRange,
              price_deviation_percent: ((pricePerLiter - normalPriceRange.max) / normalPriceRange.max * 100).toFixed(1),
              fuel_amount: parseFloat(fuelLiters || '0'),
              total_fuel_cost: expenseAmount,
              vehicle_info: `${selectedVehicle?.make} ${selectedVehicle?.model}`
            },
            related_expense_id: expense.expense_id,
            related_vehicle_id: selectedVehicleId,
          }).unwrap();
          
          console.log('🛡️ SUSPICIOUS_PATTERN log created for high fuel price:', pricePerLiter);
        }
      }
      
    } catch (error) {
      console.error('🛡️ Error creating system logs:', error);
      // Don't block expense creation if logging fails
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showErrorToast(t('camera_permission_needed', 'Camera permission is needed'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setReceiptImage(result.assets[0].uri);
      showSuccessToast(t('receipt_image_selected', 'Receipt image selected'));
    }
  };

  const renderCategoryModal = () => (
    <Modal visible={showCategoryModal} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: screenColors.background }]}>
        <View style={[styles.modalHeader, { backgroundColor: screenColors.card, borderBottomColor: screenColors.border }]}>
          <Text style={[styles.modalTitle, { color: screenColors.text }]}>Select Category</Text>
          <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
            <Ionicons name="close" size={24} color={screenColors.text} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={expenseCategories}
          keyExtractor={(item) => item.expense_category_id}
          renderItem={({ item }) => {
            const isSelected = selectedCategoryId === item.expense_category_id;
            const isFuel = item.name?.toLowerCase().includes('fuel') || 
                          item.name?.toLowerCase().includes('gorivo');
            
            return (
              <TouchableOpacity
                style={[
                  styles.listItem, 
                  { 
                    backgroundColor: isSelected ? screenColors.primary + '20' : screenColors.card,
                    borderColor: isSelected ? screenColors.primary : 'transparent',
                    borderWidth: isSelected ? 1 : 0
                  }
                ]}
                onPress={() => {
                  setSelectedCategoryId(item.expense_category_id);
                  setShowCategoryModal(false);
                  setErrors(prev => ({ ...prev, category: '' }));
                }}
              >
                <View style={styles.categoryItemIcon}>
                  {isFuel ? (
                    <MaterialCommunityIcons name="gas-station" size={20} color={screenColors.primary} />
                  ) : (
                    <Ionicons name="receipt-outline" size={20} color={screenColors.primary} />
                  )}
                </View>
                <View style={styles.listItemContent}>
                  <Text style={[styles.listItemText, { color: screenColors.text }]}>{item.name}</Text>
                  {item.description && (
                    <Text style={[styles.listItemSubtext, { color: screenColors.textSecondary }]}>
                      {item.description}
                    </Text>
                  )}
                  {isFuel && (
                    <Text style={[styles.fuelCategoryNote, { color: screenColors.primary }]}>
                      ⛽ Requires vehicle & fuel quantity
                    </Text>
                  )}
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={20} color={screenColors.primary} />
                )}
              </TouchableOpacity>
            );
          }}
          style={styles.modalList}
        />
      </SafeAreaView>
    </Modal>
  );

  const renderVehicleModal = () => (
    <Modal visible={showVehicleModal} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: screenColors.background }]}>
        <View style={[styles.modalHeader, { backgroundColor: screenColors.card, borderBottomColor: screenColors.border }]}>
          <Text style={[styles.modalTitle, { color: screenColors.text }]}>Select Vehicle</Text>
          <TouchableOpacity onPress={() => setShowVehicleModal(false)}>
            <Ionicons name="close" size={24} color={screenColors.text} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.vehicle_id}
          renderItem={({ item }) => {
            const isSelected = selectedVehicleId === item.vehicle_id;
            return (
              <TouchableOpacity
                style={[
                  styles.listItem, 
                  { 
                    backgroundColor: isSelected ? screenColors.primary + '20' : screenColors.card,
                    borderColor: isSelected ? screenColors.primary : 'transparent',
                    borderWidth: isSelected ? 1 : 0
                  }
                ]}
                onPress={() => {
                  setSelectedVehicleId(item.vehicle_id);
                  setShowVehicleModal(false);
                  setErrors(prev => ({ ...prev, vehicle: '' }));
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
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={20} color={screenColors.primary} />
                )}
              </TouchableOpacity>
            );
          }}
          style={styles.modalList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="car-outline" size={48} color={screenColors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: screenColors.textSecondary }]}>
                No vehicles available
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: screenColors.textSecondary }]}>
                Contact admin to add vehicles
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
          <Text style={[styles.modalTitle, { color: screenColors.text }]}>Payment Method</Text>
          <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
            <Ionicons name="close" size={24} color={screenColors.text} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={paymentMethods}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = paymentMethod === item.id;
            return (
              <TouchableOpacity
                style={[
                  styles.listItem, 
                  { 
                    backgroundColor: isSelected ? screenColors.primary + '20' : screenColors.card,
                    borderColor: isSelected ? screenColors.primary : 'transparent',
                    borderWidth: isSelected ? 1 : 0
                  }
                ]}
                onPress={() => {
                  setPaymentMethod(item.id);
                  setShowPaymentModal(false);
                }}
              >
                <View style={styles.vehicleItemIcon}>
                  <Ionicons name={item.icon as any} size={20} color={screenColors.primary} />
                </View>
                <View style={styles.listItemContent}>
                  <Text style={[styles.listItemText, { color: screenColors.text }]}>{item.name}</Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={20} color={screenColors.primary} />
                )}
              </TouchableOpacity>
            );
          }}
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
          <Text style={[styles.loadingText, { color: screenColors.textSecondary }]}>Loading...</Text>
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
        <Text style={[styles.headerTitle, { color: screenColors.text }]}>Add Expense</Text>
        <TouchableOpacity onPress={handleSave} disabled={isCreating} style={styles.saveButton}>
          {isCreating ? (
            <ActivityIndicator size="small" color={screenColors.primary} />
          ) : (
            <Text style={[styles.saveButtonText, { color: screenColors.primary }]}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Amount & Description */}
        <View style={[styles.section, { backgroundColor: screenColors.card }]}>
          <Text style={[styles.sectionTitle, { color: screenColors.text }]}>💰 Expense Details</Text>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: screenColors.textSecondary }]}>Amount (€) *</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: screenColors.background,
                  borderColor: errors.amount ? screenColors.danger : screenColors.border,
                  color: screenColors.text,
                  opacity: isFuelCategory ? 0.6 : 1
                }
              ]}
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
                if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
              }}
              placeholder="0.00"
              placeholderTextColor={screenColors.textSecondary}
              keyboardType="decimal-pad"
              editable={!isFuelCategory} // Auto-calculated for fuel
            />
            {isFuelCategory && (
              <Text style={[styles.helperText, { color: screenColors.textSecondary }]}>
                ⚡ Auto-calculated from fuel quantity
              </Text>
            )}
            {errors.amount && (
              <Text style={[styles.errorText, { color: screenColors.danger }]}>{errors.amount}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: screenColors.textSecondary }]}>Description *</Text>
            <TextInput
              style={[
                styles.textArea,
                { 
                  backgroundColor: screenColors.background,
                  borderColor: errors.description ? screenColors.danger : screenColors.border,
                  color: screenColors.text
                }
              ]}
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
              }}
              placeholder="Enter expense description..."
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
          <Text style={[styles.sectionTitle, { color: screenColors.text }]}>📁 Category & Type</Text>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: screenColors.textSecondary }]}>Category *</Text>
            <TouchableOpacity
              style={[
                styles.pickerButton,
                { 
                  backgroundColor: screenColors.background,
                  borderColor: errors.category ? screenColors.danger : screenColors.border
                }
              ]}
              onPress={() => setShowCategoryModal(true)}
            >
              <View style={styles.pickerContent}>
                {selectedCategory && (
                  <View style={styles.categoryIcon}>
                    {isFuelCategory ? (
                      <MaterialCommunityIcons name="gas-station" size={20} color={screenColors.primary} />
                    ) : (
                      <Ionicons name="receipt-outline" size={20} color={screenColors.primary} />
                    )}
                  </View>
                )}
                <Text style={[
                  styles.pickerButtonText, 
                  { color: selectedCategory ? screenColors.text : screenColors.textSecondary }
                ]}>
                  {selectedCategory?.name || 'Select Category'}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
            </TouchableOpacity>
            {errors.category && (
              <Text style={[styles.errorText, { color: screenColors.danger }]}>{errors.category}</Text>
            )}
            {isFuelCategory && (
              <Text style={[styles.infoText, { color: screenColors.primary }]}>
                ⛽ Fuel category selected - additional fields required
              </Text>
            )}
          </View>
        </View>

        {/* Fuel-specific fields */}
        {isFuelCategory && (
          <View style={[styles.section, { backgroundColor: screenColors.card }]}>
            <View style={styles.fuelHeader}>
              <MaterialCommunityIcons name="gas-station" size={20} color={screenColors.primary} />
              <Text style={[styles.sectionTitle, { color: screenColors.text, marginLeft: 8 }]}>
                ⛽ Fuel Details
              </Text>
            </View>
            
            <View style={styles.fuelRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.label, { color: screenColors.textSecondary }]}>Liters *</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: screenColors.background,
                      borderColor: errors.fuelLiters ? screenColors.danger : screenColors.border,
                      color: screenColors.text
                    }
                  ]}
                  value={fuelLiters}
                  onChangeText={(text) => {
                    setFuelLiters(text);
                    if (errors.fuelLiters) setErrors(prev => ({ ...prev, fuelLiters: '' }));
                  }}
                  placeholder="0.0"
                  placeholderTextColor={screenColors.textSecondary}
                  keyboardType="decimal-pad"
                />
                {errors.fuelLiters && (
                  <Text style={[styles.errorText, { color: screenColors.danger }]}>{errors.fuelLiters}</Text>
                )}
                {/* Tank capacity warning */}
                {fuelLiters && selectedVehicle && (
                  (() => {
                    const liters = parseFloat(fuelLiters);
                    const tankCapacity = selectedVehicle.fuel_tank_capacity || 50;
                    if (liters > tankCapacity) {
                      return (
                        <Text style={[styles.warningText, { color: '#FF9500' }]}>
                          ⚠️ Exceeds tank capacity ({tankCapacity}L) by {(liters - tankCapacity).toFixed(1)}L
                        </Text>
                      );
                    } else if (liters > 0) {
                      return (
                        <Text style={[styles.infoText, { color: screenColors.textSecondary }]}>
                          🛢️ Tank capacity: {tankCapacity}L
                        </Text>
                      );
                    }
                    return null;
                  })()
                )}
              </View>
              
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.label, { color: screenColors.textSecondary }]}>Price/Liter *</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: screenColors.background,
                      borderColor: errors.fuelPricePerLiter ? screenColors.danger : screenColors.border,
                      color: screenColors.text
                    }
                  ]}
                  value={fuelPricePerLiter}
                  onChangeText={(text) => {
                    setFuelPricePerLiter(text);
                    if (errors.fuelPricePerLiter) setErrors(prev => ({ ...prev, fuelPricePerLiter: '' }));
                  }}
                  placeholder="0.00"
                  placeholderTextColor={screenColors.textSecondary}
                  keyboardType="decimal-pad"
                />
                {errors.fuelPricePerLiter && (
                  <Text style={[styles.errorText, { color: screenColors.danger }]}>{errors.fuelPricePerLiter}</Text>
                )}
              </View>
            </View>
            
            {fuelLiters && fuelPricePerLiter && (
              <View style={[styles.calculationPreview, { backgroundColor: screenColors.background, borderColor: screenColors.border }]}>
                <Text style={[styles.calculationText, { color: screenColors.textSecondary }]}>
                  💡 {fuelLiters}L × €{fuelPricePerLiter} = €{amount}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Vehicle & Additional */}
        <View style={[styles.section, { backgroundColor: screenColors.card }]}>
          <Text style={[styles.sectionTitle, { color: screenColors.text }]}>
            🚗 Vehicle & Payment
          </Text>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: screenColors.textSecondary }]}>
              Vehicle {isFuelCategory && '*'}
            </Text>
            <TouchableOpacity
              style={[
                styles.pickerButton, 
                { 
                  backgroundColor: screenColors.background, 
                  borderColor: errors.vehicle ? screenColors.danger : screenColors.border 
                }
              ]}
              onPress={() => setShowVehicleModal(true)}
            >
              <View style={styles.pickerContent}>
                {selectedVehicle && (
                  <View style={styles.categoryIcon}>
                    <Ionicons name="car-outline" size={20} color={screenColors.primary} />
                  </View>
                )}
                <Text style={[
                  styles.pickerButtonText, 
                  { color: selectedVehicle ? screenColors.text : screenColors.textSecondary }
                ]}>
                  {selectedVehicle 
                    ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.license_plate})`
                    : isFuelCategory ? 'Select Vehicle' : 'Select Vehicle (Optional)'
                  }
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
            </TouchableOpacity>
            {errors.vehicle && (
              <Text style={[styles.errorText, { color: screenColors.danger }]}>{errors.vehicle}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: screenColors.textSecondary }]}>Payment Method</Text>
            <TouchableOpacity
              style={[styles.pickerButton, { backgroundColor: screenColors.background, borderColor: screenColors.border }]}
              onPress={() => setShowPaymentModal(true)}
            >
              <View style={styles.pickerContent}>
                <View style={styles.categoryIcon}>
                  <Ionicons 
                    name={paymentMethods.find(m => m.id === paymentMethod)?.icon as any || 'cash-outline'} 
                    size={20} 
                    color={screenColors.primary} 
                  />
                </View>
                <Text style={[styles.pickerButtonText, { color: screenColors.text }]}>
                  {paymentMethods.find(m => m.id === paymentMethod)?.name || 'Cash'}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: screenColors.textSecondary }]}>Date</Text>
            <TouchableOpacity
              style={[styles.pickerButton, { backgroundColor: screenColors.background, borderColor: screenColors.border }]}
              onPress={() => setShowDatePicker(true)}
            >
              <View style={styles.pickerContent}>
                <View style={styles.categoryIcon}>
                  <Ionicons name="calendar-outline" size={20} color={screenColors.primary} />
                </View>
                <Text style={[styles.pickerButtonText, { color: screenColors.text }]}>
                  {expenseDate.toLocaleDateString()}
                </Text>
              </View>
              <Ionicons name="calendar-outline" size={20} color={screenColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchContent}>
              <Text style={[styles.label, { color: screenColors.text }]}>Reimbursable</Text>
              <Text style={[styles.switchDescription, { color: screenColors.textSecondary }]}>
                Can be reimbursed by company
              </Text>
            </View>
            <Switch
              value={isReimbursable}
              onValueChange={setIsReimbursable}
              trackColor={{ false: screenColors.border, true: screenColors.primary + '40' }}
              thumbColor={isReimbursable ? screenColors.primary : screenColors.textSecondary}
            />
          </View>
        </View>

        {/* Receipt */}
        <View style={[styles.section, { backgroundColor: screenColors.card }]}>
          <Text style={[styles.sectionTitle, { color: screenColors.text }]}>📄 Receipt</Text>
          
          <TouchableOpacity
            style={[
              styles.receiptButton, 
              { 
                backgroundColor: receiptImage ? screenColors.primary + '20' : screenColors.background, 
                borderColor: receiptImage ? screenColors.primary : screenColors.border,
                borderStyle: receiptImage ? 'solid' : 'dashed'
              }
            ]}
            onPress={pickImage}
            disabled={isCreating || isUploadingReceipt}
          >
            {isUploadingReceipt ? (
              <ActivityIndicator size="small" color={screenColors.primary} />
            ) : (
              <Ionicons 
                name={receiptImage ? 'checkmark-circle' : 'camera-outline'} 
                size={24} 
                color={receiptImage ? screenColors.primary : screenColors.textSecondary} 
              />
            )}
            <Text style={[
              styles.receiptButtonText, 
              { color: receiptImage ? screenColors.primary : screenColors.text }
            ]}>
              {isUploadingReceipt 
                ? '📤 Uploading...' 
                : receiptImage 
                  ? '✅ Receipt Added' 
                  : '📷 Add Receipt Photo'
              }
            </Text>
          </TouchableOpacity>
          
          {receiptImage && !isUploadingReceipt && (
            <TouchableOpacity
              style={styles.removeReceiptButton}
              onPress={() => setReceiptImage(null)}
            >
              <Ionicons name="trash-outline" size={16} color={screenColors.danger} />
              <Text style={[styles.removeReceiptText, { color: screenColors.danger }]}>
                Remove Receipt
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={expenseDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setExpenseDate(selectedDate);
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
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
    justifyContent: 'space-between',
    marginTop: 8,
  },
  switchContent: {
    flex: 1,
  },
  switchDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  receiptButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  warningText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
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
  categoryItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
  fuelCategoryNote: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  removeReceiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    padding: 8,
  },
  removeReceiptText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
}); 