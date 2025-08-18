# Detaljan Plan Implementacije Putnog Naloga u Fleet-Flow-V2-Mobile

## 1. Uvod i Koncept "Putnog Naloga"

Ovaj dokument detaljno opisuje plan implementacije nove funkcionalnosti "Putni Nalog" u aplikaciji Fleet-Flow-V2-Mobile, integrišući najbolje prakse i specifične karakteristike iz aplikacije "Putni-nalog". Koncept "Putnog Naloga" predstavlja viši nivo agregacije putovanja, omogućavajući grupisanje više individualnih vožnji ("Trips") pod jednim nalogom, sa kompleksnom logikom obračuna troškova i poboljšanim GPS praćenjem.

### 1.1. Hijerarhija Koncepta

**PUTNI NALOG (Travel Order)**
- Glavni entitet koji objedinjuje više "Trips" (vožnji).
- Ima svoj status (npr. 'ACTIVE', 'COMPLETED', 'PENDING_APPROVAL').
- Sadrži agregirane podatke (ukupna distanca, ukupni trošak).
- Povezan je sa korisnikom i kompanijom.

**TRIP (Vožnja)**
- Predstavlja individualnu vožnju unutar jednog "Putnog Naloga".
- Sadrži detaljnu GPS putanju, početnu i krajnju lokaciju, vreme trajanja, pređenu distancu.
- Ima svoj individualni trošak (primarno trošak goriva).

### 1.2. Životni Ciklus Putnog Naloga

1.  **Otvaranje Putnog Naloga (`Open Travel Order`):**
    - Automatski se inicira pri pokretanju prve vožnje od strane korisnika, ako ne postoji aktivan "Putni Nalog".
    - Može postojati samo jedan aktivan "Putni Nalog" po korisniku u datom trenutku.
2.  **Otvaranje Vožnje (`Open Trip`):**
    - Pokreće se unutar aktivnog "Putnog Naloga".
    - Započinje GPS praćenje i snimanje putanje.
3.  **Zatvaranje Vožnje (`Close Trip`):**
    - Završava se trenutna individualna vožnja.
    - Kalkuliše se njen individualni trošak (samo gorivo).
    - Vožnja se čuva u bazi podataka i vezuje za aktivan "Putni Nalog".
4.  **Zatvaranje Putnog Naloga (`Close Travel Order`):**
    - Eksplicitno se završava aktivan "Putni Nalog" od strane korisnika.
    - Sve nedovršene vožnje unutar naloga se automatski završavaju.
    - Kalkuliše se ukupni trošak "Putnog Naloga" primenom kompleksnih poslovnih pravila.
    - Status "Putnog Naloga" se menja u 'COMPLETED'.
5.  **Automatsko zatvaranje:**
    - Sistem automatski zatvara aktivan "Putni Nalog" na kraju dana (npr. u ponoć) ako ga korisnik nije ručno zatvorio. Ova funkcionalnost će biti implementirana na backendu (Supabase funkcije/trigeri).

## 2. Izmene Šeme Baze Podataka

Implementacija zahteva značajne izmene u Supabase šemi baze podataka. Kreiraće se nova migracijska datoteka.

### 2.1. Tabela `travel_orders` (Nova)

```sql
CREATE TABLE IF NOT EXISTS public.travel_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(company_id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'pending_approval'
  purpose TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  total_distance_km DECIMAL(10,2) DEFAULT 0,
  base_cost DECIMAL(10,2) DEFAULT 0,            -- Zbir individualnih trip troškova
  calculated_total_cost DECIMAL(10,2) DEFAULT 0, -- Finalni trošak putnog naloga
  cost_calculation_rules_snapshot JSONB, -- Snapshot pravila korišćenih za obračun (za audit)
  cost_breakdown JSONB,                  -- Detaljan obračun troškova (za analitiku)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dodatne RLS politike za travel_orders će biti definisane.
```

