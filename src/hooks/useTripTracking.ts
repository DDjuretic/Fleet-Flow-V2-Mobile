import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTripManager } from './useTripManager';
import { TripPoint } from '../context/trip/types';

export interface UseTripTrackingReturn {
  isTracking: boolean;
  isPaused: boolean;
  isEnding: boolean;
  currentSpeed: number;
  distance: number;
  duration: number;
  path: TripPoint[];
  startLocation: TripPoint | null;
  endLocation: TripPoint | null;
  activeTravelOrder: any | null;
  isSyncing: boolean;
  error: string | null;
  isOnline: boolean;
  lastLocation: TripPoint | null;
  startTrip: (routeData: {
    userId: string;
    purposeId?: string | number;
    routeId?: string | number;
    tripId?: string;
    orderId?: string;
  }) => Promise<void>;
  endTrip: (distance: number, cost: number) => Promise<void>;
  endTravelOrder: (source?: string) => Promise<void>;
  addPause: (location?: TripPoint, customStartTime?: number) => void;
  resumePause: (location?: TripPoint) => void;
  tripRefs: any;
  // Pause helpers for live UI
  pauses: any[];
  getPauses: () => any[];
  getCurrentPauseElapsedMs: () => number;
  isPausedNow: boolean;
}

export const useTripTracking = (): UseTripTrackingReturn => {
  const { user } = useAuth();
  const tripManager = useTripManager();

  const startTrip = useCallback(async (routeData: {
    userId: string;
    purposeId?: string | number;
    routeId?: string | number;
    tripId?: string;
    orderId?: string;
  }) => {
    try {
      if (!routeData.tripId || !routeData.orderId) {
        throw new Error('Trip ID and Order ID are required');
      }

      if (!user?.user_id) {
        throw new Error('User not authenticated');
      }

      // Get current location as start location
      // For now, we'll create a mock start location - in production this should get real GPS location
      const startLocation: TripPoint = {
        latitude: 42.4307, // Default to Podgorica
        longitude: 19.2478,
        speed: 0,
        accuracy: 5,
        timestamp: Date.now(),
        type: 'gps',
        movementTag: 'stationary',
      };

      await tripManager.startTrip(routeData.tripId, routeData.orderId, startLocation);

    } catch (error) {
      console.error('Failed to start trip:', error);
      throw error;
    }
  }, [user?.user_id, tripManager]);

  const endTrip = useCallback(async (distance: number, cost: number) => {
    try {
      if (!tripManager.lastLocation) {
        throw new Error('No end location available');
      }

      tripManager.endTrip(tripManager.lastLocation);
    } catch (error) {
      console.error('Failed to end trip:', error);
      throw error;
    }
  }, [tripManager]);

  const endTravelOrder = useCallback(async (source?: string) => {
    try {
      // For now, just end the current trip
      if (tripManager.isTracking && tripManager.lastLocation) {
        tripManager.endTrip(tripManager.lastLocation);
      }
    } catch (error) {
      console.error('Failed to end travel order:', error);
      throw error;
    }
  }, [tripManager]);

  const addPause = useCallback((location?: TripPoint, customStartTime?: number) => {
    const pauseLocation = location || tripManager.lastLocation;
    if (pauseLocation) {
      tripManager.pauseTrip(pauseLocation, 'manual');
    }
  }, [tripManager]);

  const resumePause = useCallback((location?: TripPoint) => {
    const resumeLocation = location || tripManager.lastLocation;
    if (resumeLocation) {
      tripManager.resumeTrip(resumeLocation);
    }
  }, [tripManager]);

  return {
    // State
    isTracking: tripManager.isTracking,
    isPaused: tripManager.isPaused,
    isEnding: tripManager.isEnding,
    currentSpeed: tripManager.currentSpeed,
    distance: tripManager.distance,
    duration: tripManager.duration,
    path: tripManager.path,
    startLocation: tripManager.startLocation,
    endLocation: tripManager.endLocation,
    activeTravelOrder: tripManager.activeTravelOrder,
    isSyncing: tripManager.isSyncing,
    error: tripManager.error,
    isOnline: tripManager.isOnline,
    lastLocation: tripManager.lastLocation,

    // Actions
    startTrip,
    endTrip,
    endTravelOrder,
    addPause,
    resumePause,
    tripRefs: tripManager.tripRefs,

    // Pause helpers
    pauses: tripManager.pauses,
    getPauses: tripManager.getPauses,
    getCurrentPauseElapsedMs: tripManager.getCurrentPauseElapsedMs,
    isPausedNow: tripManager.isPausedNow,
  };
};