# ☁️ Cloud Supabase Setup Guide

**Kompletno uputstvo za konfiguraciju shared cloud Supabase instance za tim development**

## 🎯 **Pregled**

Ovaj vodič će te provesti kroz kreiranje i konfiguraciju cloud Supabase instance za tim kolaboraciju, sa staging i production environment-ima.

## 🚀 **Brzi Setup (10 minuta)**

### **1. Kreiraj Supabase Organizaciju**
```bash
# Idite na https://supabase.com/dashboard
# Kliknite "New organization"
# Organization name: Fleet-Flow-Team
# Plan: Pro (preporučeno za tim development)
```

### **2. Kreiraj Projekte**
```bash
# Development/Staging Project
Project name: fleet-flow-staging
Database password: [generiši jak password]
Region: Central EU (Frankfurt) - najbliži našoj lokaciji

# Production Project  
Project name: fleet-flow-production
Database password: [generiši jak password]
Region: Central EU (Frankfurt)
```

### **3. Konfiguriši Team Access**
```bash
# Organization Settings > Members
# Dodaj team članove sa odgovarajućim rolama:

Team Lead: Owner
Senior Developers: Developer
Junior Developers: Developer
QA: Developer (read-only na production)
DevOps: Owner
```

## 🔧 **Detaljno Konfiguracija**

### **Project Settings**

#### **1. General Settings**
```bash
# Project Settings > General

Staging Project:
- Name: Fleet Flow Staging
- Reference ID: [auto-generated]
- Organization: Fleet-Flow-Team
- Region: Central EU (Frankfurt)
- Pause after 1 week of inactivity: Disabled

Production Project:
- Name: Fleet Flow Production
- Reference ID: [auto-generated] 
- Organization: Fleet-Flow-Team
- Region: Central EU (Frankfurt)
- Pause after 1 week of inactivity: Disabled
```

#### **2. Database Settings**
```bash
# Settings > Database

Connection string: postgresql://[user]:[password]@[host]:5432/postgres
Connection pooling: Enabled
Pool size: 15 (staging), 25 (production)
Statement timeout: 8000ms
Idle timeout: 600s
```

#### **3. API Settings**
```bash
# Settings > API

Auto-generated API URL: https://[project-ref].supabase.co
anon key: [auto-generated - safe for client-side]
service_role key: [auto-generated - server-side only]

CORS origins:
- http://localhost:3000 (development)
- http://localhost:8081 (Expo development)
- https://your-staging-domain.com (staging)
- https://your-production-domain.com (production)
```

### **Authentication Setup**

#### **1. Auth Providers**
```bash
# Authentication > Providers

Email: Enabled
- Confirm email: Enabled
- Secure email change: Enabled

Google OAuth: Enabled
- Client ID: [your-google-client-id]
- Client Secret: [your-google-client-secret]

Apple OAuth: Enabled (za mobile)
- Services ID: [your-apple-services-id]
- Team ID: [your-apple-team-id]
- Key ID: [your-apple-key-id]
- Private Key: [your-apple-private-key]
```

#### **2. Email Templates**
```bash
# Authentication > Email Templates

Confirm signup:
Subject: Dobrodošli u Fleet Flow - Potvrdite vaš email
Body: Customizovana poruka sa branding-om

Reset password:
Subject: Fleet Flow - Resetovanje lozinke
Body: Customizovana poruka sa branding-om

Change email:
Subject: Fleet Flow - Potvrda promene email adrese
Body: Customizovana poruka sa branding-om
```

#### **3. URL Configuration**
```bash
# Authentication > URL Configuration

Site URL: https://your-production-domain.com
Redirect URLs:
- http://localhost:3000/** (development)
- http://localhost:8081/** (Expo development)
- https://your-staging-domain.com/**
- https://your-production-domain.com/**
- exp://localhost:8081/** (Expo deep linking)
```

### **Database Migration**

#### **1. Link Local sa Cloud**
```bash
# U root direktorijumu projekta
npx supabase login

# Link sa staging projektom
npx supabase link --project-ref [staging-project-ref]

# Generiši TypeScript tipove
npx supabase gen types typescript --linked > apps/mobile/src/types/supabase-staging.ts
npx supabase gen types typescript --linked > apps/web/src/types/supabase-staging.ts
```

#### **2. Push Migracije**
```bash
# Push sve migracije na staging
npx supabase db push

# Verifikuj da su migracije primenjene
npx supabase migration list

# Kreiraj snapshot za production
npx supabase db dump --data-only > staging-data-backup.sql
```