### 2.2. Tabela `trips` (Modifikacija)

Postojećoj tabeli `public.trips` dodaju se sledeće kolone:

```sql
ALTER TABLE public.trips
ADD COLUMN travel_order_id UUID REFERENCES public.travel_orders(id) ON DELETE SET NULL, -- Veza sa Putnim Nalogom
ADD COLUMN path JSONB,                                -- Niz GPS koordinata [{latitude, longitude, timestamp}]
ADD COLUMN individual_cost DECIMAL(10,2),              -- Trošak pojedinačne vožnje (primarno gorivo)
ADD COLUMN pause_details JSONB,                        -- Detalji o detektovanim pauzama tokom vožnje
ADD COLUMN vehicle_type VARCHAR(50),                   -- Tip vozila (automobile, motor, trotinet, kamion, kombi)
ADD COLUMN fuel_cost_params_snapshot JSONB;            -- Snapshot parametara goriva korišćenih za kalkulaciju trip-a
```

### 2.3. Tabela `profiles` (Modifikacija)

Tabeli `public.profiles` dodaju se sledeće kolone za globalne parametre obračuna goriva:

```sql
ALTER TABLE public.profiles
ADD COLUMN average_consumption DECIMAL(10,2) DEFAULT 8.0, -- Default potrošnja goriva (L/100km)
ADD COLUMN fuel_price DECIMAL(10,2) DEFAULT 1.50;        -- Default cena goriva (€/L)
```

### 2.4. Tabela `vehicle_cost_rules` (Nova)

Ova tabela će čuvati dinamička pravila obračuna troškova po tipu vozila, ključna za web admin panel. Za mobilnu aplikaciju će biti korišćen snapshot ovih pravila, ili jednostavnija logika.

```sql
CREATE TABLE IF NOT EXISTS public.vehicle_cost_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(company_id) ON DELETE CASCADE,
  vehicle_type VARCHAR(50) NOT NULL,                    -- 'automobile', 'motor', 'trotinet', 'kamion', 'kombi'
  ownership_type VARCHAR(20) DEFAULT 'company',         -- 'company', 'private'
  department_id UUID REFERENCES public.departments(department_id), -- Za departmanska pravila
  has_fixed_limit BOOLEAN DEFAULT false,                -- Da li ima fiksni limit distance
  fixed_limit_km DECIMAL(8,2) DEFAULT 0,                -- Fiksni limit distance u km (npr. 23km)
  fixed_cost DECIMAL(8,2) DEFAULT 0,                    -- Fiksni trošak za kratke distance
  amortization_rate DECIMAL(5,4) DEFAULT 0.10,          -- Stopa amortizacije (npr. 0.10 za 10%)
  time_based_multipliers JSONB,                         -- Faktori na osnovu doba dana/radnih sati
  distance_brackets JSONB,                              -- Pravila za različite distance (npr. po zonama)
  priority INTEGER DEFAULT 100,                         -- Prioritet primene pravila
  active_from TIMESTAMPTZ DEFAULT NOW(),
  active_to TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dodatne RLS politike za vehicle_cost_rules će biti definisane.
```

### 2.5. Tabela `fuel_purchases` (Nova)

Replikacija tabele iz `Putni-nalog` za detaljno praćenje kupovina goriva.

```sql
CREATE TABLE IF NOT EXISTS public.fuel_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(vehicle_id) ON DELETE CASCADE,
  purchase_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fuel_station TEXT,                                    -- Lokacija pumpe (geocoded)
  fuel_type_id UUID NOT NULL REFERENCES public.fuel_types(fuel_type_id),
  quantity_liters DECIMAL(8,2) NOT NULL CHECK (quantity_liters > 0),
  price_per_liter DECIMAL(8,2) NOT NULL CHECK (price_per_liter > 0),
  total_cost DECIMAL(10,2) NOT NULL CHECK (total_cost > 0),
  receipt_number TEXT,
  receipt_photo TEXT,                                   -- URL do skladištenja računa
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dodatne RLS politike za fuel_purchases će biti definisane.
```

