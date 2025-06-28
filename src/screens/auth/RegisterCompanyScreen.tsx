import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useTranslation } from 'react-i18next';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';

const RegisterCompanyScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      showErrorToast(t('auth.fill_all_fields'));
      return;
    }
    if (password !== confirmPassword) {
      showErrorToast(t('auth.passwords_do_not_match'));
      return;
    }

    setLoading(true);
    // BARE-METAL SIGNUP: No options, no metadata. Just email and password.
    // This is to test if the local Supabase Auth has an issue with the options object.
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Sign-up error:', error);
      showErrorToast(t('auth.signup_failed_check_logs'), error.message);
    } else if (data.user) {
      showSuccessToast(t('auth.signup_successful_verify_email'));
      navigation.navigate('CreateCompany'); 
    }
    setLoading(false);
  };

  return (
    <ImageBackground
      source={require('../../../assets/fleet-flow-background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{t('auth.create_your_account')}</Text>
          </View>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('auth.first_name_placeholder', 'First Name')}
              placeholderTextColor="#9ca3af"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.input}
              placeholder={t('auth.last_name_placeholder', 'Last Name')}
              placeholderTextColor="#9ca3af"
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={styles.input}
              placeholder={t('auth.email_placeholder', 'Email')}
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder={t('auth.password_placeholder', 'Password')}
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder={t('auth.confirm_password_placeholder', 'Confirm Password')}
              placeholderTextColor="#9ca3af"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{t('auth.register_button', 'Register')}</Text>}
            </TouchableOpacity>
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>{t('auth.already_have_account')} </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>{t('auth.login_link', 'Log In')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.4)' },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  headerContainer: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' },
  formContainer: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 16, padding: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    color: '#111827',
  },
  button: { backgroundColor: '#2563eb', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginText: { color: '#f3f4f6', fontSize: 16 },
  loginLink: { color: '#60a5fa', fontSize: 16, fontWeight: '600' },
});

export default RegisterCompanyScreen; 