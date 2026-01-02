import { notificationService } from './notificationService';
import { GPS_CONFIG } from './locationService';

export interface SpeedLimitData {
  speedLimit: number; // km/h
  roadType: string; // highway, urban, rural
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface DriverWarning {
  id: string;
  type: 'speed_over_limit' | 'fatigue_warning' | 'safety_alert' | 'maintenance_due';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  data?: any;
}

export interface DriverWarningState {
  currentSpeed: number;
  speedLimit: number | null;
  isOverSpeedLimit: boolean;
  overSpeedPercentage: number;
  warnings: DriverWarning[];
  activeWarnings: DriverWarning[];
  lastWarningTime: number;
  drivingStartTime: number;
  continuousDrivingHours: number;
  lastBreakTime: number;
}

class DriverWarningService {
  private static instance: DriverWarningService;
  private warningState: DriverWarningState;
  private speedCheckInterval: NodeJS.Timeout | null = null;
  private fatigueCheckInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.warningState = {
      currentSpeed: 0,
      speedLimit: null,
      isOverSpeedLimit: false,
      overSpeedPercentage: 0,
      warnings: [],
      activeWarnings: [],
      lastWarningTime: 0,
      drivingStartTime: Date.now(),
      continuousDrivingHours: 0,
      lastBreakTime: Date.now(),
    };
  }

  public static getInstance(): DriverWarningService {
    if (!DriverWarningService.instance) {
      DriverWarningService.instance = new DriverWarningService();
    }
    return DriverWarningService.instance;
  }

  /**
   * Initialize warning system
   */
  public initialize(userId: string): void {
    console.log('🚨 Driver Warning Service initialized');

    // Start monitoring intervals
    this.startSpeedMonitoring(userId);
    this.startFatigueMonitoring(userId);

    // Reset state
    this.warningState = {
      currentSpeed: 0,
      speedLimit: null,
      isOverSpeedLimit: false,
      overSpeedPercentage: 0,
      warnings: [],
      activeWarnings: [],
      lastWarningTime: Date.now(),
      drivingStartTime: Date.now(),
      continuousDrivingHours: 0,
      lastBreakTime: Date.now(),
    };
  }

  /**
   * Stop warning system
   */
  public stop(): void {
    console.log('🛑 Driver Warning Service stopped');

    if (this.speedCheckInterval) {
      clearInterval(this.speedCheckInterval);
      this.speedCheckInterval = null;
    }

    if (this.fatigueCheckInterval) {
      clearInterval(this.fatigueCheckInterval);
      this.fatigueCheckInterval = null;
    }
  }

  /**
   * Start speed limit monitoring
   */
  private startSpeedMonitoring(userId: string): void {
    // Check speed every 3 seconds for more responsive warnings
    this.speedCheckInterval = setInterval(async () => {
      if (this.warningState.currentSpeed > 5) { // Check even at low speeds for accuracy
        await this.checkSpeedLimit(userId);
      }
    }, 3000);
  }

  /**
   * Start fatigue monitoring
   */
  private startFatigueMonitoring(userId: string): void {
    // Check fatigue every 15 minutes
    this.fatigueCheckInterval = setInterval(() => {
      this.checkFatigue(userId);
    }, 15 * 60 * 1000); // 15 minutes
  }

  /**
   * Update current speed and check for violations
   */
  public async updateSpeed(speedKmh: number, location: { latitude: number; longitude: number }, userId: string): Promise<void> {
    const previousSpeed = this.warningState.currentSpeed;
    this.warningState.currentSpeed = speedKmh;

    // Get speed limit for current location
    const speedLimitData = await this.getSpeedLimit(location.latitude, location.longitude);
    if (speedLimitData) {
      this.warningState.speedLimit = speedLimitData.speedLimit;

      // Check for speed violations
      const overSpeed = speedKmh - speedLimitData.speedLimit;
      const overSpeedPercentage = (overSpeed / speedLimitData.speedLimit) * 100;

      this.warningState.isOverSpeedLimit = overSpeed > 0;
      this.warningState.overSpeedPercentage = overSpeedPercentage;

      // Trigger warning based on severity levels
      if (overSpeed >= 5) { // At least 5 km/h over limit
        if (overSpeed >= 20 || overSpeedPercentage >= 25) {
          // Critical: 20+ km/h or 25%+ over limit
          await this.triggerSpeedWarning(userId, speedKmh, speedLimitData.speedLimit, overSpeedPercentage, location, 'critical');
        } else if (overSpeed >= 15 || overSpeedPercentage >= 20) {
          // High: 15+ km/h or 20%+ over limit
          await this.triggerSpeedWarning(userId, speedKmh, speedLimitData.speedLimit, overSpeedPercentage, location, 'high');
        } else if (overSpeed >= 10 || overSpeedPercentage >= 15) {
          // Medium: 10+ km/h or 15%+ over limit
          await this.triggerSpeedWarning(userId, speedKmh, speedLimitData.speedLimit, overSpeedPercentage, location, 'medium');
        } else {
          // Low: 5+ km/h over limit
          await this.triggerSpeedWarning(userId, speedKmh, speedLimitData.speedLimit, overSpeedPercentage, location, 'low');
        }
      }
    }
  }