### 2.6. Tabela `fuel_usage` (Nova)

Replikacija tabele iz `Putni-nalog` za automatsko beleženje potrošnje goriva po vožnji.

```sql
CREATE TABLE IF NOT EXISTS public.fuel_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(trip_id) ON DELETE CASCADE,
  fuel_consumed_liters DECIMAL(8,2) NOT NULL CHECK (fuel_consumed_liters > 0),
  distance_km DECIMAL(8,2) NOT NULL CHECK (distance_km > 0),
  consumption_per_100km DECIMAL(8,2) GENERATED ALWAYS AS ((fuel_consumed_liters / distance_km) * 100) STORED,
  usage_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dodatne RLS politike za fuel_usage će biti definisane.
```

### 2.7. Pogled `fuel_balance` (Nova)

Replikacija pogleda iz `Putni-nalog` za agregirane statistike o gorivu.

```sql
CREATE OR REPLACE VIEW public.fuel_balance AS
SELECT 
  user_id,
  COALESCE(SUM(purchases.total_liters), 0) - COALESCE(SUM(usage.total_consumed), 0) AS current_balance_liters,
  COALESCE(SUM(purchases.total_cost), 0) AS total_spent,
  COALESCE(SUM(usage.total_consumed), 0) AS total_consumed_liters,
  COALESCE(AVG(usage.avg_consumption), 0) AS average_consumption_per_100km
FROM (
  SELECT DISTINCT user_id FROM public.fuel_purchases 
  UNION 
  SELECT DISTINCT user_id FROM public.fuel_usage
) users
LEFT JOIN (
  SELECT 
    user_id, 
    SUM(quantity_liters) AS total_liters,
    SUM(total_cost) AS total_cost
  FROM public.fuel_purchases 
  GROUP BY user_id
) purchases ON users.user_id = purchases.user_id
LEFT JOIN (
  SELECT 
    user_id, 
    SUM(fuel_consumed_liters) AS total_consumed,
    AVG(consumption_per_100km) AS avg_consumption
  FROM public.fuel_usage 
  GROUP BY user_id
) usage ON users.user_id = usage.user_id
GROUP BY user_id;

-- Dodatne RLS politike za fuel_balance će biti definisane.
```

### 2.8. Funkcija i Triger `calculate_trip_fuel_usage` (Nova)

Replikacija funkcije i trigera iz `Putni-nalog` za automatsko izračunavanje potrošnje goriva za završene vožnje.

```sql
CREATE OR REPLACE FUNCTION public.calculate_trip_fuel_usage()
RETURNS TRIGGER AS $$
DECLARE
  user_avg_consumption DECIMAL(8,2);
  fuel_consumed DECIMAL(8,2);
BEGIN
  -- Get user's average consumption from profiles table
  SELECT average_consumption INTO user_avg_consumption
  FROM public.profiles 
  WHERE user_id = NEW.user_id; -- Promenjeno ID u user_id za profiles tabelu
  
  -- Default to 8.0 l/100km if no setting found
  IF user_avg_consumption IS NULL THEN
    user_avg_consumption := 8.0; -- Default value for calculation
  END IF;
  
  -- Calculate fuel consumption: (distance * consumption) / 100
  fuel_consumed := (NEW.distance_km * user_avg_consumption) / 100.0;
  
  -- Only insert if we have valid distance and the trip is completed
  IF NEW.distance_km > 0 AND NEW.end_time IS NOT NULL THEN
    INSERT INTO public.fuel_usage (
      user_id,
      trip_id, 
      fuel_consumed_liters,
      distance_km,
      usage_date
    ) VALUES (
      NEW.user_id,
      NEW.trip_id,
      fuel_consumed,
      NEW.distance_km,
      NEW.end_time
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically calculate fuel usage for completed trips
DROP TRIGGER IF EXISTS trip_fuel_usage_trigger ON public.trips;
CREATE TRIGGER trip_fuel_usage_trigger
  AFTER INSERT OR UPDATE ON public.trips
  FOR EACH ROW
  WHEN (NEW.end_time IS NOT NULL AND NEW.distance_km IS NOT NULL AND NEW.distance_km > 0)
  EXECUTE FUNCTION public.calculate_trip_fuel_usage();
```

