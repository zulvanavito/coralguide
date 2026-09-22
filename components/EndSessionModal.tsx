import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '@/store/useGameStore';
import { TaskCategory } from '@/types/game';
import {
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  formatGameDate,
  formatStopwatch,
} from '@/utils/gameDate';
import { Palette, Tokens } from '@/constants/Colors';

interface EndSessionModalProps {
  visible: boolean;
  onClose: () => void;
  durationSeconds?: number;
  initialActivities?: TaskCategory[];
}

const ACTIVITIES: TaskCategory[] = [
  'farming',
  'fishing',
  'mining',
  'diving',
  'relationship',
  'museum',
  'quest',
  'general',
];

export function EndSessionModal({
  visible,
  onClose,
  durationSeconds = 0,
  initialActivities,
}: EndSessionModalProps) {
  const { activeProfile, saveEndSession } = useGameStore();

  const [userSelectedActivities, setUserSelectedActivities] = useState<TaskCategory[] | null>(null);
  const selectedActivities =
    userSelectedActivities ??
    (initialActivities && initialActivities.length > 0
      ? initialActivities
      : ['farming']);

  const [note, setNote] = useState('');
  const [nextTaskInput, setNextTaskInput] = useState('');
  const [nextTasks, setNextTasks] = useState<string[]>([]);
  const [advanceDate, setAdvanceDate] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  if (!activeProfile) return null;

  const toggleActivity = (act: TaskCategory) => {
    const current = selectedActivities;
    if (current.includes(act)) {
      if (current.length > 1) {
        setUserSelectedActivities(current.filter((a) => a !== act));
      }
    } else {
      setUserSelectedActivities([...current, act]);
    }
  };

  const handleAddNextTask = () => {
    if (!nextTaskInput.trim()) return;
    setNextTasks([...nextTasks, nextTaskInput.trim()]);
    setNextTaskInput('');
  };

  const handleRemoveNextTask = (index: number) => {
    setNextTasks(nextTasks.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setUserSelectedActivities(null);
    setNote('');
    setNextTasks([]);
    setNextTaskInput('');
    setAdvanceDate(true);
    setIsSaving(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      await saveEndSession({
        durationSeconds,
        activities: selectedActivities,
        note,
        nextTasks,
        advanceDate,
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error saving session:', error);
      Alert.alert(
        'Gagal Menyimpan Sesi',
        'Terjadi kendala saat menyimpan sesi permainan. Silakan coba kembali.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const currentDateText = formatGameDate({
    year: activeProfile.currentYear,
    season: activeProfile.currentSeason,
    day: activeProfile.currentDay,
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close end session dialog"
            >
              <Ionicons name="close" size={24} color={Palette.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>End Session</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* 15.1 Session Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Session Summary</Text>
              <Text style={styles.timerDigits}>
                {formatStopwatch(durationSeconds)}
              </Text>
              <View style={styles.dateBadge}>
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={Palette.primary}
                />
                <Text style={styles.dateBadgeText}>{currentDateText}</Text>
              </View>
            </View>

            {/* 15.2 Activities */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Activities Done</Text>
              <View style={styles.chipsContainer}>
                {ACTIVITIES.map((act) => {
                  const isSelected = selectedActivities.includes(act);
                  const iconName = CATEGORY_ICONS[act] as keyof typeof Ionicons.glyphMap;
                  return (
                    <TouchableOpacity
                      key={act}
                      style={[
                        styles.chip,
                        isSelected && styles.chipSelected,
                      ]}
                      onPress={() => toggleActivity(act)}
                      activeOpacity={0.7}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: isSelected }}
                      accessibilityLabel={CATEGORY_LABELS[act]}
                    >
                      <Ionicons
                        name={iconName || 'ellipse'}
                        size={16}
                        color={isSelected ? Palette.white : Palette.textSecondary}
                      />
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextSelected,
                        ]}
                      >
                        {CATEGORY_LABELS[act]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 15.3 Notes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Session Notes</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Found some new fish! Need iron for pickaxe upgrade..."
                placeholderTextColor={Palette.textMuted}
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* 15.4 Next Tasks */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Plan for Tomorrow</Text>
              <View style={styles.nextTaskInputRow}>
                <TextInput
                  style={styles.nextTaskTextInput}
                  placeholder="e.g. Continue diving, upgrade pickaxe..."
                  placeholderTextColor={Palette.textMuted}
                  value={nextTaskInput}
                  onChangeText={setNextTaskInput}
                  onSubmitEditing={handleAddNextTask}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={[
                    styles.addNextTaskBtn,
                    !nextTaskInput.trim() && styles.addNextTaskBtnDisabled,
                  ]}
                  onPress={handleAddNextTask}
                  disabled={!nextTaskInput.trim()}
                  accessibilityRole="button"
                  accessibilityLabel="Add plan item"
                >
                  <Ionicons name="add" size={20} color={Palette.white} />
                </TouchableOpacity>
              </View>

              {nextTasks.length > 0 && (
                <View style={styles.nextTasksList}>
                  {nextTasks.map((t, idx) => (
                    <View key={idx} style={styles.nextTaskItem}>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={18}
                        color={Palette.primary}
                      />
                      <Text style={styles.nextTaskText}>{t}</Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveNextTask(idx)}
                        style={styles.removeNextTaskBtn}
                        accessibilityRole="button"
                        accessibilityLabel={`Remove ${t}`}
                      >
                        <Ionicons
                          name="close"
                          size={18}
                          color={Palette.textMuted}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Advance Game Date Switch */}
            <View style={styles.advanceDateRow}>
              <View style={styles.advanceDateTextCol}>
                <Text style={styles.advanceDateTitle}>
                  Advance to Next Day?
                </Text>
                <Text style={styles.advanceDateSub}>
                  Turn on if you went to sleep in-game to roll the calendar.
                </Text>
              </View>
              <Switch
                value={advanceDate}
                onValueChange={setAdvanceDate}
                trackColor={{ false: Palette.borderLight, true: Palette.primaryLight }}
                thumbColor={advanceDate ? Palette.primary : Palette.textMuted}
              />
            </View>
          </ScrollView>

          {/* 15.5 Save Session Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.saveBtn, isSaving && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Save Session"
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={Palette.white} />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color={Palette.white} />
                  <Text style={styles.saveBtnText}>Save Session</Text>
                </>
              )}
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
  scrollContent: {
    padding: Tokens.spacing.lg,
  },
  summaryCard: {
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.lg,
    padding: Tokens.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.borderLight,
    marginBottom: Tokens.spacing.xl,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textSecondary,
    marginBottom: Tokens.spacing.xs,
  },
  timerDigits: {
    fontSize: 36,
    fontWeight: '700',
    color: Palette.textPrimary,
    fontVariant: ['tabular-nums'],
    letterSpacing: 1,
    marginBottom: Tokens.spacing.sm,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: Tokens.spacing.md,
    paddingVertical: 4,
    borderRadius: Tokens.radius.full,
    gap: 6,
  },
  dateBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.primary,
  },
  section: {
    marginBottom: Tokens.spacing.xl,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: Tokens.spacing.sm,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Tokens.spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: Tokens.spacing.md,
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.full,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    gap: 6,
  },
  chipSelected: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  chipTextSelected: {
    color: Palette.white,
  },
  textArea: {
    minHeight: 80,
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    padding: Tokens.spacing.md,
    fontSize: 15,
    color: Palette.textPrimary,
  },
  nextTaskInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Tokens.spacing.sm,
    marginBottom: Tokens.spacing.sm,
  },
  nextTaskTextInput: {
    flex: 1,
    minHeight: 44,
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    paddingHorizontal: Tokens.spacing.md,
    fontSize: 15,
    color: Palette.textPrimary,
  },
  addNextTaskBtn: {
    width: 44,
    height: 44,
    backgroundColor: Palette.primary,
    borderRadius: Tokens.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addNextTaskBtnDisabled: {
    opacity: 0.5,
  },
  nextTasksList: {
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    overflow: 'hidden',
  },
  nextTaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Tokens.spacing.md,
    paddingVertical: Tokens.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderLight,
    gap: Tokens.spacing.sm,
  },
  nextTaskText: {
    flex: 1,
    fontSize: 14,
    color: Palette.textPrimary,
  },
  removeNextTaskBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  advanceDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    padding: Tokens.spacing.md,
    gap: Tokens.spacing.md,
  },
  advanceDateTextCol: {
    flex: 1,
  },
  advanceDateTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Palette.textPrimary,
    marginBottom: 2,
  },
  advanceDateSub: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 18,
  },
  footer: {
    padding: Tokens.spacing.md,
    backgroundColor: Palette.white,
    borderTopWidth: 1,
    borderTopColor: Palette.borderLight,
  },
  saveBtn: {
    flexDirection: 'row',
    backgroundColor: Palette.primary,
    minHeight: 48,
    borderRadius: Tokens.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnText: {
    color: Palette.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
