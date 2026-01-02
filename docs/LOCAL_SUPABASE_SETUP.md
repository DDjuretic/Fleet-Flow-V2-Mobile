# 🐳 LOKALNI SUPABASE SETUP - Besplatni Development

**Datum kreiranja:** Januar 2026
**Verzija:** 1.0.0
**Status:** Ready for Implementation

---

## 🎯 **SVRHA**

Ovaj dokument opisuje **besplatni lokalni Supabase setup** koristeći Docker. Umesto plaćanja za cloud Supabase projekat tokom development-a, koristićemo lokalnu instancu koja je:

- ✅ **Potpuno besplatna**
- ✅ **5-10x brža** od cloud-a
- ✅ **Offline-first** za development
- ✅ **Laka migracija** na cloud kasnije

---

## 📋 **PREDUSLOVI**

### **Sistemski Zahtjevi:**
- ✅ **Docker** (verzija 20.10+)
- ✅ **Node.js** (v22.21.1 - već imaš)
- ✅ **Supabase CLI** (već instaliran)

### **Prostor na Disku:**
- **Minimum:** 2GB slobodnog prostora
- **Recommended:** 5GB za backup-ove i podatke

### **Hardware:**
- **RAM:** Minimum 4GB, recommended 8GB+
- **CPU:** Modern processor sa virtualization support

---

## 🚀 **KORAK PO KORAK SETUP**

### **KORAK 1: Priprema (5 minuta)**

```bash
# 1. Idi u Fleet-Flow-V2-Mobile folder
cd /Users/dankodjuretic/Documents/Project/React-Native/Fleet-Flow-V2-Mobile

# 2. Proveri da je Supabase CLI instaliran
npx supabase --version

# 3. Proveri da je Docker pokrenut
docker --version
docker ps
```

### **KORAK 2: Download Backup-a (10 minuta)**

```bash
# 1. Login u Supabase (ako nisi već)
npx supabase login

# 2. Link sa pauziranim projektom (Fleet-Flow-Next-Gen)
# Trebam project-ref od tebe - pogledaj u Supabase dashboard-u
npx supabase link --project-ref YOUR_PROJECT_REF_HERE

# 3. List-uj dostupne backup-ove
npx supabase backups list

# 4. Download najnovijeg backup-a
npx supabase db dump --data-only > fleet_flow_backup.sql

# ALTERNATIVA: Ako backup ne radi, download iz dashboard-a
# Idi na: https://supabase.com/dashboard/project/YOUR_PROJECT_REF/settings/database
# Klikni "Download backup" i sačuvaj fajl
```

### **KORAK 3: Lokalni Supabase Setup (15 minuta)**

```bash
# 1. Pokreni lokalni Supabase (prvi put traje duže)
npx supabase start

# 2. Sačekaj da se svi kontejneri pokrenu (5-10 minuta)
# Trebam vidjeti poruku: "Started supabase local development setup."

# 3. Proveri status
npx supabase status

# Trebam vidjeti:
# API URL: http://127.0.0.1:54321
# DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

### **KORAK 4: Restore Backup-a (10 minuta)**

```bash
# 1. Restore backup u lokalnu bazu
npx supabase db reset --linked

# 2. Ako imaš .sql fajl, importuj ga
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres < fleet_flow_backup.sql

# 3. Generiši TypeScript tipove za lokalnu bazu
npx supabase gen types typescript --local > src/types/supabase-local.ts
```

### **KORAK 5: Environment Setup (5 minuta)**

```bash
# Kreiraj .env.local fajl sa lokalnim Supabase podacima
cat > .env.local << EOF
# Lokalni Supabase za development
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# Tvoji API ključevi
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key_here

# Development flag
EXPO_PUBLIC_ENVIRONMENT=development
EOF
```

### **KORAK 6: Test Setup-a (5 minuta)**

```bash
# 1. Pokreni Expo aplikaciju
npm start

# 2. Test lokalne baze
curl http://127.0.0.1:54321/rest/v1/companies

# 3. Trebam vidjeti JSON response sa podacima
```

---

## 🔧 **MANAGEMENT KOMANDE**

### **Svakodnevni Rad:**

```bash
# Pokreni lokalni Supabase
npx supabase start

# Zaustavi lokalni Supabase
npx supabase stop

# Restart (ako ima problema)
npx supabase stop && npx supabase start

# Proveri status
npx supabase status

