import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/Colors';

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';

// Auth
import { useAuth } from '../../contexts/AuthContext';

// Navigation
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';

// RTK Query
import { useGetTripsQuery, DbTrip } from '../../store/api/supabaseApi';

// Types
interface Trip {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  startLocation: string;
  endLocation: string;
  distance?: number;
  duration?: string;
  purpose: string;
  vehicleName: string;
  shortVehicleName: string;
}

export default function TripsScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const { user } = useAuth();
  
  // Fetch trips data - filter by current user
  const { data: tripsData, isLoading: isLoadingTrips, error: tripsError, refetch } = useGetTripsQuery({ userId: user?.user_id });

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
    gray: Colors.GRAY,
    lightGray: Colors.LIGHT_GRAY,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    danger: Colors.DANGER,
    filterActiveBackground: Colors.DARK.primary,
    filterInactiveBackground: Colors.DARK.card,
    filterActiveText: Colors.WHITE,
    filterInactiveText: Colors.DARK.textSecondary,
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
    gray: Colors.GRAY,
    lightGray: Colors.LIGHT_GRAY,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    danger: Colors.DANGER,
    filterActiveBackground: Colors.LIGHT.primary,
    filterInactiveBackground: Colors.LIGHT.card,
    filterActiveText: Colors.WHITE,
    filterInactiveText: Colors.LIGHT.textSecondary,
  };

  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Helper function to create short vehicle name
  const getShortVehicleName = (vehicle: any) => {
    if (!vehicle) return 'N/A';
    
    const make = vehicle.make || '';
    const model = vehicle.model || '';
    
    // Create short name: First 3 letters of make + first 3 letters of model
    const shortMake = make.substring(0, 3).toUpperCase();
    const shortModel = model.substring(0, 3).toUpperCase();
    
    return `${shortMake}${shortModel}`;
  };

  // Convert DbTrip to Trip format
  const convertDbTripToTrip = (dbTrip: DbTrip): Trip => {
    const startDate = new Date(dbTrip.start_time);
    const endDate = dbTrip.end_time ? new Date(dbTrip.end_time) : undefined;
    
    // Calculate duration if both start and end times exist
    let duration = undefined;
    if (endDate) {
      const durationMs = endDate.getTime() - startDate.getTime();
      const hours = Math.floor(durationMs / (1000 * 60 * 60));
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      duration = `${hours}h ${minutes}m`;
    }

    // Map status
    let status: 'active' | 'completed' | 'cancelled';
    switch (dbTrip.status?.toUpperCase()) {
      case 'IN_PROGRESS':
        status = 'active';
        break;
      case 'COMPLETED':
        status = 'completed';
        break;
      case 'CANCELLED':
        status = 'cancelled';
        break;
      default:
        status = 'active'; // Default for PLANNED trips
    }

    return {
      id: dbTrip.trip_id,
      name: dbTrip.purpose_description || t('trip', 'Trip'),
      status,
      startDate: dbTrip.start_time,
      endDate: dbTrip.end_time || undefined,
      startLocation: dbTrip.start_location_address || t('unknown', 'Unknown'),
      endLocation: dbTrip.end_location_address || t('unknown', 'Unknown'),
      distance: dbTrip.distance_km || undefined,
      duration,
      purpose: dbTrip.purpose_description || t('unknown', 'Unknown'),
      vehicleName: dbTrip.vehicles ? `${dbTrip.vehicles.make} ${dbTrip.vehicles.model}` : t('unknown_vehicle', 'Unknown Vehicle'),
      shortVehicleName: getShortVehicleName(dbTrip.vehicles)
    };
  };

  // Convert trips data
  const trips: Trip[] = tripsData ? tripsData.map(convertDbTripToTrip) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return screenColors.success;
      case 'completed':
        return screenColors.primary;
      case 'cancelled':
        return screenColors.danger;
      default:
        return screenColors.gray;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return t('active', 'Active');
      case 'completed':
        return t('completed', 'Completed');
      case 'cancelled':
        return t('cancelled', 'Cancelled');
      default:
        return t('unknown', 'Unknown');
    }
  };

  const filteredTrips = trips.filter(trip => {
    if (activeFilter === 'all') return true;
    return trip.status === activeFilter;
  });

  const handleStartNewTrip = () => {
    navigation.navigate('AddTrip');
  };

  const handleTripPress = (tripId: string) => {
    navigation.navigate('TripDetailsScreen', { tripId });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const styles = getStyles(screenColors);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
      <StatusBar 
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={screenColors.background}
      />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle]}>{t('trips_title', 'Trips')}</Text>
      </View>

      <View style={styles.filterContainer}>
        {['all', 'active', 'completed', 'cancelled'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              {
                backgroundColor: activeFilter === filter ? screenColors.filterActiveBackground : screenColors.filterInactiveBackground,
                borderColor: activeFilter === filter ? screenColors.primary : screenColors.border,
              }
            ]}
            onPress={() => setActiveFilter(filter as any)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: activeFilter === filter ? screenColors.filterActiveText : screenColors.filterInactiveText,
                }
              ]}
            >
              {t(filter, filter.charAt(0).toUpperCase() + filter.slice(1))}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingTrips}
            onRefresh={refetch}
            tintColor={screenColors.primary}
            colors={[screenColors.primary]}
          />
        }
      >
        {tripsError ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={screenColors.danger} />
            <Text style={[styles.emptyStateText, { color: screenColors.danger }]}>
              {t('error_loading_trips', 'Error loading trips')}
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: screenColors.textSecondary }]}>
              {t('please_try_again_later', 'Please try again later')}
            </Text>
          </View>
        ) : filteredTrips.length > 0 ? (
          filteredTrips.map((trip) => (
            <TouchableOpacity 
              key={trip.id} 
              style={[styles.tripCard]}
              onPress={() => handleTripPress(trip.id)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <View style={styles.tripTitleContainer}>
                    <Text style={[styles.tripName, { color: screenColors.text }]} numberOfLines={1}>
                      {trip.name}
                    </Text>
                    <View style={styles.vehicleContainer}>
                      <View style={[styles.vehicleBadge, { backgroundColor: screenColors.primary }]}>
                        <Ionicons name="car" size={12} color={screenColors.white} />
                        <Text style={[styles.vehicleShortText, { color: screenColors.white }]}>
                          {trip.shortVehicleName}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) }]}>
                    <Text style={[styles.statusText, { color: screenColors.white }]}>{getStatusText(trip.status)}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.tripDetail}>
                  <Ionicons name="location-outline" size={16} color={screenColors.textSecondary} />
                  <Text style={[styles.detailText, { color: screenColors.text }]}>
                    {trip.startLocation} → {trip.endLocation}
                  </Text>
                </View>

                <View style={styles.tripDetail}>
                  <Ionicons name="calendar-outline" size={16} color={screenColors.textSecondary} />
                  <Text style={[styles.detailText, { color: screenColors.text }]}>
                    {formatDate(trip.startDate)} at {formatTime(trip.startDate)}
                  </Text>
                </View>

                <View style={styles.tripDetail}>
                  <Ionicons name="car-sport-outline" size={16} color={screenColors.textSecondary} />
                  <Text style={[styles.detailText, { color: screenColors.text }]}>
                    {trip.vehicleName}
                  </Text>
                </View>

                <View style={styles.tripDetail}>
                  <Ionicons name="briefcase-outline" size={16} color={screenColors.textSecondary} />
                  <Text style={[styles.detailText, { color: screenColors.text }]}>
                    {trip.purpose}
                  </Text>
                </View>

                {(trip.distance || trip.duration) && (
                  <View style={styles.tripStats}>
                    {trip.distance && (
                      <View style={styles.statItem}>
                        <MaterialCommunityIcons name="map-marker-distance" size={16} color={screenColors.primary} />
                        <Text style={[styles.statText, { color: screenColors.text }]}>
                          {trip.distance} km
                        </Text>
                      </View>
                    )}
                    {trip.duration && (
                      <View style={styles.statItem}>
                        <Ionicons name="time-outline" size={16} color={screenColors.primary} />
                        <Text style={[styles.statText, { color: screenColors.text }]}>
                          {trip.duration}
                        </Text>
                      </View>
                    )}
                    <View style={styles.statItem}>
                      <Ionicons name="eye-outline" size={16} color={screenColors.primary} />
                      <Text style={[styles.statText, { color: screenColors.textSecondary }]}>
                        {t('tap_to_view_details', 'Tap to view details')}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="car-outline" size={48} color={screenColors.textSecondary} />
            <Text style={[styles.emptyStateText]}>
              {t('no_trips_found_for_filter', 'No trips found for "{{filter}}" filter.', { filter: t(activeFilter, activeFilter) })}
            </Text>
            <Text style={[styles.emptyStateSubtext]}>
              {t('try_different_filter_or_create_trip', 'Try selecting a different filter or create a new trip.')}
            </Text>
          </View>
        )}
        <View style={{ height: 80 }} />
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={handleStartNewTrip}
      >
        <Ionicons name="add" size={30} color={screenColors.white} />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const getStyles = (screenColors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: screenColors.border,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: screenColors.text,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: screenColors.background,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 10,
  },
  tripCard: {
    backgroundColor: screenColors.card,
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    shadowColor: screenColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: screenColors.border,
  },
  cardHeader: {
    marginBottom: 10,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tripTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  tripName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  vehicleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  vehicleShortText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: screenColors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardContent: {
  },
  tripDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: screenColors.textSecondary,
    flexShrink: 1,
  },
  tripStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: screenColors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 5,
    fontSize: 13,
    fontWeight: '500',
    color: screenColors.primary,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: screenColors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: screenColors.gray,
    textAlign: 'center',
    marginTop: 5,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: screenColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: screenColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabIcon: {
  },
}); 