## 3. Logika Obračuna Troškova

Ovo je srž fleksibilnosti sistema. Implementiraće se kroz `CostCalculationEngine` sa različitim pristupima za mobilnu i web verziju.

### 3.1. Individualni Troškovi po Vožnji (Trip Cost)

-   **Definicija:** Predstavlja samo trošak goriva za pređenu distancu u datoj vožnji.
-   **Formula:** `(distance_km / 100) * average_consumption * fuel_price`
-   **Parametri:**
    -   `average_consumption`: Povlači se iz `profiles` tabele korisnika.
    -   `fuel_price`: Preferira se cena iz najnovije `fuel_purchases` za korisnika; ako ne postoji, koristi se `fuel_price` iz `profiles` tabele.
-   **Amortizacija:** **NE** primenjuje se na individualne troškove vožnje. Amortizacija je deo ukupnog obračuna "Putnog Naloga".
-   **Implementacija:** Ova logika će biti ugrađena u `TripService` (slično kao `calculateFuelCost` u Putni-nalog).

### 3.2. Ukupni Troškovi Putnog Naloga (Travel Order Total Cost)

Ovo je kompleksna kalkulacija koja se primenjuje kada se "Putni Nalog" zatvara. Biće definisana pravilima koja se čuvaju u `vehicle_cost_rules` tabeli.

#### Faktori koji utiču na ukupan trošak:
-   **Tip vlasništva vozila:** `company` (firmino) vs `private` (privatno)
-   **Kategorija vozila:** `automobile`, `motor`, `trotinet`, `kamion`, `kombi` (iz `vehicle_cost_rules`)
-   **Odjeljenje:** Može da ima specifična pravila (iz `vehicle_cost_rules` povezan sa `department_id`)
-   **Distanca:** Pragovi distance (npr. fiksni limit za kratke vožnje, zatim formula)
-   **Amortizacija:** Primjenjuje se na ukupni trošak Putnog Naloga.

#### Logika Obračuna (Pojednostavljeni pseudo-kod za mobilnu, kompleksnija logika za web):

```javascript
// U TripService ili novom TravelOrderService
async function calculateTravelOrderTotalCost(travelOrderId: UUID, userId: UUID): Promise<number> {
  // 1. Suma individualnih troškova trip-ova unutar Putnog Naloga
  const trips = await getTripsForTravelOrder(travelOrderId);
  let baseCost = trips.reduce((sum, trip) => sum + trip.individual_cost, 0);

  // 2. Preuzimanje relevantnih pravila iz vehicle_cost_rules
  // Za mobilnu verziju: Možda preuzimamo defaultna pravila ili koristimo jednostavnu cache verziju
  // Za web verziju: Kompleksno preuzimanje pravila na osnovu vehicle_type, ownership_type, department_id, datuma...
  const vehicleType = trips[0]?.vehicle_type || 'automobile'; // Pretpostavka da je isti tip vozila za sve tripove u nalogu
  const costRules = await getCostRulesForVehicleType(vehicleType, userId); // Trebaće da preuzme najrelevantnije pravilo

  // 3. Primena pravila (slično kao u Putni-nalog, ali prošireno)
  let finalCost = baseCost;

  if (costRules.has_fixed_limit && totalDistance <= costRules.fixed_limit_km) {
    finalCost = costRules.fixed_cost;
  } else if (costRules.has_fixed_limit && totalDistance > costRules.fixed_limit_km) {
    const remainingDistance = totalDistance - costRules.fixed_limit_km;
    const fuelCostForRemainingDistance = await calculateFuelCost(userId, remainingDistance);
    const amortizationCost = baseCost * costRules.amortization_rate; // Amortizacija na bazni trošak
    finalCost = costRules.fixed_cost + fuelCostForRemainingDistance + amortizationCost;
  } else {
    // Nema fiksnog limita (kamion, kombi)
    const amortizationCost = baseCost * costRules.amortization_rate;
    finalCost = baseCost + amortizationCost;
  }

  // Za web verziju: Dodatni faktori (vreme, odjeljenje, privatno/firmino, etc.)
  // Ovo će se rešavati na backendu (Supabase funkcije) ili u server-side logici za web.
  // Mobilna verzija će samo prikazati rezultat koji dobije sa servera, ili koristiti pojednostavljeni set pravila.

  return finalCost;
}
```

