import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { useGetCurrentUserProfileQuery, useUpdateCurrentUserProfileMutation, useCreateUserRequestMutation } from '../../store/api/supabaseApi';
import { 
  takePhotoWithCamera, 
  pickImageFromGallery, 
  uploadImageToSupabase, 
  saveImageLocally, 
  getLocalImage,
  deleteImageFromSupabase 
} from '../../utils/imageUtils';
import { useTranslation } from 'react-i18next';
import { showWarningToast, showSuccessToast, showErrorToast } from '../../utils/toastUtils';

interface UserProfileData {
  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternativePhone: string;
  dateOfBirth: string;
  profileImage: string;
  avatar_url?: string;
  
  // Work Information
  employeeId: string;
  position: string;
  department: string;
  branch: string;
  manager: string;
  startDate: string;
  workEmail: string;
  
  // Address Information
  homeAddress: string;
  homeCity: string;
  homePostalCode: string;
  homeCountry: string;
  workAddress: string;
  workCity: string;
  workPostalCode: string;
  workCountry: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  
  // Vehicle & Licenses
  hasPrivateVehicle: boolean;
  privateVehiclePlate: string;
  privateVehicleMake: string;
  privateVehicleModel: string;
  drivingLicenseNumber: string;
  drivingLicenseCategory: string;
  drivingLicenseExpiry: string;
  
  // Company Role & Permissions
  role: string;
  permissions: string[];
  accessLevel: string;
  
  // Additional Information
  biography: string;
  skills: string[] | string;
  languages: string[] | string;
  certifications: string[] | string;
}

const PROFILE_IMAGE_PLACEHOLDER = 'https://via.placeholder.com/150';

