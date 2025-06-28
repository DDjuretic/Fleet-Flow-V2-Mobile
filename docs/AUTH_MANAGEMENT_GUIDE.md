# Auth Management Guide - Fleet Flow Next Gen

## ⚠️ KRITIČNO UPOZORENJE

**NIKAD NE BRIŠITE auth.users ZAPISE U PRODUKCIJI!**

## 🎯 DEFINITIVNO REŠENJE (22.01.2025)

### Root Cause: "Database error querying schema"

**Problem:** Supabase Auth očekuje da string polja u `auth.users` tabeli budu **prazan string (`''`)** umesto **NULL**.

**Simptomi:**
- Login credentials su tačni
- Password je enkriptovan ispravno  
- Supabase connection test prolazi
- Ali login vraća: `AuthApiError 500: "Database error querying schema"`

**Rešenje:**
```sql
-- KRITIČNA POPRAVKA - Zameni NULL sa praznim stringom
UPDATE auth.users 
SET 
    confirmation_token = COALESCE(confirmation_token, ''),
    recovery_token = COALESCE(recovery_token, ''),
    email_change_token_new = COALESCE(email_change_token_new, ''),
    email_change_token_current = COALESCE(email_change_token_current, ''),
    email_change = COALESCE(email_change, ''),
    phone = COALESCE(phone, ''),
    phone_change = COALESCE(phone_change, ''),
    phone_change_token = COALESCE(phone_change_token, ''),
    reauthentication_token = COALESCE(reauthentication_token, ''),
    aud = COALESCE(aud, 'authenticated'),
    role = COALESCE(role, 'authenticated')
WHERE id IS NOT NULL;
```

**Automatski restore:**
```bash
./restore_admin_privileges.sh
```

## Problem koji se desio (21.06.2025)

Migracija `20250619154000_simple_admin_creation.sql` je obrisala postojeće auth korisnike:

```sql
-- ❌ POGREŠNO - Briše postojeće korisnike
DELETE FROM auth.users WHERE email = 'djuretic.danko@gmail.com';
```

## Pravilno upravljanje auth korisnicima

### 1. Kreiranje novog korisnika

```sql
-- ✅ ISPRAVNO - Kreiraj auth korisnika sa svim potrebnim poljima
INSERT INTO auth.users (
    id, 
    instance_id, 
    email, 
    encrypted_password, 
    email_confirmed_at, 
    created_at, 
    updated_at, 
    raw_app_meta_data, 
    raw_user_meta_data, 
    is_super_admin, 
    role, 
    aud,
    -- ⚠️ KRITIČNO - Sva string polja moraju biti '' umesto NULL
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change_token_current,
    email_change,
    phone,
    phone_change,
    phone_change_token,
    reauthentication_token
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'email@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Name","last_name":"Surname"}',
    false,
    'authenticated',
    'authenticated',
    '',  -- confirmation_token
    '',  -- recovery_token
    '',  -- email_change_token_new
    '',  -- email_change_token_current
    '',  -- email_change
    '',  -- phone
    '',  -- phone_change
    '',  -- phone_change_token
    ''   -- reauthentication_token
);
```

### 2. Kreiranje identity zapisa

```sql
-- ✅ OBAVEZNO - Kreiraj identity za email provider
INSERT INTO auth.identities (
    id, 
    user_id, 
    provider_id, 
    provider, 
    identity_data, 
    last_sign_in_at, 
    created_at, 
    updated_at
) VALUES (
    gen_random_uuid(),
    user_uuid,
    user_uuid,
    'email',
    jsonb_build_object(
        'sub', user_uuid,
        'email', 'email@example.com',
        'email_verified', true,
        'phone_verified', false
    ),
    NOW(),
    NOW(),
    NOW()
);
```

### 3. Sinhronizacija sa public.users

```sql
-- ✅ AUTOMATSKI - handle_new_user() trigger
-- Automatski kreira public.users zapis kada se kreira auth.users
-- Prvi korisnik automatski dobija admin ulogu
```

## Preventivne mere

### 1. Uvek koristi prazan string umesto NULL

```sql
-- ❌ POGREŠNO
confirmation_token = NULL

-- ✅ ISPRAVNO
confirmation_token = ''
```

### 2. Koristi ON CONFLICT klauzule

```sql
-- ✅ ISPRAVNO - Sprečava duplikate
INSERT INTO auth.users (...) VALUES (...)
ON CONFLICT (id) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    confirmation_token = '',
    recovery_token = '',
    ...
```

### 3. Testiraj sa clean database

