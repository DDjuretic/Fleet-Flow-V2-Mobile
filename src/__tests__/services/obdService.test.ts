/**
 * OBD Service Unit Tests
 * Testing vehicle monitoring and diagnostic functionality
 */

import { obdService, OBDService } from '../../services/obdService';

// Mock Supabase
jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: {
              id: 'test-vehicle-id',
              obd_device_address: '00:11:22:33:44:55'
            },
            error: null
          }))
        }))
      })),
      insert: jest.fn(() => Promise.resolve({ error: null }))
    }))
  }
}));

describe('OBDService', () => {
  beforeEach(() => {
    // Reset singleton instance
    (OBDService as any).instance = null;
    jest.clearAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = OBDService.getInstance();
      const instance2 = OBDService.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should export singleton instance', () => {
      expect(obdService).toBeDefined();
      expect(obdService).toBeInstanceOf(OBDService);
    });
  });

  describe('Initialization', () => {
    it('should initialize successfully', async () => {
      const result = await obdService.initialize();
      expect(result).toBe(true);
    });
  });

  describe('Vehicle Compatibility', () => {
    it('should check OBD-II compatibility for modern vehicles', async () => {
      const result = await OBDService.checkVehicleCompatibility('test-vehicle-id');

      expect(result).toHaveProperty('supported');
      expect(result).toHaveProperty('protocol');
      expect(typeof result.supported).toBe('boolean');
    });
  });

  describe('Supported Protocols', () => {
    it('should return list of supported OBD protocols', () => {
      const protocols = OBDService.getSupportedProtocols();

      expect(protocols).toBeInstanceOf(Array);
      expect(protocols.length).toBeGreaterThan(0);
      expect(protocols).toContain('CAN');
    });
  });

  describe('Connection Management', () => {
    it('should have connection status methods', () => {
      const status = obdService.getConnectionStatus();
      expect(status).toBeNull(); // Initially not connected
    });

    it('should manage alerts buffer', () => {
      const initialAlerts = obdService.getAlerts();
      expect(initialAlerts).toBeInstanceOf(Array);

      obdService.clearResolvedAlerts();
      const clearedAlerts = obdService.getAlerts();
      expect(clearedAlerts).toBeInstanceOf(Array);
    });
  });

  describe('Data Generation', () => {
    it('should generate mock OBD data with required fields', () => {
      const obdServiceInstance = OBDService.getInstance();
      const mockData = (obdServiceInstance as any).generateMockOBDData('test-vehicle');

      expect(mockData).toHaveProperty('vehicle_id', 'test-vehicle');
      expect(mockData).toHaveProperty('timestamp');
      expect(mockData).toHaveProperty('engine_rpm');
      expect(mockData).toHaveProperty('engine_temp');
      expect(mockData).toHaveProperty('fuel_level');
      expect(mockData).toHaveProperty('vehicle_speed');
      expect(mockData).toHaveProperty('diagnostic_codes');
      expect(mockData).toHaveProperty('malfunction_indicator');

      // Validate data types
      expect(typeof mockData.engine_rpm).toBe('number');
      expect(typeof mockData.engine_temp).toBe('number');
      expect(typeof mockData.fuel_level).toBe('number');
      expect(typeof mockData.vehicle_speed).toBe('number');
      expect(Array.isArray(mockData.diagnostic_codes)).toBe(true);
      expect(typeof mockData.malfunction_indicator).toBe('boolean');
    });

    it('should generate realistic data ranges', () => {
      const obdServiceInstance = OBDService.getInstance();
      const mockData = (obdServiceInstance as any).generateMockOBDData('test-vehicle');

      // Engine RPM should be reasonable
      expect(mockData.engine_rpm).toBeGreaterThanOrEqual(0);
      expect(mockData.engine_rpm).toBeLessThanOrEqual(5000);

      // Engine temperature should be in normal range
      expect(mockData.engine_temp).toBeGreaterThanOrEqual(85);
      expect(mockData.engine_temp).toBeLessThanOrEqual(115);

      // Fuel level should be percentage
      expect(mockData.fuel_level).toBeGreaterThanOrEqual(0);
      expect(mockData.fuel_level).toBeLessThanOrEqual(100);

      // Vehicle speed should be reasonable
      expect(mockData.vehicle_speed).toBeGreaterThanOrEqual(0);
      expect(mockData.vehicle_speed).toBeLessThanOrEqual(200);
    });
  });

  describe('Alert System', () => {
    it('should detect engine overheat', async () => {
      const obdServiceInstance = OBDService.getInstance();

      // Mock overheat data
      const overheatData = {
        vehicle_id: 'test-vehicle',
        timestamp: new Date(),
        engine_temp: 110, // Overheat threshold
        fuel_level: 50,
        vehicle_speed: 60,
        diagnostic_codes: [],
        malfunction_indicator: false
      };

      // Clear existing alerts
      obdService.clearResolvedAlerts();

      // Check for alerts
      await (obdServiceInstance as any).checkForAlerts(overheatData);

      const alerts = obdService.getAlerts();
      const overheatAlert = alerts.find(alert => alert.code === 'ENGINE_OVERHEAT');

      expect(overheatAlert).toBeDefined();
      expect(overheatAlert?.type).toBe('error');
      expect(overheatAlert?.severity).toBe('high');
    });

    it('should detect low fuel level', async () => {
      const obdServiceInstance = OBDService.getInstance();

      // Mock low fuel data
      const lowFuelData = {
        vehicle_id: 'test-vehicle',
        timestamp: new Date(),
        engine_temp: 90,
        fuel_level: 10, // Low fuel threshold
        vehicle_speed: 60,
        diagnostic_codes: [],
        malfunction_indicator: false
      };

      // Clear existing alerts
      obdService.clearResolvedAlerts();

      // Check for alerts
      await (obdServiceInstance as any).checkForAlerts(lowFuelData);

      const alerts = obdService.getAlerts();
      const fuelAlert = alerts.find(alert => alert.code === 'LOW_FUEL');

      expect(fuelAlert).toBeDefined();
      expect(fuelAlert?.type).toBe('warning');
      expect(fuelAlert?.severity).toBe('medium');
    });

    it('should detect diagnostic trouble codes', async () => {
      const obdServiceInstance = OBDService.getInstance();

      // Mock DTC data
      const dtcData = {
        vehicle_id: 'test-vehicle',
        timestamp: new Date(),
        engine_temp: 90,
        fuel_level: 50,
        vehicle_speed: 60,
        diagnostic_codes: ['P0300', 'P0171'], // Trouble codes
        malfunction_indicator: true
      };

      // Clear existing alerts
      obdService.clearResolvedAlerts();

      // Check for alerts
      await (obdServiceInstance as any).checkForAlerts(dtcData);

      const alerts = obdService.getAlerts();
      const dtcAlert = alerts.find(alert => alert.code === 'DIAGNOSTIC_CODES');

      expect(dtcAlert).toBeDefined();
      expect(dtcAlert?.type).toBe('error');
      expect(dtcAlert?.severity).toBe('high');
    });
  });
});
