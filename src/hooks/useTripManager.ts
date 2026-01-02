import { useCallback, useRef, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Location from 'expo-location';
import { useTripContext } from '../context/trip/TripContext';
import { GPS_CONFIG } from '../constants/gps';
import { TripPoint } from '../context/trip/types';

export const useTripManager = () => {
  const { state, dispatch } = useTripContext();

  // Location subscription reference
  const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const backgroundSubscriptionRef = useRef<Location.LocationSubscription | null>(null);

  // App state management
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // 🛡️ DUPLICATE CALL PROTECTION
  const isStartingRef = useRef(false);

  // 📱 APP STATE LISTENER
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  // Start location tracking
  const startLocationTracking = useCallback(async () => {
    try {
      // Request permissions
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        throw new Error('Foreground location permission denied');
      }

      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== 'granted') {
        console.warn('Background location permission denied - will use foreground only');
      }

      // Start foreground tracking
      locationSubscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: GPS_CONFIG.FAST_UPDATE_INTERVAL,
          distanceInterval: GPS_CONFIG.MIN_DISTANCE_UPDATE,
        },
        (location) => {
          dispatch({ type: 'LOCATION_UPDATE', payload: location });
        }
      );

      // Start background tracking if permission granted
      if (backgroundStatus === 'granted') {
        backgroundSubscriptionRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: GPS_CONFIG.SLOW_UPDATE_INTERVAL,
            distanceInterval: GPS_CONFIG.MIN_DISTANCE_UPDATE,
          },
          (location) => {
            // Only process background updates when app is not active
            if (appStateRef.current !== 'active') {
              dispatch({ type: 'LOCATION_UPDATE', payload: location });
            }
          }
        );
      }

      console.log('✅ Location tracking started');
    } catch (error) {
      console.error('❌ Failed to start location tracking:', error);
      dispatch({ type: 'ERROR_OCCURRED', payload: 'Failed to start location tracking' });
    }
  }, [dispatch]);

  // Stop location tracking
  const stopLocationTracking = useCallback(async () => {
    try {
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
        locationSubscriptionRef.current = null;
      }

      if (backgroundSubscriptionRef.current) {
        backgroundSubscriptionRef.current.remove();
        backgroundSubscriptionRef.current = null;
      }

      console.log('🛑 Location tracking stopped');
    } catch (error) {
      console.error('❌ Failed to stop location tracking:', error);
    }
  }, []);

  // Start trip
  const startTrip = useCallback(async (tripId: string, orderId: string, startLocation: TripPoint) => {
    if (isStartingRef.current) {
      console.log('🛡️ Duplicate startTrip call blocked');
      return;
    }

    isStartingRef.current = true;

    try {
      console.log(`🚀 Starting trip: ${tripId}, order: ${orderId}`);

      // Start location tracking first
      await startLocationTracking();

      // Update trip state
      dispatch({
        type: 'START_TRIP',
        payload: {
          tripId,
          orderId,
          startLocation,
        },
      });

      console.log('✅ Trip started successfully');
    } catch (error) {
      console.error('❌ Failed to start trip:', error);
      dispatch({ type: 'ERROR_OCCURRED', payload: 'Failed to start trip' });
    } finally {
      isStartingRef.current = false;
    }
  }, [dispatch, startLocationTracking]);

  // Pause trip
  const pauseTrip = useCallback((location: TripPoint, type: 'manual' | 'auto' = 'manual') => {
    if (state.status !== 'TRACKING') return;

    console.log(`⏸️ Pausing trip (${type})`);
    dispatch({
      type: 'PAUSE_TRIP',
      payload: { type, location },
    });
  }, [state.status, dispatch]);

  // Resume trip
  const resumeTrip = useCallback((location: TripPoint) => {
    if (state.status !== 'PAUSED') return;

    console.log('▶️ Resuming trip');
    dispatch({
      type: 'RESUME_TRIP',
      payload: { location },
    });
  }, [state.status, dispatch]);

  // End trip
  const endTrip = useCallback((endLocation: TripPoint) => {
    if (state.status === 'IDLE') return;

    console.log('🏁 Ending trip');
    dispatch({
      type: 'END_TRIP',
      payload: { endLocation },
    });

    // Stop location tracking
    stopLocationTracking();
  }, [state.status, dispatch, stopLocationTracking]);

  // Reset state
  const resetTripState = useCallback(() => {
    console.log('🔄 Resetting trip state');
    dispatch({ type: 'RESET_STATE' });
    stopLocationTracking();
  }, [dispatch, stopLocationTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLocationTracking();
    };
  }, [stopLocationTracking]);

  return {
    // State
    isTracking: state.status === 'TRACKING',
    isPaused: state.status === 'PAUSED',
    isEnding: state.status === 'ENDING',
    currentSpeed: state.currentSpeed,
    distance: state.distance,
    duration: state.duration,
    path: state.path,
    startLocation: state.path.length > 0 ? state.path[0] : null,
    endLocation: state.currentLocation,
    activeTravelOrder: state.activeOrderId ? { id: state.activeOrderId } : null,
    isSyncing: false, // Not implemented yet
    error: state.errors.length > 0 ? state.errors[state.errors.length - 1] : null,
    isOnline: state.isOnline,
    lastLocation: state.currentLocation,

    // Actions
    startTrip,
    pauseTrip,
    resumeTrip,
    endTrip,
    resetTripState,

    // Pause helpers
    pauses: state.pauses,
    getPauses: () => state.pauses,
    getCurrentPauseElapsedMs: () => {
      if (!state.activePause) return 0;
      return Date.now() - state.activePause.startTime;
    },
    isPausedNow: state.status === 'PAUSED',

    // Technical
    tripRefs: {},
  };
};
