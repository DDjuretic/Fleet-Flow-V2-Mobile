import React, { useState, useEffect, useMemo } from 'react';
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

// API
import {
  useGetTripsQuery,
  useEndTripMutation, 
  useGetRemindersQuery,
  useGetReservationsQuery,
  useGetPendingReservationsQuery,
  useGetCurrentUserProfileQuery,
  DbTrip,
  DbReminder,
  DbReservation,
  useUpdateTripMutation,
} from '../../store/api/supabaseApi';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';

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

  const [updateTrip, { isLoading: updatingTrip }] = useUpdateTripMutation();

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
  
  // 🚀 OPTIMIZACIJA: Memoized active trip
  const activeTrip = useMemo(() => tripsData?.find(trip => 
    trip.status?.toLowerCase() === 'active' || 
    trip.status?.toLowerCase() === 'in_progress' ||
    trip.status?.toLowerCase() === 'started' ||
    trip.status?.toLowerCase() === 'planned'
  ) || null, [tripsData]);

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
              <Ionicons name="settings-outline" size={26} color={screenColors.text} />
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('active_trip', 'Active Trip')}</Text>
          <View style={[styles.card, { alignItems: 'center', paddingVertical: 30 }]}>
            <Ionicons name="map-outline" size={48} color={screenColors.textSecondary} />
            <Text style={styles.emptyStateText}>{t('no_active_trip', 'No active trip')}</Text>
            <Text style={styles.emptyStateSubtext}>{t('start_trip_message', 'Start a new trip to see details here.')}</Text>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: screenColors.primary, marginTop: 20, paddingHorizontal:30 }]}
              onPress={handleStartNewTrip}
            >
              <Text style={styles.actionButtonText}>{t('start_new_trip', 'Start New Trip')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('upcoming_reminders', 'Upcoming Reminders')}</Text>
          {upcomingReminders.length > 0 ? (
            upcomingReminders.map((reminder) => (
              <View key={reminder.id} style={[styles.card, styles.listItem]}>
                <Ionicons name="alarm-outline" size={24} color={getStatusColor(reminder.status_display)} style={styles.listItemIcon} />
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{reminder.title}</Text>
                  <Text style={styles.listItemSubtitle}>Due: {formatDate(reminder.due_date)} {reminder.time || ''} - Vehicle: {reminder.vehicle_name || 'N/A'}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(reminder.status_display) }]}>
                  <Text style={styles.statusText}>{reminder.status_display || t('upcoming', 'Upcoming')}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={[styles.card, { backgroundColor: screenColors.card, alignItems: 'center', paddingVertical: 20 }]}>
              <Ionicons name="checkmark-done-outline" size={32} color={screenColors.textSecondary} />
              <Text style={[styles.emptyStateText, { marginTop: 8 }]}>{t('no_upcoming_reminders', 'No upcoming reminders')}</Text>
            </View>
          )}
        </View>
        <View style={[styles.section, { marginBottom: 20 }]}>
          <Text style={styles.sectionTitle}>{t('upcoming_reservations', 'Upcoming Reservations')}</Text>
          {upcomingReservations.length > 0 ? (
            upcomingReservations.map((reservation) => (
              <View key={reservation.id} style={[styles.card, styles.listItem]}>
                <Ionicons name="calendar-outline" size={24} color={getStatusColor(reservation.status_display)} style={styles.listItemIcon} />
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{reservation.route_name}</Text>
                  <Text style={styles.listItemSubtitle}>Date: {formatDate(reservation.start_date)} {reservation.reservation_time || ''} - Vehicle: {reservation.vehicle_name}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(reservation.status_display) }]}>
                  <Text style={styles.statusText}>{reservation.status_display || t('scheduled', 'Scheduled')}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={[styles.card, { backgroundColor: screenColors.card, alignItems: 'center', paddingVertical: 20 }]}>
              <Ionicons name="calendar-outline" size={32} color={screenColors.textSecondary} />
              <Text style={[styles.emptyStateText, { marginTop: 8 }]}>{t('no_upcoming_reservations', 'No upcoming reservations')}</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
});

export default HomeScreen;