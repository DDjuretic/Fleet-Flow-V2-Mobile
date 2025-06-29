import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import Colors from '../../constants/Colors';
import { geocodeAddress, GeocodeResult, reverseGeocode } from '../../services/geocodingService';
import { LocationCoordinates } from '../../services/locationService';
import { getNavigationRoute, formatDistance, formatDuration } from '../../services/routingService';
import { getShortDisplayName } from '../../utils/addressUtils';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';

// Types
import { DbTrip } from '../../store/api/supabaseApi';

// Weather interfaces
interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  iconUrl: string;
  isLoading: boolean;
  error: string | null;
}

interface WeatherAlert {
  message: string;
  severity: 'info' | 'warning' | 'danger';
  timestamp: Date;
}

interface ActiveTripCardProps {
  trip: DbTrip;
  onEndTrip: () => void;
  onViewTrip?: (tripId: string) => void;
  onNavigate?: (tripId: string) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ActiveTripCard({ trip, onEndTrip, onViewTrip, onNavigate }: ActiveTripCardProps) {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [startCoords, setStartCoords] = useState<[number, number]>([42.7087, 19.3744]);
  const [endCoords, setEndCoords] = useState<[number, number]>([42.7087, 19.3744]);
  const [routeCoordinates, setRouteCoordinates] = useState<LocationCoordinates[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [startGeocodedCoords, setStartGeocodedCoords] = useState<LocationCoordinates | null>(null);
  const [routeDistance, setRouteDistance] = useState<string>('');
  const [routeDuration, setRouteDuration] = useState<string>('');

  // Weather state
  const [weather, setWeather] = useState<WeatherData>({
    location: '',
    temperature: 0,
    condition: '',
    iconUrl: '',
    isLoading: true,
    error: null
  });
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<{latitude: number, longitude: number} | null>(null);

  // Animation refs for weather alerts
  const scrollX = useRef(new Animated.Value(0)).current;
  const textWidth = useRef(0);
  const containerWidth = useRef(0);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const lastWeatherFetch = useRef<number | null>(null);

  // Theme colors
  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    primary: Colors.DARK.primary,
    card: Colors.DARK.card,
    textSecondary: Colors.DARK.textSecondary,
    border: Colors.DARK.border,
  } : {
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
    primary: Colors.LIGHT.primary,
    card: Colors.LIGHT.card,
    textSecondary: Colors.LIGHT.textSecondary,
    border: Colors.LIGHT.border,
  };

  // Debug theme
  console.log('🎨 ActiveTripCard theme mode:', themeMode);
  console.log('🎨 ActiveTripCard screenColors.background:', screenColors.background);
  console.log('🎨 ActiveTripCard screenColors.card:', screenColors.card);

  const vehicleName = trip.vehicles ? `${trip.vehicles.make} ${trip.vehicles.model}` : 'Unknown Vehicle';
  const startLocation = trip.start_location_address || 'Unknown Start';
  const endLocation = trip.end_location_address || 'Unknown Destination';
  const startLocationDisplay = getShortDisplayName(startLocation);
  const endLocationDisplay = getShortDisplayName(endLocation);
  const purpose = trip.purpose_description || 'Trip';

  // Weather API functions
  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    // Debounce logic to prevent too frequent calls
    const now = Date.now();
    if (lastWeatherFetch.current && now - lastWeatherFetch.current < 600000) { // 10 minutes debounce
      console.log('Skipping weather fetch - less than 10 minutes since last fetch');
      return;
    }
    
    lastWeatherFetch.current = now;
    
    try {
      // OpenWeatherMap API key
      const apiKey = '2547a3b49c3a078a2821ac9c30a53f4e';
      
      // API URL formation
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      
      console.log('Calling weather forecast with URL:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      console.log('API status code:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error:', errorText);
        throw new Error(`Weather forecast error: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Weather data:', data);
      
      setWeather({
        location: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Detailed error:', error);
      
      // Temporary state while API key is not activated
      setWeather({
        location: 'Loading...',
        temperature: 0,
        condition: 'Not available',
        iconUrl: '',
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }, []);

  // Get current location
  const fetchCurrentLocation = async () => {
    // Prioritize using start location coordinates for weather
    if (startCoords && startCoords[0] !== 42.7087 && startCoords[1] !== 19.3744) {
      console.log('Using start location coordinates for weather:', startCoords);
      setCurrentLocation(prev => {
        if (prev && prev.latitude === startCoords[0] && prev.longitude === startCoords[1]) {
          return prev;
        }
        return { latitude: startCoords[0], longitude: startCoords[1] };
      });
      fetchWeather(startCoords[0], startCoords[1]);
      return;
    }

    try {
      console.log("Getting current location for Active Trip card...");
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Location permission not granted - using default Podgorica coordinates");
        setCurrentLocation(prev => {
          if (prev && prev.latitude === 42.4307 && prev.longitude === 19.2478) {
            return prev;
          }
          return { latitude: 42.4307, longitude: 19.2478 };
        });
        fetchWeather(42.4307, 19.2478);
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const coords: LocationCoordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: Date.now(),
      };
      
      // Check if we're on emulator (Google HQ coordinates)
      const isEmulator = Math.abs(coords.latitude - 37.4219983) < 0.001 && 
                        Math.abs(coords.longitude - (-122.084)) < 0.001;
      
      if (isEmulator) {
        console.log('🧪 Detected emulator, using Podgorica coordinates');
        coords.latitude = 42.4502;
        coords.longitude = 19.2728;
      }
      
      console.log('GPS Location obtained:', coords.latitude, coords.longitude);
      setCurrentLocation(prev => {
        if (prev && prev.latitude === coords.latitude && prev.longitude === coords.longitude) {
          return prev;
        }
        return { latitude: coords.latitude, longitude: coords.longitude };
      });
      
      // Get location name using reverse geocoding
      try {
        const reverseResult = await reverseGeocode({
          latitude: coords.latitude,
          longitude: coords.longitude,
          timestamp: Date.now()
        });
        
        if (reverseResult.success) {
          console.log('Reverse geocoding successful:', reverseResult.displayName);
        }
      } catch (error) {
        console.log('Reverse geocoding error:', error);
      }
      
      // Use start coordinates for weather if available, otherwise fallback to GPS
      if (startCoords && startCoords[0] !== 42.7087 && startCoords[1] !== 19.3744) {
        console.log('Using start coordinates for weather instead of GPS');
        fetchWeather(startCoords[0], startCoords[1]);
      } else {
        console.log('Using GPS coordinates for weather');
        fetchWeather(coords.latitude, coords.longitude);
      }
    } catch (error) {
      console.log("Error getting location:", error);
      
      // Use default Podgorica coordinates
      setCurrentLocation(prev => {
        if (prev && prev.latitude === 42.4307 && prev.longitude === 19.2478) {
          return prev;
        }
        return { latitude: 42.4307, longitude: 19.2478 };
      });
      fetchWeather(42.4307, 19.2478);
    }
  };

  // Generate AI weather alerts
  const generateWeatherAlerts = () => {
    const alerts: WeatherAlert[] = [];
    const temp = weather.temperature;
    const condition = weather.condition.toLowerCase();
    
    if (temp < 0) {
      alerts.push({
        message: t('weather.alerts.freezing', { temp: Math.round(temp) }),
        severity: 'danger',
        timestamp: new Date()
      });
    } else if (temp < 4) {
      alerts.push({
        message: t('weather.alerts.low', { temp: Math.round(temp) }),
        severity: 'warning',
        timestamp: new Date()
      });
    } else if (temp > 35) {
      alerts.push({
        message: t('weather.alerts.high', { temp: Math.round(temp) }),
        severity: 'warning',
        timestamp: new Date()
      });
    }
    
    // Weather condition based alerts
    if (condition.includes('rain') || condition.includes('drizzle')) {
      alerts.push({
        message: t('weather.alerts.rain'),
        severity: 'warning',
        timestamp: new Date()
      });
    } else if (condition.includes('snow')) {
      alerts.push({
        message: t('weather.alerts.snow'),
        severity: 'danger',
        timestamp: new Date()
      });
    } else if (condition.includes('thunderstorm')) {
      alerts.push({
        message: t('weather.alerts.thunderstorm'),
        severity: 'danger',
        timestamp: new Date()
      });
    } else if (condition.includes('fog') || condition.includes('mist')) {
      alerts.push({
        message: t('weather.alerts.fog'),
        severity: 'warning',
        timestamp: new Date()
      });
    } else if (condition.includes('haze') || condition.includes('smoke')) {
      alerts.push({
        message: t('weather.alerts.visibility'),
        severity: 'warning',
        timestamp: new Date()
      });
    }
    
    // Only show important alerts (warning or danger), skip info/clear weather
    setWeatherAlerts(alerts);
  };

     // Get alert background color based on severity and theme
   const getAlertBackgroundColor = (severity: 'info' | 'warning' | 'danger') => {
     const isDark = themeMode === 'dark';
     switch (severity) {
       case 'danger':
         return isDark ? 'rgba(255, 69, 58, 0.3)' : 'rgba(255, 69, 58, 0.15)'; // Red for danger
       case 'warning':
         return isDark ? 'rgba(255, 204, 0, 0.3)' : 'rgba(255, 204, 0, 0.15)'; // Yellow for warning
       case 'info':
       default:
         return isDark ? 'rgba(10, 132, 255, 0.3)' : 'rgba(10, 132, 255, 0.15)'; // Blue for info
     }
   };

  // Text animation functions
  const startTextAnimation = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    
    scrollX.setValue(containerWidth.current + 100);
    
    if (textWidth.current < containerWidth.current * 1.5) {
      scrollX.setValue((containerWidth.current - textWidth.current) / 2);
      return;
    }
    
    animationRef.current = Animated.timing(scrollX, {
      toValue: -textWidth.current - 200,
      duration: 45000,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    
    animationRef.current.start(({ finished }) => {
      if (finished) {
        setTimeout(() => {
          startTextAnimation();
        }, 3000);
      }
    });
  };

  const onTextLayout = (e: any) => {
    const width = e.nativeEvent.layout.width;
    console.log('Text width:', width);
    
    if (Math.abs(textWidth.current - width) > 5) {
      textWidth.current = width;
      
      if (textWidth.current > containerWidth.current * 1.5 && weatherAlerts.length > 0) {
        setTimeout(() => {
          startTextAnimation();
        }, 500);
      } else {
        scrollX.setValue((containerWidth.current - textWidth.current) / 2);
      }
    }
  };

  const onContainerLayout = (e: any) => {
    const width = e.nativeEvent.layout.width;
    console.log('Container width:', width);
    
    if (Math.abs(containerWidth.current - width) > 5) {
      containerWidth.current = width;
    }
  };

  // Geocode addresses and get navigation route
  useEffect(() => {
    const geocodeAndRoute = async () => {
      try {
        setIsLoadingRoute(true);
        let startResult = null;
        let endResult = null;

        if (startLocation && startLocation !== 'Unknown Start') {
          startResult = await geocodeAddress(startLocation);
          if (startResult.success) {
            setStartCoords([startResult.coordinates.latitude, startResult.coordinates.longitude]);
            setStartGeocodedCoords(startResult.coordinates);
            console.log('🗺️ ActiveTripCard start geocoded:', startResult.coordinates);
          }
        }

        if (endLocation && endLocation !== 'Unknown Destination') {
          endResult = await geocodeAddress(endLocation);
          if (endResult.success) {
            setEndCoords([endResult.coordinates.latitude, endResult.coordinates.longitude]);
            console.log('🗺️ ActiveTripCard end geocoded:', endResult.coordinates);
          }
        }

        // Get navigation route if both coordinates are available
        if (startResult?.success && endResult?.success) {
          console.log('🗺️ Fetching navigation route for ActiveTripCard...');
          
          const routingResult = await getNavigationRoute(
            {
              latitude: startResult.coordinates.latitude,
              longitude: startResult.coordinates.longitude,
              timestamp: Date.now()
            },
            {
              latitude: endResult.coordinates.latitude,
              longitude: endResult.coordinates.longitude,
              timestamp: Date.now()
            }
          );

          if (routingResult.success && routingResult.route.coordinates.length > 2) {
            // Convert to LocationCoordinates format
            const leafletCoords: LocationCoordinates[] = routingResult.route.coordinates.map(coord => ({
              latitude: coord.latitude,
              longitude: coord.longitude,
              timestamp: Date.now()
            }));
            setRouteCoordinates(leafletCoords);
            
            // Set route distance and duration
            setRouteDistance(formatDistance(routingResult.route.distance));
            setRouteDuration(formatDuration(routingResult.route.duration));
            
            console.log('✅ Route loaded successfully:', {
              coordinatesCount: leafletCoords.length,
              distance: routingResult.route.distance,
              duration: routingResult.route.duration
            });
          } else {
            console.log('⚠️ Using fallback straight line route');
            // Fallback to straight line
            setRouteCoordinates([
              { 
                latitude: startResult.coordinates.latitude, 
                longitude: startResult.coordinates.longitude,
                timestamp: Date.now()
              },
              { 
                latitude: endResult.coordinates.latitude, 
                longitude: endResult.coordinates.longitude,
                timestamp: Date.now()
              }
            ]);
            setRouteDistance('~8.1 km'); // Approximate distance for fallback
            setRouteDuration('~44m'); // Approximate duration for fallback
          }
        }
      } catch (error) {
        console.error('🗺️ ActiveTripCard geocoding/routing error:', error);
      } finally {
        setIsLoadingRoute(false);
      }
    };

    geocodeAndRoute();
  }, [startLocation, endLocation]);

  // 🚀 OPTIMIZACIJA: Kombinujem weather i location logiku u jedan useEffect
  useEffect(() => {
    let weatherInterval: ReturnType<typeof setInterval> | null = null;
    let alertInterval: ReturnType<typeof setInterval> | null = null;
    
    const initializeLocationAndWeather = async () => {
      // Fetch current location initially
      await fetchCurrentLocation();
      
      // Fetch weather if coordinates are available
      if (startCoords && startCoords[0] !== 42.7087 && startCoords[1] !== 19.3744) {
        fetchWeather(startCoords[0], startCoords[1]);
        
        // Set up weather updates every 15 minutes (umesto 10)
        weatherInterval = setInterval(() => {
          fetchWeather(startCoords[0], startCoords[1]);
        }, 900000); // 15 minuta
      } else if (currentLocation) {
        fetchWeather(currentLocation.latitude, currentLocation.longitude);
        
        weatherInterval = setInterval(() => {
          fetchWeather(currentLocation.latitude, currentLocation.longitude);
        }, 900000); // 15 minuta
      }
    };

    initializeLocationAndWeather();
    
    return () => {
      if (weatherInterval) clearInterval(weatherInterval);
      if (alertInterval) clearInterval(alertInterval);
    };
  }, [startCoords, currentLocation]); // Kombinujem dependency

  // 🚀 OPTIMIZACIJA: Kombinujem weather alerts i animation logiku
  useEffect(() => {
    let alertRotationInterval: ReturnType<typeof setInterval>;
    let animationTimer: ReturnType<typeof setTimeout>;
    
    // Generate weather alerts
    if (!weather.isLoading && !weather.error) {
      generateWeatherAlerts();
    }
    
    // Setup alert rotation (povećano na 10 minuta)
    if (weatherAlerts.length > 0) {
      alertRotationInterval = setInterval(() => {
        setCurrentAlertIndex((prevIndex) => (prevIndex + 1) % weatherAlerts.length);
      }, 600000); // 10 minuta umesto 5
      
      // Setup text animation
      if (animationRef.current) {
        animationRef.current.stop();
      }
      
      scrollX.setValue(containerWidth.current);
      
      animationTimer = setTimeout(() => {
        if (textWidth.current > 0 && containerWidth.current > 0) {
          if (textWidth.current > containerWidth.current * 1.5) {
            startTextAnimation();
          } else {
            scrollX.setValue((containerWidth.current - textWidth.current) / 2);
          }
        }
      }, 700);
    }
    
    return () => {
      if (alertRotationInterval) clearInterval(alertRotationInterval);
      if (animationTimer) clearTimeout(animationTimer);
    };
  }, [weather, weatherAlerts.length, currentAlertIndex]); // Optimizovani dependency

  // Calculate trip duration
  const startTime = new Date(trip.start_time);
  const now = new Date();
  const durationMs = now.getTime() - startTime.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const duration = `${hours}h ${minutes}m`;

  const handleEndTrip = () => {
    Alert.alert(
      'End Trip',
      `Are you sure you want to end the trip "${purpose}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End Trip', 
          style: 'destructive',
          onPress: onEndTrip 
        }
      ]
    );
  };

