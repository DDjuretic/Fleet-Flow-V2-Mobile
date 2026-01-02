/**
 * Driver Tasks Screen - Tablet-Optimized Task Management
 *
 * Core features for field workers:
 * - Active task queue with priorities
 * - Route optimization display
 * - Real-time GPS tracking
 * - Proof of delivery (signature)
 * - Offline-first operation
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

// Contexts & Hooks
import { useAuth } from '../../contexts/AuthContext';
import { useTripManager } from '../../hooks/useTripManager';

// Components
import { TierGuard } from '../../components/TierGuard';

// Types
import { UserTier } from '../../types/userTier';

// Constants
import Colors from '../../constants/Colors';
import { RootState } from '../../store/rootReducer';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IS_TABLET = SCREEN_WIDTH > 768; // Tablet breakpoint

// Task interfaces
interface DriverTask {
  id: string;
  type: 'pickup' | 'delivery' | 'service' | 'break';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  timeWindow?: {
    start: Date;
    end: Date;
  };
  cargo?: {
    items: string[];
    weight?: number;
    specialInstructions?: string;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  estimatedDuration: number; // minutes
  actualStartTime?: Date;
  completedAt?: Date;
}

// Mock data for development
const MOCK_TASKS: DriverTask[] = [
  {
    id: '1',
    type: 'pickup',
    priority: 'high',
    title: 'Pickup: Electronics Warehouse',
    description: 'Collect 5 boxes of electronics components',
    location: {
      address: 'Industrial Zone A, Warehouse 12',
      coordinates: { latitude: 43.8563, longitude: 18.3132 }
    },
    timeWindow: {
      start: new Date(Date.now() + 30 * 60 * 1000), // 30 min from now
      end: new Date(Date.now() + 90 * 60 * 1000) // 90 min from now
    },
    cargo: {
      items: ['5x Electronics Boxes', 'Packing Materials'],
      weight: 150,
      specialInstructions: 'Handle with care - fragile items'
    },
    status: 'pending',
    estimatedDuration: 45
  },
  {
    id: '2',
    type: 'delivery',
    priority: 'urgent',
    title: 'Delivery: Client Office',
    description: 'Deliver urgent documents to client',
    location: {
      address: 'Business Center, Office 501',
      coordinates: { latitude: 43.8587, longitude: 18.3201 }
    },
    timeWindow: {
      start: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      end: new Date(Date.now() + 120 * 60 * 1000) // 2 hours from now
    },
    cargo: {
      items: ['Urgent Documents Package'],
      weight: 2,
      specialInstructions: 'Requires signature upon delivery'
    },
    status: 'pending',
    estimatedDuration: 30
  },
  {
    id: '3',
    type: 'break',
    priority: 'medium',
    title: 'Lunch Break',
    description: 'Scheduled break period',
    location: {
      address: 'Rest Area - Highway Stop',
      coordinates: { latitude: 43.8500, longitude: 18.3000 }
    },
    timeWindow: {
      start: new Date(Date.now() + 180 * 60 * 1000), // 3 hours from now
      end: new Date(Date.now() + 210 * 60 * 1000) // 3.5 hours from now
    },
    status: 'pending',
    estimatedDuration: 30
  }
];

const DriverTasksScreen: React.FC = () => {
  const { t } = useTranslation();
  const { userTier, hasPermission } = useAuth();
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  // State
  const [tasks, setTasks] = useState<DriverTask[]>(MOCK_TASKS);
  const [activeTask, setActiveTask] = useState<DriverTask | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const colors = themeMode === 'dark' ? Colors.DARK : Colors.LIGHT;

  // Filter tasks
  const activeTasks = tasks.filter(task => task.status !== 'completed');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const displayTasks = showCompleted ? completedTasks : activeTasks;

  // Handle task actions
  const handleStartTask = (task: DriverTask) => {
    Alert.alert(
      t('start_task', 'Start Task'),
      `${t('start_task_confirm', 'Are you sure you want to start')} "${task.title}"?`,
      [
        { text: t('cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('start', 'Start'),
          onPress: () => {
            setTasks(prev => prev.map(t =>
              t.id === task.id
                ? { ...t, status: 'in_progress', actualStartTime: new Date() }
                : t
            ));
            setActiveTask(task);
          }
        }
      ]
    );
  };

  const handleCompleteTask = (task: DriverTask) => {
    Alert.alert(
      t('complete_task', 'Complete Task'),
      `${t('complete_task_confirm', 'Mark task as completed')} "${task.title}"?`,
      [
        { text: t('cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('complete', 'Complete'),
          onPress: () => {
            setTasks(prev => prev.map(t =>
              t.id === task.id
                ? { ...t, status: 'completed', completedAt: new Date() }
                : t
            ));
            if (activeTask?.id === task.id) {
              setActiveTask(null);
            }
          }
        }
      ]
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // TODO: Implement real data refresh from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Task card component
  const TaskCard: React.FC<{ task: DriverTask }> = ({ task }) => {
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'urgent': return '#FF4444';
        case 'high': return '#FF8800';
        case 'medium': return '#FFBB33';
        case 'low': return '#00AA00';
        default: return colors.textSecondary;
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'completed': return '#00AA00';
        case 'in_progress': return '#007AFF';
        case 'failed': return '#FF4444';
        default: return colors.textSecondary;
      }
    };

    const getTypeIcon = (type: string) => {
      switch (type) {
        case 'pickup': return 'arrow-up-circle';
        case 'delivery': return 'arrow-down-circle';
        case 'service': return 'construct';
        case 'break': return 'cafe';
        default: return 'ellipse';
      }
    };

    return (
      <View style={[styles.taskCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* Header */}
        <View style={styles.taskHeader}>
          <View style={styles.taskTypeContainer}>
            <Ionicons name={getTypeIcon(task.type) as any} size={24} color={colors.primary} />
            <Text style={[styles.taskType, { color: colors.textSecondary }]}>
              {t(task.type, task.type.toUpperCase())}
            </Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
            <Text style={styles.priorityText}>
              {t(task.priority, task.priority.toUpperCase())}
            </Text>
          </View>
        </View>

        {/* Title & Description */}
        <Text style={[styles.taskTitle, { color: colors.text }]}>{task.title}</Text>
        <Text style={[styles.taskDescription, { color: colors.textSecondary }]}>{task.description}</Text>

        {/* Location */}
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={[styles.locationText, { color: colors.text }]}>
            {task.location.address}
          </Text>
        </View>

        {/* Time Window */}
        {task.timeWindow && (
          <View style={styles.timeContainer}>
            <Ionicons name="time" size={16} color={colors.primary} />
            <Text style={[styles.timeText, { color: colors.text }]}>
              {task.timeWindow.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {' '}
              {task.timeWindow.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}

        {/* Cargo Info */}
        {task.cargo && (
          <View style={styles.cargoContainer}>
            <Ionicons name="cube" size={16} color={colors.primary} />
            <Text style={[styles.cargoText, { color: colors.text }]}>
              {task.cargo.items.join(', ')}
              {task.cargo.weight && ` (${task.cargo.weight}kg)`}
            </Text>
          </View>
        )}

        {/* Special Instructions */}
        {task.cargo?.specialInstructions && (
          <View style={styles.instructionContainer}>
            <Ionicons name="warning" size={16} color="#FF8800" />
            <Text style={[styles.instructionText, { color: '#FF8800' }]}>
              {task.cargo.specialInstructions}
            </Text>
          </View>
        )}

        {/* Status & Actions */}
        <View style={styles.taskFooter}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
            <Text style={styles.statusText}>
              {t(task.status, task.status.replace('_', ' ').toUpperCase())}
            </Text>
          </View>

          <View style={styles.actionButtons}>
            {task.status === 'pending' && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={() => handleStartTask(task)}
              >
                <Ionicons name="play" size={16} color="white" />
                <Text style={styles.actionButtonText}>{t('start', 'Start')}</Text>
              </TouchableOpacity>
            )}

            {task.status === 'in_progress' && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#00AA00' }]}
                onPress={() => handleCompleteTask(task)}
              >
                <Ionicons name="checkmark" size={16} color="white" />
                <Text style={styles.actionButtonText}>{t('complete', 'Complete')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <TierGuard permission="taskManagement" requireTier={[UserTier.FIELD_WORKER, UserTier.ADMINISTRATOR]}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />

        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <View style={styles.headerLeft}>
            <Ionicons name="clipboard" size={28} color={colors.primary} />
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {t('driver_tasks', 'Driver Tasks')}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowCompleted(!showCompleted)}
          >
            <Ionicons
              name={showCompleted ? "checkmark-circle" : "time"}
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Active Task Indicator */}
        {activeTask && (
          <View style={[styles.activeTaskBanner, { backgroundColor: colors.primary }]}>
            <Ionicons name="play-circle" size={20} color="white" />
            <Text style={styles.activeTaskText}>
              {t('active_task', 'Active')}: {activeTask.title}
            </Text>
            <TouchableOpacity onPress={() => setActiveTask(null)}>
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* Task List */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {displayTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name={showCompleted ? "checkmark-circle-outline" : "clipboard-outline"}
                size={64}
                color={colors.textSecondary}
              />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                {showCompleted
                  ? t('no_completed_tasks', 'No completed tasks')
                  : t('no_active_tasks', 'No active tasks')
                }
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                {showCompleted
                  ? t('completed_tasks_will_appear_here', 'Completed tasks will appear here')
                  : t('new_tasks_will_appear_here', 'New tasks will appear here')
                }
              </Text>
            </View>
          ) : (
            displayTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </TierGuard>
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
    paddingHorizontal: IS_TABLET ? 24 : 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: IS_TABLET ? 28 : 24,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
  },
  activeTaskBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: IS_TABLET ? 24 : 16,
    paddingVertical: 12,
  },
  activeTaskText: {
    flex: 1,
    fontSize: IS_TABLET ? 16 : 14,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: IS_TABLET ? 24 : 16,
  },
  taskCard: {
    borderRadius: 12,
    padding: IS_TABLET ? 20 : 16,
    marginBottom: 12,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskType: {
    fontSize: IS_TABLET ? 14 : 12,
    fontWeight: '600',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: 'white',
    fontSize: IS_TABLET ? 12 : 10,
    fontWeight: 'bold',
  },
  taskTitle: {
    fontSize: IS_TABLET ? 20 : 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: IS_TABLET ? 16 : 14,
    marginBottom: 12,
    lineHeight: IS_TABLET ? 22 : 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: IS_TABLET ? 14 : 12,
    marginLeft: 6,
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: IS_TABLET ? 14 : 12,
    marginLeft: 6,
  },
  cargoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cargoText: {
    fontSize: IS_TABLET ? 14 : 12,
    marginLeft: 6,
    flex: 1,
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    padding: 8,
    backgroundColor: 'rgba(255, 136, 0, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8800',
  },
  instructionText: {
    fontSize: IS_TABLET ? 14 : 12,
    marginLeft: 6,
    flex: 1,
    fontStyle: 'italic',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: IS_TABLET ? 12 : 10,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: IS_TABLET ? 14 : 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: IS_TABLET ? 24 : 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: IS_TABLET ? 16 : 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default DriverTasksScreen;
