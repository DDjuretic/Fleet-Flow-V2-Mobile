# App Flow Document

## 1. Introduction
### 1.1 Purpose
This document outlines the primary user flows and navigation structure of the Fleet Flow application, focusing on the mobile client.

## 2. Main Navigators
- **Initial App Load (`src/App.tsx` / Expo Entry Point):** The main entry point of the application determines the initial navigation stack based on user authentication status. While Expo manages the app's entry point, React Navigation is the primary library used for defining the navigation structure within the application.
  - If authenticated, renders `AppNavigator`.
  - If not authenticated, renders `AuthNavigator`.

## 3. User Flows

### 3.1 Unauthenticated User Flow (via `AuthNavigator.tsx`)
1.  **Initial Entry:** User likely lands on `LoginScreen` or `SignInScreen`.
    *   **Screens:** `LoginScreen`, `SignInScreen`, `RegisterScreen`, `ForgotPasswordScreen` (if implemented).
2.  **Accessing Main Tabs (Limited View/Guest Flow):**
    *   The `AuthNavigator` *may* offer a limited view of certain `TabNavigator` screens for unauthenticated users (e.g., a public `HomeScreen` or `About` screen), but full functionality (like creating trips or expenses) is restricted.
    *   **Screens (Tabs):** `HomeScreen` (limited), potentially other read-only public screens.
3.  **Direct access to `HomeScreen` via `AuthNavigator` is also possible.**

### 3.2 Authenticated User Flow (via `AppNavigator.tsx`)
1.  **Login/Registration:** User logs in or registers (typically handled by `AuthNavigator` before `AppNavigator` takes over).
2.  **New User Onboarding:**
    *   **Trigger:** User is authenticated but identified as a new user (e.g., missing profile details, or `isNewUser` flag is true in `AppNavigator`).
    *   **Flow:** `AppNavigator` directs to `OnboardingFlow` (`src/screens/OnboardingScreens/OnboardingFlow.tsx`). This is a multi-step process:
        1.  **Step 1: Personal Info (`OnboardingPersonalInfo`)**
            *   Collects: First Name, Last Name. Email is pre-filled.
        2.  **Step 2: Contact Info (`OnboardingContactInfo`)**
            *   Collects: Phone, Address, City, Country.
        3.  **Step 3: Work Info (`OnboardingWorkInfo`)**
            *   Collects: Company (Note: `Montenegro Duty Free` is a hardcoded default here, should be dynamic or removed for production), Department, Position.
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
        *   `TravelOrdersScreen` (formerly `TripScreen`): Manage and view travel orders (Putni Nalog). This screen will serve as the entry point for creating new travel orders, viewing existing ones, and accessing individual trips within a travel order. It will also be the main hub for the new complex cost calculation and offline synchronization.
        *   `ExpensesScreen`: Manage and view expenses. This will integrate with the new fuel expense module.
        *   `RemindersScreen`: Manage and view reminders.
        *   `ReservationsScreen`: Manage and view reservations.
    *   **Access to Other Stack Screens:** From various points within the `TabNavigator` or other screens, users can navigate to a wide range of screens defined in `AppNavigator`'s stack, including:
        *   Profile Management: `UserProfileScreen`, `ProfileScreen`, `EditProfileScreen`, `ChangePasswordScreen`.
        *   Vehicle Management: `VehicleListScreen`, `EditVehicleScreen`, `VehicleFormScreen`, `VehicleScreen`.
        *   Location Management: `LocationsScreen`, `EditLocationScreen`, `AddLocationScreen`.
        *   Route Management: `RouteScreen`, `EditRouteScreen`, `AddRouteScreen`, `RouteFormScreen`.
        *   Fuel Prices: `FuelPricesScreen`, `EditFuelPriceScreen`, `AddFuelPriceScreen`.
        *   Expense Details: `ExpenseDetailsScreen`, `EditExpenseScreen`, `ReceiptsScreen`.
        *   Travel Order Details: `TravelOrderDetailsScreen` (new), `TripDetailsScreen`, `TripMapScreen`. `TripDetailsScreen` will now display details of individual trips *within* a selected `TravelOrder`.
        *   Settings & Admin: `SettingsScreen`, `LanguageScreen`, `NotificationsSettingsScreen`, `HelpSupportScreen`, `PurposeManagementScreen`, `PermissionsScreen`, `PermissionLevelsScreen`, `PermissionMatrixScreen`, `UserPermissionsScreen`, `TestDataScreen`.
        *   And others like `AnalyticsScreen`, `ReportsScreen`, `WelcomeScreen` (its role needs further clarification in the authenticated flow, potentially as an initial dashboard or notification screen).

