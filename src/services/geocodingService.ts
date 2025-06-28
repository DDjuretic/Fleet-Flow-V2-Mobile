import { LocationCoordinates } from './locationService';

export interface GeocodeResult {
  coordinates: LocationCoordinates;
  displayName: string;
  success: boolean;
  error?: string;
}

// Nominatim API (OpenStreetMap) - besplatan geocoding servis
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

/**
 * Geocode address using OpenStreetMap Nominatim API
 */
export const geocodeAddress = async (address: string): Promise<GeocodeResult> => {
  try {
    if (!address || address.trim().length === 0) {
      throw new Error('Address is required');
    }

    console.log('🌍 Geocoding address:', address);

    // First try local fallback geocoding (more accurate for known locations)
    const fallbackCoords = getFallbackCoordinates(address);
    const isKnownLocation = !isDefaultCoordinates(fallbackCoords);
    
    if (isKnownLocation) {
      console.log('✅ Using local geocoding for known location:', {
        address,
        coordinates: `${fallbackCoords.latitude}, ${fallbackCoords.longitude}`
      });
      
      return {
        coordinates: fallbackCoords,
        displayName: address,
        success: true
      };
    }

    // If not a known location, try Nominatim API
    console.log('🌍 Unknown location, trying Nominatim API...');
    
    const cleanAddress = address.trim();
    
    // Build Nominatim API URL
    const params = new URLSearchParams({
      q: cleanAddress,
      format: 'json',
      limit: '1',
      addressdetails: '1',
      'accept-language': 'en,sr,me', // Support multiple languages
      countrycodes: 'me,rs,ba,hr', // Focus on Balkans region
    });

    const url = `${NOMINATIM_BASE_URL}?${params.toString()}`;
    
    console.log('🌍 Nominatim API call:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'FleetFlow-Mobile-App/1.0', // Required by Nominatim
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error('No geocoding results found');
    }

    const result = data[0];
    
    const coordinates: LocationCoordinates = {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      timestamp: Date.now()
    };

    const geocodeResult: GeocodeResult = {
      coordinates,
      displayName: result.display_name || address,
      success: true
    };

    console.log('✅ Nominatim geocoding successful:', {
      address: cleanAddress,
      coordinates: `${coordinates.latitude}, ${coordinates.longitude}`,
      displayName: geocodeResult.displayName
    });

    return geocodeResult;

  } catch (error) {
    console.error('❌ Geocoding error:', error);
    
    // Final fallback to default coordinates
    const fallbackCoords = getFallbackCoordinates(address);
    
    return {
      coordinates: fallbackCoords,
      displayName: address,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown geocoding error'
    };
  }
};

/**
 * Check if coordinates are default Montenegro center (unknown location)
 */
const isDefaultCoordinates = (coords: LocationCoordinates): boolean => {
  const defaultLat = 42.7087;
  const defaultLng = 19.3744;
  return Math.abs(coords.latitude - defaultLat) < 0.001 && Math.abs(coords.longitude - defaultLng) < 0.001;
};

/**
 * Fallback coordinates for common locations when geocoding fails
 */
