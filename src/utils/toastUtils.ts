import Toast from 'react-native-toast-message';
import i18n from '../i18n';

export interface ToastOptions {
  duration?: number; // in milliseconds, default 3000
  position?: 'top' | 'bottom'; // default 'top'
  onPress?: () => void;
}

export const showSuccessToast = (
  titleKey: string, 
  messageKey?: string, 
  options: ToastOptions = {}
) => {
  const { duration = 3000, position = 'top', onPress } = options;
  
  Toast.show({
    type: 'success',
    text1: i18n.t(titleKey),
    text2: messageKey ? i18n.t(messageKey) : undefined,
    position,
    visibilityTime: duration,
    onPress,
    topOffset: 80, // Povećano sa 60 za status bar
    bottomOffset: 100,
  });
};

export const showErrorToast = (
  titleKey: string, 
  messageKey?: string, 
  options: ToastOptions = {}
) => {
  const { duration = 4000, position = 'top', onPress } = options; // Longer for errors
  
  console.log('showErrorToast called:', { titleKey, messageKey, options });
  console.log('Translated text1:', i18n.t(titleKey));
  console.log('Translated text2:', messageKey ? i18n.t(messageKey) : undefined);
  
  Toast.show({
    type: 'error',
    text1: i18n.t(titleKey),
    text2: messageKey ? i18n.t(messageKey) : undefined,
    position,
    visibilityTime: duration,
    onPress,
    topOffset: position === 'top' ? 100 : 120, // Smanjeno sa 160 na 100
    bottomOffset: 100,
  });
};

export const showInfoToast = (
  titleKey: string, 
  messageKey?: string, 
  options: ToastOptions = {}
) => {
  const { duration = 2500, position = 'top', onPress } = options;
  
  Toast.show({
    type: 'info',
    text1: i18n.t(titleKey),
    text2: messageKey ? i18n.t(messageKey) : undefined,
    position,
    visibilityTime: duration,
    onPress,
    topOffset: 80, // Povećano sa 60 za status bar
    bottomOffset: 100,
  });
};

export const showWarningToast = (
  titleKey: string, 
  messageKey?: string, 
  options: ToastOptions = {}
) => {
  const { duration = 3500, position = 'top', onPress } = options;
  
  Toast.show({
    type: 'warning', // Koristi novi warning tip umesto error
    text1: i18n.t(titleKey),
    text2: messageKey ? i18n.t(messageKey) : undefined,
    position,
    visibilityTime: duration,
    onPress,
    topOffset: 80, // Povećano sa 60 za status bar
    bottomOffset: 100,
  });
};

// Hide all toasts
export const hideToast = () => {
  Toast.hide();
};

// Show subtle toast notification (minimal, auto-disappearing)
export const showSubtleToast = (
  titleKey: string, 
  messageKey?: string, 
  options: ToastOptions = {}
) => {
  const { duration = 2000, position = 'top', onPress } = options; // Shorter duration for subtle
  
  Toast.show({
    type: 'subtle' as any, // Custom type
    text1: i18n.t(titleKey),
    text2: messageKey ? i18n.t(messageKey) : undefined,
    position,
    visibilityTime: duration,
    onPress,
    topOffset: 100, // Standardno za subtle toast
    bottomOffset: 100,
  });
};

// Show toast with custom content (fallback for hardcoded strings during migration)
export const showCustomToast = (
  type: 'success' | 'error' | 'info' | 'warning',
  title: string,
  message?: string,
  options: ToastOptions = {}
) => {
  const { duration = 3000, position = 'top', onPress } = options;
  
  Toast.show({
    type,
    text1: title,
    text2: message,
    position,
    visibilityTime: duration,
    onPress,
    topOffset: 80, // Povećano sa 60 za status bar
    bottomOffset: 100,
  });
}; 