import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import Colors from '../../constants/Colors';
import { useTranslation } from 'react-i18next';

const NotificationsSettingsScreen = () => {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const screenColors = themeMode === 'dark' ? Colors.DARK : Colors.LIGHT;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={screenColors.background} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: screenColors.text }]}>{t('notifications_settings_title', 'Notification Settings')}</Text>
        <Text style={[styles.subtitle, { color: screenColors.textSecondary }]}>
          {t('notifications_settings_description', 'This screen will allow users to manage their notification preferences.')}
        </Text>
        {/* Add notification settings toggles and options here */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default NotificationsSettingsScreen; 