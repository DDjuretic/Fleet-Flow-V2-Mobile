import React, { Suspense, useCallback } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import Toast from 'react-native-toast-message';
import toastConfig from './src/utils/toastConfig';
import './src/i18n'; // Initializes i18n

// Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterCompanyScreen from './src/screens/auth/RegisterCompanyScreen';
import CreateCompanyScreen from './src/screens/auth/CreateCompanyScreen';
import MainTabNavigator from './src/navigation/TabNavigator';
import SplashScreen from './src/screens/auth/SplashScreen';

import { RootStackParamList } from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { session, user, loading, setLoading } = useAuth();

  const onAppReady = useCallback(() => {
    if (setLoading) {
      setLoading(false);
    }
  }, [setLoading]);

  if (loading) {
    // The onFinish callback is required to signal when animations/tasks are done.
    // In our case, loading is controlled by AuthContext, so we tie it to that.
    return <SplashScreen onFinish={onAppReady} />;
  }

  const hasCompany = user?.company_id;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session && user ? (
        hasCompany ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="CreateCompany" component={CreateCompanyScreen} />
        )
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterCompanyScreen} />
          <Stack.Screen name="CreateCompany" component={CreateCompanyScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <Suspense fallback={<View style={styles.container}><ActivityIndicator /></View>}>
      <NavigationContainer>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </Suspense>
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
