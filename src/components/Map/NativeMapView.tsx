import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT, Polyline, Marker, Region } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import Colors from '../../constants/Colors';

interface NativeMapViewProps {
  style?: any;
  currentLocation?: { latitude: number; longitude: number };
  routeCoordinates?: Array<{ latitude: number; longitude: number }>;
  heatMapSegments?: Array<{ points: Array<{ latitude: number; longitude: number }>; color: string }>;
  showUserLocation?: boolean;
  followUserLocation?: boolean;
  height?: number;
}

const NativeMapView: React.FC<NativeMapViewProps> = ({
  style,
  currentLocation,
  routeCoordinates = [],
  heatMapSegments = [],
  showUserLocation = true,
  followUserLocation = false,
  height,
}) => {
  const { themeMode } = useSelector((state: RootState) => state.theme);
  const mapRef = useRef<MapView>(null);

  const screenColors = themeMode === 'dark' ? {
    primary: Colors.DARK.primary,
    background: Colors.DARK.background,
    text: Colors.DARK.text,
  } : {
    primary: Colors.LIGHT.primary,
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
  };

  // Default region (Podgorica, Montenegro)
  const defaultRegion: Region = {
    latitude: 42.4307,
    longitude: 19.2478,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Calculate region based on current location or route
  const getRegion = (): Region => {
    if (currentLocation) {
      return {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    if (routeCoordinates.length > 0) {
      const firstPoint = routeCoordinates[0];
      return {
        latitude: firstPoint.latitude,
        longitude: firstPoint.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    return defaultRegion;
  };

  const region = getRegion();

  // Fit to route bounds if route exists
  useEffect(() => {
    if (routeCoordinates.length > 1 && mapRef.current) {
      // Calculate bounds for the entire route
      let minLat = Math.min(...routeCoordinates.map(p => p.latitude));
      let maxLat = Math.max(...routeCoordinates.map(p => p.latitude));
      let minLng = Math.min(...routeCoordinates.map(p => p.longitude));
      let maxLng = Math.max(...routeCoordinates.map(p => p.longitude));

      // Add some padding
      const latPadding = (maxLat - minLat) * 0.1;
      const lngPadding = (maxLng - minLng) * 0.1;

      const bounds = {
        northEast: {
          latitude: maxLat + latPadding,
          longitude: maxLng + lngPadding,
        },
        southWest: {
          latitude: minLat - latPadding,
          longitude: minLng - lngPadding,
        },
      };

      mapRef.current.fitToCoordinates(
        [
          bounds.northEast,
          bounds.southWest,
        ],
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        }
      );
    }
  }, [routeCoordinates]);

  return (
    <View style={[styles.container, style, height ? { height } : styles.fullHeight]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
        showsUserLocation={showUserLocation}
        followsUserLocation={followUserLocation}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        initialRegion={region}
        region={followUserLocation ? undefined : region}
      >
        {/* Heat Map Segments */}
        {heatMapSegments.map((segment, index) => (
          <Polyline
            key={`heatmap-${index}`}
            coordinates={segment.points}
            strokeColor={segment.color}
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
          />
        ))}

        {/* Regular Route Polyline (fallback when no heat map) */}
        {routeCoordinates.length > 1 && heatMapSegments.length === 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={screenColors.primary}
            strokeWidth={4}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* Start Marker */}
        {routeCoordinates.length > 0 && (
          <Marker
            coordinate={routeCoordinates[0]}
            title="Start"
            pinColor="green"
          />
        )}

        {/* Current Location Marker */}
        {currentLocation && routeCoordinates.length === 0 && (
          <Marker
            coordinate={currentLocation}
            title="Current Location"
            pinColor="blue"
          />
        )}

        {/* End Marker */}
        {routeCoordinates.length > 1 && (
          <Marker
            coordinate={routeCoordinates[routeCoordinates.length - 1]}
            title="End"
            pinColor="red"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  fullHeight: {
    height: Dimensions.get('window').height * 0.6, // 60% of screen height
  },
  map: {
    flex: 1,
  },
});

export default NativeMapView;