# View logs
npx supabase logs
```

### **Database Management:**

```bash
# Reset baze na početno stanje
npx supabase db reset

# Push lokalne migracije na lokalnu bazu
npx supabase db push

# Pull remote migracije
npx supabase db pull

# Kreiraj novu migraciju
npx supabase migration new "add_feature_xyz"
```

---

## 📊 **PERFORMANCE & MONITORING**

### **Resource Usage:**
```bash
# Proveri Docker resource usage
docker stats

# Lokalni Supabase zauzima ~1-2GB RAM
# CPU usage: minimal kada se ne koristi
```

### **Speed Comparison:**
- **Local Supabase:** 50-100ms response time
- **Cloud Supabase:** 200-500ms response time
- **Improvement:** 2-5x brže za development

### **Storage:**
```bash
# Proveri veličinu lokalne baze
du -sh supabase/

# Backup veličina: obično 100MB-500MB
```

---

## 🔄 **MIGRACIJA NA CLOUD**

### **Kada budeš spreman za cloud:**

```bash
# 1. Kreiraj novi cloud projekat
npx supabase projects create "Fleet-Flow-V2-Production"

# 2. Link sa cloud projektom
npx supabase link --project-ref YOUR_NEW_PROJECT_REF

# 3. Push lokalne migracije na cloud
npx supabase db push

# 4. Ažuriraj .env fajlove
# .env.production sa cloud URL-ovima
```

### **Environment Switching:**

```bash
# Za lokalni development
cp .env.local .env

# Za production testing
cp .env.production .env
```

---

## 🚨 **TROUBLESHOOTING**

### **Problem: Portovi zauzeti**
```bash
# Proveri koji procesi koriste portove
lsof -i :54321
lsof -i :54322

# Zaustavi konfliktnu aplikaciju ili promeni portove u config.toml
```

### **Problem: Docker ne radi**
```bash
# Restart Docker daemon
# Na macOS: System Settings > General > Login Items
# Na Windows: Docker Desktop > Restart
```

### **Problem: Backup restore fail**
```bash
# Proveri backup fajl
head -20 fleet_flow_backup.sql

# Reset lokalne baze prvo
npx supabase db reset

# Zatim restore
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres < fleet_flow_backup.sql
```

### **Problem: Expo ne vidi lokalni Supabase**
```bash
# Proveri .env fajl
cat .env

# Restart Expo
# Ctrl+C u terminalu, zatim npm start
```

---

## 📋 **CHECKLIST ZA SETUP**

### **Pre Setup-a:**
- [ ] Docker instaliran i pokrenut
- [ ] Supabase CLI instaliran
- [ ] Dovoljno disk prostora (5GB+)
- [ ] Backup fajl spreman

### **Tokom Setup-a:**
- [ ] Supabase login uspešan
- [ ] Link sa projektom radi
- [ ] Backup download uspešan
- [ ] Lokalni Supabase startuje
- [ ] Restore backup-a radi
- [ ] Environment variables podešeni

### **Post Setup-a:**
- [ ] Expo aplikacija startuje
- [ ] Database konekcija radi
- [ ] API pozivi uspešni
- [ ] GPS testovi rade

---

## 💡 **BEST PRACTICES**

### **Development Workflow:**
1. **Lokalno razvijaj** - brže i besplatno
2. **Testiraj na cloud-u** - samo za finalne testove
3. **Backup regularno** - čuvaj lokalne podatke
4. **Version control** - migracije u Git-u

### **Resource Management:**
- **Zaustavi Supabase** kada ne koristiš (`npx supabase stop`)
- **Restart Docker** periodično za čišćenje
- **Monitor disk space** - briši stare backup-ove

### **Security:**
- **Nikad ne commit-uj** `.env.local` fajl
- **Lokalna baza** je samo za development
- **Production podaci** idu samo na cloud

---

## 🎯 **SLEDEĆI KORACI NAKON SETUP-A**

Jednom kada lokalni Supabase radi:

1. ✅ **GPS Implementation** - počni sa location services
2. ✅ **Trip Lifecycle** - start/stop/pause funkcionalnost
3. ✅ **Fuel Calculation** - cost engine
4. ✅ **Travel Orders** - business logic

**Procjena vremena:** 2-3 nedelje do MVP sa GPS tracking-om

---

**🚀 Ready za lokalni Supabase setup! Šta kažeš - počnimo?** 🔥
