import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store/rootReducer';
import Colors from '../../constants/Colors';

interface ReportOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  formats: string[];
}

const ReportsAnalyticsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  
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
    info: '#17A2B8',
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
    info: '#17A2B8',
  };

  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const analyticsCards = [
    {
      title: 'Fleet Analytics',
      icon: 'car-outline',
      description: 'Vehicle utilization, performance metrics, and fleet efficiency analysis',
      color: screenColors.primary,
      onPress: () => handleAnalyticsPress('fleet')
    },
    {
      title: 'Trip Analytics', 
      icon: 'map-outline',
      description: 'Trip patterns, distances, popular routes, and travel insights',
      color: screenColors.success,
      onPress: () => handleAnalyticsPress('trips')
    },
    {
      title: 'User Activity',
      icon: 'people-outline',
      description: 'User engagement, reservation patterns, and driver performance',
      color: screenColors.info,
      onPress: () => handleAnalyticsPress('users')
    },
    {
      title: 'Expense Analytics',
      icon: 'wallet-outline', 
      description: 'Cost analysis, budget tracking, and expense trending',
      color: screenColors.warning,
      onPress: () => handleAnalyticsPress('expenses')
    },
    {
      title: 'Fuel Analytics',
      icon: 'speedometer-outline',
      description: 'Fuel consumption, efficiency metrics, and cost optimization',
      color: screenColors.danger,
      onPress: () => handleAnalyticsPress('fuel')
    },
    {
      title: 'Maintenance Analytics',
      icon: 'build-outline',
      description: 'Service schedules, maintenance costs, and vehicle health',
      color: '#9C27B0',
      onPress: () => handleAnalyticsPress('maintenance')
    }
  ];

  const reportOptions: ReportOption[] = [
    {
      id: 'trip_reports',
      name: 'Trip Reports',
      description: 'Detailed trip logs, travel orders (putni nalozi), mileage reports',
      icon: 'document-text-outline',
      color: screenColors.primary,
      formats: ['PDF', 'Excel', 'CSV']
    },
    {
      id: 'expense_reports',
      name: 'Expense Reports',
      description: 'Financial summaries, cost breakdowns, budget vs actual',
      icon: 'receipt-outline',
      color: screenColors.warning,
      formats: ['PDF', 'Excel', 'CSV']
    },
    {
      id: 'fleet_utilization',
      name: 'Fleet Utilization',
      description: 'Vehicle usage statistics, efficiency metrics, availability reports',
      icon: 'stats-chart-outline',
      color: screenColors.success,
      formats: ['PDF', 'Excel']
    },
    {
      id: 'user_activity',
      name: 'User Activity Reports',
      description: 'Driver performance, reservation history, usage patterns',
      icon: 'person-outline',
      color: screenColors.info,
      formats: ['PDF', 'Excel', 'CSV']
    },
    {
      id: 'maintenance_reports',
      name: 'Maintenance Reports',
      description: 'Service records, upcoming maintenance, cost analysis',
      icon: 'construct-outline',
      color: '#9C27B0',
      formats: ['PDF', 'Excel']
    },
    {
      id: 'compliance_reports',
      name: 'Compliance Reports',
      description: 'License expirations, insurance status, document tracking',
      icon: 'shield-checkmark-outline',
      color: screenColors.danger,
      formats: ['PDF', 'Excel']
    }
  ];

  const periodOptions = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'This Quarter', value: 'quarter' },
    { label: 'This Year', value: 'year' },
    { label: 'Custom Range', value: 'custom' }
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleAnalyticsPress = (type: string) => {
    Alert.alert(
      'Analytics Dashboard',
      `Opening ${type} analytics dashboard...`,
      [
        { text: 'OK', onPress: () => console.log(`Navigate to ${type} analytics`) }
      ]
    );
  };

  const handleReportGeneration = (report: ReportOption) => {
    Alert.alert(
      'Generate Report',
      `Select format for ${report.name}:`,
      [
        ...report.formats.map(format => ({
          text: format,
          onPress: () => generateReport(report.id, format.toLowerCase())
        })),
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const generateReport = (reportType: string, format: string) => {
    Alert.alert(
      'Report Generation',
      `Generating ${reportType} report in ${format.toUpperCase()} format for ${selectedPeriod} period...`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: screenColors.background }]}>
      <View style={[styles.header, { borderBottomColor: screenColors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color={screenColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: screenColors.text }]}>{t('reports_analytics')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: screenColors.text }]}>Analytics Dashboard</Text>
          <Text style={[styles.sectionSubtitle, { color: screenColors.textSecondary }]}>
            Interactive analytics and insights about your fleet operations
          </Text>
          <View style={styles.analyticsContainer}>
            {analyticsCards.map((card) => (
              <TouchableOpacity
                key={card.title}
                style={[styles.analyticsCard, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}
                onPress={card.onPress}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardIconContainer}>
                    <Ionicons name={card.icon as any} size={32} color={card.color} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={[styles.cardTitle, { color: screenColors.text }]}>{card.title}</Text>
                    <Text style={[styles.cardDescription, { color: screenColors.textSecondary }]}>
                      {card.description}
                    </Text>
                  </View>
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: card.color }]}
                      onPress={card.onPress}
                    >
                      <Ionicons name="bar-chart" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.periodSelector}>
          <Text style={[styles.sectionTitle, { color: screenColors.text }]}>Report Period</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.periodOptions}>
            {periodOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.periodOption,
                  { 
                    backgroundColor: selectedPeriod === option.value ? screenColors.primary : screenColors.card,
                    borderColor: screenColors.border 
                  }
                ]}
                onPress={() => setSelectedPeriod(option.value)}
              >
                <Text 
                  style={[
                    styles.periodText,
                    { 
                      color: selectedPeriod === option.value ? '#FFFFFF' : screenColors.text 
                    }
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: screenColors.text }]}>Generate Reports</Text>
          <Text style={[styles.sectionSubtitle, { color: screenColors.textSecondary }]}>
            Create and download detailed reports in various formats
          </Text>
          <View style={styles.reportsContainer}>
            {reportOptions.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={[styles.reportCard, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}
                onPress={() => handleReportGeneration(report)}
              >
                <View style={styles.reportHeader}>
                  <View style={styles.reportIconContainer}>
                    <Ionicons name={report.icon as any} size={32} color={report.color} />
                  </View>
                  <View style={styles.reportInfo}>
                    <Text style={[styles.reportTitle, { color: screenColors.text }]}>{report.name}</Text>
                    <Text style={[styles.reportDescription, { color: screenColors.textSecondary }]}>
                      {report.description}
                    </Text>
                    <View style={styles.formatTags}>
                      {report.formats.map(format => (
                        <View key={format} style={[styles.formatTag, { backgroundColor: screenColors.border }]}>
                          <Text style={[styles.formatText, { color: screenColors.textSecondary }]}>{format}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={styles.reportActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: report.color }]}
                      onPress={() => handleReportGeneration(report)}
                    >
                      <Ionicons name="download" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: screenColors.text }]}>Quick Stats</Text>
          <View style={styles.quickStatsGrid}>
            <View style={styles.statsRow}>
              <View style={[styles.statCard, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
                <Text style={[styles.statNumber, { color: screenColors.primary }]}>156</Text>
                <Text style={[styles.statLabel, { color: screenColors.textSecondary }]}>Total Trips</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
                <Text style={[styles.statNumber, { color: screenColors.success }]}>12,450</Text>
                <Text style={[styles.statLabel, { color: screenColors.textSecondary }]}>KM Driven</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={[styles.statCard, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
                <Text style={[styles.statNumber, { color: screenColors.warning }]}>€2,340</Text>
                <Text style={[styles.statLabel, { color: screenColors.textSecondary }]}>Total Expenses</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: screenColors.card, borderColor: screenColors.border }]}>
                <Text style={[styles.statNumber, { color: screenColors.info }]}>24</Text>
                <Text style={[styles.statLabel, { color: screenColors.textSecondary }]}>Active Vehicles</Text>
              </View>
            </View>
          </View>
        </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  analyticsContainer: {
    gap: 16,
  },
  analyticsCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconContainer: {
    padding: 10,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
  },
  periodSelector: {
    marginVertical: 8,
  },
  periodOptions: {
    flexDirection: 'row',
  },
  periodOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
  },
  reportsContainer: {
    marginTop: 16,
    gap: 16,
  },
  reportCard: {
    borderRadius: 10,
    borderWidth: 1,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  reportIconContainer: {
    padding: 10,
  },
  reportInfo: {
    flex: 1,
    marginLeft: 10,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  reportDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  reportActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  formatTags: {
    flexDirection: 'row',
    gap: 6,
  },
  formatTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  formatText: {
    fontSize: 10,
    fontWeight: '500',
  },
  quickStatsGrid: {
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ReportsAnalyticsScreen; 