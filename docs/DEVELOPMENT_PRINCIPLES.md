# 🛠 THE FLEETFLOW MANIFESTO & DEVELOPMENT GUIDE

## 1. Filozofija Razvoja
- **Think Different**: Svaki feature mora biti jednostavan za korisnika, a moćan u pozadini.
- **Craftsmanship**: Kod se piše za ljude, ne za mašine. Imena varijabli moraju da "pjevaju".
- **Elegance is Simplicity**: Ako je funkcija preduga, podijeli je. Ako je logika kompleksna, dokumentuj je.

## 2. Jezik i Standardi
- **Kod**: Isključivo Engleski jezik (Variable names, Functions, Classes).
- **Komentari**: Isključivo Engleski jezik (JSDoc format).
- **Dokumentacija**: Srpski latinica (za biznis planove i roadmap).
- **Stil**: TypeScript (Strict mode). Nema `any` tipova.

## 3. Metodologija "Mikro-koraka" (The Da Vinci Steps)
1. **Plan**: Prije pisanja koda, definiši interfejs i tipove.
2. **Implement**: Piši kod u malim, logičnim cjelinama (max 50-100 linija po promjeni).
3. **Verify**: Svaki korak mora proći linter i type-check.
4. **Refactor**: Čim nešto proradi, pogledaj može li se napisati jednostavnije.

## 4. Testiranje i Debugging (Zero-Tolerance Policy)
- **Unit Tests**: Svaki servis (Sync, Auth, Role) mora imati Jest testove.
- **E2E Tests**: Maestro testovi za kritične flow-ove (Login, Start Trip, Task Completion).
- **Debugger**: Koristiti Reactotron ili Expo Dev Tools. Nikada ne ostavljati `console.log` u produkcionom kodu.
- **Error Boundaries**: Svaki modul mora imati Error Boundary da aplikacija ne bi "pukla" cijela.

## 5. Sigurnost (Fort Knox Approach)
- **Supabase RLS**: Nijedan podatak ne smije biti dostupan bez Row Level Security polisa.
- **Sensitive Data**: Nikada ne čuvati lozinke ili ključeve u kodu (koristiti `.env`).
- **Input Validation**: Svaki unos sa strane korisnika ili API-ja mora biti validiran (Zod library).
- **Audit Logs**: Svaka kritična akcija (brisanje taska, promjena admina) mora biti logovana.

## 6. Modularnost (LEGO Architecture)
- **Features**: Svaki modul (OBD, Tasks, Reservations) mora biti nezavisan.
- **UI Components**: Koristiti atomski dizajn (Atoms, Molecules, Organisms).
- **Contexts**: Svaki modul ima svoj Context ili Redux slice. Ne miješati logiku taskova sa logikom goriva.

## 7. Procedura Ispravljanja Grešaka
1. **Reproduce**: Napravi test koji pokazuje grešku.
2. **Analyze**: Pronađi "zašto", a ne samo "gdje".
3. **Fix**: Ispravi grešku prateći mikro-korake.
4. **Prevent**: Dodaj regresioni test da se ista greška nikada ne ponovi.

