# Fleet Flow Next Gen - Multi-Tenant SaaS Architecture

## 💳 LICENSING & SUBSCRIPTION SYSTEM

### 📋 SUBSCRIPTION PLANS

#### 1. **STARTER PLAN** - €29/mesec
- ✅ Do 5 korisnika
- ✅ Do 10 vozila
- ✅ Osnovni tracking
- ✅ Osnovni izvještaji
- ✅ Email podrška
- ❌ Napredni analytics
- ❌ API pristup
- ❌ Custom izvještaji

#### 2. **BUSINESS PLAN** - €99/mesec  
- ✅ Do 25 korisnika
- ✅ Do 50 vozila
- ✅ Napredni tracking
- ✅ Svi izvještaji
- ✅ Prioritetna podrška
- ✅ Osnovni API pristup
- ✅ Geofencing
- ❌ White-label opcije

#### 3. **ENTERPRISE PLAN** - €299/mesec
- ✅ Neograničeno korisnika
- ✅ Neograničeno vozila  
- ✅ Sve funkcionalnosti
- ✅ Pun API pristup
- ✅ White-label opcije
- ✅ Custom integracije
- ✅ Dedicirani account manager

#### 4. **PAY-PER-USER ADD-ON**
- 💰 €5/mesec po dodatnom korisniku
- 💰 €3/mesec po dodatnom vozilu
- 🕐 7-dnevni grace period za testiranje

### 🏢 MULTI-TENANT DATABASE ARCHITECTURE

#### **Opcija 1: Shared Database + Row Level Security (RLS)** ⭐ **PREPORUČENO ZA TRENUTNU FAZU**
*Ovaj pristup koristi jednu bazu podataka za sve kompanije, oslanjajući se na `company_id` kolonu u tabelama i Supabase RLS politike za izolaciju podataka. Ovo je inicijalno rešenje za naš projekat.* 
```sql
-- Svaka tabela ima company_id kolonu
CREATE TABLE companies (
  company_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  subscription_plan VARCHAR(50) NOT NULL,
  subscription_status VARCHAR(20) DEFAULT 'active',
  max_users INTEGER NOT NULL,
  max_vehicles INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  subscription_expires_at TIMESTAMP,
  grace_period_until TIMESTAMP
);

-- RLS policy za sve tabele (primer)
CREATE POLICY company_isolation ON users 
  FOR ALL TO authenticated 
  USING (company_id = get_current_company_id()); -- get_current_company_id() je placeholder za funkciju/logiku koja vraća ID kompanije trenutnog korisnika
```

#### **Opcija 2: Separate Database per Company (ZA BUDUĆE SKALIRANJE)**
*Ovaj pristup podrazumeva kreiranje odvojene baze podataka za svaku kompaniju, što pruža maksimalnu izolaciju i performanse, ali značajno povećava kompleksnost infrastrukture i operativnog upravljanja. Ovo je opcija za razmatranje u daljoj budućnosti.* 
```typescript
interface DatabaseConfig {
  [companyId: string]: {
    host: string;
    database: string;
    schema: string;
    connectionString: string;
  };
}

// Dynamic database connection (konceptualni primer)
const getCompanyDatabase = (companyId: string) => {
  // Logika za dinamičko uspostavljanje konekcije sa bazom podataka specifične kompanije
  return createClient(DATABASE_CONFIGS[companyId].connectionString);
};
```

### 🔒 FEATURE LICENSING SYSTEM

```typescript
interface CompanyLicense {
  company_id: string;
  plan: 'starter' | 'business' | 'enterprise';
  features: {
    // Analytics & Reporting
    advanced_analytics: boolean;
    custom_reports: boolean;
    export_data: boolean;
    
    // Fleet Management
    real_time_tracking: boolean;
    geofencing: boolean;
    maintenance_alerts: boolean;
    fuel_management: boolean;
    
    // User Management
    role_management: boolean;
    department_hierarchy: boolean;
    permission_matrix: boolean;
    
    // Integration & API
    api_access: boolean;
    webhook_support: boolean;
    third_party_integrations: boolean;
    
    // Branding & Customization
    white_label: boolean;
    custom_branding: boolean;
    custom_domains: boolean;
  };
  limits: {
    max_users: number;
    max_vehicles: number;
    max_api_calls_per_month: number;
    max_storage_gb: number;
  };
  billing: {
    amount: number;
    currency: 'EUR';
    billing_cycle: 'monthly' | 'yearly';
    next_billing_date: Date;
    payment_method_id: string;
  };
}
```

### 💰 BILLING & PAYMENT SYSTEM

#### **Web Portal za Billing** - `apps/web/src/app/billing/` (Planirano za buduću web aplikaciju u monorepo strukturi)

```typescript
// Billing Dashboard komponente
interface BillingComponents {
  // 1. Subscription Overview
  SubscriptionOverview: {
    currentPlan: string;
    nextBillingDate: Date;
    monthlyAmount: number;
    usageStats: {
      users: { current: number; limit: number };
      vehicles: { current: number; limit: number };
    };
  };
  
  // 2. Plan Comparison
  PlanComparison: {
    plans: SubscriptionPlan[];
    currentPlan: string;
    toUpgradeOptions: PlanUpgrade[];
  };
  
  // 3. Usage Monitoring
  UsageMonitoring: {
    realTimeUsage: UsageMetrics;
    projectedOverage: number;
    alerts: UsageAlert[];
  };
  
  // 4. Payment Management
  PaymentManagement: {
    paymentMethods: PaymentMethod[];
    invoiceHistory: Invoice[];
    addPaymentMethod: () => void;
  };
}
```

