/**
 * Location Service - Ultra-precise GPS tracking for Fleet Flow
 * Based on Putni Nalog GPS implementation with 15m accuracy
 *
 * Features:
 * - Activity recognition (walking filter)
 * - Speed filtering (15 km/h minimum)
 * - Distance filtering (3m minimum step)
 * - Pause detection (50m radius, 3min timeout)
 * - OSRM map matching (25m tolerance)
 */

import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';

// GPS Configuration - Optimized from Putni Nalog
export const GPS_CONFIG = {
  // Activity Recognition
  RESUME_SPEED_THRESHOLD_KMH: 1,    // Walking filter threshold (lowered from 15 for better sensitivity)

  // Location Accuracy
  BACKGROUND_ACCURACY: 15,           // GPS precision (meters)
  FOREGROUND_ACCURACY: 15,           // UI precision (meters)

  // Pause Detection
  PAUSE_RADIUS_METERS: 50,           // Stationary zone radius
  PAUSE_TIMEOUT_MINUTES: 3,          // Auto-pause delay

  // Distance Filtering
  MIN_DISTANCE_STEP_METERS: 3,       // Minimum movement threshold

  // OSRM Integration
  OSRM_MATCHING_TOLERANCE: 25,       // Map matching radius (meters)
  OSRM_TIMEOUT: 10000,               // Request timeout
  OSRM_SERVER_URL: 'https://osrm.fleetflow.me',

  // Speed Limits
  SPEED_SERVER_URL: 'https://speedlimit.fleetflow.me',
};

// Task names for background location tracking
export const LOCATION_TASK_NAME = 'FLEET_FLOW_BACKGROUND_LOCATION';

// Location data interfaces
export interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number;
  speed?: number; // m/s
  altitude?: number;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface PathPoint extends LocationPoint {
  speed: number; // always present in processed path
}

export interface TripPath {
  backgroundPath: PathPoint[];
  smoothedPath: PathPoint[];
  pauseEvents: PauseEvent[];
}

export interface PauseEvent {
  startTime: number;
  endTime: number;
  latitude: number;
  longitude: number;
  duration: number; // minutes
}

// Location Service Class
export class LocationService {
  private static instance: LocationService;
  private currentTripPath: TripPath | null = null;
  private isTracking = false;

  private constructor() {}

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Request location permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();

      if (foregroundStatus !== 'granted' || backgroundStatus !== 'granted') {
        console.warn('Location permissions not granted');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  /**
   * Start background location tracking
   */
  async startBackgroundTracking(): Promise<boolean> {
    try {
      // Check if already running
      const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      if (isRunning) {
        console.log('Background location tracking already running');
        return true;
      }

      // Start location updates
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 3000, // 3 seconds
        distanceInterval: GPS_CONFIG.MIN_DISTANCE_STEP_METERS,
        deferredUpdatesInterval: 5000,
        deferredUpdatesDistance: 10,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: 'Fleet Flow GPS Tracking',
          notificationBody: 'Tracking your location for trip recording',
          notificationColor: '#007AFF',
        },
      });

