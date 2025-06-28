import React from 'react';
import { View, StyleSheet } from 'react-native';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps
}) => {
  // Create an array of step indicators
  const renderStepIndicators = () => {
    const indicators = [];
    
    for (let i = 1; i <= totalSteps; i++) {
      const isActive = i <= currentStep;
      const isLast = i === totalSteps;
      
      // Add step dot
      indicators.push(
        <View 
          key={`dot-${i}`}
          style={[
            styles.stepDot,
            isActive 
              ? { backgroundColor: '#2563eb' } 
              : { backgroundColor: '#e5e7eb' }
          ]}
        />
      );
      
      // Add connecting line between dots (except after the last dot)
      if (!isLast) {
        indicators.push(
          <View 
            key={`line-${i}`}
            style={[
              styles.stepLine,
              { 
                backgroundColor: i < currentStep 
                  ? '#2563eb' 
                  : '#e5e7eb' 
              }
            ]}
          />
        );
      }
    }
    
    return indicators;
  };
  
  return (
    <View style={styles.container}>
      {renderStepIndicators()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 20,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  stepLine: {
    height: 2,
    flex: 1,
    marginHorizontal: 5,
  }
});

export default OnboardingProgress; 