const getFallbackCoordinates = (address: string): LocationCoordinates => {
  const lowerAddress = address.toLowerCase();
  const timestamp = Date.now();
  
  // Montenegro locations
  if (lowerAddress.includes('podgorica')) {
    if (lowerAddress.includes('manastirska')) {
      return { longitude: 19.2594, latitude: 42.4304, timestamp }; // Manastirska street - WH warehouse
    }
    if (lowerAddress.includes('vukašina markovića') || lowerAddress.includes('kruševac')) {
      return { longitude: 19.2478, latitude: 42.4307, timestamp }; // H.Office - Dr Vukašina Markovića (Kruševac settlement)
    }
    if (lowerAddress.includes('studio mouse') || lowerAddress.includes('mouse')) {
      return { longitude: 19.3047, latitude: 42.4697, timestamp }; // Studio Mouse - Rogame (tačne koordinate)
    }
    if (lowerAddress.includes('carinski terminal') || lowerAddress.includes('terminal')) {
      return { longitude: 19.2800, latitude: 42.4400, timestamp }; // Carinski terminal
    }
    if (lowerAddress.includes('centar') || lowerAddress.includes('center')) {
      return { longitude: 19.2633, latitude: 42.4415, timestamp }; // Podgorica center
    }
    return { longitude: 19.2633, latitude: 42.4415, timestamp }; // Default Podgorica
  }
  
  if (lowerAddress.includes('nikšić') || lowerAddress.includes('niksic')) {
    return { longitude: 18.9492, latitude: 42.7731, timestamp };
  }
  
  if (lowerAddress.includes('bar')) {
    return { longitude: 19.0864, latitude: 42.0938, timestamp };
  }
  
  if (lowerAddress.includes('budva')) {
    return { longitude: 18.8404, latitude: 42.2864, timestamp };
  }
  
  if (lowerAddress.includes('cetinje')) {
    return { longitude: 18.9247, latitude: 42.3911, timestamp };
  }
  
  if (lowerAddress.includes('herceg novi')) {
    return { longitude: 18.5378, latitude: 42.4537, timestamp };
  }
  
  if (lowerAddress.includes('kotor')) {
    return { longitude: 18.7681, latitude: 42.4247, timestamp };
  }
  
  if (lowerAddress.includes('tivat')) {
    return { longitude: 18.6956, latitude: 42.4370, timestamp };
  }
  
  if (lowerAddress.includes('ulcinj')) {
    return { longitude: 19.2158, latitude: 41.9297, timestamp };
  }
  
  // Serbia locations
  if (lowerAddress.includes('beograd') || lowerAddress.includes('belgrade')) {
    return { longitude: 20.4489, latitude: 44.7866, timestamp };
  }
  
  if (lowerAddress.includes('novi sad')) {
    return { longitude: 19.8335, latitude: 45.2671, timestamp };
  }
  
  if (lowerAddress.includes('niš') || lowerAddress.includes('nis')) {
    return { longitude: 21.8958, latitude: 43.3209, timestamp };
  }
  
  // Bosnia and Herzegovina
  if (lowerAddress.includes('sarajevo')) {
    return { longitude: 18.4131, latitude: 43.8563, timestamp };
  }
  
  if (lowerAddress.includes('mostar')) {
    return { longitude: 17.8078, latitude: 43.3438, timestamp };
  }
  
  // Croatia
  if (lowerAddress.includes('zagreb')) {
    return { longitude: 15.9819, latitude: 45.8150, timestamp };
  }
  
  if (lowerAddress.includes('split')) {
    return { longitude: 16.4402, latitude: 43.5081, timestamp };
  }
  
  if (lowerAddress.includes('dubrovnik')) {
    return { longitude: 18.0944, latitude: 42.6507, timestamp };
  }
  
  // Default Montenegro center if no match
  return { longitude: 19.3744, latitude: 42.7087, timestamp };
};

/**
 * Reverse geocode coordinates to address
 */
export const reverseGeocode = async (coordinates: LocationCoordinates): Promise<GeocodeResult> => {
  try {
    console.log('🌍 Reverse geocoding:', coordinates);

    const params = new URLSearchParams({
      lat: coordinates.latitude.toString(),
      lon: coordinates.longitude.toString(),
      format: 'json',
      addressdetails: '1',
      'accept-language': 'en,sr,me',
    });

    const url = `https://nominatim.openstreetmap.org/reverse?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'FleetFlow-Mobile-App/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Reverse geocoding error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.error) {
      throw new Error(data?.error || 'No reverse geocoding results');
    }

    const result: GeocodeResult = {
      coordinates,
      displayName: data.display_name || `${coordinates.latitude}, ${coordinates.longitude}`,
      success: true
    };

    console.log('✅ Reverse geocoding successful:', result.displayName);
    return result;

  } catch (error) {
    console.error('❌ Reverse geocoding error:', error);
    
    return {
      coordinates,
      displayName: `${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}`,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown reverse geocoding error'
    };
  }
};

/**
 * Batch geocode multiple addresses
 */
export const batchGeocode = async (addresses: string[]): Promise<GeocodeResult[]> => {
  const results: GeocodeResult[] = [];
  
  // Process addresses sequentially to respect API rate limits
  for (const address of addresses) {
    const result = await geocodeAddress(address);
    results.push(result);
    
    // Small delay to respect Nominatim rate limits (1 request per second)
    await new Promise(resolve => setTimeout(resolve, 1100));
  }
  
  return results;
}; 