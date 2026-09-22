import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Tokens } from '@/constants/Colors';
import { TaskCategory, Season, GameDate } from '@/types/game';
import {
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  SEASONS,
  SEASON_LABELS,
} from '@/utils/gameDate';
import { useGameStore } from '@/store/useGameStore';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  initialTitle?: string;
  initialCategory?: TaskCategory;
}

const CATEGORIES: TaskCategory[] = [
  'farming',
  'fishing',
  'mining',
  'diving',
  'relationship',
  'museum',
  'quest',
  'general',
];

const YEAR_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const DAY_OPTIONS = Array.from({ length: 28 }, (_, i) => i + 1);

type ActivePicker = 'year' | 'season' | 'day' | null;

export function AddTaskModal({
  visible,
  onClose,
  initialTitle = '',
  initialCategory = 'farming',
}: AddTaskModalProps) {
  const { activeProfile, addTodo } = useGameStore();

  const [title, setTitle] = useState(initialTitle);
  const [category, setCategory] = useState<TaskCategory>(initialCategory);
  const [year, setYear] = useState(activeProfile?.currentYear ?? 1);
  const [season, setSeason] = useState<Season>(activeProfile?.currentSeason ?? 'spring');
  const [day, setDay] = useState(activeProfile?.currentDay ?? 1);
  const [note, setNote] = useState('');
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);

  const resetForm = () => {
    setTitle('');
    setCategory(initialCategory);
    setNote('');
    setActivePicker(null);
    if (activeProfile) {
      setYear(activeProfile.currentYear);
      setSeason(activeProfile.currentSeason);
      setDay(activeProfile.currentDay);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    const targetDate: GameDate = { year, season, day };
    await addTodo(title.trim(), category, targetDate);
    resetForm();
    onClose();
  };

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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel="Cancel adding task"
            >
              <Ionicons name="close" size={24} color={Palette.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Task</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Task Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Task Title</Text>
              <TextInput
                style={styles.textInput}
                placeholder="What needs to be done?"
                placeholderTextColor={Palette.textMuted}
                value={title}
                onChangeText={setTitle}
                autoFocus={true}
              />
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.chipsContainer}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  const iconName = CATEGORY_ICONS[cat] as keyof typeof Ionicons.glyphMap;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.chip,
                        isSelected && styles.chipSelected,
                      ]}
                      onPress={() => setCategory(cat)}
                      activeOpacity={0.7}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={CATEGORY_LABELS[cat]}
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
                        {CATEGORY_LABELS[cat]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Target Game Date Dropdowns (Screen 4) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Game Date</Text>
              <View style={styles.dropdownsRow}>
                {/* Year Dropdown */}
                <TouchableOpacity
                  style={styles.dropdownBtn}
                  onPress={() => setActivePicker('year')}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Selected Year: Year ${year}. Tap to select year.`}
                >
                  <Text style={styles.dropdownBtnText}>Year {year}</Text>
                  <Ionicons name="chevron-down" size={14} color={Palette.textSecondary} />
                </TouchableOpacity>

                {/* Season Dropdown */}
                <TouchableOpacity
                  style={styles.dropdownBtn}
                  onPress={() => setActivePicker('season')}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Selected Season: ${SEASON_LABELS[season]}. Tap to select season.`}
                >
                  <Text style={styles.dropdownBtnText}>{SEASON_LABELS[season]}</Text>
                  <Ionicons name="chevron-down" size={14} color={Palette.textSecondary} />
                </TouchableOpacity>

                {/* Day Dropdown */}
                <TouchableOpacity
                  style={styles.dropdownBtn}
                  onPress={() => setActivePicker('day')}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Selected Day: Day ${day}. Tap to select day.`}
                >
                  <Text style={styles.dropdownBtnText}>Day {day}</Text>
                  <Ionicons name="chevron-down" size={14} color={Palette.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Notes (Optional) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={styles.noteInput}
                placeholder="Add extra context or reminders..."
                placeholderTextColor={Palette.textMuted}
                value={note}
                onChangeText={setNote}
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Footer Save Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.saveBtn,
                !title.trim() && styles.saveBtnDisabled,
              ]}
              onPress={handleSave}
              disabled={!title.trim()}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Save Task"
            >
              <Text style={styles.saveBtnText}>Save Task</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Sheet Picker Overlay for Dropdowns */}
          {activePicker !== null && (
            <View style={styles.pickerOverlay}>
              <TouchableOpacity
                style={styles.pickerBackdrop}
                activeOpacity={1}
                onPress={() => setActivePicker(null)}
                accessibilityRole="button"
                accessibilityLabel="Close picker backdrop"
              />
              <View style={styles.pickerCard}>
                <View style={styles.pickerHeader}>
                  <Text style={styles.pickerTitle}>
                    {activePicker === 'year'
                      ? 'Select Year'
                      : activePicker === 'season'
                      ? 'Select Season'
                      : 'Select Day (1 - 28)'}
                  </Text>
                  <TouchableOpacity
                    style={styles.pickerCloseBtn}
                    onPress={() => setActivePicker(null)}
                    accessibilityRole="button"
                    accessibilityLabel="Close picker dialog"
                  >
                    <Ionicons name="close" size={22} color={Palette.textPrimary} />
                  </TouchableOpacity>
                </View>

                {/* Year Options List */}
                {activePicker === 'year' && (
                  <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={false}>
                    {YEAR_OPTIONS.map((y) => {
                      const isSelected = year === y;
                      return (
                        <TouchableOpacity
                          key={y}
                          style={[
                            styles.pickerItem,
                            isSelected && styles.pickerItemSelected,
                          ]}
                          onPress={() => {
                            setYear(y);
                            setActivePicker(null);
                          }}
                          activeOpacity={0.7}
                          accessibilityRole="button"
                          accessibilityLabel={`Year ${y}`}
                        >
                          <Text
                            style={[
                              styles.pickerItemText,
                              isSelected && styles.pickerItemTextSelected,
                            ]}
                          >
                            Year {y}
                          </Text>
                          {isSelected && (
                            <Ionicons name="checkmark" size={18} color={Palette.primary} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                )}

                {/* Season Options List */}
                {activePicker === 'season' && (
                  <View style={styles.pickerList}>
                    {SEASONS.map((s) => {
                      const isSelected = season === s;
                      const iconName =
                        s === 'spring'
                          ? 'leaf'
                          : s === 'summer'
                          ? 'sunny'
                          : s === 'fall'
                          ? 'partly-sunny'
                          : 'snow';
                      return (
                        <TouchableOpacity
                          key={s}
                          style={[
                            styles.pickerItem,
                            isSelected && styles.pickerItemSelected,
                          ]}
                          onPress={() => {
                            setSeason(s);
                            setActivePicker(null);
                          }}
                          activeOpacity={0.7}
                          accessibilityRole="button"
                          accessibilityLabel={SEASON_LABELS[s]}
                        >
                          <View style={styles.pickerItemLeft}>
                            <Ionicons
                              name={iconName}
                              size={18}
                              color={isSelected ? Palette.primary : Palette.textSecondary}
                            />
                            <Text
                              style={[
                                styles.pickerItemText,
                                isSelected && styles.pickerItemTextSelected,
                              ]}
                            >
                              {SEASON_LABELS[s]}
                            </Text>
                          </View>
                          {isSelected && (
                            <Ionicons name="checkmark" size={18} color={Palette.primary} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {/* Day Options Grid (7 columns x 4 rows) */}
                {activePicker === 'day' && (
                  <View style={styles.daysGrid}>
                    {DAY_OPTIONS.map((d) => {
                      const isSelected = day === d;
                      return (
                        <TouchableOpacity
                          key={d}
                          style={[
                            styles.dayCell,
                            isSelected && styles.dayCellSelected,
                          ]}
                          onPress={() => {
                            setDay(d);
                            setActivePicker(null);
                          }}
                          activeOpacity={0.7}
                          accessibilityRole="button"
                          accessibilityLabel={`Day ${d}`}
                        >
                          <Text
                            style={[
                              styles.dayCellText,
                              isSelected && styles.dayCellTextSelected,
                            ]}
                          >
                            {d}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            </View>
          )}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Tokens.spacing.lg,
  },
  inputGroup: {
    marginBottom: Tokens.spacing.xl,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textPrimary,
    marginBottom: Tokens.spacing.sm,
  },
  textInput: {
    minHeight: 48,
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    paddingHorizontal: Tokens.spacing.md,
    fontSize: 16,
    color: Palette.textPrimary,
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
  dropdownsRow: {
    flexDirection: 'row',
    gap: Tokens.spacing.sm,
  },
  dropdownBtn: {
    flex: 1,
    minHeight: 46,
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Tokens.spacing.sm,
  },
  dropdownBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  noteInput: {
    minHeight: 80,
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    padding: Tokens.spacing.md,
    fontSize: 15,
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
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(24, 52, 58, 0.45)',
    justifyContent: 'flex-end',
    zIndex: 999,
  },
  pickerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pickerCard: {
    backgroundColor: Palette.white,
    borderTopLeftRadius: Tokens.radius.modal,
    borderTopRightRadius: Tokens.radius.modal,
    paddingHorizontal: Tokens.spacing.lg,
    paddingTop: Tokens.spacing.md,
    paddingBottom: Tokens.spacing.xl,
    maxHeight: '75%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Tokens.spacing.sm,
    paddingBottom: Tokens.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderLight,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  pickerCloseBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerList: {
    paddingVertical: Tokens.spacing.xs,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: Tokens.spacing.md,
    borderRadius: Tokens.radius.md,
    backgroundColor: Palette.chipBg,
    marginBottom: 6,
  },
  pickerItemSelected: {
    backgroundColor: Palette.primaryLight,
  },
  pickerItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Tokens.spacing.sm,
  },
  pickerItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  pickerItemTextSelected: {
    color: Palette.primary,
    fontWeight: '700',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingVertical: Tokens.spacing.xs,
    justifyContent: 'space-between',
  },
  dayCell: {
    width: '12.5%',
    aspectRatio: 1,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: Palette.chipBg,
    borderWidth: 1,
    borderColor: Palette.borderLight,
  },
  dayCellSelected: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  dayCellText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  dayCellTextSelected: {
    color: Palette.white,
  },
});
