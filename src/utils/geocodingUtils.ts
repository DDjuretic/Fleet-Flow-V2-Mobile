interface MapLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

// Improved geocoding with multiple fallback services
export const geocodeAddress = async (address: string): Promise<MapLocation | null> => {
  // Try Nominatim first (OpenStreetMap)
  try {
    const result = await geocodeWithNominatim(address);
    if (result) return result;
  } catch (error) {
    console.log('Nominatim geocoding failed, trying fallback...');
  }

  // Fallback to manual coordinate parsing if address looks like coordinates
  const coordMatch = address.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lng = parseFloat(coordMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return {
        latitude: lat,
        longitude: lng,
        address: `${lat}, ${lng}`
      };
    }
  }

  return null;
};

// Nominatim geocoding service
const geocodeWithNominatim = async (address: string): Promise<MapLocation | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'FleetFlow-Mobile-App/1.0',
          'Accept': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      console.error('Nominatim API error:', response.status, response.statusText);
      return null;
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Nominatim returned non-JSON response:', contentType);
      return null;
    }
    
    const data = await response.json();
    
    if (data && Array.isArray(data) && data.length > 0) {
      const result = data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        address: result.display_name
      };
    }
    return null;
  } catch (error) {
    console.error('Nominatim geocoding error:', error);
    return null;
  }
};

// Improved reverse geocoding with fallback
export const reverseGeocode = async (latitude: number, longitude: number): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'FleetFlow-Mobile-App/1.0',
          'Accept': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      console.error('Reverse geocoding API error:', response.status, response.statusText);
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Reverse geocoding returned non-JSON response:', contentType);
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
    
    const data = await response.json();
    
    if (data && data.display_name) {
      return data.display_name;
    }
    
    // Fallback to coordinates
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
};

// Validate coordinates
export const validateCoordinates = (lat: string, lng: string): boolean => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  
  return !isNaN(latitude) && 
         !isNaN(longitude) && 
         latitude >= -90 && 
         latitude <= 90 && 
         longitude >= -180 && 
         longitude <= 180;
};

// Format coordinates for display
export const formatCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}; 