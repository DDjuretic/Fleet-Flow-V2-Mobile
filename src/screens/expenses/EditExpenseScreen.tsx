import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,

  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  Switch,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { uploadReceiptToSupabase, deleteReceiptFromSupabase } from '../../utils/imageUtils';
import { fixUrlForDisplay } from '../../utils/urlFixer';
import { 
  useGetExpenseCategoriesQuery, 
  useUpdateExpenseMutation, 
  useGetExpenseReceiptsQuery,
  useGetVehiclesQuery,
  useGetExpensesQuery,
  useCreateExpenseReceiptMutation,
  useDeleteExpenseReceiptMutation
} from '../../store/api/supabaseApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { showSuccessToast, showErrorToast, showWarningToast } from '../../utils/toastUtils';
import { uploadReceiptImage, createExpenseReceiptRecord } from '../../utils/imageUploadUtils';
import { useAuth } from '../../contexts/AuthContext';

// Navigation
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';

type EditExpenseScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditExpense'>;
type EditExpenseScreenRouteProp = { key: string; name: 'EditExpense'; params: { expenseId: string } };

interface ExpenseFormData {
  description: string;
  amount: string;
  currency: string;
  selectedCategoryId: string;
  selectedVehicleId: string;
  expenseDate: string;
  paymentMethod: string;
  fuelLiters: string;
  fuelPricePerLiter: string;
  isReimbursable: boolean;
  receiptImage: string | null;
}

