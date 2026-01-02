import {
  TripState,
  TripAction,
  TripPoint,
  PauseSegment,
  MovementTag,
  TripPointType,
} from './types';
import { getDistanceBetweenPointsMeters } from '../../utils/location';
import { GPS_CONFIG } from '../../constants/gps';
import { uuidv4 } from '../../utils/uuid';

export const initialTripState: TripState = {
  status: 'IDLE',
  isOnline: true,
  activeTripId: null,
  activeOrderId: null,
  currentLocation: null,
  path: [],
  displayPath: [],
  distance: 0,
  currentSpeed: 0,
  averageSpeed: 0,
  duration: 0,
  osrmServerUsed: 'none',
  speedLimit: 0, // Default off
  serverSpeedLimit: null,
  useSpeedLimitServer: false,
  pauses: [],
  activePause: null,
  errors: [],
  vehicleConfirmations: 0,
  stationaryStartTime: null,
  stationaryStartLocation: null,
  lastGeofenceAlertId: null,
};

// --- Helper Functions ---

const determineMovementTag = (
  speedKmh: number,
  accuracy: number,
  currentConfirmations: number
): { tag: MovementTag; newConfirmations: number } => {
  // 1. Noise Filter (Extreme low accuracy)
  if (accuracy > 50) return { tag: 'unconfirmed', newConfirmations: 0 };

  // 2. Stationary Detection
  if (speedKmh < GPS_CONFIG.PAUSE_SPEED_THRESHOLD_KMH) {
    return { tag: 'stationary', newConfirmations: 0 };
  }

  // 3. Walking vs Vehicle Logic
  if (speedKmh < GPS_CONFIG.MIN_VEHICLE_SPEED_KMH) {
    return { tag: 'walking', newConfirmations: 0 };
  }

  // 4. Vehicle Confirmation Logic
  const updatedConfirmations = currentConfirmations + 1;
  if (updatedConfirmations >= GPS_CONFIG.VEHICLE_SPEED_CONFIRMATIONS) {
    return { tag: 'vehicle', newConfirmations: updatedConfirmations };
  }

  return { tag: 'unconfirmed', newConfirmations: updatedConfirmations };
};

const createTripPoint = (
  loc: any,
  movementTag: MovementTag,
  type: TripPointType = 'gps'
): TripPoint => ({
  latitude: loc.coords.latitude,
  longitude: loc.coords.longitude,
  speed: (loc.coords.speed || 0) * 3.6, // Convert m/s to km/h
  accuracy: loc.coords.accuracy || 0,
  timestamp: loc.timestamp || Date.now(),
  heading: loc.coords.heading,
  altitude: loc.coords.altitude,
  type,
  movementTag,
});

const calculateNewDistance = (lastPoint: TripPoint, newPoint: TripPoint): number => {
  return getDistanceBetweenPointsMeters(
    { latitude: lastPoint.latitude, longitude: lastPoint.longitude },
    { latitude: newPoint.latitude, longitude: newPoint.longitude }
  );
};

// --- Reducer ---

