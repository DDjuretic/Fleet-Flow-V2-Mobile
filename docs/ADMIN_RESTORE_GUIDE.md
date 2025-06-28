# Admin Privileges Restore Guide

## Problem
Aplikacija ponekad gubi admin privilegije zbog:
- Resetovanja baze podataka
- Konflikata sa sesijama
- Duplikatnih korisnika u auth.users tabeli

## Brzo Rešenje

### 1. Pokreni Restore Skript
```bash
./restore_admin_privileges.sh
```

### 2. Odjaviš se iz Aplikacije
- Idite u **Settings → Logout**

### 3. Prijaviš se Ponovo
- **Email:** `djuretic.danko@gmail.com`
- **Password:** `password123`

## Ručno Rešenje (ako skript ne radi)

### 1. Reset Database
```bash
npx supabase db reset
```

### 2. Kreiraj Auth User
```bash
curl -X POST "http://127.0.0.1:54321/auth/v1/signup" \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_ANON_KEY" \
  -d '{"email": "djuretic.danko@gmail.com", "password": "password123"}'
```

### 3. Proveri Admin Status
```bash
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -c "SELECT check_my_admin();"
```

Treba da vrati: `ADMIN POSTOJI ✅`

## Fajlovi Uključeni u Rešenje

- `supabase/migrations/006_simple_admin_fix.sql` - Jednostavna migracija za admin setup
- `restore_admin_privileges.sh` - Automatski restore skript
- `docs/ADMIN_RESTORE_GUIDE.md` - Ova dokumentacija

## Važne Napomene

1. **Uvek se odjavite i prijavite ponovo** nakon restore-a
2. **Ne brišite migraciju 006** - ona automatski kreira admin korisnika
3. **User ID se može promeniti** nakon kreiranja novog korisnika
4. **Aplikacija keša sesije** - zato je potrebno logout/login

## Debugging

Ako i dalje nema admin privilegija:

```bash
# Proveri auth.users
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -c "SELECT id, email FROM auth.users WHERE email = 'djuretic.danko@gmail.com';"

# Proveri public.users
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -c "SELECT user_id, email FROM users WHERE email = 'djuretic.danko@gmail.com';"

# Proveri admin ulogu
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -c "SELECT check_my_admin();"
```

## Sinhronizacija sa Windows

Ovaj setup je spreman za sinhronizaciju:

```bash
git add .
git commit -m "feat: permanent admin privileges restore system"
git push origin main
```

Na Windows računaru:
```bash
git pull origin main
./restore_admin_privileges.sh
``` 