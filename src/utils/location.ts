import { LocationObject } from 'expo-location';

/**
 * Calculate distance between two points using Haversine formula
 * @param point1 First point {latitude, longitude}
 * @param point2 Second point {latitude, longitude}
 * @returns Distance in meters
 */
export function getDistanceBetweenPointsMeters(
  point1: { latitude: number; longitude: number },
  point2: { latitude: number; longitude: number }
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) *
      Math.cos(toRadians(point2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate bearing between two points
 * @returns Bearing in degrees (0 = North, 90 = East, etc.)
 */

/**
 * Ramer-Douglas-Peucker Path Simplification Algorithm
 */
function simplifyPathRDP(path: PathPoint[], tolerance: number = 10): PathPoint[] {
  if (path.length < 3) return path;

  const toleranceKm = tolerance / 1000;

  // Find point with maximum distance
  let maxDistance = 0;
  let maxIndex = 0;
  const start = path[0];
  const end = path[path.length - 1];

  for (let i = 1; i < path.length - 1; i++) {
    const distance = getPerpendicularDistance(path[i], start, end);
    if (distance > maxDistance) {
      maxDistance = distance;
      maxIndex = i;
    }
  }

  if (maxDistance > toleranceKm) {
    const leftHalf = simplifyPathRDP(path.slice(0, maxIndex + 1), tolerance);
    const rightHalf = simplifyPathRDP(path.slice(maxIndex), tolerance);
    return [...leftHalf.slice(0, -1), ...rightHalf];
  } else {
    return [start, end];
  }
}

/**
 * Calculate perpendicular distance from point to line segment
 */
function getPerpendicularDistance(
  point: PathPoint,
  lineStart: PathPoint,
  lineEnd: PathPoint
): number {
  const A = point.longitude - lineStart.longitude;
  const B = point.latitude - lineStart.latitude;
  const C = lineEnd.longitude - lineStart.longitude;
  const D = lineEnd.latitude - lineStart.latitude;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;

  if (lenSq === 0) {
    return getDistanceBetweenPointsMeters(point, lineStart) / 1000;
  }

  const param = dot / lenSq;
  let xx: number, yy: number;

  if (param < 0) {
    xx = lineStart.longitude;
    yy = lineStart.latitude;
  } else if (param > 1) {
    xx = lineEnd.longitude;
    yy = lineEnd.latitude;
  } else {
    xx = lineStart.longitude + param * C;
    yy = lineStart.latitude + param * D;
  }

  return getDistanceBetweenPointsMeters(point, { latitude: yy, longitude: xx }) / 1000;
}

/**
 * Generate OSRM radiuses parameter
 */
function generateOSRMRadiuses(path: PathPoint[]): string {
  return path
    .map(point => {
      const accuracy = point.accuracy || 25; // Default 25m accuracy
      return Math.max(5, Math.min(40, Math.round(accuracy)));
    })
    .join(';');
}

/**
 * Calculate total path distance
 */
function getDistance(path: PathPoint[]): number {
  if (path.length < 2) return 0;
  let totalDistance = 0;
  for (let i = 1; i < path.length; i++) {
    totalDistance += getDistanceBetweenPointsMeters(path[i - 1], path[i]) / 1000;
  }
  return totalDistance;
}
export function calculateBearing(
  start: { latitude: number; longitude: number },
  end: { latitude: number; longitude: number }
): number {
  const startLat = toRadians(start.latitude);
  const startLng = toRadians(start.longitude);
  const endLat = toRadians(end.latitude);
  const endLng = toRadians(end.longitude);

  const dLng = endLng - startLng;

  const x = Math.sin(dLng) * Math.cos(endLat);
  const y = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

  const bearing = Math.atan2(x, y);
  return (bearing * 180 / Math.PI + 360) % 360;
}

/**
 * Check if location accuracy is acceptable
 */
export function isLocationAccurate(location: LocationObject, maxAccuracy = 50): boolean {
  return (location.coords.accuracy || 0) <= maxAccuracy;
}

/**
 * Calculate average speed from path points
 */
export function calculateAverageSpeed(points: Array<{ speed: number }>): number {
  if (points.length === 0) return 0;

  const validPoints = points.filter(p => p.speed > 0);
  if (validPoints.length === 0) return 0;

  const totalSpeed = validPoints.reduce((sum, point) => sum + point.speed, 0);
  return totalSpeed / validPoints.length;
}

/**
 * Calculate total distance from path
 */
export function calculateTotalDistance(
  points: Array<{ latitude: number; longitude: number }>
): number {
  if (points.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 1; i < points.length; i++) {
    totalDistance += getDistanceBetweenPointsMeters(points[i - 1], points[i]);
  }

  return totalDistance;
}

/**
 * Filter out noise points from GPS path
 */
export function filterNoisePoints(
  points: Array<{ latitude: number; longitude: number; accuracy: number }>,
  maxAccuracy = 50,
  minDistance = 10
): Array<{ latitude: number; longitude: number; accuracy: number }> {
  if (points.length === 0) return [];

  const filtered: Array<{ latitude: number; longitude: number; accuracy: number }> = [points[0]];

  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    const lastPoint = filtered[filtered.length - 1];

    // Skip if accuracy is too poor
    if (point.accuracy > maxAccuracy) continue;

    // Skip if distance is too small
    const distance = getDistanceBetweenPointsMeters(lastPoint, point);
    if (distance < minDistance) continue;

    filtered.push(point);
  }

  return filtered;
}

/**
 * Path point with speed data for heatmap
 */
export interface PathPoint {
  latitude: number;
  longitude: number;
  timestamp?: number;
  accuracy?: number;
  speed?: number; // Speed in km/h for heatmap
}

export interface PathSegment {
  points: PathPoint[];
  color: string;
}

export interface RouteDetails {
  distance: number; // in meters
  duration: number; // in seconds
  geometry: PathPoint[];
  wasSimplified?: boolean;
  originalPointCount?: number;
  simplifiedPointCount?: number;
  hadAirLineIssue?: boolean;
  serverUsed?: 'self-hosted' | 'public-fallback' | 'none';
}

/**
 * 🎨 Generate Heat Map Path Segments
 *
 * Groups path points into colored segments based on speed.
 * Creates a visual heatmap showing speed variations along the route.
 *
 * @param displayPath - Simplified path to display
 * @param originalPath - Original recorded path with speed data
 * @param averageSpeed - Average speed for fallback
 * @returns Array of path segments with colors
 */
export function generateHeatMapSegments(
  displayPath: PathPoint[],
  originalPath: PathPoint[] = [],
  averageSpeed: number = 50
): PathSegment[] {
  if (!displayPath || displayPath.length < 2) return [];

  const segments: PathSegment[] = [];

  // Helper function to find speed for a point
  const getSpeedForPoint = (point: PathPoint, index: number): number => {
    // If point has speed data, use it
    if (point.speed !== undefined && point.speed > 0) return point.speed;

    // If no original path, use average
    if (!originalPath.length) return averageSpeed;

    // Find nearest point in original path with speed data
    let minSqDist = Infinity;
    let nearestSpeed = averageSpeed;

    for (const op of originalPath) {
      if (!op.speed || op.speed === 0) continue;

      const dLat = point.latitude - op.latitude;
      const dLon = point.longitude - op.longitude;
      const sqDist = dLat * dLat + dLon * dLon;

      if (sqDist < minSqDist) {
        minSqDist = sqDist;
        nearestSpeed = op.speed;
      }
    }

    return nearestSpeed;
  };

  // Function to get color based on speed (same as GPS_CONFIG)
  const getSpeedColor = (speed: number): string => {
    if (speed > 60) return '#FF4444';     // Over 60 km/h - Red
    if (speed > 30) return '#FFAA00';     // 30-60 km/h - Orange
    return '#44AA44';                     // Under 30 km/h - Green
  };

  // Start with first segment
  let currentSegment: PathSegment = {
    points: [displayPath[0]],
    color: getSpeedColor(getSpeedForPoint(displayPath[0], 0)),
  };

  // Group points by speed color
  for (let i = 1; i < displayPath.length; i++) {
    const point = displayPath[i];
    const speed = getSpeedForPoint(point, i);
    const color = getSpeedColor(speed);

    if (color === currentSegment.color) {
      // Same color - add to current segment
      currentSegment.points.push(point);
    } else {
      // Different color - finish current segment and start new one
      currentSegment.points.push(point); // Include point in both for continuity
      segments.push(currentSegment);

      currentSegment = {
        points: [point],
        color: color,
      };
    }
  }

  // Add final segment
  segments.push(currentSegment);

  return segments;
}

/**
 * 🚀 Get Route Details with OSRM Integration
 *
 * Uses OSRM (Open Source Routing Machine) to refine GPS paths and get accurate routing.
 * Supports both self-hosted and public OSRM servers.
 *
 * @param path - Original GPS path
 * @param options - Processing options
 * @returns Route details with refined geometry
 */
export async function getRouteDetails(
  path: PathPoint[],
  options: {
    simplifyTolerance?: number;
    useOSRM?: boolean;
    timeout?: number;
  } = {}
): Promise<RouteDetails> {
  const {
    simplifyTolerance = 10, // meters
    useOSRM = true,
    timeout = 10000, // ms
  } = options;

  if (path.length < 2) {
    return {
      distance: 0,
      duration: 0,
      geometry: [],
      wasSimplified: false,
      originalPointCount: path.length,
      simplifiedPointCount: path.length,
      hadAirLineIssue: false,
      serverUsed: 'none',
    };
  }

  const originalCount = path.length;

  // Step 1: Simplify path using RDP algorithm
  const simplifiedPath = simplifyPathRDP(path, simplifyTolerance);
  const rawDistanceKm = getDistance(simplifiedPath);
  const rawDistanceMeters = rawDistanceKm * 1000;

  let serverUsed: 'self-hosted' | 'public-fallback' | 'none' = 'none';

  // Step 2: Use OSRM for path refinement
  if (useOSRM && simplifiedPath.length >= 2) {
    const osrmPath = simplifiedPath;

    // Try OSRM request
    const tryOSRMRequest = async (
      url: string,
      server: 'self-hosted' | 'public-fallback'
    ): Promise<{
      success: boolean;
      distance?: number;
      duration?: number;
      geometry?: PathPoint[];
    }> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        console.log(`[OSRM] Request (${server}): ${url.substring(0, 100)}...`);

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
          console.warn(`[OSRM] ${server} Failed: ${response.status}`);
          return { success: false };
        }

        const data = await response.json();

        if (data.code === 'Ok' && data.matchings && data.matchings.length > 0) {
          const match = data.matchings[0];
          const geometry: PathPoint[] = match.geometry.coordinates.map(
            (coord: [number, number]) => ({
              latitude: coord[1],
              longitude: coord[0],
            })
          );

          return {
            success: true,
            distance: match.distance,
            duration: match.duration,
            geometry
          };
        }

        console.warn(`[OSRM] ${server} returned: ${data.code || 'invalid response'}`);
        return { success: false };

      } catch (error) {
        console.warn(`[OSRM] ${server} error:`, error);
        return { success: false };
      }
    };

    // Try self-hosted OSRM first
    let osrmResult: {
      success: boolean;
      distance?: number;
      duration?: number;
      geometry?: PathPoint[];
    } = { success: false };

    try {
      // Check if self-hosted OSRM is available
      const healthCheck = await fetch(
        'https://osrm.fleetflow.me/route/v1/driving/19.2636,42.4410;19.2667,42.4422?overview=false',
        { signal: AbortSignal.timeout(5000) }
      );

      if (healthCheck.ok) {
        console.log('[OSRM] Self-hosted OSRM available, trying...');

        const coords = osrmPath.map(p => `${p.longitude},${p.latitude}`).join(';');
        const radiuses = generateOSRMRadiuses(osrmPath);
        const url = `https://osrm.fleetflow.me/match/v1/driving/${coords}?overview=full&geometries=geojson&radiuses=${radiuses}`;

        osrmResult = await tryOSRMRequest(url, 'self-hosted');
        if (osrmResult.success) {
          serverUsed = 'self-hosted';
        }
      }
    } catch {
      console.log('[OSRM] Self-hosted OSRM not available');
    }

    // Fallback to public OSRM
    if (!osrmResult.success) {
      console.log('[OSRM] Trying public OSRM fallback...');

      // Limit coordinates for public API (max 100)
      const limitedPath = osrmPath.length > 40
        ? osrmPath.filter((_, i) => i % Math.ceil(osrmPath.length / 40) === 0 || i === osrmPath.length - 1)
        : osrmPath;

      const coords = limitedPath.map(p => `${p.longitude},${p.latitude}`).join(';');
      const radiuses = limitedPath.map(() => '40').join(';');

      // Try MATCH first
      const matchUrl = `https://router.project-osrm.org/match/v1/driving/${coords}?overview=full&geometries=geojson&radiuses=${radiuses}`;
      osrmResult = await tryOSRMRequest(matchUrl, 'public-fallback');

      if (osrmResult.success) {
        serverUsed = 'public-fallback';
      } else {
        // Final fallback: ROUTE service
        console.log('[OSRM] Final fallback to public OSRM Route service...');
        const routeUrl = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

        try {
          const response = await fetch(routeUrl);
          if (response.ok) {
            const data = await response.json();
            if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
              const route = data.routes[0];
              const geometry: PathPoint[] = route.geometry.coordinates.map(
                (coord: [number, number]) => ({
                  latitude: coord[1],
                  longitude: coord[0],
                })
              );

              osrmResult = {
                success: true,
                distance: route.distance,
                duration: route.duration,
                geometry,
              };
              serverUsed = 'public-fallback';
            }
          }
        } catch (error) {
          console.warn('[OSRM] Route service also failed');
        }
      }
    }

    // Return OSRM result if successful
    if (osrmResult.success && osrmResult.geometry) {
      console.log(`[OSRM] Success (${serverUsed}): ${osrmResult.distance}m, ${osrmResult.geometry.length} points`);

      return {
        distance: osrmResult.distance!,
        duration: osrmResult.duration || 0,
        geometry: osrmResult.geometry,
        wasSimplified: true,
        originalPointCount: originalCount,
        simplifiedPointCount: simplifiedPath.length,
        hadAirLineIssue: false, // OSRM handles this
        serverUsed,
      };
    }
  }

  // Fallback: Return simplified path
  return {
    distance: rawDistanceMeters,
    duration: 0,
    geometry: simplifiedPath,
    wasSimplified: true,
    originalPointCount: originalCount,
    simplifiedPointCount: simplifiedPath.length,
    hadAirLineIssue: false,
    serverUsed: 'none',
  };
}

