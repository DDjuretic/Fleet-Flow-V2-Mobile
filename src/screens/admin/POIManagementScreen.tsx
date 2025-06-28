import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import Colors from '../../constants/Colors';
import WebMapView from '../../components/Map/WebMapView';
import {
  useGetPoisQuery,
  useCreatePoiMutation,
  useUpdatePoiMutation,
  useDeletePoiMutation,
  DbPoi
} from '../../store/api/supabaseApi';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { geocodeAddress, reverseGeocode, validateCoordinates } from '../../utils/geocodingUtils';
import { showSuccessToast, showErrorToast, showWarningToast } from '../../utils/toastUtils';

interface POIFormData {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  category: string;
  contact_info: string;
  notes: string;
}

interface MapLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

// Geocoding functions are now imported from utils

const POIManagementScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPoi, setSelectedPoi] = useState<DbPoi | null>(null);
  const [searchAddress, setSearchAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [modalError, setModalError] = useState<string>('');

  const [formData, setFormData] = useState<POIFormData>({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    category: '',
    contact_info: '',
    notes: ''
  });

  // New state for map functionality
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapLocation, setMapLocation] = useState<MapLocation | null>(null);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  const { data: pois, isLoading, error, refetch } = useGetPoisQuery();
  const [createPoi, { isLoading: isCreating }] = useCreatePoiMutation();
  const [updatePoi, { isLoading: isUpdating }] = useUpdatePoiMutation();
  const [deletePoi, { isLoading: isDeleting }] = useDeletePoiMutation();

  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    card: Colors.DARK.card,
    border: Colors.DARK.border,
    primary: Colors.DARK.primary,
    danger: Colors.DANGER,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    white: '#FFFFFF',
  } : {
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    card: Colors.LIGHT.card,
    border: Colors.LIGHT.border,
    primary: Colors.LIGHT.primary,
    danger: Colors.DANGER,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    white: '#FFFFFF',
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      category: '',
      contact_info: '',
      notes: ''
    });
    setMapLocation(null);
    setSearchAddress('');
    setModalError('');
  };

  // Handle address search
  const handleAddressSearch = async () => {
    if (!searchAddress.trim()) return;
    
    setIsSearching(true);
    try {
      const result = await geocodeAddress(searchAddress.trim());
      if (result) {
        setMapLocation(result);
        setFormData(prev => ({
          ...prev,
          latitude: result.latitude.toString(),
          longitude: result.longitude.toString(),
          address: result.address || prev.address
        }));
        showSuccessToast('poi.address_found_success', 'poi.coordinates_updated_for_poi', {
          duration: 4000
        });
      } else {
        showErrorToast('poi.address_not_found', 'poi.try_different_address', {
          duration: 3500
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);
      showErrorToast('poi.search_error', 'poi.check_connection_try_again');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle map location selection
  const handleMapPress = async (coordinate: [number, number]) => {
    const [longitude, latitude] = coordinate;
    
    setIsReverseGeocoding(true);
    try {
      const address = await reverseGeocode(latitude, longitude);
      
      const location: MapLocation = {
        latitude,
        longitude,
        address: address || undefined
      };
      
      setMapLocation(location);
      setFormData(prev => ({
        ...prev,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        address: address || prev.address
      }));
      
      showSuccessToast('poi.location_selected_success', 'poi.poi_coordinates_updated', {
        duration: 3500
      });
    } catch (error) {
      console.error('Error with reverse geocoding:', error);
      // Still set the location even if reverse geocoding fails
      setMapLocation({
        latitude,
        longitude
      });
      setFormData(prev => ({
        ...prev,
        latitude: latitude.toString(),
        longitude: longitude.toString()
      }));
      showSuccessToast('poi.coordinates_set', 'poi.manual_address_entry_needed');
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Open map modal
  const handleOpenMap = () => {
    // If we have coordinates, use them as initial location
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      setMapLocation({
        latitude: lat,
        longitude: lng,
        address: formData.address || undefined
      });
    }
    
    setShowMapModal(true);
  };

  const handleAdd = () => {
    resetForm();
    setModalError('');
    setShowAddModal(true);
  };

  const handleEdit = (poi: DbPoi) => {
    setFormData({
      name: poi.name,
      address: poi.address || '',
      latitude: poi.latitude.toString(),
      longitude: poi.longitude.toString(),
      category: poi.category || '',
      contact_info: poi.contact_info || '',
      notes: poi.notes || ''
    });
    setModalError('');
    setSelectedPoi(poi);
    setShowEditModal(true);
  };

  const handleDelete = async (poi: DbPoi) => {
    try {
      // Check if POI is used in routes
      const { data: routes } = await supabase
        .from('standard_routes')
        .select('route_id, route_name')
        .or(`start_poi_id.eq.${poi.poi_id},end_poi_id.eq.${poi.poi_id}`);

      if (routes && routes.length > 0) {
        const routeNames = routes.map(r => r.route_name).join(', ');
        showWarningToast('poi.cannot_delete_poi', 'poi.poi_used_in_routes_warning', {
          duration: 5000
        });
        return;
      }

      // If not used, proceed with deletion directly
      try {
        await deletePoi(poi.poi_id).unwrap();
        showSuccessToast('poi.poi_deleted_success', 'poi.poi_removed_from_system', {
          duration: 3000
        });
      } catch (error) {
        console.error('Error deleting POI:', error);
        showErrorToast('poi.delete_poi_failed', 'poi.try_delete_again_later');
      }
    } catch (error) {
      console.error('Error checking POI usage:', error);
      showErrorToast('poi.check_usage_error', 'poi.cannot_verify_poi_usage');
    }
  };

  const handleSave = async () => {
    console.log('POI Save: Checking name:', formData.name.trim());
    setModalError('');
    
    if (!formData.name.trim()) {
      console.log('POI Save: Name is empty, showing modal error');
      setModalError(t('poi.please_enter_poi_name', 'Please enter POI name'));
      return;
    }

    if (!validateCoordinates(formData.latitude, formData.longitude)) {
      console.log('POI Save: Invalid coordinates, showing modal error');
      setModalError(t('poi.please_enter_valid_coordinates', 'Please enter valid coordinates'));
      return;
    }

    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    try {
      const poiData = {
        name: formData.name.trim(),
        address: formData.address.trim() || null,
        latitude: lat,
        longitude: lng,
        category: formData.category.trim() || null,
        contact_info: formData.contact_info.trim() || null,
        notes: formData.notes.trim() || null
      };

      if (selectedPoi) {
        await updatePoi({
          poi_id: selectedPoi.poi_id,
          ...poiData
        }).unwrap();
        showSuccessToast('poi.poi_updated_success', 'poi.changes_saved_successfully', {
          duration: 3000
        });
        setShowEditModal(false);
      } else {
        await createPoi(poiData).unwrap();
        showSuccessToast('poi.poi_created_success', 'poi.new_location_added_to_system', {
          duration: 3500
        });
        setShowAddModal(false);
      }
      
      resetForm();
      setSelectedPoi(null);
    } catch (error) {
      console.error('Error saving POI:', error);
      setModalError(t('poi.check_connection_try_again', 'Check connection and try again'));
    }
  };

  const renderPOICard = ({ item }: { item: DbPoi }) => (
    <View style={[styles.card, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Text style={[styles.cardTitle, { color: screenColors.text }]}>{item.name}</Text>
          {item.category && (
            <View style={[styles.categoryBadge, { backgroundColor: screenColors.primary + '20' }]}>
              <Text style={[styles.categoryText, { color: screenColors.primary }]}>{item.category}</Text>
            </View>
          )}
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: screenColors.primary + '20' }]}
            onPress={() => handleEdit(item)}
          >
            <Ionicons name="pencil" size={16} color={screenColors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: screenColors.danger + '20' }]}
            onPress={() => handleDelete(item)}
            disabled={isDeleting}
          >
            <Ionicons name="trash" size={16} color={screenColors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardBody}>
        {item.address && (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color={screenColors.textSecondary} />
            <Text style={[styles.infoText, { color: screenColors.textSecondary }]}>{item.address}</Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Ionicons name="map-outline" size={16} color={screenColors.textSecondary} />
          <Text style={[styles.infoText, { color: screenColors.textSecondary }]}>
            {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
          </Text>
        </View>

        {item.contact_info && (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color={screenColors.textSecondary} />
            <Text style={[styles.infoText, { color: screenColors.textSecondary }]}>{item.contact_info}</Text>
          </View>
        )}

        {item.notes && (
          <View style={styles.infoRow}>
            <Ionicons name="document-text-outline" size={16} color={screenColors.textSecondary} />
            <Text style={[styles.infoText, { color: screenColors.textSecondary }]}>{item.notes}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderFormModal = (visible: boolean, onClose: () => void, title: string) => (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: screenColors.background }]}>
        <KeyboardAvoidingView 
          style={styles.modalContent} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[styles.modalHeader, { borderBottomColor: screenColors.border }]}>
            <Text style={[styles.modalTitle, { color: screenColors.text }]}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={screenColors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>{t('poi_name', 'Name')} *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.card, 
                  borderColor: screenColors.border,
                  color: screenColors.text 
                }]}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder={t('enter_poi_name', 'Enter POI name')}
                placeholderTextColor={screenColors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>{t('poi_address', 'Address')}</Text>
              <View style={styles.addressContainer}>
                <TextInput
                  style={[styles.input, styles.addressInput, { 
                    backgroundColor: screenColors.card, 
                    borderColor: screenColors.border,
                    color: screenColors.text 
                  }]}
                  value={formData.address}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
                  placeholder={t('enter_poi_address', 'Enter address')}
                  placeholderTextColor={screenColors.textSecondary}
                  multiline
                  numberOfLines={2}
                />
                <TouchableOpacity
                  style={[styles.mapButton, { backgroundColor: screenColors.primary }]}
                  onPress={handleOpenMap}
                >
                  <Ionicons name="map" size={20} color={screenColors.white} />
                </TouchableOpacity>
              </View>
              
              {/* Address Search */}
              <View style={styles.searchContainer}>
                <TextInput
                  style={[styles.input, styles.searchInput, { 
                    backgroundColor: screenColors.card, 
                    borderColor: screenColors.border,
                    color: screenColors.text 
                  }]}
                  value={searchAddress}
                  onChangeText={setSearchAddress}
                  placeholder={t('search_address_to_autofill', 'Search address to auto-fill coordinates')}
                  placeholderTextColor={screenColors.textSecondary}
                  onSubmitEditing={handleAddressSearch}
                />
                <TouchableOpacity
                  style={[styles.searchButton, { backgroundColor: screenColors.success }]}
                  onPress={handleAddressSearch}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <ActivityIndicator size="small" color={screenColors.white} />
                  ) : (
                    <Ionicons name="search" size={16} color={screenColors.white} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.label, { color: screenColors.text }]}>{t('poi_latitude', 'Latitude')} *</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: screenColors.card, 
                    borderColor: screenColors.border,
                    color: screenColors.text 
                  }]}
                  value={formData.latitude}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, latitude: text }))}
                  placeholder="44.8176"
                  placeholderTextColor={screenColors.textSecondary}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.label, { color: screenColors.text }]}>{t('poi_longitude', 'Longitude')} *</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: screenColors.card, 
                    borderColor: screenColors.border,
                    color: screenColors.text 
                  }]}
                  value={formData.longitude}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, longitude: text }))}
                  placeholder="20.4633"
                  placeholderTextColor={screenColors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>{t('poi_category', 'Category')}</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.card, 
                  borderColor: screenColors.border,
                  color: screenColors.text 
                }]}
                value={formData.category}
                onChangeText={(text) => setFormData(prev => ({ ...prev, category: text }))}
                placeholder={t('enter_category', 'e.g. Office, Warehouse, Client')}
                placeholderTextColor={screenColors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>{t('poi_contact_info', 'Contact Info')}</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.card, 
                  borderColor: screenColors.border,
                  color: screenColors.text 
                }]}
                value={formData.contact_info}
                onChangeText={(text) => setFormData(prev => ({ ...prev, contact_info: text }))}
                placeholder={t('enter_contact_info', 'Phone, email, hours...')}
                placeholderTextColor={screenColors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>{t('poi_notes', 'Notes')}</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.card, 
                  borderColor: screenColors.border,
                  color: screenColors.text 
                }]}
                value={formData.notes}
                onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                placeholder={t('additional_notes', 'Additional notes...')}
                placeholderTextColor={screenColors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>

          {/* Error Message */}
          {modalError ? (
            <View style={[styles.errorContainer, { backgroundColor: Colors.DANGER + '10', borderColor: Colors.DANGER }]}>
              <Ionicons name="alert-circle" size={20} color={Colors.DANGER} />
              <Text style={[styles.errorMessage, { color: Colors.DANGER }]}>{modalError}</Text>
            </View>
          ) : null}

          <View style={[styles.modalActions, { borderTopColor: screenColors.border }]}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { backgroundColor: screenColors.border }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: screenColors.text }]}>{t('common.cancel', 'Cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton, { backgroundColor: screenColors.primary }]}
              onPress={handleSave}
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={[styles.buttonText, { color: '#fff' }]}>
                  {selectedPoi ? t('update') : 'Create'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={screenColors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: screenColors.text }]}>POI Management</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={screenColors.primary} />
                          <Text style={[styles.loadingText, { color: screenColors.textSecondary }]}>{t('common.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={screenColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: screenColors.text }]}>POI Management</Text>
        <TouchableOpacity onPress={handleAdd}>
          <Ionicons name="add" size={24} color={screenColors.primary} />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={screenColors.danger} />
                          <Text style={[styles.errorText, { color: screenColors.danger }]}>{t('common.error')}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: screenColors.primary }]}
            onPress={refetch}
          >
            <Text style={[styles.buttonText, { color: '#fff' }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pois || []}
          renderItem={renderPOICard}
          keyExtractor={(item) => item.poi_id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor={screenColors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="location-outline" size={64} color={screenColors.textSecondary} />
              <Text style={[styles.emptyText, { color: screenColors.textSecondary }]}>
                                    {t('no_items_found')}
              </Text>
              <Text style={[styles.emptySubtext, { color: screenColors.textSecondary }]}>
                                    {t('add_first_poi', 'Tap the + button to add your first Point of Interest')}
              </Text>
            </View>
          }
        />
      )}

      {renderFormModal(showAddModal, () => setShowAddModal(false), t('add_new_poi', 'Add New POI'))}
      {renderFormModal(showEditModal, () => setShowEditModal(false), t('edit_poi', 'Edit POI'))}
      
      {/* Map Modal */}
      <Modal
        visible={showMapModal}
        animationType="slide"
        statusBarTranslucent
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: screenColors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: screenColors.border }]}>
            <TouchableOpacity onPress={() => setShowMapModal(false)}>
              <Ionicons name="close" size={24} color={screenColors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: screenColors.text }]}>{t('select_on_map')}</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <View style={{ flex: 1 }}>
            <WebMapView
              style={{ flex: 1 }}
              showUserLocation={true}
              centerCoordinate={mapLocation ? [mapLocation.longitude, mapLocation.latitude] : undefined}
              zoomLevel={mapLocation ? 15 : 10}
              markers={mapLocation ? [{
                id: 'selected-location',
                coordinate: [mapLocation.longitude, mapLocation.latitude],
                title: 'Selected Location',
                description: mapLocation.address || `${mapLocation.latitude.toFixed(6)}, ${mapLocation.longitude.toFixed(6)}`
              }] : []}
              onMapPress={handleMapPress}
            />
            
            {isReverseGeocoding && (
              <View style={{
                position: 'absolute',
                top: 20,
                left: 20,
                right: 20,
                backgroundColor: screenColors.card,
                padding: 12,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}>
                <ActivityIndicator size="small" color={screenColors.primary} />
                <Text style={[{ marginLeft: 8, color: screenColors.text }]}>{t('getting_address')}</Text>
              </View>
            )}
          </View>
          
          <View style={[styles.modalActions, { borderTopColor: screenColors.border }]}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { backgroundColor: screenColors.textSecondary }]}
              onPress={() => setShowMapModal(false)}
            >
              <Text style={[styles.buttonText, { color: screenColors.white }]}>{t('close_map')}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  listContainer: {
    padding: 20,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    marginRight: 6,
  },
  saveButton: {
    marginLeft: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // New styles for map functionality
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  addressInput: {
    flex: 1,
  },
  mapButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  errorMessage: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});

export default POIManagementScreen; 