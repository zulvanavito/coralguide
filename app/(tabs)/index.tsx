import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '@/store/useGameStore';
import { LastSessionCard } from '@/components/LastSessionCard';
import { TodoItem } from '@/components/TodoItem';
import { NoFarmView } from '@/components/NoFarmView';
import { WelcomeModal } from '@/components/WelcomeModal';
import { PlaySessionModal } from '@/components/PlaySessionModal';
import { EndSessionModal } from '@/components/EndSessionModal';
import { AddTaskModal } from '@/components/AddTaskModal';
import { QuickNoteModal } from '@/components/QuickNoteModal';
import { EditDateModal } from '@/components/EditDateModal';
import { ProfileManagerModal } from '@/components/ProfileManagerModal';
import { TaskCategory } from '@/types/game';
import {
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  getTimeOfDay,
  getGreeting,
  formatGameDate,
  formatStopwatch,
  getSeasonTheme,
} from '@/utils/gameDate';
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

export default function HomeScreen() {
  const {
    isInitialized,
    hasSeenWelcome,
    setHasSeenWelcome,
    activeProfile,
    todayTodos,
    todayNotes,
    toggleTodo,
    deleteTodo,
    deleteQuickNote,
    activeSessionStartTime,
    activeSessionActivities,
    startSession,
  } = useGameStore();

  const [showPlaySession, setShowPlaySession] = useState(false);
  const [showEndSession, setShowEndSession] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showQuickNote, setShowQuickNote] = useState(false);
  const [showEditDate, setShowEditDate] = useState(false);
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | TaskCategory>('all');
  const [sessionDuration, setSessionDuration] = useState(0);
  const [endSessionActivities, setEndSessionActivities] = useState<TaskCategory[]>([]);

  // Active session stopwatch ticker
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!activeSessionStartTime) return;
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [activeSessionStartTime]);

  const activeSeconds = activeSessionStartTime
    ? Math.max(0, Math.floor((now - activeSessionStartTime) / 1000))
    : 0;

  if (!isInitialized) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Palette.primary} />
        <Text style={styles.loadingText}>Loading Coral Island Companion...</Text>
      </SafeAreaView>
    );
  }

  if (!activeProfile) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <NoFarmView />
        <ProfileManagerModal
          visible={showProfileManager}
          onClose={() => setShowProfileManager(false)}
        />
      </SafeAreaView>
    );
  }

  const timeOfDay = getTimeOfDay();
  const greeting = getGreeting(timeOfDay);

  const heroBg =
    timeOfDay === 'morning'
      ? require('@/assets/images/bg-morning.png')
      : timeOfDay === 'evening'
      ? require('@/assets/images/bg-evening.png')
      : require('@/assets/images/bg-night.png');

  const seasonTheme = getSeasonTheme(activeProfile.currentSeason);
  const completedCount = todayTodos.filter((t) => t.isCompleted).length;
  const filteredTodos =
    selectedFilter === 'all'
      ? todayTodos
      : todayTodos.filter((t) => t.category === selectedFilter);

  const handleStartSession = () => {
    startSession(['farming']);
    setShowPlaySession(true);
  };

  const handleEndFromPlay = (duration: number, activities: TaskCategory[]) => {
    setShowPlaySession(false);
    setSessionDuration(duration);
    setEndSessionActivities(activities);
    setShowEndSession(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Hero Card with Dynamic Time-of-Day Background */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={heroBg}
            style={styles.heroBg}
            imageStyle={styles.heroBgImage}
          >
            <View style={styles.heroOverlay}>
              {/* Profile & Switcher Row */}
              <View style={styles.heroTopRow}>
                <TouchableOpacity
                  style={styles.profilePill}
                  onPress={() => setShowProfileManager(true)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={`Switch farm save: ${activeProfile.saveName}`}
                >
                  <Ionicons name="leaf" size={14} color={Palette.primary} />
                  <Text style={styles.profilePillText} numberOfLines={1}>
                    {activeProfile.saveName}
                  </Text>
                  <Ionicons name="chevron-down" size={12} color={Palette.textSecondary} />
                </TouchableOpacity>

                {/* Date Badge */}
                <TouchableOpacity
                  style={styles.datePill}
                  onPress={() => setShowEditDate(true)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Edit game date"
                >
                  <Ionicons name="calendar-outline" size={13} color={seasonTheme.accent} />
                  <Text style={styles.datePillText}>
                    {formatGameDate({
                      year: activeProfile.currentYear,
                      season: activeProfile.currentSeason,
                      day: activeProfile.currentDay,
                    })}
                  </Text>
                  <Ionicons name="pencil" size={11} color={Palette.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Greeting Text */}
              <View style={styles.greetingContainer}>
                <Text style={styles.greetingText}>{greeting.text}</Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* 2. Session Tracker Card */}
        <View style={styles.sectionContainer}>
          {activeSessionStartTime ? (
            <View style={styles.activeSessionCard}>
              <View style={styles.activeSessionLeft}>
                <View style={styles.activePulseDot} />
                <View>
                  <Text style={styles.activeSessionLabel}>Session In Progress</Text>
                  <Text style={styles.activeSessionTimer}>
                    {formatStopwatch(activeSeconds)}
                  </Text>
                </View>
              </View>

              <View style={styles.activeSessionActions}>
                <TouchableOpacity
                  style={styles.activeActionBtn}
                  onPress={() => setShowPlaySession(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Open current play session"
                >
                  <Ionicons name="expand-outline" size={16} color={Palette.primary} />
                  <Text style={styles.activeActionBtnText}>View</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.activeEndBtn}
                  onPress={() => {
                    setSessionDuration(activeSeconds);
                    setEndSessionActivities(activeSessionActivities);
                    setShowEndSession(true);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="End session"
                >
                  <Ionicons name="stop-circle-outline" size={16} color={Palette.white} />
                  <Text style={styles.activeEndBtnText}>End</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.startSessionCard}
              onPress={handleStartSession}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Start Play Session"
            >
              <View style={styles.startSessionIconBox}>
                <Ionicons name="play" size={20} color={Palette.white} />
              </View>
              <View style={styles.startSessionTextCol}>
                <Text style={styles.startSessionTitle}>Start Play Session</Text>
                <Text style={styles.startSessionSub}>
                  Track your play time, diving, farming, and activities
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Palette.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* 3. Quick Action Buttons Row */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={styles.actionPill}
            onPress={() => setShowAddTask(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Add Task"
          >
            <Ionicons name="add-circle" size={18} color={Palette.primary} />
            <Text style={styles.actionPillText}>Add Task</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionPill}
            onPress={() => setShowQuickNote(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Quick Note"
          >
            <Ionicons name="create-outline" size={18} color={Palette.primary} />
            <Text style={styles.actionPillText}>Quick Note</Text>
          </TouchableOpacity>
        </View>

        {/* 4. Today's Tasks Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderTitleCol}>
              <Text style={styles.sectionHeading}>{"Today's Tasks"}</Text>
              <Text style={styles.sectionSubheading}>Keep track of daily farm targets</Text>
            </View>
            {todayTodos.length > 0 && (
              <View style={styles.counterBadge}>
                <Text style={styles.counterBadgeText}>
                  {completedCount}/{todayTodos.length} done
                </Text>
              </View>
            )}
          </View>

          {/* Filter Chips */}
          {todayTodos.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
              contentContainerStyle={styles.filterScrollContent}
            >
              {ALL_CATEGORIES.map((cat) => {
                const isSelected = selectedFilter === cat;
                const count =
                  cat === 'all'
                    ? todayTodos.length
                    : todayTodos.filter((t) => t.category === cat).length;

                if (cat !== 'all' && count === 0 && !isSelected) return null;

                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.filterChip,
                      isSelected && styles.filterChipSelected,
                    ]}
                    onPress={() => setSelectedFilter(cat)}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Filter ${cat}`}
                  >
                    <Ionicons
                      name={
                        cat === 'all'
                          ? 'layers-outline'
                          : ((CATEGORY_ICONS[cat] as any) || 'ellipse')
                      }
                      size={13}
                      color={isSelected ? Palette.white : Palette.textSecondary}
                    />
                    <Text
                      style={[
                        styles.filterChipText,
                        isSelected && styles.filterChipTextSelected,
                      ]}
                    >
                      {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]} ({count})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Tasks List or Empty State */}
          {filteredTodos.length > 0 ? (
            <View style={styles.todoList}>
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </View>
          ) : todayTodos.length > 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="filter-outline" size={24} color={Palette.textMuted} />
              <Text style={styles.emptyTitle}>No tasks in this category</Text>
              <TouchableOpacity
                onPress={() => setSelectedFilter('all')}
                style={styles.resetFilterBtn}
                accessibilityRole="button"
                accessibilityLabel="Show all tasks"
              >
                <Text style={styles.resetFilterBtnText}>Show All Tasks</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="checkbox-outline" size={32} color={Palette.textMuted} />
              <Text style={styles.emptyTitle}>Nothing planned yet.</Text>
              <Text style={styles.emptySub}>
                Add something you want to accomplish today.
              </Text>
              <TouchableOpacity
                style={styles.emptyActionBtn}
                onPress={() => setShowAddTask(true)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Add Task"
              >
                <Ionicons name="add" size={16} color={Palette.white} />
                <Text style={styles.emptyActionBtnText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 5. Last Session Card */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>Last Session</Text>
          <LastSessionCard />
        </View>

        {/* 6. Quick Notes Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Quick Notes</Text>
            <TouchableOpacity
              onPress={() => setShowQuickNote(true)}
              style={styles.addNoteHeaderBtn}
              accessibilityRole="button"
              accessibilityLabel="Add Quick Note"
            >
              <Ionicons name="add" size={16} color={Palette.primary} />
              <Text style={styles.addNoteHeaderBtnText}>Add Note</Text>
            </TouchableOpacity>
          </View>

          {todayNotes.length > 0 ? (
            <View style={styles.notesList}>
              {todayNotes.map((note) => (
                <View key={note.id} style={styles.noteItem}>
                  <View style={styles.noteItemBody}>
                    <Text style={styles.noteItemText}>{note.content}</Text>
                    <Text style={styles.noteItemTime}>
                      {new Date(note.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => deleteQuickNote(note.id)}
                    style={styles.noteDeleteBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Delete note"
                  >
                    <Ionicons name="trash-outline" size={18} color={Palette.textMuted} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="create-outline" size={28} color={Palette.textMuted} />
              <Text style={styles.emptyTitle}>No notes for today yet.</Text>
              <Text style={styles.emptySub}>
                Quickly jot down coordinates, reminders, or gifts.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      <WelcomeModal
        visible={!hasSeenWelcome}
        onGetStarted={() => setHasSeenWelcome(true)}
      />

      <PlaySessionModal
        visible={showPlaySession}
        onClose={() => setShowPlaySession(false)}
        onEndSession={handleEndFromPlay}
      />

      <EndSessionModal
        visible={showEndSession}
        onClose={() => setShowEndSession(false)}
        durationSeconds={sessionDuration}
        initialActivities={endSessionActivities}
      />

      <AddTaskModal
        visible={showAddTask}
        onClose={() => setShowAddTask(false)}
      />

      <QuickNoteModal
        visible={showQuickNote}
        onClose={() => setShowQuickNote(false)}
      />

      <EditDateModal
        visible={showEditDate}
        onClose={() => setShowEditDate(false)}
      />

      <ProfileManagerModal
        visible={showProfileManager}
        onClose={() => setShowProfileManager(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Palette.background,
  },
  loadingText: {
    marginTop: Tokens.spacing.md,
    fontSize: 14,
    color: Palette.textSecondary,
  },
  scrollContent: {
    paddingBottom: Tokens.spacing.xxl,
  },
  heroContainer: {
    marginHorizontal: Tokens.spacing.md,
    marginTop: Tokens.spacing.xs,
    marginBottom: Tokens.spacing.md,
    borderRadius: Tokens.radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  heroBg: {
    width: '100%',
    minHeight: 180,
  },
  heroBgImage: {
    borderRadius: Tokens.radius.lg,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    padding: Tokens.spacing.md,
    justifyContent: 'space-between',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Tokens.spacing.sm,
  },
  profilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: Tokens.spacing.sm,
    paddingVertical: 6,
    borderRadius: Tokens.radius.full,
    gap: 4,
    maxWidth: '48%',
    borderWidth: 1,
    borderColor: Palette.borderLight,
  },
  profilePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: Tokens.spacing.sm,
    paddingVertical: 6,
    borderRadius: Tokens.radius.full,
    gap: 4,
    borderWidth: 1,
    borderColor: Palette.borderLight,
  },
  datePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  greetingContainer: {
    marginTop: Tokens.spacing.md,
    marginBottom: Tokens.spacing.xs,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.textPrimary,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  sectionContainer: {
    marginHorizontal: Tokens.spacing.md,
    marginBottom: Tokens.spacing.lg,
  },
  activeSessionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Palette.white,
    padding: Tokens.spacing.md,
    borderRadius: Tokens.radius.md,
    borderWidth: 1.5,
    borderColor: Palette.primary,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  activeSessionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Tokens.spacing.sm,
  },
  activePulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Palette.success,
  },
  activeSessionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  activeSessionTimer: {
    fontSize: 20,
    fontWeight: '700',
    color: Palette.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  activeSessionActions: {
    flexDirection: 'row',
    gap: Tokens.spacing.xs,
  },
  activeActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: Tokens.spacing.sm,
    borderRadius: Tokens.radius.sm,
    backgroundColor: Palette.primaryLight,
    gap: 4,
  },
  activeActionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.primary,
  },
  activeEndBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: Tokens.spacing.sm,
    borderRadius: Tokens.radius.sm,
    backgroundColor: Palette.danger,
    gap: 4,
  },
  activeEndBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.white,
  },
  startSessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    padding: Tokens.spacing.md,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    gap: Tokens.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  startSessionIconBox: {
    width: 44,
    height: 44,
    borderRadius: Tokens.radius.md,
    backgroundColor: Palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startSessionTextCol: {
    flex: 1,
  },
  startSessionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  startSessionSub: {
    fontSize: 12,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  quickActionsRow: {
    flexDirection: 'row',
    marginHorizontal: Tokens.spacing.md,
    marginBottom: Tokens.spacing.lg,
    gap: Tokens.spacing.sm,
  },
  actionPill: {
    flex: 1,
    minHeight: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    gap: 6,
  },
  actionPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Tokens.spacing.sm,
  },
  sectionHeaderTitleCol: {
    flex: 1,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  sectionSubheading: {
    fontSize: 13,
    color: Palette.textSecondary,
    marginTop: 1,
  },
  counterBadge: {
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: Tokens.spacing.sm,
    paddingVertical: 3,
    borderRadius: Tokens.radius.full,
  },
  counterBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  filterScroll: {
    marginBottom: Tokens.spacing.sm,
  },
  filterScrollContent: {
    gap: Tokens.spacing.xs,
    paddingVertical: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: Tokens.spacing.sm,
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.full,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    gap: 4,
  },
  filterChipSelected: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  filterChipTextSelected: {
    color: Palette.white,
  },
  todoList: {
    marginTop: Tokens.spacing.xs,
  },
  emptyCard: {
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.md,
    padding: Tokens.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.borderLight,
    marginTop: Tokens.spacing.xs,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginTop: Tokens.spacing.sm,
  },
  emptySub: {
    fontSize: 13,
    color: Palette.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: Tokens.spacing.md,
  },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: Tokens.spacing.md,
    backgroundColor: Palette.primary,
    borderRadius: Tokens.radius.md,
    gap: 6,
  },
  emptyActionBtnText: {
    color: Palette.white,
    fontSize: 14,
    fontWeight: '700',
  },
  resetFilterBtn: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Tokens.spacing.sm,
    paddingHorizontal: Tokens.spacing.md,
  },
  resetFilterBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.primary,
  },
  addNoteHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: Tokens.spacing.sm,
    gap: 4,
  },
  addNoteHeaderBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.primary,
  },
  notesList: {
    gap: Tokens.spacing.xs,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.md,
    padding: Tokens.spacing.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
  },
  noteItemBody: {
    flex: 1,
  },
  noteItemText: {
    fontSize: 14,
    color: Palette.textPrimary,
    lineHeight: 20,
  },
  noteItemTime: {
    fontSize: 11,
    color: Palette.textMuted,
    marginTop: 4,
  },
  noteDeleteBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
