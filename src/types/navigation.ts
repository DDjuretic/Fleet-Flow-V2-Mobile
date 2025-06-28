import { NavigatorScreenParams } from '@react-navigation/native';

// Navigation Types for Fleet Flow Next Gen
export type RootStackParamList = {
  // Auth & Onboarding
  Login: undefined;
  Register: undefined;
  CreateCompany: undefined; // Screen for user to create their company after signing up
  Splash: undefined;
  OnboardingFlow: undefined;
  
  // Main App Stack (contains TabNavigator and other screens accessible from tabs or globally)
  Main: NavigatorScreenParams<TabParamList>; // Navigacija ka tabovima
  
  // Screens accessible from Main stack but not necessarily in tabs
  Settings: undefined;
  UserProfile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  Language: undefined;
  NotificationsSettings: undefined;
  UnitsSettings: undefined;
  CurrencySettings: undefined;
  HelpSupport: undefined;
  AddReservation: undefined;
  ReservationDetails: { reservationId: string };
  EditReservation: { reservationId: string };
  PendingReservations: undefined;
  AdminRoleManagement: undefined;
  AdminPanel: undefined;
  POIManagement: undefined;
  RouteManagement: undefined;
  FuelPriceManagement: undefined;
  UserManagement: undefined;
  VehicleManagement: undefined;
  DatabaseOperations: undefined;
  ReportsAnalytics: undefined;
  UserRequests: undefined;
  CompanySettings: undefined;
  SystemLogsAndMonitoring: undefined;
  BackupRestore: undefined;

  
  // Detail Screens (examples, adjust as needed)
  TripDetails: { tripId: string };
  TripMap: { tripId: string; tripName: string };
  Navigation: { tripId: string };
  ExpenseDetails: { expenseId: string };
  EditExpense: { expenseId: string };
  
  // Vehicle Management (examples)
  VehicleList: undefined;
  VehicleDetails: { vehicleId: string };
  EditVehicle: { vehicleId: string };
  VehicleForm: undefined;
  
  // Tab Screens
  Home: undefined;
  Trips: undefined;
  Expenses: undefined;
  Reminders: undefined;
  Reservations: undefined;
  
  // Routes & Locations
  Routes: undefined;
  RouteDetails: { routeId: string };
  EditRoute: { routeId: string };
  AddRoute: undefined;
  Locations: undefined;
  EditLocation: { locationId: string };
  AddLocation: undefined;
  
  // Fuel Management
  FuelPrices: undefined;
  EditFuelPrice: { fuelPriceId: string };
  AddFuelPrice: undefined;
  
  // Reports & Analytics
  Reports: undefined;
  Analytics: undefined;
  Receipts: undefined;
  
  // Admin Screens
  Permissions: undefined;
  PermissionLevels: undefined;
  UserPermissions: { userId: string; userName: string };
  PermissionMatrix: undefined;
  PurposeManagement: undefined;
  
  // Support
  // HelpSupport: undefined;
  
  // Development
  TestData: undefined;
  
  // New screens
  Notifications: undefined;
  AddTrip: undefined;
  EditTrip: { tripId: string };
  NewAddExpense: undefined;
  AddReminder: undefined;
  EditReminder: { reminderId: string };
};

export type TabParamList = {
  Home: undefined;
  Trips: undefined;
  Expenses: undefined;
  Reminders: undefined;
  Reservations: undefined;
};

export type DrawerParamList = {
  MainScreens: undefined; // Moglo bi da sadrži TabNavigator
  Profile: undefined;
  Settings: undefined;
  HelpSupport: undefined;
  UserProfile: undefined;
}; 