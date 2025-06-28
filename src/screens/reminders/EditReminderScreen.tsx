import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useTranslation } from 'react-i18next';

// Redux & RTK Query
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { 
  useGetRemindersQuery, 
  useUpdateReminderMutation, 
  useGetReminderTypesQuery 
} from '../../store/api/supabaseApi';

// Navigation
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';

type EditReminderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditReminder'>;
type EditReminderScreenRouteProp = { key: string; name: 'EditReminder'; params: { reminderId: string } };

interface ReminderFormData {
  title: string;
  description: string;
  selectedTypeId: string;
  dueDate: string;
}

export default function EditReminderScreen() {
  const navigation = useNavigation<EditReminderScreenNavigationProp>();
  const route = useRoute<EditReminderScreenRouteProp>();
  const { reminderId } = route.params;
  
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const { t } = useTranslation();
  
  // RTK Query hooks
  const { data: reminders = [], isLoading: isLoadingReminder } = useGetRemindersQuery();
  const { data: types = [], isLoading: isLoadingTypes } = useGetReminderTypesQuery();
  const [updateReminder, { isLoading: isUpdating }] = useUpdateReminderMutation();

  // Find the specific reminder
  const reminder = reminders.find(r => r.reminder_id === reminderId);

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
  };

  // Form state
  const [formData, setFormData] = useState<ReminderFormData>({
    title: '',
    description: '',
    selectedTypeId: '',
    dueDate: '',
  });

  // Load reminder data when component mounts
  useEffect(() => {
    if (reminder) {
      setFormData({
        title: reminder.title || '',
        description: reminder.description || '',
        selectedTypeId: reminder.reminder_type_id || '',
        dueDate: reminder.due_date || '',
      });
    }
  }, [reminder]);

  const handleInputChange = (field: keyof ReminderFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTypeSelect = () => {
    if (types.length === 0) {
      Alert.alert('Loading', 'Types are still loading...');
      return;
    }

    const typeOptions = types.map(type => ({
      text: type.name,
      onPress: () => handleInputChange('selectedTypeId', type.reminder_type_id)
    }));

    Alert.alert(
      'Select Type',
      'Choose a reminder type:',
      [
        ...typeOptions,
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const getSelectedTypeName = () => {
    const type = types.find(t => t.reminder_type_id === formData.selectedTypeId);
    return type ? type.name : 'Select Type';
  };

  const handleUpdateReminder = async () => {
    if (!formData.title.trim() || !formData.selectedTypeId || !formData.dueDate.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      await updateReminder({
        reminderId: reminderId,
        updates: {
          title: formData.title.trim(),
          description: formData.description?.trim() || null,
          reminder_type_id: formData.selectedTypeId,
          due_date: formData.dueDate,
        }
      }).unwrap();

      Alert.alert(
        'Success', 
        'Reminder updated successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Failed to update reminder:', error);
      Alert.alert('Error', 'Failed to update reminder. Please try again.');
    }
  };

  const styles = getStyles(screenColors);

  if (isLoadingReminder || isLoadingTypes) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
        <StatusBar 
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={screenColors.background}
        />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: screenColors.text }]}>Loading reminder...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!reminder) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
        <StatusBar 
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={screenColors.background}
        />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: screenColors.text }]}>Reminder not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={[styles.backButtonText, { color: screenColors.primary }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
      <StatusBar 
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={screenColors.background}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={screenColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: screenColors.text }]}>Edit Reminder</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            
            {/* Title Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>
                Title *
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.inputBackground,
                  borderColor: screenColors.border,
                  color: screenColors.text
                }]}
                value={formData.title}
                onChangeText={(text) => handleInputChange('title', text)}
                placeholder={t('reminder_title_placeholder')}
                placeholderTextColor={screenColors.placeholder}
              />
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>
                Description
              </Text>
              <TextInput
                style={[styles.textArea, { 
                  backgroundColor: screenColors.inputBackground,
                  borderColor: screenColors.border,
                  color: screenColors.text
                }]}
                value={formData.description}
                onChangeText={(text) => handleInputChange('description', text)}
                placeholder={t('reminder_description_placeholder')}
                placeholderTextColor={screenColors.placeholder}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Type Selector */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>
                Type *
              </Text>
              <TouchableOpacity
                style={[styles.typeSelector, { 
                  backgroundColor: screenColors.inputBackground,
                  borderColor: screenColors.border,
                }]}
                onPress={handleTypeSelect}
              >
                <Text style={[
                  styles.typeText, 
                  { 
                    color: formData.selectedTypeId ? screenColors.text : screenColors.placeholder 
                  }
                ]}>
                  {getSelectedTypeName()}
                </Text>
                <Ionicons name="chevron-down" size={20} color={screenColors.text} />
              </TouchableOpacity>
            </View>

            {/* Due Date Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>
                Due Date *
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.inputBackground,
                  borderColor: screenColors.border,
                  color: screenColors.text
                }]}
                value={formData.dueDate}
                onChangeText={(text) => handleInputChange('dueDate', text)}
                placeholder="YYYY-MM-DD or date format"
                placeholderTextColor={screenColors.placeholder}
              />
            </View>

          </View>
        </ScrollView>

        {/* Update Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.updateButton, 
              { 
                backgroundColor: screenColors.primary,
                opacity: isUpdating ? 0.6 : 1
              }
            ]}
            onPress={handleUpdateReminder}
            disabled={isUpdating}
          >
            <Text style={[styles.updateButtonText, { color: screenColors.white }]}>
              {isUpdating ? 'Updating...' : 'Update Reminder'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: screenColors.border,
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 34,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  typeSelector: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 16,
    flex: 1,
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: screenColors.border,
  },
  updateButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 