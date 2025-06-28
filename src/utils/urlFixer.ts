import { Platform } from 'react-native';

/**
 * Fix URL for Android emulator - replace localhost with 10.0.2.2
 * @param url - Original URL from Supabase
 * @returns Fixed URL that works with Android emulator
 */
export const fixUrlForAndroidEmulator = (url: string): string => {
  if (Platform.OS === 'android' && __DEV__ && url.includes('localhost')) {
    // For Android emulator in development, use 10.0.2.2 instead of localhost
    return url.replace('localhost', '10.0.2.2');
  }
  return url;
};

/**
 * Fix URL for display - ensures the URL works on current platform
 * @param url - Original URL
 * @returns Platform-appropriate URL
 */
export const fixUrlForDisplay = (url: string | null): string | null => {
  if (!url) return null;
  return fixUrlForAndroidEmulator(url);
}; 