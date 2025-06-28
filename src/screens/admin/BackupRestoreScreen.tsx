import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, ScrollView, Alert, TextInput, Modal, FlatList, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/Colors';
import { BackupService, BackupSummary, RestoreOptions } from '../../services/backupService';
import { showSuccessToast, showErrorToast, showWarningToast } from '../../utils/toastUtils';

const BackupRestoreScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  // State management
  const [backups, setBackups] = useState<BackupSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupSummary | null>(null);
  
  // Create backup form
  const [backupName, setBackupName] = useState('');
  const [backupDescription, setBackupDescription] = useState('');
  
  // Restore options
  const [restoreOptions, setRestoreOptions] = useState<RestoreOptions>({
    restore_vehicles: true,
    restore_pois: true,
    restore_routes: true,
    restore_expenses: false,
    restore_reminders: true,
    restore_trips: false,
    restore_reservations: true,
    restore_messages: true,
    restore_notifications: true,
    restore_chat_groups: true,
  });

  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    border: Colors.DARK.border,
    card: Colors.DARK.card,
  } : {
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    border: Colors.LIGHT.border,
    card: Colors.LIGHT.card,
  };

  // Load backups on component mount
  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    setIsLoading(true);
    try {
      const result = await BackupService.getUserBackups();
      if (result.success && result.backups) {
        setBackups(result.backups);
      } else {
        showErrorToast(result.error || t('backup.error.load_failed'));
      }
    } catch (error) {
      showErrorToast(t('backup.error.load_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    if (!backupName.trim()) {
      showWarningToast(t('backup.error.name_required'));
      return;
    }

    setIsLoading(true);
    try {
      const result = await BackupService.createBackup(
        backupName.trim(),
        backupDescription.trim() || undefined,
        'manual'
      );

      if (result.success) {
        showSuccessToast(t('backup.success.created'));
        setShowCreateModal(false);
        setBackupName('');
        setBackupDescription('');
        await loadBackups(); // Refresh list
      } else {
        showErrorToast(result.error || t('backup.error.create_failed'));
      }
    } catch (error) {
      showErrorToast(t('backup.error.create_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreBackup = async () => {
    if (!selectedBackup) return;

    // Validate restore options
    if (!BackupService.validateRestoreOptions(restoreOptions)) {
      showWarningToast(t('backup.error.no_restore_options'));
      return;
    }

    setIsLoading(true);
    try {
      const result = await BackupService.restoreBackup(selectedBackup.backup_id, restoreOptions);

      if (result.success) {
        showSuccessToast(t('backup.success.restored', { count: result.total_restored }));
        setShowRestoreModal(false);
        setSelectedBackup(null);
      } else {
        showErrorToast(result.error || t('backup.error.restore_failed'));
      }
    } catch (error) {
      showErrorToast(t('backup.error.restore_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBackup = (backup: BackupSummary) => {
    Alert.alert(
      t('backup.delete.title'),
      t('backup.delete.message', { name: backup.backup_name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('backup.actions.delete'),
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const result = await BackupService.deleteBackup(backup.backup_id);
              if (result.success) {
                showSuccessToast(t('backup.success.deleted'));
                await loadBackups();
              } else {
                showErrorToast(result.error || t('backup.error.delete_failed'));
              }
            } catch (error) {
              showErrorToast(t('backup.error.delete_failed'));
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const formatBackupSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderBackupItem = ({ item }: { item: BackupSummary }) => (
    <View style={[styles.backupItem, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
      <View style={styles.backupHeader}>
        <View style={styles.backupInfo}>
          <Text style={[styles.backupName, { color: screenColors.text }]}>{item.backup_name}</Text>
          <Text style={[styles.backupDate, { color: screenColors.textSecondary }]}>
            {formatDate(item.created_at)}
          </Text>
        </View>
        <View style={styles.backupActions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: Colors.SUCCESS }]}
            onPress={() => {
              setSelectedBackup(item);
              setShowRestoreModal(true);
            }}
          >
            <Ionicons name="refresh" size={16} color={Colors.WHITE} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: Colors.DANGER }]}
            onPress={() => handleDeleteBackup(item)}
          >
            <Ionicons name="trash" size={16} color={Colors.WHITE} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.backupStats}>
        <Text style={[styles.backupSize, { color: screenColors.textSecondary }]}>
          {formatBackupSize(item.backup_size_bytes)} • {item.total_records} {t('backup.stats.records', 'records')}
        </Text>
        <View style={styles.statsRow}>
          <Text style={[styles.statItem, { color: screenColors.textSecondary }]}>
            🚗 {item.vehicle_count} • 📍 {item.poi_count} • 🛣️ {item.route_count}
          </Text>
        </View>
      </View>
      
      {item.backup_description && (
        <Text style={[styles.backupDescription, { color: screenColors.textSecondary }]}>
          {item.backup_description}
        </Text>
      )}
    </View>
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
          <Text style={[styles.headerTitle, { color: screenColors.text }]}>
            {t('backup.title')}
          </Text>
          <Text style={[styles.headerSubtitle, { color: screenColors.textSecondary }]}>
            {t('backup.admin_description', 'Manage system backups and data restoration')}
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content}>
        {/* Create Backup Card */}
        <View style={[styles.card, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="cloud-upload-outline" size={24} color={Colors.PRIMARY} />
            <Text style={[styles.cardTitle, { color: screenColors.text }]}>
              {t('backup.create.title')}
            </Text>
          </View>
          <Text style={[styles.cardDescription, { color: screenColors.textSecondary }]}>
            {t('backup.create.description', 'Create a new backup of your data')}
          </Text>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: Colors.PRIMARY }]}
            onPress={() => setShowCreateModal(true)}
            disabled={isLoading}
          >
            <Text style={styles.actionButtonText}>
              {t('backup.actions.create')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Restore Card */}
        <View style={[styles.card, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="cloud-download-outline" size={24} color={Colors.SUCCESS} />
            <Text style={[styles.cardTitle, { color: screenColors.text }]}>
              {t('backup.restore.title', 'Restore Data')}
            </Text>
          </View>
          <Text style={[styles.cardDescription, { color: screenColors.textSecondary }]}>
            {t('backup.restore.description', 'Restore data from a previous backup')}
          </Text>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: Colors.SUCCESS }]}
            onPress={() => setShowHistoryModal(true)}
            disabled={isLoading}
          >
            <Text style={styles.actionButtonText}>
              {t('backup.actions.restore')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Backup History Card */}
        <View style={[styles.card, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="list-outline" size={24} color={Colors.WARNING} />
            <Text style={[styles.cardTitle, { color: screenColors.text }]}>
              {t('backup.history.title')}
            </Text>
          </View>
          <Text style={[styles.cardDescription, { color: screenColors.textSecondary }]}>
            {t('backup.history.description', 'View and manage existing backups')}
          </Text>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: Colors.WARNING }]}
            onPress={() => setShowHistoryModal(true)}
            disabled={isLoading}
          >
            <Text style={styles.actionButtonText}>
              {t('backup.history.button', 'View History')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Create Backup Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: screenColors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: screenColors.border }]}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={[styles.modalCancel, { color: Colors.PRIMARY }]}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: screenColors.text }]}>
              {t('backup.create.title')}
            </Text>
            <TouchableOpacity onPress={handleCreateBackup} disabled={isLoading}>
              <Text style={[styles.modalSave, { color: Colors.PRIMARY }]}>{t('backup.actions.create')}</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: screenColors.text }]}>
                {t('backup.create.name_placeholder')}
              </Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: screenColors.card, borderColor: screenColors.border, color: screenColors.text }]}
                value={backupName}
                onChangeText={setBackupName}
                placeholder={t('backup.create.name_placeholder')}
                placeholderTextColor={screenColors.textSecondary}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: screenColors.text }]}>
                {t('backup.create.description_placeholder')}
              </Text>
              <TextInput
                style={[styles.textInput, styles.textArea, { backgroundColor: screenColors.card, borderColor: screenColors.border, color: screenColors.text }]}
                value={backupDescription}
                onChangeText={setBackupDescription}
                placeholder={t('backup.create.description_placeholder')}
                placeholderTextColor={screenColors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Backup History Modal */}
      <Modal
        visible={showHistoryModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: screenColors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: screenColors.border }]}>
            <TouchableOpacity onPress={() => setShowHistoryModal(false)}>
              <Text style={[styles.modalCancel, { color: Colors.PRIMARY }]}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: screenColors.text }]}>
              {t('backup.history.title')}
            </Text>
            <TouchableOpacity onPress={loadBackups}>
              <Ionicons name="refresh" size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            {backups.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="archive-outline" size={64} color={screenColors.textSecondary} />
                <Text style={[styles.emptyStateText, { color: screenColors.textSecondary }]}>
                  {t('backup.empty_state')}
                </Text>
              </View>
            ) : (
              <FlatList
                data={backups}
                keyExtractor={(item) => item.backup_id}
                renderItem={renderBackupItem}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </SafeAreaView>
      </Modal>

      {/* Restore Modal */}
      <Modal
        visible={showRestoreModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: screenColors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: screenColors.border }]}>
            <TouchableOpacity onPress={() => setShowRestoreModal(false)}>
              <Text style={[styles.modalCancel, { color: Colors.PRIMARY }]}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: screenColors.text }]}>
              {t('backup.restore.title', { name: selectedBackup?.backup_name || '' })}
            </Text>
            <TouchableOpacity onPress={handleRestoreBackup} disabled={isLoading}>
              <Text style={[styles.modalSave, { color: Colors.PRIMARY }]}>{t('backup.actions.restore')}</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={[styles.restoreDescription, { color: screenColors.textSecondary }]}>
              {t('backup.restore.description')}
            </Text>
            
            {Object.entries(restoreOptions).map(([key, value]) => (
              <View key={key} style={[styles.optionRow, { borderBottomColor: screenColors.border }]}>
                <Text style={[styles.optionLabel, { color: screenColors.text }]}>
                  {t(`backup.options.${key}`, key.replace('restore_', '').replace('_', ' '))}
                </Text>
                <Switch
                  value={value}
                  onValueChange={(newValue) => 
                    setRestoreOptions(prev => ({ ...prev, [key]: newValue }))
                  }
                  trackColor={{ false: screenColors.border, true: Colors.PRIMARY }}
                  thumbColor={Colors.WHITE}
                />
              </View>
            ))}
          </ScrollView>
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
  content: {
    padding: 20,
  },
  card: {
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 10,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cardDescription: {
    marginBottom: 20,
  },
  actionButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
  },
  modalCancel: {
    padding: 10,
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalSave: {
    padding: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  backupItem: {
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 10,
    marginBottom: 20,
  },
  backupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backupInfo: {
    flex: 1,
  },
  backupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backupDate: {
    fontSize: 14,
  },
  backupActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionBtn: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  backupStats: {
    marginTop: 10,
  },
  backupSize: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statItem: {
    marginLeft: 5,
  },
  backupDescription: {
    marginTop: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: Colors.BORDER,
  },
  optionLabel: {
    flex: 1,
  },
  restoreDescription: {
    marginBottom: 20,
  },
});

export default BackupRestoreScreen; 