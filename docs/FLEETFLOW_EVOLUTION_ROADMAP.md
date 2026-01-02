# **FLEETFLOW EVOLUCIJA: MODULARNI PRISTUP & VIŠENIVOJSKI SISTEM**

## **📋 PREGLED PREDLOGA**

Vaši predlozi o evoluciji FleetFlow aplikacije su izuzetno dobro promišljeni. Modularni pristup sa različitim nivoima korisnika omogućiće skalabilnost, fleksibilnost i prilagođavanje različitim tipovima korisnika.

**Datum kreiranja**: Januar 2026
**Verzija**: 1.0
**Autor**: FleetFlow Development Team

---

## **👥 NIVOI KORISNIKA & NJIHOVE POTREBE**

### **1. OSNOVNI KORISNICI (RESERVATIONS ONLY)**
**Trenutni "Putni nalog" korisnici**
- **Uređaj**: Telefon
- **Potrebe**:
  - Jednostavne rezervacije vozila
  - Osnovno praćenje korišćenja
  - Minimalne funkcije
- **UI/UX**:
  - Vrlo jednostavan interfejs
  - Fokus na brzinu i jednostavnost
  - Nema kompleksnih podešavanja

### **2. VOZAČI/DOSTAVLJAČI (FIELD WORKERS)**
**Tablet korisnici sa OEDB povezivanjem**
- **Uređaj**: Tablet (veći ekran, bolja preglednost)
- **Potrebe**:
  - **Vehicle Integration (OEDB sistem)**:
    - Real-time parametri vozila
    - Upozorenja i alarme
    - Automatsko upisivanje kilometraže
    - Nivo goriva praćenje
    - Dijagnostički kodovi
  - **Task Management**:
    - Optimizovane rute dostave
    - Prioritetni taskovi
    - Time windows za isporuke
    - Proof of delivery (elektronski potpis)
    - Real-time updates
- **UI/UX**:
  - Veliki ekrani za bolju vidljivost
  - Touch-optimized interface
  - Offline-first funkcionalnost

### **3. ADMINISTRATORI (WEB DASHBOARD)**
**Glavni sistem na web platformi**
- **Uređaj**: Desktop/Web browser
- **Potrebe**:
  - **Task Creation & Distribution**:
    - Kreiranje zadataka za vozače
    - Distribucija zadataka po vozilima
    - Optimizacija ruta
    - Real-time monitoring
  - **WMS Integration**:
    - Uvoz podataka o robi iz WMS sistema
    - Automatizacija task kreiranja
    - Inventory tracking
  - **Analytics & Reporting**:
    - Performance analytics
    - Cost analysis
    - Route optimization reports
    - Driver productivity metrics
  - **System Administration**:
    - User management
    - Permission settings
    - Company policies
    - Backup & restore

---

## **🏗️ TEHNIČKA ARHITEKTURA**

### **MODULARNI SISTEM KOMPONENTI**

```
┌─────────────────────────────────────────────────────────────┐
│                    WEB DASHBOARD (ADMIN)                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Task Management  │  Route Optimization  │ Analytics │    │
│  │  User Admin       │  WMS Integration     │ Reports   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ API Layer (REST/GraphQL)
                          │
┌─────────────────────────┼───────────────────────────────────┐
│ MOBILE APP              │              VEHICLE OBD         │
│ ┌─────────────────────┐ │              ┌─────────────────┐ │
│ │ Driver Tasks        │ │              │ OBD-II System   │ │
│ │ Reservations        │ │◄────────────►│ Real-time Data  │ │
│ │ Basic Features      │ │              │ Diagnostics     │ │
│ └─────────────────────┘ │              └─────────────────┘ │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          │
┌─────────────────────────┴───────────────────────────────────┐
│                    DATABASE LAYER                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Users  │  Tasks  │  Vehicles  │  Routes  │  WMS    │    │
│  │  Roles  │  Cargo  │  Sensors   │  Analytics│  Sync   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### **PERMISSION SISTEM**

**Postojeći sistem je odličan temelj, ali treba ga proširiti:**

```typescript
// Novi permission nivoi
enum UserTier {
  BASIC_USER = 'basic_user',        // Samo rezervacije
  FIELD_WORKER = 'field_worker',    // Vozači/Dostavljači sa OBD
  ADMINISTRATOR = 'administrator'   // Web admin
}