export default function EditExpenseScreen() {
  // TypeScript refresh - all hooks should be available now
  const { t } = useTranslation();
  const navigation = useNavigation<EditExpenseScreenNavigationProp>();
  const route = useRoute<EditExpenseScreenRouteProp>();
  const { expenseId } = route.params;
  
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  
  // RTK Query hooks
  const { data: expenses = [], isLoading: isLoadingExpense } = useGetExpensesQuery();
  const { data: categories = [], isLoading: isLoadingCategories } = useGetExpenseCategoriesQuery();
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useGetVehiclesQuery();
  const { data: expenseReceipts = [] } = useGetExpenseReceiptsQuery(expenseId || '', { skip: !expenseId });
  const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();
  const [createExpenseReceipt] = useCreateExpenseReceiptMutation();
  const [deleteExpenseReceipt] = useDeleteExpenseReceiptMutation();

  // Find the specific expense
  const expense = expenses.find(e => e.expense_id === expenseId);

  // Form state
  const [formData, setFormData] = useState<ExpenseFormData>({
    description: '',
    amount: '',
    currency: 'EUR',
    selectedCategoryId: '',
    selectedVehicleId: '',
    expenseDate: '',
    paymentMethod: 'cash',
    fuelLiters: '',
    fuelPricePerLiter: '',
    isReimbursable: true,
    receiptImage: null,
  });

  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);

  // Get selected category and vehicle
  const selectedCategory = categories.find(cat => cat.expense_category_id === formData.selectedCategoryId);
  const selectedVehicle = vehicles.find(veh => veh.vehicle_id === formData.selectedVehicleId);
  const isFuelCategory = selectedCategory?.name?.toLowerCase().includes('fuel') || 
                        selectedCategory?.name?.toLowerCase().includes('gorivo') ||
                        selectedCategory?.name?.toLowerCase().includes('benzin') ||
                        selectedCategory?.name?.toLowerCase().includes('dizel');

  // Memoize the first receipt URL to prevent re-renders
  const firstReceiptUrl = useMemo(() => {
    console.log('🔍 Expense receipts loaded:', expenseReceipts);
    const url = expenseReceipts.length > 0 ? expenseReceipts[0].file_url : null;
    
    // Fix URL for Android emulator using utility function
    const fixedUrl = fixUrlForDisplay(url);
    if (fixedUrl !== url) {
      console.log('🔧 Fixed URL for Android emulator:', fixedUrl);
    }
    
    return fixedUrl;
  }, [expenseReceipts]);

  // Load expense data when component mounts
  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description || '',
        amount: expense.amount?.toString() || '',
        currency: expense.currency || 'EUR',
        selectedCategoryId: expense.expense_category_id || '',
        selectedVehicleId: expense.vehicle_id || '',
        expenseDate: expense.expense_date || '',
        paymentMethod: expense.payment_method || 'cash',
        fuelLiters: expense.fuel_liters?.toString() || '',
        fuelPricePerLiter: expense.fuel_price_per_liter?.toString() || '',
        isReimbursable: expense.is_reimbursable ?? true,
        receiptImage: firstReceiptUrl,
      });
    }
  }, [expense, firstReceiptUrl]);

  // Auto-calculate amount when fuel data changes
  useEffect(() => {
    if (isFuelCategory && formData.fuelLiters && formData.fuelPricePerLiter) {
      const liters = parseFloat(formData.fuelLiters);
      const pricePerLiter = parseFloat(formData.fuelPricePerLiter);
      if (!isNaN(liters) && !isNaN(pricePerLiter)) {
        const calculatedAmount = (liters * pricePerLiter).toFixed(2);
        setFormData(prev => ({ ...prev, amount: calculatedAmount }));
      }
    }
  }, [formData.fuelLiters, formData.fuelPricePerLiter, isFuelCategory]);

  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    primary: Colors.DARK.primary,
    secondary: Colors.DARK.secondary,
    card: Colors.DARK.card,
    border: Colors.DARK.border,
    white: Colors.WHITE,
    inputBackground: Colors.DARK.card,
    placeholder: Colors.DARK.textSecondary,
    danger: Colors.DARK.danger || '#FF6B6B',
  } : {
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    primary: Colors.LIGHT.primary,
    secondary: Colors.LIGHT.secondary,
    card: Colors.LIGHT.card,
    border: Colors.LIGHT.border,
    white: Colors.WHITE,
    inputBackground: Colors.WHITE,
    placeholder: Colors.LIGHT.textSecondary,
    danger: Colors.LIGHT.danger || '#FF6B6B',
  };

  const styles = getStyles(screenColors);

  // Early return for loading state
  if (isLoadingExpense || isLoadingCategories || isLoadingVehicles || !expense) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={screenColors.primary} />
          <Text style={[styles.loadingText, { color: screenColors.text }]}>
            {t('loading', 'Loading...')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const paymentMethods = [
    { id: 'cash', name: t('cash', 'Cash') },
    { id: 'card', name: t('card', 'Card') },
    { id: 'bank_transfer', name: t('bank_transfer', 'Bank Transfer') },
    { id: 'company_card', name: t('company_card', 'Company Card') },
  ];

  const handleInputChange = (field: keyof ExpenseFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
      handleInputChange('receiptImage', result.assets[0].uri);
    }
  };

  const handleUpdateExpense = async () => {
    if (!formData.description.trim() || !formData.amount.trim() || !formData.selectedCategoryId) {
      showErrorToast('error', 'please_fill_required_fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      showErrorToast('error', 'enter_valid_amount');
      return;
    }

    if (isFuelCategory) {
      if (!formData.fuelLiters || parseFloat(formData.fuelLiters) <= 0) {
        showErrorToast('error', 'fuel_liters_required');
        return;
      }
      if (!formData.fuelPricePerLiter || parseFloat(formData.fuelPricePerLiter) <= 0) {
        showErrorToast('error', 'fuel_price_required');
        return;
      }
    }

    try {
      await updateExpense({
        expenseId: expenseId,
        updates: {
          description: formData.description.trim(),
          amount: amount,
          currency: formData.currency,
          expense_category_id: formData.selectedCategoryId,
          vehicle_id: formData.selectedVehicleId || null,
          expense_date: formData.expenseDate || new Date().toISOString(),
          payment_method: formData.paymentMethod,
          fuel_liters: isFuelCategory && formData.fuelLiters ? parseFloat(formData.fuelLiters) : null,
          fuel_price_per_liter: isFuelCategory && formData.fuelPricePerLiter ? parseFloat(formData.fuelPricePerLiter) : null,
          is_reimbursable: formData.isReimbursable,
        }
      }).unwrap();

      if (formData.receiptImage && formData.receiptImage.startsWith('file://')) {
        try {
          const oldReceipt = expenseReceipts.length > 0 ? expenseReceipts[0] : null;
          if (oldReceipt) {
            const filePath = oldReceipt.file_url.split('/expense-receipts/')[1];
            await deleteReceiptFromSupabase(filePath);
            await deleteExpenseReceipt(oldReceipt.receipt_id).unwrap();
          }
          
          const uploadedUrl = await uploadReceiptToSupabase(formData.receiptImage, expenseId);
          if (uploadedUrl) {
            await createExpenseReceipt({ 
              expense_id: expenseId, 
              file_url: uploadedUrl 
            }).unwrap();
          }
        } catch (uploadError) {
          console.error('Receipt upload/delete failed:', uploadError);
          // Decide if you want to alert the user here, e.g. that the old receipt might not have been deleted.
        }
      }

      showSuccessToast('success', 'expense_updated_successfully');
      navigation.goBack();
    } catch (err) {
      console.error('Failed to update expense:', err);
      showErrorToast('error', 'failed_update_expense');
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="close" size={28} color={screenColors.text} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: screenColors.text }]}>{t('edit_expense', 'Edit Expense')}</Text>
      <TouchableOpacity onPress={handleUpdateExpense} style={styles.saveButton} disabled={isUpdating}>
        {isUpdating ? <ActivityIndicator color={screenColors.white} /> : <Text style={styles.saveButtonText}>{t('update_expense', 'Update Expense')}</Text>}
      </TouchableOpacity>
    </View>
  );

  const renderCategoryModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showCategoryModal}
      onRequestClose={() => setShowCategoryModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: screenColors.card }]}>
          <Text style={[styles.modalTitle, { color: screenColors.text }]}>Select Category</Text>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.expense_category_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  handleInputChange('selectedCategoryId', item.expense_category_id);
                  setShowCategoryModal(false);
                }}
              >
                <Text style={{ color: screenColors.text }}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowCategoryModal(false)}>
             <Text style={{color: screenColors.primary}}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderVehicleModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showVehicleModal}
      onRequestClose={() => setShowVehicleModal(false)}
    >
       <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: screenColors.card }]}>
          <Text style={[styles.modalTitle, { color: screenColors.text }]}>Select Vehicle</Text>
          <FlatList
            data={vehicles}
            keyExtractor={(item) => item.vehicle_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  handleInputChange('selectedVehicleId', item.vehicle_id);
                  setShowVehicleModal(false);
                }}
              >
                <Text style={{ color: screenColors.text }}>{`${item.make} ${item.model} (${item.license_plate})`}</Text>
              </TouchableOpacity>
            )}
          />
           <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowVehicleModal(false)}>
             <Text style={{color: screenColors.primary}}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderPaymentModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showPaymentModal}
      onRequestClose={() => setShowPaymentModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: screenColors.card }]}>
          <Text style={[styles.modalTitle, { color: screenColors.text }]}>Select Payment Method</Text>
          <FlatList
            data={paymentMethods}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  handleInputChange('paymentMethod', item.id);
                  setShowPaymentModal(false);
                }}
              >
                <Text style={{ color: screenColors.text }}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowPaymentModal(false)}>
             <Text style={{color: screenColors.primary}}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderForm = () => (
    <ScrollView style={styles.content}>
      <View style={[styles.section, { backgroundColor: screenColors.card }]}>
        <Text style={[styles.sectionTitle, { color: screenColors.text }]}>{t('expense_details', 'Expense Details')}</Text>
        
        <TextInput
          style={[styles.input, { backgroundColor: screenColors.inputBackground, color: screenColors.text, borderColor: screenColors.border }]}
          value={formData.description}
          onChangeText={(text) => handleInputChange('description', text)}
          placeholder={t('enter_description', 'Enter expense description')}
          placeholderTextColor={screenColors.placeholder}
        />

        <TextInput
          style={[styles.input, { backgroundColor: screenColors.inputBackground, color: screenColors.text, borderColor: screenColors.border }]}
          value={formData.amount}
          onChangeText={(text) => handleInputChange('amount', text)}
          placeholder="0.00"
          keyboardType="numeric"
          editable={!isFuelCategory}
        />
        {isFuelCategory && <Text style={styles.autoCalcText}>{t('auto_calculated_fuel', 'Auto-calculated from fuel quantity')}</Text>}
      </View>

      <View style={[styles.section, { backgroundColor: screenColors.card }]}>
        <Text style={[styles.sectionTitle, { color: screenColors.text }]}>{t('category_vehicle', 'Category & Vehicle')}</Text>

        <TouchableOpacity style={styles.selector} onPress={() => setShowCategoryModal(true)}>
          <Text style={{ color: screenColors.text }}>{selectedCategory?.name || t('select_category', 'Select Category')}</Text>
          <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.selector} onPress={() => setShowVehicleModal(true)}>
          <Text style={{ color: screenColors.text }}>{selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : t('select_vehicle', 'Select Vehicle (Optional)')}</Text>
          <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
        </TouchableOpacity>
      </View>

      {isFuelCategory && (
        <View style={[styles.section, { backgroundColor: screenColors.card }]}>
          <Text style={[styles.sectionTitle, { color: screenColors.text }]}>{t('fuel_details', 'Fuel Details')}</Text>
          <View style={styles.fuelRow}>
            <TextInput
              style={[styles.input, styles.fuelInput, { backgroundColor: screenColors.inputBackground, color: screenColors.text, borderColor: screenColors.border }]}
              value={formData.fuelLiters}
              onChangeText={(text) => handleInputChange('fuelLiters', text)}
              placeholder={t('fuel_liters', 'Liters')}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.fuelInput, { backgroundColor: screenColors.inputBackground, color: screenColors.text, borderColor: screenColors.border }]}
              value={formData.fuelPricePerLiter}
              onChangeText={(text) => handleInputChange('fuelPricePerLiter', text)}
              placeholder={t('price_per_liter', 'Price/L')}
              keyboardType="numeric"
            />
          </View>
        </View>
      )}

      <View style={[styles.section, { backgroundColor: screenColors.card }]}>
        <Text style={[styles.sectionTitle, { color: screenColors.text }]}>{t('payment_date', 'Payment & Date')}</Text>

        <TouchableOpacity style={styles.selector} onPress={() => setShowPaymentModal(true)}>
          <Text style={{ color: screenColors.text }}>{paymentMethods.find(p => p.id === formData.paymentMethod)?.name || t('select_payment_method', 'Select Payment Method')}</Text>
          <Ionicons name="chevron-down" size={20} color={screenColors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.selector} onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: screenColors.text }}>{formData.expenseDate ? new Date(formData.expenseDate).toLocaleDateString() : t('select_date', 'Select Date')}</Text>
          <Ionicons name="calendar-outline" size={20} color={screenColors.textSecondary} />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={formData.expenseDate ? new Date(formData.expenseDate) : new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                handleInputChange('expenseDate', selectedDate.toISOString());
              }
            }}
          />
        )}

        <View style={styles.switchContainer}>
          <Text style={{ color: screenColors.text }}>{t('reimbursable', 'Reimbursable')}</Text>
          <Switch
            value={formData.isReimbursable}
            onValueChange={(value) => handleInputChange('isReimbursable', value)}
            trackColor={{ false: "#767577", true: screenColors.primary }}
            thumbColor={formData.isReimbursable ? screenColors.white : "#f4f3f4"}
          />
        </View>
      </View>
      
      <View style={[styles.section, { backgroundColor: screenColors.card }]}>
        <Text style={[styles.sectionTitle, { color: screenColors.text }]}>{t('receipt', 'Receipt')}</Text>
        <TouchableOpacity style={styles.receiptButton} onPress={pickImage}>
          <Ionicons name="camera-outline" size={24} color={screenColors.primary} />
          <Text style={styles.receiptButtonText}>
            {formData.receiptImage ? t('receipt_added', 'Receipt Added') : t('add_receipt_photo', 'Add Receipt Photo')}
          </Text>
        </TouchableOpacity>

        {formData.receiptImage && (
          <TouchableOpacity onPress={() => setShowImagePreview(true)}>
            <Image 
              source={{ uri: formData.receiptImage }} 
              style={styles.receiptPreview} 
              resizeMode="cover"
              onError={(error) => {
                console.error('❌ Image load error:', error);
                console.error('❌ Failed to load image URL:', formData.receiptImage);
              }}
              onLoadStart={() => console.log('🔄 Starting to load image:', formData.receiptImage)}
              onLoad={() => console.log('✅ Image loaded successfully')}
            />

          </TouchableOpacity>
        )}


      </View>
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: screenColors.background }}>
        <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
        {renderHeader()}
        {renderForm()}
        
        {renderCategoryModal()}
        {renderVehicleModal()}
        {renderPaymentModal()}

        <Modal
          visible={showImagePreview}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowImagePreview(false)}
        >
          <View style={styles.imagePreviewContainer}>
            <TouchableOpacity 
              style={styles.imagePreviewCloseButton} 
              onPress={() => setShowImagePreview(false)}
            >
              <Ionicons name="close-circle" size={32} color={Colors.WHITE} />
            </TouchableOpacity>
            <Image 
              source={{ uri: formData.receiptImage || undefined }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (screenColors: any) => StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: screenColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  selector: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: screenColors.border,
  },
  autoCalcText: {
    fontSize: 12,
    color: screenColors.textSecondary,
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 12,
  },
  fuelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fuelInput: {
    flex: 1,
    marginRight: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  imagePicker: {
    height: 150,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: screenColors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: screenColors.inputBackground,
  },
  receiptImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: screenColors.border,
  },
  modalCloseButton: {
    marginTop: 16,
    padding: 16,
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: screenColors.inputBackground,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: screenColors.border,
    justifyContent: 'center',
    marginBottom: 15,
  },
  receiptButtonText: {
    color: screenColors.primary,
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  receiptPreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  imagePreviewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreviewCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
}); 