import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

// Screens - Updated paths
import HomeScreen from '../screens/main/HomeScreen';
import TripsScreen from '../screens/main/TripsScreen';
import ExpensesScreen from '../screens/main/ExpensesScreen';
import RemindersScreen from '../screens/main/RemindersScreen';
import ReservationsScreen from '../screens/main/ReservationsScreen';

// Types
import { TabParamList } from '../types/navigation';
import Colors from '../constants/Colors';

// Redux imports
import { useSelector } from 'react-redux';
import { RootState } from '../store/rootReducer';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const tabNavColors = themeMode === 'dark' ? {
    tabBarBackground: Colors.DARK.tabBarBackground,
    tabBarActive: Colors.DARK.tabBarActive,
    tabBarInactive: Colors.DARK.tabBarInactive,
    tabBarBorder: Colors.DARK.tabBarBorder,
  } : {
    tabBarBackground: Colors.LIGHT.tabBarBackground,
    tabBarActive: Colors.LIGHT.tabBarActive,
    tabBarInactive: Colors.LIGHT.tabBarInactive,
    tabBarBorder: Colors.LIGHT.tabBarBorder,
  };

  return (
    <Tab.Navigator
      {...({id: "MainTabs"} as any)}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size = 28 }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Trips':
              iconName = focused ? 'car' : 'car-outline';
              break;
            case 'Expenses':
              iconName = focused ? 'receipt' : 'receipt-outline';
              break;
            case 'Reminders':
              iconName = focused ? 'alarm' : 'alarm-outline';
              break;
            case 'Reservations':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            default:
              iconName = 'alert-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: tabNavColors.tabBarActive,
        tabBarInactiveTintColor: tabNavColors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: tabNavColors.tabBarBackground,
          borderTopWidth: 1,
          borderTopColor: tabNavColors.tabBarBorder,
          height: 90,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('home_title', 'Home'),
        }}
      />
      <Tab.Screen
        name="Trips"
        component={TripsScreen}
        options={{
          tabBarLabel: t('trips_title', 'Trips'),
        }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{
          tabBarLabel: t('expenses_title', 'Expenses'),
        }}
      />
      <Tab.Screen
        name="Reminders"
        component={RemindersScreen}
        options={{
          tabBarLabel: t('reminders_title', 'Reminders'),
        }}
      />
      <Tab.Screen
        name="Reservations"
        component={ReservationsScreen}
        options={{
          tabBarLabel: t('reservations_title', 'Reservations'),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator; 