// Feature flags po nivoima
const FEATURE_MATRIX = {
  [UserTier.BASIC_USER]: {
    reservations: true,
    basic_tracking: true,
    obd_integration: false,
    task_management: false,
    analytics: false,
    wms_integration: false,
    admin_panel: false
  },
  [UserTier.FIELD_WORKER]: {
    reservations: true,
    basic_tracking: true,
    obd_integration: true,
    task_management: true,
    analytics: false,
    wms_integration: false,
    admin_panel: false
  },
  [UserTier.ADMINISTRATOR]: {
    reservations: true,
    basic_tracking: true,
    obd_integration: true,
    task_management: true,
    analytics: true,
    wms_integration: true,
    admin_panel: true
  }
};
```

---

## **📱 MOBILE APP EVOLUCIJA**

### **FAZE IMPLEMENTACIJE**

#### **FAZA 1: BASIC USER MODE**
- **Target**: Jednostavni korisnici
- **Features**:
  - Streamlined reservation system
  - Basic vehicle tracking
  - Minimal UI complexity
  - No advanced features

#### **FAZA 2: FIELD WORKER ENHANCEMENT**
- **Target**: Vozači i dostavljači
- **Features**:
  - **OBD-II Integration**:
    - Real-time vehicle parameters
    - Automatic mileage logging
    - Fuel level monitoring
    - Diagnostic alerts
  - **Task Management**:
    - Optimized delivery routes
    - Priority-based task queue
    - Proof of delivery (digital signature)
    - Real-time status updates

#### **FAZA 3: DUAL SIDEBAR UI**
- **Left Sidebar**: Settings & System (svi nivoi)
- **Right Sidebar**: Core Features (prilagođeno nivou)
- **Dynamic Feature Loading**: Bazirano na permisijama

---

## **🌐 WEB DASHBOARD (ADMINISTRATOR)**

### **KLJUČNE FUNKCIJE**

#### **1. TASK MANAGEMENT SYSTEM**
```
Task Creation Workflow:
1. Import from WMS → Parse cargo data
2. Define delivery points → Geocode addresses
3. Set time windows → Priority levels
4. Assign to drivers → Optimize routes
5. Real-time monitoring → Status updates
```

#### **2. WMS INTEGRATION**
- **API Connectors**:
  - REST API za WMS sisteme
  - Scheduled sync jobs
  - Data transformation layer
  - Error handling & retry logic
- **Automated Task Generation**:
  - Cargo manifest parsing
  - Route optimization
  - Driver assignment algorithms

#### **3. ANALYTICS & REPORTING**
- **Real-time Dashboards**:
  - Fleet utilization
  - Driver performance
  - Route efficiency
  - Cost analysis
- **Advanced Reports**:
  - Delivery success rates
  - Time window compliance
  - Fuel consumption patterns
  - Maintenance schedules

---

## **🔧 IMPLEMENTACIJA DETALJI**

### **OBD-II INTEGRATION (FIELD WORKERS)**

```typescript
interface OBDData {
  vehicle_id: string;
  timestamp: Date;
  parameters: {
    speed: number;
    rpm: number;
    fuel_level: number;
    engine_temp: number;
    mileage: number;
    diagnostic_codes: string[];
    battery_voltage: number;
  };
}

