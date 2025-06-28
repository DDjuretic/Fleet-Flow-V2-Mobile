import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store/rootReducer';
import { useGetPendingUserRequestsQuery, useApproveUserRequestMutation, useRejectUserRequestMutation, DbUserRequest } from '../../store/api/supabaseApi';
import { useAuth } from '../../contexts/AuthContext';
import Colors from '../../constants/Colors';

const UserRequestsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const [refreshing, setRefreshing] = useState(false);

  // API hooks
  const { data: requests = [], error, isLoading, refetch } = useGetPendingUserRequestsQuery();
  const [approveRequest] = useApproveUserRequestMutation();
  const [rejectRequest] = useRejectUserRequestMutation();

  const screenColors = themeMode === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    card: Colors.DARK.card,
    border: Colors.DARK.border,
    primary: Colors.DARK.primary,
    success: Colors.SUCCESS,
    danger: Colors.DANGER,
    warning: Colors.WARNING,
  } : {
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    card: Colors.LIGHT.card,
    border: Colors.LIGHT.border,
    primary: Colors.LIGHT.primary,
    success: Colors.SUCCESS,
    danger: Colors.DANGER,
    warning: Colors.WARNING,
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing user requests:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'personal_info': return 'person-outline';
      case 'work_info': return 'briefcase-outline';
      case 'contact_info': return 'call-outline';
      case 'emergency_contact': return 'medical-outline';
      case 'vehicle_info': return 'car-outline';
      default: return 'create-outline';
    }
  };

  const getRequestTypeName = (type: string) => {
    switch (type) {
      case 'personal_info': return t('personal_information');
      case 'work_info': return t('work_information');
      case 'contact_info': return t('contact_information_type');
      case 'emergency_contact': return t('emergency_contact');
      case 'vehicle_info': return t('vehicle_information');
      default: return t('profile_update');
    }
  };

  const handleApprove = (request: DbUserRequest) => {
    if (!user?.id) {
      Alert.alert(t('error'), t('user_not_authenticated'));
      return;
    }

    Alert.alert(
      t('approve_request_btn'),
      t('confirm_approve_user_changes', { userName: request.requested_changes.user_name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('approve'), 
          style: 'default',
          onPress: async () => {
            try {
              await approveRequest({
                requestId: request.request_id,
                approvedByUserId: user.id,
                approvalNotes: 'Request approved by admin'
              }).unwrap();
              
              Alert.alert(t('request_approved_title'), t('request_approved_message'));
            } catch (error) {
              console.error('Error approving request:', error);
              Alert.alert(t('error'), t('failed_to_approve_request'));
            }
          }
        }
      ]
    );
  };

  const handleReject = (request: DbUserRequest) => {
    if (!user?.id) {
      Alert.alert(t('error'), t('user_not_authenticated'));
      return;
    }

    Alert.prompt(
      t('reject_request_btn'),
      t('enter_rejection_reason'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('reject'), 
          style: 'destructive',
          onPress: async (rejectionReason?: string) => {
            if (!rejectionReason?.trim()) {
              Alert.alert(t('error'), t('rejection_reason_required'));
              return;
            }

            try {
              await rejectRequest({
                requestId: request.request_id,
                approvedByUserId: user.id,
                rejectionReason: rejectionReason
              }).unwrap();
              
              Alert.alert(t('request_rejected_title'), t('request_rejected_message'));
            } catch (error) {
              console.error('Error rejecting request:', error);
              Alert.alert(t('error'), t('failed_to_reject_request'));
            }
          }
        }
      ]
    );
  };

  const renderRequestCard = (request: DbUserRequest) => (
    <View key={request.request_id} style={[styles.requestCard, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
      <View style={styles.requestHeader}>
        <View style={styles.requestIconContainer}>
          <Ionicons name={getRequestTypeIcon(request.request_type) as any} size={32} color={screenColors.warning} />
        </View>
        <View style={styles.requestInfo}>
          <Text style={[styles.userName, { color: screenColors.text }]}>{request.requested_changes.user_name}</Text>
          <Text style={[styles.userEmail, { color: screenColors.textSecondary }]}>{request.requested_changes.user_email}</Text>
          <Text style={[styles.requestType, { color: screenColors.textSecondary }]}>
            {getRequestTypeName(request.request_type)}
          </Text>
        </View>
        <View style={styles.requestActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: screenColors.success }]}
            onPress={() => handleApprove(request)}
          >
            <Ionicons name="checkmark" size={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: screenColors.danger }]}
            onPress={() => handleReject(request)}
          >
            <Ionicons name="close" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.changesContainer}>
        <Text style={[styles.changesTitle, { color: screenColors.text }]}>{t('requested_changes')}:</Text>
        {request.requested_changes.changes.map((change, index) => (
          <View key={index} style={styles.changeItem}>
            <Text style={[styles.fieldName, { color: screenColors.primary }]}>{change.field_display}:</Text>
            <View style={styles.changeValues}>
                            <Text style={[styles.oldValue, { color: screenColors.textSecondary }]}>
                 {t('request_from')}: {change.old_value}
              </Text>
              <Ionicons name="arrow-forward" size={16} color={screenColors.textSecondary} />
              <Text style={[styles.newValue, { color: screenColors.text }]}>
                 {t('request_to')}: {change.new_value}
              </Text>
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.requestFooter}>
                <Text style={[styles.requestDate, { color: screenColors.textSecondary }]}>
           {t('request_requested')}: {new Date(request.created_at).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: screenColors.textSecondary }]}>{t('loading')}...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={screenColors.danger} />
          <Text style={[styles.errorText, { color: screenColors.text }]}>{t('error_loading_requests')}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: screenColors.primary }]} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>{t('retry')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={[styles.headerTitle, { color: screenColors.text }]}>{t('user_requests')}</Text>
          <Text style={[styles.headerSubtitle, { color: screenColors.textSecondary }]}>
            {t('user_requests_desc')}
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[screenColors.primary]}
            tintColor={screenColors.primary}
          />
        }
      >
        {requests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-done-circle-outline" size={64} color={screenColors.textSecondary} />
            <Text style={[styles.emptyText, { color: screenColors.textSecondary }]}>
              {t('no_pending_requests')}
            </Text>
            <Text style={[styles.emptySubtext, { color: screenColors.textSecondary }]}>
              {t('all_requests_processed')}
            </Text>
          </View>
        ) : (
          requests.map(renderRequestCard)
        )}
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 10,
  },
  headerContent: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  requestCard: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestIconContainer: {
    padding: 10,
  },
  requestInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  requestType: {
    fontSize: 14,
  },
  requestActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
  },
  changesContainer: {
    marginBottom: 12,
  },
  changesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  changeItem: {
    marginBottom: 8,
  },
  fieldName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  changeValues: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  oldValue: {
    fontSize: 12,
    flex: 1,
  },
  newValue: {
    fontSize: 12,
    flex: 1,
    fontWeight: '500',
  },
  requestFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 8,
  },
  requestDate: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default UserRequestsScreen; 