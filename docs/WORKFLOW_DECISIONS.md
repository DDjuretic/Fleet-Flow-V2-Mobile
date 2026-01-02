# 📋 WORKFLOW & DECISIONS - Fleet Flow V2 Mobile

**Datum kreiranja:** Januar 2026
**Verzija:** 1.0.0
**Status:** Active Development
**Autor:** Danko Djuretic

---

## 🎯 **SVRHA DOKUMENTA**

Ovaj dokument služi za **praćenje svih odluka** tokom razvoja Fleet Flow aplikacije. Ovdje se bilježe:

- ✅ **Done** - Implementirane funkcionalnosti
- 🚧 **In Progress** - Trenutno u razvoju
- 📅 **Planned** - Planirane za buduće faze
- ❌ **Cancelled** - Otkazane odluke/funkcionalnosti
- 🔄 **Changed** - Promjene u planu

---

## 📊 **STATUS OVERVIEW**

### **Trenutni Status: GPS CORE IMPLEMENTATION**
- **Sprint:** GPS Core Development
- **Trajanje:** 1-2 nedelje
- **Prioritet:** HIGH (blocking core functionality)
- **Team:** Danko Djuretic (solo development)

### **Metrics:**
- **Completion:** 80% infrastructure, 20% core features
- **Next Milestone:** GPS tracking MVP
- **Blockers:** None
- **Risk Level:** LOW