interface VehicleIntegration {
  connect(deviceId: string): Promise<boolean>;
  getRealTimeData(): Promise<OBDData>;
  setAlerts(callback: (alert: OBDAlert) => void): void;
  disconnect(): Promise<void>;
}
```

### **TASK MANAGEMENT SYSTEM**

```typescript
interface DeliveryTask {
  task_id: string;
  type: 'pickup' | 'delivery' | 'service' | 'break';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: GeoPoint;
  time_window: {
    start: Date;
    end: Date;
  };
  cargo_details: {
    items: CargoItem[];
    weight: number;
    dimensions: Dimensions;
  };
  status: TaskStatus;
  assigned_driver: string;
  vehicle_id: string;
  estimated_duration: number;
  actual_completion?: Date;
}
```

---

## **📊 PREDVIĐENE PREDNOSTI**

### **ZA KOMPANIJE:**
- **Cost Reduction**: Optimizovane rute = manji troškovi goriva
- **Efficiency Increase**: Automatizovano task management
- **Real-time Visibility**: Live tracking svih operacija
- **Scalability**: Modularni sistem raste sa kompanijom

### **ZA VOZAČE:**
- **Clear Instructions**: Optimizovane rute i prioriteti
- **Reduced Stress**: Automatizovano praćenje i reporting
- **Better Planning**: Real-time updates i rerouting
- **Professional Tools**: Enterprise-grade aplikacija

### **ZA ADMINISTRATORE:**
- **Centralized Control**: Sve operacije na jednom mjestu
- **Data-Driven Decisions**: Comprehensive analytics
- **Automation**: WMS integration i AI-powered optimization
- **Risk Reduction**: Real-time monitoring i compliance tracking

---

## **🎯 ROADMAP IMPLEMENTACIJE**

### **Q1 2026: FOUNDATION**
- [ ] User tier system implementation
- [ ] Permission matrix expansion
- [ ] Basic OBD-II integration prototype
- [ ] Task management database schema

### **Q2 2026: FIELD WORKER FEATURES**
- [ ] Dual sidebar UI implementation
- [ ] OBD-II real-time data collection
- [ ] Task queue system
- [ ] Proof of delivery (digital signature)

### **Q3 2026: WEB DASHBOARD**
- [ ] Web admin platform foundation
- [ ] WMS API connectors
- [ ] Route optimization algorithms
- [ ] Analytics dashboard

### **Q4 2026: ADVANCED FEATURES**
- [ ] AI-powered route optimization
- [ ] Predictive maintenance
- [ ] RFID cargo tracking integration
- [ ] Advanced reporting & ML insights

---

## **💡 DODATNE IDEJE ZA BUDUĆNOST**

### **RFID & IoT INTEGRATION**
- **Cargo Tracking**: RFID tagovi za real-time inventory
- **Geofencing**: Automated check-in/out na lokacijama
- **Temperature Monitoring**: Za osjetljivu robu
- **Security**: Anti-theft i tamper detection

### **AI & MACHINE LEARNING**
- **Predictive Routing**: ML-based traffic prediction
- **Driver Behavior Analysis**: Safety scoring
- **Demand Forecasting**: Optimal fleet sizing
- **Maintenance Prediction**: Preventivno održavanje

### **ADVANCED ANALYTICS**
- **Carbon Footprint Tracking**: ESG reporting
- **Cost Optimization**: Dynamic pricing suggestions
- **Performance Benchmarking**: Industry comparisons
- **Risk Assessment**: Route safety scoring

---

## **📋 IMPLEMENTACIJA CHECKLIST**

### **FAZA 1 CHECKLIST**
- [ ] Kreirati UserTier enum u types
- [ ] Implementirati FEATURE_MATRIX
- [ ] Ažurirati AuthContext za tier-based permissions
- [ ] Kreirati conditional rendering komponente
- [ ] Testirati basic user flow

### **FAZA 2 CHECKLIST**
- [ ] OBD-II library research i integracija
- [ ] Vehicle data models kreiranje
- [ ] Task management database schema
- [ ] Real-time data sync implementacija
- [ ] Offline-first architecture

### **FAZA 3 CHECKLIST**
- [ ] Dual sidebar navigation komponenta
- [ ] Dynamic menu generation po permisijama
- [ ] Tablet-optimized UI komponente
- [ ] Performance optimization
- [ ] Cross-platform testing

### **TEHNIČKI ZAHTJEVI**
- **Minimum React Native Version**: 0.72+
- **OBD-II Libraries**: react-native-obd2, obd2-wifi-adapter
- **Database Extensions**: PostGIS za geolocation, TimescaleDB za time-series
- **Web Dashboard**: Next.js 14+, TypeScript, TailwindCSS
- **API**: RESTful API sa GraphQL za kompleksne queries

### **RISK ASSESSMENT**
- **High Risk**: OBD-II hardware kompatibilnost
- **Medium Risk**: Real-time data sync kompleksnost
- **Low Risk**: Permission system proširenje
- **Low Risk**: UI/UX promjene

---

**Ovaj dokument će služiti kao temelj za evoluciju FleetFlow sistema. Modularni pristup omogućiće postepenu implementaciju bez narušavanja postojećih funkcionalnosti, dok će različiti nivoi korisnika osigurati da svaka grupa dobije optimalno korisničko iskustvo.**

**Status**: ✅ Dokumentovan i spreman za implementaciju
**Next Step**: Početak implementacije Faze 1 - User Tier System
