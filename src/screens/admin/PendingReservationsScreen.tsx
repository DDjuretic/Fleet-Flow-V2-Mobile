import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput, Modal, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { 
  useGetPendingReservationsQuery, 
  useApproveReservationMutation, 
  useRejectReservationMutation,
  useGetVehiclesQuery,
  DbReservation,
  DbVehicle
} from '../../store/api/supabaseApi';
import { roleService } from '../../services/roleService';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../services/notificationService';

export default function PendingReservationsScreen({ navigation }: any) {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const { user } = useAuth();
  
  const [canApprove, setCanApprove] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<DbReservation | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const { data: pendingReservationsData, isLoading, error, refetch } = useGetPendingReservationsQuery();
  const { data: vehicles } = useGetVehiclesQuery();
  const [approveReservation, { isLoading: isApproving }] = useApproveReservationMutation();
  const [rejectReservation, { isLoading: isRejecting }] = useRejectReservationMutation();

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
    checkPermissions();
  }, [user]);

  const checkPermissions = async () => {
    if (!user?.id) return;
    
    const hasPermission = await roleService.canApproveReservations(user.id);
    setCanApprove(hasPermission);
    
    if (!hasPermission) {
      Alert.alert(
        t('access_denied', 'Access Denied'),
        t('no_permission_approve', 'You do not have permission to approve reservations'),
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  const handleApprove = (reservation: DbReservation) => {
    setSelectedReservation(reservation);
    setApprovalNotes('');
    setSelectedVehicleId(reservation.vehicle_id || null);
    setShowApprovalModal(true);
  };

  const handleReject = (reservation: DbReservation) => {
    setSelectedReservation(reservation);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  const confirmApproval = async () => {
    if (!selectedReservation || !user?.id) return;

    try {
      await approveReservation({
        reservationId: selectedReservation.reservation_id,
        approvedByUserId: user.id,
        approvalNotes: approvalNotes.trim() || undefined,
        actualVehicleId: selectedVehicleId || undefined
      }).unwrap();

      // Send notification to the user who made the reservation
      const vehicleDisplay = selectedReservation.vehicles
        ? `${selectedReservation.vehicles.make} ${selectedReservation.vehicles.model}`
        : selectedReservation.vehicle_types?.name || 'vehicle';
      
      const approverName = `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || 'Fleet Manager';
      
      await notificationService.sendReservationApprovedNotification(
        selectedReservation.user_id,
        selectedReservation.reservation_id,
        `${vehicleDisplay} - ${selectedReservation.purpose || 'Vehicle reservation'}`,
        approverName
      );

      Alert.alert(
        t('success', 'Success'),
        t('reservation_approved', 'Reservation has been approved successfully')
      );
      
      setShowApprovalModal(false);
      
      // Force refetch to ensure cache is updated
      setTimeout(() => {
        console.log('🔄 Force refetching pending reservations after approval');
        refetch();
      }, 500);
    } catch (error) {
      console.error('Error approving reservation:', error);
      Alert.alert(
        t('error', 'Error'),
        t('approval_failed', 'Failed to approve reservation')
      );
    }
  };

  const confirmRejection = async () => {
    if (!selectedReservation || !user?.id) return;

    if (!rejectionReason.trim()) {
      Alert.alert(
        t('error', 'Error'),
        t('rejection_reason_required', 'Please provide a reason for rejection')
      );
      return;
    }

    try {
      await rejectReservation({
        reservationId: selectedReservation.reservation_id,
        approvedByUserId: user.id,
        rejectionReason: rejectionReason.trim()
      }).unwrap();

      // Send notification to the user who made the reservation
      const vehicleDisplay = selectedReservation.vehicles
        ? `${selectedReservation.vehicles.make} ${selectedReservation.vehicles.model}`
        : selectedReservation.vehicle_types?.name || 'vehicle';
      
      const rejectorName = `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || 'Fleet Manager';
      
      await notificationService.sendReservationRejectedNotification(
        selectedReservation.user_id,
        selectedReservation.reservation_id,
        `${vehicleDisplay} - ${selectedReservation.purpose || 'Vehicle reservation'}`,
        rejectorName,
        rejectionReason.trim()
      );

      Alert.alert(
        t('success', 'Success'),
        t('reservation_rejected', 'Reservation has been rejected')
      );
      
      setShowRejectionModal(false);
      
      // Force refetch to ensure cache is updated
      setTimeout(() => {
        console.log('🔄 Force refetching pending reservations after rejection');
        refetch();
      }, 500);
    } catch (error) {
      console.error('Error rejecting reservation:', error);
      Alert.alert(
        t('error', 'Error'),
        t('rejection_failed', 'Failed to reject reservation')
      );
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const getDurationText = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffHours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours} ${diffHours !== 1 ? t('duration_hours') : t('duration_hour')}`;
    } else {
      const days = Math.round(diffHours / 24);
      return `${days} ${days !== 1 ? t('duration_days') : t('duration_day')}`;
    }
  };

  const renderReservationCard = (reservation: DbReservation) => {
    const start = formatDateTime(reservation.start_time);
    const end = formatDateTime(reservation.end_time);
    const duration = getDurationText(reservation.start_time, reservation.end_time);
    
    const vehicleDisplay = reservation.vehicles
      ? `${reservation.vehicles.make} ${reservation.vehicles.model}`
      : reservation.vehicle_types?.name || t('any_suitable_vehicle');

    return (
      <View key={reservation.reservation_id} style={[styles.card, { backgroundColor: screenColors.card }]}>
        <View style={styles.cardHeader}>
          <View style={styles.reservationInfo}>
            <Text style={[styles.vehicleName, { color: screenColors.text }]}>
              {vehicleDisplay}
            </Text>
            <Text style={[styles.userName, { color: screenColors.textSecondary }]}>
              {t('requested_by', 'Requested by')}: {reservation.users?.first_name} {reservation.users?.last_name}
            </Text>
          </View>
          <View style={[styles.urgentBadge, { backgroundColor: screenColors.warning }]}>
            <Text style={styles.urgentText}>{t('pending', 'PENDING')}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={[styles.purpose, { color: screenColors.text }]}>
            {reservation.purpose || t('no_purpose_specified', 'No purpose specified')}
          </Text>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color={screenColors.textSecondary} />
            <Text style={[styles.infoText, { color: screenColors.textSecondary }]}>
              {start.date} {start.time} - {end.date} {end.time} ({duration})
            </Text>
          </View>

          {reservation.pickup_location && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color={screenColors.textSecondary} />
              <Text style={[styles.infoText, { color: screenColors.textSecondary }]}>
                {reservation.pickup_location}
              </Text>
            </View>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.approveButton, { backgroundColor: screenColors.success }]}
              onPress={() => handleApprove(reservation)}
              disabled={isApproving || isRejecting}
            >
              <Text style={styles.buttonText}>{t('approve', 'Approve')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.rejectButton, { backgroundColor: screenColors.danger }]}
              onPress={() => handleReject(reservation)}
              disabled={isApproving || isRejecting}
            >
              <Text style={styles.buttonText}>{t('reject', 'Reject')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (!canApprove) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
        <ActivityIndicator size="large" color={screenColors.primary} />
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={screenColors.primary} />
          <Text style={[styles.loadingText, { color: screenColors.text }]}>
            {t('loading_pending_reservations', 'Loading pending reservations...')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: screenColors.danger }]}>
            {t('error_loading_reservations', 'Error loading reservations')}
          </Text>
          <TouchableOpacity onPress={refetch} style={[styles.retryButton, { backgroundColor: screenColors.primary }]}>
            <Text style={styles.buttonText}>{t('retry', 'Retry')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={screenColors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: screenColors.text }]}>
          {t('pending_reservations', 'Pending Reservations')}
        </Text>
        <TouchableOpacity onPress={refetch}>
          <Ionicons name="refresh" size={24} color={screenColors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}>
        {pendingReservationsData && pendingReservationsData.length > 0 ? (
          pendingReservationsData.map(renderReservationCard)
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={64} color={screenColors.textSecondary} />
            <Text style={[styles.emptyText, { color: screenColors.textSecondary }]}>
              {t('no_pending_reservations', 'No pending reservations')}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Approval Modal */}
      <Modal
        visible={showApprovalModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowApprovalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: screenColors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: screenColors.text }]}>
                {t('approve_reservation', 'Approve Reservation')}
              </Text>
              <TouchableOpacity onPress={() => setShowApprovalModal(false)}>
                <Ionicons name="close" size={24} color={screenColors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {selectedReservation && (
                <View style={styles.reservationSummary}>
                  <Text style={[styles.summaryTitle, { color: screenColors.text }]}>
                    {t('reservation_details', 'Reservation Details')}
                  </Text>
                  <Text style={[styles.summaryText, { color: screenColors.textSecondary }]}>
                    {t('requested_by', 'Requested by')}: {selectedReservation.users?.first_name} {selectedReservation.users?.last_name}
                  </Text>
                  <Text style={[styles.summaryText, { color: screenColors.textSecondary }]}>
                    {t('purpose', 'Purpose')}: {selectedReservation.purpose || t('not_specified', 'Not specified')}
                  </Text>
                </View>
              )}

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: screenColors.text }]}>
                  {t('assign_vehicle', 'Assign Vehicle')} ({t('optional', 'Optional')})
                </Text>
                {vehicles && vehicles.length > 0 ? (
                  <View style={styles.vehicleSelection}>
                    <TouchableOpacity 
                      style={[
                        styles.vehicleOption, 
                        { 
                          backgroundColor: !selectedVehicleId ? screenColors.primary + '20' : 'transparent',
                          borderColor: screenColors.border 
                        }
                      ]}
                      onPress={() => setSelectedVehicleId(null)}
                    >
                      <Text style={[
                        styles.vehicleOptionText, 
                        { color: !selectedVehicleId ? screenColors.primary : screenColors.text }
                      ]}>
                        {t('any_available_vehicle', 'Any available vehicle')}
                      </Text>
                    </TouchableOpacity>
                    
                    {vehicles.map((vehicle) => (
                      <TouchableOpacity
                        key={vehicle.vehicle_id}
                        style={[
                          styles.vehicleOption, 
                          { 
                            backgroundColor: selectedVehicleId === vehicle.vehicle_id ? screenColors.primary + '20' : 'transparent',
                            borderColor: screenColors.border 
                          }
                        ]}
                        onPress={() => setSelectedVehicleId(vehicle.vehicle_id)}
                      >
                        <Text style={[
                          styles.vehicleOptionText, 
                          { color: selectedVehicleId === vehicle.vehicle_id ? screenColors.primary : screenColors.text }
                        ]}>
                          {vehicle.make} {vehicle.model} ({vehicle.license_plate})
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <Text style={[styles.noVehiclesText, { color: screenColors.textSecondary }]}>
                    {t('no_vehicles_available', 'No vehicles available for selection')}
                  </Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: screenColors.text }]}>
                  {t('approval_notes', 'Approval Notes')} ({t('optional', 'Optional')})
                </Text>
                <TextInput
                  style={[styles.textInput, { 
                    color: screenColors.text, 
                    borderColor: screenColors.border,
                    backgroundColor: screenColors.background 
                  }]}
                  value={approvalNotes}
                  onChangeText={setApprovalNotes}
                  placeholder={t('add_notes_for_driver', 'Add notes for the driver...')}
                  placeholderTextColor={screenColors.textSecondary}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: screenColors.border }]}
                onPress={() => setShowApprovalModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: screenColors.text }]}>
                  {t('cancel', 'Cancel')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: screenColors.success }]}
                onPress={confirmApproval}
                disabled={isApproving}
              >
                {isApproving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>
                    {t('approve', 'Approve')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rejection Modal */}
      <Modal
        visible={showRejectionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRejectionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: screenColors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: screenColors.text }]}>
                {t('reject_reservation', 'Reject Reservation')}
              </Text>
              <TouchableOpacity onPress={() => setShowRejectionModal(false)}>
                <Ionicons name="close" size={24} color={screenColors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {selectedReservation && (
                <View style={styles.reservationSummary}>
                  <Text style={[styles.summaryTitle, { color: screenColors.text }]}>
                    {t('reservation_details', 'Reservation Details')}
                  </Text>
                  <Text style={[styles.summaryText, { color: screenColors.textSecondary }]}>
                    {t('requested_by', 'Requested by')}: {selectedReservation.users?.first_name} {selectedReservation.users?.last_name}
                  </Text>
                  <Text style={[styles.summaryText, { color: screenColors.textSecondary }]}>
                    {t('purpose', 'Purpose')}: {selectedReservation.purpose || t('not_specified', 'Not specified')}
                  </Text>
                </View>
              )}

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: screenColors.text }]}>
                  {t('rejection_reason', 'Rejection Reason')} *
                </Text>
                <TextInput
                  style={[styles.textInput, { 
                    color: screenColors.text, 
                    borderColor: screenColors.border,
                    backgroundColor: screenColors.background 
                  }]}
                  value={rejectionReason}
                  onChangeText={setRejectionReason}
                  placeholder={t('please_explain_why_rejecting', 'Please explain why you are rejecting this reservation...')}
                  placeholderTextColor={screenColors.textSecondary}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: screenColors.border }]}
                onPress={() => setShowRejectionModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: screenColors.text }]}>
                  {t('cancel', 'Cancel')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: screenColors.danger }]}
                onPress={confirmRejection}
                disabled={isRejecting || !rejectionReason.trim()}
              >
                {isRejecting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>
                    {t('reject', 'Reject')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reservationInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userName: {
    fontSize: 14,
  },
  urgentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  urgentText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBody: {
    gap: 8,
  },
  purpose: {
    fontSize: 16,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  approveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 20,
  },
  reservationSummary: {
    marginBottom: 20,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 4,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  vehicleSelection: {
    gap: 8,
  },
  vehicleOption: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  vehicleOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  noVehiclesText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    // Additional styles if needed
  },
  confirmButton: {
    // Additional styles if needed
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 