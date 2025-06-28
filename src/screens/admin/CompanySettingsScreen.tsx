import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store/rootReducer';
import Colors from '../../constants/Colors';
import { useGetCompanySettingsQuery, useUpdateCompanySettingsMutation } from '../../store/api/supabaseApi';
import { showSuccessToast, showErrorToast } from '../../utils/toastUtils';

interface CompanyData {
  name: string;
  registration_number?: string;
  tax_number?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  industry?: string;
  founded_year?: string;
  employee_count?: string;
  description?: string;
  bank_name?: string;
  bank_account?: string;
  swift_code?: string;
  subscription_plan?: string;
}

const CompanySettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  // API hooks
  const { data: companySettings, isLoading, error, refetch } = useGetCompanySettingsQuery();
  const [updateCompanySettings, { isLoading: isUpdating }] = useUpdateCompanySettingsMutation();

  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    registration_number: '',
    tax_number: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    industry: '',
    founded_year: '',
    employee_count: '',
    description: '',
    bank_name: '',
    bank_account: '',
    swift_code: '',
    subscription_plan: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  // Update local state when API data loads
  useEffect(() => {
    if (companySettings && companySettings !== null) {
      setCompanyData({
        name: companySettings.name || '',
        registration_number: companySettings.registration_number || '',
        tax_number: companySettings.tax_number || '',
        address: companySettings.address || '',
        city: companySettings.city || '',
        postal_code: companySettings.postal_code || '',
        country: companySettings.country || '',
        contact_email: companySettings.contact_email || '',
        contact_phone: companySettings.contact_phone || '',
        website: companySettings.website || '',
        industry: companySettings.industry || '',
        founded_year: companySettings.founded_year || '',
        employee_count: companySettings.employee_count || '',
        description: companySettings.description || '',
        bank_name: companySettings.bank_name || '',
        bank_account: companySettings.bank_account || '',
        swift_code: companySettings.swift_code || '',
        subscription_plan: companySettings.subscription_plan || ''
      });
    }
  }, [companySettings]);

  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    card: Colors.DARK.card,
    border: Colors.DARK.border,
    primary: Colors.DARK.primary,
    success: Colors.SUCCESS,
    danger: Colors.DANGER,
    warning: Colors.WARNING,
  } : {
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    card: Colors.LIGHT.card,
    border: Colors.LIGHT.border,
    primary: Colors.LIGHT.primary,
    success: Colors.SUCCESS,
    danger: Colors.DANGER,
    warning: Colors.WARNING,
  };

  const handleSave = async () => {
    try {
      await updateCompanySettings(companyData).unwrap();
      setIsEditing(false);
      showSuccessToast('common.success', 'company_settings_saved', { duration: 3000 });
    } catch (error) {
      console.error('Error saving company settings:', error);
      showErrorToast('common.error', 'company_settings_save_error', { duration: 4000 });
    }
  };

  const renderInputField = (label: string, value: string, onChangeText: (text: string) => void, multiline = false, placeholder?: string) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: screenColors.text }]}>{label}</Text>
      <TextInput
        style={[
          multiline ? styles.textArea : styles.input,
          { 
            backgroundColor: screenColors.background,
            borderColor: screenColors.border,
            color: screenColors.text
          }
        ]}
        value={value}
        onChangeText={onChangeText}
        editable={isEditing}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        placeholderTextColor={screenColors.textSecondary}
        placeholder={placeholder}
      />
    </View>
  );

  if (isLoading || (companySettings === null && !error)) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={screenColors.primary} />
                      <Text style={[styles.loadingText, { color: screenColors.text }]}>{t('loading')}...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={screenColors.danger} />
                      <Text style={[styles.errorText, { color: screenColors.text }]}>{t('common.error')}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: screenColors.primary }]}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: screenColors.background, borderBottomColor: screenColors.border }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={screenColors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: screenColors.text }]}>{t('company_settings')}</Text>
          <Text style={[styles.headerSubtitle, { color: screenColors.textSecondary }]}>
            {t('company_settings_desc')}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: isEditing ? screenColors.success : screenColors.primary }]}
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator size={20} color="white" />
          ) : (
            <Ionicons name={isEditing ? "checkmark" : "pencil"} size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Company Identity */}
        <View style={[styles.sectionCard, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="business-outline" size={24} color={screenColors.primary} />
            <Text style={[styles.sectionTitle, { color: screenColors.text }]}>{t('company_identity')}</Text>
          </View>
          
          {renderInputField(t('company_name'), companyData.name, (text) => 
            setCompanyData(prev => ({ ...prev, name: text })), false, 'Enter company name'
          )}
          {renderInputField(t('registration_number'), companyData.registration_number || '', (text) => 
            setCompanyData(prev => ({ ...prev, registration_number: text })), false, 'Business registration number'
          )}
          {renderInputField(t('tax_number'), companyData.tax_number || '', (text) => 
            setCompanyData(prev => ({ ...prev, tax_number: text })), false, 'Tax identification number'
          )}
          {renderInputField(t('industry'), companyData.industry || '', (text) => 
            setCompanyData(prev => ({ ...prev, industry: text })), false, 'e.g., Transportation, Logistics'
          )}
          {renderInputField(t('website'), companyData.website || '', (text) => 
            setCompanyData(prev => ({ ...prev, website: text })), false, 'https://company.com'
          )}
          {renderInputField(t('description'), companyData.description || '', (text) => 
            setCompanyData(prev => ({ ...prev, description: text })), true, 'Brief company description...'
          )}
        </View>

        {/* Address Information */}
        <View style={[styles.sectionCard, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={24} color={screenColors.primary} />
            <Text style={[styles.sectionTitle, { color: screenColors.text }]}>{t('headquarters')}</Text>
          </View>
          
          {renderInputField(t('address'), companyData.address || '', (text) => 
            setCompanyData(prev => ({ ...prev, address: text })), false, 'Street address'
          )}
          {renderInputField(t('city'), companyData.city || '', (text) => 
            setCompanyData(prev => ({ ...prev, city: text })), false, 'City'
          )}
          {renderInputField(t('postal_code'), companyData.postal_code || '', (text) => 
            setCompanyData(prev => ({ ...prev, postal_code: text })), false, 'Postal code'
          )}
          {renderInputField(t('country'), companyData.country || '', (text) => 
            setCompanyData(prev => ({ ...prev, country: text })), false, 'Country'
          )}
        </View>

        {/* Contact Information */}
        <View style={[styles.sectionCard, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="call-outline" size={24} color={screenColors.primary} />
            <Text style={[styles.sectionTitle, { color: screenColors.text }]}>{t('contact_info')}</Text>
          </View>
          
          {renderInputField(t('email'), companyData.contact_email || '', (text) => 
            setCompanyData(prev => ({ ...prev, contact_email: text })), false, 'contact@company.com'
          )}
          {renderInputField(t('phone'), companyData.contact_phone || '', (text) => 
            setCompanyData(prev => ({ ...prev, contact_phone: text })), false, '+382 XX XXX XXX'
          )}
        </View>

        {/* Banking Information */}
        <View style={[styles.sectionCard, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card-outline" size={24} color={screenColors.primary} />
            <Text style={[styles.sectionTitle, { color: screenColors.text }]}>{t('banking_info')}</Text>
          </View>
          
          {renderInputField(t('bank_name'), companyData.bank_name || '', (text) => 
            setCompanyData(prev => ({ ...prev, bank_name: text })), false, 'Bank name'
          )}
          {renderInputField(t('bank_account'), companyData.bank_account || '', (text) => 
            setCompanyData(prev => ({ ...prev, bank_account: text })), false, 'Account number'
          )}
          {renderInputField(t('swift_code'), companyData.swift_code || '', (text) => 
            setCompanyData(prev => ({ ...prev, swift_code: text })), false, 'SWIFT/BIC code'
          )}
        </View>

        {/* Additional Information */}
        <View style={[styles.sectionCard, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={24} color={screenColors.primary} />
            <Text style={[styles.sectionTitle, { color: screenColors.text }]}>Additional Information</Text>
          </View>
          
          {renderInputField('Founded Year', companyData.founded_year || '', (text) => 
            setCompanyData(prev => ({ ...prev, founded_year: text })), false, 'e.g., 2020'
          )}
          {renderInputField('Employee Count', companyData.employee_count || '', (text) => 
            setCompanyData(prev => ({ ...prev, employee_count: text })), false, 'Number of employees'
          )}
          {renderInputField('Subscription Plan', companyData.subscription_plan || '', (text) => 
            setCompanyData(prev => ({ ...prev, subscription_plan: text })), false, 'e.g., Premium, Enterprise'
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
  },
});

export default CompanySettingsScreen; 