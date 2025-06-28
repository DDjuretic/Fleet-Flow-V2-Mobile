// Example usage of the new toast notification system
// This file shows how to use the new card-like toast notifications

import { showSuccessToast, showErrorToast, showInfoToast, showWarningToast, showSubtleToast } from './toastUtils';

// SUCCESS NOTIFICATIONS (Card-like, zelena, 3 sekunde)
export const exampleSuccessUsage = () => {
  // Basic success - card-like design, 3 sekunde
  showSuccessToast('common.success', 'company_settings_saved');
  
  // Success with custom duration - card-like design, 2 sekunde
  showSuccessToast('common.success', 'user_saved', { duration: 2000 });
  
  // Success at bottom of screen - card-like design
  showSuccessToast('common.success', 'data_exported', { 
    duration: 2500, 
    position: 'bottom' 
  });
};

// ERROR NOTIFICATIONS (Card-like, crvena, 4 sekunde)
export const exampleErrorUsage = () => {
  // Basic error - card-like design, 4 sekunde (duže za greške)
  showErrorToast('common.error', 'company_settings_save_error');
  
  // Error with shorter duration - card-like design
  showErrorToast('common.error', 'network_error', { duration: 3000 });
};

// INFO NOTIFICATIONS (Card-like, plava, 2.5 sekundi)
export const exampleInfoUsage = () => {
  // Basic info - card-like design, 2.5 sekundi
  showInfoToast('common.info', 'data_loading');
  
  // Info with callback when pressed - card-like design
  showInfoToast('common.info', 'tap_to_refresh', { 
    duration: 3000,
    onPress: () => {
      console.log('User pressed info toast');
      // Refresh data or navigate somewhere
    }
  });
};

// WARNING NOTIFICATIONS (Card-like, narandžasta, 3.5 sekundi)
export const exampleWarningUsage = () => {
  // Basic warning - card-like design, narandžasta boja
  showWarningToast('common.warning', 'data_will_be_lost');
  
  // Warning with custom duration - card-like design
  showWarningToast('common.warning', 'unsaved_changes', { duration: 5000 });
};

// SUBTLE NOTIFICATIONS (Minimalna crna, 2 sekunde)
export const exampleSubtleUsage = () => {
  // Minimal notification - 2 sekunde
  showSubtleToast('common.saved'); // Samo title
  
  // Subtle with message
  showSubtleToast('common.updated', 'profile_changes_saved', { duration: 1500 });
  
  // Very quick subtle notification - 1 sekunda
  showSubtleToast('common.copied', undefined, { duration: 1000 });
};

// COMPARISON - OLD vs NEW DESIGN
export const designComparisonExamples = () => {
  console.log('🎨 NEW CARD-LIKE TOAST DESIGN:');
  console.log('✅ Veće kartice (minHeight: 80px)');
  console.log('✅ Isti border radius kao Card komponenta (12px)');
  console.log('✅ Isti padding kao Card komponenta (16px)');
  console.log('✅ Isti shadow efekti kao Card komponenta');
  console.log('✅ Veći tekst (17px/15px umesto 16px/14px)');
  console.log('✅ Više linija teksta (3-4 umesto 2-3)');
  console.log('✅ Warning tip ima svoju narandžastu boju');
  
  // Demonstracija svih tipova
  setTimeout(() => showSuccessToast('common.success', 'fuel_price_created_success'), 500);
  setTimeout(() => showErrorToast('common.error', 'fuel_price_save_error'), 1500);
  setTimeout(() => showInfoToast('common.info', 'data_loading'), 2500);
  setTimeout(() => showWarningToast('common.warning', 'unsaved_changes'), 3500);
  setTimeout(() => showSubtleToast('common.saved'), 4500);
};

// REPLACEMENT FOR OLD Alert.alert() PATTERNS
export const migrationExamples = () => {
  // OLD WAY (napadno, treba da zatvorì):
  // Alert.alert('Success', 'Data saved successfully');
  
  // NEW WAY (card-like design, automatski nestaje):
  showSuccessToast('common.success', 'data_saved_successfully');
  
  // OLD WAY:
  // Alert.alert('Error', 'Something went wrong');
  
  // NEW WAY (card-like design, automatski nestaje):
  showErrorToast('common.error', 'something_went_wrong');
  
  // Za vrlo kratke poruke koristiti subtle (ostaju minimalni):
  showSubtleToast('common.done'); // Nestane za 2 sekunde
};

// FUEL PRICE SPECIFIC EXAMPLES
export const fuelPriceToastExamples = () => {
  // Success kada se doda fuel price
  showSuccessToast('common.success', 'fuel_price_created_success');
  
  // Error kada se ne može sačuvati
  showErrorToast('common.error', 'fuel_price_save_error');
  
  // Warning kada su podaci nepotpuni
  showWarningToast('common.warning', 'fill_required_fields');
  
  // Info kada se učitavaju podaci
  showInfoToast('common.info', 'loading_fuel_prices');
};

// DURATION GUIDELINES:
// - Subtle toasts: 1-2 sekunde (za kratke poruke kao "Saved", "Copied")
// - Info toasts: 2-3 sekunde (za informativne poruke)
// - Success toasts: 2-3 sekunde (za potvrde akcija)
// - Warning toasts: 3-4 sekunde (potrebno više vremena da korisnik pročita)
// - Error toasts: 4-5 sekundi (najduže, jer korisnik treba da shvati grešku) 