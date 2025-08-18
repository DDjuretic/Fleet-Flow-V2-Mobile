**Fleet Flow Next Gen: Revidirana Lista Funkcionalnosti sa Fazama Implementacije**

**Inicijalni Set Funkcionalnosti (Core Features)**
*(Ove funkcionalnosti predstavljaju osnovu aplikacije. Razvoj će pratiti faze definisane u [docs/planning/PUTNI_NALOG_IMPLEMENTATION_PLAN.md](./PUTNI_NALOG_IMPLEMENTATION_PLAN.md) i [docs/planning/PROJECT_BLUEPRINT.md](./PROJECT_BLUEPRINT.md).)*
*(Mobilna aplikacija će biti razvijana koristeći React Native/Expo, a Web aplikacija koristeći Next.js/React u kasnijim fazama.)*

**I. Osnovne Korisničke Funkcionalnosti (Mobilna & Web)**
    *   **1. Autentifikacija i Korisnički Profil:**
        *   Prijava, Registracija, Oporavak lozinke.
        *   Upravljanje korisničkim profilom (lični podaci, kontakt, avatar, pregled licenci/sertifikata).
        *   Onboarding proces za nove korisnike.
        *   *(Core)*
    *   **2. Vožnje (Trips):**
        *   **Evidencija Putnih Naloga:** Pokretanje, pauziranje, završavanje putnog naloga; unos svrhe, destinacije, tipa vožnje. Podrška za više vožnji unutar jednog putnog naloga.
        *   GPS Praćenje: Snimanje rute, brzine, zaustavljanja.
        *   **Detaljno praćenje putanje (path) za vizualizaciju na mapi.**
        *   **Poboljšana offline funkcionalnost i sinhronizacija (korišćenjem pristupa iz Putni-nalog aplikacije).**
        *   Pregled istorije putnih naloga sa detaljima i mapom.
        *   Izbor vozila (uz proveru dozvola).
        *   **Logika pauza:** Detekcija i beleženje pauza tokom vožnje/putnog naloga.
        *   *(Core)*
    *   **3. Troškovi (Expenses):**
        *   **Integrisan modul troškova goriva sa logikom iz Putni-nalog aplikacije (uključujući cijenu goriva, prosječnu potrošnju, itd.) i prilagođen Fleet Flow-u.**
        *   Unos troškova: gorivo/energija, putarine, parking, održavanje (osnovno), taksi, javni prevoz, ostalo.
        *   **Automatsko popunjavanje lokacije pumpe putem geolokacije.**
        *   Kategorizacija troškova.
        *   Dodavanje slike računa/priznanice.
        *   Povezivanje troška sa vožnjom/vozilom.
        *   Pregled istorije troškova i statusa odobrenja.
        *   *(Core)*
    *   **4. Rezervacije Vozila (Reservations):**
        *   Pregled dostupnosti vozila (uz proveru dozvola).
        *   Podnošenje zahteva za rezervaciju.
        *   Pregled statusa sopstvenih rezervacija.
        *   Notifikacije o statusu rezervacije.
        *   *(Core)*
    *   **5. Podsetnici (Reminders):**
        *   Kreiranje ličnih podsetnika.
        *   Pregled automatski generisanih podsetnika (servis, registracija, istek licence).
        *   Notifikacije.
        *   *(Core)*
    *   **6. Interna Komunikacija (Messaging):**
        *   Direktne Poruke.
        *   Grupni Chat-ovi.
        *   Sistemska Obaveštenja Vozačima.
        *   Deljenje lokacije/detalja vožnje.
        *   *(Core)*
    *   **7. Gamifikacija i Sistem Podsticaja ("FleetEco Rewards") (Korisnički Pregled na Mobilnoj):**
        *   Pregled poena i ranga.
        *   Prikaz izazova i pravila.
        *   **Green Initiative Program:** Sistem zelenih poena za zaposlene koji postižu najbolje ekološke rezultate kroz smanjene troškove putovanja, korišćenje alternativnih prevoznih sredstava, ili pešačenje.
        *   **Eco-Friendly Challenges:** Nagradne igre i izazovi zasnovani na zelenim aktivnostima sa sistemom rangiranja i nagrada.
        *   Notifikacije.
        *   *(Core)*
    *   **8. Interaktivne Mape (Mobilna):**
        *   **Full-Screen Map View:** Mapa na home screen-u koja se otvara na skoro celom ekranu do tab bara.
        *   **Custom Location Tags:** Kreiranje i upravljanje prilagođenim oznakama za često posjećivane lokacije, slično AirBNB sistemu.
        *   **Quick Location Access:** Brzi pristup označenim lokacijama direktno sa home screen mape.
        *   **Map Integration:** Integracija sa GPS praćenjem, rutama i POI sistemom.
        *   *(Core)*
    *   **9. Podešavanja Aplikacije (Mobilna):**
        *   Jezik, tema, jedinice mere, valuta.
        *   Upravljanje notifikacijama.
        *   *(Core)*
    *   **10. Informacije o Putu i Vremenu (Mobilna & Web):**
        *   Prikaz aktuelnih vremenskih uslova za relevantne lokacije (npr. trenutna, destinacija).
        *   Prikaz informacija o stanju na putevima (radovi, zastoji, opasnosti) za planirane ili aktivne rute.
        *   Notifikacije o bitnim promenama (putem `SystemNotifications`).
        *   *(Baza Core, Razvoj kasnija faza)*