export default function UserProfileScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const [isEditing, setIsEditing] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Get current user profile data
  const { 
    data: userProfile, 
    isLoading: isLoadingProfile, 
    error: profileError,
    refetch: refetchProfile 
  } = useGetCurrentUserProfileQuery(user?.user_id || '', {
    skip: !user?.user_id
  });

  // Update user profile mutation (for direct updates like admin)
  const [updateProfile, { isLoading: isUpdating }] = useUpdateCurrentUserProfileMutation();
  
  // Create user request mutation (for pending approval)
  const [createUserRequest, { isLoading: isCreatingRequest }] = useCreateUserRequestMutation();

  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    primary: Colors.DARK.primary,
    card: Colors.DARK.card, 
    border: Colors.DARK.border,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    danger: Colors.DANGER,
  } : {
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    primary: Colors.LIGHT.primary,
    card: Colors.LIGHT.card,
    border: Colors.LIGHT.border,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    danger: Colors.DANGER,
  };

  // Initialize profile data state
  const [profileData, setProfileData] = useState<UserProfileData>({
    // Basic Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    alternativePhone: '',
    dateOfBirth: '',
    profileImage: PROFILE_IMAGE_PLACEHOLDER,
    
    // Work Information
    employeeId: '',
    position: '',
    department: '',
    branch: '',
    manager: '',
    startDate: '',
    workEmail: '',
    
    // Address Information
    homeAddress: '',
    homeCity: '',
    homePostalCode: '',
    homeCountry: '',
    workAddress: '',
    workCity: '',
    workPostalCode: '',
    workCountry: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    
    // Vehicle & Licenses
    hasPrivateVehicle: false,
    privateVehiclePlate: '',
    privateVehicleMake: '',
    privateVehicleModel: '',
    drivingLicenseNumber: '',
    drivingLicenseCategory: '',
    drivingLicenseExpiry: '',
    
    // Company Role & Permissions
    role: '',
    permissions: [],
    accessLevel: '',
    
    // Additional Information
    biography: '',
    skills: [],
    languages: [],
    certifications: []
  });

  // Update profile data when userProfile data is loaded
  useEffect(() => {
    if (userProfile) {
      setProfileData({
        // Basic Information from database
        firstName: userProfile.first_name || '',
        lastName: userProfile.last_name || '',
        email: userProfile.email || '',
        phone: userProfile.phone_number || '',
        alternativePhone: userProfile.alternative_phone || '',
        dateOfBirth: userProfile.date_of_birth || '',
        profileImage: userProfile.avatar_url || PROFILE_IMAGE_PLACEHOLDER,
        
        // Work Information from database
        employeeId: userProfile.user_id.slice(0, 8).toUpperCase(),
        position: userProfile.position || '',
        department: userProfile.departments?.[0]?.name || '',
        branch: userProfile.branch || '',
        manager: userProfile.manager || '',
        startDate: userProfile.created_at ? new Date(userProfile.created_at).toISOString().split('T')[0] : '',
        workEmail: userProfile.work_email || '',
        
        // Address Information from database
        homeAddress: userProfile.home_address || '',
        homeCity: userProfile.home_city || '',
        homePostalCode: userProfile.home_postal_code || '',
        homeCountry: userProfile.home_country || '',
        workAddress: userProfile.work_address || '',
        workCity: userProfile.work_city || '',
        workPostalCode: userProfile.work_postal_code || '',
        workCountry: userProfile.work_country || '',
        
        // Emergency Contact from database
        emergencyContactName: userProfile.emergency_contact_name || '',
        emergencyContactPhone: userProfile.emergency_contact_phone || '',
        emergencyContactRelationship: userProfile.emergency_contact_relationship || '',
        
        // Vehicle & Licenses from database
        hasPrivateVehicle: userProfile.has_private_vehicle || false,
        privateVehiclePlate: userProfile.private_vehicle_plate || '',
        privateVehicleMake: userProfile.private_vehicle_make || '',
        privateVehicleModel: userProfile.private_vehicle_model || '',
        drivingLicenseNumber: userProfile.driving_license_number || '',
        drivingLicenseCategory: userProfile.driving_license_category || '',
        drivingLicenseExpiry: userProfile.driving_license_expiry || '',
        
        // Company Role & Permissions from database
        role: (userProfile as any).user_roles?.[0]?.roles?.role_name || '',
        permissions: [], // TODO: Implement proper permissions from database
        accessLevel: userProfile.is_active ? t('status_active', 'Active') : t('status_inactive', 'Inactive'),
        
        // Additional Information from database
        biography: userProfile.biography || '',
        skills: userProfile.skills || [],
        languages: userProfile.languages || [],
        certifications: userProfile.certifications || []
      });
    }
  }, [userProfile]);

  // Load cached local image when component mounts
  useEffect(() => {
    const loadCachedImage = async () => {
      // We check for a cached version of the remote URL
      if (userProfile?.avatar_url) {
        const cachedImage = await getLocalImage(userProfile.avatar_url);
        if (cachedImage) {
          setProfileData(prev => ({ ...prev, profileImage: cachedImage }));
        }
      }
    };
    
    loadCachedImage();
  }, [userProfile?.avatar_url]);

  const handleSaveProfile = async () => {
    // For now, let's assume admins can directly update.
    // A more robust solution would check specific permissions.
    const isAdmin = (userProfile as any)?.user_roles?.[0]?.roles?.role_name === 'admin';

    if (isAdmin) {
      await performDirectUpdate();
    } else {
      await submitProfileChangeRequest();
    }
  };

  const performDirectUpdate = async () => {
    if (!user) return;
    try {
      const updates = {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone_number: profileData.phone,
        alternative_phone: profileData.alternativePhone,
        date_of_birth: convertDateToISO(profileData.dateOfBirth),
        position: profileData.position,
        branch: profileData.branch,
        manager: profileData.manager,
        work_email: profileData.workEmail,
        home_address: profileData.homeAddress,
        home_city: profileData.homeCity,
        home_postal_code: profileData.homePostalCode,
        home_country: profileData.homeCountry,
        work_address: profileData.workAddress,
        work_city: profileData.workCity,
        work_postal_code: profileData.workPostalCode,
        work_country: profileData.workCountry,
        emergency_contact_name: profileData.emergencyContactName,
        emergency_contact_phone: profileData.emergencyContactPhone,
        emergency_contact_relationship: profileData.emergencyContactRelationship,
        has_private_vehicle: profileData.hasPrivateVehicle,
        private_vehicle_plate: profileData.privateVehiclePlate,
        private_vehicle_make: profileData.privateVehicleMake,
        private_vehicle_model: profileData.privateVehicleModel,
        driving_license_number: profileData.drivingLicenseNumber,
        driving_license_category: profileData.drivingLicenseCategory,
        driving_license_expiry: convertDateToISO(profileData.drivingLicenseExpiry),
        biography: profileData.biography,
        skills: convertArrayToString(profileData.skills),
        languages: convertArrayToString(profileData.languages),
        certifications: convertArrayToString(profileData.certifications),
      };

      await updateProfile({ userId: user.user_id, updates }).unwrap();
      
      showSuccessToast(t('profile_updated_successfully'));
      setIsEditing(false);
      refetchProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
      showErrorToast(t('failed_to_update_profile'));
    }
  };

  const updateAvatarUrl = async (newUrl: string) => {
    try {
      if (!user?.user_id) throw new Error("User not found for avatar update.");
      await updateProfile({
        userId: user.user_id,
        updates: { avatar_url: newUrl }
      }).unwrap();
      showSuccessToast(t('common.success'), t('messages.avatar_updated'));
      refetchProfile();
    } catch (error) {
      console.error('Error updating avatar URL:', error);
      showErrorToast(t('common.error'), t('errors.upload_failed'));
    }
  };

  const submitProfileChangeRequest = async () => {
    try {
      // Compare original and new data to find changes
      const changes = [];
      const originalData = userProfile;
      
      if (originalData?.first_name !== profileData.firstName) {
        changes.push({
          field: 'first_name',
          old_value: originalData?.first_name || '',
          new_value: profileData.firstName,
          field_display: t('first_name', 'First Name')
        });
      }
      
      if (originalData?.last_name !== profileData.lastName) {
        changes.push({
          field: 'last_name',
          old_value: originalData?.last_name || '',
          new_value: profileData.lastName,
          field_display: t('last_name', 'Last Name')
        });
      }
      
      if (originalData?.phone_number !== profileData.phone) {
        changes.push({
          field: 'phone_number',
          old_value: originalData?.phone_number || '',
          new_value: profileData.phone,
          field_display: t('phone_number', 'Phone Number')
        });
      }
      
      if (originalData?.position !== profileData.position) {
        changes.push({
          field: 'position',
          old_value: originalData?.position || '',
          new_value: profileData.position,
          field_display: t('position', 'Position')
        });
      }

      // Add more field comparisons as needed...

      if (changes.length === 0) {
        showWarningToast(t('no_changes_detected', 'No changes detected'));
        return;
      }

      await createUserRequest({
        user_id: user!.user_id,
        requested_by_user_id: user!.user_id,
        request_type: 'profile_update',
        requested_changes: {
          changes,
          user_name: `${profileData.firstName} ${profileData.lastName}`,
          user_email: profileData.email
        }
      }).unwrap();

      setIsEditing(false);
      showSuccessToast(t('profile_change_request_submitted', 'Profile change request submitted for approval'));
    } catch (error) {
      console.error('Error creating user request:', error);
      showErrorToast(t('failed_to_submit_request', 'Failed to submit profile change request'));
    }
  };

  const handleImageUpload = () => {
    Alert.alert(
      t('change_profile_photo', 'Change Profile Photo'),
      t('choose_option', 'Choose an option'),
      [
        { 
          text: t('camera', 'Camera'), 
          onPress: async () => {
            setShowImageModal(false);
            await handleTakePhoto();
          }
        },
        { 
          text: t('gallery', 'Gallery'), 
          onPress: async () => {
            setShowImageModal(false);
            await handlePickFromGallery();
          }
        },
        { text: t('common.cancel', 'Cancel'), style: 'cancel', onPress: () => setShowImageModal(false) }
      ]
    );
  };

  const handleTakePhoto = async () => {
    if (!user?.user_id) return;
    
    setIsUploadingImage(true);
    
    try {
      const result = await takePhotoWithCamera();
      
      if (!result.success || !result.imageUri) {
        Alert.alert(t('common.error', 'Error'), result.error || t('failed_take_photo', 'Failed to take photo'));
        return;
      }

      await processSelectedImage(result.imageUri);
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert(t('common.error', 'Error'), t('failed_take_photo', 'Failed to take photo'));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handlePickFromGallery = async () => {
    if (!user?.user_id) return;
    
    setIsUploadingImage(true);
    
    try {
      const result = await pickImageFromGallery();
      
      if (!result.success || !result.imageUri) {
        Alert.alert(t('common.error', 'Error'), result.error || t('failed_pick_image', 'Failed to pick image'));
        return;
      }

      await processSelectedImage(result.imageUri);
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('common.error', 'Error'), t('failed_pick_image', 'Failed to pick image'));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const processSelectedImage = async (imageUri: string) => {
    if (!user?.user_id) {
      showErrorToast(t('common.error'), t('errors.must_be_logged_in'));
      return;
    }
    
    setIsUploadingImage(true);
    try {
      const { publicUrl, error: uploadError } = await uploadImageToSupabase(imageUri, 'avatars', user.user_id);

      if (uploadError || !publicUrl) {
        console.error('Failed to upload image:', uploadError);
        showErrorToast(t('errors.upload_failed'), (uploadError as Error)?.message || 'Unknown error');
        return;
      }
      
      // Update the UI immediately
      setProfileData(prev => ({ ...prev, profileImage: publicUrl }));
      // Call the dedicated function to update only the avatar in DB
      await updateAvatarUrl(publicUrl);
      // Cache the local file for quick display
      await saveImageLocally(imageUri);

    } catch (e: any) {
      console.error('Error processing image:', e);
      showErrorToast(t('common.error'), e.message || 'An unknown error occurred.');
    } finally {
      setIsUploadingImage(false);
      setShowImageModal(false);
    }
  };

  const updateProfileField = (field: keyof UserProfileData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  // Convert date from DD.MM.YYYY or MM/DD/YYYY to YYYY-MM-DD format for PostgreSQL
  const convertDateToISO = (dateString: string): string | null => {
    if (!dateString || dateString.trim() === '') return null;
    
    try {
      // Check if it's already in YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          return dateString;
        }
      }
      
      // Handle DD.MM.YYYY format
      if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) {
        const [day, month, year] = dateString.split('.');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      }
      
      // Handle MM/DD/YYYY format
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        const [month, day, year] = dateString.split('/');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      }
      
      // Try parsing as is
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
      
      return null;
    } catch (error) {
      console.error('Error converting date:', error);
      return null;
    }
  };

  // Convert mixed type to string array for API
  const convertToStringArray = (value: string[] | string | null): string[] | null => {
    if (!value) return null;
    if (Array.isArray(value)) {
      return value.length > 0 ? value : null;
    }
    if (typeof value === 'string' && value.trim()) {
      return value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    }
    return null;
  };

  // Convert string array back to comma-separated string for database storage
  const convertArrayToString = (value: string[] | string | null): string | null => {
    if (!value) return null;
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : null;
    }
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
    return null;
  };

  const renderSectionCard = (title: string, icon: string, children: React.ReactNode) => (
    <View style={[styles.sectionCard, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon as any} size={24} color={screenColors.primary} />
        <Text style={[styles.sectionTitle, { color: screenColors.text }]}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const renderInputField = (
    label: string, 
    value: string, 
    field: keyof UserProfileData, 
    multiline = false,
    keyboardType: any = 'default'
  ) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: screenColors.text }]}>{label}</Text>
      <TextInput
        style={[
          multiline ? styles.textArea : styles.input,
          { 
            backgroundColor: isEditing ? screenColors.background : screenColors.card,
            borderColor: screenColors.border,
            color: screenColors.text
          }
        ]}
        value={value}
        onChangeText={(text) => updateProfileField(field, text)}
        editable={isEditing}
        multiline={multiline}
        keyboardType={keyboardType}
        textAlignVertical={multiline ? 'top' : 'center'}
        placeholderTextColor={screenColors.textSecondary}
      />
    </View>
  );

  const renderArrayField = (label: string, items: string[] | string | null, color: string) => {
    // Convert items to array if it's a string or handle null/undefined
    let itemsArray: string[] = [];
    if (typeof items === 'string') {
      itemsArray = items.split(',').map(item => item.trim()).filter(item => item.length > 0);
    } else if (Array.isArray(items)) {
      itemsArray = items;
    }

    return (
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: screenColors.text }]}>{label}</Text>
        <View style={styles.tagsContainer}>
          {itemsArray.map((item, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: color + '20', borderColor: color }]}>
              <Text style={[styles.tagText, { color: color }]}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const styles = getStyles(screenColors); 

  // Show loading state
  if (isLoadingProfile) {
    return (
      <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: screenColors.background }]}>
        <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
        <View style={[styles.header, { borderBottomColor: screenColors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={screenColors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: screenColors.text }]}>{t('user_profile', 'User Profile')}</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={screenColors.primary} />
          <Text style={[styles.loadingText, { color: screenColors.textSecondary }]}>{t('loading_profile', 'Loading profile...')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (profileError) {
    return (
      <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: screenColors.background }]}>
        <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
        <View style={[styles.header, { borderBottomColor: screenColors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={screenColors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: screenColors.text }]}>User Profile</Text>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={screenColors.danger} />
          <Text style={[styles.errorTitle, { color: screenColors.text }]}>{t('error_loading_profile', 'Error Loading Profile')}</Text>
          <Text style={[styles.errorMessage, { color: screenColors.textSecondary }]}>
            {t('failed_load_profile', 'Failed to load user profile data')}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: screenColors.primary }]} 
            onPress={() => refetchProfile()}
          >
            <Text style={styles.retryButtonText}>{t('retry', 'Retry')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: screenColors.background }]}>
      <StatusBar 
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={screenColors.background} 
      />
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: screenColors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={screenColors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: screenColors.text }]}>User Profile</Text>
          </View>
          <TouchableOpacity
            style={[styles.editButton, { 
              backgroundColor: isEditing ? screenColors.success : screenColors.primary,
              opacity: isUpdating ? 0.6 : 1 
            }]}
            onPress={isEditing ? handleSaveProfile : () => setIsEditing(true)}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name={isEditing ? "checkmark" : "pencil"} size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingProfile}
              onRefresh={refetchProfile}
              colors={[screenColors.primary]}
              tintColor={screenColors.primary}
            />
          }
        >
          {/* Profile Header */}
          <View style={styles.profileHeaderSection}>
            <TouchableOpacity 
              style={styles.avatarContainer}
              onPress={() => setShowImageModal(true)}
              disabled={!isEditing || isUploadingImage}
            >
              <Image source={{ uri: profileData.profileImage }} style={styles.avatar} />
              {isUploadingImage ? (
                <View style={[styles.avatarOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
                  <ActivityIndicator size="small" color="white" />
                </View>
              ) : isEditing && (
                <View style={[styles.avatarOverlay, { backgroundColor: screenColors.primary }]}>
                  <Ionicons name="camera" size={24} color="white" />
                </View>
              )}
            </TouchableOpacity>
            <Text style={[styles.userName, { color: screenColors.text }]}>
              {`${profileData.firstName} ${profileData.lastName}`}
            </Text>
            <Text style={[styles.userPosition, { color: screenColors.textSecondary }]}>
              {profileData.position}
            </Text>
            <View style={[styles.roleBadge, { backgroundColor: screenColors.primary + '20' }]}>
              <Ionicons name="shield-checkmark" size={16} color={screenColors.primary} />
              <Text style={[styles.roleText, { color: screenColors.primary }]}>{profileData.role}</Text>
            </View>
          </View>

          {/* Basic Information */}
          {renderSectionCard(t('basic_information', 'Basic Information'), 'person-outline', (
            <>
              {renderInputField(t('first_name', 'First Name'), profileData.firstName, 'firstName')}
              {renderInputField(t('last_name', 'Last Name'), profileData.lastName, 'lastName')}
              {renderInputField(t('email', 'Email'), profileData.email, 'email', false, 'email-address')}
              {renderInputField(t('phone', 'Phone'), profileData.phone, 'phone', false, 'phone-pad')}
              {renderInputField(t('alternative_phone', 'Alternative Phone'), profileData.alternativePhone, 'alternativePhone', false, 'phone-pad')}
              {renderInputField(t('date_of_birth', 'Date of Birth'), profileData.dateOfBirth, 'dateOfBirth')}
            </>
          ))}

          {/* Work Information */}
          {renderSectionCard(t('work.information', 'Work Information'), 'briefcase-outline', (
            <>
              {renderInputField(t('employee.id', 'Employee ID'), profileData.employeeId, 'employeeId')}
              {renderInputField(t('position', 'Position'), profileData.position, 'position')}
              {renderInputField(t('department', 'Department'), profileData.department, 'department')}
              {renderInputField(t('branch', 'Branch'), profileData.branch, 'branch')}
              {renderInputField(t('manager', 'Manager'), profileData.manager, 'manager')}
              {renderInputField(t('start.date', 'Start Date'), profileData.startDate, 'startDate')}
              {renderInputField(t('work.email', 'Work Email'), profileData.workEmail, 'workEmail', false, 'email-address')}
            </>
          ))}

          {/* Address Information */}
          {renderSectionCard(t('address.information', 'Address Information'), 'location-outline', (
            <>
              <View style={styles.subSectionHeader}>
                <Text style={[styles.subSectionTitle, { color: screenColors.text }]}>{t('home.address', 'Home Address')}</Text>
              </View>
              {renderInputField(t('address', 'Address'), profileData.homeAddress, 'homeAddress')}
              {renderInputField(t('city', 'City'), profileData.homeCity, 'homeCity')}
              {renderInputField(t('postal.code', 'Postal Code'), profileData.homePostalCode, 'homePostalCode')}
              {renderInputField(t('country', 'Country'), profileData.homeCountry, 'homeCountry')}
              
              <View style={styles.subSectionHeader}>
                <Text style={[styles.subSectionTitle, { color: screenColors.text }]}>{t('work.address', 'Work Address')}</Text>
              </View>
              {renderInputField(t('address', 'Address'), profileData.workAddress, 'workAddress')}
              {renderInputField(t('city', 'City'), profileData.workCity, 'workCity')}
              {renderInputField(t('postal.code', 'Postal Code'), profileData.workPostalCode, 'workPostalCode')}
              {renderInputField(t('country', 'Country'), profileData.workCountry, 'workCountry')}
            </>
          ))}

          {/* Emergency Contact */}
          {renderSectionCard(t('emergency.contact', 'Emergency Contact'), 'medical-outline', (
            <>
              {renderInputField(t('contact.name', 'Contact Name'), profileData.emergencyContactName, 'emergencyContactName')}
              {renderInputField(t('contact.phone', 'Contact Phone'), profileData.emergencyContactPhone, 'emergencyContactPhone', false, 'phone-pad')}
              {renderInputField(t('relationship', 'Relationship'), profileData.emergencyContactRelationship, 'emergencyContactRelationship')}
            </>
          ))}

          {/* Vehicle & Licenses */}
          {renderSectionCard(t('vehicle.licenses', 'Vehicle & Licenses'), 'car-outline', (
            <>
              <View style={styles.switchRow}>
                <Text style={[styles.switchLabel, { color: screenColors.text }]}>{t('has.private.vehicle', 'Has Private Vehicle')}</Text>
                <TouchableOpacity
                  style={[
                    styles.switch,
                    { backgroundColor: profileData.hasPrivateVehicle ? screenColors.primary : screenColors.border }
                  ]}
                  onPress={() => updateProfileField('hasPrivateVehicle', !profileData.hasPrivateVehicle)}
                  disabled={!isEditing}
                >
                  <View style={[
                    styles.switchThumb,
                    { transform: [{ translateX: profileData.hasPrivateVehicle ? 20 : 0 }] }
                  ]} />
                </TouchableOpacity>
              </View>

              {profileData.hasPrivateVehicle && (
                <>
                  {renderInputField(t('license.plate', 'License Plate'), profileData.privateVehiclePlate, 'privateVehiclePlate')}
                  {renderInputField(t('make', 'Make'), profileData.privateVehicleMake, 'privateVehicleMake')}
                  {renderInputField(t('model', 'Model'), profileData.privateVehicleModel, 'privateVehicleModel')}
                </>
              )}
              
              {renderInputField(t('driving.license.number', 'Driving License Number'), profileData.drivingLicenseNumber, 'drivingLicenseNumber')}
              {renderInputField(t('license.category', 'License Category'), profileData.drivingLicenseCategory, 'drivingLicenseCategory')}
              {renderInputField(t('license.expiry', 'License Expiry'), profileData.drivingLicenseExpiry, 'drivingLicenseExpiry')}
            </>
          ))}

          {/* Company Role */}
          {renderSectionCard(t('company.role', 'Company Role'), 'shield-checkmark-outline', (
            <>
              {renderInputField(t('role', 'Role'), profileData.role, 'role')}
              {renderInputField(t('access.level', 'Access Level'), profileData.accessLevel, 'accessLevel')}
            </>
          ))}

          {/* Additional Information */}
          {renderSectionCard(t('additional.information', 'Additional Information'), 'information-circle-outline', (
            <>
              {renderInputField(t('biography', 'Biography'), profileData.biography, 'biography', true)}
              {renderArrayField(t('skills', 'Skills'), profileData.skills, screenColors.success)}
              {renderArrayField(t('languages', 'Languages'), profileData.languages, screenColors.warning)}
              {renderArrayField(t('certifications', 'Certifications'), profileData.certifications, screenColors.danger)}
            </>
          ))}
        </ScrollView>

        {/* Image Upload Modal */}
        <Modal
          visible={showImageModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowImageModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: screenColors.card }]}>
              <Text style={[styles.modalTitle, { color: screenColors.text }]}>{t('change.profile.photo', 'Change Profile Photo')}</Text>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: screenColors.primary }]}
                onPress={handleImageUpload}
              >
                <Ionicons name="camera" size={24} color="white" />
                <Text style={styles.modalButtonText}>{t('take.photo', 'Take Photo')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: screenColors.primary }]}
                onPress={handleImageUpload}
              >
                <Ionicons name="images" size={24} color="white" />
                <Text style={styles.modalButtonText}>{t('choose.from.gallery', 'Choose from Gallery')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: screenColors.textSecondary }]}
                onPress={() => setShowImageModal(false)}
              >
                <Text style={styles.modalButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (screenColors: any) => StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 10,
  },
  headerContent: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileHeaderSection: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: screenColors.primary, 
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userPosition: {
    fontSize: 16,
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  subSectionHeader: {
    marginVertical: 12,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
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
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
  },
  // Error styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
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
}); 