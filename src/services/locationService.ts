import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

export interface TripRoute {
  tripId: string;
  coordinates: LocationCoordinates[];
  startTime: number;
  endTime?: number;
  totalDistance?: number;
}

class LocationService {
  private watchSubscription: Location.LocationSubscription | null = null;
  private currentTrip: TripRoute | null = null;
  private isTracking = false;

  // Request location permissions
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (foregroundStatus !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Fleet Flow needs location access to track your trips and show your position on the map.',
          [{ text: 'OK' }]
        );
        return false;
      }

      // Request background permissions for trip tracking
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      
      if (backgroundStatus !== 'granted') {
        Alert.alert(
          'Background Location',
          'For accurate trip tracking, please allow location access "Always" in your device settings.',
          [{ text: 'OK' }]
        );
      }

      return true;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  // Get current location
  async getCurrentLocation(): Promise<LocationCoordinates | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude || undefined,
        accuracy: location.coords.accuracy || undefined,
        heading: location.coords.heading || undefined,
        speed: location.coords.speed || undefined,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  // Start tracking trip
  async startTripTracking(tripId: string): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return false;

      if (this.isTracking) {
        console.warn('Trip tracking already in progress');
        return false;
      }

      // Initialize new trip
      this.currentTrip = {
        tripId,
        coordinates: [],
        startTime: Date.now(),
      };

      // Start watching location
      this.watchSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // 5 seconds
          distanceInterval: 5, // 5 meters
        },
        (location) => {
          this.onLocationUpdate(location);
        }
      );

      this.isTracking = true;
      console.log(`Started tracking trip: ${tripId}`);
      return true;
    } catch (error) {
      console.error('Error starting trip tracking:', error);
      return false;
    }
  }

  // Stop tracking trip
  async stopTripTracking(): Promise<TripRoute | null> {
    try {
      if (!this.isTracking || !this.currentTrip) {
        console.warn('No trip tracking in progress');
        return null;
      }

      // Stop watching location
      if (this.watchSubscription) {
        this.watchSubscription.remove();
        this.watchSubscription = null;
      }

      // Finalize trip
      this.currentTrip.endTime = Date.now();
      this.currentTrip.totalDistance = this.calculateTotalDistance(this.currentTrip.coordinates);

      const completedTrip = { ...this.currentTrip };
      
      // Reset tracking state
      this.currentTrip = null;
      this.isTracking = false;

      console.log(`Stopped tracking trip: ${completedTrip.tripId}`);
      return completedTrip;
    } catch (error) {
      console.error('Error stopping trip tracking:', error);
      return null;
    }
  }

  // Handle location updates during tracking
  private onLocationUpdate(location: Location.LocationObject) {
    if (!this.currentTrip) return;

    const coordinate: LocationCoordinates = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      altitude: location.coords.altitude || undefined,
      accuracy: location.coords.accuracy || undefined,
      heading: location.coords.heading || undefined,
      speed: location.coords.speed || undefined,
      timestamp: location.timestamp,
    };

    this.currentTrip.coordinates.push(coordinate);
    
    // Emit event for real-time updates (you can add event emitter here)
    console.log(`Location update: ${coordinate.latitude}, ${coordinate.longitude}`);
  }

  // Calculate distance between two coordinates (Haversine formula)
  private calculateDistance(coord1: LocationCoordinates, coord2: LocationCoordinates): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(coord2.latitude - coord1.latitude);
    const dLon = this.toRadians(coord2.longitude - coord1.longitude);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.latitude)) * Math.cos(this.toRadians(coord2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  // Calculate total distance for a route
  private calculateTotalDistance(coordinates: LocationCoordinates[]): number {
    if (coordinates.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < coordinates.length; i++) {
      totalDistance += this.calculateDistance(coordinates[i - 1], coordinates[i]);
    }
    
    return totalDistance;
  }

  // Convert degrees to radians
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Get current tracking status
  getTrackingStatus(): { isTracking: boolean; tripId?: string; coordinatesCount?: number } {
    return {
      isTracking: this.isTracking,
      tripId: this.currentTrip?.tripId,
      coordinatesCount: this.currentTrip?.coordinates.length || 0,
    };
  }

  // Get current trip data
  getCurrentTrip(): TripRoute | null {
    return this.currentTrip;
  }
}

// Export singleton instance
export const locationService = new LocationService();
export default locationService; 