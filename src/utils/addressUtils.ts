/**
 * Utility functions for address formatting and truncation
 */

/**
 * Truncate long addresses to display only essential parts
 */
export const truncateAddress = (address: string, maxLength: number = 30): string => {
  if (!address || address.length <= maxLength) {
    return address;
  }

  // Remove country suffix if present
  const withoutCountry = address.replace(/, Crna Gora \/ Црна Гора$/, '').replace(/, Montenegro$/, '');
  
  if (withoutCountry.length <= maxLength) {
    return withoutCountry;
  }

  // Split by commas and take first few parts
  const parts = withoutCountry.split(', ');
  
  if (parts.length >= 2) {
    // Try first two parts (street, city)
    const shortVersion = `${parts[0]}, ${parts[1]}`;
    if (shortVersion.length <= maxLength) {
      return shortVersion;
    }
    
    // If still too long, just use first part
    if (parts[0].length <= maxLength) {
      return parts[0];
    }
  }

  // Last resort: truncate and add ellipsis
  return address.substring(0, maxLength - 3) + '...';
};

/**
 * Get short display name for common POI addresses
 */
export const getShortDisplayName = (address: string): string => {
  const lowerAddress = address.toLowerCase();
  
  // Known POI mappings
  if (lowerAddress.includes('manastirska')) {
    return 'WH (Warehouse)';
  }
  
  if (lowerAddress.includes('vukašina markovića') || lowerAddress.includes('kruševac')) {
    return 'H.Office';
  }
  
  if (lowerAddress.includes('studio mouse') || lowerAddress.includes('mouse')) {
    return 'Studio Mouse';
  }
  
  if (lowerAddress.includes('podgorica airport') || lowerAddress.includes('aerodrom podgorica')) {
    return 'PG Airport';
  }
  
  if (lowerAddress.includes('tivat airport') || lowerAddress.includes('aerodrom tivat')) {
    return 'TV Airport';
  }
  
  // If no known mapping, use truncation
  return truncateAddress(address, 25);
};

/**
 * Format route display name from start and end addresses
 */
export const formatRouteDisplay = (startAddress: string, endAddress: string): string => {
  const shortStart = getShortDisplayName(startAddress);
  const shortEnd = getShortDisplayName(endAddress);
  
  return `${shortStart} → ${shortEnd}`;
}; 