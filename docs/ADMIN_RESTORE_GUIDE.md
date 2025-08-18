# Admin Privileges Restore Guide

Ovaj dokument je zastareo. Za sve probleme vezane za admin privilegije, autentifikaciju i upravljanje korisnicima, molimo vas da pogledate detaljan vodič:

[Auth Management Guide](./AUTH_MANAGEMENT_GUIDE.md)

**Ključne stvari koje treba proveriti ako su izgubljene admin privilegije:**

1.  **Supabase Auth podaci:** Većina problema sa admin privilegijama proizlazi iz neispravnih podataka u `auth.users` tabeli (npr. `NULL` vrednosti umesto praznih stringova) ili nedostajućih zapisa u `auth.identities` tabeli. Pogledajte sekciju "**DEFINITIVNO REŠENJE**" i "**Pravilno upravljanje auth korisnicima**" u `AUTH_MANAGEMENT_GUIDE.md`.
2.  **`handle_new_user()` triger:** Uverite se da `handle_new_user()` triger radi ispravno i da je prvi registrovani korisnik dobio "admin" ulogu u `public.users` i `public.user_roles` tabelama. Pogledajte sekciju "**Sinhronizacija sa public.users**" u `AUTH_MANAGEMENT_GUIDE.md`.
3.  **Keširanje sesija:** Uvek se odjavite i ponovo prijavite nakon bilo kakvih ručnih izmena u bazi podataka kako bi se osvežile sesije.

Za detaljne SQL komande, rešenja problema i najbolje prakse, **uvek koristite `AUTH_MANAGEMENT_GUIDE.md`**. 