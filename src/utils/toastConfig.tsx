import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';
import Colors from '../constants/Colors';

// Dynamic toast config function that accepts theme mode
export const createToastConfig = (themeMode: 'light' | 'dark') => {
  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    card: Colors.DARK.card,
    border: Colors.DARK.border,
  } : {
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    card: Colors.LIGHT.card,
    border: Colors.LIGHT.border,
  };

  const dynamicStyles = StyleSheet.create({
    // SUCCESS TOAST - Card-like design (zelena) - Theme-aware
    successToast: {
      borderLeftColor: Colors.SUCCESS,
      borderLeftWidth: 5,
      backgroundColor: screenColors.card,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: Colors.SUCCESS,
      marginHorizontal: -31,
      marginVertical: 8,
      minHeight: 98,
      elevation: 4,
      shadowColor: themeMode === 'dark' ? '#000' : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: themeMode === 'dark' ? 0.3 : 0.15,
      shadowRadius: 4,
    },
    
    // ERROR TOAST - Card-like design (crvena) - Theme-aware
    errorToast: {
      borderLeftColor: Colors.DANGER,
      borderLeftWidth: 5,
      backgroundColor: screenColors.card,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: Colors.DANGER,
      marginHorizontal: -31,
      marginVertical: 8,
      minHeight: 98,
      elevation: 4,
      zIndex: 9999,
      shadowColor: themeMode === 'dark' ? '#000' : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: themeMode === 'dark' ? 0.3 : 0.15,
      shadowRadius: 4,
    },
    
    // INFO TOAST - Card-like design (plava) - Theme-aware
    infoToast: {
      borderLeftColor: Colors.PRIMARY,
      borderLeftWidth: 5,
      backgroundColor: screenColors.card,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: Colors.PRIMARY,
      marginHorizontal: -31,
      marginVertical: 8,
      minHeight: 98,
      elevation: 4,
      shadowColor: themeMode === 'dark' ? '#000' : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: themeMode === 'dark' ? 0.3 : 0.15,
      shadowRadius: 4,
    },
    
    // WARNING TOAST - Card-like design (narandžasta) - Theme-aware
    warningToast: {
      borderLeftColor: '#FF9500',
      borderLeftWidth: 5,
      backgroundColor: screenColors.card,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#FF9500',
      marginHorizontal: -31,
      marginVertical: 8,
      minHeight: 98,
      elevation: 4,
      shadowColor: themeMode === 'dark' ? '#000' : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: themeMode === 'dark' ? 0.3 : 0.15,
      shadowRadius: 4,
    },
    
    // CONTENT CONTAINER - Theme-aware
    contentContainer: {
      paddingHorizontal: 24,
      paddingVertical: 20,
      justifyContent: 'center',
      minHeight: 70,
      flex: 1,
    },
    
    // TEXT STYLING - Theme-aware
    text1: {
      fontSize: 18,
      fontWeight: '700',
      color: screenColors.text,
      marginBottom: 8,
      lineHeight: 24,
    },
    
    text2: {
      fontSize: 16,
      fontWeight: '400',
      color: screenColors.textSecondary,
      lineHeight: 22,
    },
    
    // SUBTLE TOAST - Theme-aware
    subtleToast: {
      backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.8)',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 25,
      marginHorizontal: 16,
      alignSelf: 'center',
      maxWidth: '90%',
    },
    
    subtleText1: {
      fontSize: 15,
      fontWeight: '600',
      color: themeMode === 'dark' ? '#FFFFFF' : '#FFFFFF',
      textAlign: 'center',
    },
    
    subtleText2: {
      fontSize: 13,
      fontWeight: '400',
      color: themeMode === 'dark' ? '#E0E0E0' : '#E0E0E0',
      textAlign: 'center',
      marginTop: 4,
      lineHeight: 16,
    },
  });

  return {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={[dynamicStyles.successToast]}
        contentContainerStyle={dynamicStyles.contentContainer}
        text1Style={dynamicStyles.text1}
        text2Style={dynamicStyles.text2}
        text1NumberOfLines={3}
        text2NumberOfLines={4}
      />
    ),

    error: (props: any) => (
      <ErrorToast
        {...props}
        style={[dynamicStyles.errorToast]}
        contentContainerStyle={dynamicStyles.contentContainer}
        text1Style={dynamicStyles.text1}
        text2Style={dynamicStyles.text2}
        text1NumberOfLines={3}
        text2NumberOfLines={4}
      />
    ),

    info: (props: any) => (
      <InfoToast
        {...props}
        style={[dynamicStyles.infoToast]}
        contentContainerStyle={dynamicStyles.contentContainer}
        text1Style={dynamicStyles.text1}
        text2Style={dynamicStyles.text2}
        text1NumberOfLines={3}
        text2NumberOfLines={4}
      />
    ),

    warning: (props: any) => (
      <ErrorToast
        {...props}
        style={[dynamicStyles.warningToast]}
        contentContainerStyle={dynamicStyles.contentContainer}
        text1Style={dynamicStyles.text1}
        text2Style={dynamicStyles.text2}
        text1NumberOfLines={3}
        text2NumberOfLines={4}
      />
    ),

    subtle: ({ text1, text2, ...rest }: any) => (
      <View style={dynamicStyles.subtleToast}>
        <Text style={dynamicStyles.subtleText1}>{text1}</Text>
        {text2 && <Text style={dynamicStyles.subtleText2}>{text2}</Text>}
      </View>
    ),
  };
};

// Default export for backward compatibility (light theme)
const toastConfig = createToastConfig('light');
export default toastConfig; 