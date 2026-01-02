import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import Colors from '../../constants/Colors';

interface PurposeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPurpose: (purpose: string) => void;
}

const PurposeModal: React.FC<PurposeModalProps> = ({
  visible,
  onClose,
  onSelectPurpose,
}) => {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    card: Colors.DARK.card,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    primary: Colors.DARK.primary,
    border: Colors.DARK.border,
  } : {
    background: Colors.LIGHT.background,
    card: Colors.LIGHT.card,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    primary: Colors.LIGHT.primary,
    border: Colors.LIGHT.border,
  };

  const purposes = [
    {
      key: 'business_meeting',
      label: 'Business Meeting',
      icon: 'business-outline',
      description: 'Client meetings, negotiations, presentations',
    },
    {
      key: 'delivery',
      label: 'Delivery',
      icon: 'cube-outline',
      description: 'Package delivery, goods transportation',
    },
    {
      key: 'maintenance',
      label: 'Maintenance',
      icon: 'construct-outline',
      description: 'Equipment maintenance, repairs, service calls',
    },
    {
      key: 'training',
      label: 'Training',
      icon: 'school-outline',
      description: 'Training sessions, workshops, courses',
    },
    {
      key: 'client_visit',
      label: 'Client Visit',
      icon: 'people-outline',
      description: 'Client site visits, inspections, consultations',
    },
    {
      key: 'inspection',
      label: 'Inspection',
      icon: 'search-outline',
      description: 'Quality control, safety inspections',
    },
    {
      key: 'emergency',
      label: 'Emergency',
      icon: 'warning-outline',
      description: 'Emergency response, urgent repairs',
    },
    {
      key: 'other',
      label: 'Other',
      icon: 'ellipsis-horizontal-outline',
      description: 'Other business purposes',
    },
  ];

  const handleSelectPurpose = (purpose: string) => {
    // Auto proceed to start trip
    setTimeout(() => {
      onSelectPurpose(purpose);
      onClose();
    }, 300); // Small delay for visual feedback
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: screenColors.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: screenColors.text }]}>
              Select Trip Purpose
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={screenColors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={[styles.subtitle, { color: screenColors.textSecondary }]}>
              Choose the main purpose of your trip
            </Text>

            <View style={styles.purposesGrid}>
              {purposes.map((purpose) => (
                <TouchableOpacity
                  key={purpose.key}
                  style={[styles.purposeCard, { borderColor: screenColors.border }]}
                  onPress={() => handleSelectPurpose(purpose.key)}
                >
                  <View style={styles.purposeIcon}>
                    <Ionicons
                      name={purpose.icon as any}
                      size={24}
                      color={screenColors.primary}
                    />
                  </View>
                  <Text style={[styles.purposeLabel, { color: screenColors.text }]}>
                    {purpose.label}
                  </Text>
                  <Text style={[styles.purposeDescription, { color: screenColors.textSecondary }]}>
                    {purpose.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  purposesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  purposeCard: {
    width: '48%',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  purposeIcon: {
    marginBottom: 8,
  },
  purposeLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  purposeDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default PurposeModal;
