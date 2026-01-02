/**
 * Dual Sidebar Navigator - FleetFlow's new navigation paradigm
 *
 * Left Sidebar: Settings & System (all users)
 * Right Sidebar: Core Features (tier-based access)
 *
 * Replaces bottom tab navigation with enterprise-grade dual sidebar UX
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform
} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

// Screens
import HomeScreen from '../screens/main/HomeScreen';
import TripsScreen from '../screens/main/TripsScreen';
import ExpensesScreen from '../screens/main/ExpensesScreen';
import ReservationsScreen from '../screens/main/ReservationsScreen';

// Settings & Admin screens
import SettingsScreen from '../screens/settings/SettingsScreen';
import AdminPanelScreen from '../screens/admin/AdminPanelScreen';
import UserProfileScreen from '../screens/settings/UserProfileScreen';

// Contexts & Hooks
import { useAuth } from '../contexts/AuthContext';
import { UserTierService, UserTier } from '../types/userTier';

// Types
import { RootStackParamList } from '../types/navigation';
import Colors from '../constants/Colors';
import { useSelector } from 'react-redux';
import { RootState } from '../store/rootReducer';

const Drawer = createDrawerNavigator<RootStackParamList>();
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75; // 75% of screen width

/**
 * Left Sidebar Content - Settings & System
 */
const LeftSidebarContent = (props: any) => {
  const { t } = useTranslation();
  const { userTier, hasPermission } = useAuth();
  const navigation = useNavigation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const colors = themeMode === 'dark' ? Colors.DARK : Colors.LIGHT;

  const menuItems = [
    {
      id: 'home',
      title: t('home_title', 'Home'),
      icon: 'home-outline',
      screen: 'Home',
      permission: null
    },
    {
      id: 'profile',
      title: t('edit_profile', 'Edit Profile'),
      icon: 'person-outline',
      screen: 'UserProfile',
      permission: null
    },
    {
      id: 'settings',
      title: t('settings_title', 'Settings'),
      icon: 'settings-outline',
      screen: 'Settings',
      permission: null
    },
    {
      id: 'admin',
      title: t('admin_panel', 'Admin Panel'),
      icon: 'construct-outline',
      screen: 'AdminPanel',
      permission: 'adminPanel'
    }
  ];

  const filteredMenuItems = menuItems.filter(item =>
    !item.permission || hasPermission(item.permission as any)
  );

  return (
    <DrawerContentScrollView
      {...props}
      style={[styles.drawerContent, { backgroundColor: colors.background }]}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={[styles.drawerHeader, { borderBottomColor: colors.border }]}>
          <Text style={[styles.drawerTitle, { color: colors.text }]}>
            {t('app_name', 'FleetFlow')}
          </Text>
          <Text style={[styles.drawerSubtitle, { color: colors.textSecondary }]}>
            {UserTierService.getTierDisplayName(userTier)}
          </Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {filteredMenuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
              onPress={() => {
                navigation.navigate(item.screen as any);
                props.navigation.closeDrawer();
              }}
            >
              <Ionicons
                name={item.icon as any}
                size={24}
                color={colors.primary}
                style={styles.menuIcon}
              />
              <Text style={[styles.menuText, { color: colors.text }]}>
                {item.title}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </DrawerContentScrollView>
  );
};

/**
 * Right Sidebar Content - Core Features
 */
const RightSidebarContent = (props: any) => {
  const { t } = useTranslation();
  const { userTier, hasPermission } = useAuth();
  const navigation = useNavigation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const colors = themeMode === 'dark' ? Colors.DARK : Colors.LIGHT;

  const coreFeatures = [
    {
      id: 'home',
      title: t('home_title', 'Home'),
      icon: 'home-outline',
      screen: 'Home',
      permission: 'basicTracking'
    },
    {
      id: 'trips',
      title: t('trips_title', 'Trips'),
      icon: 'car-outline',
      screen: 'Trips',
      permission: 'basicTracking'
    },
    {
      id: 'driver_tasks',
      title: t('driver_tasks', 'Driver Tasks'),
      icon: 'clipboard-outline',
      screen: 'DriverTasks', // TODO: Create this screen
      permission: 'taskManagement'
    },
    {
      id: 'expenses',
      title: t('expenses_title', 'Expenses'),
      icon: 'receipt-outline',
      screen: 'Expenses',
      permission: 'basicTracking'
    },
    {
      id: 'reservations',
      title: t('reservations_title', 'Reservations'),
      icon: 'calendar-outline',
      screen: 'Reservations',
      permission: 'reservations'
    }
  ];

  const filteredFeatures = coreFeatures.filter(item =>
    !item.permission || hasPermission(item.permission as any)
  );

  return (
    <DrawerContentScrollView
      {...props}
      style={[styles.drawerContent, { backgroundColor: colors.background }]}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={[styles.drawerHeader, { borderBottomColor: colors.border }]}>
          <Text style={[styles.drawerTitle, { color: colors.text }]}>
            {t('features', 'Features')}
          </Text>
          <Text style={[styles.drawerSubtitle, { color: colors.textSecondary }]}>
            {t('core_functions', 'Core Functions')}
          </Text>
        </View>

        {/* Core Features */}
        <View style={styles.menuContainer}>
          {filteredFeatures.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
              onPress={() => {
                navigation.navigate(item.screen as any);
                props.navigation.closeDrawer();
              }}
            >
              <Ionicons
                name={item.icon as any}
                size={24}
                color={colors.primary}
                style={styles.menuIcon}
              />
              <Text style={[styles.menuText, { color: colors.text }]}>
                {item.title}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </DrawerContentScrollView>
  );
};

/**
 * Custom Dual Sidebar Component
 * Left: Settings & System | Right: Core Features
 */
const DualSidebarLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const { userTier, hasPermission } = useAuth();
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const colors = themeMode === 'dark' ? Colors.DARK : Colors.LIGHT;

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!leftSidebarOpen);
    if (rightSidebarOpen) setRightSidebarOpen(false);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!rightSidebarOpen);
    if (leftSidebarOpen) setLeftSidebarOpen(false);
  };

  const closeSidebars = () => {
    setLeftSidebarOpen(false);
    setRightSidebarOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Custom Header with Sidebar Toggles */}
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={toggleLeftSidebar}
          >
            <Ionicons name="menu" size={24} color={colors.primary} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>
            FleetFlow
          </Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={toggleRightSidebar}
          >
            <Ionicons name="apps" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Screen Content */}
        <View style={styles.screenContent}>
          {children}
        </View>
      </View>

      {/* Left Sidebar Overlay */}
      {leftSidebarOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeSidebars}
        >
          <View style={[styles.leftSidebar, { backgroundColor: colors.background }]}>
            <LeftSidebarContent navigation={{ closeDrawer: closeSidebars }} />
          </View>
        </TouchableOpacity>
      )}

      {/* Right Sidebar Overlay */}
      {rightSidebarOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeSidebars}
        >
          <View style={[styles.rightSidebar, { backgroundColor: colors.background }]}>
            <RightSidebarContent navigation={{ closeDrawer: closeSidebars }} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * Main Dual Sidebar Navigator Component
 */
const DualSidebarNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={(props) => <DualSidebarLayout><View /></DualSidebarLayout>}
    >
      {/* Main screens wrapped in dual sidebar layout */}
      <Drawer.Screen
        name="Home"
        component={() => (
          <DualSidebarLayout>
            <HomeScreen />
          </DualSidebarLayout>
        )}
      />
      <Drawer.Screen
        name="Trips"
        component={() => (
          <DualSidebarLayout>
            <TripsScreen />
          </DualSidebarLayout>
        )}
      />
      <Drawer.Screen
        name="Expenses"
        component={() => (
          <DualSidebarLayout>
            <ExpensesScreen />
          </DualSidebarLayout>
        )}
      />
      <Drawer.Screen
        name="Reservations"
        component={() => (
          <DualSidebarLayout>
            <ReservationsScreen />
          </DualSidebarLayout>
        )}
      />

      {/* Settings & Admin screens */}
      <Drawer.Screen
        name="Settings"
        component={() => (
          <DualSidebarLayout>
            <SettingsScreen />
          </DualSidebarLayout>
        )}
      />
      <Drawer.Screen
        name="AdminPanel"
        component={() => (
          <DualSidebarLayout>
            <AdminPanelScreen />
          </DualSidebarLayout>
        )}
      />
      <Drawer.Screen
        name="UserProfile"
        component={() => (
          <DualSidebarLayout>
            <UserProfileScreen />
          </DualSidebarLayout>
        )}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  // Main layout
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    ...Platform.select({
      ios: {
        paddingTop: 50, // Account for status bar
      },
      android: {
        paddingTop: 16,
      },
    }),
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },

  // Sidebars
  leftSidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    zIndex: 1001,
  },
  rightSidebar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    zIndex: 1001,
  },

  // Drawer content
  drawerContent: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  drawerSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DualSidebarNavigator;