  // Generate simple map HTML
  const mapHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Route Map</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; background-color: #f0f0f0; }
        .route-line { color: ${screenColors.primary}; weight: 6; opacity: 0.8; }
        .start-marker { 
          background-color: #4CAF50; 
          color: white; 
          border: 2px solid white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 26px;
          font-weight: bold;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        .end-marker { 
          background-color: #F44336; 
          color: white; 
          border: 2px solid white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 26px;
          font-weight: bold;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        try {
          // Initialize map
          const map = L.map('map').setView([42.4502, 19.2728], 12);
          
          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map);
          
          // Route coordinates
           const routeCoords = [${routeCoordinates.map(coord => `[${coord.latitude}, ${coord.longitude}]`).join(',')}];
           
           if (routeCoords.length > 1) {
             // Draw route line
             const routeLine = L.polyline(routeCoords, {
               color: '${screenColors.primary}',
               weight: 6,
               opacity: 0.8
             }).addTo(map);
             
             // Start marker
             L.marker(routeCoords[0], {
               icon: L.divIcon({
                 className: 'start-marker',
                 html: 'S',
                 iconSize: [30, 30],
                 iconAnchor: [15, 15]
               })
             }).addTo(map).bindPopup('Start: ${getShortDisplayName(trip.start_location_address || '')}');
             
             // End marker
             L.marker(routeCoords[routeCoords.length - 1], {
               icon: L.divIcon({
                 className: 'end-marker',
                 html: 'E',
                 iconSize: [30, 30],
                 iconAnchor: [15, 15]
               })
             }).addTo(map).bindPopup('End: ${getShortDisplayName(trip.end_location_address || '')}');
             
             // Fit map to route
             map.fitBounds(routeLine.getBounds(), { padding: [20, 20] });
           } else if (routeCoords.length === 1) {
             // Single point - just show marker
             L.marker(routeCoords[0], {
               icon: L.divIcon({
                 className: 'start-marker',
                 html: 'S',
                 iconSize: [30, 30],
                 iconAnchor: [15, 15]
               })
             }).addTo(map).bindPopup('Location');
             map.setView(routeCoords[0], 14);
           } else {
             // No coordinates - fallback to Podgorica center
             console.log('No route coordinates, centering on Podgorica');
             map.setView([42.4502, 19.2728], 12);
             
             // Add fallback markers if we have geocoded coordinates
             if (${startGeocodedCoords ? `[${startGeocodedCoords.latitude}, ${startGeocodedCoords.longitude}]` : 'null'}) {
               L.marker([${startGeocodedCoords ? startGeocodedCoords.latitude : 42.4307}, ${startGeocodedCoords ? startGeocodedCoords.longitude : 19.2478}], {
                 icon: L.divIcon({
                   className: 'start-marker',
                   html: 'S',
                   iconSize: [30, 30],
                   iconAnchor: [15, 15]
                 })
               }).addTo(map).bindPopup('H.Office');
               
               L.marker([42.4697, 19.3047], {
                 icon: L.divIcon({
                   className: 'end-marker',
                   html: 'E',
                   iconSize: [30, 30],
                   iconAnchor: [15, 15]
                 })
               }).addTo(map).bindPopup('Studio Mouse');
             }
           }
          
          // Notify React Native that map is ready
          window.ReactNativeWebView?.postMessage('mapReady');
          
        } catch (error) {
          console.error('Map initialization error:', error);
          window.ReactNativeWebView?.postMessage('mapError');
        }
      </script>
    </body>
    </html>
  `;

  // Debug log za koordinate
  console.log('🗺️ ActiveTripCard Coordinates Debug:', {
    startGeocodedCoords: startGeocodedCoords ? `${startGeocodedCoords.latitude}, ${startGeocodedCoords.longitude}` : null,
    currentLocation: currentLocation ? `${currentLocation.latitude}, ${currentLocation.longitude}` : null,
    routeCoordinates_count: routeCoordinates.length,
    routeDistance,
    routeDuration
  });

  return (
    <View style={[styles.container, { backgroundColor: screenColors.card }]}>
      {/* Trip Header */}
      <View style={[styles.header, { backgroundColor: screenColors.card, borderBottomColor: screenColors.border }]}>
        <View style={styles.headerLeft}>
          <View style={styles.titleRow}>
            <Text style={[styles.tripTitle, { color: screenColors.text }]}>{purpose}</Text>
            <View style={styles.timeDistanceContainer}>
              <Text style={[styles.durationText, { color: screenColors.textSecondary }]}>{duration}</Text>
              {routeDistance && (
                <Text style={[styles.distanceText, { color: screenColors.textSecondary }]}>• {routeDistance}</Text>
              )}
            </View>
          </View>
          <Text style={[styles.vehicleName, { color: screenColors.textSecondary }]}>{vehicleName}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={screenColors.textSecondary} />
            <Text style={[styles.locationText, { color: screenColors.textSecondary }]} numberOfLines={1}>
              {startLocationDisplay} → {endLocationDisplay}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.statusBadge, { backgroundColor: screenColors.primary }]}>
            <Text style={[styles.statusText, { color: Colors.WHITE }]}>Active</Text>
          </View>
        </View>
      </View>

      {/* Weather Container - only show when there are important alerts */}
      {weatherAlerts.length > 0 && (
        <View style={[styles.weatherContainer, { 
          backgroundColor: themeMode === 'dark' ? 'rgba(28, 34, 55, 0.7)' : 'rgba(245, 245, 245, 0.9)', 
          borderColor: screenColors.border 
        }]}>
          {weather.isLoading ? (
            <ActivityIndicator size="small" color={screenColors.primary} />
          ) : (
            <>
              <View style={styles.weatherHeader}>
                <View style={styles.weatherLocationContainer}>
                  <Ionicons name="warning" size={18} color={screenColors.textSecondary} />
                  <Text style={[styles.weatherLocation, { color: screenColors.text }]}>
                    {t('weather.alert_title')} - {weather.location}
                  </Text>
                </View>
                
                <View style={styles.weatherInfoContainer}>
                  {weather.iconUrl ? (
                    <Image 
                      source={{ uri: weather.iconUrl }} 
                      style={styles.weatherIcon} 
                    />
                  ) : null}
                  <Text style={[styles.weatherTemperature, { color: screenColors.text }]}>
                    {weather.temperature}°C
                  </Text>
                  <Text style={[styles.weatherCondition, { color: screenColors.textSecondary }]}>{weather.condition}</Text>
                </View>
              </View>
              
              {/* Weather Alerts with Animation */}
              <View 
                style={[
                  styles.integratedAlertContainer, 
                  { 
                    backgroundColor: getAlertBackgroundColor(weatherAlerts[currentAlertIndex].severity),
                    borderColor: screenColors.border
                  }
                ]}
                onLayout={onContainerLayout}
              >
                <Ionicons 
                  name={
                    weatherAlerts[currentAlertIndex].severity === 'danger' ? 'warning' : 
                    weatherAlerts[currentAlertIndex].severity === 'warning' ? 'alert-circle' : 'information-circle'
                  } 
                  size={16} 
                  color={
                    weatherAlerts[currentAlertIndex].severity === 'danger' ? '#FF453A' : 
                    weatherAlerts[currentAlertIndex].severity === 'warning' ? '#FFCC00' : '#0A84FF'
                  } 
                  style={styles.alertIcon}
                />
                
                <View style={styles.alertTextContainer}>
                  <Animated.View 
                    style={[
                      styles.animatedTextContainer,
                      {
                        transform: [{ translateX: scrollX }],
                        width: 'auto'
                      }
                    ]}
                  >
                    <Text 
                      style={[styles.alertText, { 
                        color: themeMode === 'dark' ? '#FFFFFF' : '#333333'
                      }]}
                      onLayout={onTextLayout}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {weatherAlerts[currentAlertIndex].message}
                    </Text>
                  </Animated.View>
                </View>
              </View>
            </>
          )}
        </View>
      )}

      {/* Map Container */}
      <View style={[styles.mapContainer, { backgroundColor: screenColors.background }]}>
        {isLoadingRoute && (
          <View style={[styles.mapLoadingOverlay, { backgroundColor: screenColors.background }]}>
            <ActivityIndicator size="large" color={screenColors.primary} />
            <Text style={[styles.loadingText, { color: screenColors.text }]}>Loading route...</Text>
          </View>
        )}
        <WebView
          source={{ html: mapHTML }}
          style={styles.map}
          onMessage={(event) => {
            if (event.nativeEvent.data === 'mapReady') {
              setIsMapLoaded(true);
            } else if (event.nativeEvent.data === 'mapError') {
              console.error('Map error:', event.nativeEvent.data);
            }
          }}
        />
      </View>

      {/* Action Buttons */}
      <View style={[styles.actionButtons, { borderTopColor: screenColors.border }]}>
                 <TouchableOpacity 
           style={[styles.button, styles.viewButton, { backgroundColor: screenColors.primary }]}
           onPress={() => onViewTrip?.(trip.trip_id)}
         >
           <Ionicons name="eye-outline" size={18} color={Colors.WHITE} />
           <Text style={[styles.buttonText, { color: Colors.WHITE }]}>{t('common.view')}</Text>
         </TouchableOpacity>

         <TouchableOpacity 
           style={[styles.button, styles.navigateButton, { backgroundColor: screenColors.primary }]}
           onPress={() => onNavigate?.(trip.trip_id)}
         >
           <Ionicons name="navigate-outline" size={18} color={Colors.WHITE} />
           <Text style={[styles.buttonText, { color: Colors.WHITE }]}>Navigate</Text>
         </TouchableOpacity>

         <TouchableOpacity 
           style={[styles.button, styles.endTripButton, { backgroundColor: Colors.DANGER }]}
           onPress={handleEndTrip}
         >
           <Ionicons name="stop-circle-outline" size={18} color={Colors.WHITE} />
           <Text style={[styles.buttonText, { color: Colors.WHITE }]}>End Trip</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  vehicleName: {
    fontSize: 14,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 2,
  },
  locationText: {
    fontSize: 14,
    marginLeft: 4,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  durationText: {
    fontSize: 14,
  },
     weatherContainer: {
     padding: 16,
     borderWidth: 1,
     borderRadius: 8,
     marginBottom: 12,
   },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weatherLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
     weatherLocation: {
     fontSize: 16,
     fontWeight: 'bold',
     marginLeft: 8,
   },
  weatherInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
     weatherTemperature: {
     fontSize: 18,
     fontWeight: 'bold',
   },
   weatherCondition: {
     fontSize: 14,
   },
  integratedAlertContainer: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    marginRight: 12,
  },
  alertTextContainer: {
    flex: 1,
  },
  animatedTextContainer: {
    width: '100%',
  },
     alertText: {
     fontSize: 14,
     lineHeight: 20,
   },
  mapContainer: {
    flex: 1,
  },
  mapLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
  },
  map: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  viewButton: {
    flex: 1,
  },
  navigateButton: {
    flex: 1,
  },
  endTripButton: {
    flex: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  timeDistanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 14,
    marginLeft: 4,
  },
}); 