import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Platform,
  SafeAreaView,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/Colors';

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';

// Components
import ActiveTripCard from '../../components/Trip/ActiveTripCard';
import WeatherBanner from '../../components/WeatherBanner';
import NativeMapView from '../../components/Map/NativeMapView';

// Trip tracking
import { useTripTracking } from '../../hooks/useTripTracking';

// Modal components for map controls
import TravelOrderModal from '../../components/Map/TravelOrderModal';
import TripModal from '../../components/Map/TripModal';
import PurposeModal from '../../components/Map/PurposeModal';

// API
import {
  useGetTripsQuery,
  useEndTripMutation,
  useCreateTripMutation,
  useGetRemindersQuery,
  useGetReservationsQuery,
  useGetPendingReservationsQuery,
  useGetCurrentUserProfileQuery,
  useGetActiveTravelOrderQuery,
  useCreateTravelOrderMutation,
  useUpdateTravelOrderMutation,
  DbTrip,
  DbReminder,
  DbReservation,
  DbTravelOrder,
  useUpdateTripMutation,
} from '../../store/api/supabaseApi';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';
import { supabase } from '../../lib/supabase';
import { calculateBearing, fetchSpeedLimitFromServer, generateHeatMapSegments, PathSegment } from '../../utils/location';

// Types
interface User {
  id?: string;
  name: string;
  position?: string;
  department?: string;
  avatar?: string;
}

interface ActiveTrip {
  id: string;
  name: string;
  startLocation?: string;
  endLocation?: string;
  startTime: Date;
  status: 'active' | 'paused' | 'completed';
  duration?: string;
  distance?: number;
}

interface Reminder {
  id: string;
  title: string;
  due_date: string;
  status_display?: string;
  vehicle_name?: string;
  user_name?: string;
  time?: string;
}

interface Reservation {
  id: string;
  route_name: string;
  start_date: string;
  status_display?: string;
  vehicle_name: string;
  user_name: string;
  reservation_time?: string;
}