  /**
   * Get speed limit for location using Overpass API (same as Putni Nalog)
   */
  private async getSpeedLimit(latitude: number, longitude: number): Promise<SpeedLimitData | null> {
    try {
      console.log(`🚦 Fetching speed limit for: ${latitude}, ${longitude}`);

      // Use Overpass API query like in Putni Nalog
      // We use a small radius around the point to find the nearest road with a speed limit
      // The query looks for ways with 'maxspeed' tag or major highways
      // 🔧 Increased radius to 100m for high-speed GPS tolerance
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
        console.warn('🚦 Speed limit server error:', response.status);
        return null;
      }

      const data = await response.json();
      console.log('🚦 Speed limit raw data elements:', data?.elements?.length);

      if (data && data.elements && data.elements.length > 0) {
        // 1. Try to find explicit maxspeed
        const elementWithSpeed = data.elements.find((el: any) => el.tags && el.tags.maxspeed);

        if (elementWithSpeed) {
          const maxspeed = elementWithSpeed.tags.maxspeed;
          const limit = parseInt(maxspeed.replace(/[^0-9]/g, ''), 10);

          if (!isNaN(limit)) {
            console.log('🚦 Found explicit speed limit:', limit, 'km/h');
            return {
              speedLimit: limit,
              roadType: this.getRoadType(elementWithSpeed.tags.highway),
              location: { latitude, longitude }
            };
          }
        }

        // 2. Fallback based on highway type (Smart Defaults for Montenegro)
        const highway = data.elements[0].tags.highway;
        let defaultLimit = 50; // Default urban speed

        if (highway === 'motorway') defaultLimit = 100;
        else if (highway === 'trunk' || highway === 'primary') defaultLimit = 80;
        else if (highway === 'secondary') defaultLimit = 60;

        console.log('🚦 Using highway default speed limit:', defaultLimit, 'km/h for', highway);
        return {
          speedLimit: defaultLimit,
          roadType: this.getRoadType(highway),
          location: { latitude, longitude }
        };
      }

      console.log('🚦 No speed limit data found, using default 50 km/h');
      return {
        speedLimit: 50, // Default urban speed
        roadType: 'urban',
        location: { latitude, longitude }
      };

    } catch (error) {
      console.error('🚦 Error fetching speed limit:', error);
      return {
        speedLimit: 50, // Safe default
        roadType: 'urban',
        location: { latitude, longitude }
      };
    }
  }

  /**
   * Get road type from highway tag
   */
  private getRoadType(highway: string): string {
    switch (highway) {
      case 'motorway':
        return 'motorway';
      case 'trunk':
      case 'primary':
        return 'main';
      case 'secondary':
      case 'tertiary':
        return 'secondary';
      default:
        return 'urban';
    }
  }

  /**
   * Get speed warning title based on severity
   */
  private getSpeedWarningTitle(severity: 'low' | 'medium' | 'high' | 'critical'): string {
    switch (severity) {
      case 'critical':
        return '🚨 KRITIČNA BRZINA!';
      case 'high':
        return '⚠️ Visoka brzina!';
      case 'medium':
        return '⚠️ Prekomjerna brzina!';
      case 'low':
      default:
        return 'ℹ️ Brzina iznad limita';
    }
  }

  /**
   * Trigger speed warning
   */
  private async triggerSpeedWarning(
    userId: string,
    currentSpeed: number,
    speedLimit: number,
    overSpeedPercentage: number,
    location: { latitude: number; longitude: number },
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<void> {
    // Prevent spam warnings (minimum 2 minutes between warnings)
    const now = Date.now();
    if (now - this.warningState.lastWarningTime < 2 * 60 * 1000) {
      return;
    }

    this.warningState.lastWarningTime = now;

    const warning: DriverWarning = {
      id: `speed_${now}`,
      type: 'speed_over_limit',
      severity: severity,
      title: this.getSpeedWarningTitle(severity),
      message: `Trenutna brzina: ${currentSpeed} km/h (ograničenje: ${speedLimit} km/h)`,
      timestamp: now,
      location,
      data: {
        currentSpeed,
        speedLimit,
        overSpeedPercentage: Math.round(overSpeedPercentage)
      }
    };

    // Add to active warnings
    this.warningState.activeWarnings.push(warning);
    this.warningState.warnings.push(warning);

    // Keep only last 10 warnings
    if (this.warningState.warnings.length > 10) {
      this.warningState.warnings = this.warningState.warnings.slice(-10);
    }

    // Send notification
    await notificationService.sendSystemNotification(
      userId,
      warning.title,
      warning.message,
      {
        type: 'driver_warning',
        warningId: warning.id,
        location
      }
    );

    console.log('🚨 Speed warning triggered:', warning);
  }

  /**
   * Check driver fatigue
   */
  private async checkFatigue(userId: string): Promise<void> {
    const now = Date.now();
    const drivingDuration = (now - this.warningState.drivingStartTime) / (1000 * 60 * 60); // hours
    const timeSinceLastBreak = (now - this.warningState.lastBreakTime) / (1000 * 60 * 60); // hours

    this.warningState.continuousDrivingHours = drivingDuration;

    // EU driving time regulations
    if (drivingDuration > 4.5 && timeSinceLastBreak > 4.5) {
      await this.triggerFatigueWarning(userId, drivingDuration, timeSinceLastBreak);
    }
  }

  /**
   * Trigger fatigue warning
   */
  private async triggerFatigueWarning(userId: string, drivingHours: number, hoursSinceBreak: number): Promise<void> {
    const warning: DriverWarning = {
      id: `fatigue_${Date.now()}`,
      type: 'fatigue_warning',
      severity: drivingHours > 9 ? 'critical' : 'high',
      title: '😴 Umor vozača!',
      message: `Vožnja traje ${Math.round(drivingHours)} sati bez pauze. Preporučuje se pauza!`,
      timestamp: Date.now(),
      data: {
        drivingHours: Math.round(drivingHours),
        hoursSinceBreak: Math.round(hoursSinceBreak)
      }
    };

    // Add to active warnings
    this.warningState.activeWarnings.push(warning);
    this.warningState.warnings.push(warning);

    // Send notification
    await notificationService.sendSystemNotification(
      userId,
      warning.title,
      warning.message,
      {
        type: 'driver_warning',
        warningId: warning.id
      }
    );

    console.log('🚨 Fatigue warning triggered:', warning);
  }

  /**
   * Record break/pause
   */
  public recordBreak(): void {
    this.warningState.lastBreakTime = Date.now();
    this.warningState.continuousDrivingHours = 0;

    // Clear fatigue warnings
    this.warningState.activeWarnings = this.warningState.activeWarnings.filter(
      w => w.type !== 'fatigue_warning'
    );

    console.log('⏸️ Break recorded, fatigue timer reset');
  }

  /**
   * Get current warning state
   */
  public getWarningState(): DriverWarningState {
    return { ...this.warningState };
  }

  /**
   * Get active warnings
   */
  public getActiveWarnings(): DriverWarning[] {
    return [...this.warningState.activeWarnings];
  }

  /**
   * Clear warning
   */
  public clearWarning(warningId: string): void {
    this.warningState.activeWarnings = this.warningState.activeWarnings.filter(
      w => w.id !== warningId
    );
    console.log('✅ Warning cleared:', warningId);
  }

  /**
   * Clear all active warnings
   */
  public clearAllWarnings(): void {
    this.warningState.activeWarnings = [];
    console.log('✅ All warnings cleared');
  }

  /**
   * Check if driver should be warned about maintenance
   */
  public async checkMaintenanceWarnings(userId: string, vehicleId: string): Promise<void> {
    // This would integrate with vehicle maintenance system
    // For now, just a placeholder
    console.log('🔧 Maintenance check for vehicle:', vehicleId);
  }

  /**
   * Get safety recommendations based on current conditions
   */
  public getSafetyRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.warningState.isOverSpeedLimit) {
      recommendations.push('Smanjite brzinu na dozvoljenu granicu');
    }

    if (this.warningState.continuousDrivingHours > 2) {
      recommendations.push('Razmotrite kratku pauzu za odmor');
    }

    if (this.warningState.continuousDrivingHours > 4) {
      recommendations.push('Obavezna pauza od 15-30 minuta');
    }

    return recommendations;
  }
}

export const driverWarningService = DriverWarningService.getInstance();
export default driverWarningService;
