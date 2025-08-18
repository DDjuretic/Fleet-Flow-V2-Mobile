# Fleet Flow Next Gen - PROJECT BLUEPRINT

## 1. High-Level Vision & Goal

To build a comprehensive, multi-tenant SaaS platform for fleet management, targeting businesses of all sizes. The platform will consist of a React Native mobile application for drivers and a Next.js web application for administrators and managers.

The core value proposition is to provide a powerful, yet user-friendly tool for optimizing fleet operations, reducing costs, and improving driver safety and efficiency through real-time data, detailed analytics, and automation.

## 2. Core Architecture: Multi-Tenant SaaS

- **Model:** Shared Database, Separate Schema with Row-Level Security (RLS). This provides a good balance of data isolation, cost-effectiveness, and maintainability for the initial SaaS offering.
- **Tenant Identifier:** `company_id` will be present in all relevant tables to enforce data separation.
- **Authentication:** Supabase Auth will manage users. The first user to register a company becomes the default 'admin' for that `company_id`.
- **Subscription & Billing:** Managed through a dedicated web portal (`/billing`). Stripe will be used for payment processing and handling subscription lifecycle events via webhooks.

## 3. Technology Stack

- **Mobile App:** React Native (Expo)
- **Web App:** Next.js
- **Backend & Database:** Supabase (PostgreSQL)
- **State Management:** Redux Toolkit
- **UI (Web):** Tailwind CSS
- **UI (Mobile):** StyleSheet (with custom components)
- **Styling:** Consistent styling across both platforms.
- **i18n:** Fully internationalized with support for EN, SR, DE, ME.

## 4. Phased Implementation Roadmap

This is a high-level roadmap combining business features and technical implementation.

- **Phase 1: Core Platform & Authentication (Foundational Work in Progress)**
    - [ ] Stabilize project structure. (In progress: Ongoing documentation refinement and setup validation)
    - [ ] Implement the new user registration flow (`signUp` -> `createCompany`). (`createCompany` logic is a future backend task)
    - [ ] Establish a clean, well-documented codebase. (Ongoing: Documentation is actively being refined)
    - [ ] Finalize the multi-tenant database schema with RLS. (Ongoing: Initial schema defined, further refinement with `travel_orders` in progress)

- **Phase 2: Core Feature Implementation (MVP)**
    - Implement all features marked as `(Core)` in `Revidirana_Lista_Funkcionalnosti.md`.
    - This includes: Trips, Expenses, Reservations, Reminders, Basic Vehicle & User Management (CRUD).
    - Develop the Admin Panel on the web app.
    - Ensure all user-facing text is managed via the i18n system.

- **Phase 3: Subscription & Billing System**
    - Develop the web billing portal.
    - Integrate Stripe for handling subscriptions (Starter, Business, Enterprise).
    - Implement feature flagging based on the subscription plan.
    - Implement logic for trials and grace periods.

- **Phase 4: Advanced Features & Analytics**
    - Implement features from the "Napredne Funkcionalnosti" section.
    - Develop the advanced analytics and reporting module.
    - Introduce geofencing and other location-based automation.
    - **Integrate "Putni Nalog" Concept (from Putni-nalog App):**
        - Refactor existing "Trip" module to align with "Putni Nalog" concept, including handling multiple drives within a single "Putni Nalog".
        - Implement comprehensive cost logic (truck, car, fuel price, average consumption) from "Putni-nalog".
        - **Offline Mode Integration:** Integrate robust offline mode and synchronization logic as implemented in "Putni-nalog" (using Expo Task Manager, AsyncStorage for background sync).
        - **Fuel Expense Module:** Replace/adapt existing fuel module with the more robust and logically sound fuel expense module from "Putni-nalog", ensuring it is seamlessly integrated into Fleet Flow's data structures and UI.
        - **Enhanced Reports:** Incorporate the advanced reporting features for drives and fuel from "Putni-nalog" into Fleet Flow's analytics module.
        - **Trip Path Tracking:** Ensure detailed trip paths (coordinates) are stored and visualized on the map, leveraging the existing OpenStreetMap/Leaflet setup in WebMapView.
        - **Pause Logic:** Develop and integrate logic for detecting and recording pauses during trips based on location data.
        - **Fuel Station Geocoding:** Integrate automatic fuel station location identification using geolocation.

- **Phase 5: Scaling & Optimization**
    - Performance optimization and database tuning.
    - Implement advanced features like white-labeling for Enterprise clients.
    - Expand API for third-party integrations.

## 5. Key Guiding Principles

- **Documentation First:** All major changes or features should be reflected in the documentation.
- **Clean Code:** Adhere to the conventions outlined in `DEVELOPMENT_GUIDE.md`.
- **No Hardcoded Strings:** All user-facing text MUST go through the i18n system.
- **Learn from Mistakes:** Regularly review and update `LESSONS_LEARNED.md` to avoid repeating past errors. 