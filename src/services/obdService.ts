/**
 * OBD-II Service - Vehicle diagnostic and monitoring system
 * Fusion-ready for hardware integration with FleetFlow field operations
 *
 * Features:
 * - Real-time vehicle parameter monitoring
 * - Diagnostic trouble codes (DTC) reading
 * - Fuel level and consumption tracking
 * - Engine performance metrics
 * - Hardware connection management
 * - Offline data buffering
 */

import { supabase } from '../lib/supabase';

// OBD-II Data Interfaces
export interface OBDData {
  vehicle_id: string;
  timestamp: Date;

  // Engine parameters
  engine_rpm: number;
  engine_temp: number; // Celsius
  engine_load: number; // Percentage

  // Vehicle dynamics
  vehicle_speed: number; // km/h
  throttle_position: number; // Percentage

  // Fuel system
  fuel_level: number; // Percentage
  fuel_pressure: number; // kPa
  fuel_consumption_rate: number; // L/h

  // Electrical system
  battery_voltage: number; // Volts
  alternator_output: number; // Volts

  // Emissions & Environment
  oxygen_sensor_voltage: number; // Volts
  catalytic_converter_temp: number; // Celsius

  // Diagnostic codes
  diagnostic_codes: string[]; // DTC codes
  malfunction_indicator: boolean;

  // GPS correlation
  latitude?: number;
  longitude?: number;
  gps_accuracy?: number;
}

export interface OBDConnectionStatus {
  connected: boolean;
  device_address?: string;
  protocol?: string;
  last_ping: Date;
  signal_strength?: number;
  battery_level?: number;
}

export interface OBDAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  vehicle_id: string;
  resolved: boolean;
}

// OBD-II Service Class
export class OBDService {
  private static instance: OBDService;
  private isConnected = false;
  private currentVehicleId: string | null = null;
  private connectionStatus: OBDConnectionStatus | null = null;
  private dataBuffer: OBDData[] = [];
  private alertsBuffer: OBDAlert[] = [];

  // Configuration
  private static readonly BUFFER_SIZE = 100;
  private static readonly SYNC_INTERVAL = 30000; // 30 seconds
  private static readonly CONNECTION_TIMEOUT = 5000; // 5 seconds

  private constructor() {}

  public static getInstance(): OBDService {
    if (!OBDService.instance) {
      OBDService.instance = new OBDService();
    }
    return OBDService.instance;
  }

  /**
   * Initialize OBD-II service
   */
  async initialize(): Promise<boolean> {
    try {
      console.log('[OBDService] Initializing OBD-II service...');

      // For development: simulate initialization
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('[OBDService] OBD-II service initialized (simulation mode)');
      return true;
    } catch (error) {
      console.error('[OBDService] Initialization failed:', error);
      return false;
    }
  }

  /**
   * Connect to OBD-II device
   */
  async connect(vehicleId: string, deviceAddress?: string): Promise<boolean> {
    try {
      console.log(`[OBDService] Connecting to vehicle ${vehicleId}...`);

      // Validate vehicle exists
      const { data: vehicle, error } = await supabase
        .from('vehicles')
        .select('id, obd_device_address')
        .eq('id', vehicleId)
        .single();

      if (error || !vehicle) {
        throw new Error(`Vehicle ${vehicleId} not found`);
      }

      // Use provided address or stored address
      const address = deviceAddress || vehicle.obd_device_address;

      if (!address) {
        throw new Error('No OBD device address configured');
      }

      // Simulate connection process
      await this.simulateConnection(address);

      this.isConnected = true;
      this.currentVehicleId = vehicleId;
      this.connectionStatus = {
        connected: true,
        device_address: address,
        protocol: 'CAN', // Simulated
        last_ping: new Date(),
        signal_strength: 85, // Simulated
        battery_level: 92 // Simulated
      };

      console.log(`[OBDService] Connected to vehicle ${vehicleId}`);
      return true;

    } catch (error) {
      console.error('[OBDService] Connection failed:', error);
      this.isConnected = false;
      this.connectionStatus = null;
      throw error;
    }
  }

  /**
   * Disconnect from OBD-II device
   */
  async disconnect(): Promise<void> {
    try {
      console.log('[OBDService] Disconnecting...');

      // Sync any remaining data
      await this.syncBufferedData();

      this.isConnected = false;
      this.currentVehicleId = null;
      this.connectionStatus = null;

      console.log('[OBDService] Disconnected');
    } catch (error) {
      console.error('[OBDService] Disconnect error:', error);
    }
  }

