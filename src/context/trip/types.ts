import { LocationObject } from 'expo-location';

// --- Core Types ---

export type TripStatus = 'IDLE' | 'TRACKING' | 'PAUSED' | 'ENDING';

export type TripPointType = 'gps' | 'osrm_interpolated' | 'pause_marker' | 'noise';
export type MovementTag = 'stationary' | 'walking' | 'vehicle' | 'unconfirmed';

export interface TripPoint {
  latitude: number;
  longitude: number;
  speed: number; // Speed in km/h
  accuracy: number; // Accuracy in meters
  timestamp: number; // Unix timestamp
  heading?: number;
  altitude?: number;

  // Metadata for granular tracking
  type: TripPointType;
  movementTag: MovementTag;

  // OSRM Metadata
  osrmProcessed?: boolean;
  osrmServer?: 'self-hosted' | 'public-fallback' | 'none';
}

export interface PauseSegment {
  id: string;
  startTime: number; // Unix timestamp
  endTime: number | null; // Null if active
  startLocation: TripPoint;
  endLocation?: TripPoint;
  type: 'manual' | 'auto'; // Who initiated the pause
  durationMs: number; // Calculated duration
}

export interface TripState {
  // Status flags
  status: TripStatus;
  isOnline: boolean;

  // Trip Data
  activeTripId: string | null;
  activeOrderId: string | null;

  // Location Data
  currentLocation: TripPoint | null;
  path: TripPoint[]; // Full raw path history
  displayPath: TripPoint[]; // Optimized for UI rendering

  // Metrics
  distance: number; // Total distance in meters
  currentSpeed: number; // Current speed in km/h
  averageSpeed: number; // Average speed in km/h
  duration: number; // Duration in seconds (driving time)
  osrmServerUsed: 'self-hosted' | 'public-fallback' | 'none';
  speedLimit: number; // 🏎️ User defined speed limit (0 = off)
  serverSpeedLimit: number | null; // ☁️ Real-time limit from server
  useSpeedLimitServer: boolean; // ⚙️ Toggle for smart limits

  // Pause Management
  pauses: PauseSegment[];
  activePause: PauseSegment | null;

  // Technical State
  batteryLevel?: number;
  lastSyncTime?: number;
  errors: string[];

  // Internal Counters for Logic
  vehicleConfirmations: number;
  stationaryStartTime: number | null;
  stationaryStartLocation: TripPoint | null; // 🚀 Anchor for pause/geofence
  lastGeofenceAlertId: string | null; // 🚀 To prevent notification spam
}

// --- Actions ---

export type TripAction =
  | { type: 'START_TRIP'; payload: { tripId: string; orderId: string; startLocation: TripPoint } }
  | { type: 'LOCATION_UPDATE'; payload: LocationObject }
  | { type: 'PAUSE_TRIP'; payload: { type: 'manual' | 'auto'; location: TripPoint } }
  | { type: 'RESUME_TRIP'; payload: { location: TripPoint } }
  | { type: 'END_TRIP'; payload: { endLocation: TripPoint } }
  | { type: 'SET_OSRM_SERVER'; payload: 'self-hosted' | 'public-fallback' | 'none' }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'SET_SPEED_LIMIT'; payload: number }
  | { type: 'SET_SERVER_SPEED_LIMIT'; payload: number | null }
  | { type: 'SET_USE_SPEED_LIMIT_SERVER'; payload: boolean }
  | { type: 'SET_GEOFENCE_ALERT_ID'; payload: string | null }
  | { type: 'ERROR_OCCURRED'; payload: string }
  | { type: 'RESET_STATE' };
