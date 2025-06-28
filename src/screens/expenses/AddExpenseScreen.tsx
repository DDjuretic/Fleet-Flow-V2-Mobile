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
  Alert,
  Image,
  ActivityIndicator,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';

// Import Supabase client and Auth hook
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// Import RTK Query hooks
import { useGetExpenseCategoriesQuery, useCreateExpenseMutation } from '../../store/api/supabaseApi';

// Toast utils
import { showSuccessToast, showErrorToast, showWarningToast } from '../../utils/toastUtils';

// const screenColors = {
//   background: Colors.DARK.background,
//   text: Colors.DARK.text,
//   textSecondary: Colors.DARK.textSecondary,
//   primary: Colors.DARK.primary,
//   card: Colors.DARK.card,
//   border: Colors.DARK.border,
//   danger: Colors.DANGER,
//   placeholder: Colors.DARK.textSecondary,
// };

export default function AddExpenseScreen({ navigation }: any) {
  const { user } = useAuth(); // Get user from AuthContext
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  
  // RTK Query hooks
  const { data: expenseCategories, isLoading: isLoadingCategories } = useGetExpenseCategoriesQuery();
  const [createExpense] = useCreateExpenseMutation();

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
    black: Colors.BLACK,
    lightGray: Colors.LIGHT_GRAY,
    gray: Colors.GRAY,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    disabled: Colors.DARK.textSecondary, // Using textSecondary as disabled color
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
    black: Colors.BLACK,
    lightGray: Colors.LIGHT_GRAY,
    gray: Colors.GRAY,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    disabled: Colors.LIGHT.textSecondary, // Using textSecondary as disabled color
  };

  const [amount, setAmount] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [receiptImage, setReceiptImage] = useState<string | null>(null); // URI of the selected image
  const [vehicle, setVehicle] = useState(''); // Optional: link to vehicle
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false); // Added for loading state
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Stilovi sada zavise od screenColors, pa ih definišemo unutar komponente ili kao funkciju
  const styles = getStyles(screenColors);

  const selectCategory = () => {
    if (isLoading || isLoadingCategories) return;
    
    if (!expenseCategories || expenseCategories.length === 0) {
      showWarningToast(t('no_expense_categories_available', 'No expense categories available.'));
      return;
    }

    setShowCategoryModal(true);
  };

  const pickImage = async () => {
    if (isLoading) return; // Prevent action while loading
    
    // Request permission
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
  
  const selectVehicleForExpense = () => {
    if (isLoading) return; // Prevent action while loading
    showWarningToast(t('vehicle_selection_to_be_implemented', 'Vehicle selection for expense to be implemented (optional).'));
    // No error state for optional field
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!amount.trim()) {
      newErrors.amount = t('amount_required', 'Amount is required.');
      isValid = false;
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = t('enter_valid_amount', 'Please enter a valid amount greater than 0.');
      isValid = false;
    }

    if (!selectedCategoryId) {
      newErrors.category = t('please_select_category', 'Please select a category.');
      isValid = false;
    }

    const today = new Date();
    if (expenseDate > today) {
      newErrors.expenseDate = t('expense_date_not_future', 'Expense date cannot be in the future.');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveExpense = async () => {
    if (!validateForm()) {
      const errorMessages = Object.values(errors).filter(msg => msg).join('\n');
      showErrorToast('common.error', 'please_correct_form_errors');
      return;
    }

    if (!user) {
      showErrorToast(t('user_not_authenticated', 'User not authenticated. Please log in again.'));
      return;
    }

    setIsLoading(true);

    const expenseData = {
      user_id: user.id,
      amount: parseFloat(amount),
      currency: 'EUR', // Default currency, can be made configurable later
      expense_date: expenseDate.toISOString().split('T')[0], // Format as YYYY-MM-DD for DATE type
      description: description.trim() || null,
      expense_category_id: selectedCategoryId!,
      vehicle_id: null, // Optional: can be added later
      payment_method: null, // Optional: can be added later
      fuel_liters: null, // Optional: for fuel expenses
      fuel_price_per_liter: null, // Optional: for fuel expenses
      is_reimbursable: true, // Default value
    };

    try {
      await createExpense(expenseData).unwrap();
      showSuccessToast(t('expense_recorded_successfully', 'New expense has been successfully recorded.'));
        // TODO: Implement receipt upload if receiptImage is present
        // This would involve uploading to Supabase Storage and then inserting into 'expense_receipts' table
        navigation.goBack();
    } catch (error: any) {
      console.error('Error saving expense:', error);
      showErrorToast('common.error', 'failed_create_expense');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: screenColors.background }]}>
      <StatusBar 
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={screenColors.background} 
      />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={screenColors.primary} />
          <Text style={[styles.loadingText, { color: screenColors.text }]}>{t('saving_expense', 'Saving Expense...')}</Text>
        </View>
      )}
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled" // Da bi se tastatura sklonila na dodir van inputa
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => !isLoading && navigation.goBack()} style={styles.backButton} disabled={isLoading}>
            <Ionicons name="arrow-back-outline" size={28} color={screenColors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: screenColors.text }]}>{t('add_new_expense', 'Add New Expense')}</Text>
          <View style={styles.placeholderButton} />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: screenColors.textSecondary }]}>{t('amount', 'Amount')}</Text>
          <TextInput
            style={[
              styles.input, 
              { backgroundColor: screenColors.card, color: screenColors.text, borderColor: errors.amount ? screenColors.danger : screenColors.border }
            ]}
            value={amount}
            onChangeText={(text) => {
              setAmount(text);
              if(errors.amount) setErrors(prev => ({...prev, amount: ''}));
            }}
            placeholder={t('expense_amount_placeholder', 'e.g., 50.00')}
            placeholderTextColor={screenColors.placeholder}
            keyboardType="numeric"
            editable={!isLoading} // Onemogući input dok se učitava
          />
          {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
        </View>

        <TouchableOpacity 
          style={styles.formGroup} 
          onPress={() => {
            selectCategory();
            if(errors.category) setErrors(prev => ({...prev, category: ''}));
          }}
          disabled={isLoading} // Onemogući dok se učitava
        >
          <Text style={[styles.label, { color: screenColors.textSecondary }]}>{t('category', 'Category')}</Text>
          <View style={[
            styles.pickerButton, 
            { backgroundColor: screenColors.card, borderColor: errors.category ? screenColors.danger : screenColors.border }
          ]}>
            <Text style={[styles.pickerButtonText, { color: selectedCategoryId ? screenColors.text : screenColors.placeholder }]}>
              {selectedCategoryId ? expenseCategories?.find(cat => cat.expense_category_id === selectedCategoryId)?.name : t('select_category_placeholder', 'Select Category (e.g., Fuel, Tolls)')}
            </Text>
            <Ionicons name="chevron-down-outline" size={20} color={screenColors.textSecondary} />
          </View>
        </TouchableOpacity>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: screenColors.textSecondary }]}>{t('date_of_expense', 'Date of Expense')}</Text>
          {/* Replace with actual DateTimePicker component */}
          <TouchableOpacity 
            style={[
              styles.pickerButton, 
              { backgroundColor: screenColors.card, borderColor: errors.expenseDate ? screenColors.danger : screenColors.border }
            ]}
                            onPress={() => { // Add temporary toast and error clearing
              if (isLoading) return;
              showWarningToast(t('date_picker_to_be_implemented', 'Date picker UI to be implemented.'));
              if(errors.expenseDate) setErrors(prev => ({...prev, expenseDate: ''}));
            }}
            disabled={isLoading} // Onemogući dok se učitava
          >
             <Text style={[styles.pickerButtonText, { color: screenColors.text }]}>{expenseDate.toLocaleDateString()}</Text>
             <Ionicons name="calendar-outline" size={20} color={screenColors.textSecondary} />
          </TouchableOpacity>
          {errors.expenseDate && <Text style={styles.errorText}>{errors.expenseDate}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: screenColors.textSecondary }]}>{t('description_optional', 'Description (Optional)')}</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: screenColors.card, color: screenColors.text, borderColor: screenColors.border }]}
            value={description}
            onChangeText={setDescription}
            placeholder={t('description_placeholder', 'e.g., Fuel for trip to City X, Parking at airport')}
            placeholderTextColor={screenColors.placeholder}
            multiline
            numberOfLines={3}
            editable={!isLoading} // Onemogući input dok se učitava
          />
        </View>
        
        {/* Optional: Link to Vehicle */}
        <TouchableOpacity style={styles.formGroup} onPress={selectVehicleForExpense} disabled={isLoading}>
          <Text style={[styles.label, { color: screenColors.textSecondary }]}>{t('vehicle_optional', 'Vehicle (Optional)')}</Text>
          <View style={[styles.pickerButton, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
            <Text style={[styles.pickerButtonText, { color: vehicle ? screenColors.text : screenColors.placeholder }]}>
              {vehicle || t('select_vehicle', 'Select Vehicle')}
            </Text>
            <Ionicons name="chevron-down-outline" size={20} color={screenColors.textSecondary} />
          </View>
        </TouchableOpacity>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: screenColors.textSecondary }]}>{t('receipt_optional', 'Receipt (Optional)')}</Text>
          <TouchableOpacity 
            style={[styles.imagePickerButton, { backgroundColor: screenColors.card, borderColor: screenColors.border }]} 
            onPress={pickImage}
            disabled={isLoading} // Onemogući dok se učitava
          >
            <Ionicons name="camera-outline" size={24} color={screenColors.textSecondary} style={{marginRight: 10}} />
            <Text style={[styles.pickerButtonText, { color: screenColors.textSecondary }]}>{t('upload_receipt_image', 'Upload Receipt Image')}</Text>
          </TouchableOpacity>
          {receiptImage && (
            <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: receiptImage }} style={styles.receiptImagePreview} />
                <TouchableOpacity 
                  onPress={() => !isLoading && setReceiptImage(null)} 
                  style={styles.removeImageButton}
                  disabled={isLoading} // Onemogući dok se učitava
                >
                    <Ionicons name="close-circle" size={24} color={screenColors.danger} />
                </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: isLoading ? screenColors.disabled : screenColors.primary }]} 
          onPress={handleSaveExpense}
          disabled={isLoading} // Onemogući dugme dok se učitava
        >
          <Text style={[styles.saveButtonText, {color: screenColors.white}]}>{t('save_expense', 'Save Expense')}</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCategoryModal(false)}
      >
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
                style={[styles.modalListItem, { backgroundColor: screenColors.card }]}
                onPress={() => {
                  setSelectedCategoryId(item.expense_category_id);
                  setErrors(prev => ({...prev, category: ''}));
                  setShowCategoryModal(false);
                }}
              >
                <View style={styles.modalListItemContent}>
                  <Text style={[styles.modalListItemText, { color: screenColors.text }]}>{item.name}</Text>
                  {item.description && (
                    <Text style={[styles.modalListItemSubtext, { color: screenColors.textSecondary }]}>{item.description}</Text>
                  )}
                </View>
                {selectedCategoryId === item.expense_category_id && (
                  <Ionicons name="checkmark-circle" size={20} color={screenColors.primary} />
                )}
              </TouchableOpacity>
            )}
            style={styles.modalList}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// StyleSheet.create se sada poziva kroz funkciju koja prima dinamičke boje
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
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: screenColors.border, // Sada ima pristup screenColors
  },
  backButton: {
    padding: 5,
  },
  placeholderButton: {
    width: 38,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formGroup: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
  },
  imagePickerButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  imagePreviewContainer: {
    marginTop: 15,
    alignItems: 'center',
    position: 'relative',
  },
  receiptImagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: screenColors.background, // So icon is not on the image itself
    borderRadius: 15,
    padding: 2,
  },
  saveButton: {
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: screenColors.danger, // Sada ima pristup screenColors
    fontSize: 12,
    marginTop: 5,
  },
  loadingOverlay: { // Stil za loading overlay
    ...StyleSheet.absoluteFillObject, // Prekriva ceo ekran
    backgroundColor: 'rgba(0,0,0,0.5)', // Polu-providna pozadina
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Da bude iznad svega ostalog
  },
  loadingText: { // Stil za tekst ispod ActivityIndicator-a
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    // Boja teksta će biti dinamički postavljena
  },
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalList: {
    flex: 1,
  },
  modalListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  modalListItemContent: {
    flex: 1,
  },
  modalListItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalListItemSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
}); 