#### **Stripe Integration**
```typescript
// Stripe webhook handlers
const handleStripeWebhooks = {
  'customer.subscription.updated': async (subscription) => {
    await updateCompanySubscription(subscription);
  },
  
  'customer.subscription.deleted': async (subscription) => {
    await suspendCompanyAccess(subscription.metadata.company_id);
  },
  
  'invoice.payment_failed': async (invoice) => {
    await handleFailedPayment(invoice);
  },
  
  'invoice.payment_succeeded': async (invoice) => {
    await confirmPayment(invoice);
  }
};
```

### ⏰ GRACE PERIODS & TRIAL SYSTEM

#### **Grace Period Logic**
```typescript
interface GracePeriodConfig {
  // New user trial
  trial_period_days: 14;
  
  // Payment failure grace
  payment_failure_grace_days: 7;
  
  // Plan downgrade grace  
  downgrade_grace_days: 30;
  
  // Feature access during grace
  grace_period_features: {
    read_only_access: boolean;
    export_restrictions: boolean;
    api_rate_limits: number;
  };
}

const checkCompanyAccess = async (companyId: string) => {
  const company = await getCompany(companyId);
  
  if (company.subscription_status === 'trial') {
    return company.trial_expires_at > new Date();
  }
  
  if (company.subscription_status === 'grace_period') {
    return company.grace_period_until > new Date();
  }
  
  return company.subscription_status === 'active';
};
```

### 🚀 IMPLEMENTATION ROADMAP
*Napomena: Ovaj roadmap predstavlja faze implementacije sistema licenciranja i pretplata, koje su planirane za budućnost, nakon stabilizacije osnovnih funkcionalnosti aplikacije.*

#### **Phase 1: Database Architecture**
1. ❌ Kreirati company_id kolone u svim tabelama
2. ❌ Implementirati RLS policies
3. ❌ Migration script za postojeće podatke
4. ❌ Testing multi-tenant pristupa

#### **Phase 2: Subscription Management**
1. ❌ Kreirati subscription tabele
2. ❌ Implementirati plan limits
3. ❌ Feature toggle sistem
4. ❌ Usage tracking

#### **Phase 3: Billing Portal**
1. ❌ Web billing dashboard
2. ❌ Stripe integration
3. ❌ Payment method management
4. ❌ Invoice generation

#### **Phase 4: Grace Periods & Trials**
1. ❌ Trial signup flow
2. ❌ Grace period logic
3. ❌ Access restrictions
4. ❌ Automated notifications

#### **Phase 5: Advanced Features**
1. ❌ Usage analytics dashboard
2. ❌ Automated plan upgrades
3. ❌ White-label options
4. ❌ API rate limiting

### 💡 KEY DECISIONS MADE

1. **✅ Shared Database + RLS** - Bolja izolacija i performanse za inicijalnu fazu. (Odluka promenjena u odnosu na originalni plan za 'Separate Database')
2. **✅ Stripe za Payment Processing** - Pouzdano i globalno prihvaćeno
3. **✅ 7-dnevni Grace Period** - Balans između korisnosti i rizika
4. **✅ Web Portal za Billing** - Bolje UX za administratore
5. **✅ Feature Flags** - Fleksibilno upravljanje funkcionalnostima

### 🔧 TECHNICAL IMPLEMENTATION

```typescript
// Company Context Hook
export const useCompanyLicense = () => {
  const { user } = useAuth();
  const [license, setLicense] = useState<CompanyLicense | null>(null);
  
  const hasFeature = (feature: keyof CompanyLicense['features']) => {
    return license?.features[feature] || false;
  };
  
  const checkLimit = (resource: 'users' | 'vehicles', current: number) => {
    const limit = license?.limits[`max_${resource}`] || 0;
    return {
      allowed: current < limit,
      remaining: Math.max(0, limit - current),
      percentage: (current / limit) * 100
    };
  };
  
  return { license, hasFeature, checkLimit };
};

// Usage in components
const VehicleManagement = () => {
  const { hasFeature, checkLimit } = useCompanyLicense();
  const vehicleCount = useSelector(state => state.vehicles.count);
  
  const vehicleLimit = checkLimit('vehicles', vehicleCount);
  
  if (!hasFeature('real_time_tracking')) {
    return <UpgradePrompt feature="Real-time Tracking" />;
  }
  
  if (!vehicleLimit.allowed) {
    return <LimitReachedNotice resource="vehicles" />;
  }
  
  return <VehicleList />;
};
```

Ova arhitektura omogućava:
- 🏢 **Potpunu izolaciju podataka** između kompanija
- 💰 **Fleksibilno naplaćivanje** sa grace periodima
- 🚀 **Skalabilnost** za hiljade kompanija
- 🔒 **Sigurnost** sa proper access control
- 📊 **Monitoring** korišćenja i performansi

Da li želiš da počnemo sa implementacijom nekog od ovih delova? 