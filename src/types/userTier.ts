/**
 * User Tier System for FleetFlow
 * Defines different user levels and their feature access permissions
 *
 * Based on FleetFlow Evolution Roadmap requirements
 */

export enum UserTier {
  BASIC_USER = 'basic_user',
  FIELD_WORKER = 'field_worker',
  ADMINISTRATOR = 'administrator'
}

export interface FeaturePermissions {
  // Core features
  reservations: boolean;
  basicTracking: boolean;

  // Advanced features
  obdIntegration: boolean;
  taskManagement: boolean;
  analytics: boolean;
  wmsIntegration: boolean;
  adminPanel: boolean;

  // Settings access
  userProfile: boolean;
  notifications: boolean;
  themeSettings: boolean;
  languageSettings: boolean;
  unitsSettings: boolean;
  currencySettings: boolean;

  // Advanced settings
  heatMap: boolean;
  osrmSettings: boolean;
  speedLimitSettings: boolean;
  changePassword: boolean;
  helpSupport: boolean;
}

// Feature matrix by user tier
export const FEATURE_MATRIX: Record<UserTier, FeaturePermissions> = {
  [UserTier.BASIC_USER]: {
    // Core features
    reservations: true,
    basicTracking: true,

    // Advanced features - all disabled
    obdIntegration: false,
    taskManagement: false,
    analytics: false,
    wmsIntegration: false,
    adminPanel: false,

    // Basic settings
    userProfile: true,
    notifications: true,
    themeSettings: true,
    languageSettings: true,
    unitsSettings: true,
    currencySettings: true,

    // Advanced settings - disabled
    heatMap: false,
    osrmSettings: false,
    speedLimitSettings: false,
    changePassword: true,
    helpSupport: true,
  },

  [UserTier.FIELD_WORKER]: {
    // Core features
    reservations: true,
    basicTracking: true,

    // Advanced features
    obdIntegration: true,
    taskManagement: true,
    analytics: false,
    wmsIntegration: false,
    adminPanel: false,

    // Settings
    userProfile: true,
    notifications: true,
    themeSettings: true,
    languageSettings: true,
    unitsSettings: true,
    currencySettings: true,

    // Limited advanced settings
    heatMap: false,
    osrmSettings: false,
    speedLimitSettings: false,
    changePassword: true,
    helpSupport: true,
  },

  [UserTier.ADMINISTRATOR]: {
    // All features enabled
    reservations: true,
    basicTracking: true,
    obdIntegration: true,
    taskManagement: true,
    analytics: true,
    wmsIntegration: true,
    adminPanel: true,

    // All settings enabled
    userProfile: true,
    notifications: true,
    themeSettings: true,
    languageSettings: true,
    unitsSettings: true,
    currencySettings: true,
    heatMap: true,
    osrmSettings: true,
    speedLimitSettings: true,
    changePassword: true,
    helpSupport: true,
  },
};

// Helper functions for permission checking
export class UserTierService {
  /**
   * Check if user tier has specific permission
   */
  static hasPermission(tier: UserTier, permission: keyof FeaturePermissions): boolean {
    return FEATURE_MATRIX[tier][permission];
  }

  /**
   * Get all permissions for a user tier
   */
  static getPermissions(tier: UserTier): FeaturePermissions {
    return FEATURE_MATRIX[tier];
  }

  /**
   * Check if user tier can access admin panel
   */
  static canAccessAdminPanel(tier: UserTier): boolean {
    return this.hasPermission(tier, 'adminPanel');
  }

  /**
   * Check if user tier can use OBD integration
   */
  static canUseOBD(tier: UserTier): boolean {
    return this.hasPermission(tier, 'obdIntegration');
  }

  /**
   * Check if user tier can manage tasks
   */
  static canManageTasks(tier: UserTier): boolean {
    return this.hasPermission(tier, 'taskManagement');
  }

  /**
   * Get user-friendly tier name
   */
  static getTierDisplayName(tier: UserTier): string {
    switch (tier) {
      case UserTier.BASIC_USER:
        return 'Basic User';
      case UserTier.FIELD_WORKER:
        return 'Field Worker';
      case UserTier.ADMINISTRATOR:
        return 'Administrator';
      default:
        return 'Unknown';
    }
  }

  /**
   * Get tier description
   */
  static getTierDescription(tier: UserTier): string {
    switch (tier) {
      case UserTier.BASIC_USER:
        return 'Basic reservations and tracking';
      case UserTier.FIELD_WORKER:
        return 'Vehicle operations and task management';
      case UserTier.ADMINISTRATOR:
        return 'Full system administration and analytics';
      default:
        return 'Unknown tier';
    }
  }
}
