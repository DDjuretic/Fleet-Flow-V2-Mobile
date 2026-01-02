import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../store/rootReducer';
import Colors from '../constants/Colors';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

interface LanguagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLanguage: (languageCode: string) => void;
  currentLanguage: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'sr', name: 'Serbian', nativeName: 'Srpski' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'me', name: 'Montenegrin', nativeName: 'Crnogorski' },
];

export const LanguagePickerModal: React.FC<LanguagePickerModalProps> = ({
  visible,
  onClose,
  onSelectLanguage,
  currentLanguage,
}) => {
  const { t } = useTranslation();
  const currentTheme = useSelector((state: RootState) => state.theme?.mode || 'light');
  
  const theme = {
    colors: currentTheme === 'dark' ? {
      background: Colors.DARK.background,
      surface: Colors.DARK.card,
      text: Colors.DARK.text,
      textSecondary: Colors.DARK.textSecondary,
      primary: Colors.DARK.primary,
      border: Colors.DARK.border,
    } : {
      background: Colors.LIGHT.background,
      surface: Colors.LIGHT.card,
      text: Colors.LIGHT.text,
      textSecondary: Colors.LIGHT.textSecondary,
      primary: Colors.LIGHT.primary,
      border: Colors.LIGHT.border,
    }
  };

  const handleSelectLanguage = (languageCode: string) => {
    onSelectLanguage(languageCode);
    onClose();
  };

  const renderLanguageItem = ({ item }: { item: Language }) => {
    const isSelected = item.code === currentLanguage;
    
    return (
      <TouchableOpacity
        style={[
          styles.languageItem,
          { 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
          isSelected && { 
            backgroundColor: theme.colors.primary + '20',
            borderColor: theme.colors.primary,
          }
        ]}
        onPress={() => handleSelectLanguage(item.code)}
      >
        <View style={styles.languageInfo}>
          <Text style={[
            styles.languageName,
            { color: theme.colors.text },
            isSelected && { color: theme.colors.primary, fontWeight: 'bold' }
          ]}>
            {item.nativeName}
          </Text>
          <Text style={[
            styles.languageSubtitle,
            { color: theme.colors.textSecondary }
          ]}>
            {item.name}
          </Text>
        </View>
        {isSelected && (
          <View style={[styles.checkmark, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {t('language')}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.closeButtonText, { color: theme.colors.text }]}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={LANGUAGES}
            renderItem={renderLanguageItem}
            keyExtractor={(item) => item.code}
            style={styles.languageList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  languageList: {
    flexGrow: 0,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  languageSubtitle: {
    fontSize: 14,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});