import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Colors from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';
import { Ionicons } from '@expo/vector-icons';

type ProfileData = {
  first_name: string;
  last_name: string;
  phone_number: string;
  position: string;
  // Add any other fields you want to be editable
};

// Re-usable Input component specific for this screen
const ProfileInput = ({ label, value, onChangeText, iconName, ...props }: any) => {
    const themeMode = useSelector((state: RootState) => state.theme.mode);
    const theme = themeMode === 'dark' ? Colors.DARK : Colors.LIGHT;
    const inputStyles = StyleSheet.create({
        label: { color: theme.text, marginBottom: 8, fontSize: 16, },
        inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, borderRadius: 8, paddingHorizontal: 10, marginBottom: 15, },
        icon: { marginRight: 10, },
        input: { flex: 1, height: 50, color: theme.text, fontSize: 16, }
    });
    return (
        <View>
            <Text style={inputStyles.label}>{label}</Text>
            <View style={inputStyles.inputContainer}>
                {iconName && <Ionicons name={iconName} size={20} color={theme.textSecondary} style={inputStyles.icon} />}
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholderTextColor={theme.textSecondary}
                    style={inputStyles.input}
                    {...props}
                />
            </View>
        </View>
    );
};

const EditProfileScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { user, refreshUserProfile } = useAuth();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const theme = themeMode === 'dark' ? Colors.DARK : Colors.LIGHT;

  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    phone_number: '',
    position: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (user) {
      console.log('[EditProfile] User data loaded into screen:', JSON.stringify({
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        position: user.position,
      }, null, 2));
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || '',
        position: user.position || '',
      });
    }
    setLoading(false);
  }, [user]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => {
      const newState = { ...prev, [field]: value };
      console.log(`[EditProfile] State updated for field '${field}':`, newState);
      return newState;
    });
  };

  const handleSave = async () => {
    if (!user) {
      console.error('[EditProfile] Save attempted without a user.');
      return;
    }

    const payload = {
      first_name: profileData.first_name.trim(),
      last_name: profileData.last_name.trim(),
      phone_number: profileData.phone_number.trim(),
      position: profileData.position.trim(),
    };
    
    console.log('[EditProfile] Attempting to save profile with payload:', JSON.stringify(payload, null, 2));
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .update(payload)
        .eq('user_id', user.user_id)
        .select() // select() will return the updated row
        .single();

      if (error) {
        console.error('[EditProfile] Supabase update error:', JSON.stringify(error, null, 2));
        throw error;
      }
      
      console.log('[EditProfile] Supabase update successful. Updated data:', JSON.stringify(data, null, 2));
      showSuccessToast(t('common.profile_updated_successfully'));
      await refreshUserProfile();
      navigation.goBack();

    } catch (error: any) {
      console.error('[EditProfile] Critical error in handleSave:', error);
      showErrorToast(t('common.profile_update_failed'), error.message);
    } finally {
      setIsSaving(false);
    }
  };
  
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background, },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: theme.border, },
    backButton: { marginRight: 16, },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.text, },
    scrollContainer: { flexGrow: 1, padding: 20, },
    button: { backgroundColor: Colors.PRIMARY, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20, },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold', },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background, }
  });

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={Colors.PRIMARY} /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('edit_profile', 'Edit Profile')}</Text>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ProfileInput
            label={t('common.first_name')}
            value={profileData.first_name}
            onChangeText={(text: string) => handleInputChange('first_name', text)}
            iconName="person-outline"
          />
          <ProfileInput
            label={t('common.last_name')}
            value={profileData.last_name}
            onChangeText={(text: string) => handleInputChange('last_name', text)}
            iconName="person-outline"
          />
          <ProfileInput
            label={t('common.phone_number')}
            value={profileData.phone_number}
            onChangeText={(text: string) => handleInputChange('phone_number', text)}
            keyboardType="phone-pad"
            iconName="call-outline"
          />
          <ProfileInput
            label={t('common.position')}
            value={profileData.position}
            onChangeText={(text: string) => handleInputChange('position', text)}
            iconName="briefcase-outline"
          />
          
          <TouchableOpacity onPress={handleSave} style={styles.button} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>{t('common.save', 'Save')}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen; 