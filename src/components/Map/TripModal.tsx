import React, { useState, useEffect } from 'react';
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
import { useGetStandardRoutesQuery, useGetVehiclesQuery } from '../../store/api/supabaseApi';

interface TripModalProps {
  visible: boolean;
  onClose: () => void;
  onVehicleSelected: (vehicle: any) => void;
}

const TripModal: React.FC<TripModalProps> = ({
  visible,
  onClose,
  onVehicleSelected,
}) => {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const user = useSelector((state: RootState) => state.auth.user);

  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  // Fetch vehicles only
  const { data: vehicles, isLoading: vehiclesLoading } = useGetVehiclesQuery(
    user?.company_id ? { companyId: user.company_id } : undefined
  );

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

  const handleStartTrip = () => {
    if (!selectedRoute || !selectedVehicle) return;

    const tripData = {
      route: selectedRoute,
      vehicle: selectedVehicle,
    };
    onStartTrip(tripData);
    onClose();
    // Reset selection
    setSelectedRoute(null);
    setSelectedVehicle(null);
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
              Select Vehicle
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={screenColors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={[styles.label, { color: screenColors.textSecondary }]}>
              Select Vehicle
            </Text>
            {vehiclesLoading ? (
              <Text style={[styles.loadingText, { color: screenColors.textSecondary }]}>
                Loading vehicles...
              </Text>
            ) : (
              <View style={styles.options}>
                {vehicles?.map((vehicle: any) => (
                  <TouchableOpacity
                    key={vehicle.vehicle_id}
                    style={[
                      styles.option,
                      {
                        backgroundColor: selectedVehicle?.vehicle_id === vehicle.vehicle_id
                          ? screenColors.primary + '20'
                          : 'transparent',
                        borderColor: selectedVehicle?.vehicle_id === vehicle.vehicle_id
                          ? screenColors.primary
                          : screenColors.border,
                      },
                    ]}
                    onPress={() => setSelectedVehicle(vehicle)}
                  >
                    <View style={styles.optionContent}>
                      <Ionicons name="car-outline" size={20} color={screenColors.text} />
                      <View style={styles.optionText}>
                        <Text style={[styles.optionTitle, { color: screenColors.text }]}>
                          {vehicle.make} {vehicle.model}
                        </Text>
                        <Text style={[styles.optionSubtitle, { color: screenColors.textSecondary }]}>
                          {vehicle.license_plate}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.startButton,
                {
                  backgroundColor: screenColors.primary,
                  opacity: selectedVehicle ? 1 : 0.5,
                },
              ]}
              onPress={() => {
                if (selectedVehicle) {
                  onVehicleSelected(selectedVehicle);
                }
              }}
              disabled={!selectedVehicle}
            >
              <Text style={styles.startButtonText}>Next: Route</Text>
            </TouchableOpacity>
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
    maxHeight: '70%',
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  loadingText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  options: {
    gap: 8,
  },
  option: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionSubtitle: {
    fontSize: 14,
  },
  startButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TripModal;
