import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';

// Toast Utils
import { showSuccessToast, showErrorToast, showWarningToast } from '../../utils/toastUtils';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { roleService, UserRole, UserWithRoles } from '../../services/roleService';
import { supabase } from '../../lib/supabase';
import { useTranslation } from 'react-i18next';

interface User {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export default function AdminRoleManagementScreen({ navigation }: any) {
  const { user: currentUser } = useAuth();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const { t } = useTranslation();
  
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<UserWithRoles | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');

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
    loadData();
    // Set dynamic header title
    navigation.setOptions({
      title: t('admin_role_management.title')
    });
  }, [navigation, t]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load all available roles
      const allRoles = await roleService.getAllRoles();
      setRoles(allRoles);

      // For now, we'll load users on demand via search
      // This avoids the need for admin privileges
      console.log('✅ Loaded roles:', allRoles);

    } catch (error) {
      console.error('Error in loadData:', error);
      showErrorToast(t('admin_role_management.failed_load_data'));
    } finally {
      setLoading(false);
    }
  };

  const searchUserByEmail = async () => {
    console.log(`[RoleManagement] Searching for user with email: ${searchEmail}`);
    if (!searchEmail.trim()) {
      showWarningToast(t('admin_role_management.enter_email'));
      return;
    }

    setLoading(true);
    setSelectedUser(null);
    setUserRoles(null);
    try {
      console.log('[RoleManagement] Calling Supabase to find user...');
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_id, email, first_name, last_name')
        .eq('email', searchEmail.toLowerCase().trim())
        .single();
      
      if (userError || !userData) {
        console.warn('[RoleManagement] User not found in DB or error occurred.', userError);
        showErrorToast(t('admin_role_management.user_not_found'));
        setLoading(false);
        return;
      }

      console.log(`[RoleManagement] User found: ${JSON.stringify(userData)}`);
      const foundUser: User = {
        user_id: userData.user_id,
        email: userData.email,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
      };

      setSelectedUser(foundUser);
      
      console.log(`[RoleManagement] Fetching roles for user ID: ${foundUser.user_id}`);
      const userWithRoles = await roleService.getUserRolesAndPermissions(foundUser.user_id);
      setUserRoles(userWithRoles);
      console.log(`[RoleManagement] Roles fetched: ${JSON.stringify(userWithRoles)}`);

    } catch (error) {
      console.error('[RoleManagement] Critical error in searchUserByEmail:', error);
      showErrorToast(t('admin_role_management.failed_search_user'));
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (roleId: string, roleName: string) => {
    if (!selectedUser) return;

    try {
      const success = await roleService.assignRole(selectedUser.user_id, roleId);
      
      if (success) {
        showSuccessToast(t('admin_role_management.role_assigned_success', { roleName }));
        // Reload user roles
        const userWithRoles = await roleService.getUserRolesAndPermissions(selectedUser.user_id);
        setUserRoles(userWithRoles);
      } else {
        showErrorToast(t('admin_role_management.failed_assign_role'));
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      showErrorToast(t('admin_role_management.failed_assign_role'));
    }
  };

  const removeRole = async (roleId: string, roleName: string) => {
    if (!selectedUser) return;

    Alert.alert(
      t('common.confirm_action'),
      t('admin_role_management.confirm_remove_role', { roleName, userEmail: selectedUser.email }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('admin_role_management.remove_role'),
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await roleService.removeRole(selectedUser.user_id, roleId);
              
              if (success) {
                showSuccessToast(t('admin_role_management.role_removed_success', { roleName }));
                // Reload user roles
                const userWithRoles = await roleService.getUserRolesAndPermissions(selectedUser.user_id);
                setUserRoles(userWithRoles);
              } else {
                showErrorToast(t('admin_role_management.failed_remove_role'));
              }
            } catch (error) {
              console.error('Error removing role:', error);
              showErrorToast(t('admin_role_management.failed_remove_role'));
            }
          }
        }
      ]
    );
  };

  const hasRole = (roleName: string): boolean => {
    return userRoles?.roles.some(role => role.role_name === roleName) || false;
  };

  const createNewRole = async () => {
    const roleNameToSave = newRoleName.toLowerCase().trim();
    const descriptionToSave = newRoleDescription.trim();
    console.log(`[RoleManagement] Attempting to create new role: '${roleNameToSave}' with description: '${descriptionToSave}'`);

    if (!roleNameToSave) {
      showWarningToast(t('admin_role_management.enter_role_name'));
      return;
    }
    if (!descriptionToSave) {
      showWarningToast(t('admin_role_management.enter_role_description'));
      return;
    }

    setLoading(true);
    try {
      console.log('[RoleManagement] Calling Supabase to insert new role...');
      const { data, error } = await supabase
        .from('roles')
        .insert({
          role_name: roleNameToSave,
          description: descriptionToSave
        })
        .select()
        .single();

      if (error) {
        console.error(`[RoleManagement] Supabase error creating role. Code: ${error.code}`, error);
        if (error.code === '23505') { // Unique constraint violation
          showErrorToast(t('admin_role_management.role_already_exists'));
        } else {
          showErrorToast(t('admin_role_management.failed_create_role'), error.message);
        }
        return;
      }
      
      console.log(`[RoleManagement] Role created successfully: ${JSON.stringify(data)}`);
      showSuccessToast(t('admin_role_management.role_created_success', { roleName: newRoleName }));
      
      setNewRoleName('');
      setNewRoleDescription('');
      setShowAddRoleModal(false);
      
      console.log('[RoleManagement] Reloading all roles...');
      await loadData();

    } catch (error) {
      console.error('[RoleManagement] Critical error in createNewRole:', error);
      showErrorToast(t('admin_role_management.failed_create_role'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
      <StatusBar 
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={screenColors.background}
      />
      <View style={[styles.header, { backgroundColor: screenColors.card, borderBottomColor: screenColors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={screenColors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: screenColors.text }]}>{t('admin_role_management.title', 'Role Management')}</Text>
      </View>
      <ScrollView style={styles.contentContainer}>
        <View style={[styles.card, { backgroundColor: screenColors.card }]}>
          <Text style={[styles.cardTitle, { color: screenColors.text }]}>{t('admin_role_management.search_user', 'Search User by Email')}</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.searchInput, { 
                backgroundColor: screenColors.background,
                color: screenColors.text,
                borderColor: screenColors.border 
              }]}
              placeholder={t('admin_role_management.enter_email_placeholder')}
              placeholderTextColor={screenColors.textSecondary}
              value={searchEmail}
              onChangeText={setSearchEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.searchButton, { backgroundColor: screenColors.primary }]}
              onPress={searchUserByEmail}
              disabled={loading}
            >
              <Ionicons name="search" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Selected User Info */}
        {selectedUser && (
          <View style={[styles.section, { backgroundColor: screenColors.card }]}>
            <Text style={[styles.sectionTitle, { color: screenColors.text }]}>
              {t('admin_role_management.user_information')}
            </Text>
            
            <View style={styles.userInfo}>
              <Text style={[styles.userInfoText, { color: screenColors.text }]}>
                <Text style={{ fontWeight: 'bold' }}>{t('admin_role_management.email_label')}</Text> {selectedUser.email}
              </Text>
              <Text style={[styles.userInfoText, { color: screenColors.text }]}>
                <Text style={{ fontWeight: 'bold' }}>{t('admin_role_management.name_label')}</Text> {selectedUser.first_name} {selectedUser.last_name}
              </Text>
              <Text style={[styles.userInfoText, { color: screenColors.textSecondary }]}>
                <Text style={{ fontWeight: 'bold' }}>{t('admin_role_management.id_label')}</Text> {selectedUser.user_id}
              </Text>
            </View>
          </View>
        )}

        {/* Role Management Actions */}
        <View style={[styles.section, { backgroundColor: screenColors.card }]}>
          <Text style={[styles.sectionTitle, { color: screenColors.text }]}>
            {t('admin_role_management.role_management')}
          </Text>
          
          <TouchableOpacity
            style={[styles.addRoleButton, { backgroundColor: screenColors.primary }]}
            onPress={() => setShowAddRoleModal(true)}
          >
            <Ionicons name="add-circle-outline" size={20} color="white" />
            <Text style={styles.addRoleButtonText}>
              {t('admin_role_management.add_new_role')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Roles Section */}
        {selectedUser && (
          <View style={[styles.section, { backgroundColor: screenColors.card }]}>
            <Text style={[styles.sectionTitle, { color: screenColors.text }]}>
              {t('admin_role_management.manage_user_roles')}
            </Text>

            {roles.map(role => (
              <View key={role.role_id} style={styles.roleRow}>
                <Text style={[styles.roleName, { color: screenColors.text }]}>{role.role_name}</Text>
                
                {hasRole(role.role_name) ? (
                  <TouchableOpacity
                    style={[styles.roleButton, styles.removeButton, { backgroundColor: screenColors.danger }]}
                    onPress={() => removeRole(role.role_id, role.role_name)}
                  >
                    <Text style={styles.roleButtonText}>{t('admin_role_management.remove_role')}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.roleButton, styles.assignButton, { backgroundColor: screenColors.success }]}
                    onPress={() => assignRole(role.role_id, role.role_name)}
                  >
                    <Text style={styles.roleButtonText}>{t('admin_role_management.assign_role')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Role Modal */}
      <Modal
        visible={showAddRoleModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddRoleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: screenColors.card }]}>
            <Text style={[styles.modalTitle, { color: screenColors.text }]}>
              {t('admin_role_management.add_new_role')}
            </Text>

            <TextInput
              style={[styles.modalInput, { 
                backgroundColor: screenColors.background,
                color: screenColors.text,
                borderColor: screenColors.border 
              }]}
              placeholder={t('admin_role_management.role_name_placeholder')}
              placeholderTextColor={screenColors.textSecondary}
              value={newRoleName}
              onChangeText={setNewRoleName}
              autoCapitalize="none"
            />

            <TextInput
              style={[styles.modalInput, styles.modalTextArea, { 
                backgroundColor: screenColors.background,
                color: screenColors.text,
                borderColor: screenColors.border 
              }]}
              placeholder={t('admin_role_management.role_description_placeholder')}
              placeholderTextColor={screenColors.textSecondary}
              value={newRoleDescription}
              onChangeText={setNewRoleDescription}
              multiline={true}
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: screenColors.textSecondary }]}
                onPress={() => {
                  setShowAddRoleModal(false);
                  setNewRoleName('');
                  setNewRoleDescription('');
                }}
              >
                <Text style={styles.modalButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.createButton, { backgroundColor: screenColors.success }]}
                onPress={createNewRole}
                disabled={loading}
              >
                <Text style={styles.modalButtonText}>
                  {loading ? t('common.creating') : t('common.create')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  searchButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    gap: 8,
  },
  userInfoText: {
    fontSize: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  roleInfo: {
    flex: 1,
  },
  roleName: {
    fontSize: 16,
    fontWeight: '600',
  },
  roleDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  assignButton: {
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assignedBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  assignedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  noRolesText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  quickActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  roleButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  addRoleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  addRoleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  modalTextArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    opacity: 0.8,
  },
  createButton: {
    // No additional styles needed
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 