export const tripReducer = (state: TripState, action: TripAction): TripState => {
  switch (action.type) {
    case 'START_TRIP':
      return {
        ...initialTripState,
        speedLimit: state.speedLimit, // 🏎️ Preserve user defined speed limit
        useSpeedLimitServer: state.useSpeedLimitServer, // ☁️ Preserve server toggle
        status: 'TRACKING',
        activeTripId: action.payload.tripId,
        activeOrderId: action.payload.orderId,
        currentLocation: action.payload.startLocation,
        path: [], // 🚀 Start with empty path to eliminate walking at start
        displayPath: [], // 🚀 Start with empty path
      };

    case 'LOCATION_UPDATE': {
      if (state.status === 'IDLE' || state.status === 'ENDING') return state;

      const rawLoc = action.payload;
      const now = rawLoc.timestamp || Date.now();
      const speedKmh = (rawLoc.coords.speed || 0) * 3.6;
      const accuracy = rawLoc.coords.accuracy || 0;

      // 1. Determine Movement Tag using Smart Logic
      const { tag, newConfirmations } = determineMovementTag(
        speedKmh,
        accuracy,
        state.vehicleConfirmations
      );

      const newPoint = createTripPoint(rawLoc, tag);

      // 2. --- AUTO PAUSE/RESUME LOGIC (The Brain) ---
      let nextStatus = state.status;
      let nextActivePause = state.activePause;
      let nextPauses = state.pauses;
      let nextStationaryStartTime = state.stationaryStartTime;
      let nextStationaryStartLocation = state.stationaryStartLocation;

      if (tag === 'stationary') {
        if (!nextStationaryStartTime) {
          nextStationaryStartTime = now;
          // 🚀 Record the EXACT location where we stopped to prevent "drift" later
          nextStationaryStartLocation = newPoint;
        } else if (
          now - nextStationaryStartTime > GPS_CONFIG.PAUSE_TIME_THRESHOLD &&
          state.status === 'TRACKING'
        ) {
          // 🛡️ PREMIUM RULE: Do not trigger auto-pause until we have moved at least 100 meters
          // This prevents "Pause #1" from showing up if the phone is just sitting on a desk at start.
          if (state.distance > 100) {
            // Trigger Auto Pause
            nextStatus = 'PAUSED';
            nextActivePause = {
              id: uuidv4(),
              startTime: nextStationaryStartTime,
              endTime: null,
              // 🚀 Use the ORIGINAL stop location, not the drifted current point
              startLocation: state.stationaryStartLocation || newPoint,
              type: 'auto',
              durationMs: 0,
            };
            console.log(
              `[AutoPause] ⏸️ Stationary for ${(now - nextStationaryStartTime) / 1000}s. Triggering pause.`
            );
          } else {
            if (__DEV__ && Math.random() < 0.1)
              console.log('[AutoPause] 🧊 Suppressed: Distance < 100m');
          }
        }
      } else if (tag === 'vehicle') {
        // Only vehicle triggers resume
        // Reset stationary timer on vehicle movement
        nextStationaryStartTime = null;
        nextStationaryStartLocation = null;

        // Auto Resume if movement detected while paused AND speed > RESUME threshold
        if (state.status === 'PAUSED' && state.activePause) {
          if (speedKmh >= GPS_CONFIG.RESUME_SPEED_THRESHOLD_KMH) {
            nextStatus = 'TRACKING';
            const endedPause: PauseSegment = {
              ...state.activePause,
              endTime: now,
              endLocation: newPoint,
              durationMs: now - state.activePause.startTime,
            };
            nextPauses = [...state.pauses, endedPause];
            nextActivePause = null;
            console.log(
              `[AutoResume] ▶️ Confirmed vehicle movement (${speedKmh.toFixed(1)} km/h). Resuming.`
            );
          }
        }
      } else if (tag === 'walking') {
        // 🚀 IMPROVED: Walking doesn't immediately reset the stationary timer
        // unless we've moved significantly from the stop point (> 25m)
        if (state.status === 'TRACKING' && state.stationaryStartLocation) {
          const distFromStop = calculateNewDistance(state.stationaryStartLocation, newPoint);
          if (distFromStop > 25) {
            nextStationaryStartTime = null;
            nextStationaryStartLocation = null;
          }
        } else {
          nextStationaryStartTime = null;
          nextStationaryStartLocation = null;
        }
      }

      // 3. Distance Calculation
      let newDistance = state.distance;
      let newPath = state.path;
      let newDisplayPath = state.displayPath;

      if (state.status === 'TRACKING') {
        // Only add distance when actively tracking
        if (state.path.length > 0) {
          const distanceIncrement = calculateNewDistance(state.path[state.path.length - 1], newPoint);
          newDistance = state.distance + distanceIncrement;
        }

        // Add point to path
        newPath = [...state.path, newPoint];

        // Update display path (simplified for UI performance)
        newDisplayPath = newPath.length > 100 ? newPath.slice(-100) : newPath;
      }

      // 4. Speed calculations
      let newAverageSpeed = state.averageSpeed;
      if (newPath.length > 1) {
        const speeds = newPath.map(p => p.speed).filter(s => s > 0);
        newAverageSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
      }

      return {
        ...state,
        status: nextStatus,
        currentLocation: newPoint,
        path: newPath,
        displayPath: newDisplayPath,
        distance: newDistance,
        currentSpeed: speedKmh,
        averageSpeed: newAverageSpeed,
        pauses: nextPauses,
        activePause: nextActivePause,
        vehicleConfirmations: newConfirmations,
        stationaryStartTime: nextStationaryStartTime,
        stationaryStartLocation: nextStationaryStartLocation,
      };
    }

    case 'PAUSE_TRIP': {
      if (state.status !== 'TRACKING') return state;

      const pauseLocation = action.payload.location;
      const newPause: PauseSegment = {
        id: uuidv4(),
        startTime: Date.now(),
        endTime: null,
        startLocation: pauseLocation,
        type: action.payload.type,
        durationMs: 0,
      };

      return {
        ...state,
        status: 'PAUSED',
        activePause: newPause,
        stationaryStartTime: null, // Clear auto-pause timers
        stationaryStartLocation: null,
      };
    }

    case 'RESUME_TRIP': {
      if (state.status !== 'PAUSED' || !state.activePause) return state;

      const resumeTime = Date.now();
      const endedPause: PauseSegment = {
        ...state.activePause,
        endTime: resumeTime,
        endLocation: action.payload.location,
        durationMs: resumeTime - state.activePause.startTime,
      };

      return {
        ...state,
        status: 'TRACKING',
        pauses: [...state.pauses, endedPause],
        activePause: null,
      };
    }

    case 'END_TRIP': {
      return {
        ...state,
        status: 'IDLE',
        activeTripId: null,
        activeOrderId: null,
        currentLocation: action.payload.endLocation,
      };
    }

    case 'SET_OSRM_SERVER':
      return {
        ...state,
        osrmServerUsed: action.payload,
      };

    case 'SET_ONLINE_STATUS':
      return {
        ...state,
        isOnline: action.payload,
      };

    case 'SET_SPEED_LIMIT':
      return {
        ...state,
        speedLimit: action.payload,
      };

    case 'SET_SERVER_SPEED_LIMIT':
      return {
        ...state,
        serverSpeedLimit: action.payload,
      };

    case 'SET_USE_SPEED_LIMIT_SERVER':
      return {
        ...state,
        useSpeedLimitServer: action.payload,
      };

    case 'SET_GEOFENCE_ALERT_ID':
      return {
        ...state,
        lastGeofenceAlertId: action.payload,
      };

    case 'ERROR_OCCURRED':
      return {
        ...state,
        errors: [...state.errors, action.payload],
      };

    case 'RESET_STATE':
      return {
        ...initialTripState,
        speedLimit: state.speedLimit, // Preserve user settings
        useSpeedLimitServer: state.useSpeedLimitServer,
      };

    default:
      return state;
  }
};
