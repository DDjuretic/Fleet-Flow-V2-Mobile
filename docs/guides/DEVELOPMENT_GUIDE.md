# Fleet Flow Next Gen - Development Guide

## 1. Overview
This document outlines the frontend architecture, key libraries, coding conventions, and development workflow for the Fleet Flow Next Gen project.

- **Mobile App:** React Native application built with Expo.
- **Web App:** Next.js (to be developed).
- **Core Technology:** TypeScript.
- **State Management:** Redux Toolkit.
- **Navigation:** React Navigation.
- **Backend Services:** Supabase.
- **Internationalization (i18n):** Complete system supporting EN, SR, DE, ME.

---

## 2. Project Folder Structure
The project is structured to support a phased development approach: initially a standalone mobile application for stability, followed by integration into a monorepo with a web application.

```
/
├── assets/                 # Global assets (icons, images, fonts)
├── docs/                   # Project documentation
│   ├── guides/             # How-to guides (Setup, Development)
│   └── planning/           # Architectural and planning documents
├── src/                    # All source code for the mobile app
│   ├── api/                # RTK Query API slices
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React Context providers (e.g., AuthContext)
│   ├── i18n.ts             # i18n configuration and translations
│   ├── lib/                # Core libraries setup (e.g., supabase.ts)
│   ├── navigation/         # React Navigation setup (navigators, stacks)
│   ├── screens/            # Top-level screen components
│   ├── store/              # Redux store setup
│   ├── styles/             # Global styles
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── supabase/               # Supabase local development setup
│   └── migrations/         # Database migration files
├── App.tsx                 # Root component for the mobile app
├── package.json            # Project dependencies and scripts
└── ...                     # Other configuration files (babel, tsconfig, etc.)
```

---

## 3. Key Libraries & Frameworks
- **React Native & Expo:** Core platform for the mobile app.
- **React Navigation:** For all navigation logic (`@react-navigation/native`, `@react-navigation/stack`).
- **Redux Toolkit:** For global state management.
- **Supabase Client:** For all backend interactions (`@supabase/supabase-js`).
- **react-i18next:** For internationalization.
- **React Native Reanimated:** For animations.

---

## 4. Coding Conventions & Best Practices

### General
- **Language:** All code, comments, variable names, and function names **must be in English**.
- **Formatting:** Use Prettier (configuration to be added) for consistent code formatting.
- **Linting:** ESLint is configured to enforce code quality. Address all linting errors.

### Internationalization (i18n)
- **Golden Rule:** **NO hardcoded user-facing strings.** All text displayed to the user (labels, titles, alerts, placeholders, etc.) **MUST** use the `t()` function from `react-i18next`.
- **Workflow:** When adding a new feature, ensure all new text keys are added to `src/i18n.ts` for all supported languages.

### Component Design
- **Functional Components:** All components should be functional components using React Hooks.
- **Reusability:** Create generic, reusable components in `/src/components` whenever possible.
- **Props:** Use clear and descriptive prop names. Define types for all props.

### State Management
- **Global State:** Use Redux Toolkit for state that is shared across many components (e.g., user profile, settings).
- **Local State:** Use `useState` for state that is confined to a single component.
- **Context API:** Use React Context (`/src/contexts`) for state that needs to be shared with a subtree of components, but isn't global (e.g., `AuthContext`).

### API Integration
- All Supabase interactions should be managed through the client initialized in `src/lib/supabase.ts`.
- For data fetching and caching, prefer using **RTK Query** API slices located in `src/api`. This provides automatic caching, loading states, and error handling.

---

## 5. Styling
- **Method:** Use React Native's built-in `StyleSheet.create()` for styling components.
- **Consistency:** Follow the existing design language for colors, fonts, and spacing. Define shared styles or theme objects in `/src/styles` when applicable.

---

## 6. Testing Strategy
- **Unit Tests:** Jest is configured. Focus on testing utility functions, Redux reducers, and complex business logic.
- **Component Tests:** Use React Native Testing Library to test component rendering and user interactions.
- **E2E Tests:** (To be defined) Consider Maestro for end-to-end testing user flows. 