import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';

interface OnboardingCompleteProps {
  userData: any;
  onComplete: () => void;
  onBack: () => void;
}

const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({
  userData,
  onComplete,
  onBack
}) => {
  const [isCompleting, setIsCompleting] = React.useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    await onComplete();
    setIsCompleting(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>🎉 Almost Done!</Text>
          <Text style={styles.subtitle}>Please review your information</Text>
        </View>
        
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Name:</Text>
            <Text style={styles.summaryValue}>
              {userData.firstName} {userData.lastName}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Email:</Text>
            <Text style={styles.summaryValue}>{userData.email}</Text>
          </View>
          
          {userData.department && (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Department:</Text>
              <Text style={styles.summaryValue}>{userData.department}</Text>
            </View>
          )}
          
          {userData.position && (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Position:</Text>
              <Text style={styles.summaryValue}>{userData.position}</Text>
            </View>
          )}
          
          {userData.hasPersonalVehicle && (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Vehicle:</Text>
              <Text style={styles.summaryValue}>
                {userData.vehicleMake} {userData.vehicleModel} ({userData.vehicleYear})
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
              <Text style={styles.completeButtonText}>Complete Setup</Text>
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
    padding: 20,
  },
  contentContainer: {
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
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
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#374151',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#6b7280',
  },
  summaryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    textAlign: 'right',
  },
  footer: {
    marginTop: 30,
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
  completeButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default OnboardingComplete; 