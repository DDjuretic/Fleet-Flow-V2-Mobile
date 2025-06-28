import { LocationCoordinates } from './locationService';

export interface NavigationStep {
  instruction: string;
  distance: number;
  duration: number;
  coordinate: LocationCoordinates;
  type: string;
  modifier?: string;
}

export interface NavigationRoute {
  coordinates: LocationCoordinates[];
  distance: number; // in meters
  duration: number; // in seconds
  steps: NavigationStep[];
}

export interface RoutingResponse {
  route: NavigationRoute;
  success: boolean;
  error?: string;
}

// OpenRouteService API key - trebate registrovati se na https://openrouteservice.org/
const ORS_API_KEY = '5b3ce3597851110001cf6248YOUR_API_KEY_HERE';

// Alternative: OSRM (Open Source Routing Machine) - besplatan ali bez API key-a
const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

/**
 * Get navigation route using OSRM (free, no API key required)
 */
export const getNavigationRoute = async (
  startCoords: LocationCoordinates,
  endCoords: LocationCoordinates
): Promise<RoutingResponse> => {
  try {
    const startLng = startCoords.longitude;
    const startLat = startCoords.latitude;
    const endLng = endCoords.longitude;
    const endLat = endCoords.latitude;

    // OSRM API call
    const url = `${OSRM_BASE_URL}/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`;
    
    console.log('🗺️ Fetching route from OSRM:', url);
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.code !== 'Ok') {
      throw new Error(`OSRM API error: ${data.message || 'Unknown error'}`);
    }

    const route = data.routes[0];
    if (!route) {
      throw new Error('No route found');
    }

    // Convert OSRM response to our format
    const coordinates: LocationCoordinates[] = route.geometry.coordinates.map((coord: [number, number]) => ({
      longitude: coord[0],
      latitude: coord[1],
      timestamp: Date.now()
    }));

    const steps: NavigationStep[] = route.legs[0].steps.map((step: any) => ({
      instruction: step.maneuver.instruction || getInstructionFromType(step.maneuver.type, step.maneuver.modifier),
      distance: step.distance,
      duration: step.duration,
      coordinate: {
        longitude: step.maneuver.location[0],
        latitude: step.maneuver.location[1],
        timestamp: Date.now()
      },
      type: step.maneuver.type,
      modifier: step.maneuver.modifier
    }));

    const navigationRoute: NavigationRoute = {
      coordinates,
      distance: route.distance,
      duration: route.duration,
      steps
    };

    console.log('✅ Navigation route fetched successfully:', {
      coordinatesCount: coordinates.length,
      distance: route.distance,
      duration: route.duration,
      stepsCount: steps.length
    });

    return {
      route: navigationRoute,
      success: true
    };

  } catch (error) {
    console.error('❌ Error fetching navigation route:', error);
    
    // Fallback: return simple straight line route
    const fallbackRoute: NavigationRoute = {
      coordinates: [startCoords, endCoords],
      distance: calculateDistance(startCoords, endCoords) * 1000, // convert to meters
      duration: calculateDistance(startCoords, endCoords) * 1000 / 50 * 3.6, // assume 50 km/h
      steps: [
        {
          instruction: 'Head towards destination',
          distance: calculateDistance(startCoords, endCoords) * 1000,
          duration: calculateDistance(startCoords, endCoords) * 1000 / 50 * 3.6,
          coordinate: startCoords,
          type: 'depart'
        },
        {
          instruction: 'Arrive at destination',
          distance: 0,
          duration: 0,
          coordinate: endCoords,
          type: 'arrive'
        }
      ]
    };

    return {
      route: fallbackRoute,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown routing error'
    };
  }
};

/**
 * Generate human-readable instruction from OSRM maneuver type
 */
const getInstructionFromType = (type: string, modifier?: string): string => {
  const instructions: { [key: string]: string } = {
    'depart': 'Start your journey',
    'turn': modifier ? `Turn ${modifier}` : 'Turn',
    'new name': 'Continue on road',
    'continue': 'Continue straight',
    'merge': 'Merge',
    'on ramp': 'Take the ramp',
    'off ramp': 'Take the exit',
    'fork': modifier ? `Keep ${modifier}` : 'Keep straight',
    'end of road': modifier ? `Turn ${modifier} at end of road` : 'Turn at end of road',
    'use lane': 'Use lane',
    'arrive': 'Arrive at destination',
    'roundabout': 'Enter roundabout',
    'rotary': 'Enter rotary',
    'roundabout turn': 'Exit roundabout',
    'notification': 'Continue',
    'exit roundabout': 'Exit roundabout',
    'exit rotary': 'Exit rotary'
  };

  return instructions[type] || `${type} ${modifier || ''}`.trim();
};

/**
 * Calculate distance between two coordinates in kilometers
 */
const calculateDistance = (coord1: LocationCoordinates, coord2: LocationCoordinates): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
  const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Format duration in seconds to human readable format
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Format distance in meters to human readable format
 */
export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}; 