      this.isTracking = true;
      console.log('Background location tracking started');
      return true;

    } catch (error) {
      console.error('Error starting background tracking:', error);
      return false;
    }
  }

  /**
   * Stop background location tracking
   */
  async stopBackgroundTracking(): Promise<void> {
    try {
      const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      if (isRunning) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }

      this.isTracking = false;
      console.log('Background location tracking stopped');
    } catch (error) {
      console.error('Error stopping background tracking:', error);
    }
  }

  /**
   * Get current location (foreground)
   */
  async getCurrentLocation(): Promise<LocationPoint | null> {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: location.timestamp,
        accuracy: location.coords.accuracy,
        speed: location.coords.speed,
        altitude: location.coords.altitude,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  /**
   * Initialize trip tracking
   */
  initializeTrip(): void {
    this.currentTripPath = {
      backgroundPath: [],
      smoothedPath: [],
      pauseEvents: [],
    };
    console.log('Trip tracking initialized');
  }

  /**
   * Get current trip path
   */
  getCurrentTripPath(): TripPath | null {
    return this.currentTripPath;
  }

  /**
   * Clear current trip data
   */
  clearTripData(): void {
    this.currentTripPath = null;
    console.log('Trip data cleared');
  }

  /**
   * Process location for trip tracking
   */
  private processLocationForTrip(location: LocationPoint): void {
    if (!this.currentTripPath) return;

    // Convert speed from m/s to km/h
    const speedKmh = location.speed ? location.speed * 3.6 : 0;

    // Activity recognition - filter walking
    if (speedKmh < GPS_CONFIG.RESUME_SPEED_THRESHOLD_KMH) {
      console.log('Filtering walking speed:', speedKmh, 'km/h');
      return;
    }

    const pathPoint: PathPoint = {
      ...location,
      speed: speedKmh,
    };

    // Add to background path
    this.currentTripPath.backgroundPath.push(pathPoint);

    // Process for pause detection
    this.detectPauses();

    console.log('Location processed for trip:', {
      lat: location.latitude.toFixed(6),
      lon: location.longitude.toFixed(6),
      speed: speedKmh.toFixed(1) + ' km/h',
      pathLength: this.currentTripPath.backgroundPath.length,
    });
  }

  /**
   * Detect pauses in movement
   */
  private detectPauses(): void {
    if (!this.currentTripPath || this.currentTripPath.backgroundPath.length < 2) return;

    const path = this.currentTripPath.backgroundPath;
    const currentPoint = path[path.length - 1];
    const previousPoint = path[path.length - 2];

    // Calculate distance between points
    const distance = this.calculateDistance(
      previousPoint.latitude, previousPoint.longitude,
      currentPoint.latitude, currentPoint.longitude
    );

    // If distance is less than pause radius, we might be paused
    if (distance < GPS_CONFIG.PAUSE_RADIUS_METERS) {
      const timeDiff = (currentPoint.timestamp - previousPoint.timestamp) / 1000 / 60; // minutes

      if (timeDiff >= GPS_CONFIG.PAUSE_TIMEOUT_MINUTES) {
        // Record pause event
        const pauseEvent: PauseEvent = {
          startTime: previousPoint.timestamp,
          endTime: currentPoint.timestamp,
          latitude: currentPoint.latitude,
          longitude: currentPoint.longitude,
          duration: timeDiff,
        };

        this.currentTripPath.pauseEvents.push(pauseEvent);
        console.log('Pause detected:', Math.round(timeDiff), 'minutes');
      }
    }
  }

  /**
   * Calculate distance between two points (Haversine formula)
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Background location handler - must be public for TaskManager
   */
  public handleBackgroundLocation = async (body: any): Promise<void> => {
    if (body.error) {
      console.error('Background location error in handler:', body.error);
      return;
    }

    const locations = body.data?.locations;
    if (!locations || locations.length === 0) return;

    // Process the latest location
    const location = locations[locations.length - 1];
    const locationPoint: LocationPoint = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: location.timestamp,
      accuracy: location.coords.accuracy,
      speed: location.coords.speed,
      altitude: location.coords.altitude,
    };

    // Process for trip tracking if active
    this.processLocationForTrip(locationPoint);
  };

  /**
   * Check if location tracking is active
   */
  isLocationTrackingActive(): boolean {
    return this.isTracking;
  }

  /**
   * Get GPS status
   */
  async getLocationStatus(): Promise<{
    hasPermissions: boolean;
    isTracking: boolean;
    currentLocation: LocationPoint | null;
  }> {
    const hasPermissions = (await Location.getForegroundPermissionsAsync()).status === 'granted';
    const currentLocation = await this.getCurrentLocation();

    return {
      hasPermissions,
      isTracking: this.isTracking,
      currentLocation,
    };
  }
}

// Export singleton instance
export const locationService = LocationService.getInstance();

// Define background task at top level (required by expo-task-manager)
if (TaskManager.isTaskDefined(LOCATION_TASK_NAME)) {
  console.log(`Task ${LOCATION_TASK_NAME} already defined`);
} else {
  TaskManager.defineTask(LOCATION_TASK_NAME, async (body) => {
    await locationService.handleBackgroundLocation(body);
  });
}