import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useGetReservationByIdQuery, useUpdateReservationMutation } from '../../store/api/supabaseApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import Colors from '../../constants/Colors';

export default function EditReservationScreen({ route, navigation }) {
  const { reservationId } = route.params;
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(true);
  
  const { data: reservation, isLoading, error, refetch } = useGetReservationByIdQuery(reservationId);
  const [updateReservation] = useUpdateReservationMutation();
  
  const [purpose, setPurpose] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Define colors based on themeMode
  const screenColors = themeMode === 'dark' ? {
    primary: Colors.DARK.primary,
    secondary: Colors.DARK.secondary,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    danger: Colors.DANGER,
    background: Colors.DARK.background,
    card: Colors.DARK.card,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    border: Colors.DARK.border,
    white: Colors.WHITE,
  } : {
    primary: Colors.LIGHT.primary,
    secondary: Colors.LIGHT.secondary,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    danger: Colors.DANGER,
    background: Colors.LIGHT.background,
    card: Colors.LIGHT.card,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    border: Colors.LIGHT.border,
    white: Colors.WHITE,
  };

  useEffect(() => {
    if (reservation) {
      setPurpose(reservation.purpose || '');
      setStartDate(new Date(reservation.start_time));
      setEndDate(new Date(reservation.end_time));
      setPickupLocation(reservation.pickup_location || '');
      setDropoffLocation(reservation.dropoff_location || '');
    }
  }, [reservation]);

  const handleClose = () => {
    setIsModalVisible(false);
    navigation.goBack();
  };

  const handleSave = async () => {
    try {
      await updateReservation({
        id: reservationId,
        purpose,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
      }).unwrap();
      Alert.alert(t('common.success', 'Success'), t('reservation_details.edit_success', 'Reservation updated successfully'));
      handleClose();
    } catch (error) {
      console.error('Error updating reservation:', error);
      Alert.alert(t('common.error', 'Error'), t('reservation_details.edit_error', 'Failed to update reservation'));
    }
  };

  return (
    <Modal
      visible={isModalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: screenColors.card }]}>  
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color={screenColors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: screenColors.text }]}>
              {t('reservation_details.edit_title', 'Edit Reservation')}
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={[styles.saveButton, { color: screenColors.primary }]}>
                {t('common.save', 'Save')}
              </Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={screenColors.primary} />
              <Text style={[styles.loadingText, { color: screenColors.text, marginTop: 10 }]}>
                {t('common.loading', 'Loading...')}
              </Text>
            </View>
          ) : error ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: screenColors.text }]}>
                {t('common.error_loading_data', 'Error loading data')}
              </Text>
              <TouchableOpacity onPress={refetch} style={{ marginTop: 10 }}>
                <Text style={{ color: screenColors.primary }}>{t('common.retry', 'Retry')}</Text>
              </TouchableOpacity>
            </View>
          ) : !reservation ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: screenColors.text }]}>
                {t('reservation_details.not_found', 'Reservation not found')}
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Purpose */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: screenColors.text }]}>
                  {t('reservation_details.purpose', 'Purpose')}
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: screenColors.card, 
                    color: screenColors.text,
                    borderColor: screenColors.border,
                    borderWidth: 1 
                  }]}
                  value={purpose}
                  onChangeText={setPurpose}
                  placeholder={t('reservation_details.purpose_placeholder', 'Enter purpose')}
                  placeholderTextColor={screenColors.textSecondary}
                />
              </View>

              {/* Start Date */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: screenColors.text }]}>
                  {t('reservation_details.start', 'Start')}
                </Text>
                <TouchableOpacity
                  style={[styles.dateButton, { 
                    backgroundColor: screenColors.card,
                    borderColor: screenColors.border,
                    borderWidth: 1 
                  }]}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text style={[styles.dateButtonText, { color: screenColors.text }]}>
                    {format(startDate, 'PPpp')}
                  </Text>
                </TouchableOpacity>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="datetime"
                    onChange={(event, selectedDate) => {
                      setShowStartDatePicker(false);
                      if (selectedDate) {
                        setStartDate(selectedDate);
                      }
                    }}
                  />
                )}
              </View>

              {/* End Date */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: screenColors.text }]}>
                  {t('reservation_details.end', 'End')}
                </Text>
                <TouchableOpacity
                  style={[styles.dateButton, { 
                    backgroundColor: screenColors.card,
                    borderColor: screenColors.border,
                    borderWidth: 1 
                  }]}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Text style={[styles.dateButtonText, { color: screenColors.text }]}>
                    {format(endDate, 'PPpp')}
                  </Text>
                </TouchableOpacity>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={endDate}
                    mode="datetime"
                    onChange={(event, selectedDate) => {
                      setShowEndDatePicker(false);
                      if (selectedDate) {
                        setEndDate(selectedDate);
                      }
                    }}
                  />
                )}
              </View>

              {/* Pickup Location */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: screenColors.text }]}>
                  {t('reservation_details.pickup', 'Pickup')}
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: screenColors.card, 
                    color: screenColors.text,
                    borderColor: screenColors.border,
                    borderWidth: 1 
                  }]}
                  value={pickupLocation}
                  onChangeText={setPickupLocation}
                  placeholder={t('reservation_details.pickup_placeholder', 'Enter pickup location')}
                  placeholderTextColor={screenColors.textSecondary}
                />
              </View>

              {/* Dropoff Location */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: screenColors.text }]}>
                  {t('reservation_details.dropoff', 'Dropoff')}
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: screenColors.card, 
                    color: screenColors.text,
                    borderColor: screenColors.border,
                    borderWidth: 1 
                  }]}
                  value={dropoffLocation}
                  onChangeText={setDropoffLocation}
                  placeholder={t('reservation_details.dropoff_placeholder', 'Enter dropoff location')}
                  placeholderTextColor={screenColors.textSecondary}
                />
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    height: '80%',
    borderRadius: 12,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  dateButton: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  dateButtonText: {
    fontSize: 16,
  },
}); 