## 4. Navigation Map
(A visual diagram would be beneficial here, illustrating the connections between Navigators and Screens. *Will be added as a Mermaid diagram below.*)

**Key Navigation Stacks:**
- `AuthNavigator Stack` (Unauthenticated / Pre-Login)
- `AppNavigator Stack` (Authenticated - Main container)
  - `OnboardingFlow Stack` (If new user)
  - `TabNavigator` (Bottom Tabs for existing authenticated users)
    - `HomeScreen`
    - `TravelOrdersScreen` (formerly `TripScreen`)
    - `ExpensesScreen`
    - `RemindersScreen`
    - `ReservationsScreen`
  - Numerous other screens are part of the `AppNavigator` stack, accessible from tabs or other screens.

## 5. Edge Cases and Error Handling
- Error states during API calls (e.g., Supabase interactions) should lead to user-friendly messages.
- Navigation to non-existent routes (should be handled by navigators).
- Loss of authentication session (should redirect to login).

---

## 6. Visual Navigation Flow (Mermaid Diagram)

```mermaid
graph TD;
    A[App Entry] --> B{Is Authenticated?};
    B -- No --> C[AuthNavigator (Stack)];
    C --> D[LoginScreen];
    C --> E[RegisterScreen];
    D --> B;
    E --> B;

    B -- Yes --> F{Is New User?};
    F -- Yes --> G[OnboardingFlow Stack];
    G --> H[OnboardingPersonalInfoScreen];
    G --> I[OnboardingContactInfoScreen];
    G --> J[OnboardingWorkInfoScreen];
    G --> K[OnboardingVehicleInfoScreen];
    G --> L[OnboardingPhotoInfoScreen];
    G --> M[OnboardingCompleteScreen];
    M --> N[AppNavigator (Stack)];

    F -- No --> N[AppNavigator (Stack)];
    N --> O[TabNavigator (Bottom Tabs)];

    O --> P[HomeScreen];
    O --> Q[TravelOrdersScreen];
    O --> R[ExpensesScreen];
    O --> S[RemindersScreen];
    O --> T[ReservationsScreen];

    Q --> U[AddTravelOrderScreen];
    Q --> V[TravelOrderDetailsScreen];
    V --> W[TripDetailsScreen];

    R --> X[AddExpenseScreen];
    R --> Y[EditExpenseScreen];

    N --> Z[SettingsScreen];
    N --> AA[UserProfileScreen];
    N --> BB[VehicleListScreen];
    N --> CC[AdminPanelScreen];
    
    style A fill:#f9f,stroke:#333,stroke-width:2px;
    style B fill:#fff,stroke:#333,stroke-width:2px;
    style F fill:#fff,stroke:#333,stroke-width:2px;
    style N fill:#fff,stroke:#333,stroke-width:2px;
    style O fill:#fff,stroke:#333,stroke-width:2px;
    
    linkStyle 0 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 1 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 2 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 3 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 4 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 5 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 6 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 7 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 8 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 9 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 10 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 11 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 12 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 13 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 14 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 15 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 16 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 17 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 18 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 19 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 20 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 21 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 22 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 23 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 24 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 25 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 26 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 27 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 28 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 29 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 30 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 31 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 32 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 33 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 34 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 35 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 36 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 37 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 38 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 39 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 40 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 41 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 42 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 43 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 44 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 45 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 46 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 47 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 48 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 49 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 50 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 51 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 52 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 53 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 54 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 55 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 56 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 57 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 58 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 59 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 60 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 61 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 62 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 63 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 64 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 65 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 66 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 67 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 68 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 69 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 70 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 71 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 72 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 73 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 74 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 75 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 76 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 77 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 78 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 79 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 80 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 81 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 82 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 83 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 84 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 85 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 86 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 87 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 88 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 89 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 90 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 91 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 92 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 93 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 94 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 95 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 96 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 97 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 98 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 99 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 100 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 101 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 102 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 103 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 104 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 105 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 106 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 107 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 108 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 109 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 110 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 111 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 112 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 113 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 114 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 115 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 116 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 117 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 118 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 119 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 120 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 121 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 122 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 123 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 124 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 125 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 126 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 127 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 128 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 129 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 130 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 131 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 132 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 133 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 134 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 135 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 136 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 137 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 138 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 139 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 140 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 141 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 142 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 143 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 144 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 145 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 146 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 147 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 148 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 149 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 150 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 151 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 152 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 153 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 154 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 155 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 156 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 157 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 158 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 159 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 160 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 161 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 162 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 163 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 164 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 165 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 166 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 167 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 168 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 169 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 170 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 171 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 172 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 173 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 174 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 175 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 176 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 177 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 178 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 179 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 180 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 181 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 182 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 183 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 184 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 185 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 186 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 187 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 188 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 189 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 190 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 191 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 192 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 193 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 194 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 195 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 196 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 197 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 198 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 199 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 200 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 201 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 202 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 203 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 204 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 205 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 206 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 207 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 208 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 209 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 210 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 211 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 212 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 213 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 214 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 215 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 216 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 217 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 218 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 219 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 220 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 221 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 222 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 223 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 224 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 225 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 226 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 227 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 228 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 229 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 230 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 231 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 232 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 233 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 234 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 235 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 236 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 237 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 238 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 239 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 240 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 241 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 242 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 243 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 244 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 245 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 246 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 247 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 248 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 249 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 250 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 251 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 252 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 253 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 254 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 255 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 256 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 257 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 258 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 259 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 260 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 261 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 262 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 263 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 264 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 265 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 266 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 267 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 268 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 269 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 270 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 271 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 272 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 273 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 274 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 275 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 276 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 277 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 278 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 279 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 280 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 281 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 282 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 283 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 284 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 285 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 286 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 287 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 288 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 289 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 290 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 291 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 292 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 293 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 294 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 295 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 296 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 297 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 298 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 299 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 300 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 301 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 302 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 303 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 304 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 305 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 306 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 307 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 308 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 309 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 310 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 311 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 312 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 313 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 314 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 315 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 316 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 317 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 318 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 319 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 320 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 321 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 322 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 323 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 324 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 325 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 326 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 327 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 328 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 329 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 330 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 331 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 332 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 333 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 334 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 335 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 336 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 337 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 338 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 339 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 340 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 341 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 342 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 343 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 344 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 345 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 346 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 347 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 348 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 349 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 350 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 351 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 352 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 353 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 354 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 355 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 356 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 357 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 358 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 359 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 360 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 361 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 362 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 363 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 364 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 365 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 366 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 367 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 368 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 369 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 370 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 371 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 372 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 373 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 374 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 375 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 376 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 377 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 378 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 379 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 380 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 381 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 382 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 383 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 384 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 385 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 386 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 387 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 388 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 389 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 390 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 391 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 392 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 393 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 394 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 395 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 396 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 397 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 398 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 399 stroke:#666,stroke-width:2px,fill:none;
    linkStyle 400 stroke:#666,stroke-width:2px,fill:none;