#### **3. Production Setup**
```bash
# Link sa production projektom
npx supabase link --project-ref [production-project-ref]

# Push migracije na production
npx supabase db push

# Generiši production tipove
npx supabase gen types typescript --linked > apps/mobile/src/types/supabase-production.ts
npx supabase gen types typescript --linked > apps/web/src/types/supabase-production.ts
```

### **Row Level Security (RLS)**

#### **1. Enable RLS na svim tabelama**
```sql
-- Omogući RLS na svim tabelama
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE permission_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
```

#### **2. Kreiraj RLS Policies**
```sql
-- Korisnici mogu videti samo svoju kompaniju
CREATE POLICY "Users can only see their company data" ON companies
    FOR ALL USING (id = (SELECT company_id FROM users WHERE auth.uid() = id));

-- Korisnici mogu videti samo sebe i kolege iz iste kompanije  
CREATE POLICY "Users can see company colleagues" ON users
    FOR ALL USING (company_id = (SELECT company_id FROM users WHERE auth.uid() = id));

-- Vozila - samo iz iste kompanije
CREATE POLICY "Company vehicles only" ON vehicles
    FOR ALL USING (company_id = (SELECT company_id FROM users WHERE auth.uid() = id));

-- Putovanja - samo iz iste kompanije
CREATE POLICY "Company trips only" ON trips
    FOR ALL USING (company_id = (SELECT company_id FROM users WHERE auth.uid() = id));

-- Rezervacije - samo iz iste kompanije
CREATE POLICY "Company reservations only" ON reservations
    FOR ALL USING (company_id = (SELECT company_id FROM users WHERE auth.uid() = id));

-- Troškovi - samo iz iste kompanije
CREATE POLICY "Company expenses only" ON expenses
    FOR ALL USING (company_id = (SELECT company_id FROM users WHERE auth.uid() = id));
```

### **Environment Variables**

#### **1. Staging Environment**
```bash
# apps/mobile/.env.staging
EXPO_PUBLIC_SUPABASE_URL=https://[staging-project-ref].supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=[staging-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[staging-service-role-key]
EXPO_PUBLIC_ENVIRONMENT=staging

# apps/web/.env.staging
NEXT_PUBLIC_SUPABASE_URL=https://[staging-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[staging-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[staging-service-role-key]
NEXT_PUBLIC_ENVIRONMENT=staging
```

#### **2. Production Environment**
```bash
# apps/mobile/.env.production
EXPO_PUBLIC_SUPABASE_URL=https://[production-project-ref].supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=[production-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[production-service-role-key]
EXPO_PUBLIC_ENVIRONMENT=production

# apps/web/.env.production
NEXT_PUBLIC_SUPABASE_URL=https://[production-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[production-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[production-service-role-key]
NEXT_PUBLIC_ENVIRONMENT=production
```

### **Team Development Workflow**

#### **1. Development Process**
```bash
# 1. Lokalni development (svaki developer)
npx supabase start  # lokalna instanca za development

# 2. Feature testing (staging)
# Push feature branch
git push origin feature/new-feature

# Deploy na staging za testing
# Staging automatski koristi staging Supabase

# 3. Production deployment
# Merge u main branch
# Production deployment koristi production Supabase
```

#### **2. Database Sync Script**
Kreiraj `sync_cloud_database.sh`:

```bash
#!/bin/bash

echo "🌐 Cloud Supabase Sync Script"
echo "=============================="

# Funkcija za sync sa staging
sync_staging() {
    echo "🔄 Syncing with staging environment..."
    
    # Link sa staging projektom
    npx supabase link --project-ref $STAGING_PROJECT_REF
    
    # Pull latest migracije
    npx supabase migration list
    
    # Generiši tipove
    npx supabase gen types typescript --linked > apps/mobile/src/types/supabase-staging.ts
    npx supabase gen types typescript --linked > apps/web/src/types/supabase-staging.ts
    
    echo "✅ Staging sync complete"
}

# Funkcija za sync sa production
sync_production() {
    echo "🚀 Syncing with production environment..."
    
    # Link sa production projektom
    npx supabase link --project-ref $PRODUCTION_PROJECT_REF
    
    # Pull latest migracije
    npx supabase migration list
    
    # Generiši tipove
    npx supabase gen types typescript --linked > apps/mobile/src/types/supabase-production.ts
    npx supabase gen types typescript --linked > apps/web/src/types/supabase-production.ts
    
    echo "✅ Production sync complete"
}

# Main logic
case "$1" in
    staging)
        sync_staging
        ;;
    production)
        sync_production
        ;;
    both)
        sync_staging
        sync_production
        ;;
    *)
        echo "Usage: $0 {staging|production|both}"
        echo "Example: ./sync_cloud_database.sh staging"
        exit 1
        ;;
esac

echo "🎉 Cloud database sync completed!"
```