### 3.3. Implementacija troškova (Strategija)

-   **Mobilna Aplikacija (MVP):**
    -   Koristiće pojednostavljena `vehicle_cost_rules` (inicijalno hardkodovana u config fajlu ili preuzeta kao fiksni set).
    -   Kalkulacija individualnih trip troškova (gorivo) će biti kao u `Putni-nalog`.
    -   Kalkulacija ukupnog troška "Putnog Naloga" će se raditi na serveru kada se nalog zatvara, a mobilna aplikacija će prikazati rezultat. Ovo smanjuje kompleksnost mobilne aplikacije.
-   **Web Admin Panel:**
    -   Omogućiće **kreiranje, izmenu i brisanje kompleksnih `vehicle_cost_rules`**.
    -   Implementiraće `RuleBuilder` (uslovni konstruktor pravila) i `CostSimulator` (testiranje scenarija).
    -   Sva pravila će se čuvati u `vehicle_cost_rules` tabeli sa mogućnošću definisanja prioriteta, datuma aktivacije/deaktivacije i specifičnih uslova (npr. po odeljenju, tipu vlasništva).

## 4. Offline/Online Sinhronizacija

Pratiće se "offline-first" pristup iz `Putni-nalog` aplikacije.

-   **Lokalno skladištenje:** Podaci o putnim nalozima i vožnjama se prvo čuvaju lokalno (npr. AsyncStorage) kada korisnik nema internet konekciju.
-   **Pozadinska sinhronizacija:** Kada se konekcija uspostavi, aplikacija automatski pokušava da sinhronizuje lokalno sačuvane podatke sa Supabase bazom podataka (koristeći Expo Task Manager i NetworkUtils).
-   **Throttling:** Sinhronizacija će biti optimizovana da ne preoptereti mrežu ili server.
-   **Konflikti:** Treba definisati strategiju rešavanja konflikata ako se podaci menjaju i offline i online. Za MVP, pretpostavićemo da se promene dešavaju samo na jednoj strani (ili da je last-write-wins dovoljno dobar).

## 5. GPS Praćenje i Logika Pauza

Ova funkcionalnost će biti preuzeta direktno iz `Putni-nalog` implementacije, s obzirom na njenu robusnost.

-   **Kontinuirano praćenje:** Korišćenje `expo-location` i `expo-keep-awake` za precizno snimanje GPS putanje.
-   **`path` kolona u `trips` tabeli:** GPS koordinate će se čuvati kao `JSONB` niz u ovoj koloni.
-   **Automatska detekcija pauza:** Algoritam baziran na brzini i vremenu trajanja niske brzine/zaustavljanja će detektovati pauze. Detalji o pauzama će se čuvati u `pause_details` (JSONB) koloni u `trips` tabeli.
-   **Minimalna distanca:** Putovanja ispod određenog praga (npr. 200m) neće biti sačuvana da bi se filtrirao "GPS šum".