/**
 * ☁️ Fetch Speed Limit from Overpass API Server
 *
 * Uses Overpass API to query OpenStreetMap data for speed limits.
 * Queries nearby roads and returns the applicable speed limit.
 *
 * @param latitude - GPS latitude
 * @param longitude - GPS longitude
 * @returns Speed limit in km/h or null if not found
 */
export async function fetchSpeedLimitFromServer(
  latitude: number,
  longitude: number
): Promise<number | null> {
  try {
    // Overpass query for speed limits
    const query = `
      [out:json][timeout:5];
      (
        way(around:100,${latitude},${longitude})["maxspeed"];
        way(around:100,${latitude},${longitude})["highway"~"motorway|trunk|primary|secondary"];
      );
      out tags;
    `;

    const response = await fetch(`https://speedlimit.fleetflow.me/api/interpreter`, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (!response.ok) {
      console.warn('[SpeedLimit] Server Error:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('[SpeedLimit] Raw Data Elements:', data?.elements?.length);

    if (data && data.elements && data.elements.length > 0) {
      // 1. Try to find explicit maxspeed
      const elementWithSpeed = data.elements.find((el: any) => el.tags && el.tags.maxspeed);

      if (elementWithSpeed) {
        const maxspeed = elementWithSpeed.tags.maxspeed;
        const limit = parseInt(maxspeed.replace(/[^0-9]/g, ''), 10);
        return isNaN(limit) ? null : limit;
      }

      // 2. Fallback based on highway type (Smart Defaults for Montenegro)
      const highway = data.elements[0].tags.highway;
      if (highway === 'motorway') return 100;
      if (highway === 'trunk' || highway === 'primary') return 80;
      if (highway === 'secondary') return 60;
    }

    return null;
  } catch (error) {
    console.log('[SpeedLimit] Fetch error:', error);
    return null;
  }
}
