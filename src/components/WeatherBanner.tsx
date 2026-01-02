import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Colors from '../constants/Colors';
import { useTripTracking } from '../hooks/useTripTracking';
import { weatherService, WeatherData } from '../services/weatherService';
import { driverWarningService, DriverWarning } from '../services/driverWarningService';
import { useAuth } from '../contexts/AuthContext';

interface WeatherBannerProps {
  themeMode: 'light' | 'dark';
}

const WeatherBanner: React.FC<WeatherBannerProps> = ({ themeMode }) => {
  const { t } = useTranslation();
  const tripTracking = useTripTracking();
  const { user } = useAuth();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [warnings, setWarnings] = useState<DriverWarning[]>([]);
  const [showWarnings, setShowWarnings] = useState(false);

  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.card,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    primary: Colors.DARK.primary,
    border: Colors.DARK.border,
    success: '#34C759',
    warning: '#FFCC00',
    danger: '#FF3B30',
  } : {
    background: Colors.LIGHT.card,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    primary: Colors.LIGHT.primary,
    border: Colors.LIGHT.border,
    success: '#34C759',
    warning: '#FFCC00',
    danger: '#FF3B30',
  };

  useEffect(() => {
    fetchWeather();

    // Initialize warning service when user starts tracking
    if (user?.user_id) {
      driverWarningService.initialize(user.user_id);
    }

    return () => {
      // Cleanup when component unmounts
      driverWarningService.stop();
    };
  }, [user?.user_id]);

  // Monitor warnings and speed
  useEffect(() => {
    if (tripTracking.isTracking && tripTracking.currentSpeed > 0) {
      // Update speed in warning service
      driverWarningService.updateSpeed(
        tripTracking.currentSpeed,
        tripTracking.lastLocation || { latitude: 0, longitude: 0 },
        user?.user_id || ''
      );
    }

    // Update warnings display
    const activeWarnings = driverWarningService.getActiveWarnings();
    setWarnings(activeWarnings);

    // Auto-show warnings if there are critical ones
    const hasCritical = activeWarnings.some(w => w.severity === 'critical');
    if (hasCritical && !showWarnings) {
      setShowWarnings(true);
    }
  }, [tripTracking.currentSpeed, tripTracking.isTracking, user?.user_id]);

  // Record break when trip is paused
  useEffect(() => {
    if (tripTracking.isPaused) {
      driverWarningService.recordBreak();
    }
  }, [tripTracking.isPaused]);

  const fetchWeather = async () => {
    try {
      console.log('🌤️ WeatherBanner: Fetching current location weather...');
      const weatherData = await weatherService.getCurrentLocationWeather();
      setWeather(weatherData);
      setLoading(false);
      console.log('🌤️ WeatherBanner: Weather data loaded:', weatherData);
    } catch (error) {
      console.error('🌤️ WeatherBanner: Failed to fetch weather:', error);
      // Set fallback weather data
      setWeather({
        temperature: 0,
        condition: 'Not available',
        location: 'Unknown',
        humidity: 0,
        windSpeed: 0,
        error: 'Failed to load weather'
      });
      setLoading(false);
    }
  };

  const retryWeather = () => {
    console.log('🌤️ WeatherBanner: Retrying weather fetch...');
    setLoading(true);
    setWeather(null);
    fetchWeather();
  };

  const toggleWarnings = () => {
    setShowWarnings(!showWarnings);
  };

  const clearWarning = (warningId: string) => {
    driverWarningService.clearWarning(warningId);
    const updatedWarnings = driverWarningService.getActiveWarnings();
    setWarnings(updatedWarnings);

    if (updatedWarnings.length === 0) {
      setShowWarnings(false);
    }
  };

  const getWarningIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'speed_over_limit': return 'speedometer-outline';
      case 'fatigue_warning': return 'cafe-outline';
      case 'safety_alert': return 'shield-checkmark-outline';
      case 'maintenance_due': return 'build-outline';
      default: return 'warning-outline';
    }
  };

  const getWarningColor = (severity: string) => {
    switch (severity) {
      case 'critical': return screenColors.danger;
      case 'high': return screenColors.warning;
      case 'medium': return '#FFA500'; // Orange
      case 'low': return screenColors.primary;
      default: return screenColors.textSecondary;
    }
  };

  const getWeatherIcon = (condition: string): keyof typeof Ionicons.glyphMap => {
    return weatherService.getWeatherIcon(condition) as keyof typeof Ionicons.glyphMap;
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: screenColors.background }]}>
        <ActivityIndicator size="small" color={screenColors.primary} />
      </View>
    );
  }

  if (weather?.error) {
    return (
      <View style={[styles.container, { backgroundColor: screenColors.background }]}>
        <View style={styles.weatherSection}>
          <View style={styles.weatherLeft}>
            <Ionicons
              name="warning-outline"
              size={24}
              color={screenColors.warning}
            />
            <View style={styles.weatherInfo}>
              <Text style={[styles.temperature, { color: screenColors.text }]}>
                Weather Unavailable
              </Text>
              <Text style={[styles.location, { color: screenColors.textSecondary }]}>
                Check connection
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: screenColors.primary }]}
            onPress={retryWeather}
          >
            <Ionicons name="refresh-outline" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: screenColors.background }]}>
      {/* Warnings Section - Show if there are active warnings */}
      {warnings.length > 0 && (
        <View style={styles.warningsSection}>
          <TouchableOpacity style={styles.warningsHeader} onPress={toggleWarnings}>
            <View style={styles.warningsLeft}>
              <Ionicons
                name="warning"
                size={20}
                color={getWarningColor(warnings[0]?.severity || 'medium')}
              />
              <Text style={[styles.warningsCount, { color: screenColors.text }]}>
                {warnings.length} upozorenje{warnings.length > 1 ? 'a' : ''}
              </Text>
            </View>
            <Ionicons
              name={showWarnings ? "chevron-up" : "chevron-down"}
              size={20}
              color={screenColors.textSecondary}
            />
          </TouchableOpacity>

          {showWarnings && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.warningsList}>
              {warnings.map((warning) => (
                <View key={warning.id} style={[styles.warningCard, { borderLeftColor: getWarningColor(warning.severity) }]}>
                  <View style={styles.warningHeader}>
                    <Ionicons
                      name={getWarningIcon(warning.type) as any}
                      size={16}
                      color={getWarningColor(warning.severity)}
                    />
                    <Text style={[styles.warningTitle, { color: screenColors.text }]}>
                      {warning.title}
                    </Text>
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={() => clearWarning(warning.id)}
                    >
                      <Ionicons name="close" size={14} color={screenColors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.warningMessage, { color: screenColors.textSecondary }]}>
                    {warning.message}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* Weather Section */}
      <View style={styles.weatherSection}>
        <View style={styles.weatherLeft}>
          <Ionicons
            name={getWeatherIcon(weather?.condition || 'clear')}
            size={24}
            color={screenColors.primary}
          />
          <View style={styles.weatherInfo}>
            <Text style={[styles.temperature, { color: screenColors.text }]}>
              {weather?.temperature}°C
            </Text>
            <Text style={[styles.location, { color: screenColors.textSecondary }]}>
              {weather?.location}
            </Text>
          </View>
        </View>
        <View style={styles.weatherDetails}>
          <Text style={[styles.weatherDetail, { color: screenColors.textSecondary }]}>
            💧 {weather?.humidity}%
          </Text>
          <Text style={[styles.weatherDetail, { color: screenColors.textSecondary }]}>
            💨 {weather?.windSpeed} km/h
          </Text>
        </View>
      </View>

      {/* Active Trip Info - Only show if tracking */}
      {tripTracking.isTracking && (
        <View style={styles.tripSection}>
          <View style={styles.tripInfo}>
            <Ionicons name="car-outline" size={20} color={screenColors.primary} />
            <View style={styles.tripDetails}>
              <Text style={[styles.tripText, { color: screenColors.text }]}>
                {t('active_trip', 'Active Trip')}
              </Text>
              <Text style={[styles.tripSubtext, { color: screenColors.textSecondary }]}>
                {tripTracking.distance.toFixed(1)} km • {Math.floor(tripTracking.duration / 60)} min
              </Text>
            </View>
          </View>
          <View style={styles.speedInfo}>
            <Text style={[styles.speedText, { color: screenColors.primary }]}>
              {tripTracking.currentSpeed.toFixed(0)} km/h
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  weatherSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weatherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weatherInfo: {
    gap: 2,
  },
  temperature: {
    fontSize: 20,
    fontWeight: '600',
  },
  location: {
    fontSize: 14,
  },
  weatherDetails: {
    gap: 4,
  },
  weatherDetail: {
    fontSize: 12,
    textAlign: 'right',
  },
  tripSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tripDetails: {
    gap: 2,
  },
  tripText: {
    fontSize: 16,
    fontWeight: '500',
  },
  tripSubtext: {
    fontSize: 12,
  },
  speedInfo: {
    alignItems: 'center',
  },
  speedText: {
    fontSize: 18,
    fontWeight: '600',
  },
  retryButton: {
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningsSection: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: 12,
    marginBottom: 12,
  },
  warningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  warningsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningsCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  warningsList: {
    marginTop: 8,
  },
  warningCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    minWidth: 250,
    borderLeftWidth: 3,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  warningMessage: {
    fontSize: 12,
    lineHeight: 16,
  },
  clearButton: {
    padding: 2,
  },
});

export default WeatherBanner;