```bash
npx supabase db reset
./restore_admin_privileges.sh
# Test login
```

## Debugging auth problema

### 1. Proveri auth korisnika

```sql
SELECT 
    id,
    email,
    encrypted_password IS NOT NULL as has_password,
    email_confirmed_at IS NOT NULL as email_confirmed,
    confirmation_token IS NULL as conf_token_null,
    recovery_token IS NULL as rec_token_null,
    aud,
    role
FROM auth.users 
WHERE email = 'djuretic.danko@gmail.com';
```

### 2. Proveri identity

```sql
SELECT 
    provider,
    user_id,
    identity_data->>'email' as email,
    created_at
FROM auth.identities 
WHERE user_id = 'user-uuid-here';
```

### 3. Proveri public.users i role

```sql
SELECT 
    u.email,
    u.first_name,
    u.last_name,
    r.role_name
FROM users u
JOIN user_roles ur ON u.user_id = ur.user_id
JOIN roles r ON ur.role_id = r.role_id
WHERE u.email = 'djuretic.danko@gmail.com';
```

## Emergency restore

```bash
# Brza popravka
./restore_admin_privileges.sh

# Ili ručno
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -c "
UPDATE auth.users 
SET confirmation_token = '', recovery_token = '', 
    email_change_token_new = '', email_change_token_current = '',
    email_change = '', phone = '', phone_change = '',
    phone_change_token = '', reauthentication_token = ''
WHERE email = 'djuretic.danko@gmail.com';
"
```

## Migracija na production

Kada prebacujemo na cloud Supabase:

1. **Eksportuj podatke** iz lokalne baze
2. **Kreiraj jednu čistu migraciju** sa svim tabelama
3. **Koristi Auth API** umesto direktnih INSERT-a u auth.users
4. **Testiraj signup/login flow** pre produkcije

## Najbolje prakse

✅ **DO:**
- Koristi Auth API za kreiranje korisnika
- Postavi sva string polja na prazan string
- Testiraj sa clean database
- Koristi ON CONFLICT klauzule
- Prvi korisnik = admin logika

🚫 **DON'T:**
- Ne postavljaj string polja na NULL
- Ne briši auth.users zapise u produkciji
- Ne kreiraj auth korisnike direktno SQL-om u produkciji
- Ne zaboravi identity zapise
- Ne testiraj samo sa postojećim podacima

## Česte greške koje treba izbegavati

### ❌ NIKAD ne radite ovo:
```sql
DELETE FROM auth.users WHERE email = '...';  -- Briše auth podatke
INSERT INTO public.users ONLY;               -- Kreira samo public zapis
```

### ❌ NULL vrednosti u string poljima:
```sql
-- GoTrue ne može da parsira NULL kao string
confirmation_token = NULL  -- GREŠKA!
```

### ❌ Nedostaje identity zapis:
```sql
-- Auth korisnik bez identity zapisa neće moći da se uloguje
-- Mora postojati zapis u auth.identities tabeli
```

## Testiranje auth funkcionalnosti

```bash
# Test login preko curl
curl -X POST "http://localhost:54321/auth/v1/token?grant_type=password" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@email.com","password":"password123"}'
```

## Backup strategija

```sql
-- Pre bilo kakvih auth promena, napravi backup
CREATE TABLE auth_users_backup AS SELECT * FROM auth.users;
CREATE TABLE auth_identities_backup AS SELECT * FROM auth.identities;
```

## Rollback strategija

```sql
-- Ako nešto pođe po zlu, vrati iz backup-a
INSERT INTO auth.users SELECT * FROM auth_users_backup WHERE email = 'problem@email.com';
INSERT INTO auth.identities SELECT * FROM auth_identities_backup WHERE provider_id = 'problem@email.com';
```

## Monitoring

```sql
-- Proveri da li korisnik može da se uloguje
SELECT 
    u.email,
    u.email_confirmed_at,
    i.provider,
    i.created_at as identity_created
FROM auth.users u
LEFT JOIN auth.identities i ON u.id = i.user_id
WHERE u.email = 'test@email.com';
```

## Zaključak

**Glavna pravila:**
1. Nikad ne brišite auth.users zapise u produkciji
2. Uvek kreirajte i auth.users i auth.identities zapise
3. Sva string polja u auth.users moraju biti '' umesto NULL
4. Testirajte login nakon svake auth promene
5. Napravite backup pre auth promena

**Ova dokumentacija je kreirana nakon incidenta 21.06.2025 da se ovakvi problemi ne ponove.** 