import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, ImageBackground, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';
import { useAuth } from '../../contexts/AuthContext';
import Colors from '../../constants/Colors'; 
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const backgroundImage = require('../../../assets/fleet-flow-background.png');

const CreateCompanyScreen = () => {
  const { t } = useTranslation();
  const { refreshUserProfile } = useAuth();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const theme = themeMode === 'dark' ? Colors.DARK : Colors.LIGHT;

  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateCompany = async () => {
    if (!companyName.trim()) {
      showErrorToast(t('company.enter_company_name'));
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('create-company-for-user', {
        body: { companyName: companyName.trim() },
      });

      if (error) {
        throw error;
      }

      showSuccessToast(t('company.company_created_successfully'));
      await refreshUserProfile();
    } catch (err: any) {
      console.error('Create company error:', err);
      showErrorToast(t('company.create_failed'), err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: themeMode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 30,
      textAlign: 'center',
    },
    input: {
      width: '100%',
      height: 50,
      backgroundColor: theme.card,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 20,
      paddingHorizontal: 15,
      color: theme.text,
      fontSize: 16,
    },
    button: {
      width: '100%',
      height: 50,
      backgroundColor: Colors.PRIMARY,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginTop: 10,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground source={backgroundImage} style={styles.container}>
        <View style={styles.overlay}>
          <Text style={styles.title}>{t('company.one_last_step')}</Text>
          <Text style={styles.subtitle}>{t('company.tell_us_your_company_name')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('company.company_name_placeholder')}
            placeholderTextColor={theme.textSecondary}
            value={companyName}
            onChangeText={setCompanyName}
            autoCapitalize="words"
          />
          {loading ? (
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleCreateCompany}>
              <Text style={styles.buttonText}>{t('company.create_and_continue')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default CreateCompanyScreen; 