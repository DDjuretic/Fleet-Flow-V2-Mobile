import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import Colors from '../../constants/Colors';
import { useGetStandardRoutesQuery } from '../../store/api/supabaseApi';

interface TravelOrderModalProps {
  visible: boolean;
  onClose: () => void;
  onRouteSelected: (route: any) => void;
}

const TravelOrderModal: React.FC<TravelOrderModalProps> = ({
  visible,
  onClose,
  onRouteSelected,
}) => {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const [selectedRoute, setSelectedRoute] = useState<any>(null);

  // Fetch routes
  const { data: routes, isLoading: routesLoading } = useGetStandardRoutesQuery();

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

  const handleCreate = () => {
    const orderData = {
      purpose: purpose.trim(),
      notes: notes.trim(),
      startDate,
    };
    onCreateOrder(orderData);
    onClose();
    // Reset form
    setPurpose('');
    setNotes('');
  };

  const purposes = [
    'Business Meeting',
    'Delivery',
    'Maintenance',
    'Training',
    'Client Visit',
    'Other',
  ];

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
              Select Route
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={screenColors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={[styles.label, { color: screenColors.textSecondary }]}>
              Select Route
            </Text>
            {routesLoading ? (
              <Text style={[styles.loadingText, { color: screenColors.textSecondary }]}>
                Loading routes...
              </Text>
            ) : (
              <View style={styles.routesList}>
                {routes?.map((route: any) => (
                  <TouchableOpacity
                    key={route.route_id}
                    style={[
                      styles.routeOption,
                      {
                        backgroundColor: selectedRoute?.route_id === route.route_id
                          ? screenColors.primary + '20'
                          : 'transparent',
                        borderColor: selectedRoute?.route_id === route.route_id
                          ? screenColors.primary
                          : screenColors.border,
                      },
                    ]}
                    onPress={() => {
                      setSelectedRoute(route);
                      // Auto proceed to next step
                      setTimeout(() => {
                        onRouteSelected(route);
                      }, 500); // Small delay for visual feedback
                    }}
                  >
                    <View style={styles.routeContent}>
                      <Ionicons name="navigate-outline" size={20} color={screenColors.text} />
                      <View style={styles.routeText}>
                        <Text style={[styles.routeTitle, { color: screenColors.text }]}>
                          {route.name}
                        </Text>
                        <Text style={[styles.routeSubtitle, { color: screenColors.textSecondary }]}>
                          {route.start_poi?.name} → {route.end_poi?.name}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Auto proceed - no manual next button needed */}
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
  routesList: {
    gap: 8,
  },
  routeOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  routeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  routeText: {
    flex: 1,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  routeSubtitle: {
    fontSize: 14,
  },
  loadingText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  createButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TravelOrderModal;
