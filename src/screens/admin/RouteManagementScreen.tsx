import React, { useState } from 'react';
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
import { showCustomToast } from '../../utils/toastUtils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import Colors from '../../constants/Colors';
import {
  useGetStandardRoutesQuery,
  useGetPoisQuery,
  useCreateStandardRouteMutation,
  useUpdateStandardRouteMutation,
  useDeleteStandardRouteMutation,
  DbStandardRoute,
  DbPoi
} from '../../store/api/supabaseApi';
import { useTranslation } from 'react-i18next';

interface RouteFormData {
  name: string;
  start_poi_id: string;
  end_poi_id: string;
  start_address_manual: string;
  end_address_manual: string;
  predefined_distance_km: string;
  estimated_duration_min: string;
  predefined_cost: string;
  cost_calculation_formula: string;
  notes: string;
}

interface POISelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (poi: DbPoi) => void;
  title: string;
  selectedPoiId?: string;
}

const POISelectorModal: React.FC<POISelectorModalProps> = ({ 
  visible, 
  onClose, 
  onSelect, 
  title, 
  selectedPoiId 
}) => {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const { data: pois, isLoading } = useGetPoisQuery();

  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    card: Colors.DARK.card,
    border: Colors.DARK.border,
    primary: Colors.DARK.primary,
  } : {
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    card: Colors.LIGHT.card,
    border: Colors.LIGHT.border,
    primary: Colors.LIGHT.primary,
  };

  const renderPOI = ({ item }: { item: DbPoi }) => (
    <TouchableOpacity
      style={[
        styles.poiItem, 
        { 
          backgroundColor: selectedPoiId === item.poi_id ? screenColors.primary + '20' : screenColors.card,
          borderColor: selectedPoiId === item.poi_id ? screenColors.primary : screenColors.border 
        }
      ]}
      onPress={() => {
        onSelect(item);
        onClose();
      }}
    >
      <View style={styles.poiInfo}>
        <Text style={[styles.poiName, { color: screenColors.text }]}>{item.name}</Text>
        {item.address && (
          <Text style={[styles.poiAddress, { color: screenColors.textSecondary }]}>{item.address}</Text>
        )}
        {item.category && (
          <Text style={[styles.poiCategory, { color: screenColors.primary }]}>{item.category}</Text>
        )}
      </View>
      {selectedPoiId === item.poi_id && (
        <Ionicons name="checkmark-circle" size={24} color={screenColors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: screenColors.background }]}>
        <View style={[styles.modalHeader, { borderBottomColor: screenColors.border }]}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={screenColors.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: screenColors.text }]}>{title}</Text>
          <View style={{ width: 24 }} />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={screenColors.primary} />
            <Text style={[styles.loadingText, { color: screenColors.textSecondary }]}>
              {t('loading_locations')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={pois}
            keyExtractor={(item) => item.poi_id}
            renderItem={renderPOI}
            contentContainerStyle={styles.poiList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="location-outline" size={64} color={screenColors.textSecondary} />
                <Text style={[styles.emptyText, { color: screenColors.textSecondary }]}>
                  {t('no_locations_found')}
                </Text>
                <Text style={[styles.emptySubtext, { color: screenColors.textSecondary }]}>
                  {t('add_locations_poi_first')}
                </Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const RouteManagementScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStartPOIModal, setShowStartPOIModal] = useState(false);
  const [showEndPOIModal, setShowEndPOIModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<DbStandardRoute | null>(null);
  const [modalError, setModalError] = useState<string>('');
  const [formData, setFormData] = useState<RouteFormData>({
    name: '',
    start_poi_id: '',
    end_poi_id: '',
    start_address_manual: '',
    end_address_manual: '',
    predefined_distance_km: '',
    estimated_duration_min: '',
    predefined_cost: '',
    cost_calculation_formula: '',
    notes: ''
  });

  // API hooks
  const { data: routes, isLoading, refetch } = useGetStandardRoutesQuery();
  const { data: pois } = useGetPoisQuery();
  const [createRoute, { isLoading: creating }] = useCreateStandardRouteMutation();
  const [updateRoute, { isLoading: updating }] = useUpdateStandardRouteMutation();
  const [deleteRoute, { isLoading: deleting }] = useDeleteStandardRouteMutation();

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
  };

  const resetForm = () => {
    setFormData({
      name: '',
      start_poi_id: '',
      end_poi_id: '',
      start_address_manual: '',
      end_address_manual: '',
      predefined_distance_km: '',
      estimated_duration_min: '',
      predefined_cost: '',
      cost_calculation_formula: '',
      notes: ''
    });
    setModalError('');
  };

  const handleAdd = () => {
    resetForm();
    setModalError('');
    setShowAddModal(true);
  };

  const handleEdit = (route: DbStandardRoute) => {
    setEditingRoute(route);
    setFormData({
      name: route.name || '',
      start_poi_id: route.start_poi_id || '',
      end_poi_id: route.end_poi_id || '',
      start_address_manual: route.start_address_manual || '',
      end_address_manual: route.end_address_manual || '',
      predefined_distance_km: route.predefined_distance_km?.toString() || '',
      estimated_duration_min: route.estimated_duration_min?.toString() || '',
      predefined_cost: route.predefined_cost?.toString() || '',
      cost_calculation_formula: route.cost_calculation_formula || '',
      notes: route.notes || ''
    });
    setModalError('');
    setShowEditModal(true);
  };

  const handleSave = async () => {
    setModalError(''); // Obriši prethodni error
    
    // Validation
    if (!formData.name.trim()) {
      setModalError(t('route_name_required', 'Route name is required'));
      return;
    }

    // Must have either POI locations or manual addresses for start/end
    const hasStartLocation = formData.start_poi_id || formData.start_address_manual.trim();
    const hasEndLocation = formData.end_poi_id || formData.end_address_manual.trim();
    
    if (!hasStartLocation || !hasEndLocation) {
      setModalError(t('start_end_locations_required', 'Start and end locations are required'));
      return;
    }

    try {
      const routeData = {
        name: formData.name.trim(),
        start_poi_id: formData.start_poi_id || null,
        end_poi_id: formData.end_poi_id || null,
        start_address_manual: formData.start_address_manual.trim() || null,
        end_address_manual: formData.end_address_manual.trim() || null,
        predefined_distance_km: formData.predefined_distance_km ? parseFloat(formData.predefined_distance_km) : null,
        estimated_duration_min: formData.estimated_duration_min ? parseInt(formData.estimated_duration_min) : null,
        predefined_cost: formData.predefined_cost ? parseFloat(formData.predefined_cost) : null,
        cost_calculation_formula: formData.cost_calculation_formula.trim() || null,
        notes: formData.notes.trim() || null
      };

      if (showEditModal && editingRoute) {
        await updateRoute({ 
          route_id: editingRoute.route_id, 
          ...routeData 
        }).unwrap();
        showCustomToast('success', 'Ruta je uspešno ažurirana', `Promene su sačuvane za rutu "${routeData.name}"`, { duration: 4000 });
      } else {
        await createRoute(routeData).unwrap();
        showCustomToast('success', 'Nova ruta je kreirana', `Ruta "${routeData.name}" je dodana u sistem`, { duration: 4000 });
      }

      setShowAddModal(false);
      setShowEditModal(false);
      resetForm();
      setEditingRoute(null);
    } catch (error) {
      console.error('Error saving route:', error);
      setModalError(t('check_connection_try_again', 'Check connection and try again'));
    }
  };

  const handleDelete = async (route: DbStandardRoute) => {
    try {
      await deleteRoute(route.route_id).unwrap();
      showCustomToast('success', 'Ruta je uspešno uklonjena', `Ruta "${route.name}" je uklonjena iz sistema`, { duration: 4000 });
    } catch (error) {
      console.error('Error deleting route:', error);
      showCustomToast('error', 'Greška pri uklanjanju rute', 'Molimo proverite internet konekciju i pokušajte ponovo', { duration: 4000 });
    }
  };

  const getPOIName = (poiId?: string | null) => {
    if (!poiId) return null;
    const poi = pois?.find(p => p.poi_id === poiId);
    return poi?.name || t('unknown_location');
  };

  const getLocationDisplay = (poiId?: string | null, manualAddress?: string | null) => {
    if (poiId) {
      return getPOIName(poiId);
    }
    return manualAddress || t('not_specified');
  };

  const handleStartPOISelect = (poi: DbPoi) => {
    setFormData(prev => ({ 
      ...prev, 
      start_poi_id: poi.poi_id,
      start_address_manual: '' // Clear manual address when POI is selected
    }));
  };

  const handleEndPOISelect = (poi: DbPoi) => {
    setFormData(prev => ({ 
      ...prev, 
      end_poi_id: poi.poi_id,
      end_address_manual: '' // Clear manual address when POI is selected
    }));
  };

  const clearStartPOI = () => {
    setFormData(prev => ({ ...prev, start_poi_id: '' }));
  };

  const clearEndPOI = () => {
    setFormData(prev => ({ ...prev, end_poi_id: '' }));
  };

  const renderRouteItem = ({ item }: { item: DbStandardRoute }) => (
    <View style={[styles.routeCard, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
      <View style={styles.routeHeader}>
        <View style={styles.routeInfo}>
          <Text style={[styles.routeName, { color: screenColors.text }]}>
            {item.name}
          </Text>
          <View style={styles.routeLocation}>
            <Text style={[styles.locationText, { color: screenColors.textSecondary }]}>
              {getLocationDisplay(item.start_poi_id, item.start_address_manual)}
            </Text>
            <Ionicons name="arrow-forward" size={16} color={screenColors.textSecondary} style={{ marginHorizontal: 8 }} />
            <Text style={[styles.locationText, { color: screenColors.textSecondary }]}>
              {getLocationDisplay(item.end_poi_id, item.end_address_manual)}
            </Text>
          </View>
        </View>
        <View style={styles.routeActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: screenColors.primary }]}
            onPress={() => handleEdit(item)}
          >
            <Ionicons name="pencil" size={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: screenColors.danger }]}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.routeDetails}>
                 {item.predefined_distance_km && (
           <View style={styles.detailItem}>
             <Ionicons name="navigate-outline" size={16} color={screenColors.primary} />
             <Text style={[styles.detailText, { color: screenColors.textSecondary }]}>
               {item.predefined_distance_km} km
             </Text>
           </View>
         )}
        {item.estimated_duration_min && (
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={screenColors.primary} />
            <Text style={[styles.detailText, { color: screenColors.textSecondary }]}>
              {item.estimated_duration_min} min
            </Text>
          </View>
        )}
        {item.predefined_cost && (
          <View style={styles.detailItem}>
            <Ionicons name="cash-outline" size={16} color={screenColors.success} />
            <Text style={[styles.detailText, { color: screenColors.textSecondary }]}>
              €{item.predefined_cost}
            </Text>
          </View>
        )}
      </View>
      
      {item.notes && (
        <Text style={[styles.routeNotes, { color: screenColors.textSecondary }]}>
          {item.notes}
        </Text>
      )}
    </View>
  );

  const renderFormModal = (visible: boolean, onClose: () => void, title: string) => (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: screenColors.background }]}>
        <View style={[styles.modalHeader, { borderBottomColor: screenColors.border }]}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={screenColors.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: screenColors.text }]}>{title}</Text>
          <TouchableOpacity 
            onPress={handleSave}
            disabled={creating || updating}
          >
            {creating || updating ? (
              <ActivityIndicator size="small" color={screenColors.primary} />
            ) : (
              <Text style={[styles.saveButton, { color: screenColors.primary }]}>{t('common.save')}</Text>
            )}
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          style={styles.modalContent}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>{t('route_name')} *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.card, 
                  borderColor: screenColors.border,
                  color: screenColors.text 
                }]}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder={t('enter_route_name_placeholder')}
                placeholderTextColor={screenColors.textSecondary}
              />
            </View>

            {/* Start Location Section */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>{t('start_location')} *</Text>
              
              {/* POI Selection */}
              <TouchableOpacity
                style={[styles.poiSelector, { 
                  backgroundColor: screenColors.card, 
                  borderColor: screenColors.border 
                }]}
                onPress={() => setShowStartPOIModal(true)}
              >
                <View style={styles.poiSelectorContent}>
                  <Ionicons name="location" size={20} color={screenColors.primary} />
                  <Text style={[styles.poiSelectorText, { 
                    color: formData.start_poi_id ? screenColors.text : screenColors.textSecondary 
                  }]}>
                    {formData.start_poi_id ? getPOIName(formData.start_poi_id) : t('select_from_saved_locations')}
                  </Text>
                </View>
                {formData.start_poi_id ? (
                  <TouchableOpacity onPress={clearStartPOI}>
                    <Ionicons name="close-circle" size={20} color={screenColors.danger} />
                  </TouchableOpacity>
                ) : (
                  <Ionicons name="chevron-forward" size={20} color={screenColors.textSecondary} />
                )}
              </TouchableOpacity>

              {/* Manual Address Input */}
              <Text style={[styles.orText, { color: screenColors.textSecondary }]}>{t('or')}</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.card, 
                  borderColor: screenColors.border,
                  color: screenColors.text 
                }]}
                value={formData.start_address_manual}
                onChangeText={(text) => setFormData(prev => ({ 
                  ...prev, 
                  start_address_manual: text,
                  start_poi_id: text ? '' : prev.start_poi_id // Clear POI when manual address is entered
                }))}
                placeholder={t('enter_manual_address_placeholder')}
                placeholderTextColor={screenColors.textSecondary}
                editable={!formData.start_poi_id}
              />
            </View>

            {/* End Location Section */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>{t('end_location')} *</Text>
              
              {/* POI Selection */}
              <TouchableOpacity
                style={[styles.poiSelector, { 
                  backgroundColor: screenColors.card, 
                  borderColor: screenColors.border 
                }]}
                onPress={() => setShowEndPOIModal(true)}
              >
                <View style={styles.poiSelectorContent}>
                  <Ionicons name="location" size={20} color={screenColors.primary} />
                  <Text style={[styles.poiSelectorText, { 
                    color: formData.end_poi_id ? screenColors.text : screenColors.textSecondary 
                  }]}>
                    {formData.end_poi_id ? getPOIName(formData.end_poi_id) : t('select_from_saved_locations')}
                  </Text>
                </View>
                {formData.end_poi_id ? (
                  <TouchableOpacity onPress={clearEndPOI}>
                    <Ionicons name="close-circle" size={20} color={screenColors.danger} />
                  </TouchableOpacity>
                ) : (
                  <Ionicons name="chevron-forward" size={20} color={screenColors.textSecondary} />
                )}
              </TouchableOpacity>

              {/* Manual Address Input */}
              <Text style={[styles.orText, { color: screenColors.textSecondary }]}>{t('or')}</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.card, 
                  borderColor: screenColors.border,
                  color: screenColors.text 
                }]}
                value={formData.end_address_manual}
                onChangeText={(text) => setFormData(prev => ({ 
                  ...prev, 
                  end_address_manual: text,
                  end_poi_id: text ? '' : prev.end_poi_id // Clear POI when manual address is entered
                }))}
                placeholder={t('enter_manual_address_placeholder')}
                placeholderTextColor={screenColors.textSecondary}
                editable={!formData.end_poi_id}
              />
            </View>

            {/* Route Details */}
            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.label, { color: screenColors.text }]}>{t('distance_km')}</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: screenColors.card, 
                    borderColor: screenColors.border,
                    color: screenColors.text 
                  }]}
                  value={formData.predefined_distance_km}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, predefined_distance_km: text }))}
                  placeholder={t('enter_distance_placeholder')}
                  placeholderTextColor={screenColors.textSecondary}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.label, { color: screenColors.text }]}>{t('duration_minutes')}</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: screenColors.card, 
                    borderColor: screenColors.border,
                    color: screenColors.text 
                  }]}
                  value={formData.estimated_duration_min}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, estimated_duration_min: text }))}
                  placeholder={t('enter_duration_placeholder')}
                  placeholderTextColor={screenColors.textSecondary}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>{t('predefined_cost')}</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.card, 
                  borderColor: screenColors.border,
                  color: screenColors.text 
                }]}
                value={formData.predefined_cost}
                onChangeText={(text) => setFormData(prev => ({ ...prev, predefined_cost: text }))}
                placeholder={t('enter_cost_placeholder')}
                placeholderTextColor={screenColors.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>{t('cost_calculation_formula')}</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.card, 
                  borderColor: screenColors.border,
                  color: screenColors.text 
                }]}
                value={formData.cost_calculation_formula}
                onChangeText={(text) => setFormData(prev => ({ ...prev, cost_calculation_formula: text }))}
                placeholder={t('enter_formula_placeholder')}
                placeholderTextColor={screenColors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>{t('notes')}</Text>
              <TextInput
                style={[styles.textArea, { 
                  backgroundColor: screenColors.card, 
                  borderColor: screenColors.border,
                  color: screenColors.text 
                }]}
                value={formData.notes}
                onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                placeholder={t('enter_route_notes_placeholder')}
                placeholderTextColor={screenColors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
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
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: screenColors.background, borderBottomColor: screenColors.border }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={screenColors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: screenColors.text }]}>{t('route_management_title')}</Text>
          <Text style={[styles.headerSubtitle, { color: screenColors.textSecondary }]}>
            {t('manage_standard_routes_desc')}
          </Text>
        </View>
      </View>

      {/* Add Button */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: screenColors.primary }]}
          onPress={handleAdd}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>{t('add_route')}</Text>
        </TouchableOpacity>
      </View>

      {/* Routes List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={screenColors.primary} />
          <Text style={[styles.loadingText, { color: screenColors.textSecondary }]}>
            {t('loading_routes')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={routes}
          keyExtractor={(item) => item.route_id}
          renderItem={renderRouteItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor={screenColors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="map-outline" size={64} color={screenColors.textSecondary} />
              <Text style={[styles.emptyText, { color: screenColors.textSecondary }]}>
                {t('no_routes_found')}
              </Text>
              <Text style={[styles.emptySubtext, { color: screenColors.textSecondary }]}>
                {t('create_first_route')}
              </Text>
            </View>
          }
        />
      )}

      {/* Modals */}
      {renderFormModal(showAddModal, () => setShowAddModal(false), t('add_new_route'))}
      {renderFormModal(showEditModal, () => setShowEditModal(false), t('edit_route'))}
      
      <POISelectorModal
        visible={showStartPOIModal}
        onClose={() => setShowStartPOIModal(false)}
        onSelect={handleStartPOISelect}
        title={t('select_start_location')}
        selectedPoiId={formData.start_poi_id}
      />
      
      <POISelectorModal
        visible={showEndPOIModal}
        onClose={() => setShowEndPOIModal(false)}
        onSelect={handleEndPOISelect}
        title={t('select_end_location')}
        selectedPoiId={formData.end_poi_id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 10,
  },
  headerContent: {
    flex: 1,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  actionContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  routeCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  routeInfo: {
    flex: 1,
    marginRight: 12,
  },
  routeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  routeLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  locationText: {
    fontSize: 14,
    maxWidth: 120,
  },
  routeActions: {
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
  routeDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
  },
  routeNotes: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
  },
  poiSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginBottom: 8,
  },
  poiSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  poiSelectorText: {
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
  },
  orText: {
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 8,
    fontStyle: 'italic',
  },
  // POI Modal styles
  poiList: {
    padding: 20,
  },
  poiItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  poiInfo: {
    flex: 1,
  },
  poiName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  poiAddress: {
    fontSize: 14,
    marginBottom: 2,
  },
  poiCategory: {
    fontSize: 12,
    fontWeight: '500',
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

export default RouteManagementScreen; 