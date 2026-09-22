import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '@/store/useGameStore';
import { TodoItem } from '@/components/TodoItem';
import { QuickTodoInput } from '@/components/QuickTodoInput';
import { AddTaskModal } from '@/components/AddTaskModal';
import { NoFarmView } from '@/components/NoFarmView';
import { TaskCategory } from '@/types/game';
import { CATEGORY_LABELS, CATEGORY_ICONS, formatGameDate } from '@/utils/gameDate';
import { Palette, Tokens } from '@/constants/Colors';

const ALL_CATEGORIES: ('all' | TaskCategory)[] = [
  'all',
  'farming',
  'mining',
  'diving',
  'fishing',
  'relationship',
  'museum',
  'quest',
  'general',
];

export default function TodayScreen() {
  const { activeProfile, todayTodos, addTodo, toggleTodo, deleteTodo } =
    useGameStore();

  const [selectedFilter, setSelectedFilter] = useState<'all' | TaskCategory>('all');
  const [showFilterPicker, setShowFilterPicker] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);


  if (!activeProfile) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <NoFarmView />
      </SafeAreaView>
    );
  }

  const dateText = formatGameDate({
    year: activeProfile.currentYear,
    season: activeProfile.currentSeason,
    day: activeProfile.currentDay,
  });

  const filteredTodos =
    selectedFilter === 'all'
      ? todayTodos
      : todayTodos.filter((t) => t.category === selectedFilter);

  const completedCount = todayTodos.filter((t) => t.isCompleted).length;
  const progressPercent =
    todayTodos.length > 0 ? Math.round((completedCount / todayTodos.length) * 100) : 0;

  const getCategoryCount = (cat: 'all' | TaskCategory) => {
    if (cat === 'all') return todayTodos.length;
    return todayTodos.filter((t) => t.category === cat).length;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Daily Planner</Text>
          <Text style={styles.headerDate}>{dateText}</Text>
        </View>
        <TouchableOpacity
          style={styles.headerAddBtn}
          onPress={() => setShowAddTask(true)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Add Task modal"
        >
          <Ionicons name="add" size={20} color={Palette.white} />
          <Text style={styles.headerAddBtnText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar Card */}
      {todayTodos.length > 0 && (
        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Tasks Progress</Text>
            <Text style={styles.progressValue}>
              {completedCount} of {todayTodos.length} ({progressPercent}%)
            </Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPercent}%` },
              ]}
            />
          </View>
        </View>
      )}

      {/* Quick Add Input */}
      <View style={styles.inputSection}>
        <QuickTodoInput
          onAdd={addTodo}
          defaultCategory={selectedFilter === 'all' ? 'general' : selectedFilter}
        />
      </View>

      {/* Filter Dropdown Section */}
      <View style={styles.filterSection}>
        <View style={styles.filterHeaderRow}>
          <View style={styles.filterHeaderLeft}>
            <Ionicons name="funnel-outline" size={13} color={Palette.textSecondary} />
            <Text style={styles.filterHeading}>Filter by Category</Text>
          </View>
          {selectedFilter !== 'all' && (
            <TouchableOpacity
              onPress={() => setSelectedFilter('all')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Reset filter to show all tasks"
            >
              <Text style={styles.resetFilterLink}>Reset to All</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.dropdownBtn,
            selectedFilter !== 'all' && styles.dropdownBtnActive,
          ]}
          onPress={() => setShowFilterPicker(true)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Filter: ${selectedFilter === 'all' ? 'All Categories' : CATEGORY_LABELS[selectedFilter]}. Tap to select.`}
        >
          <View style={styles.dropdownBtnLeft}>
            <View
              style={[
                styles.dropdownIconCircle,
                selectedFilter !== 'all' && styles.dropdownIconCircleActive,
              ]}
            >
              <Ionicons
                name={
                  selectedFilter === 'all'
                    ? 'layers-outline'
                    : ((CATEGORY_ICONS[selectedFilter] as any) || 'ellipse')
                }
                size={16}
                color={selectedFilter !== 'all' ? Palette.white : Palette.primary}
              />
            </View>
            <Text
              style={[
                styles.dropdownBtnText,
                selectedFilter !== 'all' && styles.dropdownBtnTextActive,
              ]}
            >
              {selectedFilter === 'all' ? 'All Categories' : CATEGORY_LABELS[selectedFilter]}
            </Text>
          </View>

          <View style={styles.dropdownBtnRight}>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {filteredTodos.length} {filteredTodos.length === 1 ? 'task' : 'tasks'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={16} color={Palette.textSecondary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Todo List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="list-outline" size={40} color={Palette.textMuted} />
            <Text style={styles.emptyTitle}>
              {selectedFilter === 'all'
                ? 'Nothing planned yet.'
                : `No tasks under "${CATEGORY_LABELS[selectedFilter]}".`}
            </Text>
            <Text style={styles.emptySub}>
              Use the input above or tap + Add Task to create a task.
            </Text>
            {selectedFilter !== 'all' && (
              <TouchableOpacity
                onPress={() => setSelectedFilter('all')}
                style={styles.resetFilterBtn}
                accessibilityRole="button"
                accessibilityLabel="Show all tasks"
              >
                <Text style={styles.resetFilterBtnText}>Show All Tasks</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Add Task Modal */}
      <AddTaskModal
        visible={showAddTask}
        onClose={() => setShowAddTask(false)}
        initialCategory={selectedFilter === 'all' ? 'farming' : selectedFilter}
      />

      {/* Category Dropdown Picker Modal */}
      <Modal
        visible={showFilterPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFilterPicker(false)}
      >
        <View style={styles.pickerOverlay}>
          <TouchableOpacity
            style={styles.pickerBackdrop}
            activeOpacity={1}
            onPress={() => setShowFilterPicker(false)}
            accessibilityRole="button"
            accessibilityLabel="Close category filter dialog"
          />
          <View style={styles.pickerCard}>
            <View style={styles.pickerHeader}>
              <View style={styles.pickerHeaderTitleRow}>
                <Ionicons name="funnel-outline" size={18} color={Palette.primary} />
                <Text style={styles.pickerTitle}>Filter by Category</Text>
              </View>
              <TouchableOpacity
                style={styles.pickerCloseBtn}
                onPress={() => setShowFilterPicker(false)}
                accessibilityRole="button"
                accessibilityLabel="Close filter dialog"
              >
                <Ionicons name="close" size={22} color={Palette.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={false}>
              {ALL_CATEGORIES.map((cat) => {
                const isSelected = selectedFilter === cat;
                const count = getCategoryCount(cat);
                const iconName =
                  cat === 'all'
                    ? 'layers-outline'
                    : ((CATEGORY_ICONS[cat] as any) || 'ellipse');

                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.pickerItem,
                      isSelected && styles.pickerItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedFilter(cat);
                      setShowFilterPicker(false);
                    }}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`${cat === 'all' ? 'All Categories' : CATEGORY_LABELS[cat]}, ${count} tasks`}
                  >
                    <View style={styles.pickerItemLeft}>
                      <View
                        style={[
                          styles.pickerIconBox,
                          isSelected && styles.pickerIconBoxSelected,
                        ]}
                      >
                        <Ionicons
                          name={iconName}
                          size={18}
                          color={isSelected ? Palette.white : Palette.primary}
                        />
                      </View>
                      <Text
                        style={[
                          styles.pickerItemText,
                          isSelected && styles.pickerItemTextSelected,
                        ]}
                      >
                        {cat === 'all' ? 'All Categories' : CATEGORY_LABELS[cat]}
                      </Text>
                      {count > 0 && (
                        <View style={styles.pickerCountBadge}>
                          <Text
                            style={[
                              styles.pickerCountBadgeText,
                              isSelected && styles.pickerCountBadgeTextSelected,
                            ]}
                          >
                            {count}
                          </Text>
                        </View>
                      )}
                    </View>

                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color={Palette.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Tokens.spacing.lg,
    paddingTop: Tokens.spacing.sm,
    paddingBottom: Tokens.spacing.md,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  headerDate: {
    fontSize: 13,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: Tokens.spacing.md,
    backgroundColor: Palette.primary,
    borderRadius: Tokens.radius.md,
    gap: 4,
  },
  headerAddBtnText: {
    color: Palette.white,
    fontSize: 13,
    fontWeight: '700',
  },
  progressCard: {
    backgroundColor: Palette.white,
    marginHorizontal: Tokens.spacing.lg,
    marginBottom: Tokens.spacing.md,
    padding: Tokens.spacing.md,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Tokens.spacing.xs,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: Palette.borderLight,
    borderRadius: Tokens.radius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Palette.primary,
    borderRadius: Tokens.radius.full,
  },
  inputSection: {
    paddingHorizontal: Tokens.spacing.lg,
    marginBottom: Tokens.spacing.md,
  },
  filterSection: {
    paddingHorizontal: Tokens.spacing.lg,
    marginBottom: Tokens.spacing.md,
  },
  filterHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  filterHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resetFilterLink: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    backgroundColor: Palette.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    paddingHorizontal: 12,
  },
  dropdownBtnActive: {
    borderColor: Palette.primary,
    backgroundColor: Palette.primaryLight,
  },
  dropdownBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  dropdownIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Palette.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownIconCircleActive: {
    backgroundColor: Palette.primary,
  },
  dropdownBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  dropdownBtnTextActive: {
    color: Palette.primary,
  },
  dropdownBtnRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Tokens.radius.full,
    backgroundColor: Palette.chipBg,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSecondary,
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
  pickerHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    flex: 1,
  },
  pickerIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerIconBoxSelected: {
    backgroundColor: Palette.primary,
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
  pickerCountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Tokens.radius.full,
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.borderLight,
  },
  pickerCountBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  pickerCountBadgeTextSelected: {
    color: Palette.primary,
  },
  listContent: {
    paddingHorizontal: Tokens.spacing.lg,
    paddingTop: Tokens.spacing.xs,
    paddingBottom: Tokens.spacing.xxl,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: Tokens.spacing.xl,
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.lg,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    marginTop: Tokens.spacing.md,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginTop: Tokens.spacing.md,
    marginBottom: Tokens.spacing.xs,
  },
  emptySub: {
    fontSize: 13,
    color: Palette.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  resetFilterBtn: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Tokens.spacing.md,
    paddingHorizontal: Tokens.spacing.md,
  },
  resetFilterBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.primary,
  },
});
