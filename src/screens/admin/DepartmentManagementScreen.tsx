import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/Colors';
import { supabase } from '../../lib/supabase';
import { showSuccessToast, showErrorToast, showWarningToast } from '../../utils/toastUtils';

interface Department {
  department_id: string;
  name: string;
  description?: string;
  parent_department_id?: string;
  created_at: string;
  updated_at: string;
}

interface DepartmentFormData {
  name: string;
  description: string;
  parent_department_id?: string;
}

export default function DepartmentManagementScreen({ navigation }: any) {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: '',
    description: '',
    parent_department_id: undefined,
  });

  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    primary: Colors.DARK.primary,
    card: Colors.DARK.card,
    border: Colors.DARK.border,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    danger: Colors.DANGER,
  } : {
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    primary: Colors.LIGHT.primary,
    card: Colors.LIGHT.card,
    border: Colors.LIGHT.border,
    success: Colors.SUCCESS,
    warning: Colors.WARNING,
    danger: Colors.DANGER,
  };

  useEffect(() => {
    loadDepartments();
    navigation.setOptions({
      title: t('admin_department_management.title', 'Department Management')
    });
  }, [navigation, t]);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) throw error;

      setDepartments(data || []);
    } catch (error) {
      console.error('Error loading departments:', error);
      showErrorToast(t('admin_department_management.failed_load'));
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDepartments();
    setRefreshing(false);
  };

  const handleSaveDepartment = async () => {
    if (!formData.name.trim()) {
      showWarningToast(t('admin_department_management.enter_name'));
      return;
    }

    try {
      const departmentData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        parent_department_id: formData.parent_department_id || null,
        updated_at: new Date().toISOString(),
      };

      if (editingDepartment) {
        // Update existing department
        const { error } = await supabase
          .from('departments')
          .update(departmentData)
          .eq('department_id', editingDepartment.department_id);

        if (error) throw error;
        showSuccessToast(t('admin_department_management.updated'));
      } else {
        // Create new department
        const { error } = await supabase
          .from('departments')
          .insert([{
            ...departmentData,
            created_at: new Date().toISOString(),
          }]);

        if (error) throw error;
        showSuccessToast(t('admin_department_management.created'));
      }

      setShowAddModal(false);
      setEditingDepartment(null);
      resetForm();
      loadDepartments();
    } catch (error) {
      console.error('Error saving department:', error);
      showErrorToast(t('admin_department_management.save_failed'));
    }
  };

  const handleDeleteDepartment = (department: Department) => {
    Alert.alert(
      t('admin_department_management.confirm_delete'),
      t('admin_department_management.delete_warning', { name: department.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('departments')
                .delete()
                .eq('department_id', department.department_id);

              if (error) throw error;

              showSuccessToast(t('admin_department_management.deleted'));
              loadDepartments();
            } catch (error) {
              console.error('Error deleting department:', error);
              showErrorToast(t('admin_department_management.delete_failed'));
            }
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      parent_department_id: undefined,
    });
  };

  const openEditModal = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || '',
      parent_department_id: department.parent_department_id || undefined,
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingDepartment(null);
    resetForm();
  };

  const renderDepartmentItem = ({ item }: { item: Department }) => {
    const parentDept = departments.find(d => d.department_id === item.parent_department_id);

    return (
      <View style={[styles.departmentCard, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
        <View style={styles.departmentHeader}>
          <View style={styles.departmentInfo}>
            <Text style={[styles.departmentName, { color: screenColors.text }]}>{item.name}</Text>
            {item.description && (
              <Text style={[styles.departmentDescription, { color: screenColors.textSecondary }]}>
                {item.description}
              </Text>
            )}
            {parentDept && (
              <Text style={[styles.parentDepartment, { color: screenColors.primary }]}>
                Parent: {parentDept.name}
              </Text>
            )}
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: screenColors.primary }]}
              onPress={() => openEditModal(item)}
            >
              <Ionicons name="pencil" size={16} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: screenColors.danger }]}
              onPress={() => handleDeleteDepartment(item)}
            >
              <Ionicons name="trash" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: screenColors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: screenColors.border,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: screenColors.text,
      marginLeft: 16,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      borderRadius: 8,
      backgroundColor: screenColors.primary,
      margin: 16,
    },
    addButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    departmentCard: {
      marginHorizontal: 16,
      marginVertical: 8,
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
    },
    departmentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    departmentInfo: {
      flex: 1,
    },
    departmentName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    departmentDescription: {
      fontSize: 14,
      marginBottom: 4,
    },
    parentDepartment: {
      fontSize: 12,
      fontStyle: 'italic',
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 8,
      borderRadius: 6,
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 20,
    },
    modalContent: {
      width: '100%',
      backgroundColor: screenColors.card,
      borderRadius: 12,
      padding: 20,
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: screenColors.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: screenColors.border,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      color: screenColors.text,
      backgroundColor: screenColors.background,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: screenColors.text,
      marginBottom: 8,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    modalButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 5,
    },
    saveButton: {
      backgroundColor: screenColors.primary,
    },
    cancelButton: {
      backgroundColor: screenColors.border,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    cancelButtonText: {
      color: screenColors.text,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={screenColors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t('admin_department_management.title', 'Department Management')}
        </Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
        <Ionicons name="add" size={20} color="white" />
        <Text style={styles.addButtonText}>
          {t('admin_department_management.add_department', 'Add Department')}
        </Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color={screenColors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={departments}
          keyExtractor={(item) => item.department_id}
          renderItem={renderDepartmentItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={{ color: screenColors.textSecondary }}>
                {t('admin_department_management.no_departments', 'No departments found')}
              </Text>
            </View>
          }
        />
      )}

      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingDepartment
                ? t('admin_department_management.edit_department', 'Edit Department')
                : t('admin_department_management.add_department', 'Add Department')
              }
            </Text>

            <Text style={styles.inputLabel}>
              {t('admin_department_management.name', 'Name')} *
            </Text>
            <TextInput
              style={styles.input}
              placeholder={t('admin_department_management.name_placeholder', 'Enter department name')}
              placeholderTextColor={screenColors.textSecondary}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />

            <Text style={styles.inputLabel}>
              {t('admin_department_management.description', 'Description')}
            </Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder={t('admin_department_management.description_placeholder', 'Enter description')}
              placeholderTextColor={screenColors.textSecondary}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>
                  {t('common.cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveDepartment}>
                <Text style={styles.buttonText}>
                  {editingDepartment ? t('common.save') : t('common.add')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