## 6. Integracija Mape

Implementiraće se hibridni pristup koji kombinuje prednosti obe aplikacije.

-   **Putni-nalog prednosti:**
    -   Fokus na efikasno renderovanje GPS putanje (`Polyline` komponenta).
    -   Verovatno je optimizovan za veliki broj tačaka.
-   **Fleet-Flow-V2-Mobile prednosti:**
    -   Bogata raznovrsnost prikazanih podataka (markeri za POI, vozila, itd.).
    -   Postojeći `WebMapView.tsx` sa Leaflet.js pruža fleksibilnost za prilagođene mape.

Strategija:
-   **GPS putanja:** Može se koristiti logika iz `Putni-nalog` za prikupljanje i formatiranje GPS putanje, a zatim prikazati u `WebMapView` (ili `react-native-maps` ako se odlučimo za potpunu migraciju).
-   **Podaci na mapi:** `Fleet-Flow` će zadržati svoju logiku za prikaz dodatnih markera i informacija preko mape.

## 7. Frontend Implementacija (Mobilna Aplikacija)

Fokus će biti na jednostavnosti i efikasnosti za krajnjeg korisnika.

-   **Ekran za putne naloge:** Pregled aktivnih i završenih "Putnih Naloga".
-   **Ekran za praćenje vožnje:** Glavni ekran za pokretanje/zaustavljanje vožnji, prikazivanje trenutne putanje na mapi, brzine, distance, i statusa pauze.
-   **UI za troškove:** Prikaz kalkulisanih troškova po vožnji i ukupnih troškova po "Putnom Nalogu".
-   **Offline indikatori:** Vizuelna signalizacija kada aplikacija radi offline i kada se sinhronizuje.

### Komponente:
```
- components/Trip/TripTrackingModule.tsx (novi modul za GPS i Putni Nalog logiku)
- screens/main/TravelOrdersScreen.tsx (novi ekran za pregled Putnih Naloga)
- components/Map/EnhancedMapView.tsx (modifikovan WebMapView za GPS putanje)
```

## 8. Backend / Admin Panel Implementacija (Web Aplikacija)

Ovo će biti složeniji deo, sa fokusom na fleksibilnost i analitiku.

-   **Centralizovan sistem za pravila troškova:**
    -   **Rule Hierarchy:** Omogućiće definisanje hijerarhijskih pravila (kompanijska, departmanska, po tipu vozila, po vlasništvu).
    -   **Rule Builder:** Intuitivan UI za kreiranje i modifikaciju pravila sa uslovima i formulama (npr. "Ako je vozilo 'Kamion' i vožnja 'privatna' i distanca > 100km, primeni X% amortizacije").
    -   **Cost Simulator:** Alat za testiranje različitih scenarija obračuna troškova.
-   **Napredna analitika i izveštaji:**
    -   Detaljan pregled obračuna troškova za svaki "Putni Nalog".
    -   Izveštaji o potrošnji goriva, prosečnoj potrošnji, poređenje sa standardima.
    -   Grafički prikazi putanja, pauza, brzine.

## 9. Faze Implementacije i Prioriteti

### FAZA 1: Mobilni MVP (Procenjeno: 4 nedelje)
-   **Nedelja 1: Baza podataka - Osnove Putnog Naloga**
    -   Kreiranje `travel_orders` tabele.
    -   Modifikacija `trips` tabele (`travel_order_id`, `path`, `individual_cost`, `pause_details`, `vehicle_type`, `fuel_cost_params_snapshot`).
    -   Modifikacija `profiles` tabele (`average_consumption`, `fuel_price`).
    -   Početna definicija `vehicle_cost_rules` (može biti inicijalno fiksna/hardkodovana u kodu za mobilnu).
    -   Kreiranje `fuel_purchases` i `fuel_usage` tabela.
    -   Implementacija `calculate_trip_fuel_usage` funkcije i trigera.
    -   Implementacija `fuel_balance` view-a.
    -   Primena svih SQL migracija.
