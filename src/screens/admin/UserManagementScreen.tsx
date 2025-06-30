import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/Colors';
import { 
  useGetUsersQuery, 
  useCreateUserMutation, 
  useUpdateUserMutation, 
  useDeleteUserMutation,
  DbUser,
} from '../../store/api/supabaseApi';
import { showErrorToast, showSuccessToast, showWarningToast } from '../../utils/toastUtils';

interface UserFormData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  is_active: boolean;
  is_email_verified: boolean;
  onboarding_status: string;
  preferred_language: string;
  preferred_theme: string;
  preferred_units: string;
  preferred_currency: string;
  password?: string;
  confirmPassword?: string;
}

const UserManagementScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const authUser = useSelector((state: RootState) => state.auth?.user || null);
  
  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    card: Colors.DARK.card,
    border: Colors.DARK.border,
    primary: Colors.DARK.primary,
    success: Colors.DARK.success,
    warning: Colors.DARK.warning,
    danger: Colors.DARK.danger,
  } : {
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    card: Colors.LIGHT.card,
    border: Colors.LIGHT.border,
    primary: Colors.LIGHT.primary,
    success: Colors.LIGHT.success,
    warning: Colors.LIGHT.warning,
    danger: Colors.LIGHT.danger,
  };

  // API Hooks
  const { data: users = [], isLoading, refetch } = useGetUsersQuery();
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  // State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<DbUser | null>(null);

  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    is_active: true,
    is_email_verified: false,
    onboarding_status: 'pending',
    preferred_language: 'en',
    preferred_theme: 'light',
    preferred_units: 'metric',
    preferred_currency: 'EUR',
    password: '',
    confirmPassword: '',
  });

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      is_active: true,
      is_email_verified: false,
      onboarding_status: 'pending',
      preferred_language: 'en',
      preferred_theme: 'light',
      preferred_units: 'metric',
      preferred_currency: 'EUR',
      password: '',
      confirmPassword: '',
    });
    setEditingUser(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEdit = (user: DbUser) => {
    setEditingUser(user);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone_number: user.phone_number || '',
      is_active: user.is_active !== undefined ? user.is_active : true,
      is_email_verified: user.is_email_verified !== undefined ? user.is_email_verified : false,
      onboarding_status: user.onboarding_status || 'pending',
      preferred_language: user.preferred_language || 'en',
      preferred_theme: user.preferred_theme || 'light',
      preferred_units: user.preferred_units || 'metric',
      preferred_currency: user.preferred_currency || 'EUR',
    });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    // Validation
    if (!formData.username || !formData.email || !formData.first_name || !formData.last_name) {
      showWarningToast(t('fill_required_fields_user', 'Please fill in all required fields (username, email, first name, last name)'));
      return;
    }

    // Additional validation for new users
    if (!editingUser) {
      if (!formData.password || formData.password.length < 6) {
        showWarningToast(t('password_min_length', 'Password must be at least 6 characters long.'));
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        showWarningToast(t('passwords_do_not_match', 'Passwords do not match.'));
        return;
      }
    }

    try {
      if (editingUser) {
        // Update user
        await updateUser({
          user_id: editingUser.user_id,
          username: formData.username,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number || null,
          is_active: formData.is_active,
          is_email_verified: formData.is_email_verified,
          onboarding_status: formData.onboarding_status,
          preferred_language: formData.preferred_language,
          preferred_theme: formData.preferred_theme,
          preferred_units: formData.preferred_units,
          preferred_currency: formData.preferred_currency,
        }).unwrap();
        
        showSuccessToast(t('user_updated_successfully', 'User updated successfully'));
        setShowEditModal(false);
      } else {
        // Create user
        showWarningToast("User creation is temporarily disabled.");
        return;
      }
      
      resetForm();
    } catch (error: any) {
      const errorMessage = error?.data?.error_description || error?.data?.message || t('failed_save_user', 'Failed to save user');
      showErrorToast(errorMessage);
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = (user: DbUser) => {
    Alert.alert(
      t('delete_user', 'Delete User'),
      t('confirm_delete_user', 'Are you sure you want to delete {{firstName}} {{lastName}}? This action cannot be undone.', { firstName: user.first_name, lastName: user.last_name }),
      [
        { text: t('common.cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('common.delete', 'Delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(user.user_id).unwrap();
              showSuccessToast(t('user_deleted_successfully', 'User deleted successfully'));
            } catch (error: any) {
              const errorMessage = error?.data?.error_description || error?.data?.message || t('failed_delete_user', 'Failed to delete user');
              showErrorToast(errorMessage);
              console.error('Error deleting user:', error);
            }
          },
        },
      ]
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return screenColors.success;
      case 'pending': return screenColors.warning;
      case 'inactive': return screenColors.danger;
      default: return screenColors.textSecondary;
    }
  };

  const renderUserItem = ({ item }: { item: DbUser }) => (
    <View style={[styles.userCard, { 
      backgroundColor: screenColors.card, 
      borderColor: screenColors.border 
    }]}>
      <View style={styles.userHeader}>
        <View style={styles.userAvatar}>
          {item.avatar_url ? (
            <Image source={{ uri: item.avatar_url }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: screenColors.primary }]}>
              <Text style={styles.avatarText}>
                {getInitials(item.first_name, item.last_name)}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: screenColors.text }]}>
            {item.first_name} {item.last_name}
          </Text>
          <Text style={[styles.userEmail, { color: screenColors.textSecondary }]}>
            {item.email}
          </Text>
          <Text style={[styles.userUsername, { color: screenColors.textSecondary }]}>
            @{item.username}
          </Text>
        </View>

        <View style={styles.userActions}>
          <TouchableOpacity
            onPress={() => handleEdit(item)}
            style={[styles.actionButton, { backgroundColor: screenColors.primary }]}
          >
            <Ionicons name="create-outline" size={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item)}
            style={[styles.actionButton, { backgroundColor: screenColors.danger }]}
          >
            <Ionicons name="trash-outline" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.userDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="call-outline" size={14} color={screenColors.primary} />
          <Text style={[styles.detailText, { color: screenColors.textSecondary }]}>
            {item.phone_number || t('no_phone', 'No phone')}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="person-outline" size={14} color={screenColors.primary} />
          <Text style={[styles.detailText, { color: getStatusColor(item.onboarding_status || 'pending') }]}>
            {item.onboarding_status || t('pending', 'Pending')}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={14} color={screenColors.primary} />
          <Text style={[styles.detailText, { color: screenColors.textSecondary }]}>
            {t('joined', 'Joined')}: {formatDate(item.created_at)}
          </Text>
        </View>

        {item.last_login_at && (
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={14} color={screenColors.primary} />
            <Text style={[styles.detailText, { color: screenColors.textSecondary }]}>
              {t('last_login', 'Last login')}: {formatDate(item.last_login_at)}
            </Text>
          </View>
        )}

        {/* Status Badges */}
        <View style={styles.statusBadges}>
          {item.is_active ? (
            <View style={[styles.statusBadge, { backgroundColor: screenColors.success + '20' }]}>
              <Text style={[styles.statusBadgeText, { color: screenColors.success }]}>{t('active', 'Active')}</Text>
            </View>
          ) : (
            <View style={[styles.statusBadge, { backgroundColor: screenColors.danger + '20' }]}>
              <Text style={[styles.statusBadgeText, { color: screenColors.danger }]}>{t('inactive', 'Inactive')}</Text>
            </View>
          )}

          {item.is_email_verified && (
            <View style={[styles.statusBadge, { backgroundColor: screenColors.primary + '20' }]}>
              <Text style={[styles.statusBadgeText, { color: screenColors.primary }]}>{t('verified', 'Verified')}</Text>
            </View>
          )}
        </View>
      </View>
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
              <Text style={[styles.saveButton, { color: screenColors.primary }]}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          style={styles.modalContent}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            
            {/* Basic Information */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: screenColors.text }]}>Basic Information</Text>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.label, { color: screenColors.text }]}>Username *</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: screenColors.card, 
                    borderColor: screenColors.border,
                    color: screenColors.text 
                  }]}
                  value={formData.username}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
                  placeholder={t('username_placeholder')}
                  placeholderTextColor={screenColors.textSecondary}
                  autoCapitalize="none"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.label, { color: screenColors.text }]}>Email *</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: screenColors.card, 
                    borderColor: screenColors.border,
                    color: screenColors.text 
                  }]}
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  placeholder={t('email_placeholder')}
                  placeholderTextColor={screenColors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.label, { color: screenColors.text }]}>First Name *</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: screenColors.card, 
                    borderColor: screenColors.border,
                    color: screenColors.text 
                  }]}
                  value={formData.first_name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, first_name: text }))}
                  placeholder={t('first_name_placeholder')}
                  placeholderTextColor={screenColors.textSecondary}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.label, { color: screenColors.text }]}>Last Name *</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: screenColors.card, 
                    borderColor: screenColors.border,
                    color: screenColors.text 
                  }]}
                  value={formData.last_name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, last_name: text }))}
                  placeholder={t('last_name_placeholder')}
                  placeholderTextColor={screenColors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: screenColors.text }]}>Phone Number</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: screenColors.card, 
                  borderColor: screenColors.border,
                  color: screenColors.text 
                }]}
                value={formData.phone_number}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone_number: text }))}
                placeholder={t('phone_placeholder')}
                placeholderTextColor={screenColors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            {/* Password fields - only for new users */}
            {!editingUser && (
              <>
                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={[styles.label, { color: screenColors.text }]}>Password *</Text>
                    <TextInput
                      style={[styles.input, { 
                        backgroundColor: screenColors.card, 
                        borderColor: screenColors.border,
                        color: screenColors.text 
                      }]}
                      value={formData.password}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                      placeholder={t('password_placeholder', 'Enter password')}
                      placeholderTextColor={screenColors.textSecondary}
                      secureTextEntry
                    />
                  </View>
                  <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={[styles.label, { color: screenColors.text }]}>Confirm Password *</Text>
                    <TextInput
                      style={[styles.input, { 
                        backgroundColor: screenColors.card, 
                        borderColor: screenColors.border,
                        color: screenColors.text 
                      }]}
                      value={formData.confirmPassword}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                      placeholder={t('confirm_password_placeholder', 'Confirm password')}
                      placeholderTextColor={screenColors.textSecondary}
                      secureTextEntry
                    />
                  </View>
                </View>
              </>
            )}

            {/* Status Settings */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: screenColors.text }]}>{t('account_status')}</Text>
            </View>

            <View style={styles.formGroup}>
              <TouchableOpacity
                style={styles.switchRow}
                onPress={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
              >
                <View style={styles.switchContent}>
                  <Ionicons name="checkmark-circle-outline" size={20} color={screenColors.primary} />
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={[styles.switchLabel, { color: screenColors.text }]}>{t('active_account')}</Text>
                    <Text style={[styles.switchSubtitle, { color: screenColors.textSecondary }]}>
                      {t('active_account_desc')}
                    </Text>
                  </View>
                </View>
                <View style={[styles.switch, { 
                  backgroundColor: formData.is_active ? screenColors.primary : screenColors.border 
                }]}>
                  <View style={[styles.switchThumb, { 
                    transform: [{ translateX: formData.is_active ? 20 : 2 }] 
                  }]} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <TouchableOpacity
                style={styles.switchRow}
                onPress={() => setFormData(prev => ({ ...prev, is_email_verified: !prev.is_email_verified }))}
              >
                <View style={styles.switchContent}>
                  <Ionicons name="mail-outline" size={20} color={screenColors.primary} />
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <Text style={[styles.switchLabel, { color: screenColors.text }]}>{t('email_verified')}</Text>
                    <Text style={[styles.switchSubtitle, { color: screenColors.textSecondary }]}>
                      {t('email_verified_desc')}
                    </Text>
                  </View>
                </View>
                <View style={[styles.switch, { 
                  backgroundColor: formData.is_email_verified ? screenColors.primary : screenColors.border 
                }]}>
                  <View style={[styles.switchThumb, { 
                    transform: [{ translateX: formData.is_email_verified ? 20 : 2 }] 
                  }]} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Preferences */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: screenColors.text }]}>{t('preferences')}</Text>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.label, { color: screenColors.text }]}>{t('language')}</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: screenColors.card, 
                    borderColor: screenColors.border,
                    color: screenColors.text 
                  }]}
                  value={formData.preferred_language}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, preferred_language: text }))}
                  placeholder="en"
                  placeholderTextColor={screenColors.textSecondary}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.label, { color: screenColors.text }]}>{t('currency')}</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: screenColors.card, 
                    borderColor: screenColors.border,
                    color: screenColors.text 
                  }]}
                  value={formData.preferred_currency}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, preferred_currency: text }))}
                  placeholder="EUR"
                  placeholderTextColor={screenColors.textSecondary}
                  autoCapitalize="characters"
                />
              </View>
            </View>

          </ScrollView>
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
          <Text style={[styles.headerTitle, { color: screenColors.text }]}>{t('user_management_title')}</Text>
                      <Text style={[styles.headerSubtitle, { color: screenColors.textSecondary }]}>
              {t('user_management_desc')}
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
          <Text style={styles.addButtonText}>{t('add_user')}</Text>
        </TouchableOpacity>
      </View>

      {/* Users List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={screenColors.primary} />
          <Text style={[styles.loadingText, { color: screenColors.textSecondary }]}>
            Loading users...
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.user_id}
          renderItem={renderUserItem}
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
              <Ionicons name="people-outline" size={64} color={screenColors.textSecondary} />
              <Text style={[styles.emptyText, { color: screenColors.textSecondary }]}>
                No users found
              </Text>
              <Text style={[styles.emptySubtext, { color: screenColors.textSecondary }]}>
                Add your first user to get started
              </Text>
            </View>
          }
        />
      )}

      {/* Form Modals */}
      {renderFormModal(showAddModal, () => setShowAddModal(false), 'Add New User')}
      {renderFormModal(showEditModal, () => setShowEditModal(false), 'Edit User')}
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
  userCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userAvatar: {
    marginRight: 12,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  userUsername: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  userActions: {
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
  userDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
  },
  statusBadges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
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
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  switchContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  switchSubtitle: {
    fontSize: 12,
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
});

export default UserManagementScreen; 