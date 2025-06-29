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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/Colors';
// Import date picker and a custom picker/modal for type/priority/vehicle

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';

// Supabase & Auth
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// Import RTK Query hooks
import { useGetReminderTypesQuery, useCreateReminderMutation, useGetVehiclesQuery } from '../../store/api/supabaseApi';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';

// const screenColors = {
//   background: Colors.DARK.background,
//   text: Colors.DARK.text,
//   textSecondary: Colors.DARK.textSecondary,
//   primary: Colors.DARK.primary,
//   card: Colors.DARK.card,
//   border: Colors.DARK.border,
//   placeholder: Colors.DARK.textSecondary,
//   danger: Colors.DARK.danger,
// };

export default function AddReminderScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  
  // RTK Query hooks
  const { data: reminderTypes, isLoading: isLoadingTypes } = useGetReminderTypesQuery();
  const [createReminder] = useCreateReminderMutation();
  const { data: vehicles, isLoading: isLoadingVehicles } = useGetVehiclesQuery();

  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    primary: Colors.DARK.primary,
    card: Colors.DARK.card,
    border: Colors.DARK.border,
    danger: Colors.DARK.danger, 
    placeholder: Colors.DARK.textSecondary,
    white: Colors.WHITE,
    black: Colors.BLACK,
    lightGray: Colors.LIGHT_GRAY,
    gray: Colors.GRAY,
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
    white: Colors.WHITE,
    black: Colors.BLACK,
    lightGray: Colors.LIGHT_GRAY,
    gray: Colors.GRAY,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    disabled: Colors.LIGHT.textSecondary,
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState(''); // 'low', 'medium', 'high'
  const [vehicle, setVehicle] = useState(''); // Optional: vehicle ID
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Recurring reminder states
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [recurrenceDayOfWeek, setRecurrenceDayOfWeek] = useState(1); // Monday = 1
  const [recurrenceDayOfMonth, setRecurrenceDayOfMonth] = useState(1);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | null>(null);
  const [hasEndDate, setHasEndDate] = useState(false);

  // Dropdown visibility states
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [showRecurrencePatternDropdown, setShowRecurrencePatternDropdown] = useState(false);
  const [showRecurrenceDayOfWeekDropdown, setShowRecurrenceDayOfWeekDropdown] = useState(false);

  const styles = getStyles(screenColors); // Definišemo stilove nakon screenColors

  const toggleTypeDropdown = () => {
    if (isLoading || isLoadingTypes) return;
    setShowTypeDropdown(!showTypeDropdown);
    setShowPriorityDropdown(false);
    setShowDateDropdown(false);
    setShowVehicleDropdown(false);
  };

  const togglePriorityDropdown = () => {
    if (isLoading) return;
    setShowPriorityDropdown(!showPriorityDropdown);
    setShowTypeDropdown(false);
    setShowDateDropdown(false);
    setShowVehicleDropdown(false);
  };

  const toggleDateDropdown = () => {
    if (isLoading) return;
    setShowDateDropdown(!showDateDropdown);
    setShowTypeDropdown(false);
    setShowPriorityDropdown(false);
    setShowVehicleDropdown(false);
  };

  const toggleVehicleDropdown = () => {
    if (isLoading) return;
    setShowVehicleDropdown(!showVehicleDropdown);
    setShowTypeDropdown(false);
    setShowPriorityDropdown(false);
    setShowDateDropdown(false);
  };

  const selectReminderType = (typeId: string) => {
    setSelectedTypeId(typeId);
    setShowTypeDropdown(false);
    setErrors(prev => ({...prev, type: ''}));
  };

  const selectPriorityLevel = (priorityValue: string) => {
    setPriority(priorityValue);
    setShowPriorityDropdown(false);
    setErrors(prev => ({...prev, priority: ''}));
  };

  const selectDate = (date: Date) => {
    setDueDate(date);
    setShowDateDropdown(false);
    setErrors(prev => ({...prev, dueDate: ''}));
  };

  const selectVehicle = (vehicleId: string) => {
    setVehicle(vehicleId);
    setShowVehicleDropdown(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = t('title_required', 'Title is required.');
      isValid = false;
    } else if (title.trim().length < 3) {
      newErrors.title = t('title_min_length', 'Title must be at least 3 characters long.');
      isValid = false;
    }

    if (!selectedTypeId) {
      newErrors.type = t('select_reminder_type_required', 'Please select a reminder type.');
      isValid = false;
    }

    if (!dueDate) {
        newErrors.dueDate = t('due_date_required', 'Due date is required.');
        isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveReminder = async () => {
    if (!validateForm()) {
      const errorMessages = Object.values(errors).filter(msg => msg).join(', ');
              showErrorToast('common.error', 'correct_form_errors');
      return;
    }

    if (!user) {
      showErrorToast(t('user_not_authenticated', 'User not authenticated. Please log in again.'));
      return;
    }

    setIsLoading(true);

    const reminderData = {
      user_id: user.user_id,
      title: title.trim(),
      description: description.trim() || null,
      due_date: dueDate.toISOString(),
      reminder_type_id: selectedTypeId,
      vehicle_id: vehicle || null,
      is_system_generated: false,
      
      // Recurring reminder data
      is_recurring: isRecurring,
      recurrence_pattern: isRecurring ? recurrencePattern : null,
      recurrence_interval: isRecurring ? recurrenceInterval : null,
      recurrence_day_of_week: isRecurring && recurrencePattern === 'weekly' ? recurrenceDayOfWeek : null,
      recurrence_day_of_month: isRecurring && recurrencePattern === 'monthly' ? recurrenceDayOfMonth : null,
      recurrence_end_date: isRecurring && hasEndDate && recurrenceEndDate ? recurrenceEndDate.toISOString() : null,
    };

    try {
      await createReminder(reminderData).unwrap();
      showSuccessToast(t('reminder_saved_success', 'New reminder has been successfully recorded.'));
      navigation.goBack();
    } catch (error: any) {
      console.error('Error saving reminder:', error);
      showErrorToast('common.error', 'failed_create_reminder');
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
          <Text style={[styles.loadingText, { color: screenColors.text }]}>{t('saving_reminder', 'Saving Reminder...')}</Text>
        </View>
      )}
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => !isLoading && navigation.goBack()} style={styles.backButton} disabled={isLoading}>
            <Ionicons name="arrow-back-outline" size={28} color={screenColors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: screenColors.text }]}>{t('add_new_reminder_title')}</Text>
          <View style={styles.placeholderButton} />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: screenColors.textSecondary }]}>{t('title', 'Title')}</Text>
          <TextInput
            style={[
              styles.input, 
              { backgroundColor: screenColors.card, color: screenColors.text, borderColor: errors.title ? screenColors.danger : screenColors.border }
            ]}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if(errors.title) setErrors(prev => ({...prev, title: ''}));
            }}
            placeholder={t('title_placeholder_text')}
            placeholderTextColor={screenColors.placeholder}
            editable={!isLoading}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        <TouchableOpacity style={styles.formGroup} onPress={toggleTypeDropdown} disabled={isLoading}>
          <Text style={[styles.label, { color: screenColors.textSecondary }]}>{t('type')}</Text>
          <View style={[
            styles.pickerButton, 
            { backgroundColor: screenColors.card, borderColor: errors.type ? screenColors.danger : screenColors.border }
          ]}>
            <Text style={[styles.pickerButtonText, { color: selectedTypeId ? screenColors.text : screenColors.placeholder }]}>
              {selectedTypeId ? reminderTypes?.find(rt => rt.reminder_type_id === selectedTypeId)?.name : t('select_type_placeholder_text')}
            </Text>
            <Ionicons name="chevron-down-outline" size={20} color={screenColors.textSecondary} />
          </View>
          {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
          
          {/* Type Dropdown */}
          {showTypeDropdown && (
            <View style={[styles.dropdown, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
              {reminderTypes?.map((type) => (
                <TouchableOpacity
                  key={type.reminder_type_id}
                  style={styles.dropdownItem}
                  onPress={() => selectReminderType(type.reminder_type_id)}
                >
                  <Text style={[styles.dropdownItemText, { color: screenColors.text }]}>{type.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: screenColors.textSecondary }]}>{t('due_date')}</Text>
          <TouchableOpacity style={[
            styles.pickerButton, 
            { backgroundColor: screenColors.card, borderColor: errors.dueDate ? screenColors.danger : screenColors.border }
          ]} onPress={toggleDateDropdown} disabled={isLoading}>
             <Text style={[styles.pickerButtonText, { color: screenColors.text }]}>{dueDate.toLocaleDateString()}</Text>
             <Ionicons name="calendar-outline" size={20} color={screenColors.textSecondary} />
          </TouchableOpacity>
          {errors.dueDate && <Text style={styles.errorText}>{errors.dueDate}</Text>}
          
          {/* Date Dropdown */}
          {showDateDropdown && (
            <View style={[styles.dropdown, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
              {(() => {
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                const nextWeek = new Date(today);
                nextWeek.setDate(today.getDate() + 7);
                const nextMonth = new Date(today);
                nextMonth.setMonth(today.getMonth() + 1);

                return [
                  { text: t('today', 'Today'), date: today },
                  { text: t('tomorrow', 'Tomorrow'), date: tomorrow },
                  { text: t('next_week', 'Next Week'), date: nextWeek },
                  { text: t('next_month', 'Next Month'), date: nextMonth }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.text}
                    style={styles.dropdownItem}
                    onPress={() => selectDate(option.date)}
                  >
                    <Text style={[styles.dropdownItemText, { color: screenColors.text }]}>
                      {option.text} ({option.date.toLocaleDateString()})
                    </Text>
                  </TouchableOpacity>
                ));
              })()}
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.formGroup} onPress={togglePriorityDropdown} disabled={isLoading}>
          <Text style={[styles.label, { color: screenColors.textSecondary }]}>{t('priority')}</Text>
          <View style={[
            styles.pickerButton, 
            { backgroundColor: screenColors.card, borderColor: screenColors.border }
          ]}>
            <Text style={[styles.pickerButtonText, { color: priority ? screenColors.text : screenColors.placeholder }]}>
              {priority ? t(`priority_${priority}`, priority.charAt(0).toUpperCase() + priority.slice(1)) : t('select_priority_placeholder_text')}
            </Text>
            <Ionicons name="chevron-down-outline" size={20} color={screenColors.textSecondary} />
          </View>
          
          {/* Priority Dropdown */}
          {showPriorityDropdown && (
            <View style={[styles.dropdown, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
              {[
                { text: t('priority_low', 'Low'), value: 'low' },
                { text: t('priority_medium', 'Medium'), value: 'medium' },
                { text: t('priority_high', 'High'), value: 'high' },
                { text: t('priority_critical', 'Critical'), value: 'critical' }
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.dropdownItem}
                  onPress={() => selectPriorityLevel(option.value)}
                >
                  <Text style={[styles.dropdownItemText, { color: screenColors.text }]}>{option.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </TouchableOpacity>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: screenColors.textSecondary }]}>{t('description_optional_label')}</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: screenColors.card, color: screenColors.text, borderColor: screenColors.border }]}
            value={description}
            onChangeText={setDescription}
            placeholder={t('description_placeholder_text')}
            placeholderTextColor={screenColors.placeholder}
            multiline
            numberOfLines={3}
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity style={styles.formGroup} onPress={toggleVehicleDropdown} disabled={isLoading}>
          <Text style={[styles.label, { color: screenColors.textSecondary }]}>{t('vehicle_optional_label')}</Text>
          <View style={[styles.pickerButton, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
            <Text style={[styles.pickerButtonText, { color: vehicle ? screenColors.text : screenColors.placeholder }]}>
              {vehicle ? vehicles?.find(v => v.vehicle_id === vehicle)?.make + ' ' + vehicles?.find(v => v.vehicle_id === vehicle)?.model : t('vehicle_placeholder_text')}
            </Text>
            <Ionicons name="chevron-down-outline" size={20} color={screenColors.textSecondary} />
          </View>
          
          {/* Vehicle Dropdown */}
          {showVehicleDropdown && (
            <View style={[styles.dropdown, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => selectVehicle('')}
              >
                <Text style={[styles.dropdownItemText, { color: screenColors.placeholder }]}>{t('no_vehicle', 'No Vehicle')}</Text>
              </TouchableOpacity>
              {vehicles?.map((vehicle) => (
                <TouchableOpacity
                  key={vehicle.vehicle_id}
                  style={styles.dropdownItem}
                  onPress={() => selectVehicle(vehicle.vehicle_id)}
                >
                  <Text style={[styles.dropdownItemText, { color: screenColors.text }]}>
                    {vehicle.make} {vehicle.model} ({vehicle.license_plate})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </TouchableOpacity>

        {/* Recurring Reminder Options */}
        <View style={styles.formGroup}>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity 
              style={[styles.checkbox, { borderColor: screenColors.border }]}
              onPress={() => setIsRecurring(!isRecurring)}
              disabled={isLoading}
            >
              {isRecurring && (
                <Ionicons name="checkmark" size={18} color={screenColors.primary} />
              )}
            </TouchableOpacity>
            <Text style={[styles.checkboxLabel, { color: screenColors.text }]}>
              {t('is_recurring')}
            </Text>
          </View>
        </View>

        {/* Recurring Options */}
        {isRecurring && (
          <>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.textSecondary }]}>{t('recurrence_pattern')}</Text>
              <TouchableOpacity 
                style={[styles.pickerButton, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}
                onPress={() => setShowRecurrencePatternDropdown(!showRecurrencePatternDropdown)}
                disabled={isLoading}
              >
                <Text style={[styles.pickerButtonText, { color: screenColors.text }]}>
                  {t(recurrencePattern)}
                </Text>
                <Ionicons name="chevron-down-outline" size={20} color={screenColors.textSecondary} />
              </TouchableOpacity>
              
              {showRecurrencePatternDropdown && (
                <View style={[styles.dropdown, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
                  {['daily', 'weekly', 'monthly', 'yearly'].map((pattern) => (
                    <TouchableOpacity
                      key={pattern}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setRecurrencePattern(pattern as any);
                        setShowRecurrencePatternDropdown(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, { color: screenColors.text }]}>
                        {t(pattern)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.textSecondary }]}>
                {t('every')} ({t(recurrencePattern === 'daily' ? 'days' : recurrencePattern === 'weekly' ? 'weeks' : recurrencePattern === 'monthly' ? 'months' : 'years')})
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: screenColors.card, color: screenColors.text, borderColor: screenColors.border }]}
                value={recurrenceInterval.toString()}
                onChangeText={(text) => setRecurrenceInterval(parseInt(text) || 1)}
                placeholder="1"
                placeholderTextColor={screenColors.placeholder}
                keyboardType="numeric"
                editable={!isLoading}
              />
            </View>

            {recurrencePattern === 'weekly' && (
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: screenColors.textSecondary }]}>{t('on_weekday')}</Text>
                <TouchableOpacity 
                  style={[styles.pickerButton, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}
                  onPress={() => setShowRecurrenceDayOfWeekDropdown(!showRecurrenceDayOfWeekDropdown)}
                  disabled={isLoading}
                >
                  <Text style={[styles.pickerButtonText, { color: screenColors.text }]}>
                    {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][recurrenceDayOfWeek] && t(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][recurrenceDayOfWeek])}
                  </Text>
                  <Ionicons name="chevron-down-outline" size={20} color={screenColors.textSecondary} />
                </TouchableOpacity>
                
                {showRecurrenceDayOfWeekDropdown && (
                  <View style={[styles.dropdown, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
                    {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day, index) => (
                      <TouchableOpacity
                        key={day}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setRecurrenceDayOfWeek(index);
                          setShowRecurrenceDayOfWeekDropdown(false);
                        }}
                      >
                        <Text style={[styles.dropdownItemText, { color: screenColors.text }]}>
                          {t(day)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            {recurrencePattern === 'monthly' && (
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: screenColors.textSecondary }]}>
                  {t('on_day')} {t('of_the_month')}
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: screenColors.card, color: screenColors.text, borderColor: screenColors.border }]}
                  value={recurrenceDayOfMonth.toString()}
                  onChangeText={(text) => setRecurrenceDayOfMonth(Math.min(31, Math.max(1, parseInt(text) || 1)))}
                  placeholder="1"
                  placeholderTextColor={screenColors.placeholder}
                  keyboardType="numeric"
                  editable={!isLoading}
                />
              </View>
            )}

            <View style={styles.formGroup}>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity 
                  style={[styles.checkbox, { borderColor: screenColors.border }]}
                  onPress={() => setHasEndDate(!hasEndDate)}
                  disabled={isLoading}
                >
                  {hasEndDate && (
                    <Ionicons name="checkmark" size={18} color={screenColors.primary} />
                  )}
                </TouchableOpacity>
                <Text style={[styles.checkboxLabel, { color: screenColors.text }]}>
                  {t('ends_on')}
                </Text>
              </View>
            </View>

            {hasEndDate && (
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: screenColors.textSecondary }]}>{t('recurrence_end_date')}</Text>
                <TouchableOpacity 
                  style={[styles.pickerButton, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}
                  onPress={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    setRecurrenceEndDate(recurrenceEndDate || tomorrow);
                  }}
                  disabled={isLoading}
                >
                  <Text style={[styles.pickerButtonText, { color: screenColors.text }]}>
                    {recurrenceEndDate ? recurrenceEndDate.toLocaleDateString() : t('select_date', 'Select Date')}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color={screenColors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: isLoading ? screenColors.disabled : screenColors.primary }]} 
          onPress={handleSaveReminder}
          disabled={isLoading}
        >
          <Text style={[styles.saveButtonText, {color: screenColors.white}]}>{t('save_reminder_button')}</Text>
        </TouchableOpacity>

      </ScrollView>
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
    borderBottomColor: screenColors.border, // Koristi dinamičku boju
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
    color: screenColors.danger, // Koristi dinamičku boju
    fontSize: 12,
    marginTop: 5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: screenColors.border,
    borderRadius: 8,
    padding: 10,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    fontSize: 16,
    flex: 1,
  },
}); 