-   **Nedelja 2: Osnovna Trip i Travel Order logika na mobilnoj**
    -   Implementacija `startTrip`, `endTrip` (`useTripTracking` hook adaptacija).
    -   Kreiranje/dobijanje aktivnog `TravelOrder`-a pri startovanju trip-a.
    -   `individual_cost` kalkulacija (samo gorivo) po trip-u.
    -   UI za pokretanje/zaustavljanje trip-a.
-   **Nedelja 3: GPS praćenje i Mapa**
    -   Integracija detaljnog GPS praćenja i skladištenja putanje.
    -   Implementacija logike detekcije pauza.
    -   Prikaz GPS putanje na mapi (`EnhancedMapView`).
    -   UI za prikaz statusa praćenja i pauza.
-   **Nedelja 4: Sinhronizacija i Finalizacija Mobilnog MVP-a**
    -   Implementacija offline/online sinhronizacije (OfflineStorage, NetworkUtils).
    -   Implementacija `endTravelOrder` funkcije (total cost kalkulacija na serveru).
    -   Osnovni prikaz Travel Order-a na mobilnoj.
    -   Testiranje stabilnosti, performansi i ispravnosti podataka.

### FAZA 2: Web Admin i Napredne Funkcionalnosti (Procenjeno: 6 nedelja)
-   **Nedelja 5-6: Kompleksna Pravila Troškova - Backend**
    -   Implementacija API end-pointa za `vehicle_cost_rules` (CRUD operacije).
    -   Implementacija `CostCalculationEngine` na backendu koji koristi `vehicle_cost_rules` za izračunavanje `total_calculated_cost` za `travel_orders`.
    -   Logika za izbor i primenu hijerarhijskih pravila.
    -   Audit trail za kalkulacije (`cost_calculations` tabela).
-   **Nedelja 7-8: Web Admin Panel - Pravila Troškova**
    -   Razvoj UI za `AdminCostManagement` (kreiranje/editovanje `vehicle_cost_rules`).
    -   Implementacija `RuleBuilder`-a (jednostavna verzija za početak).
    -   Prikaz aktivnih i neaktivnih pravila.
-   **Nedelja 9-10: Analitika i Izveštaji + Optimizacija**
    -   Implementacija detaljnih izveštaja za putne naloge i troškove (Web).
    -   Grafički prikazi i statistike.
    -   `CostSimulator` (osnovna verzija).
    -   Optimizacija performansi za velike skupove podataka.
    -   Migracija postojećih tripova i re-kalkulacija troškova.

## 10. Ključne Donesene Odluke

-   **Dva nivoa aplikacije:** Mobilna (jednostavnost), Web (kompleksnost i administracija).
-   **Admin panel za pravila:** Admin korisnici će kreirati i upravljati pravilima obračuna troškova isključivo putem web interfejsa.
-   **Prioritet performansi:** Brzina izvršavanja na mobilnoj aplikaciji je visoki prioritet.
-   **Migracija podataka:** Postojeći `trips` podaci će biti preračunati po novoj logici i arhivirani (ili ažurirani) po potrebi.
-   **"Putni Nalog" kao zasebna tabela (`travel_orders`):** Potvrđeno da je to zaseban DB entitet, a ne samo logička agregacija.
-   **Logika troškova:** Implementacija kompleksne logike obračuna troškova bazirane na faktorima kao što su tip vozila, vlasništvo, odeljenje, itd.
-   **Offline-first:** Robusna offline funkcionalnost sa automatskom sinhronizacijom kada je veza dostupna.
-   **Mapa:** Hibridni pristup koji uzima najbolje karakteristike iz obe aplikacije (precizno praćenje putanje iz "Putnog Naloga" i bogati prikaz podataka iz "Fleet-Flow").
