import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useTranslation } from 'react-i18next';

interface SpeedLimitSettingsData {
  serverUrl: string;
  enableSpeedLimits: boolean;
  speedLimitTolerance: number; // percentage over limit before warning
  warningSeverityLevels: {
    low: number;      // km/h over limit
    medium: number;   // km/h over limit
    high: number;     // km/h over limit
    critical: number; // km/h over limit
  };
  enableHapticFeedback: boolean;
  enableSoundAlerts: boolean;
  cacheExpiryHours: number;
  enableOfflineMode: boolean;
}

export default function SpeedLimitSettingsScreen({ navigation }: any) {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const [settings, setSettings] = useState<SpeedLimitSettingsData>({
    serverUrl: 'https://speedlimit.fleetflow.me',
    enableSpeedLimits: true,
    speedLimitTolerance: 5, // 5 km/h tolerance
    warningSeverityLevels: {
      low: 5,
      medium: 10,
      high: 15,
      critical: 20,
    },
    enableHapticFeedback: true,
    enableSoundAlerts: false,
    cacheExpiryHours: 24,
    enableOfflineMode: true,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    border: Colors.DARK.border,
    primary: Colors.DARK.primary,
    danger: Colors.DANGER,
    card: Colors.DARK.card,
    success: '#34C759',
    warning: '#FF9500',
  } : {
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    border: Colors.LIGHT.border,
    primary: Colors.LIGHT.primary,
    danger: Colors.DANGER,
    card: Colors.LIGHT.card,
    success: '#34C759',
    warning: '#FF9500',
  };

  const updateSetting = (key: keyof SpeedLimitSettingsData, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateWarningLevel = (level: keyof SpeedLimitSettingsData['warningSeverityLevels'], value: number) => {
    setSettings(prev => ({
      ...prev,
      warningSeverityLevels: {
        ...prev.warningSeverityLevels,
        [level]: value,
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Validate settings
    if (settings.warningSeverityLevels.low >= settings.warningSeverityLevels.medium ||
        settings.warningSeverityLevels.medium >= settings.warningSeverityLevels.high ||
        settings.warningSeverityLevels.high >= settings.warningSeverityLevels.critical) {
      Alert.alert(
        t('error', 'Error'),
        t('invalid_warning_levels', 'Warning levels must be in ascending order'),
        [{ text: t('ok', 'OK') }]
      );
      return;
    }

    // Here you would save to AsyncStorage or API
    console.log('Saving Speed Limit settings:', settings);
    Alert.alert(
      t('success', 'Success'),
      t('speed_limit_settings_saved', 'Speed limit settings saved successfully'),
      [{ text: t('ok', 'OK') }]
    );
    setHasChanges(false);
  };

  const handleReset = () => {
    Alert.alert(
      t('confirm', 'Confirm'),
      t('reset_speed_limit_settings', 'Reset speed limit settings to defaults?'),
      [
        { text: t('cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('reset', 'Reset'),
          style: 'destructive',
          onPress: () => {
            setSettings({
              serverUrl: 'https://speedlimit.fleetflow.me',
              enableSpeedLimits: true,
              speedLimitTolerance: 5,
              warningSeverityLevels: {
                low: 5,
                medium: 10,
                high: 15,
                critical: 20,
              },
              enableHapticFeedback: true,
              enableSoundAlerts: false,
              cacheExpiryHours: 24,
              enableOfflineMode: true,
            });
            setHasChanges(true);
          }
        }
      ]
    );
  };

  const styles = StyleSheet.create({
    safeAreaContainer: {
      flex: 1,
      backgroundColor: screenColors.background,
    },
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: screenColors.border,
    },
    backButton: {
      padding: 5,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: screenColors.text,
    },
    headerRightPlaceholder: {
      width: 24,
    },
    scrollContainer: {
      padding: 16,
    },
    section: {
      backgroundColor: screenColors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: screenColors.text,
      marginBottom: 16,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: screenColors.border,
    },
    settingRowLast: {
      borderBottomWidth: 0,
    },
    settingLeft: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: screenColors.text,
    },
    settingSubtitle: {
      fontSize: 14,
      color: screenColors.textSecondary,
      marginTop: 2,
    },
    settingRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: screenColors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: screenColors.text,
      backgroundColor: screenColors.background,
      minWidth: 80,
      textAlign: 'center',
    },
    switch: {
      transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    },
    severityContainer: {
      marginTop: 8,
    },
    severityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: screenColors.background,
      borderRadius: 8,
      marginBottom: 8,
    },
    severityLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: screenColors.text,
    },
    severityValue: {
      fontSize: 14,
      color: screenColors.textSecondary,
    },
    severityIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
    },
    button: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveButton: {
      backgroundColor: hasChanges ? screenColors.primary : screenColors.border,
    },
    saveButtonText: {
      color: hasChanges ? 'white' : screenColors.textSecondary,
      fontSize: 16,
      fontWeight: '600',
    },
    resetButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: screenColors.danger,
    },
    resetButtonText: {
      color: screenColors.danger,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'low': return screenColors.primary;
      case 'medium': return screenColors.warning;
      case 'high': return '#FF6B35';
      case 'critical': return screenColors.danger;
      default: return screenColors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={screenColors.background}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={screenColors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('speed_limit_settings', 'Speed Limit Settings')}</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.scrollContainer}>
          {/* Server Configuration */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('server_configuration', 'Server Configuration')}</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>{t('server_url', 'Server URL')}</Text>
                <Text style={styles.settingSubtitle}>{t('speed_limit_server_desc', 'Speed limit data server endpoint')}</Text>
              </View>
              <TextInput
                style={styles.input}
                value={settings.serverUrl}
                onChangeText={(value) => updateSetting('serverUrl', value)}
                placeholder="https://speedlimit.fleetflow.me"
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>{t('enable_speed_limits', 'Enable Speed Limits')}</Text>
                <Text style={styles.settingSubtitle}>{t('enable_speed_limits_desc', 'Show speed limit warnings while driving')}</Text>
              </View>
              <Switch
                value={settings.enableSpeedLimits}
                onValueChange={(value) => updateSetting('enableSpeedLimits', value)}
                trackColor={{ false: screenColors.border, true: screenColors.primary }}
                thumbColor={settings.enableSpeedLimits ? 'white' : screenColors.textSecondary}
                style={styles.switch}
              />
            </View>

            <View style={[styles.settingRow, styles.settingRowLast]}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>{t('speed_tolerance', 'Speed Tolerance')}</Text>
                <Text style={styles.settingSubtitle}>{t('speed_tolerance_desc', 'km/h tolerance before showing warnings')}</Text>
              </View>
              <TextInput
                style={styles.input}
                value={settings.speedLimitTolerance.toString()}
                onChangeText={(value) => updateSetting('speedLimitTolerance', parseInt(value) || 5)}
                keyboardType="numeric"
                placeholder="5"
              />
            </View>
          </View>

          {/* Warning Levels */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('warning_levels', 'Warning Levels')}</Text>
            <Text style={[styles.settingSubtitle, { marginBottom: 16, fontSize: 14 }]}>
              {t('warning_levels_desc', 'Configure when different warning severities trigger')}
            </Text>

            <View style={styles.severityContainer}>
              {Object.entries(settings.warningSeverityLevels).map(([level, value]) => (
                <View key={level} style={styles.severityRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor(level) }]} />
                    <Text style={styles.severityLabel}>
                      {t(`severity_${level}`, level.charAt(0).toUpperCase() + level.slice(1))}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      style={[styles.input, { width: 60, marginRight: 8 }]}
                      value={value.toString()}
                      onChangeText={(text) => updateWarningLevel(level as keyof typeof settings.warningSeverityLevels, parseInt(text) || 0)}
                      keyboardType="numeric"
                    />
                    <Text style={styles.severityValue}>km/h</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Alert Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('alert_settings', 'Alert Settings')}</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>{t('haptic_feedback', 'Haptic Feedback')}</Text>
                <Text style={styles.settingSubtitle}>{t('haptic_feedback_desc', 'Vibrate device on speed warnings')}</Text>
              </View>
              <Switch
                value={settings.enableHapticFeedback}
                onValueChange={(value) => updateSetting('enableHapticFeedback', value)}
                trackColor={{ false: screenColors.border, true: screenColors.primary }}
                thumbColor={settings.enableHapticFeedback ? 'white' : screenColors.textSecondary}
                style={styles.switch}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>{t('sound_alerts', 'Sound Alerts')}</Text>
                <Text style={styles.settingSubtitle}>{t('sound_alerts_desc', 'Play sound on critical warnings')}</Text>
              </View>
              <Switch
                value={settings.enableSoundAlerts}
                onValueChange={(value) => updateSetting('enableSoundAlerts', value)}
                trackColor={{ false: screenColors.border, true: screenColors.primary }}
                thumbColor={settings.enableSoundAlerts ? 'white' : screenColors.textSecondary}
                style={styles.switch}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>{t('offline_mode', 'Offline Mode')}</Text>
                <Text style={styles.settingSubtitle}>{t('offline_mode_desc', 'Cache speed limits for offline use')}</Text>
              </View>
              <Switch
                value={settings.enableOfflineMode}
                onValueChange={(value) => updateSetting('enableOfflineMode', value)}
                trackColor={{ false: screenColors.border, true: screenColors.primary }}
                thumbColor={settings.enableOfflineMode ? 'white' : screenColors.textSecondary}
                style={styles.switch}
              />
            </View>

            <View style={[styles.settingRow, styles.settingRowLast]}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>{t('cache_expiry', 'Cache Expiry')}</Text>
                <Text style={styles.settingSubtitle}>{t('cache_expiry_desc', 'Hours to keep cached speed limits')}</Text>
              </View>
              <TextInput
                style={styles.input}
                value={settings.cacheExpiryHours.toString()}
                onChangeText={(value) => updateSetting('cacheExpiryHours', parseInt(value) || 24)}
                keyboardType="numeric"
                placeholder="24"
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={!hasChanges}
            >
              <Text style={styles.saveButtonText}>
                {t('save', 'Save')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>
                {t('reset', 'Reset')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
