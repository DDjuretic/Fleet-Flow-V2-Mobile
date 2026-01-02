export const GPS_CONFIG = {
  // Location Update Intervals (milliseconds)
  FAST_UPDATE_INTERVAL: 5000, // 5 seconds when moving
  SLOW_UPDATE_INTERVAL: 15000, // 15 seconds when stationary

  // Speed Thresholds (km/h)
  PAUSE_SPEED_THRESHOLD_KMH: 5, // Below this = stationary
  RESUME_SPEED_THRESHOLD_KMH: 10, // Above this = resume from pause
  MIN_VEHICLE_SPEED_KMH: 15, // Above this = likely vehicle

  // Time Thresholds (milliseconds)
  PAUSE_TIME_THRESHOLD: 30000, // 30 seconds stationary = auto pause

  // Distance Thresholds (meters)
  MIN_DISTANCE_UPDATE: 10, // Minimum distance to add point to path

  // Accuracy Thresholds (meters)
  MAX_ACCURACY_FOR_SPEED: 20, // Max accuracy to use speed data

  // Confirmation counts
  VEHICLE_SPEED_CONFIRMATIONS: 3, // How many fast readings to confirm vehicle

  // Background Location
  BACKGROUND_LOCATION_ENABLED: true,
  BACKGROUND_ACCURACY: 'balanced', // 'balanced' | 'high' | 'low' | 'highest' | 'lowest'

  // Geofencing
  GEOFENCE_RADIUS: 50, // meters
  GEOFENCE_LOITERING_DELAY: 30000, // 30 seconds

  // OSRM Settings
  OSRM_SERVER_URL: 'https://osrm.fleetflow.me',
  OSRM_UPDATE_DISTANCE: 500, // Update route every 500m
  OSRM_MAX_WAYPOINTS: 25, // Max waypoints for route calculation
  OSRM_TIMEOUT: 10000, // 10 seconds timeout

  // Battery optimization
  BATTERY_OPTIMIZATION_ENABLED: true,
  BATTERY_LOW_THRESHOLD: 20, // %

  // Speed Limit Server
  SPEED_SERVER_URL: 'https://speedlimit.fleetflow.me',

  // Heat Map Settings
  HEAT_MAP_ENABLED: true,
  HEAT_MAP_UPDATE_INTERVAL: 3000, // Update heat map every 3 seconds
} as const;
