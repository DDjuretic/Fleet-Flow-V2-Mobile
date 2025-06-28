import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface OnboardingPhotoInfoProps {
  userData: { avatarUrl: string };
  onSave: (data: { avatarUrl: string }) => void;
  onNext: () => void;
  onBack: () => void;
}

const OnboardingPhotoInfo: React.FC<OnboardingPhotoInfoProps> = ({
  userData,
  onSave,
  onNext,
  onBack
}) => {
  const handleSkip = () => {
    onSave({ avatarUrl: '' });
    onNext();
  };

  const handleSelectPhoto = () => {
    // TODO: Implementation of selecting a photo
    // For now, just show alert that it's not implemented
    alert('Photo selection will be implemented in the future. Please click Skip for now.');
  };

  const handleContinue = () => {
    // Continue with current avatar (empty or selected)
    onSave({ avatarUrl: userData.avatarUrl || '' });
    onNext();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile Photo</Text>
          <Text style={styles.subtitle}>Add a profile photo (Optional)</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.photoContainer}>
            <View style={styles.photoPlaceholder}>
              <Text style={styles.placeholderText}>📷</Text>
              <Text style={styles.placeholderLabel}>Tap to add photo</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.uploadButton} onPress={handleSelectPhoto}>
            <Text style={styles.uploadButtonText}>Choose Photo</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.nextButton} onPress={handleContinue}>
            <Text style={styles.nextButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 40,
  },
  placeholderLabel: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  backButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  skipButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6b7280',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  nextButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  uploadButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default OnboardingPhotoInfo; 