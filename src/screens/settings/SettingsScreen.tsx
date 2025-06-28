import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { useTranslation } from 'react-i18next';
import { roleService } from '../../services/roleService';
import { LanguagePickerModal } from '../../components/LanguagePickerModal';


// Navigation
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { toggleThemeMode } from '../../store/slices/themeSlice';
import { setLanguage, toggleLanguage, toggleUnits, toggleCurrency } from '../../store/slices/settingsSlice';

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

export default function SettingsScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { signOut, user } = useAuth();
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme.mode);
  const currentLanguage = useSelector((state: RootState) => state.settings.language);
  const currentUnits = useSelector((state: RootState) => state.settings.units);
  const currentCurrency = useSelector((state: RootState) => state.settings.currency);

  const [canApproveReservations, setCanApproveReservations] = useState(false);
  const [canAccessFleetManager, setCanAccessFleetManager] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);



  const screenColors = currentTheme === 'dark' ? {
    background: Colors.DARK.background,
    text: Colors.DARK.text,
    textSecondary: Colors.DARK.textSecondary,
    border: Colors.DARK.border,
    primary: Colors.DARK.primary,
    danger: Colors.DANGER,
    card: Colors.DARK.card,
  } : {
    background: Colors.LIGHT.background,
    text: Colors.LIGHT.text,
    textSecondary: Colors.LIGHT.textSecondary,
    border: Colors.LIGHT.border,
    primary: Colors.LIGHT.primary,
    danger: Colors.DANGER,
    card: Colors.LIGHT.card,
  };

  const styles = getStyles(screenColors, currentTheme);

  useEffect(() => {
    checkPermissions();
  }, [user]);

  const checkPermissions = async () => {
    console.log('🔍 === SETTINGS SCREEN DEBUG ===');
    console.log('📋 User exists:', !!user);
    console.log('📋 User ID:', user?.id);
    console.log('📋 User email:', user?.email);
    console.log('📋 User object:', JSON.stringify(user, null, 2));
    
    if (!user?.id) {
      console.log('❌ No user ID, skipping permission check');
      console.log('=== END SETTINGS DEBUG ===');
      return;
    }
    
    console.log('📋 Starting permission checks...');
    const canApprove = await roleService.canApproveReservations(user.id);
    const canAccessFM = await roleService.canAccessFleetManager(user.id);
    const hasAdminAccess = await roleService.hasRole(user.id, 'admin');
    
    console.log('📋 Permission results:');
    console.log('  - canApprove:', canApprove);
    console.log('  - canAccessFM:', canAccessFM);
    console.log('  - hasAdminAccess:', hasAdminAccess);
    console.log('=== END SETTINGS DEBUG ===');
    
    setCanApproveReservations(canApprove);
    setCanAccessFleetManager(canAccessFM);
    setIsAdmin(hasAdminAccess);
  };

  const handleToggleTheme = () => {
    dispatch(toggleThemeMode());
  };

  const handleToggleLanguage = () => {
    setShowLanguagePicker(true);
  };

  const handleSelectLanguage = (languageCode: string) => {
    // Ažuriraj Redux store sa novim jezikom
    dispatch(setLanguage(languageCode as any));
    // Ažuriraj i18n
    import('../../i18n').then((i18n) => {
      i18n.default.changeLanguage(languageCode);
    });
  };

  const handleToggleUnits = () => {
    dispatch(toggleUnits());
  };

  const handleToggleCurrency = () => {
    dispatch(toggleCurrency());
  };

  const SettingsItem: React.FC<SettingsItemProps> = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightIcon = 'chevron-forward', 
    iconColor = screenColors.primary 
  }) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        <Ionicons name={icon} size={24} color={iconColor} style={styles.itemIcon} />
        <View style={styles.textContainer}>
          <Text style={[styles.settingsItemTitle, { color: screenColors.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingsItemSubtitle, { color: screenColors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <Ionicons name={rightIcon} size={20} color={screenColors.textSecondary} />
    </TouchableOpacity>
  );

  const handleLogout = () => {
    Alert.alert(
      t('logout', 'Logout'),
      t('logout_confirmation', 'Are you sure you want to logout?'),
      [
        { text: t('cancel', 'Cancel'), style: 'cancel' },
        { 
          text: t('logout', 'Logout'), 
          style: 'destructive', 
          onPress: async () => {
            await signOut();
          }
        },
      ]
    );
  };

  // Create base menu items
  const baseMenuItems = [
    { 
      id: '1', 
      title: t('edit_profile', 'Edit Profile'), 
      icon: 'person-circle-outline', 
      screen: 'UserProfile' 
    },
    {
      id: 'theme',
      title: `${t('theme', 'Theme')}: ${currentTheme === 'dark' ? t('dark', 'Dark') : t('light', 'Light')}`,
      icon: currentTheme === 'dark' ? 'moon-outline' : 'sunny-outline',
      action: handleToggleTheme,
    },
    { 
      id: 'language', 
      title: `${t('language', 'Language')}: ${currentLanguage ? currentLanguage.toUpperCase() : t('not_available', 'N/A')}`,
      icon: 'language-outline', 
      action: handleToggleLanguage,
    },
    { 
      id: 'units', 
      title: `${t('units', 'Units')}: ${currentUnits === 'km' ? t('kilometers', 'Kilometers') : t('miles', 'Miles')}`,
      icon: 'speedometer-outline', 
      action: handleToggleUnits,
    },
    { 
      id: 'currency', 
      title: `${t('currency', 'Currency')}: ${currentCurrency ? currentCurrency.toUpperCase() : t('not_available', 'N/A')}`,
      icon: 'cash-outline', 
      action: handleToggleCurrency,
    },
    { 
      id: '2', 
      title: t('notifications', 'Notifications'), 
      icon: 'notifications-outline', 
      screen: 'NotificationsSettings' 
    },

    { 
      id: '6', 
      title: t('change_password', 'Change Password'), 
      icon: 'lock-closed-outline', 
      screen: 'ChangePassword' 
    },
    { 
      id: '7', 
      title: t('help_support', 'Help & Support'), 
      icon: 'help-buoy-outline', 
      screen: 'HelpSupport' 
    },
  ];

  // Build final menu items array with Admin Panel first if user is admin
  const menuItems = [];
  
  if (isAdmin) {
    menuItems.push({
      id: 'admin',
      title: t('admin_panel', 'Admin Panel'),
      icon: 'construct-outline',
      screen: 'AdminPanel'
    });
  }
  
  // Add all other menu items
  menuItems.push(...baseMenuItems);

  return (
    <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: screenColors.background }]}>
      <StatusBar 
        barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={screenColors.background} 
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={screenColors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: screenColors.text }]}>{t('settings_title', 'Settings')}</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.menuContainer}>
          {/* Fleet Manager Items - Removed pending reservations (now in Admin Panel) */}

          {/* Regular Menu Items */}
          {menuItems.map((item) => (
            <SettingsItem
              key={item.id}
              icon={item.icon as keyof typeof Ionicons.glyphMap}
              title={item.title}
              onPress={() => {
                if (item.action) {
                  item.action();
                } else if (item.screen) {
                  navigation.navigate(item.screen);
                }
              }}
            />
          ))}

          {/* Logout Item */}
          <SettingsItem
            icon="log-out-outline"
            title={t('logout', 'Logout')}
            onPress={handleLogout}
            iconColor={screenColors.danger}
            rightIcon="log-out-outline"
          />
        </View>
      </ScrollView>
      
      <LanguagePickerModal
        visible={showLanguagePicker}
        onClose={() => setShowLanguagePicker(false)}
        onSelectLanguage={handleSelectLanguage}
        currentLanguage={currentLanguage}
      />
      

    </SafeAreaView>
  );
}

const getStyles = (screenColors: any, currentTheme: 'light' | 'dark') => StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
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
    borderBottomColor: screenColors.border,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRightPlaceholder: {
    width: 24, // to balance the back button
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: screenColors.border,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingsItemSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
}); 