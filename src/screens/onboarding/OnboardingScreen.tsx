import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

export default function OnboardingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onboarding Screen</Text>
      <Text style={styles.subtitle}>Placeholder for onboarding process</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.DARK_BACKGROUND,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
  },
}); 