### **Infrastructure Status:**
- ✅ **Domen:** fleetflow.me (aktivno)
- ✅ **Cloudflare:** DNS & CDN konfigurisan
- 🔄 **Supabase:** Free plan, postoji pauziran projekat "Fleet-Flow-Next-Gen" (treba restore)
- ✅ **Serveri:** OSRM (https://osrm.fleetflow.me), Speed Limit (https://speedlimit.fleetflow.me), Maestro (Docker)
- ✅ **Development:** macOS + Windows + Linux, Android/iOS simulatori, Node.js v22.21.1
- 📅 **Deployment:** Apple/Android developer accounts (za 1-2 mjeseca)
- ✅ **API Keys:** Google Maps (ima), Stripe (lični), Email (fleetflow.me domen)

### **Local Development Strategy:**
#### **✅ DECIDED: Lokalni Supabase + Docker (Besplatno)**
**Date:** Januar 2026
**Rationale:** Izbjegavanje plaćanja za development, brži lokalni rad
**Implementation:**
1. Download backup iz pauziranog "Fleet-Flow-Next-Gen" projekta
2. Restore lokalno sa Docker-om
3. Development na lokalnoj bazi
4. Kasnije migracija na novi cloud projekat

**Benefits:**
- Besplatno za development
- Brže lokalne testove (5-10x brže)
- Kontrola nad podacima
- Offline development moguć

---

## 🚀 **FAZE RAZVOJA**

### **FAZA 1: GPS CORE (Current - 1-2 weeks)**
**Goal:** Implement ultra-precise GPS tracking from Putni Nalog

#### **✅ COMPLETED:**
- [x] Project infrastructure setup
- [x] Supabase multi-tenant schema
- [x] Authentication system
- [x] Admin panel UI
- [x] Database migrations
- [x] Travel Orders schema
- [x] Fuel management schema

#### **🚧 IN PROGRESS:**
- [ ] GPS permissions & location services
- [ ] Trip tracking implementation
- [ ] Pause detection algorithm
- [ ] Trip lifecycle (start/stop/pause)
- [ ] Basic trip UI integration

#### **📅 PLANNED:**
- [ ] Fuel cost calculation
- [ ] Travel order business logic
- [ ] Offline sync validation
- [ ] Performance testing

---

## 🔧 **TECHNICAL DECISIONS**

### **1. GPS Tracking Architecture**

#### **✅ DECIDED: Ultra-Precise GPS (15m accuracy)**
**Date:** Januar 2026
**Rationale:** Putni Nalog proven system with 5-level filtering
**Implementation:**
- Activity recognition (walking filter)
- Speed filtering (15 km/h minimum)
- Distance filtering (3m minimum step)
- Pause detection (50m radius, 3min timeout)
- OSRM map matching (25m tolerance)

**Alternatives Considered:**
- Standard GPS (too inaccurate)
- Google Fused Location (battery drain)
- Custom algorithm (time consuming)

#### **✅ DECIDED: Expo Location API**
**Date:** Januar 2026
**Rationale:** Native performance with Expo compatibility
**Implementation:**
- `expo-location` for GPS access
- Background task manager for continuous tracking
- Keep awake integration

### **2. State Management**

#### **✅ DECIDED: Redux Toolkit + RTK Query**
**Date:** Januar 2026
**Rationale:** Enterprise-grade with automatic caching
**Implementation:**
- Redux Toolkit for global state
- RTK Query for Supabase API
- Redux Persist for offline state

**Alternatives Considered:**
- Context API (too simple for enterprise)
- Zustand (less ecosystem support)
- MobX (complexity)

### **3. Database Architecture**

#### **✅ DECIDED: Multi-Tenant with RLS**
**Date:** Januar 2026
**Rationale:** SaaS-ready with automatic data isolation
**Implementation:**
- `company_id` in all tables
- Row Level Security policies
- Automatic tenant filtering

**Alternatives Considered:**
- Separate databases (cost prohibitive)
- Schema separation (maintenance overhead)

---

## 🎨 **DESIGN DECISIONS**

### **1. Color Scheme**

#### **✅ DECIDED: Professional Blue/Cyan Palette**
**Date:** Januar 2026
**Rationale:** Enterprise software standards
**Implementation:**
```typescript
Light: primary: #007AFF, secondary: #5856D6
Dark: primary: #00E0FF, secondary: #4A5263
```

**Alternatives Considered:**
- Green theme (too playful)
- Red theme (aggressive)
- Monochrome (boring)

### **2. Navigation Pattern**

#### **✅ DECIDED: Tab + Stack Hybrid**
**Date:** Januar 2026
**Rationale:** iOS/Android native patterns
**Implementation:**
- 5 main tabs (Home, Trips, Fuel, Reports, Settings)
- Modal stack for admin panels
- Stack for auth flow

---

## 📱 **FEATURE DECISIONS**

### **1. Authentication Flow**

#### **✅ DECIDED: Company-First Registration**
**Date:** Januar 2026
**Rationale:** B2B SaaS model requirements
**Implementation:**
1. User registration
2. Company creation/verification
3. Admin role assignment
4. Onboarding flow (7 steps)

#### **✅ DECIDED: 7-Step Onboarding**
**Date:** Januar 2026
**Steps:**
1. Personal Info (name, email)
2. Contact Info (phone, address)
3. Work Info (department, position)
4. Vehicle Info (optional)
5. Profile Photo (upload)
6. Completion (confirmation)
7. Welcome screen

### **2. Trip Management**

#### **✅ DECIDED: Travel Orders + Trips Hierarchy**
**Date:** Januar 2026
**Rationale:** Complex business logic from Putni Nalog
**Implementation:**
- Travel Order: Parent entity (business trip)
- Trip: Child entity (individual drive)
- Multiple trips per travel order
- Separate cost calculations

### **3. Fuel Management**

#### **✅ DECIDED: Automatic Calculation Engine**
**Date:** Januar 2026
**Rationale:** Eliminate manual calculations
**Formula:**
```
Fuel Cost = (Distance / 100) × Consumption × Price
Total Cost = Fuel Cost + Amortization
```

---

## 🧪 **TESTING DECISIONS**

### **1. E2E Testing**

#### **✅ DECIDED: Maestro Framework**
**Date:** Januar 2026
**Rationale:** Works with Expo Go, faster than Detox
**Implementation:**
- YAML-based test scripts
- Visual debugging with Maestro Studio
- CI/CD integration

**Alternatives Considered:**
- Detox (requires custom builds)
- Appium (complex setup)

### **2. Test Coverage**

#### **📅 PLANNED: 80% Unit Test Coverage**
**Target:** Januar 2026
**Focus Areas:**
- Business logic (cost calculations)
- API integration (Supabase)
- GPS algorithms
- Offline sync

---

## 🚀 **DEPLOYMENT DECISIONS**

### **1. Mobile Deployment**

#### **✅ DECIDED: EAS Build + Stores**
**Date:** Januar 2026
**Implementation:**
- Expo Application Services (EAS)
- Internal testing track
- Store submissions (Google Play, App Store)

### **2. Web Deployment**

#### **📅 PLANNED: Vercel + fleetflow.me**
**Target:** Mart 2026
**Implementation:**
- Next.js 15 deployment
- Domain: fleetflow.me (Cloudflare)
- SSL certificates (Cloudflare)
- CDN optimization (Cloudflare)

---

## 🔄 **CHANGES & REVISIONS**

### **1. Architecture Changes**

#### **🔄 CHANGED: From Single DB to Multi-Tenant**
**Date:** Januar 2026
**Reason:** SaaS scalability requirements
**Impact:** Schema redesign with company_id

#### **🔄 CHANGED: From Context to Redux**
**Date:** Januar 2026
**Reason:** Enterprise state management needs
**Impact:** Migration from useContext to Redux Toolkit

### **2. Feature Changes**

#### **❌ CANCELLED: Real-time Chat**
**Date:** Januar 2026
**Reason:** Not core to fleet management
**Impact:** Removed from MVP scope

#### **📅 DELAYED: Advanced Analytics**
**Date:** Januar 2026
**Reason:** GPS implementation priority
**New Target:** Februar 2026

---

## 📋 **CURRENT SPRINT PLAN**

### **Sprint: GPS Core Implementation**
**Duration:** 1-2 weeks
**Start Date:** Januar 2026

#### **🎯 Objectives:**
- Implement GPS tracking system
- Add trip lifecycle management
- Integrate pause detection
- Create basic trip UI
- Test GPS accuracy

#### **📝 Tasks:**
- [ ] Setup location permissions
- [ ] Implement LocationService
- [ ] Add GPS background tracking
- [ ] Create TripTracking hook
- [ ] Implement pause algorithm
- [ ] Add trip start/stop UI
- [ ] Test GPS accuracy
- [ ] Performance optimization

#### **✅ Acceptance Criteria:**
- GPS accuracy ±15m
- Battery usage <10%/hour
- Trip creation <30 seconds
- Offline trip storage
- Automatic sync on reconnect

---

## 🔮 **FUTURE DECISIONS**

### **Pending Decisions:**

#### **📅 WEB FRAMEWORK SELECTION**
**Timeline:** Februar 2026
**Options:**
- Next.js 15 (current plan)
- Nuxt.js
- SvelteKit
**Decision Criteria:** Developer experience, ecosystem, performance

#### **📅 ANALYTICS PLATFORM**
**Timeline:** Mart 2026
**Options:**
- Google Analytics
- Mixpanel
- Custom solution
**Decision Criteria:** Cost, GDPR compliance, real-time capabilities

#### **📅 NOTIFICATION SYSTEM**
**Timeline:** Februar 2026
**Options:**
- Firebase Cloud Messaging
- Expo Notifications
- Custom WebSocket solution
**Decision Criteria:** Reliability, cross-platform support, cost

---

## 📈 **METRICS & MONITORING**

### **Development Metrics:**
- **Sprint Velocity:** Track completed story points
- **Code Quality:** ESLint violations, TypeScript errors
- **Test Coverage:** Unit test percentage
- **Performance:** Bundle size, load times

### **Product Metrics:**
- **GPS Accuracy:** ±15m target
- **Battery Usage:** <10% per hour
- **Sync Success:** 99.9% target
- **User Satisfaction:** App store ratings

---

## 📝 **CHANGE LOG**

### **Version 1.0.0 - GPS Core**
**Date:** Januar 2026
**Changes:**
- ✅ Infrastructure setup completed
- ✅ Multi-tenant authentication implemented
- ✅ Admin panel UI ready
- 🚧 GPS tracking in development
- 📅 Web platform planned

### **Version 0.9.0 - Enterprise Shell**
**Date:** Januar 2026
**Changes:**
- ✅ Supabase multi-tenant setup
- ✅ 25+ screens implemented
- ✅ Redux + RTK Query configured
- ✅ Design system completed
- ✅ Offline architecture ready

---

## 🤝 **STAKEHOLDER COMMUNICATION**

### **Communication Channels:**
- **GitHub Issues:** Feature requests & bug reports
- **Pull Requests:** Code review discussions
- **Documentation:** Updated with every change
- **Change Log:** Version release notes

### **Review Process:**
- **Code Reviews:** Required for all PRs
- **Architecture Decisions:** Documented here
- **Feature Approvals:** GitHub issues with acceptance criteria

---

## 🎯 **SUCCESS CRITERIA**

### **MVP Success (March 2026):**
- ✅ GPS tracking ±15m accuracy
- ✅ Trip management with pause detection
- ✅ Fuel cost automatic calculation
- ✅ Offline sync reliability
- ✅ Admin panel functionality
- ✅ Web platform basic features

### **Production Success (June 2026):**
- ✅ 99.9% uptime
- ✅ <30s trip creation
- ✅ <10% battery usage
- ✅ Enterprise security compliance
- ✅ Multi-language support
- ✅ Real-time fleet monitoring

---

**🚀 Updated with every major decision and change!**
