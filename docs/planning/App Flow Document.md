# App Flow Document

## 1. Introduction
### 1.1 Purpose
This document outlines the primary user flows and navigation structure of the Fleet Flow application.

## 2. Main Navigators
- **Expo Router (`src/_layout.tsx`):** Initial stack with `index`, `login`, `home` screens. Likely handles early app loading and redirection before React Navigation takes over.
- **Main App Logic (`src/App.tsx`):** Determines if the user is authenticated. 
  - If authenticated, renders `AppNavigator`.
  - If not authenticated, renders `AuthNavigator`.

## 3. User Flows

### 3.1 Unauthenticated User Flow (via `AuthNavigator.tsx`)
1.  **Initial Entry:** User likely lands on `LoginScreen` or `SignInScreen`.
    *   **Screens:** `LoginScreen`, `SignInScreen`, `RegisterScreen`.
2.  **Accessing Main Tabs (Potentially limited view via `AuthNavigator` -> `Main` -> `TabNavigator`):
    *   This flow needs clarification, as `AuthNavigator` can also show `TabNavigator`. It might be a limited version or a specific guest flow.
    *   **Screens (Tabs):** `HomeScreen`, `TripScreen`, `ExpensesScreen`, `RemindersScreen`, `ReservationsScreen`.
3.  **Direct access to `HomeScreen` via `AuthNavigator` is also possible.**

### 3.2 Authenticated User Flow (via `AppNavigator.tsx`)
1.  **Login/Registration:** User logs in or registers (handled by `AuthNavigator` or dedicated screens called before `AppNavigator` fully takes over if session persists).
2.  **New User Onboarding:**
    *   **Trigger:** User is authenticated but identified as a new user (e.g., missing profile details, or `isNewUser` flag is true in `AppNavigator`).
    *   **Flow:** `AppNavigator` directs to `OnboardingFlow` (`src/screens/OnboardingScreens/OnboardingFlow.tsx`). This is a multi-step process:
        1.  **Step 1: Personal Info (`OnboardingPersonalInfo`)**
            *   Collects: First Name, Last Name. Email is pre-filled.
        2.  **Step 2: Contact Info (`OnboardingContactInfo`)**
            *   Collects: Phone, Address, City, Country.
        3.  **Step 3: Work Info (`OnboardingWorkInfo`)**
            *   Collects: Company (defaults to 'Montenegro Duty Free'), Department, Position.
            *   Collects: Is Driver (boolean), Driver's License Category.
        4.  **Step 4: Vehicle Info (`OnboardingVehicleInfo`)**
            *   Collects (if user indicates they have a personal vehicle): Vehicle Type, Make, Model, Year, Color, License Plate, Fuel Type, Fuel Consumption, Seats.
        5.  **Step 5: Profile Photo (`OnboardingPhotoInfo`)**
            *   Allows user to upload/set a profile picture.
        6.  **Step 6: Completion (`OnboardingComplete`)**
            *   Summary and confirmation.
            *   On completion:
                *   User data is saved/updated in Supabase (`users` table and `auth.users` metadata).
                *   If a personal vehicle was added, it's saved to the `vehicles` table and set as default.
                *   User is then navigated to the main application (typically the `Root` screen, which loads `TabNavigator`).
    *   **Screens:** `OnboardingPersonalInfo`, `OnboardingContactInfo`, `OnboardingWorkInfo`, `OnboardingVehicleInfo`, `OnboardingPhotoInfo`, `OnboardingComplete`.
3.  **Existing User - Main Application Access:**
    *   **Trigger:** User is authenticated and is not a new user.
    *   **Flow:** `AppNavigator` directs to the main `TabNavigator` (likely referenced as `Root`).
    *   **Main Tabs (`TabNavigator.tsx`):**
        *   `HomeScreen`: Dashboard/Overview.
        *   `TripScreen`: Manage and view trips.
        *   `ExpensesScreen`: Manage and view expenses.
        *   `RemindersScreen`: Manage and view reminders.
        *   `ReservationsScreen`: Manage and view reservations.
    *   **Access to Other Stack Screens:** From various points within the `TabNavigator` or other screens, users can navigate to a wide range of screens defined in `AppNavigator`'s stack, including:
        *   Profile Management: `UserProfileScreen`, `ProfileScreen`, `EditProfileScreen`, `ChangePasswordScreen`.
        *   Vehicle Management: `VehicleListScreen`, `EditVehicleScreen`, `VehicleFormScreen`, `VehicleScreen`.
        *   Location Management: `LocationsScreen`, `EditLocationScreen`, `AddLocationScreen`.
        *   Route Management: `RouteScreen`, `EditRouteScreen`, `AddRouteScreen`, `RouteFormScreen`.
        *   Fuel Prices: `FuelPricesScreen`, `EditFuelPriceScreen`, `AddFuelPriceScreen`.
        *   Expense Details: `ExpenseDetailsScreen`, `EditExpenseScreen`, `ReceiptsScreen`.
        *   Trip Details: `TripDetailsScreen`, `TripMapScreen`.
        *   Settings & Admin: `SettingsScreen`, `LanguageScreen`, `NotificationsSettingsScreen`, `HelpSupportScreen`, `PurposeManagementScreen`, `PermissionsScreen`, `PermissionLevelsScreen`, `PermissionMatrixScreen`, `UserPermissionsScreen`, `TestDataScreen`.
        *   And others like `AnalyticsScreen`, `ReportsScreen`, `WelcomeScreen` (its role needs clarification in the authenticated flow).

## 4. Navigation Map
(A visual diagram would be beneficial here, illustrating the connections between Navigators and Screens)

**Key Navigation Stacks:**
- `Expo Router Stack` (Initial)
- `AuthNavigator Stack` (Unauthenticated / Pre-Login)
- `AppNavigator Stack` (Authenticated - Main container)
  - `OnboardingFlow Stack` (If new user)
  - `TabNavigator` (Bottom Tabs for existing authenticated users)
    - `HomeScreen`
    - `TripScreen`
    - `ExpensesScreen`
    - `RemindersScreen`
    - `ReservationsScreen`
  - Numerous other screens are part of the `AppNavigator` stack, accessible from tabs or other screens.

## 5. Edge Cases and Error Handling
- Error states during API calls (e.g., Supabase interactions) should lead to user-friendly messages.
- Navigation to non-existent routes (should be handled by navigators).
- Loss of authentication session (should redirect to login). 