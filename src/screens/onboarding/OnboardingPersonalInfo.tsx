import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';

interface OnboardingPersonalInfoProps {
  userData: {
    firstName: string;
    lastName: string;
    [key: string]: any;
  };
  onSave: (data: { firstName: string; lastName: string }) => void;
  onNext: () => void;
}

const OnboardingPersonalInfo: React.FC<OnboardingPersonalInfoProps> = ({
  userData,
  onSave,
  onNext
}) => {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState(userData.firstName || '');
  const [lastName, setLastName] = useState(userData.lastName || '');
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validate = () => {
    const newErrors: { firstName?: string; lastName?: string } = {};
    
    if (!firstName.trim()) {
      newErrors.firstName = t('first_name_required', 'First name is required');
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = t('last_name_required', 'Last name is required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validate()) {
      setIsSubmitting(true);
      
      // Save data and proceed to next step
      onSave({
        firstName: firstName.trim(),
        lastName: lastName.trim()
      });
      
      setIsSubmitting(false);
      onNext();
    }
  };
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {t('personal_info', 'Personal Information')}
          </Text>
          <Text style={styles.subtitle}>
            {t('enter_basic_information', 'Please enter your basic information')}
          </Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {t('first_name', 'First Name')}
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  borderColor: errors.firstName ? '#ef4444' : '#e5e7eb'
                }
              ]}
              value={firstName}
              onChangeText={setFirstName}
              placeholder={t('enter_first_name', 'Enter your first name')}
              placeholderTextColor="#9ca3af"
              autoCapitalize="words"
            />
            {errors.firstName && (
              <Text style={styles.errorText}>
                {errors.firstName}
              </Text>
            )}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {t('last_name', 'Last Name')}
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  borderColor: errors.lastName ? '#ef4444' : '#e5e7eb'
                }
              ]}
              value={lastName}
              onChangeText={setLastName}
              placeholder={t('enter_last_name', 'Enter your last name')}
              placeholderTextColor="#9ca3af"
              autoCapitalize="words"
            />
            {errors.lastName && (
              <Text style={styles.errorText}>
                {errors.lastName}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                {t('next', 'Next')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    padding: 20,
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#374151',
  },
  errorText: {
    fontSize: 14,
    marginTop: 5,
    color: '#ef4444',
  },
  footer: {
    marginTop: 'auto',
  },
  button: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default OnboardingPersonalInfo; 