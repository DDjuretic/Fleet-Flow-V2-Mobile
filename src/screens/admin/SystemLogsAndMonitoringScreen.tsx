import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';

// API
import { 
  useGetSystemLogsQuery, 
  useGetSystemLogStatsQuery,
  useResolveSystemLogMutation,
  DbSystemLog 
} from '../../store/api/supabaseApi';

interface SystemLogsAndMonitoringScreenProps {
  navigation: any;
}

export default function SystemLogsAndMonitoringScreen({ navigation }: SystemLogsAndMonitoringScreenProps) {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const screenColors = themeMode === 'dark' ? Colors.DARK : Colors.LIGHT;

  // Filter states
  const [selectedSeverity, setSelectedSeverity] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [showResolvedOnly, setShowResolvedOnly] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Resolution modal states
  const [showResolutionModal, setShowResolutionModal] = useState<boolean>(false);
  const [selectedLog, setSelectedLog] = useState<DbSystemLog | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState<string>('');

  // API hooks
  const { 
    data: logs = [], 
    isLoading, 
    error, 
    refetch 
  } = useGetSystemLogsQuery({
    limit: 100,
    severity: selectedSeverity || undefined,
    logType: selectedType || undefined,
    resolved: showResolvedOnly ? true : undefined,
  });

  const { data: stats } = useGetSystemLogStatsQuery();
  const [resolveLog, { isLoading: isResolving }] = useResolveSystemLogMutation();

  const severityLevels = [
    { id: '', label: 'All', color: screenColors.textSecondary },
    { id: 'LOW', label: 'Low', color: '#10B981' },
    { id: 'MEDIUM', label: 'Medium', color: '#F59E0B' },
    { id: 'HIGH', label: 'High', color: '#EF4444' },
    { id: 'CRITICAL', label: 'Critical', color: '#DC2626' },
  ];

  const logTypes = [
    { id: '', label: 'All Types' },
    { id: 'FUEL_EXCESS', label: '⛽ Fuel Excess' },
    { id: 'HIGH_EXPENSE', label: '💰 High Expense' },
    { id: 'SUSPICIOUS_PATTERN', label: '🔍 Suspicious Pattern' },
    { id: 'SYSTEM_EVENT', label: '⚙️ System Event' },
  ];

  const getSeverityColor = (severity: string) => {
    const level = severityLevels.find(s => s.id === severity);
    return level?.color || screenColors.textSecondary;
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'alert-circle';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'information-circle';
      case 'LOW': return 'checkmark-circle';
      default: return 'help-circle';
    }
  };

  const getLogTypeIcon = (logType: string) => {
    switch (logType) {
      case 'FUEL_EXCESS': return 'car';
      case 'HIGH_EXPENSE': return 'cash';
      case 'SUSPICIOUS_PATTERN': return 'shield-checkmark';
      case 'SYSTEM_EVENT': return 'cog';
      default: return 'document-text';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleResolveLog = (log: DbSystemLog) => {
    setSelectedLog(log);
    setShowResolutionModal(true);
  };

  const submitResolution = async () => {
    if (!selectedLog) return;

    try {
      await resolveLog({
        logId: selectedLog.log_id,
        resolutionNotes: resolutionNotes.trim() || undefined,
      }).unwrap();

      Alert.alert(
        '✅ Resolved',
        'Log has been marked as resolved successfully.',
        [{ text: 'OK' }]
      );

      setShowResolutionModal(false);
      setSelectedLog(null);
      setResolutionNotes('');
    } catch (error: any) {
      console.error('Error resolving log:', error);
      Alert.alert('❌ Error', 'Failed to resolve log. Please try again.');
    }
  };

  const renderLogItem = ({ item }: { item: DbSystemLog }) => {
    const severityColor = getSeverityColor(item.severity);
    const metadata = (item.metadata as any) || {};

    return (
      <TouchableOpacity 
        style={[
          styles.logItem, 
          { 
            backgroundColor: screenColors.card,
            borderLeftColor: severityColor,
            opacity: item.is_resolved ? 0.7 : 1,
          }
        ]}
        onPress={() => {
          const vehicleInfo = item.related_vehicle ? `\n🚗 Vehicle: ${item.related_vehicle.make} ${item.related_vehicle.model} (${item.related_vehicle.license_plate})` : '';
          const expenseInfo = item.related_expense ? `\n💰 Expense: €${item.related_expense.amount} - ${item.related_expense.description}` : '';
          
          Alert.alert(
            `${item.severity} - ${item.title}`,
            `${item.description || 'No description'}${vehicleInfo}${expenseInfo}\n\n👤 User: ${item.users?.first_name} ${item.users?.last_name}\n🕒 Time: ${formatDate(item.created_at)}${item.is_resolved ? '\n\n✅ Resolved' + (item.resolution_notes ? ': ' + item.resolution_notes : '') : ''}`,
            item.is_resolved ? 
              [{ text: 'OK' }] : 
              [
                { text: 'View Details', style: 'cancel' },
                { text: 'Mark Resolved', onPress: () => handleResolveLog(item) }
              ]
          );
        }}
        activeOpacity={0.7}
      >
        <View style={styles.logHeader}>
          <View style={styles.logTitleRow}>
            <View style={[styles.severityIndicator, { backgroundColor: severityColor }]}>
              <Ionicons 
                name={getSeverityIcon(item.severity)} 
                size={12} 
                color="white" 
              />
            </View>
            <Text style={[styles.logTitle, { color: screenColors.text }]} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.logTypeIcon}>
              <Ionicons 
                name={getLogTypeIcon(item.log_type)} 
                size={16} 
                color={screenColors.primary} 
              />
            </View>
          </View>
          <Text style={[styles.logTime, { color: screenColors.textSecondary }]}>
            {formatDate(item.created_at)}
          </Text>
        </View>

        <Text style={[styles.logDescription, { color: screenColors.textSecondary }]} numberOfLines={2}>
          {item.description || 'No description'}
        </Text>

        {/* Metadata display */}
        {metadata && Object.keys(metadata).length > 0 && (
          <View style={styles.metadataContainer}>
            {metadata.expense_amount && (
              <Text style={[styles.metadataText, { color: screenColors.textSecondary }]}>
                💰 €{metadata.expense_amount}
              </Text>
            )}
            {metadata.fuel_amount && (
              <Text style={[styles.metadataText, { color: screenColors.textSecondary }]}>
                ⛽ {metadata.fuel_amount}L
              </Text>
            )}
            {metadata.vehicle_tank_capacity && (
              <Text style={[styles.metadataText, { color: screenColors.textSecondary }]}>
                🛢️ Capacity: {metadata.vehicle_tank_capacity}L
              </Text>
            )}
            {metadata.excess_amount && (
              <Text style={[styles.metadataText, { color: '#EF4444' }]}>
                ⚠️ Excess: +{metadata.excess_amount}L
              </Text>
            )}
          </View>
        )}

        <View style={styles.logFooter}>
          <Text style={[styles.logUser, { color: screenColors.textSecondary }]}>
            👤 {item.users?.first_name} {item.users?.last_name}
          </Text>
          {item.is_resolved ? (
            <View style={[styles.resolvedBadge, { backgroundColor: '#10B981' }]}>
              <Text style={styles.resolvedText}>✅ Resolved</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.resolveButton, { borderColor: screenColors.primary }]}
              onPress={() => handleResolveLog(item)}
            >
              <Text style={[styles.resolveButtonText, { color: screenColors.primary }]}>
                Resolve
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderStatsHeader = () => {
    if (!stats) return null;

    return (
      <View style={[styles.statsContainer, { backgroundColor: screenColors.card }]}>
        <Text style={[styles.statsTitle, { color: screenColors.text }]}>
          🛡️ Security & Monitoring Dashboard
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: screenColors.primary }]}>
              {stats.total}
            </Text>
            <Text style={[styles.statLabel, { color: screenColors.textSecondary }]}>
              Total Events
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#EF4444' }]}>
              {stats.unresolved}
            </Text>
            <Text style={[styles.statLabel, { color: screenColors.textSecondary }]}>
              Need Attention
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#F59E0B' }]}>
              {stats.recent24h}
            </Text>
            <Text style={[styles.statLabel, { color: screenColors.textSecondary }]}>
              Last 24h
            </Text>
          </View>
        </View>

        {/* Severity breakdown */}
        <View style={styles.severityBreakdown}>
          {Object.entries(stats.bySeverity).map(([severity, count]) => (
            <View key={severity} style={styles.severityItem}>
              <View style={[styles.severityDot, { backgroundColor: getSeverityColor(severity) }]} />
              <Text style={[styles.severityText, { color: screenColors.textSecondary }]}>
                {severity}: {count}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderFiltersModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowFilters(false)}
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: screenColors.background }]}>
        <View style={[styles.modalHeader, { backgroundColor: screenColors.card, borderBottomColor: screenColors.border }]}>
          <Text style={[styles.modalTitle, { color: screenColors.text }]}>Filter System Logs</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Ionicons name="close" size={24} color={screenColors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.filterContent}>
          {/* Severity Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterSectionTitle, { color: screenColors.text }]}>🚨 Severity Level</Text>
            <View style={styles.filterOptionsRow}>
              {severityLevels.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.filterOption,
                    {
                      backgroundColor: selectedSeverity === level.id ? level.color + '20' : screenColors.card,
                      borderColor: selectedSeverity === level.id ? level.color : screenColors.border,
                    }
                  ]}
                  onPress={() => setSelectedSeverity(level.id)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    { color: selectedSeverity === level.id ? level.color : screenColors.text }
                  ]}>
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Log Type Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterSectionTitle, { color: screenColors.text }]}>📂 Event Type</Text>
            <View style={styles.filterOptionsColumn}>
              {logTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.filterOptionRow,
                    {
                      backgroundColor: selectedType === type.id ? screenColors.primary + '20' : screenColors.card,
                      borderColor: selectedType === type.id ? screenColors.primary : screenColors.border,
                    }
                  ]}
                  onPress={() => setSelectedType(type.id)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    { color: selectedType === type.id ? screenColors.primary : screenColors.text }
                  ]}>
                    {type.label}
                  </Text>
                  {selectedType === type.id && (
                    <Ionicons name="checkmark" size={16} color={screenColors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Status Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterSectionTitle, { color: screenColors.text }]}>✅ Status</Text>
            <TouchableOpacity
              style={[
                styles.filterOptionRow,
                {
                  backgroundColor: showResolvedOnly ? screenColors.primary + '20' : screenColors.card,
                  borderColor: showResolvedOnly ? screenColors.primary : screenColors.border,
                }
              ]}
              onPress={() => setShowResolvedOnly(!showResolvedOnly)}
            >
              <Text style={[
                styles.filterOptionText,
                { color: showResolvedOnly ? screenColors.primary : screenColors.text }
              ]}>
                Show Resolved Only
              </Text>
              {showResolvedOnly && (
                <Ionicons name="checkmark" size={16} color={screenColors.primary} />
              )}
            </TouchableOpacity>
          </View>

          {/* Clear Filters Button */}
          <TouchableOpacity
            style={[styles.clearFiltersButton, { borderColor: screenColors.textSecondary }]}
            onPress={() => {
              setSelectedSeverity('');
              setSelectedType('');
              setShowResolvedOnly(false);
            }}
          >
            <Text style={[styles.clearFiltersText, { color: screenColors.textSecondary }]}>
              🗑️ Clear All Filters
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderResolutionModal = () => (
    <Modal
      visible={showResolutionModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowResolutionModal(false)}
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: screenColors.background }]}>
        <View style={[styles.modalHeader, { backgroundColor: screenColors.card, borderBottomColor: screenColors.border }]}>
          <Text style={[styles.modalTitle, { color: screenColors.text }]}>🔧 Resolve Security Event</Text>
          <TouchableOpacity onPress={() => setShowResolutionModal(false)}>
            <Ionicons name="close" size={24} color={screenColors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.resolutionContent}>
          <Text style={[styles.resolutionLogTitle, { color: screenColors.text }]}>
            {selectedLog?.title}
          </Text>
          <Text style={[styles.resolutionLogDescription, { color: screenColors.textSecondary }]}>
            {selectedLog?.description}
          </Text>

          {/* Show metadata details */}
          {selectedLog?.metadata && (
            <View style={[styles.metadataDetailContainer, { backgroundColor: screenColors.card }]}>
              <Text style={[styles.metadataDetailTitle, { color: screenColors.text }]}>
                📊 Event Details:
              </Text>
              {Object.entries(selectedLog.metadata).map(([key, value]) => (
                <Text key={key} style={[styles.metadataDetailText, { color: screenColors.textSecondary }]}>
                  • {key.replace(/_/g, ' ')}: {String(value)}
                </Text>
              ))}
            </View>
          )}

          <Text style={[styles.resolutionNotesLabel, { color: screenColors.text }]}>
            📝 Resolution Notes (Optional)
          </Text>
          <TextInput
            style={[
              styles.resolutionNotesInput,
              {
                backgroundColor: screenColors.card,
                borderColor: screenColors.border,
                color: screenColors.text,
              }
            ]}
            value={resolutionNotes}
            onChangeText={setResolutionNotes}
            placeholder="Explain how this security event was resolved or why it can be dismissed..."
            placeholderTextColor={screenColors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.resolveSubmitButton, { backgroundColor: screenColors.primary }]}
            onPress={submitResolution}
            disabled={isResolving}
          >
            <Text style={styles.resolveSubmitText}>
              {isResolving ? '⏳ Resolving...' : '✅ Mark as Resolved'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={64} color={screenColors.textSecondary} />
          <Text style={[styles.errorText, { color: screenColors.text }]}>
            Failed to load security monitoring data
          </Text>
          <TouchableOpacity style={[styles.retryButton, { borderColor: screenColors.primary }]} onPress={refetch}>
            <Text style={[styles.retryButtonText, { color: screenColors.primary }]}>🔄 Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: screenColors.card, borderBottomColor: screenColors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={screenColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: screenColors.text }]}>🛡️ System Monitoring</Text>
        <TouchableOpacity onPress={() => setShowFilters(true)} style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color={screenColors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={logs}
        renderItem={renderLogItem}
        keyExtractor={(item) => item.log_id}
        ListHeaderComponent={renderStatsHeader}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={screenColors.primary}
            colors={[screenColors.primary]}
          />
        }
        contentContainerStyle={logs.length === 0 ? styles.emptyContainer : styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="shield-checkmark-outline" size={64} color={screenColors.textSecondary} />
            <Text style={[styles.emptyStateText, { color: screenColors.text }]}>
              🛡️ All Secure
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: screenColors.textSecondary }]}>
              No security events detected. The system is monitoring for unusual activities like fuel capacity violations, high expenses, and suspicious patterns.
            </Text>
          </View>
        }
      />

      {renderFiltersModal()}
      {renderResolutionModal()}
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  filterButton: {
    padding: 8,
  },
  statsContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  severityBreakdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  severityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 2,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  severityText: {
    fontSize: 11,
  },
  listContainer: {
    paddingBottom: 16,
  },
  logItem: {
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  logTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  severityIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  logTypeIcon: {
    marginLeft: 8,
  },
  logTime: {
    fontSize: 12,
    marginLeft: 8,
  },
  logDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  metadataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  metadataText: {
    fontSize: 12,
    marginRight: 12,
    marginBottom: 4,
  },
  metadataDetailContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  metadataDetailTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  metadataDetailText: {
    fontSize: 12,
    marginBottom: 4,
  },
  logFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logUser: {
    fontSize: 12,
  },
  resolvedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resolvedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  resolveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  resolveButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  filterContent: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOptionsColumn: {
    flexDirection: 'column',
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  clearFiltersButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 16,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resolutionContent: {
    flex: 1,
    padding: 16,
  },
  resolutionLogTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  resolutionLogDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  resolutionNotesLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  resolutionNotesInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    marginBottom: 24,
  },
  resolveSubmitButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resolveSubmitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
}); 