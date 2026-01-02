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
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useTranslation } from 'react-i18next';

interface OSRMSettingsData {
  serverUrl: string;
  timeout: number;
  profile: 'driving' | 'walking' | 'cycling';
  enableCaching: boolean;
  maxRetries: number;
}

export default function OSRMSettingsScreen({ navigation }: any) {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const [settings, setSettings] = useState<OSRMSettingsData>({
    serverUrl: 'https://osrm.fleetflow.me',
    timeout: 10000,
    profile: 'driving',
    enableCaching: true,
    maxRetries: 3,
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
  } : {
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    border: Colors.LIGHT.border,
    primary: Colors.LIGHT.primary,
    danger: Colors.DANGER,
    card: Colors.LIGHT.card,
    success: '#34C759',
  };

  const updateSetting = (key: keyof OSRMSettingsData, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Here you would save to AsyncStorage or API
    console.log('Saving OSRM settings:', settings);
    Alert.alert(
      t('success', 'Success'),
      t('osrm_settings_saved', 'OSRM settings saved successfully'),
      [{ text: t('ok', 'OK') }]
    );
    setHasChanges(false);
  };

  const handleReset = () => {
    Alert.alert(
      t('confirm', 'Confirm'),
      t('reset_osrm_settings', 'Reset OSRM settings to defaults?'),
      [
        { text: t('cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('reset', 'Reset'),
          style: 'destructive',
          onPress: () => {
            setSettings({
              serverUrl: 'https://osrm.fleetflow.me',
              timeout: 10000,
              profile: 'driving',
              enableCaching: true,
              maxRetries: 3,
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
      minWidth: 200,
    },
    profileButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: screenColors.primary,
      backgroundColor: settings.profile === 'driving' ? screenColors.primary : 'transparent',
    },
    profileButtonText: {
      fontSize: 14,
      color: settings.profile === 'driving' ? 'white' : screenColors.primary,
      fontWeight: '500',
    },
    switch: {
      width: 50,
      height: 30,
      borderRadius: 15,
      padding: 2,
      justifyContent: settings.enableCaching ? 'flex-end' : 'flex-start',
      backgroundColor: settings.enableCaching ? screenColors.primary : screenColors.border,
    },
    switchKnob: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: 'white',
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
        <Text style={styles.headerTitle}>{t('osrm_settings', 'OSRM Settings')}</Text>
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
                <Text style={styles.settingSubtitle}>{t('osrm_server_url_desc', 'OSRM routing server endpoint')}</Text>
              </View>
              <TextInput
                style={styles.input}
                value={settings.serverUrl}
                onChangeText={(value) => updateSetting('serverUrl', value)}
                placeholder="https://osrm.fleetflow.me"
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>{t('timeout', 'Timeout (ms)')}</Text>
                <Text style={styles.settingSubtitle}>{t('request_timeout_desc', 'Maximum time to wait for response')}</Text>
              </View>
              <TextInput
                style={styles.input}
                value={settings.timeout.toString()}
                onChangeText={(value) => updateSetting('timeout', parseInt(value) || 10000)}
                keyboardType="numeric"
                placeholder="10000"
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>{t('routing_profile', 'Routing Profile')}</Text>
                <Text style={styles.settingSubtitle}>{t('routing_profile_desc', 'Type of routing to use')}</Text>
              </View>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => updateSetting('profile', settings.profile === 'driving' ? 'walking' : 'driving')}
              >
                <Text style={styles.profileButtonText}>
                  {settings.profile === 'driving' ? t('driving', 'Driving') : t('walking', 'Walking')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Performance Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('performance_settings', 'Performance Settings')}</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>{t('enable_caching', 'Enable Caching')}</Text>
                <Text style={styles.settingSubtitle}>{t('caching_desc', 'Cache routes for better performance')}</Text>
              </View>
              <TouchableOpacity
                style={styles.switch}
                onPress={() => updateSetting('enableCaching', !settings.enableCaching)}
              >
                <View style={styles.switchKnob} />
              </TouchableOpacity>
            </View>

            <View style={[styles.settingRow, styles.settingRowLast]}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>{t('max_retries', 'Max Retries')}</Text>
                <Text style={styles.settingSubtitle}>{t('max_retries_desc', 'Number of retry attempts on failure')}</Text>
              </View>
              <TextInput
                style={styles.input}
                value={settings.maxRetries.toString()}
                onChangeText={(value) => updateSetting('maxRetries', parseInt(value) || 3)}
                keyboardType="numeric"
                placeholder="3"
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