function HomeScreen({ navigation }: any) {
  const { user, session, signOut } = useAuth();
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  // Trip tracking
  const tripTracking = useTripTracking();

  // Map refs and state
  const mapRef = useRef<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 42.4307,
    longitude: 19.2478,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Heat map state
  const [heatMapSegments, setHeatMapSegments] = useState<PathSegment[]>([]);
  const [heatMapEnabled, setHeatMapEnabled] = useState(true);

  // Modal states
  const [showTravelOrderModal, setShowTravelOrderModal] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  const [showPurposeModal, setShowPurposeModal] = useState(false);
  
  // 🚀 OPTIMIZACIJA: Lazy loading sa prioritetima - POBOLJŠANO
  const [loadSecondaryData, setLoadSecondaryData] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // PRIORITET 1: Samo kritični podaci (odmah)
  const { 
    data: userProfileData, 
    isLoading: userProfileLoading, 
    refetch: refetchUserProfile,
    error: userProfileError
  } = useGetCurrentUserProfileQuery(user?.user_id || '', {
    skip: !user?.user_id,
    // 🚀 Dodajem caching da se ne poziva svaki put
    refetchOnMountOrArgChange: 300 // 5 minuta cache
  });

  // PRIORITET 2: Aktivni trip (odmah)
  const { data: tripsData, isLoading: tripsLoading, refetch: refetchTrips } = useGetTripsQuery({ userId: user?.user_id }, {
    refetchOnMountOrArgChange: 60, // 1 minut cache
    skip: !user?.user_id,
  });

  // PRIORITET 3: Notifikacije (odmah - samo broj)
  const { data: pendingReservations } = useGetPendingReservationsQuery(undefined, {
    refetchOnMountOrArgChange: 120 // 2 minuta cache
  });

  // PRIORITET 4: Ostali podaci (lazy load nakon 2 sekunde)
  const { data: remindersData, isLoading: remindersLoading, refetch: refetchReminders } = useGetRemindersQuery(undefined, {
    skip: !loadSecondaryData,
    refetchOnMountOrArgChange: 300 // 5 minuta cache
  });
  
  const { data: reservationsData, isLoading: reservationsLoading, refetch: refetchReservations } = useGetReservationsQuery(undefined, {
    skip: !loadSecondaryData,
    refetchOnMountOrArgChange: 300 // 5 minuta cache
  });

  // 🚀 Optimizovani lazy loading trigger
  useEffect(() => {
    if (isInitialLoad) {
      const timer = setTimeout(() => {
        setLoadSecondaryData(true);
        setIsInitialLoad(false);
      }, 2000); // Povećano na 2 sekunde da se kritični podaci učitaju prvo

      return () => clearTimeout(timer);
    }
  }, [isInitialLoad]);
  
  const pendingCount = pendingReservations?.length || 0;
  
  // 🚀 OPTIMIZACIJA: Uklanjam česte console.log pozive
  // Debug log za notifikacije - samo kada se promeni pendingCount
  useEffect(() => {
    if (pendingCount > 0) {
      console.log('🔔 Notifications:', pendingCount, 'pending');
    }
  }, [pendingCount]);
  
  const [endTrip, { isLoading: endingTrip }] = useEndTripMutation();
  const [createTrip, { isLoading: creatingTrip }] = useCreateTripMutation();

  const [updateTrip, { isLoading: updatingTrip }] = useUpdateTripMutation();

  // Travel Order management
  const { data: activeTravelOrder } = useGetActiveTravelOrderQuery(
    user?.user_id ? { userId: user.user_id } : { userId: '' },
    { skip: !user?.user_id }
  );
  const [createTravelOrder] = useCreateTravelOrderMutation();
  const [updateTravelOrder] = useUpdateTravelOrderMutation();

  // Handle trip ending
  const handleEndTrip = useCallback(async () => {
    try {
      if (!tripTracking.activeTrip?.id) {
        console.error('No active trip to end');
        return;
      }

      console.log('Ending trip:', tripTracking.activeTrip.id);

      await tripTracking.endTrip();

      showSuccessToast(t('trip.ended', 'Trip ended successfully'));

    } catch (error) {
      console.error('Error ending trip:', error);
      showErrorToast(t('trip.end_failed', 'Failed to end trip'));
    }
  }, [tripTracking.activeTrip?.id, tripTracking, t]);

  // 🚀 OPTIMIZACIJA: Memoized colors
  const screenColors = useMemo(() => themeMode === 'dark' ? {
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
    headerTitleColor: Colors.DARK.primary,
    statusBadgeBackground: Colors.SUCCESS,
    emptyStateText: Colors.DARK.textSecondary,
    clientLogoBackground: Colors.DARK.background,
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
    headerTitleColor: Colors.LIGHT.primary,
    statusBadgeBackground: Colors.SUCCESS,
    emptyStateText: Colors.LIGHT.textSecondary,
    clientLogoBackground: Colors.LIGHT.background,
  }, [themeMode]);

  const [isLoading, setIsLoading] = useState(false);
  
  // 🚀 OPTIMIZACIJA: Show active trip when GPS tracking is active
  const activeTrip = useMemo(() => {
    if (!tripTracking.isTracking) return null;

    // Find the trip in our data that matches the active tracking
    return tripsData?.find(trip => trip.trip_id === tripTracking.activeTravelOrder?.id) || null;
  }, [tripTracking.isTracking, tripTracking.activeTravelOrder?.id, tripsData]);

  const convertDbReminderToReminder = (dbReminder: DbReminder): Reminder => {
    return {
      id: dbReminder.reminder_id,
      title: dbReminder.title,
      due_date: dbReminder.due_date,
      status_display: dbReminder.is_completed ? t('completed', 'Completed') : t('upcoming', 'Upcoming'),
      vehicle_name: dbReminder.vehicles ? `${dbReminder.vehicles.make} ${dbReminder.vehicles.model}` : t('not_available', 'N/A'),
      user_name: t('not_available', 'N/A'),
      time: new Date(dbReminder.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const convertDbReservationToReservation = (dbReservation: DbReservation): Reservation => {
    return {
      id: dbReservation.reservation_id,
      route_name: dbReservation.purpose || t('trip', 'Trip'),
      start_date: dbReservation.start_time,
      status_display: dbReservation.reservation_status?.status_name || t('scheduled', 'Scheduled'),
      vehicle_name: dbReservation.vehicles 
        ? `${dbReservation.vehicles.make || ''} ${dbReservation.vehicles.model || ''}`.trim() 
        : dbReservation.vehicle_types?.name || t('vehicle', 'Vehicle'),
      user_name: dbReservation.users 
        ? `${dbReservation.users.first_name || ''} ${dbReservation.users.last_name || ''}`.trim()
        : t('unknown', 'Unknown'),
      reservation_time: new Date(dbReservation.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  // 🚀 OPTIMIZACIJA: Memoized data processing
  const upcomingReminders: Reminder[] = useMemo(() => remindersData ? 
    remindersData
      .filter(reminder => {
        const dueDate = new Date(reminder.due_date);
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const nextWeek = new Date(startOfToday.getTime() + 8 * 24 * 60 * 60 * 1000);
        
        const dateInRange = dueDate >= startOfToday && dueDate <= nextWeek;
        return !reminder.is_completed && dateInRange;
      })
      .map(convertDbReminderToReminder)
      .slice(0, 3)
    : [], [remindersData, t]);

  const upcomingReservations: Reservation[] = useMemo(() => reservationsData ? 
    reservationsData
      .filter(reservation => {
        const startDate = new Date(reservation.start_time);
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const nextWeek = new Date(startOfToday.getTime() + 8 * 24 * 60 * 60 * 1000);
        
        const status = reservation.reservation_status?.status_name?.toLowerCase();
        const validStatuses = ['pending_approval', 'approved', 'scheduled'];
        const statusMatch = validStatuses.includes(status || '');
        const dateInRange = startDate >= startOfToday && startDate <= nextWeek;
        
        return statusMatch && dateInRange;
      })
      .map(convertDbReservationToReservation)
      .slice(0, 3)
    : [], [reservationsData, t]);
  
  // 🚀 OPTIMIZACIJA: Memoized user profile
  const userProfile: User = useMemo(() => ({
    id: user?.user_id,
    name: user?.first_name || t('user', 'User'),
    position: user?.position || t('employee', 'Employee'),
    department: user?.branch || t('general', 'General'), // Assuming branch can be used as department
    avatar: (user?.avatar_url && user.avatar_url.trim() !== '') ? user.avatar_url : undefined,
  }), [user, t]);

  // 🚀 OPTIMIZACIJA: Debug log za avatar - samo u dev modu i kada se promeni
  useEffect(() => {
    if (__DEV__ && userProfileData) {
      console.log('🖼️ UserProfile loaded:', {
        firstName: userProfileData?.first_name,
        hasAvatar: !!userProfileData?.avatar_url
      });
    }
  }, [userProfileData?.first_name, userProfileData?.avatar_url]);

  // Update heat map when tracking path changes
  useEffect(() => {
    if (tripTracking.isTracking && tripTracking.path.length > 1 && heatMapEnabled) {
      const pathWithSpeed = tripTracking.path.map(p => ({
        latitude: p.latitude,
        longitude: p.longitude,
        timestamp: p.timestamp,
        speed: tripTracking.currentSpeed || 0
      }));

      const segments = generateHeatMapSegments(pathWithSpeed, pathWithSpeed, tripTracking.currentSpeed || 50);
      setHeatMapSegments(segments);
    } else {
      setHeatMapSegments([]);
    }
  }, [tripTracking.path, tripTracking.isTracking, tripTracking.currentSpeed, heatMapEnabled]);

  const fetchAllData = async () => {
    setIsLoading(true);
    setLoadSecondaryData(true); // Force load secondary data
    await Promise.all([
      refetchTrips(),
      refetchUserProfile(),
      ...(loadSecondaryData ? [refetchReminders(), refetchReservations()] : [])
    ]);
    setIsLoading(false);
  };

  const handleStartNewTrip = () => {
    navigation.navigate('AddTrip' as never);
  };

  const updateTripToActive = async (tripId: string) => {
    try {
      await updateTrip({
        tripId,
        updates: { status: 'IN_PROGRESS' }
      }).unwrap();
      await refetchTrips();
    } catch (error) {
      console.error('Error updating trip status:', error);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return screenColors.gray;
    switch(status.toLowerCase()) {
      case 'approved': return screenColors.success;
      case 'pending': return screenColors.warning;
      case 'cancelled': return screenColors.danger;
      case 'completed': return screenColors.primary;
      default: return screenColors.gray;
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleNotificationsPress = () => {
    navigation.navigate('Notifications' as never);
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings' as never);
  };

  const styles = getStyles(screenColors);

  // Simple greeting function
  const getGreeting = () => {
    return t('hi', 'Hi');
  };

  // Step-by-step trip creation flow
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<string>('');

  // Modal handlers for step-by-step flow
  const handleStartNewTripFlow = useCallback(() => {
    // Reset selections
    setSelectedVehicle(null);
    setSelectedRoute(null);
    setSelectedPurpose('');

    // Start with vehicle selection
    setShowTripModal(true);
  }, []);

  const handleVehicleSelected = useCallback((vehicle: any) => {
    setSelectedVehicle(vehicle);
    setShowTripModal(false);

    // Next: Route selection
    setShowTravelOrderModal(true);
  }, []);

  const handleRouteSelected = useCallback((route: any) => {
    setSelectedRoute(route);
    setShowTravelOrderModal(false);

    // Next: Purpose selection
    setShowPurposeModal(true);
  }, []);

  const handlePurposeSelected = useCallback((purpose: string) => {
    setSelectedPurpose(purpose);
    setShowPurposeModal(false);

    // Start trip with all selections
    handleStartTrip({
      vehicle: selectedVehicle,
      route: selectedRoute,
      purpose: purpose
    });
  }, [selectedVehicle, selectedRoute]);

  const handleStartTrip = useCallback(async (tripData: any) => {
    try {
      console.log("Starting trip with:", tripData);

      // Create travel order first if needed
      if (!tripTracking.activeTravelOrder) {
        // Create travel order
        const travelOrderData = await createTravelOrder({
          purpose: tripData.purpose,
          vehicle_id: tripData.vehicle.vehicle_id,
          route_id: tripData.route?.route_id,
        }).unwrap();

        console.log("Created travel order:", travelOrderData);
      }

      // Start trip directly using trip tracking hook
      const routeData = {
        userId: user?.user_id || '',
        purposeId: tripData.purpose,
        routeId: tripData.route?.route_id,
        tripId: `trip_${Date.now()}`, // Generate temp trip ID
        orderId: tripTracking.activeTravelOrder?.id || `order_${Date.now()}`,
      };

      await tripTracking.startTrip(routeData);

      console.log("Trip started successfully");

    } catch (error) {
      console.error("Error starting trip:", error);
      showErrorToast(t("trip_start_error", "Failed to start trip"));
    }
  }, [tripTracking.activeTravelOrder, tripTracking, user?.user_id, createTravelOrder, t]);

  // Map control handlers
  const handleZoomIn = useCallback(() => {
    const newRegion = {
      ...currentRegion,
      latitudeDelta: currentRegion.latitudeDelta / 2,
      longitudeDelta: currentRegion.longitudeDelta / 2,
    };
    setCurrentRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 300);
  }, [currentRegion]);

  const handleZoomOut = useCallback(() => {
    const newRegion = {
      ...currentRegion,
      latitudeDelta: currentRegion.latitudeDelta * 2,
      longitudeDelta: currentRegion.longitudeDelta * 2,
    };
    setCurrentRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 300);
  }, [currentRegion]);

  // Speed color function for speed indicator
  const getSpeedColor = (speed: number): string => {
    if (speed > 100) return screenColors.danger;      // Over 100 km/h - Red
    if (speed > 80) return '#FF6B35';                 // Over 80 km/h - Orange
    if (speed > 60) return screenColors.warning;     // Over 60 km/h - Yellow
    return screenColors.primary;                      // Normal speed - Blue
  };

  if (activeTrip) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
        <StatusBar 
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} 
          backgroundColor={screenColors.background} 
        />
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Ionicons name="car-sport-outline" size={28} color={screenColors.primary} />
            <Text style={styles.headerTitle}>{t('fleet_flow', 'Fleet Flow')}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleNotificationsPress} style={styles.headerIcon}>
              <Ionicons name="notifications-outline" size={26} color={screenColors.text} />
              {pendingCount > 0 && (
                <View style={[styles.notificationBadge, { backgroundColor: screenColors.danger }]}>
                  <Text style={styles.notificationBadgeText}>{pendingCount > 99 ? '99+' : pendingCount.toString()}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSettingsPress} style={styles.headerIcon}>
              {userProfile.avatar ? (
                <Image
                  source={{ uri: userProfile.avatar }}
                  style={styles.headerAvatar}
                  defaultSource={require('../../../assets/images/default-avatar.png')}
                />
              ) : (
                <View style={[styles.headerAvatarFallback, { backgroundColor: screenColors.primary }]}>
                  <Text style={styles.headerAvatarInitials}>
                    {userProfile.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.userGreetingContainer}>
          <TouchableOpacity 
            style={styles.userAvatarContainer}
            onPress={() => navigation.navigate('UserProfile')}
          >
            {userProfile.avatar ? (
              <Image 
                source={{ uri: userProfile.avatar }} 
                style={styles.userAvatar}
                defaultSource={require('../../../assets/images/default-avatar.png')}
              />
            ) : (
              <View style={[styles.userAvatarFallback, { backgroundColor: screenColors.primary }]}>
                <Text style={styles.userAvatarInitials}>
                  {userProfile.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.userTextContainer}>
            <Text style={[styles.greetingText, { color: screenColors.textSecondary }]}>
              {getGreeting()}, {userProfile.name}
            </Text>
            <Text style={[styles.positionText, { color: screenColors.textSecondary }]}>
              {userProfile.position} • {userProfile.department}
            </Text>
          </View>
          <Image 
            source={require('../../../assets/logoMDF.png')} 
            style={styles.clientLogo}
          />
        </View>
        <View style={styles.activeTripHeader}>
          <Text style={styles.sectionTitle}>{t('active_trip', 'Active Trip')}</Text>
        </View>
        <View style={styles.fullActiveTripContainer}>
          <ActiveTripCard 
            trip={activeTrip} 
            onEndTrip={async () => {
              try {
                await endTrip(activeTrip.trip_id).unwrap();
                showSuccessToast(t('trip_completed_message', 'Your trip has been completed successfully.'));
              } catch (error) {
                console.error('Error ending trip:', error);
                showErrorToast(t('failed_end_trip', 'Failed to end trip. Please try again.'));
              }
            }}
            onViewTrip={(tripId) => {
              updateTripToActive(tripId);
              navigation.navigate('TripDetailsScreen' as never, { tripId });
            }}
            onNavigate={(tripId) => {
              console.log('🚗 Navigating to NavigationScreen with tripId:', tripId);
              navigation.navigate('Navigation' as never, { tripId });
            }}
          />
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
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Ionicons name="car-sport-outline" size={28} color={screenColors.primary} />
          <Text style={styles.headerTitle}>{t('fleet_flow', 'Fleet Flow')}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleNotificationsPress} style={styles.headerIcon}>
            <Ionicons name="notifications-outline" size={26} color={screenColors.text} />
            {pendingCount > 0 && (
              <View style={[styles.notificationBadge, { backgroundColor: screenColors.danger }]}>
                <Text style={styles.notificationBadgeText}>{pendingCount > 99 ? '99+' : pendingCount.toString()}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSettingsPress} style={styles.headerIcon}>
            <Ionicons name="settings-outline" size={26} color={screenColors.text} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading || tripsLoading || remindersLoading || reservationsLoading || userProfileLoading} 
            onRefresh={fetchAllData}
            tintColor={screenColors.primary}
          />
        }
      >
        <WeatherBanner themeMode={themeMode} />

        {/* Map Section - Full height to bottom navigation */}
        <View style={styles.mapContainer}>
          <NativeMapView
            ref={mapRef}
            currentLocation={tripTracking.lastLocation}
            routeCoordinates={tripTracking.isTracking ? tripTracking.path.map(p => ({
              latitude: p.latitude,
              longitude: p.longitude
            })) : []}
            heatMapSegments={heatMapSegments}
            showUserLocation={true}
            followUserLocation={isFollowing}
            height={Dimensions.get('window').height * 0.65} // Leave space for weather banner and bottom nav
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
          />

          {/* Map Control Buttons - Right Side */}
          <View style={styles.mapControlsContainer}>
            {/* Center/Follow Toggle */}
            <TouchableOpacity
              style={[
                styles.mapControlBtn,
                { backgroundColor: isFollowing ? screenColors.primary : screenColors.card }
              ]}
              onPress={() => setIsFollowing(!isFollowing)}
            >
              <Ionicons
                name="locate"
                size={20}
                color={isFollowing ? 'white' : screenColors.text}
              />
            </TouchableOpacity>

            {/* Zoom In */}
            <TouchableOpacity
              style={[styles.mapControlBtn, { backgroundColor: screenColors.card }]}
              onPress={handleZoomIn}
            >
              <Ionicons name="add" size={20} color={screenColors.text} />
            </TouchableOpacity>

            {/* Zoom Out */}
            <TouchableOpacity
              style={[styles.mapControlBtn, { backgroundColor: screenColors.card }]}
              onPress={handleZoomOut}
            >
              <Ionicons name="remove" size={20} color={screenColors.text} />
            </TouchableOpacity>

            {/* Speed Indicator */}
            {tripTracking.isTracking && (
              <View style={[styles.speedCircle, {
                backgroundColor: screenColors.card,
                borderColor: getSpeedColor(tripTracking.currentSpeed || 0)
              }]}>
                {/* Speed Clouds/Decorations */}
                <View style={styles.speedClouds}>
                  <View style={[styles.speedCloud, styles.cloud1]} />
                  <View style={[styles.speedCloud, styles.cloud2]} />
                  <View style={[styles.speedCloud, styles.cloud3]} />
                </View>

                <Text style={[styles.speedValue, { color: getSpeedColor(tripTracking.currentSpeed || 0) }]}>
                  {Math.round(tripTracking.currentSpeed || 0)}
                </Text>
                <Text style={[styles.speedUnit, { color: screenColors.textSecondary }]}>
                  km/h
                </Text>

                {/* Speed Limit Badge */}
                <View style={[styles.speedLimitBadge, {
                  backgroundColor: tripTracking.currentSpeed > 50 ? screenColors.danger : screenColors.success
                }]}>
                  <Text style={styles.speedLimitBadgeText}>
                    50{/* This should come from speed limit service */}
                  </Text>
                </View>
              </View>
            )}

            {/* Start Trip Button - Inside container, spaced below minus */}
            <View style={{ height: 52 }} /> {/* One button height (44) + gap (8) */}
            <TouchableOpacity
              style={[styles.mapControlBtn, { backgroundColor: screenColors.primary }]}
              onPress={handleStartNewTripFlow}
            >
              <Ionicons name="briefcase-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>


      </ScrollView>

      {/* Trip Control Buttons - Bottom of screen */}
      <View style={styles.tripControlContainer}>
        {!tripTracking.activeTravelOrder ? (
          // No active travel order - show briefcase start button
          <TouchableOpacity
            style={[styles.tripControlButtonSmall, { backgroundColor: screenColors.primary }]}
            onPress={handleStartNewTripFlow}
          >
            <Ionicons name="briefcase-outline" size={20} color="white" />
          </TouchableOpacity>
        ) : tripTracking.isTracking ? (
          // Currently tracking - show STOP circle button
          <TouchableOpacity
            style={[styles.tripControlStopCircle, { borderColor: '#FF3B30' }]}
            onPress={handleEndTrip}
            disabled={tripTracking.isEnding}
          >
            <View style={[styles.stopSquare, { backgroundColor: '#FF3B30' }]}>
              <Ionicons name="stop" size={16} color="white" />
            </View>
          </TouchableOpacity>
        ) : (
          // Travel order active but not tracking - show small play button
          <TouchableOpacity
            style={[styles.tripControlButtonSmall, { backgroundColor: screenColors.primary }]}
            onPress={handleStartNewTripFlow}
          >
            <Ionicons name="play" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Modals */}
      <TripModal
        visible={showTripModal}
        onClose={() => setShowTripModal(false)}
        onVehicleSelected={handleVehicleSelected}
      />

      <TravelOrderModal
        visible={showTravelOrderModal}
        onClose={() => setShowTravelOrderModal(false)}
        onRouteSelected={handleRouteSelected}
      />

      <PurposeModal
        visible={showPurposeModal}
        onClose={() => setShowPurposeModal(false)}
        onSelectPurpose={handlePurposeSelected}
      />
    </SafeAreaView>
  );
}

const getStyles = (screenColors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 15 : 20,
    paddingBottom: 10,
    backgroundColor: screenColors.background,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: screenColors.headerTitleColor,
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: 15,
    position: 'relative',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  headerAvatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatarInitials: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.WHITE,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.DANGER,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  userGreetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: screenColors.card,
    borderBottomWidth: 1,
    borderBottomColor: screenColors.border,
  },
  userAvatarContainer: {
    marginRight: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: screenColors.secondary,
  },
  userAvatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarInitials: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  userTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: screenColors.text,
  },
  positionText: {
    fontSize: 14,
    color: screenColors.textSecondary,
  },
  clientLogo: {
    width: 120,
    height: 50,
    resizeMode: 'contain',
  },
  section: {
    marginTop: 10,
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: screenColors.background,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: screenColors.text,
  },
  card: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: screenColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: screenColors.card,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: `${screenColors.primary}20`,
  },
  cardTextContent: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: screenColors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: screenColors.statusBadgeBackground,
  },
  statusText: {
    fontSize: 10,
    color: screenColors.white,
    fontWeight: 'bold',
  },
  cardDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cardDetailText: {
    fontSize: 12,
    marginLeft: 5,
    color: screenColors.textSecondary,
  },
  actionButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonText: {
    color: screenColors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: screenColors.emptyStateText,
    marginTop: 10,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: screenColors.gray,
    textAlign: 'center',
    marginTop: 5,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  listItemIcon: {
    marginRight: 12,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: screenColors.text,
  },
  listItemSubtitle: {
    fontSize: 13,
    color: screenColors.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tripItem: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  tripItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tripIcon: {
    marginRight: 12,
  },
  tripItemContent: {
    flex: 1,
  },
  tripItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  tripItemSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  tripItemRight: {
    alignItems: 'flex-end',
  },
  tripItemStatus: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapSection: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mapControlsContainer: {
    position: 'absolute',
    right: 20,
    top: 200, // Start from top, below weather banner
    zIndex: 1000,
  },
  mapControlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  speedCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  speedValue: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  speedUnit: {
    fontSize: 8,
    marginTop: -3,
    fontWeight: 'bold',
  },
  speedLimitBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF0000', // Danger red
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  speedLimitBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  speedClouds: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedCloud: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  cloud1: {
    width: 15,
    height: 8,
    top: 8,
    left: 8,
  },
  cloud2: {
    width: 12,
    height: 6,
    top: 35,
    right: 12,
  },
  cloud3: {
    width: 10,
    height: 5,
    bottom: 8,
    left: 15,
  },
  primaryButtonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  primaryButtonTextSmall: {
    fontSize: 14,
    fontWeight: '600',
  },
  viewAllButton: {
    alignSelf: 'flex-start',
    marginTop: 5,
    paddingVertical: 6,
  },
  viewAllText: {
    fontSize: 14,
    color: screenColors.primary,
    fontWeight: '500',
  },
  activeTripSection: {
    flex: 1,
    marginBottom: 0,
  },
  activeTripContainer: {
    flex: 1,
    marginTop: 10,
  },
  activeTripHeader: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: screenColors.background,
  },
  fullActiveTripContainer: {
    flex: 1,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  tripControlContainer: {
    position: 'absolute',
    bottom: 100, // Above tab navigation
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  multiTripControlContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'transparent',
    gap: 12,
  },
  tripControlButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    minWidth: 200,
    maxWidth: 300,
  },
  tripControlButtonSmall: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    minWidth: 120,
    flex: 1,
  },
  tripControlButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 4,
  },
  tripControlButtonTextSmall: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 2,
  },
  tripControlStopCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  stopSquare: {
    width: 24,
    height: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;