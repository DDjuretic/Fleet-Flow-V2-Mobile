# Fleet Flow - Application Manual

**Creation Date:** 2025-05-30  
**Version:** 1.0 (Alpha)  
**Status:** In Development  

---

## 📱 Application Overview

**Fleet Flow** is a next-generation fleet management application that combines web and mobile platforms. The application enables complete vehicle management, costs, reservations and fleet operations with advanced features like gamification and real-time tracking.

### 🎯 Key Features
- **Hybrid Architecture**: Web (Next.js + Tailwind CSS) + Mobile (React Native + StyleSheet)
- **Backend**: Supabase with PostgreSQL database
- **Auth System**: Custom implementation with Supabase Auth
- **Real-time**: Fetch-based communication with backend
- **UI/UX**: Glassmorphism design with professional backgrounds

---

## 🔧 Currently Implemented Features

### ✅ **Phase 1: Basic Setup (COMPLETED)**

#### 🔐 **Auth System**
- **User Registration**
  - Location: `apps/mobile/src/screens/auth/RegisterScreen.tsx`
  - Input: First Name, Last Name, Email, Password, Confirm Password
  - Validation: Check all fields, password matching, min 6 characters
  - Backend: Saves to Supabase auth.users + user_metadata

- **User Login**  
  - Location: `apps/mobile/src/screens/auth/LoginScreen.tsx`
  - Input: Email, Password
  - Functionality: Fully functional signin with session management

- **User Logout**
  - Location: Dashboard Sign Out button
  - Functionality: Clears session and returns to login screen

#### 🏠 **Dashboard**
- **Location**: `apps/mobile/src/screens/DashboardScreen.tsx`  
- **Features**:
  - Displays welcome message with user name
  - Shows email address
  - Info about upcoming onboarding process
  - Sign Out option

#### 🔧 **Technical Implementation**
- **Custom Supabase Client** (`apps/mobile/src/lib/supabase.ts`)
  - Fetch-based API calls (avoiding WebSocket issues)
  - Fully functional auth state management
  - Real-time listener system for auth changes
  - IP address configuration for mobile devices

- **AuthContext** (`apps/mobile/src/contexts/AuthContext.tsx`)
  - Centralized auth state management
  - Loading states for better user experience
  - Error handling for auth operations

- **Navigation** (`apps/mobile/App.js`)
  - Conditional rendering based on auth state
  - Loading screen during auth check
  - Stack Navigator for auth flow

---

## 🚧 **In Development - Next Phases**

### **Phase 2: Onboarding Process (NEXT)**

**6-Step Onboarding Flow according to App Flow document:**

1. **Personal Info** - First name, last name (already have from registration)
2. **Contact Info** - Phone, address, city, country  
3. **Work Info** - Department, position, driver's license
4. **Vehicle Info** - Personal vehicle (optional)
5. **Profile Photo** - Upload profile picture
6. **Completion** - Save all to database

**Technical Requirements:**
- Create blur backgrounds for onboarding screens
- Multi-step form with progress bar
- Validation on each step
- Save to Supabase users table

### **Phase 3: Main Features**
- Dashboard with analytics
- Vehicle management (CRUD)
- Trip tracking
- Expenses with receipt upload
- Vehicle reservations
- Notifications and reminders

### **Phase 4: Advanced Features**
- Gamification system
- Geofencing
- GPS tracking
- Driving style analysis
- Reporting

---

## 🗂️ **File Structure**

```
apps/mobile/
├── src/
│   ├── screens/
│   │   ├── main/ ✅ (5 ekrana, svi funkcionalni)
│   │   │   ├── HomeScreen.tsx ✅
│   │   │   ├── TripsScreen.tsx ✅  
│   │   │   ├── ExpensesScreen.tsx ✅
│   │   │   ├── ReservationsScreen.tsx ✅
│   │   │   ├── RemindersScreen.tsx ✅
│   │   │   └── NotificationsScreen.tsx ✅
│   │   ├── auth/ ✅ (kompletno)
│   │   │   ├── LoginScreen.tsx ✅
│   │   │   ├── RegisterScreen.tsx ✅
│   │   │   └── SplashScreen.tsx ✅
│   │   ├── onboarding/ ✅ (6-step flow)
│   │   │   └── OnboardingFlow.tsx ✅
│   │   ├── admin/ ✅ (kompletno)
│   │   │   ├── PendingReservationsScreen.tsx ✅
│   │   │   └── AdminRoleManagementScreen.tsx ✅
│   │   ├── settings/ ⚠️ (partial)
│   │   │   ├── SettingsScreen.tsx ✅
│   │   │   ├── UserProfileScreen.tsx ✅
│   │   │   ├── EditProfileScreen.tsx ⚠️ (stub)
│   │   │   └── NotificationsSettingsScreen.tsx ⚠️ (stub)
│   │   ├── trips/ ⚠️ (partial)
│   │   │   ├── AddTripScreen.tsx ✅
│   │   │   ├── TripDetailsScreen.tsx ✅ 
│   │   │   └── TripMapScreen.tsx ✅
│   │   ├── expenses/ ⚠️ (partial)
│   │   │   └── AddExpenseScreen.tsx ⚠️ (layout only)
│   │   ├── reservations/ ✅ (kompletno)
│   │   │   ├── AddReservationScreen.tsx ✅
│   │   │   ├── EditReservationScreen.tsx ✅
│   │   │   └── ReservationDetailsScreen.tsx ✅
│   │   └── reminders/ ⚠️ (partial)
│   │       └── AddReminderScreen.tsx ⚠️ (layout only)
│   ├── store/ ✅ (kompletno)
│   │   ├── api/supabaseApi.ts ✅ (extensive)
│   │   ├── slices/ ✅ (theme, settings)
│   │   └── index.ts ✅ (persist setup)
│   ├── contexts/
│   │   └── AuthContext.tsx            ✅ Implemented
│   └── lib/
│       └── supabase.ts                ✅ Custom client
├── assets/
│   └── login.png                      ✅ Auth background
└── App.js                             ✅ Navigation
```

---

## 🎨 **Design System**

### **Colors**
- **Primary**: `#2563eb` (blue)
- **Error**: `#ef4444` (red)  
- **Text**: `#374151` (dark gray)
- **Background**: `rgba(255, 255, 255, 0.95)` (white transparent)

### **Components**
- **Glassmorphism forms** with border-radius: 16px
- **Shadows**: elevation 8 for depth
- **Typography**: System fonts with different weights
- **Input fields**: Bordered with placeholder text in gray

---

## 🔍 **Testing**

### **Tested Scenarios**
- ✅ New user registration (`test@example.com`)
- ✅ Login with existing credentials
- ✅ Navigation between auth screens
- ✅ Dashboard display after login
- ✅ User logout
- ✅ Auth state persistence

### **Known Issues**
- 📧 Email verification not sent in dev mode (expected behavior)
- 🌐 Application must use IP address instead of localhost for mobile devices

---

## 🚀 **Deployment Status**

- **Development**: ✅ Local testing works
- **Staging**: ❌ Not implemented  
- **Production**: ❌ Not implemented

---

## 📋 **Next Steps**

1. **Implementation of onboarding flow** (6 steps)
2. **Creating blur backgrounds** for onboarding
3. **Splash screen** with animated logo
4. **Main features** (vehicles, expenses, reservations)
5. **Web application** (parallel development)

---

## 📞 **Contact & Support**

**Developer**: Danko Djuretić  
**Email**: djuretic.danko@gmail.com  
**Project**: Fleet Flow Next Generation  
**GitHub**: [Repository Link]

---

*This document will be updated with each new implemented feature.* 