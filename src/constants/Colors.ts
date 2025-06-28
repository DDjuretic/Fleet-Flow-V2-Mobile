/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * Based on Fleet Flow original design system.
 */

const Colors = {
  LIGHT: {
    background: '#FFFFFF', // White
    text: '#000000', // Black
    primary: '#007AFF', // Blue
    secondary: '#5856D6', // Purple
    card: '#F2F2F7', // Light gray
    border: '#C7C7CC', // Gray
    textSecondary: '#8E8E93',
    success: '#34C759',
    warning: '#FFCC00',
    danger: '#FF3B30',
    // TabBar Colors for Light theme
    tabBarBackground: '#F2F2F7', // Light gray, similar to card
    tabBarActive: '#007AFF',     // Blue, same as primary
    tabBarInactive: '#8E8E93',   // Gray, same as textSecondary
    tabBarBorder: '#C7C7CC',     // Gray, same as border
  },
  DARK: {
    background: '#121622', // Dark blue-black
    text: '#FFFFFF',
    primary: '#00E0FF', // Cyan
    secondary: '#4A5263', // Light blue-gray
    card: '#1C2237', // Dark card background
    border: '#2A3349',
    textSecondary: '#93A3C0',
    success: '#34C759',
    warning: '#FFCC00',
    danger: '#FF3B30',
    // TabBar Colors for Dark theme
    tabBarBackground: '#1C2237', // Dark card background
    tabBarActive: '#00E0FF',     // Cyan, same as primary
    tabBarInactive: '#637394',   // Light blue-gray
    tabBarBorder: '#2A3349',     // Same as border
  },
  // Main colors for new design
  PRIMARY: '#00E0FF', // Cyan color for active elements
  SECONDARY: '#0D9DFF', // Blue accent color
  WHITE: '#FFFFFF', // White
  BLACK: '#121622', // Dark blue-black background
  GRAY: '#637394', // Light blue-gray for inactive elements
  LIGHT_GRAY: '#93A3C0', // Lighter gray for secondary text
  DARK_GRAY: '#1C2237', // Dark blue for card backgrounds
  DARK_BACKGROUND: '#121622', // Main app background
  CARD_BACKGROUND: '#1C2237', // For card components
  DANGER: '#FF3B30', // Red
  WARNING: '#FFCC00', // Yellow
  SUCCESS: '#34C759', // Green
  BUTTON_PRIMARY: '#00E0FF', // For primary buttons
  BUTTON_SECONDARY: '#2A3349', // For secondary buttons
  TEXT_PRIMARY: '#FFFFFF', // Main text
  TEXT_SECONDARY: '#93A3C0', // Secondary text
  TEXT_HIGHLIGHT: '#00E0FF', // Highlighted text
  BORDER: '#2A3349', // Border color
  MENU_BACKGROUND: '#1C2237', // Tab bar background
  MENU_ACTIVE: '#00E0FF', // Active tab
  MENU_INACTIVE: '#637394', // Inactive tab
};

export default Colors; 