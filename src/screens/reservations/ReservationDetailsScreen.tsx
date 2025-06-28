import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Modal, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useGetReservationByIdQuery, useDeleteReservationMutation } from '../../store/api/supabaseApi';
import { format } from 'date-fns';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import Colors from '../../constants/Colors';

export default function ReservationDetailsScreen({ route, navigation }) {
  const { reservationId } = route.params;
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const [isModalVisible, setIsModalVisible] = useState(true);
  
  const { 
    data: reservation, 
    isLoading, 
    error,
    refetch 
  } = useGetReservationByIdQuery(reservationId, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false
  });
  
  const [deleteReservation] = useDeleteReservationMutation();

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

  const handleClose = useCallback(() => {
    setIsModalVisible(false);
    navigation.goBack();
  }, [navigation]);

  const handleEdit = useCallback(() => {
    navigation.navigate('EditReservation', { reservationId });
  }, [navigation, reservationId]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      t('reservation_details.delete_confirmation_title', 'Delete Reservation'),
      t('reservation_details.delete_confirmation_message', 'Are you sure you want to delete this reservation?'),
      [
        {
          text: t('common.cancel', 'Cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete', 'Delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReservation(reservationId).unwrap();
              handleClose();
            } catch (err) {
              console.error('Error deleting reservation:', err);
              Alert.alert(
                t('common.error', 'Error'), 
                t('reservation_details.delete_error', 'Failed to delete reservation')
              );
            }
          },
        },
      ]
    );
  }, [t, deleteReservation, reservationId, handleClose]);

  const formattedDates = useMemo(() => {
    if (!reservation?.start_time || !reservation?.end_time) return null;
    return {
      start: format(new Date(reservation.start_time), 'PPpp'),
      end: format(new Date(reservation.end_time), 'PPpp')
    };
  }, [reservation?.start_time, reservation?.end_time]);

  const vehicleDisplay = useMemo(() => {
    if (!reservation) return '';
    return reservation.vehicles 
      ? `${reservation.vehicles.make} ${reservation.vehicles.model} (${reservation.vehicles.license_plate})`
      : reservation.vehicle_types?.name || t('common.not_specified', 'Not Specified');
  }, [reservation?.vehicles, reservation?.vehicle_types, t]);

  if (isLoading) {
    return (
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={[styles.loadingContainer, { backgroundColor: screenColors.card }]}>
            <ActivityIndicator size="large" color={screenColors.primary} />
            <Text style={[styles.loadingText, { color: screenColors.text }]}>
              {t('common.loading', 'Loading...')}
            </Text>
          </View>
        </View>
      </Modal>
    );
  }

  if (error || !reservation) {
    return (
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={[styles.errorContainer, { backgroundColor: screenColors.card }]}>
            <Text style={[styles.errorText, { color: screenColors.text }]}>
              {error ? t('common.error_loading_data', 'Error loading data') : t('reservation_details.not_found', 'Reservation not found')}
            </Text>
            <View style={styles.errorButtonsContainer}>
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: screenColors.primary }]}
                onPress={handleRetry}
              >
                <Text style={[styles.buttonText, { color: screenColors.card }]}>
                  {t('common.retry', 'Retry')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: screenColors.border }]}
                onPress={handleClose}
              >
                <Text style={[styles.buttonText, { color: screenColors.card }]}>
                  {t('common.close', 'Close')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

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
            <Text style={[styles.title, { color: screenColors.text }]}>
              {t('reservation_details.title', 'Reservation Details')}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color={screenColors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: screenColors.text }]}>
                {t('reservation_details.vehicle_info', 'Vehicle')}
              </Text>
              <Text style={[styles.sectionContent, { color: screenColors.text }]}>
                {vehicleDisplay}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: screenColors.text }]}>
                {t('reservation_details.time_info', 'Time Information')}
              </Text>
              <Text style={[styles.sectionContent, { color: screenColors.text }]}>
                {t('reservation_details.start', 'Start')}: {formattedDates?.start}
              </Text>
              <Text style={[styles.sectionContent, { color: screenColors.text }]}>
                {t('reservation_details.end', 'End')}: {formattedDates?.end}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: screenColors.text }]}>
                {t('reservation_details.purpose', 'Purpose')}
              </Text>
              <Text style={[styles.sectionContent, { color: screenColors.text }]}>
                {reservation.purpose || t('common.not_specified', 'Not Specified')}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: screenColors.text }]}>
                {t('reservation_details.status', 'Status')}
              </Text>
              <Text style={[styles.sectionContent, { color: screenColors.text }]}>
                {reservation.reservation_status?.status_name || t('common.not_specified', 'Not Specified')}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: screenColors.text }]}>
                {t('reservation_details.location_info', 'Location Information')}
              </Text>
              <Text style={[styles.sectionContent, { color: screenColors.text }]}>
                {t('reservation_details.pickup', 'Pickup')}: {reservation.pickup_location || t('common.not_specified', 'Not Specified')}
              </Text>
              <Text style={[styles.sectionContent, { color: screenColors.text }]}>
                {t('reservation_details.dropoff', 'Dropoff')}: {reservation.dropoff_location || t('common.not_specified', 'Not Specified')}
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.editButton, { backgroundColor: screenColors.primary }]}
              onPress={handleEdit}
            >
              <Text style={[styles.buttonText, { color: screenColors.card }]}>
                {t('common.edit', 'Edit')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton, { backgroundColor: '#ef4444' }]}
              onPress={handleDelete}
            >
              <Text style={[styles.buttonText, { color: screenColors.card }]}>
                {t('common.delete', 'Delete')}
              </Text>
            </TouchableOpacity>
          </View>
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
  loadingContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  errorButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
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
  scrollView: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    flex: 1,
  },
  deleteButton: {
    flex: 1,
  },
}); 