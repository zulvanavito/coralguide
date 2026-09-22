import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Tokens } from '@/constants/Colors';
import { formatGameDate } from '@/utils/gameDate';
import { useGameStore } from '@/store/useGameStore';

interface QuickNoteModalProps {
  visible: boolean;
  onClose: () => void;
}

export function QuickNoteModal({ visible, onClose }: QuickNoteModalProps) {
  const { activeProfile, addQuickNote } = useGameStore();
  const [content, setContent] = useState('');

  const handleClose = () => {
    setContent('');
    onClose();
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    await addQuickNote(content.trim());
    setContent('');
    onClose();
  };

  const gameDateStr = activeProfile
    ? formatGameDate({
        year: activeProfile.currentYear,
        season: activeProfile.currentSeason,
        day: activeProfile.currentDay,
      })
    : '';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel="Cancel note"
            >
              <Ionicons name="close" size={24} color={Palette.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Quick Note</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          <View style={styles.body}>
            {/* Game Date Context Badge */}
            {gameDateStr ? (
              <View style={styles.dateBadge}>
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={Palette.primary}
                />
                <Text style={styles.dateBadgeText}>{gameDateStr}</Text>
              </View>
            ) : null}

            {/* Large Multiline Input */}
            <TextInput
              style={styles.textArea}
              placeholder="Jot down a quick note, diving coordinate, or reminder..."
              placeholderTextColor={Palette.textMuted}
              value={content}
              onChangeText={setContent}
              multiline={true}
              autoFocus={true}
              textAlignVertical="top"
            />
          </View>

          {/* Footer Save Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.saveBtn,
                !content.trim() && styles.saveBtnDisabled,
              ]}
              onPress={handleSave}
              disabled={!content.trim()}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Save Note"
            >
              <Text style={styles.saveBtnText}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Tokens.spacing.md,
    paddingVertical: Tokens.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderLight,
    backgroundColor: Palette.white,
  },
  closeBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  headerPlaceholder: {
    width: 44,
  },
  body: {
    flex: 1,
    padding: Tokens.spacing.lg,
  },
  dateBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: Tokens.spacing.md,
    paddingVertical: Tokens.spacing.xs,
    borderRadius: Tokens.radius.full,
    gap: 6,
    marginBottom: Tokens.spacing.md,
  },
  dateBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.primary,
  },
  textArea: {
    flex: 1,
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    padding: Tokens.spacing.lg,
    fontSize: 16,
    lineHeight: 24,
    color: Palette.textPrimary,
  },
  footer: {
    padding: Tokens.spacing.md,
    backgroundColor: Palette.white,
    borderTopWidth: 1,
    borderTopColor: Palette.borderLight,
  },
  saveBtn: {
    backgroundColor: Palette.primary,
    minHeight: 48,
    borderRadius: Tokens.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: Palette.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
