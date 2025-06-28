import i18n from '../i18n';
import { store } from '../store';
import { setLanguage } from '../store/slices/settingsSlice';

// Function to sync i18n with Redux store
export const syncI18nWithRedux = () => {
  // Listen to Redux store changes
  let currentLanguage = store.getState().settings.language;
  
  // Set initial language
  console.log('🌐 Setting initial i18n language to:', currentLanguage);
  i18n.changeLanguage(currentLanguage);
  
  // Subscribe to store changes
  store.subscribe(() => {
    const newLanguage = store.getState().settings.language;
    
    if (newLanguage !== currentLanguage) {
      console.log('🔄 Language changed in Redux from', currentLanguage, 'to', newLanguage);
      currentLanguage = newLanguage;
      i18n.changeLanguage(newLanguage);
    }
  });
};

// Initialize the integration
export const initializeI18nIntegration = () => {
  // Set up the synchronization
  syncI18nWithRedux();
  
  // Listen to i18n language changes and update Redux store
  i18n.on('languageChanged', (lng) => {
    console.log('📝 i18n language changed to:', lng);
    const currentReduxLanguage = store.getState().settings.language;
    if (lng !== currentReduxLanguage) {
      console.log('🔄 Updating Redux store language from', currentReduxLanguage, 'to', lng);
      store.dispatch(setLanguage(lng as 'en' | 'sr' | 'de'));
    }
  });
}; 