**II. Napredne Funkcionalnosti i Administracija (Primarno Web)**
    *   **11. Upravljanje Vozilima i Pristupom Vozilima:**
        *   Detaljna evidencija voznog parka (uključujući prosečnu potrošnju).
        *   Kategorizacija/Tipizacija Vozila, označavanje privatnih vozila, definisanje zahtevanih licenci.
        *   Status vozila, istorija održavanja (osnovna).
        *   Dodeljivanje podrazumevanog vozila.
        *   Unos dokumenata (osiguranje, registracija).
        *   Definisanje Pravila Pristupa Vozilima (korisnik, odeljenje, licenca).
        *   Politike Korišćenja Alternativnog Prevoza.
        *   *(Core)*
    *   **12. Upravljanje Korisnicima i Dozvolama:**
        *   CRUD korisničkih naloga, dodeljivanje odeljenjima.
        *   Evidencija Korisničkih Licenci i Kvalifikacija.
        *   RBAC sistem (uloge, grupe, dozvole).
        *   Audit trail.
        *   *(Core)*
    *   **13. Upravljanje Troškovima, Gorivom/Energijom i Cenama:**
        *   Centralizovani pregled troškova.
        *   Sistem Odobravanja Troškova (Workflow sa konfigurabilnim pravilima, automatskim i manuelnim odobravanjem).
        *   Modul za Gorivo/Energiju (evidencija punjenja, praćenje "virtuelnog rezervoara/baterije" sa obračunom po rutama/formulama/fiksnim vrednostima/GPS-u, ručne korekcije stanja).
        *   Automatizacija Cena Goriva/Energije (integracija sa API-jima).
        *   Ručni unos i istorijat cena.
        *   Obračun Amortizacije.
        *   Definisanje kategorija troškova.
        *   *(Core)*
    *   **14. Upravljanje Rezervacijama (Web Admin):**
        *   Centralizovani pregled, odobravanje/odbijanje/izmena.
        *   Planiranje i pregled zauzetosti.
        *   *(Core)*
    *   **15. Upravljanje Rutama, Lokacijama i Ograničenjima na Putu:**
        *   Definisanje standardnih ruta (sa predefinisanom kilometražom, troškom/formulom).
        *   Definisanje fiksnih vrednosti za tipove vožnji (npr. gradske).
        *   Čuvanje i upravljanje POI.
        *   **Custom tagovi za često posjećivane lokacije na mapama - omogućava korisnicima da kreiraju i imenuju često posjećivane lokacije, slično AirBNB sistemu za apartmane.**
        *   **Definisanje i upravljanje ograničenjima i uslovima na putevima (npr. sezonske zabrane za kamione, radovi na putu, zatvaranja deonica, ograničenja po tipu vozila, vremenskom periodu).**
        *   *(Core)*
    *   **16. Dubinska Analitika i Generisanje Izveštaja:**
        *   **A. Analitički Pregledi:** Vožnje, Troškovi, Vozni Park (sa svim detaljima koje smo naveli).
        *   **B. Formalni i Operativni Izveštaji:** Putni Nalozi (standardni PDF + eksport za mail merge), Nedeljni/Mesečni Izveštaji, Iskorišćenost Vozila, Potrošnja Goriva/Energije, Troškovi Održavanja (osnovni), Istek Resursa, Aktivnosti Rezervacija, "FleetEco Rewards", Neregularnosti u Vožnji, CO2 Emisije (osnovna procena). **Uključiti poboljšane izveštaje za vožnje i gorivo iz Putni-nalog aplikacije.**
        *   **C. Opšte Funkcionalnosti Izveštavanja:** Filtriranje, sortiranje, eksport, zakazivanje (osnovno), arhiviranje.
        *   *(Core - Mogućnost prilagođavanja templejta putnih naloga može biti unapređenje u kasnijoj fazi)*
    *   **17. Administracija Gamifikacije ("FleetEco Rewards"):**
        *   Definisanje pravila, kreiranje izazova, pregled statistike, dodeljivanje nagrada.
        *   **Green Initiative Management:** Upravljanje sistemom zelenih poena, definisanje kriterijuma za ekološke aktivnosti, kreiranje nagradnih igara za alternative transport methods.
        *   **Eco-Performance Tracking:** Praćenje i rangiranje zaposlenih na osnovu zelenih aktivnosti (smanjeni troškovi, alternativni prevoz, pešačenje).
        *   *(Core)*
    *   **18. Sistemska Podešavanja:**
        *   Globalne postavke, definisanje kategorija/tipova (npr. `expense_type`, `fuel_type`, `vehicle_type`, `department`, `license_type`, `trip_type_for_fixed_cost`).
        *   Podešavanje integracija (API ključevi za cene goriva, **vremenske servise, informacije o stanju na putevima**).
        *   Audit log.
        *   *(Core)*