  /**
   * Get real-time OBD data
   */
  async getRealTimeData(): Promise<OBDData | null> {
    if (!this.isConnected || !this.currentVehicleId) {
      throw new Error('OBD device not connected');
    }

    try {
      // Generate simulated data
      const obdData = this.generateMockOBDData(this.currentVehicleId);

      // Add GPS correlation if available
      await this.enrichWithGPSData(obdData);

      // Check for alerts
      await this.checkForAlerts(obdData);

      // Buffer data for sync
      this.bufferData(obdData);

      return obdData;
    } catch (error) {
      console.error('[OBDService] Failed to get real-time data:', error);
      return null;
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): OBDConnectionStatus | null {
    return this.connectionStatus;
  }

  /**
   * Get buffered alerts
   */
  getAlerts(): OBDAlert[] {
    return [...this.alertsBuffer];
  }

  /**
   * Clear resolved alerts
   */
  clearResolvedAlerts(): void {
    this.alertsBuffer = this.alertsBuffer.filter(alert => !alert.resolved);
  }

  /**
   * Sync buffered data to Supabase
   */
  private async syncBufferedData(): Promise<void> {
    if (this.dataBuffer.length === 0) return;

    try {
      console.log(`[OBDService] Syncing ${this.dataBuffer.length} OBD records...`);

      const { error } = await supabase
        .from('obd_data')
        .insert(this.dataBuffer.map(data => ({
          vehicle_id: data.vehicle_id,
          timestamp: data.timestamp.toISOString(),
          engine_rpm: data.engine_rpm,
          engine_temp: data.engine_temp,
          engine_load: data.engine_load,
          vehicle_speed: data.vehicle_speed,
          throttle_position: data.throttle_position,
          fuel_level: data.fuel_level,
          fuel_pressure: data.fuel_pressure,
          fuel_consumption_rate: data.fuel_consumption_rate,
          battery_voltage: data.battery_voltage,
          alternator_output: data.alternator_output,
          oxygen_sensor_voltage: data.oxygen_sensor_voltage,
          catalytic_converter_temp: data.catalytic_converter_temp,
          diagnostic_codes: data.diagnostic_codes,
          malfunction_indicator: data.malfunction_indicator,
          latitude: data.latitude,
          longitude: data.longitude,
          gps_accuracy: data.gps_accuracy
        })));

      if (error) {
        console.error('[OBDService] Sync error:', error);
      } else {
        console.log(`[OBDService] Successfully synced ${this.dataBuffer.length} records`);
        this.dataBuffer = [];
      }
    } catch (error) {
      console.error('[OBDService] Sync failed:', error);
    }
  }

  /**
   * Generate mock OBD data for development
   */
  private generateMockOBDData(vehicleId: string): OBDData {
    const now = new Date();

    // Simulate realistic vehicle data
    const speed = Math.random() * 120; // 0-120 km/h
    const rpm = speed > 0 ? 800 + Math.random() * 4000 : 0; // Idle or driving RPM
    const engineTemp = 85 + Math.random() * 15; // 85-100°C
    const fuelLevel = 30 + Math.random() * 60; // 30-90%

    // Simulate some diagnostic codes occasionally
    const diagnosticCodes = Math.random() < 0.1 ? ['P0300', 'P0171'] : [];

    return {
      vehicle_id: vehicleId,
      timestamp: now,

      // Engine parameters
      engine_rpm: Math.round(rpm),
      engine_temp: Math.round(engineTemp * 10) / 10,
      engine_load: Math.round((20 + Math.random() * 60) * 10) / 10,

      // Vehicle dynamics
      vehicle_speed: Math.round(speed),
      throttle_position: Math.round((10 + Math.random() * 80) * 10) / 10,

      // Fuel system
      fuel_level: Math.round(fuelLevel * 10) / 10,
      fuel_pressure: Math.round((300 + Math.random() * 200) * 10) / 10,
      fuel_consumption_rate: speed > 0 ? Math.round((5 + Math.random() * 15) * 10) / 10 : 0,

      // Electrical system
      battery_voltage: Math.round((12 + Math.random() * 2) * 10) / 10,
      alternator_output: Math.round((13.5 + Math.random() * 1) * 10) / 10,

      // Emissions & Environment
      oxygen_sensor_voltage: Math.round((0.1 + Math.random() * 0.8) * 100) / 100,
      catalytic_converter_temp: Math.round((200 + Math.random() * 300) * 10) / 10,

      // Diagnostic codes
      diagnostic_codes: diagnosticCodes,
      malfunction_indicator: diagnosticCodes.length > 0,
    };
  }

  /**
   * Enrich OBD data with GPS information
   */
  private async enrichWithGPSData(obdData: OBDData): Promise<void> {
    try {
      // Get current location from GPS service
      const locationService = (await import('./locationService')).locationService;
      const currentLocation = await locationService.getCurrentLocation();

      if (currentLocation) {
        obdData.latitude = currentLocation.latitude;
        obdData.longitude = currentLocation.longitude;
        obdData.gps_accuracy = currentLocation.accuracy;
      }
    } catch (error) {
      console.warn('[OBDService] Could not enrich with GPS data:', error);
    }
  }

  /**
   * Check for alerts in OBD data
   */
  private async checkForAlerts(obdData: OBDData): Promise<void> {
    const alerts: OBDAlert[] = [];

    // Check engine temperature
    if (obdData.engine_temp > 105) {
      alerts.push({
        id: `temp_${Date.now()}`,
        type: 'error',
        code: 'ENGINE_OVERHEAT',
        message: `Engine temperature too high: ${obdData.engine_temp}°C`,
        severity: 'high',
        timestamp: obdData.timestamp,
        vehicle_id: obdData.vehicle_id,
        resolved: false
      });
    }

    // Check fuel level
    if (obdData.fuel_level < 15) {
      alerts.push({
        id: `fuel_${Date.now()}`,
        type: 'warning',
        code: 'LOW_FUEL',
        message: `Low fuel level: ${obdData.fuel_level}%`,
        severity: 'medium',
        timestamp: obdData.timestamp,
        vehicle_id: obdData.vehicle_id,
        resolved: false
      });
    }

    // Check diagnostic codes
    if (obdData.diagnostic_codes.length > 0) {
      alerts.push({
        id: `dtc_${Date.now()}`,
        type: 'error',
        code: 'DIAGNOSTIC_CODES',
        message: `Diagnostic codes detected: ${obdData.diagnostic_codes.join(', ')}`,
        severity: 'high',
        timestamp: obdData.timestamp,
        vehicle_id: obdData.vehicle_id,
        resolved: false
      });
    }

    // Check battery voltage
    if (obdData.battery_voltage < 12.0) {
      alerts.push({
        id: `battery_${Date.now()}`,
        type: 'warning',
        code: 'LOW_BATTERY',
        message: `Battery voltage low: ${obdData.battery_voltage}V`,
        severity: 'medium',
        timestamp: obdData.timestamp,
        vehicle_id: obdData.vehicle_id,
        resolved: false
      });
    }

    // Add alerts to buffer
    this.alertsBuffer.push(...alerts);

    // Limit buffer size
    if (this.alertsBuffer.length > 50) {
      this.alertsBuffer = this.alertsBuffer.slice(-50);
    }
  }

  /**
   * Buffer data for batch sync
   */
  private bufferData(data: OBDData): void {
    this.dataBuffer.push(data);

    // Limit buffer size
    if (this.dataBuffer.length > OBDService.BUFFER_SIZE) {
      this.dataBuffer = this.dataBuffer.slice(-OBDService.BUFFER_SIZE);
    }

    // Auto-sync if buffer is getting full
    if (this.dataBuffer.length >= OBDService.BUFFER_SIZE * 0.8) {
      this.syncBufferedData();
    }
  }

  /**
   * Simulate OBD connection (for development)
   */
  private async simulateConnection(deviceAddress: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          resolve();
        } else {
          reject(new Error('Connection timeout'));
        }
      }, 2000); // Simulate 2 second connection time
    });
  }

  /**
   * Get supported OBD protocols
   */
  static getSupportedProtocols(): string[] {
    return [
      'CAN',
      'ISO 15765-4 (CAN)',
      'ISO 14230-4 (KWP2000)',
      'ISO 9141-2',
      'J1850 VPW',
      'J1850 PWM'
    ];
  }

  /**
   * Check if vehicle supports OBD-II
   */
  static async checkVehicleCompatibility(vehicleId: string): Promise<{
    supported: boolean;
    protocol?: string;
    notes?: string;
  }> {
    try {
      const { data: vehicle, error } = await supabase
        .from('vehicles')
        .select('year, make, model, obd_protocol')
        .eq('id', vehicleId)
        .single();

      if (error || !vehicle) {
        return { supported: false, notes: 'Vehicle not found' };
      }

      // Basic compatibility check (simplified)
      const currentYear = new Date().getFullYear();
      const vehicleYear = vehicle.year;

      if (vehicleYear >= 1996) { // OBD-II mandatory from 1996
        return {
          supported: true,
          protocol: vehicle.obd_protocol || 'CAN',
          notes: 'Vehicle should support OBD-II'
        };
      } else {
        return {
          supported: false,
          notes: 'Vehicle predates OBD-II standard (1996+)'
        };
      }
    } catch (error) {
      console.error('[OBDService] Compatibility check failed:', error);
      return { supported: false, notes: 'Check failed' };
    }
  }
}

// Export singleton instance
export const obdService = OBDService.getInstance();