### **Monitoring & Maintenance**

#### **1. Database Monitoring**
```bash
# Supabase Dashboard > Project > Database

Monitoring features:
- Query performance
- Connection pool usage
- Storage usage
- API requests per minute
- Active connections
- Slow queries
```

#### **2. API Monitoring**
```bash
# Supabase Dashboard > Project > API

Monitoring features:
- API requests per minute
- Response times
- Error rates
- Authentication events
- Real-time connections
```

#### **3. Backup Strategy**
```bash
# Automatski backup script
#!/bin/bash

# Daily backup
npx supabase db dump --data-only > backups/daily-backup-$(date +%Y%m%d).sql

# Weekly full backup
npx supabase db dump > backups/weekly-full-backup-$(date +%Y%m%d).sql

# Upload to cloud storage (optional)
# aws s3 cp backups/ s3://your-backup-bucket/ --recursive
```

### **Security Best Practices**

#### **1. API Keys Management**
```bash
# NIKAD ne commit-uj production ključeve
# Koristi environment variables
# Rotacija ključeva svakih 90 dana
# Monitoring pristupa API ključevima
```

#### **2. Database Security**
```bash
# RLS policies na svim tabelama
# Least privilege pristup
# Regular security audit
# SSL/TLS za sve konekcije
```

#### **3. Network Security**
```bash
# IP restrictions za production
# CORS konfiguracija
# Rate limiting
# DDoS protection
```

### **Cost Optimization**

#### **1. Plan Selection**
```bash
Staging: Pro plan ($25/mesec)
- Unlimited API requests
- 8GB database
- 100GB bandwidth
- 7 day backup retention

Production: Pro plan ili Team ($25-99/mesec)
- Zavisno od usage-a
- Dodatne backup opcije
- Priority support
```

#### **2. Usage Monitoring**
```bash
# Redovno proveravaj:
- Database storage usage
- API request count
- Bandwidth usage
- Real-time connections
```

## 🤝 **Team Coordination**

### **1. Access Management**
```bash
Team Lead:
- Full access na oba projekta
- Billing management
- Team member management

Senior Developers:
- Full access na staging
- Read access na production
- Migration management

Junior Developers:
- Full access na staging
- No production access initially

QA Team:
- Read access na staging
- Read access na production
- Test data management
```

### **2. Communication Protocol**
```bash
# Database changes:
1. Najavi u team chat
2. Kreiraj migration lokalno
3. Test na staging
4. Code review
5. Deploy na production

# Schema changes:
1. RFC (Request for Comments)
2. Team review
3. Backward compatibility check
4. Rollback plan
5. Phased deployment
```

## 📋 **Setup Checklist**

### **Cloud Setup**
- [ ] Supabase organizacija kreirana
- [ ] Staging projekat kreiran
- [ ] Production projekat kreiran
- [ ] Team članovi dodani sa proper rolama
- [ ] Database konfiguracija završena

### **Security Setup**
- [ ] RLS policies implementirane
- [ ] Authentication konfigurisan
- [ ] API CORS konfigurisan
- [ ] Environment variables konfigurisane
- [ ] Backup strategija implementirana

### **Development Setup**
- [ ] Local-to-cloud linking testiran
- [ ] Migration sync testiran
- [ ] Type generation working
- [ ] Team sync script kreiran
- [ ] Documentation ažurirana

### **Monitoring Setup**
- [ ] Dashboard monitoring setup
- [ ] Alert notifications konfigurisane
- [ ] Backup schedule kreiran
- [ ] Cost monitoring setup
- [ ] Security monitoring enabled

---

## 🎉 **Cloud Supabase je spreman za tim kolaboraciju!**

**Sledeći koraci:**
1. Podeli credentials sa team-om (bezbedno)
2. Test team sync workflow
3. Kreiraj first shared feature
4. Monitor usage i performance
5. Optimize na osnovu team feedback 