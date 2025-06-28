import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch } from 'react-native';

interface OnboardingWorkInfoProps {
  userData: any;
  onSave: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const OnboardingWorkInfo: React.FC<OnboardingWorkInfoProps> = ({
  userData,
  onSave,
  onNext,
  onBack
}) => {
  const [department, setDepartment] = useState(userData.department || '');
  const [position, setPosition] = useState(userData.position || '');
  const [isDriver, setIsDriver] = useState(userData.isDriver || false);
  const [driverLicenseCategory, setDriverLicenseCategory] = useState(userData.driverLicenseCategory || '');

  const handleSubmit = () => {
    onSave({
      department: department.trim(),
      position: position.trim(),
      isDriver,
      driverLicenseCategory: driverLicenseCategory.trim()
    });
    onNext();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Work Information</Text>
          <Text style={styles.subtitle}>Tell us about your role and driving license</Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Department</Text>
            <TextInput
              style={styles.input}
              value={department}
              onChangeText={setDepartment}
              placeholder="Enter your department"
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Position</Text>
            <TextInput
              style={styles.input}
              value={position}
              onChangeText={setPosition}
              placeholder="Enter your position"
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Are you a driver?</Text>
            <Switch
              value={isDriver}
              onValueChange={setIsDriver}
              trackColor={{ false: '#767577', true: '#2563eb' }}
              thumbColor={isDriver ? '#ffffff' : '#f4f3f4'}
            />
          </View>
          
          {isDriver && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Driver's License Category</Text>
              <TextInput
                style={styles.input}
                value={driverLicenseCategory}
                onChangeText={setDriverLicenseCategory}
                placeholder="Enter license category (e.g., B, C, D)"
                placeholderTextColor="#9ca3af"
              />
            </View>
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

export default OnboardingWorkInfo; 