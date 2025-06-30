import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import Toast from 'react-native-toast-message';
import toastConfig from './src/utils/toastConfig';
import './src/i18n'; // Initializes i18n
import { Provider, useSelector } from 'react-redux';
import { store, persistor, RootState } from './src/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import 'react-native-gesture-handler';

// Navigation
import MainTabNavigator from './src/navigation/TabNavigator';

// Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterCompanyScreen from './src/screens/auth/RegisterCompanyScreen';
import CreateCompanyScreen from './src/screens/auth/CreateCompanyScreen';
import CustomSplashScreen from './src/screens/auth/SplashScreen'; // Renamed to avoid conflict
import OnboardingFlow from './src/screens/onboarding/OnboardingFlow';

// Settings and other screens
import SettingsScreen from './src/screens/settings/SettingsScreen';
import UserProfileScreen from './src/screens/settings/UserProfileScreen';
import EditProfileScreen from './src/screens/settings/EditProfileScreen';
import NotificationsSettingsScreen from './src/screens/settings/NotificationsSettingsScreen';
import NotificationsScreen from './src/screens/main/NotificationsScreen';

// Admin screens
import AdminPanelScreen from './src/screens/admin/AdminPanelScreen';
import POIManagementScreen from './src/screens/admin/POIManagementScreen';
import RouteManagementScreen from './src/screens/admin/RouteManagementScreen';
import FuelPriceManagementScreen from './src/screens/admin/FuelPriceManagementScreen';
import UserManagementScreen from './src/screens/admin/UserManagementScreen';
import VehicleManagementScreen from './src/screens/admin/VehicleManagementScreen';
import ReportsAnalyticsScreen from './src/screens/admin/ReportsAnalyticsScreen';
import SystemLogsAndMonitoringScreen from './src/screens/admin/SystemLogsAndMonitoringScreen';
import BackupRestoreScreen from './src/screens/admin/BackupRestoreScreen';
import AdminRoleManagementScreen from './src/screens/admin/AdminRoleManagementScreen';
import PendingReservationsScreen from './src/screens/admin/PendingReservationsScreen';
import UserRequestsScreen from './src/screens/admin/UserRequestsScreen';
import CompanySettingsScreen from './src/screens/admin/CompanySettingsScreen';
// ...

// Form screens
import AddTripScreen from './src/screens/trips/AddTripScreen';
import TripDetailsScreen from './src/screens/trips/TripDetailsScreen';
import TripMapScreen from './src/screens/trips/TripMapScreen';
// ... import all other form screens ...
import AddReservationScreen from './src/screens/reservations/AddReservationScreen';
import EditReservationScreen from './src/screens/reservations/EditReservationScreen';
import ReservationDetailsScreen from './src/screens/reservations/ReservationDetailsScreen';
import AddReminderScreen from './src/screens/reminders/AddReminderScreen';
import EditReminderScreen from './src/screens/reminders/EditReminderScreen';
import EditTripScreen from './src/screens/trips/EditTripScreen';
//...

import { RootStackParamList } from './src/types/navigation';
import Colors from './src/constants/Colors';


const Stack = createStackNavigator<RootStackParamList>();

ExpoSplashScreen.preventAutoHideAsync();

const AppNavigator = () => {
  const { session, user, loading: authLoading } = useAuth();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  useEffect(() => {
    if (splashAnimationFinished && !authLoading) {
      ExpoSplashScreen.hideAsync();
    }
  }, [splashAnimationFinished, authLoading]);

  const navigationTheme: Theme = {
    dark: themeMode === 'dark',
    colors: {
      primary: themeMode === 'dark' ? Colors.DARK.primary : Colors.LIGHT.primary,
      background: themeMode === 'dark' ? Colors.DARK.background : Colors.LIGHT.background,
      card: themeMode === 'dark' ? Colors.DARK.card : Colors.LIGHT.card,
      text: themeMode === 'dark' ? Colors.DARK.text : Colors.LIGHT.text,
      border: themeMode === 'dark' ? Colors.DARK.border : Colors.LIGHT.border,
      notification: themeMode === 'dark' ? Colors.DARK.primary : Colors.LIGHT.primary,
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: 'normal' },
      medium: { fontFamily: 'System', fontWeight: '500' },
      bold: { fontFamily: 'System', fontWeight: 'bold' },
      heavy: { fontFamily: 'System', fontWeight: '800' },
    }
  };

  const statusBarContent = themeMode === 'dark' ? 'light-content' : 'dark-content';

  if (!splashAnimationFinished) {
    return <CustomSplashScreen onFinish={() => setSplashAnimationFinished(true)} />;
  }

  if (authLoading) {
    return (
      <View style={[styles.container, { backgroundColor: navigationTheme.colors.background }]}>
        <ActivityIndicator size="large" color={themeMode === 'dark' ? Colors.DARK.primary : Colors.LIGHT.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
        <StatusBar barStyle={statusBarContent} backgroundColor={navigationTheme.colors.background} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {session && user ? (
            !user.company_id ? (
                <Stack.Screen name="CreateCompany" component={CreateCompanyScreen} />
            ) : user.onboarding_status !== 'completed' ? (
                <Stack.Screen name="OnboardingFlow" component={OnboardingFlow} />
            ) : (
                <>
                <Stack.Screen name="Main" component={MainTabNavigator} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="UserProfile" component={UserProfileScreen} />
                <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                <Stack.Screen name="NotificationsSettings" component={NotificationsSettingsScreen} />
                <Stack.Screen name="Notifications" component={NotificationsScreen} />
                <Stack.Screen name="AddReservation" component={AddReservationScreen} />
                <Stack.Screen name="ReservationDetails" component={ReservationDetailsScreen} />
                <Stack.Screen name="EditReservation" component={EditReservationScreen} />
                <Stack.Screen name="PendingReservations" component={PendingReservationsScreen} />
                <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
                <Stack.Screen name="AddTrip" component={AddTripScreen} />
                <Stack.Screen name="TripDetailsScreen" component={TripDetailsScreen} />
                <Stack.Screen name="TripMap" component={TripMapScreen} />
                <Stack.Screen name="AddReminder" component={AddReminderScreen} />
                <Stack.Screen name="EditReminder" component={EditReminderScreen} />
                <Stack.Screen name="EditTrip" component={EditTripScreen} />
                <Stack.Screen name="UserRequests" component={UserRequestsScreen} />
                <Stack.Screen name="CompanySettings" component={CompanySettingsScreen} />
                <Stack.Screen name="POIManagement" component={POIManagementScreen} />
                <Stack.Screen name="RouteManagement" component={RouteManagementScreen} />
                <Stack.Screen name="FuelPriceManagement" component={FuelPriceManagementScreen} />
                <Stack.Screen name="UserManagement" component={UserManagementScreen} />
                <Stack.Screen name="VehicleManagement" component={VehicleManagementScreen} />
                <Stack.Screen name="ReportsAnalytics" component={ReportsAnalyticsScreen} />
                <Stack.Screen name="SystemLogsAndMonitoring" component={SystemLogsAndMonitoringScreen} />
                <Stack.Screen name="BackupRestore" component={BackupRestoreScreen} />
                <Stack.Screen name="AdminRoleManagement" component={AdminRoleManagementScreen} />
                </>
            )
            ) : (
            <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterCompanyScreen} />
                <Stack.Screen name="CreateCompany" component={CreateCompanyScreen} />
            </>
            )}
        </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Suspense fallback={<View style={styles.container}><ActivityIndicator /></View>}>
          <AuthProvider>
              <AppNavigator />
          </AuthProvider>
          <Toast config={toastConfig} />
        </Suspense>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
