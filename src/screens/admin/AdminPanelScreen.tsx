import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/navigation';
import Colors from '../../constants/Colors';
import { useGetPendingReservationsQuery, useGetPendingUserRequestsQuery } from '../../store/api/supabaseApi';
import { useTranslation } from 'react-i18next';

interface AdminSection {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen: keyof RootStackParamList;
  color: string;
  isActive: boolean;
  badge?: number;
}

type AdminPanelScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const AdminPanelScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<AdminPanelScreenNavigationProp>();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const [refreshing, setRefreshing] = useState(false);

  // Get pending reservations count
  const { data: pendingReservations } = useGetPendingReservationsQuery();
  const pendingCount = pendingReservations?.length || 0;

  // Get pending user requests count
  const { data: pendingUserRequests } = useGetPendingUserRequestsQuery();
  const pendingUserRequestsCount = pendingUserRequests?.length || 0;

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

  const systemSections: AdminSection[] = [
    {
      id: 'pending_reservations',
      title: t('pending_reservations', 'Pending Reservations'),
      description: t('reservations_waiting_approval', 'Reservations waiting for approval'),
      icon: 'time-outline',
      screen: 'PendingReservations',
      color: screenColors.warning,
      isActive: true,
      badge: pendingCount
    },
    {
      id: 'admin_roles',
      title: t('admin_role_management.title'),
      description: t('admin_role_management.description'),
      icon: 'shield-checkmark-outline',
      screen: 'AdminRoleManagement',
      color: screenColors.primary,
      isActive: true
    }
  ];

  const dataManagementSections: AdminSection[] = [
    {
      id: 'pois',
      title: t('poi_management'),
      description: t('poi_management_desc'),
      icon: 'location-outline',
      screen: 'POIManagement',
      color: '#FF6B6B',
      isActive: true
    },
    {
      id: 'routes',
      title: t('route_management'), 
      description: t('route_management_desc'),
      icon: 'map-outline',
      screen: 'RouteManagement',
      color: '#4ECDC4',
      isActive: true
    },
    {
      id: 'fuel',
      title: t('fuel_price_management'),
      description: t('fuel_price_management_desc'),
      icon: 'car-sport-outline',
      screen: 'FuelPriceManagement', 
      color: '#45B7D1',
      isActive: true
    }
  ];

  const reportsAnalyticsSections: AdminSection[] = [
    {
      id: 'reports_analytics',
      title: t('reports_analytics'),
      description: t('reports_analytics_desc'),
      icon: 'stats-chart-outline',
      screen: 'ReportsAnalytics',
      color: '#8B5CF6',
      isActive: true
    }
  ];

  const systemMonitoringSections: AdminSection[] = [
    {
      id: 'system_logs_monitoring',
      title: t('system_logs_monitoring', 'System Logs & Monitoring'),
      description: t('system_logs_monitoring_desc', 'Monitor unusual activities, fuel violations, and security events'),
      icon: 'shield-checkmark-outline',
      screen: 'SystemLogsAndMonitoring',
      color: '#DC2626',
      isActive: true,
      // badge will be populated with unresolved logs count
    }
  ];

  const userRequestsSections: AdminSection[] = [
    {
      id: 'user_requests',
      title: t('user_requests'),
      description: t('user_requests_desc'),
      icon: 'checkmark-done-outline',
      screen: 'UserRequests',
      color: '#F59E0B',
      isActive: true,
      badge: pendingUserRequestsCount
    }
  ];

  const companySettingsSections: AdminSection[] = [
    {
      id: 'company_settings',
      title: t('company_settings'),
      description: t('company_settings_desc'),
      icon: 'business-outline',
      screen: 'CompanySettings',
      color: '#1F2937',
      isActive: true
    }
  ];

  const userManagementSections: AdminSection[] = [
    {
      id: 'users',
      title: t('user_management'),
      description: t('user_management_desc'),
      icon: 'people-outline',
      screen: 'UserManagement',
      color: '#96CEB4',
      isActive: true
    },
    {
      id: 'vehicles',
      title: t('vehicle_management'),
      description: t('vehicle_management_desc'),
      icon: 'car-outline',
      screen: 'VehicleManagement',
      color: '#A855F7',
      isActive: true
    },

  ];

  // System Operations
  const systemOperationsSections: AdminSection[] = [
    {
      id: 'backup_restore',
      title: t('backup.title', 'Backup & Restore'),
      description: t('backup.admin_description', 'Create backups and restore system data'),
      icon: 'archive-outline',
      screen: 'BackupRestore' as keyof RootStackParamList,
      color: '#059669',
      isActive: true
    }
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleSectionPress = (section: AdminSection) => {
    if (!section.isActive) {
      Alert.alert(
        t('coming_soon', 'Coming Soon'),
        t('feature_future_updates', `${section.title} will be implemented in future updates.`),
        [{ text: t('common.ok', 'OK') }]
      );
      return;
    }

    try {
      (navigation.navigate as any)(section.screen);
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert(t('common.error', 'Error'), t('navigation_error', 'Could not navigate to this screen.'));
    }
  };

  const renderBadge = (count?: number) => {
    if (!count || count === 0) return null;
    
    return (
      <View style={[styles.badge, { backgroundColor: screenColors.danger }]}>
        <Text style={styles.badgeText}>{count > 99 ? '99+' : count.toString()}</Text>
      </View>
    );
  };

  const renderAdminSection = (section: AdminSection) => (
    <TouchableOpacity
      key={section.id}
      style={[
        styles.sectionCard, 
        { 
          backgroundColor: screenColors.card, 
          borderColor: screenColors.border,
          borderLeftColor: section.color,
          opacity: section.isActive ? 1 : 0.6
        }
      ]}
      onPress={() => handleSectionPress(section)}
      disabled={!section.isActive}
    >
      <View style={styles.sectionIcon}>
        <Ionicons 
          name={section.icon} 
          size={32} 
          color={section.color} 
        />
        {renderBadge(section.badge)}
      </View>
      
      <View style={styles.sectionContent}>
        <Text style={[styles.sectionTitle, { color: screenColors.text }]}>
          {section.title}
        </Text>
        <Text style={[styles.sectionDescription, { color: screenColors.textSecondary }]}>
          {section.description}
        </Text>
        {!section.isActive && (
          <Text style={[styles.comingSoonText, { color: screenColors.warning }]}>
            {t('coming_soon_text')}
          </Text>
        )}
      </View>
      
      <View style={styles.sectionArrow}>
        <Ionicons 
          name="chevron-forward" 
          size={24} 
          color={screenColors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );

  const renderSectionGroup = (title: string, sections: AdminSection[]) => (
    <View style={styles.sectionGroup}>
      <Text style={[styles.groupTitle, { color: screenColors.text }]}>{title}</Text>
      {sections.map(renderAdminSection)}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
      {/* Header with back navigation */}
      <View style={[styles.header, { backgroundColor: screenColors.background, borderBottomColor: screenColors.border }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={screenColors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: screenColors.text }]}>{t('admin_panel_title')}</Text>
          <Text style={[styles.headerSubtitle, { color: screenColors.textSecondary }]}>
            {t('system_data_management')}
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.warningCard, { backgroundColor: screenColors.warning + '20', borderColor: screenColors.warning }]}>
          <Ionicons name="warning" size={24} color={screenColors.warning} />
          <Text style={[styles.warningText, { color: screenColors.text }]}>
            {t('warning_admin_functions')}
          </Text>
        </View>

        {renderSectionGroup(t('system_operations'), systemSections)}
        {renderSectionGroup(t('security_monitoring', 'Security & Monitoring'), systemMonitoringSections)}
        {renderSectionGroup(t('data_management'), dataManagementSections)}
        {renderSectionGroup(t('user_vehicle_management'), userManagementSections)}
        {renderSectionGroup(t('user_requests_group'), userRequestsSections)}
        {renderSectionGroup(t('company_management'), companySettingsSections)}
        {renderSectionGroup(t('reports_analytics_group'), reportsAnalyticsSections)}
        {systemOperationsSections.length > 0 && renderSectionGroup(t('system_operations_group', 'System Operations'), systemOperationsSections)}


      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
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
    flex: 1,
    padding: 20,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF5F5',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
    marginBottom: 20,
    alignItems: 'center',
  },
  warningText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#C53030',
    lineHeight: 20,
  },
  sectionsContainer: {
    marginBottom: 20,
  },
  sectionCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionIcon: {
    marginRight: 15,
    position: 'relative',
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.BLACK,
    marginBottom: 5,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.GRAY,
    lineHeight: 18,
  },
  sectionArrow: {
    marginLeft: 10,
  },

  backButton: {
    padding: 10,
  },
  headerContent: {
    flex: 1,
    marginLeft: 15,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.DANGER,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.WARNING,
  },
  sectionGroup: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.BLACK,
    marginBottom: 10,
  },
});

export default AdminPanelScreen; 