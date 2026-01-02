import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch } from 'react-native';

interface OnboardingVehicleInfoProps {
  userData: any;
  onSave: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const OnboardingVehicleInfo: React.FC<OnboardingVehicleInfoProps> = ({
  userData,
  onSave,
  onNext,
  onBack
}) => {
  const [hasPersonalVehicle, setHasPersonalVehicle] = useState(userData.hasPersonalVehicle || false);
  const [vehicleMake, setVehicleMake] = useState(userData.vehicleMake || '');
  const [vehicleModel, setVehicleModel] = useState(userData.vehicleModel || '');
  const [vehicleYear, setVehicleYear] = useState(userData.vehicleYear || '');
  const [vehicleColor, setVehicleColor] = useState(userData.vehicleColor || '');
  const [vehicleLicensePlate, setVehicleLicensePlate] = useState(userData.vehicleLicensePlate || '');
  const [vehicleFuelType, setVehicleFuelType] = useState(userData.vehicleFuelType || '');
  const [currentMileage, setCurrentMileage] = useState(userData.currentMileage || '');

  const handleSubmit = () => {
    onSave({
      hasPersonalVehicle,
      vehicleMake: vehicleMake.trim(),
      vehicleModel: vehicleModel.trim(),
      vehicleYear: vehicleYear.trim(),
      vehicleColor: vehicleColor.trim(),
      vehicleLicensePlate: vehicleLicensePlate.trim(),
      vehicleFuelType: vehicleFuelType.trim(),
      currentMileage: currentMileage.trim(),
    });
    onNext();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Vehicle Information</Text>
          <Text style={styles.subtitle}>Do you have a personal vehicle? (Optional)</Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.switchContainer}>
            <Text style={styles.label}>I have a personal vehicle</Text>
            <Switch
              value={hasPersonalVehicle}
              onValueChange={setHasPersonalVehicle}
              trackColor={{ false: '#767577', true: '#2563eb' }}
              thumbColor={hasPersonalVehicle ? '#ffffff' : '#f4f3f4'}
            />
          </View>
          
          {hasPersonalVehicle && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Vehicle Make</Text>
                <TextInput
                  style={styles.input}
                  value={vehicleMake}
                  onChangeText={setVehicleMake}
                  placeholder="e.g., Toyota, BMW, Ford"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Vehicle Model</Text>
                <TextInput
                  style={styles.input}
                  value={vehicleModel}
                  onChangeText={setVehicleModel}
                  placeholder="e.g., Camry, X5, Focus"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Year</Text>
                <TextInput
                  style={styles.input}
                  value={vehicleYear}
                  onChangeText={setVehicleYear}
                  placeholder="e.g., 2020"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Current Mileage (km)</Text>
                <TextInput
                  style={styles.input}
                  value={currentMileage}
                  onChangeText={setCurrentMileage}
                  placeholder="e.g., 50000"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Color</Text>
                <TextInput
                  style={styles.input}
                  value={vehicleColor}
                  onChangeText={setVehicleColor}
                  placeholder="e.g., White, Black, Blue"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>License Plate</Text>
                <TextInput
                  style={styles.input}
                  value={vehicleLicensePlate}
                  onChangeText={setVehicleLicensePlate}
                  placeholder="e.g., PG 123-ABC"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Fuel Type</Text>
                <TextInput
                  style={styles.input}
                  value={vehicleFuelType}
                  onChangeText={setVehicleFuelType}
                  placeholder="e.g., Petrol, Diesel, Electric, Hybrid"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </>
          )}
        </View>
        
        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
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
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#374151',
  },
  footer: {
    marginTop: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  nextButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default OnboardingVehicleInfo; 