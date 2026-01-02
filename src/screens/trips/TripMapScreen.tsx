import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { RootStackParamList } from '../../types/navigation';
import Colors from '../../constants/Colors';
import { useGetTripsQuery } from '../../store/api/supabaseApi';
import WebMapView from '../../components/Map/WebMapView';
import { LocationCoordinates } from '../../services/locationService';
import { getNavigationRoute, NavigationRoute } from '../../services/routingService';
import { geocodeAddress } from '../../services/geocodingService';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';

type TripMapScreenRouteProp = RouteProp<RootStackParamList, 'TripMap'>;
type TripMapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TripMap'>;

type Props = {
  route: TripMapScreenRouteProp;
  navigation: TripMapScreenNavigationProp;
};

const TripMapScreen: React.FC<Props> = ({ route, navigation }) => {
  const { tripId, tripName } = route.params;
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const [routeData, setRouteData] = useState<LocationCoordinates[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // RTK Query hooks
  const { data: tripsData, isLoading: isLoadingTrips } = useGetTripsQuery();

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

  // Load navigation route or saved path when trip details are available
  useEffect(() => {
    const loadRouteData = async () => {
      if (!tripDetails) return;

      // If we have saved path data, use it directly!
      if (tripDetails.path && Array.isArray(tripDetails.path) && tripDetails.path.length > 0) {
        console.log('✅ Using saved GPS path data:', tripDetails.path.length, 'points');
        setRouteData(tripDetails.path);
        return;
      }

      if (!tripDetails.start_location_address || !tripDetails.end_location_address) {
        console.log('📍 Missing trip addresses for routing and no saved path');
        return;
      }

      setIsLoadingRoute(true);
      setRouteError(null);

      try {
        console.log('🗺️ Loading navigation route for trip:', tripDetails.trip_id);
        console.log('📍 From:', tripDetails.start_location_address);
        console.log('📍 To:', tripDetails.end_location_address);

        // Geocode start and end addresses
        const startResult = await geocodeAddress(tripDetails.start_location_address);
        const endResult = await geocodeAddress(tripDetails.end_location_address);

        if (!startResult.success || !endResult.success) {
          throw new Error('Failed to geocode addresses');
        }

        console.log('📍 Start coordinates:', startResult.coordinates);
        console.log('📍 End coordinates:', endResult.coordinates);

        // Get navigation route
        const routingResult = await getNavigationRoute(
          {
            latitude: startResult.coordinates!.latitude,
            longitude: startResult.coordinates!.longitude,
            timestamp: Date.now()
          },
          {
            latitude: endResult.coordinates!.latitude,
            longitude: endResult.coordinates!.longitude,
            timestamp: Date.now()
          }
        );

        if (routingResult.success) {
          console.log('✅ Navigation route loaded successfully');
          console.log('📊 Route stats:', {
            coordinates: routingResult.route.coordinates.length,
            distance: `${(routingResult.route.distance / 1000).toFixed(1)} km`,
            duration: `${Math.round(routingResult.route.duration / 60)} min`
          });
          setRouteData(routingResult.route.coordinates);
        } else {
          console.log('⚠️ Using fallback route due to routing error');
          setRouteData(routingResult.route.coordinates); // Still use fallback
          setRouteError(routingResult.error || 'Routing failed');
        }

      } catch (error) {
        console.error('❌ Error loading navigation route:', error);
        setRouteError(error instanceof Error ? error.message : 'Unknown error');
        
        // Fallback to simple coordinates if available
        try {
          const startResult = await geocodeAddress(tripDetails.start_location_address);
          const endResult = await geocodeAddress(tripDetails.end_location_address);
          
          if (startResult.success && endResult.success) {
            setRouteData([
              {
                latitude: startResult.coordinates!.latitude,
                longitude: startResult.coordinates!.longitude,
                timestamp: Date.now()
              },
              {
                latitude: endResult.coordinates!.latitude,
                longitude: endResult.coordinates!.longitude,
                timestamp: Date.now()
              }
            ]);
          }
        } catch (fallbackError) {
          console.error('❌ Fallback geocoding also failed:', fallbackError);
        }
      } finally {
        setIsLoadingRoute(false);
      }
    };

    loadRouteData();
  }, [tripDetails]);

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

  const styles = getStyles(screenColors);

  if (isLoadingTrips || isLoadingRoute) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
        <StatusBar 
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={screenColors.background}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={screenColors.primary} />
          <Text style={[styles.loadingText, { color: screenColors.text }]}>
            {isLoadingTrips ? 'Loading trip...' : 'Loading navigation route...'}
          </Text>
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
          <Text style={[styles.headerTitle, { color: screenColors.text }]}>Trip Map</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={screenColors.danger} />
          <Text style={[styles.errorText, { color: screenColors.danger }]}>Trip not found</Text>
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
        <Text style={[styles.headerTitle, { color: screenColors.text }]}>{tripName}</Text>
      </View>

      {/* Trip Info Card */}
      <View style={[styles.infoCard, { backgroundColor: screenColors.card }]}>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color={screenColors.primary} />
          <Text style={[styles.infoText, { color: screenColors.text }]}>
            {tripDetails.start_location_address || 'Unknown'} → {tripDetails.end_location_address || 'Unknown'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color={screenColors.primary} />
          <Text style={[styles.infoText, { color: screenColors.text }]}>
            {formatDate(tripDetails.start_time)} at {formatTime(tripDetails.start_time)}
          </Text>
        </View>

        {tripDetails.distance_km && (
          <View style={styles.infoRow}>
            <Ionicons name="map-outline" size={16} color={screenColors.primary} />
            <Text style={[styles.infoText, { color: screenColors.text }]}>
              {tripDetails.distance_km} km
            </Text>
          </View>
        )}
      </View>

             {/* Map View */}
       <View style={styles.mapContainer}>
         <WebMapView
           style={styles.map}
           showUserLocation={true}
           route={routeData}
           centerCoordinate={routeData.length > 0 ? [routeData[0].longitude, routeData[0].latitude] : undefined}
           zoomLevel={12}
           navigationMode={tripDetails.status === 'IN_PROGRESS' || tripDetails.status === 'ACTIVE'}
           followUserLocation={tripDetails.status === 'IN_PROGRESS' || tripDetails.status === 'ACTIVE'}
           showNavigationControls={true}
           onUserLocationUpdate={(location) => {
             console.log('User location updated:', location);
           }}
         />
       </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: screenColors.primary }]}
          onPress={() => showSuccessToast('common.info', 'route_export_coming_soon')}
        >
          <Ionicons name="download-outline" size={20} color={screenColors.white} />
          <Text style={[styles.actionButtonText, { color: screenColors.white }]}>
            Export Route Data
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: screenColors.secondary }]}
          onPress={() => showSuccessToast('common.info', 'route_sharing_coming_soon')}
        >
          <Ionicons name="share-outline" size={20} color={screenColors.white} />
          <Text style={[styles.actionButtonText, { color: screenColors.white }]}>
            Share Route
          </Text>
        </TouchableOpacity>
      </View>
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
    flex: 1,
  },
  infoCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: screenColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: screenColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  actionsContainer: {
    padding: 16,
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
});

export default TripMapScreen; 