**III. Tehničke Funkcionalnosti (Pozadinske)**
    *   **19. API za Mobilnu i Web Aplikaciju.** *(Core - Obezbeđeno kroz Supabase)*
    *   **20. Baza Podataka (dizajn i implementacija).** *(Core - Inicijalno postavljeno)*
    *   **21. Notifikacioni Sistem.** *(Core)*
    *   **22. Sinhronizacija Podataka (za offline rad).** *(Core - Osnovna podrška, unapređenje po potrebi)*
    *   **23. Bezbednost (uključujući hash lozinki).** *(Core - Obezbeđeno kroz Supabase)*
    *   **24. Monitoring i Logovanje (osnovno).** *(Core)*
    *   **25. System Logs & Monitoring (PLANIRANO ZA BUDUĆE FAZE):**
        *   Comprehensive System Logs: Tabela sa kompletnim schema (log_id, severity, type, metadata)
        *   Expense Monitoring: Automatska detekcija HIGH_EXPENSE (gorivo >€200, obroci >€100)
        *   Suspicious Pattern Detection: Multiple same-day expenses, unusual patterns
        *   Vehicle Performance Tracking: Fuel efficiency, maintenance alerts
        *   Security Monitoring: Unauthorized access attempts, login anomalies
        *   Real-time Notifications: Automatske notifikacije za HIGH/CRITICAL alerts
        *   Admin Panel Integration: SystemLogsAndMonitoringScreen sa filtering i resolution
        *   API Endpoints: Complete CRUD, stats, resolution workflow
        *   *(Ova funkcionalnost će biti razvijena u kasnijim fazama nakon stabilizacije osnovnih modula)*

---

