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
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer'; // Path to rootReducer
// import { ThemeMode } from '../../store/slices/themeSlice'; // ThemeMode type might not be needed directly in component if only using mode string

// RTK Query Hook and Types
import { useGetReservationsQuery, DbReservation } from '../../store/api/supabaseApi'; // Import hook and type

// Types
// interface Reservation { ... } 

export default function ReservationsScreen({ navigation }: any) {
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const { t } = useTranslation();
  const { colors } = useTheme();

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

  // Fetch reservations using RTK Query
  const { 
    data: reservationsData, 
    isLoading: isLoadingReservations, 
    error: reservationsError,
    refetch: refetchReservations 
  } = useGetReservationsQuery();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'active' | 'completed' | 'rejected' | string>('all');

  const styles = getStyles(screenColors, themeMode);

  const getStatusColor = (statusName?: string | null) => {
    switch (statusName?.toLowerCase()) {
      case 'pending_approval': // Example status name from schema inspection
      case 'pending': // Keep old one for compatibility if needed, but prefer new ones
        return screenColors.warning;
      case 'approved':
        return screenColors.success;
      case 'rejected':
      case 'cancelled': // Example
        return screenColors.danger;
      case 'active':
        return screenColors.primary;
      case 'completed':
        return screenColors.secondary;
      default:
        return screenColors.textSecondary; // Default color for unknown status
    }
  };

  const getStatusText = (statusName?: string | null) => {
    switch (statusName?.toLowerCase()) {
      case 'pending_approval':
        return t('pending_approval', 'Pending Approval');
      case 'approved':
        return t('approved', 'Approved');
      case 'rejected':
        return t('rejected', 'Rejected');
      case 'cancelled':
        return t('cancelled', 'Cancelled');
      case 'active':
        return t('active', 'Active');
      case 'completed':
        return t('completed', 'Completed');
      default:
        return statusName || t('unknown', 'Unknown');
    }
  };

  const getVehicleIcon = (reservation: DbReservation) => {
    // Prefer specific vehicle type, then requested vehicle type
    const vehicleTypeName = reservation.vehicles?.vehicle_types?.name || reservation.vehicle_types?.name;
    switch (vehicleTypeName?.toLowerCase()) {
      case 'car':
        return 'car-outline' as any;
      case 'van':
        return 'bus-outline' as any;
      case 'truck':
        return 'reader-outline' as any;
      default:
        return 'car-sport-outline' as any;
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
      return diffHours === 1 
        ? t('hour', '{{count}} hour', { count: diffHours })
        : t('hours', '{{count}} hours', { count: diffHours });
    } else {
      const days = Math.round(diffHours / 24);
      return days === 1 
        ? t('day', '{{count}} day', { count: days })
        : t('days', '{{count}} days', { count: days });
    }
  };

  const filteredReservations = reservationsData?.filter(reservation => {
    if (activeFilter === 'all') return true;
    return reservation.reservation_status?.status_name?.toLowerCase() === activeFilter.toLowerCase();
  }) || [];

  const handleAddReservation = () => {
    navigation.navigate('AddReservation'); // Navigate to AddReservationScreen
  };

  const handleReservationPress = (reservation: DbReservation) => {
    const startDateTime = formatDateTime(reservation.start_time);
    const endDateTime = formatDateTime(reservation.end_time);
    
    const vehicleDisplay = reservation.vehicles
      ? `${reservation.vehicles.make} ${reservation.vehicles.model} (${reservation.vehicles.license_plate})`
      : reservation.vehicle_types?.name || t('type_not_specified', 'Type Not Specified');

    Alert.alert(
      t('reservation_details_title', 'Reservation Details'),
      `${t('vehicle_type', 'Vehicle/Type')}: ${vehicleDisplay}\n` +
      `${t('user', 'User')}: ${reservation.users?.first_name || 'N/A'} ${reservation.users?.last_name || ''}\n` +
      `${t('purpose', 'Purpose')}: ${reservation.purpose}\n` +
      `${t('start', 'Start')}: ${startDateTime.date} at ${startDateTime.time}\n` +
      `${t('end', 'End')}: ${endDateTime.date} at ${endDateTime.time}\n` +
      `${t('status', 'Status')}: ${getStatusText(reservation.reservation_status?.status_name)}\n` +
      `${reservation.requested_features?.user_notes ? `${t('notes', 'Notes')}: ${reservation.requested_features.user_notes}\n` : ''}` +
      `${t('pickup', 'Pickup')}: ${reservation.pickup_location || 'N/A'}\n` +
      `${t('dropoff', 'Dropoff')}: ${reservation.dropoff_location || 'N/A'}`,
      [{ text: t('ok', 'OK') }]
    );
  };
  
  const renderReservationCard = ({ item }: { item: DbReservation }) => {
    const vehicleDisplay = item.vehicles
      ? `${item.vehicles.make} ${item.vehicles.model}`
      : item.vehicle_types?.name || t('vehicle_type_not_specified', 'Vehicle Type Not Specified');
    const licensePlate = item.vehicles?.license_plate;
    const start = formatDateTime(item.start_time);
    const end = formatDateTime(item.end_time);
    const duration = getDurationText(item.start_time, item.end_time);
    const statusName = item.reservation_status?.status_name;

    return (
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: screenColors.card }]}
        onPress={() => navigation.navigate('ReservationDetails', { reservationId: item.reservation_id })}
      >
        <View style={styles.cardHeader}>
          <Ionicons name={getVehicleIcon(item)} size={24} color={screenColors.primary} style={styles.vehicleIcon} />
          <View style={styles.vehicleInfo}>
            <Text style={[styles.vehicleName, { color: screenColors.text }]}>{vehicleDisplay}</Text>
            {licensePlate && <Text style={[styles.licensePlate, { color: screenColors.textSecondary }]}>{licensePlate}</Text>}
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(statusName) }]}>
            <Text style={styles.statusText}>{getStatusText(statusName)}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={[styles.purpose, { color: screenColors.text }]}>
            {item.purpose || t('no_purpose_specified', 'No purpose specified')}
          </Text>

          <InfoRow 
            icon="person-outline" 
            text={`${item.users?.first_name || t('unknown', 'Unknown')} ${item.users?.last_name || t('user', 'User')}`}
            screenColors={screenColors}
          />
          <InfoRow 
            icon="calendar-outline" 
            text={`${start.date} ${start.time} - ${end.date} ${end.time} (${duration})`}
            screenColors={screenColors}
          />
          <InfoRow 
            icon="location-outline" 
            text={item.pickup_location || t('pickup_location_not_specified', 'Pickup location not specified')}
            screenColors={screenColors}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const InfoRow = ({ icon, text, screenColors }: { icon: keyof typeof Ionicons.glyphMap, text: string, screenColors: any }) => (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={16} color={screenColors.textSecondary} style={styles.infoIcon} />
      <Text style={[styles.infoText, { color: screenColors.textSecondary }]}>{text}</Text>
    </View>
  );

  // Filter buttons data
  const filterButtons = [
    { label: t('all', 'All'), value: 'all' },
    { label: t('pending', 'Pending'), value: 'pending_approval' },
    { label: t('approved', 'Approved'), value: 'approved' },
    { label: t('active', 'Active'), value: 'active' },
    { label: t('completed', 'Completed'), value: 'completed' },
    { label: t('rejected', 'Rejected'), value: 'rejected' },
    { label: t('cancelled', 'Cancelled'), value: 'cancelled' },
  ];

  if (isLoadingReservations) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={screenColors.primary} />
      </SafeAreaView>
    );
  }

  if (reservationsError) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: screenColors.danger }}>{t('error_fetching_reservations', 'Error fetching reservations.')}</Text>
        <TouchableOpacity onPress={refetchReservations} style={styles.retryButton}>
          <Text style={{ color: screenColors.primary }}>{t('tap_to_retry', 'Tap to retry')}</Text>
        </TouchableOpacity>
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
        <Text style={[styles.headerTitle, { color: screenColors.text }]}>{t('reservations_title', 'Reservations')}</Text>
      </View>

      {/* Filter Buttons Horizontal ScrollView */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollView}>
          {filterButtons.map(filter => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterButton,
                { backgroundColor: activeFilter === filter.value ? screenColors.primary : screenColors.card },
                { borderColor: activeFilter === filter.value ? screenColors.primary : screenColors.border },
              ]}
              onPress={() => setActiveFilter(filter.value)}
            >
              <Text style={[
                styles.filterButtonText,
                { color: activeFilter === filter.value ? screenColors.white : screenColors.textSecondary },
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {filteredReservations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="file-tray-stacked-outline" size={64} color={screenColors.textSecondary} />
          <Text style={[styles.emptyText, { color: screenColors.textSecondary }]}>
            {t('no_reservations_found_for_filter', 'No reservations found for the selected filter.')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredReservations}
          renderItem={renderReservationCard}
          keyExtractor={(item) => item.reservation_id}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingReservations} // Use RTK isLoading for pull-to-refresh
              onRefresh={refetchReservations}
              tintColor={screenColors.primary} // For iOS
              colors={[screenColors.primary]} // For Android
              title={t('refreshing', 'Refreshing...')} // Optional title
              titleColor={screenColors.textSecondary} // Optional title color
            />
          }
        />
      )}

      {/* Floating Action Button to Add Reservation */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={handleAddReservation}
      >
        <Ionicons name="add" size={30} color={screenColors.white} />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

// Moved StyleSheet.create into a function that accepts themed colors
const getStyles = (screenColors: any, themeMode: 'light' | 'dark') => StyleSheet.create({
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
  statsContainer: { // This was for summary cards, can be removed or repurposed
    // flexDirection: 'row',
    // justifyContent: 'space-around',
    // paddingVertical: 15,
    // paddingHorizontal: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: colors.border,
  },
  // statCard, statNumber, statLabel can be removed if statsContainer is removed
  
  // Filter styles
  filterContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: screenColors.border,
  },
  filterScrollView: {
    paddingHorizontal: 15,
  },
  filterButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // List styles (New or adjusted from ScrollView)
  listContentContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: screenColors.card,
    borderWidth: 1,
    borderColor: screenColors.primary,
  },

  // Card styles (New)
  card: {
    backgroundColor: screenColors.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: screenColors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: themeMode === 'dark' ? 0.3 : 0.1,
    shadowRadius: themeMode === 'dark' ? 5 : 3,
    elevation: themeMode === 'dark' ? 5 : 3,
    borderWidth: themeMode === 'dark' ? 1 : 0,
    borderColor: screenColors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: screenColors.border,
  },
  vehicleIcon: {
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: screenColors.text,
  },
  licensePlate: {
    fontSize: 13,
    color: screenColors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: screenColors.white,
  },
  cardBody: {
    paddingTop: 5,
  },
  purpose: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: screenColors.text,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: screenColors.textSecondary,
    flexShrink: 1,
  },

  // FAB style - This was the original, ensure it matches the ExpensesScreen FAB
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
}); 