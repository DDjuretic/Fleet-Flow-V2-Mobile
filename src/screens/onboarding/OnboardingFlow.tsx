import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, ImageBackground } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useTranslation } from 'react-i18next';
import { showSuccessToast, showErrorToast, showWarningToast } from '../../utils/toastUtils';

// Import onboarding screens
import {
  OnboardingPersonalInfo,
  OnboardingContactInfo,
  OnboardingWorkInfo,
  OnboardingVehicleInfo,
  OnboardingPhotoInfo,
  OnboardingComplete
} from './index';

// Progress indicator component
import OnboardingProgress from '../../components/OnboardingProgress';

// Define the structure of user data for onboarding
interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  company: string;
  department: string;
  position: string;
  isDriver: boolean;
  driverLicenseCategory: string;
  hasPersonalVehicle: boolean;
  vehicleType: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleColor: string;
  vehicleLicensePlate: string;
  vehicleFuelType: string;
  vehicleFuelConsumption: string;
  vehicleSeats: string;
  profileImageUrl: string;
  avatarUrl: string;
}

const OnboardingFlow: React.FC = () => {
  const { user, loading, setLoading } = useAuth();
  const navigation = useNavigation<NavigationProp<any>>();
  const { t } = useTranslation();

  // State for user data collected across all steps
  const [userData, setUserData] = useState<UserData>({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    country: '',
    company: 'Fleet Flow', // Default value
    department: '',
    position: '',
    isDriver: false,
    driverLicenseCategory: '',
    hasPersonalVehicle: false,
    vehicleType: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleColor: '',
    vehicleLicensePlate: '',
    vehicleFuelType: '',
    vehicleFuelConsumption: '',
    vehicleSeats: '',
    profileImageUrl: '',
    avatarUrl: '',
  });
  
  // Current step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6; // Total number of steps including completion screen
  
  // Handle navigation between steps
  const goToNextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);
  
  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);
  
  // Handle data updates from each screen
  const updateUserData = useCallback((newData: Partial<typeof userData>) => {
    setUserData(prevData => ({
      ...prevData,
      ...newData
    }));
  }, []);
  
  const getOrCreateCompany = async (companyName: string): Promise<string | null> => {
    try {
      // 1. Check if company exists
      let { data: company, error: fetchError } = await supabase
        .from('companies')
        .select('company_id')
        .eq('name', companyName)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = No rows found
        console.error('Error fetching company:', fetchError);
        return null;
      }
      
      // 2. If it exists, return its ID
      if (company) {
        return company.company_id;
      }

      // 3. If not, create it
      const { data: newCompany, error: createError } = await supabase
        .from('companies')
        .insert({ name: companyName, updated_at: new Date().toISOString() })
        .select('company_id')
        .single();

      if (createError) {
        console.error('Error creating company:', createError);
        return null;
      }

      return newCompany?.company_id || null;

    } catch (e) {
      console.error('Unexpected error in getOrCreateCompany:', e);
      return null;
    }
  };
  
  // Handle completion of onboarding
  const handleComplete = useCallback(async () => {
    try {
      if (!user?.user_id) {
        showErrorToast('Error', 'User not logged in. Please sign in again.');
        return;
      }
  
      console.log('💾 [Onboarding] Preparing to save user data:', userData);
  
      // Consolidate all user profile data into one update object for public.users
      const userProfileUpdate = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone_number: userData.phone,
        home_address: userData.address,
        home_city: userData.city,
        home_country: userData.country,
        position: userData.position,
        driving_license_category: userData.driverLicenseCategory,
        has_private_vehicle: userData.hasPersonalVehicle,
        avatar_url: userData.avatarUrl || userData.profileImageUrl,
        onboarding_status: 'completed', // Set onboarding status to completed
        updated_at: new Date().toISOString()
      };
  
      console.log('💾 [Onboarding] Sending user profile update to public.users:', userProfileUpdate);
  
      const { error: userUpdateError } = await supabase
        .from('users')
        .update(userProfileUpdate)
        .eq('user_id', user.user_id);
      
      if (userUpdateError) {
        console.error('❌ [Onboarding] Error updating user profile in public.users:', userUpdateError);
        showErrorToast('Error', 'Failed to update user profile.');
        return;
      }
      
      console.log('✅ [Onboarding] User profile updated successfully in public.users.');
  
      // If user has personal vehicle, add it to the database
      if (userData.hasPersonalVehicle) {
        console.log('🚗 [Onboarding] Creating personal vehicle for user...');
        
        // Use the company_id from the authenticated user context
        if (!user.company_id) {
            showErrorToast('Error', 'Cannot add vehicle without a company ID.');
            return;
        }

        const { data: vehicleTypes, error: vehicleTypesError } = await supabase
          .from('vehicle_types')
          .select('vehicle_type_id')
          .eq('name', 'Car')
          .limit(1)
          .single();

        console.log('🚗 Vehicle types query result:', vehicleTypes, vehicleTypesError);

        const { data: vehicleStatuses, error: vehicleStatusesError } = await supabase
          .from('vehicle_status')
          .select('vehicle_status_id')
          .eq('name', 'Available')
          .limit(1)
          .single();

        console.log('🚗 Vehicle statuses query result:', vehicleStatuses, vehicleStatusesError);

        const { data: fuelTypes, error: fuelTypesError } = await supabase
          .from('fuel_types')
          .select('fuel_type_id')
          .eq('name', userData.vehicleFuelType || 'Petrol')
          .limit(1)
          .single();

        console.log('🚗 Fuel types query result:', fuelTypes, fuelTypesError);

        if (!vehicleTypes || !vehicleStatuses) {
          console.error('❌ Missing required vehicle type or status data');
          showErrorToast('Error', 'Failed to add vehicle - missing configuration data.');
          return;
        }

        const vehicleData = {
          company_id: user.company_id, // Use company_id from auth context
          vehicle_type_id: vehicleTypes.vehicle_type_id,
          vehicle_status_id: vehicleStatuses.vehicle_status_id,
          fuel_type_id: fuelTypes?.fuel_type_id || null, // Handle potentially null fuel type
          make: userData.vehicleMake,
          model: userData.vehicleModel,
          year: userData.vehicleYear ? parseInt(userData.vehicleYear, 10) : undefined,
          license_plate: userData.vehicleLicensePlate,
          color: userData.vehicleColor,
          engine_type: userData.vehicleFuelType,
          is_private_vehicle: true,
          private_owner_id: user.user_id,
          // Default values for required fields
          current_mileage: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: newVehicle, error: vehicleError } = await supabase
          .from('vehicles')
          .insert([vehicleData])
          .select('vehicle_id')
          .single();
        
        if (vehicleError || !newVehicle) {
          console.error('Error creating vehicle:', vehicleError);
          showErrorToast('Error', 'Failed to add vehicle.');
          return;
        }

        // Create vehicle assignment to link vehicle to user
        const assignmentData = {
          vehicle_id: newVehicle.vehicle_id,
          user_id: user.user_id,
          assignment_type: 'default_driver',
          start_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: assignmentError } = await supabase
          .from('vehicle_assignments')
          .insert([assignmentData]);

        if (assignmentError) {
          console.error('Error creating vehicle assignment:', assignmentError);
          showWarningToast('Warning', 'Vehicle was created but assignment failed.');
        }
      }

      showSuccessToast('Success', 'Your profile has been successfully created!');
      
      // Navigate to Main (TabNavigator) - the AuthContext will handle state updates
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (e) {
      console.error('❌ [Onboarding] Unexpected error in handleComplete:', e);
      showErrorToast(t('common.error'), 'An unexpected error occurred during onboarding completion.');
    }
  }, [user, userData, t, goToNextStep]);
  
  // Handle photo data update
  const handlePhotoUpdate = (uri: string) => {
    updateUserData({ profileImageUrl: uri, avatarUrl: uri });
    goToNextStep();
  };
  
  // Step titles
  const stepTitles = [
    'Personal Info',        // Step 1
    'Contact Information',  // Step 2
    'Work Information',     // Step 3
    'Vehicle Information',  // Step 4
    'Profile Photo',        // Step 5
    'Complete'              // Step 6
  ];
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingPersonalInfo
            userData={userData}
            onSave={updateUserData}
            onNext={goToNextStep}
          />
        );
      case 2:
        return (
          <OnboardingContactInfo
            userData={userData}
            onSave={updateUserData}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 3:
        return (
          <OnboardingWorkInfo
            userData={userData}
            onSave={updateUserData}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 4:
        return (
          <OnboardingVehicleInfo
            userData={userData}
            onSave={updateUserData}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 5:
        return (
          <OnboardingPhotoInfo
            userData={{ avatarUrl: userData.avatarUrl || userData.profileImageUrl || '' }}
            onSave={({ avatarUrl }) => updateUserData({ avatarUrl, profileImageUrl: avatarUrl })}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 6:
        return (
          <OnboardingComplete
            userData={userData}
            onComplete={handleComplete}
            onBack={goToPreviousStep}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <ImageBackground
      source={require('../../../assets/login.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <OnboardingProgress 
            currentStep={currentStep} 
            totalSteps={totalSteps - 1} // -1 because we don't count completion screen as a progress step
          />
        </View>
        
        {/* Current step content */}
        {renderStep()}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Lighter overlay for onboarding
  },
  container: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
});

export default OnboardingFlow; 