import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { RootStackParamList } from '../../types/navigation';
import Colors from '../../constants/Colors';
import { useGetTripsQuery, useDeleteTripMutation, useUpdateTripMutation } from '../../store/api/supabaseApi';
import { showSuccessToast, showErrorToast, showWarningToast } from '../../utils/toastUtils';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { DbTrip } from '../../store/api/supabaseApi';

type TripDetailsScreenRouteProp = RouteProp<RootStackParamList, 'TripDetailsScreen'>;
type TripDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TripDetailsScreen'>;

interface Props {
  route: TripDetailsScreenRouteProp;
  navigation: TripDetailsScreenNavigationProp;
}

const TripDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { tripId } = route.params;
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const [isLoading, setIsLoading] = useState(false);

  // RTK Query hooks
  const { data: tripsData, isLoading: isLoadingTrips, refetch } = useGetTripsQuery();
  const [deleteTrip] = useDeleteTripMutation();
  const [updateTrip] = useUpdateTripMutation();

  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    primary: Colors.DARK.primary,
    secondary: Colors.DARK.secondary,
    card: Colors.DARK.card,
    border: Colors.DARK.border,
    white: Colors.WHITE,
    black: Colors.BLACK,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    danger: Colors.DANGER,
  } : {
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    primary: Colors.LIGHT.primary,
    secondary: Colors.LIGHT.secondary,
    card: Colors.LIGHT.card,
    border: Colors.LIGHT.border,
    white: Colors.WHITE,
    black: Colors.BLACK,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    danger: Colors.DANGER,
  };

  // Find the specific trip
  const tripDetails = tripsData?.find(trip => trip.trip_id === tripId);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = () => {
    if (!tripDetails?.start_time || !tripDetails?.end_time) return null;
    
    const start = new Date(tripDetails.start_time);
    const end = new Date(tripDetails.end_time);
    const durationMs = end.getTime() - start.getTime();
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const handleViewMap = () => {
    if (tripDetails) {
      navigation.navigate('TripMap', { 
        tripId: tripDetails.trip_id, 
        tripName: tripDetails.purpose_description || 'Trip' 
      });
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'IN_PROGRESS':
      case 'PLANNED':
        return screenColors.success;
      case 'COMPLETED':
        return screenColors.primary;
      case 'CANCELLED':
        return screenColors.danger;
      default:
        return screenColors.textSecondary;
    }
  };

  const getStatusText = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'PLANNED':
        return 'Planned';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const handleDeleteTrip = async () => {
    try {
      setIsLoading(true);
      await deleteTrip(tripId).unwrap();
      showSuccessToast('common.success', 'trip_deleted_successfully');
      navigation.goBack();
    } catch (error: any) {
      console.error('Error deleting trip:', error);
      showErrorToast('common.error', 'failed_delete_trip');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteTrip = async () => {
    if (!tripDetails) return;
    
    try {
      setIsLoading(true);
      await updateTrip({
        tripId,
        updates: {
          status: 'COMPLETED',
          end_time: new Date().toISOString(),
        }
      }).unwrap();
      refetch();
      showSuccessToast('common.success', 'trip_completed_successfully');
    } catch (error: any) {
      console.error('Error completing trip:', error);
      showErrorToast('common.error', 'failed_complete_trip');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelTrip = async () => {
    if (!tripDetails) return;
    
    try {
      setIsLoading(true);
      await updateTrip({
        tripId,
        updates: {
          status: 'CANCELLED',
        }
      }).unwrap();
      refetch();
      showSuccessToast('common.success', 'trip_cancelled_successfully');
    } catch (error: any) {
      console.error('Error cancelling trip:', error);
      showErrorToast('common.error', 'failed_cancel_trip');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = getStyles(screenColors);

  if (isLoadingTrips) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
        <StatusBar 
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={screenColors.background}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={screenColors.primary} />
          <Text style={[styles.loadingText, { color: screenColors.text }]}>Loading trip details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!tripDetails) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
        <StatusBar 
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={screenColors.background}
        />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={screenColors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: screenColors.text }]}>Trip Details</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={screenColors.danger} />
          <Text style={[styles.errorText, { color: screenColors.danger }]}>Trip not found</Text>
          <Text style={[styles.errorSubtext, { color: screenColors.textSecondary }]}>
            The trip you're looking for doesn't exist or has been deleted.
          </Text>
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
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={screenColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: screenColors.text }]}>Trip Details</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: screenColors.card }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.tripName, { color: screenColors.text }]}>
              {tripDetails.purpose_description || 'Trip'}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tripDetails.status) }]}>
              <Text style={[styles.statusText, { color: screenColors.white }]}>
                {getStatusText(tripDetails.status)}
              </Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={20} color={screenColors.primary} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: screenColors.textSecondary }]}>Route</Text>
                <Text style={[styles.detailValue, { color: screenColors.text }]}>
                  {tripDetails.start_location_address || 'Unknown'} → {tripDetails.end_location_address || 'Unknown'}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color={screenColors.primary} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: screenColors.textSecondary }]}>Start Date & Time</Text>
                <Text style={[styles.detailValue, { color: screenColors.text }]}>
                  {formatDate(tripDetails.start_time)} at {formatTime(tripDetails.start_time)}
                </Text>
              </View>
            </View>

            {tripDetails.end_time && (
              <View style={styles.detailRow}>
                <Ionicons name="checkmark-circle-outline" size={20} color={screenColors.primary} />
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, { color: screenColors.textSecondary }]}>End Date & Time</Text>
                  <Text style={[styles.detailValue, { color: screenColors.text }]}>
                    {formatDate(tripDetails.end_time)} at {formatTime(tripDetails.end_time)}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.detailRow}>
              <Ionicons name="car-sport-outline" size={20} color={screenColors.primary} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: screenColors.textSecondary }]}>Vehicle</Text>
                <Text style={[styles.detailValue, { color: screenColors.text }]}>
                  {tripDetails.vehicles ? `${tripDetails.vehicles.make} ${tripDetails.vehicles.model}` : 'Unknown Vehicle'}
                </Text>
              </View>
            </View>

            {tripDetails.distance_km && (
              <View style={styles.detailRow}>
                <Ionicons name="map-outline" size={20} color={screenColors.primary} />
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, { color: screenColors.textSecondary }]}>Distance</Text>
                  <Text style={[styles.detailValue, { color: screenColors.text }]}>
                    {tripDetails.distance_km} km
                  </Text>
                </View>
              </View>
            )}

            {formatDuration() && (
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={20} color={screenColors.primary} />
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, { color: screenColors.textSecondary }]}>Duration</Text>
                  <Text style={[styles.detailValue, { color: screenColors.text }]}>
                    {formatDuration()}
                  </Text>
                </View>
              </View>
            )}

            {tripDetails.trip_types && (
              <View style={styles.detailRow}>
                <Ionicons name="flag-outline" size={20} color={screenColors.primary} />
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, { color: screenColors.textSecondary }]}>Trip Type</Text>
                  <Text style={[styles.detailValue, { color: screenColors.text }]}>
                    {tripDetails.trip_types.name}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.detailRow}>
              <Ionicons name="briefcase-outline" size={20} color={screenColors.primary} />
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: screenColors.textSecondary }]}>Purpose</Text>
                <Text style={[styles.detailValue, { color: screenColors.text }]}>
                  {tripDetails.purpose_description || 'No purpose specified'}
                </Text>
              </View>
            </View>

            {tripDetails.notes && (
              <View style={styles.detailRow}>
                <Ionicons name="document-text-outline" size={20} color={screenColors.primary} />
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, { color: screenColors.textSecondary }]}>Notes</Text>
                  <Text style={[styles.detailValue, { color: screenColors.text }]}>
                    {tripDetails.notes}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Map and Edit Section */}
        <View style={[styles.card, { backgroundColor: screenColors.card }]}>
          <Text style={[styles.sectionTitle, { color: screenColors.text }]}>Actions</Text>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: screenColors.primary }]}
            onPress={handleViewMap}
          >
            <Ionicons name="map" size={20} color={screenColors.white} />
            <Text style={[styles.actionButtonText, { color: screenColors.white }]}>
              View Route on Map
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: screenColors.secondary }]}
            onPress={() => {
              // TODO: Navigate to edit trip screen
              showWarningToast('common.warning', 'edit_functionality_coming_soon');
            }}
          >
            <Ionicons name="pencil" size={20} color={screenColors.white} />
            <Text style={[styles.actionButtonText, { color: screenColors.white }]}>
              Edit Trip Details
            </Text>
          </TouchableOpacity>
        </View>

        {/* Status Action Buttons */}
        <View style={styles.actionsContainer}>
          {tripDetails.status?.toUpperCase() === 'PLANNED' && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: screenColors.success }]}
              onPress={handleCompleteTrip}
              disabled={isLoading}
            >
              <Ionicons name="checkmark-circle" size={20} color={screenColors.white} />
              <Text style={[styles.actionButtonText, { color: screenColors.white }]}>
                Complete Trip
              </Text>
            </TouchableOpacity>
          )}

          {(tripDetails.status?.toUpperCase() === 'PLANNED' || tripDetails.status?.toUpperCase() === 'IN_PROGRESS') && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: screenColors.warning }]}
              onPress={handleCancelTrip}
              disabled={isLoading}
            >
              <Ionicons name="close-circle" size={20} color={screenColors.white} />
              <Text style={[styles.actionButtonText, { color: screenColors.white }]}>
                Cancel Trip
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: screenColors.danger }]}
            onPress={handleDeleteTrip}
            disabled={isLoading}
          >
            <Ionicons name="trash" size={20} color={screenColors.white} />
            <Text style={[styles.actionButtonText, { color: screenColors.white }]}>
              Delete Trip
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={screenColors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

const getStyles = (screenColors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: screenColors.border,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: screenColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tripName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailsContainer: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '400',
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TripDetailsScreen;