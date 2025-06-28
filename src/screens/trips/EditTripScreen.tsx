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
import { useGetTripsQuery, useUpdateTripMutation } from '../../store/api/supabaseApi';

// Navigation
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';

type EditTripScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditTrip'>;
type EditTripScreenRouteProp = { key: string; name: 'EditTrip'; params: { tripId: string } };

interface TripFormData {
  destination: string;
  purpose: string;
  startDate: string;
  endDate: string;
  vehicle?: string;
  notes?: string;
}

export default function EditTripScreen() {
  const navigation = useNavigation<EditTripScreenNavigationProp>();
  const route = useRoute<EditTripScreenRouteProp>();
  const { tripId } = route.params;
  
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const { t } = useTranslation();
  
  // RTK Query hooks
  const { data: trips = [], isLoading: isLoadingTrip, error } = useGetTripsQuery();
  const [updateTrip, { isLoading: isUpdating }] = useUpdateTripMutation();
  
  // Find the specific trip from all trips
  const trip = trips.find(t => t.trip_id === tripId);

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
  const [formData, setFormData] = useState<TripFormData>({
    destination: '',
    purpose: '',
    startDate: '',
    endDate: '',
    vehicle: '',
    notes: '',
  });

  // Load trip data when component mounts
  useEffect(() => {
    if (trip) {
      setFormData({
        destination: trip.end_location_address || '',
        purpose: trip.purpose_description || '',
        startDate: trip.start_time || '',
        endDate: trip.end_time || '',
        vehicle: trip.vehicle_id || '',
        notes: trip.notes || '',
      });
    }
  }, [trip]);

  const handleInputChange = (field: keyof TripFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateTrip = async () => {
    if (!formData.destination.trim() || !formData.purpose.trim()) {
      Alert.alert('Error', 'Please fill in all required fields (destination and purpose).');
      return;
    }

    try {
      await updateTrip({
        tripId: tripId,
        updates: {
          end_location_address: formData.destination.trim(),
          purpose_description: formData.purpose.trim(),
          start_time: formData.startDate || null,
          end_time: formData.endDate || null,
          vehicle_id: formData.vehicle?.trim() || null,
          notes: formData.notes?.trim() || null,
        }
      }).unwrap();

      Alert.alert(
        'Success', 
        'Trip updated successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Failed to update trip:', error);
      Alert.alert('Error', 'Failed to update trip. Please try again.');
    }
  };

  const styles = getStyles(screenColors);

  if (isLoadingTrip) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
        <StatusBar 
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={screenColors.background}
        />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: screenColors.text }]}>Loading trip...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !trip) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
        <StatusBar 
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={screenColors.background}
        />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: screenColors.text }]}>Failed to load trip</Text>
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
        <Text style={[styles.headerTitle, { color: screenColors.text }]}>Edit Trip</Text>
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
            
            {/* Destination Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>
                Destination *
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.inputBackground,
                  borderColor: screenColors.border,
                  color: screenColors.text
                }]}
                value={formData.destination}
                onChangeText={(text) => handleInputChange('destination', text)}
                placeholder={t('trip_destination_placeholder')}
                placeholderTextColor={screenColors.placeholder}
              />
            </View>

            {/* Purpose Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>
                Purpose *
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.inputBackground,
                  borderColor: screenColors.border,
                  color: screenColors.text
                }]}
                value={formData.purpose}
                onChangeText={(text) => handleInputChange('purpose', text)}
                placeholder={t('trip_purpose_placeholder')}
                placeholderTextColor={screenColors.placeholder}
              />
            </View>

            {/* Start Date Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>
                Start Date
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.inputBackground,
                  borderColor: screenColors.border,
                  color: screenColors.text
                }]}
                value={formData.startDate}
                onChangeText={(text) => handleInputChange('startDate', text)}
                placeholder="YYYY-MM-DD or date format"
                placeholderTextColor={screenColors.placeholder}
              />
            </View>

            {/* End Date Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>
                End Date
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.inputBackground,
                  borderColor: screenColors.border,
                  color: screenColors.text
                }]}
                value={formData.endDate}
                onChangeText={(text) => handleInputChange('endDate', text)}
                placeholder="YYYY-MM-DD or date format"
                placeholderTextColor={screenColors.placeholder}
              />
            </View>

            {/* Vehicle Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>
                Vehicle
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.inputBackground,
                  borderColor: screenColors.border,
                  color: screenColors.text
                }]}
                value={formData.vehicle}
                onChangeText={(text) => handleInputChange('vehicle', text)}
                placeholder="Enter vehicle details"
                placeholderTextColor={screenColors.placeholder}
              />
            </View>

            {/* Notes Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>
                Notes
              </Text>
              <TextInput
                style={[styles.textArea, { 
                  backgroundColor: screenColors.inputBackground,
                  borderColor: screenColors.border,
                  color: screenColors.text
                }]}
                value={formData.notes}
                onChangeText={(text) => handleInputChange('notes', text)}
                placeholder="Additional notes..."
                placeholderTextColor={screenColors.placeholder}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
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
            onPress={handleUpdateTrip}
            disabled={isUpdating}
          >
            <Text style={[styles.updateButtonText, { color: screenColors.white }]}>
              {isUpdating ? 'Updating...' : 'Update Trip'}
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
    width: 34, // Same as back button to center title
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