**Kasnije Faze Razvoja (Funkcionalnosti iznad Core Seta)**
*(Baza podataka dizajnirana za Core set će imati osnovne tabele/polja za podršku nekim od ovih modula. Potpuna implementacija funkcionalnosti sledi nakon implementacije Core seta i biće usklađena sa [docs/planning/PUTNI_NALOG_IMPLEMENTATION_PLAN.md](./PUTNI_NALOG_IMPLEMENTATION_PLAN.md).)*

*   **IV. Dodatne Napredne Funkcionalnosti**
    *   **25. Geofencing i Automatizacija Zasnovana na Lokaciji:**
        *   Definisanje Geografskih Zona.
        *   Automatske Akcije i Notifikacije (Potvrda Dolaska/Odlaska, upozorenja).
        *   *(Baza Core, Razvoj Kasnija Faza)*
    *   **26. Napredno Upravljanje Održavanjem Vozila (bez upravljanja zalihama i direktne integracije sa servisima za sada):**
        *   Planiranje Preventivnog Održavanja.
        *   Evidencija Istorije Servisa (detaljnija od osnovne).
        *   Digitalne Inspekcijske Liste Vozila.
        *   *(Baza Core, Razvoj Kasnija Faza)*
    *   **27. Bezbednost Vozača i Usklađenost sa Propisima (Driver Safety & Compliance):**
        *   Analiza Stila Vožnje (Driver Scoring).
        *   Evidencija i Izveštavanje o Incidentima/Nesrećama.
        *   Praćenje Radnog Vremena Vozača (unapređeno).
        *   *(Baza Core, Razvoj Kasnija Faza)*
    *   **28. Praćenje Vremena Vožnje i Usklađenost sa Propisima (Driving Time & Compliance Monitoring):**
        *   Praćenje aktivnog vremena vožnje, pauza i odmora vozača.
        *   Alarmiranje i notifikacije o prekoračenju zakonskih okvira (npr. EU regulative za radno vreme vozača).
        *   Konfigurabilna pravila po regionima/zemljama.
        *   Izveštaji o usklađenosti.
        *   *(Baza Core, Razvoj Kasnija Faza - Zahteva detaljnu analizu propisa)*
    *   **29. Praćenje Ostalih Pokretnih Sredstava (Asset Tracking):**
        *   *(Baza Core, Razvoj Kasnija Faza)*
    *   **30. Napredno Upravljanje Gorivnim Karticama (bez direktne API integracije za sada):**
        *   Evidencija, limiti, poluautomatski uvoz.
        *   *(Baza Core, Razvoj Kasnija Faza)*
    *   **31. Prilagodljivi Tokovi Rada (Custom Workflows - Osnovna Podrška):**
        *   Proširenje na druge procese osim troškova.
        *   *(Baza Core (fleksibilnost), Razvoj Kasnija Faza)*
    *   **32. Upravljanje Gumama (Tire Management):**
        *   *(Baza Core, Razvoj Kasnija Faza)*

---

**Faza 2 i Kasnije: Buduća Proširenja / Modularni Dodaci**
*(Ove funkcionalnosti se trenutno ne uključuju detaljno u dizajn baze za Core set, osim što će se baza dizajnirati da bude generalno proširiva. Implementacija ovih modula zahtevaće dodatno planiranje i potencijalno proširenje baze. Biće usklađena sa [docs/planning/PUTNI_NALOG_IMPLEMENTATION_PLAN.md](./PUTNI_NALOG_IMPLEMENTATION_PLAN.md).)*

*   Napredno Upravljanje Zalihama Rezervnih Delova (iz tačke 25).
*   Potpuna Integracija sa Servisnim Radionicama (iz tačke 25).
*   **Logistika, Dostava i Terenski Rad (Ceo Modul).**
*   **Integracije sa Drugim Poslovnim Sistemima (Potpune Automatizacije).**
*   **Multi-Tenancy Arhitektura (ako se ide na SaaS model).**
*   **Napredno prilagođavanje templejta putnih naloga (upload i definisanje templejta).**

---
*(Kraj dokumenta)* 