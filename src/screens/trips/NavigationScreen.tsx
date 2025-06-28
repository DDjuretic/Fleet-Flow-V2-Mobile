import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import WebMapView from '../../components/Map/WebMapView';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import Colors from '../../constants/Colors';
import { LocationCoordinates } from '../../services/locationService';
import { RootStackParamList } from '../../types/navigation';
import { useGetTripsQuery } from '../../store/api/supabaseApi';
import { getNavigationRoute, NavigationRoute, formatDuration, formatDistance } from '../../services/routingService';
import { geocodeAddress, GeocodeResult } from '../../services/geocodingService';

// Definicija tipa za navigacione parametre
type NavigationScreenRouteProp = RouteProp<RootStackParamList, 'Navigation'>;

const NavigationScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<NavigationScreenRouteProp>();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  
  // Get tripId from route parameters
  const { tripId } = route.params;
  
  // Fetch trip data using RTK Query
  const { data: trips, isLoading, error } = useGetTripsQuery();
  const tripData = trips?.find(trip => trip.trip_id === tripId);
  
  const [currentLocation, setCurrentLocation] = useState(null);
  const [navigationRoute, setNavigationRoute] = useState<NavigationRoute | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [startGeocodeResult, setStartGeocodeResult] = useState<GeocodeResult | null>(null);
  const [endGeocodeResult, setEndGeocodeResult] = useState<GeocodeResult | null>(null);
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);

  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    primary: Colors.DARK.primary,
    card: Colors.DARK.card,
    textSecondary: Colors.DARK.textSecondary,
  } : {
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
    primary: Colors.LIGHT.primary,
    card: Colors.LIGHT.card,
    textSecondary: Colors.LIGHT.textSecondary,
  };



  // Show loading while fetching trip data
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={screenColors.primary} />
        <Text style={[styles.loadingText, { color: screenColors.text }]}>Loading navigation...</Text>
      </View>
    );
  }

  // Show error if trip not found
  if (error || !tripData) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <StatusBar barStyle="light-content" />
        <Ionicons name="alert-circle" size={48} color={screenColors.textSecondary} />
        <Text style={[styles.errorText, { color: screenColors.text }]}>
          {error ? 'Failed to load trip data' : 'Trip not found'}
        </Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.backButton, { backgroundColor: screenColors.primary }]}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Geocode addresses when component mounts or addresses change
  useEffect(() => {
    const geocodeAddresses = async () => {
      const startAddress = tripData.start_location_address;
      const endAddress = tripData.end_location_address;
      
      if (!startAddress || !endAddress) {
        console.log('⚠️ Missing start or end address for geocoding');
        return;
      }

      setIsGeocodingLoading(true);

      try {
        console.log('🌍 Starting geocoding for addresses:', { startAddress, endAddress });
        
        // Geocode both addresses in parallel
        const [startResult, endResult] = await Promise.all([
          geocodeAddress(startAddress),
          geocodeAddress(endAddress)
        ]);

        console.log('🌍 Geocoding results:', {
          start: startResult.success ? 'Success' : `Failed: ${startResult.error}`,
          end: endResult.success ? 'Success' : `Failed: ${endResult.error}`,
          startCoords: `${startResult.coordinates.latitude}, ${startResult.coordinates.longitude}`,
          endCoords: `${endResult.coordinates.latitude}, ${endResult.coordinates.longitude}`
        });

        setStartGeocodeResult(startResult);
        setEndGeocodeResult(endResult);
      } catch (error) {
        console.error('❌ Error during geocoding:', error);
      } finally {
        setIsGeocodingLoading(false);
      }
    };

    geocodeAddresses();
  }, [tripData.start_location_address, tripData.end_location_address]);

  // Load navigation route when geocoding results are available
  useEffect(() => {
    const loadNavigationRoute = async () => {
      if (!startGeocodeResult || !endGeocodeResult) {
        console.log('⚠️ Missing geocoding results for navigation');
        return;
      }

      const startCoords = startGeocodeResult.coordinates;
      const endCoords = endGeocodeResult.coordinates;

      setIsLoadingRoute(true);
      setRouteError(null);

      try {
        console.log('🗺️ Loading navigation route...', { startCoords, endCoords });
        const routingResponse = await getNavigationRoute(startCoords, endCoords);
        
        if (routingResponse.success) {
          setNavigationRoute(routingResponse.route);
          console.log('✅ Navigation route loaded successfully');
        } else {
          setRouteError(routingResponse.error || 'Failed to load route');
          console.log('⚠️ Using fallback route due to error:', routingResponse.error);
          setNavigationRoute(routingResponse.route); // Still use fallback route
        }
      } catch (error) {
        console.error('❌ Error loading navigation route:', error);
        setRouteError('Failed to load navigation route');
      } finally {
        setIsLoadingRoute(false);
      }
    };

    loadNavigationRoute();
  }, [startGeocodeResult, endGeocodeResult]);

  // Prepare route coordinates and center for map
  const routeCoordinates = navigationRoute?.coordinates || [];
  let centerCoordinate: [number, number] | undefined;
  
  if (routeCoordinates.length > 0) {
    const avgLng = routeCoordinates.reduce((sum, coord) => sum + coord.longitude, 0) / routeCoordinates.length;
    const avgLat = routeCoordinates.reduce((sum, coord) => sum + coord.latitude, 0) / routeCoordinates.length;
    centerCoordinate = [avgLng, avgLat];
  } else if (startGeocodeResult && endGeocodeResult) {
    // Fallback to simple center calculation
    centerCoordinate = [
      (startGeocodeResult.coordinates.longitude + endGeocodeResult.coordinates.longitude) / 2,
      (startGeocodeResult.coordinates.latitude + endGeocodeResult.coordinates.latitude) / 2
    ];
  }
  
  const destinationAddress = tripData.end_location_address || 'Destination';
  const startAddress = tripData.start_location_address || 'Start Location';

  console.log('🗺️ NavigationScreen route data:', {
    tripId,
    startAddress,
    endAddress: destinationAddress,
    startGeocodeResult: startGeocodeResult ? {
      coordinates: `${startGeocodeResult.coordinates.latitude}, ${startGeocodeResult.coordinates.longitude}`,
      success: startGeocodeResult.success
    } : null,
    endGeocodeResult: endGeocodeResult ? {
      coordinates: `${endGeocodeResult.coordinates.latitude}, ${endGeocodeResult.coordinates.longitude}`,
      success: endGeocodeResult.success
    } : null,
    routeCoordinates: routeCoordinates.length,
    navigationRoute: navigationRoute ? {
      distance: formatDistance(navigationRoute.distance),
      duration: formatDuration(navigationRoute.duration),
      steps: navigationRoute.steps.length
    } : null,
    centerCoordinate,
    isLoadingRoute,
    isGeocodingLoading,
    routeError
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <WebMapView
        route={routeCoordinates}
        centerCoordinate={centerCoordinate}
        navigationMode={true}
        followUserLocation={true}
        showUserLocation={true}
        style={styles.map}
        onUserLocationUpdate={setCurrentLocation}
        zoomLevel={13}
        mapLayer="standard"
        showLayerControls={true}
      />
      
      <View style={styles.topBar}>
        <View style={[styles.infoBox, { backgroundColor: screenColors.card }]}>
          <Text style={[styles.etaText, { color: screenColors.primary }]}>
            {isGeocodingLoading ? 'Finding location...' : isLoadingRoute ? 'Loading route...' : navigationRoute ? formatDuration(navigationRoute.duration) : '--'}
          </Text>
          <Text 
            style={[styles.destinationText, { color: screenColors.textSecondary }]} 
            numberOfLines={1}
          >
            {destinationAddress}
          </Text>
          {routeError && (
            <Text style={[styles.errorText, { color: 'orange', fontSize: 10 }]}>
              Using fallback route
            </Text>
          )}
        </View>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.closeButton, { backgroundColor: screenColors.card }]}
        >
          <Ionicons name="close" size={24} color={screenColors.text} />
        </TouchableOpacity>
      </View>

      <View style={[styles.bottomBar, { backgroundColor: screenColors.card }]}>
        <Text style={[styles.speedText, { color: screenColors.text }]}>
          -- km/h
        </Text>
        <TouchableOpacity style={styles.endTripButton}>
          <Text style={styles.endTripButtonText}>END</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="volume-medium" size={24} color={screenColors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoBox: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    flex: 1,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  etaText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 2,
  },
  destinationText: {
    fontSize: 16,
    marginTop: 2,
  },
  closeButton: {
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  speedText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  endTripButton: {
    backgroundColor: 'red',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
  },
  endTripButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NavigationScreen; 