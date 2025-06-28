import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type LanguageOption = 'en' | 'sr' | 'de' | 'me'; // Add more languages as needed
export type UnitsOption = 'km' | 'miles'; // Added UnitsOption
export type CurrencyOption = 'EUR' | 'USD' | 'RSD'; // Added CurrencyOption
// Add other settings types here, e.g., UnitsOption = 'km' | 'miles';

interface SettingsState {
  language: LanguageOption;
  units: UnitsOption; // Added units to state
  currency: CurrencyOption; // Added currency to state
  // currency: string;
}

const initialState: SettingsState = {
  language: 'en', // Default language
  units: 'km', // Default units
  currency: 'EUR', // Default currency
  // currency: 'EUR',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<LanguageOption>) => {
      state.language = action.payload;
    },
    toggleLanguage: (state) => { // Cycle through four languages
      if (state.language === 'en') {
        state.language = 'sr';
      } else if (state.language === 'sr') {
        state.language = 'de';
      } else if (state.language === 'de') {
        state.language = 'me';
      } else {
        state.language = 'en';
      }
    },
    setUnits: (state, action: PayloadAction<UnitsOption>) => { // Added setUnits
      state.units = action.payload;
    },
    toggleUnits: (state) => { // Added toggleUnits
      state.units = state.units === 'km' ? 'miles' : 'km';
    },
    setCurrency: (state, action: PayloadAction<CurrencyOption>) => { // Added setCurrency
      state.currency = action.payload;
    },
    toggleCurrency: (state) => { // Added toggleCurrency (simple toggle for now)
      // Cycle through EUR -> USD -> RSD -> EUR
      if (state.currency === 'EUR') {
        state.currency = 'USD';
      } else if (state.currency === 'USD') {
        state.currency = 'RSD';
      } else {
        state.currency = 'EUR';
      }
    },
    // Add other reducers for settings here
    // setCurrency: (state, action: PayloadAction<string>) => {
    //   state.currency = action.payload;
    // },
  },
});

export const { 
  setLanguage, 
  toggleLanguage, 
  setUnits, 
  toggleUnits, 
  setCurrency, 
  toggleCurrency 
} = settingsSlice.actions; // Exported new actions
export default settingsSlice.reducer; 