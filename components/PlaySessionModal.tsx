import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Tokens } from '@/constants/Colors';
import { TaskCategory } from '@/types/game';
import {
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  formatGameDate,
  formatStopwatch,
} from '@/utils/gameDate';
import { useGameStore } from '@/store/useGameStore';

interface PlaySessionModalProps {
  visible: boolean;
  onClose: () => void;
  onEndSession: (durationSeconds: number, activities: TaskCategory[]) => void;
}

const ALL_CATEGORIES: TaskCategory[] = [
  'farming',
  'fishing',
  'mining',
  'diving',
  'relationship',
  'museum',
  'quest',
  'general',
];

export function PlaySessionModal({
  visible,
  onClose,
  onEndSession,
}: PlaySessionModalProps) {
  const { activeProfile, activeSessionStartTime, activeSessionActivities } =
    useGameStore();

  const [userSelectedActivities, setUserSelectedActivities] = useState<TaskCategory[] | null>(null);
  const selectedActivities =
    userSelectedActivities ??
    (activeSessionActivities.length > 0 ? activeSessionActivities : ['farming']);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [visible]);

  const start = activeSessionStartTime || now;
  const elapsedSeconds = Math.max(0, Math.floor((now - start) / 1000));

  const toggleCategory = (cat: TaskCategory) => {
    const current = selectedActivities;
    if (current.includes(cat)) {
      if (current.length > 1) {
        setUserSelectedActivities(current.filter((c) => c !== cat));
      }
    } else {
      setUserSelectedActivities([...current, cat]);
    }
  };

  const handleClose = () => {
    setUserSelectedActivities(null);
    onClose();
  };

  const handleEnd = () => {
    setUserSelectedActivities(null);
    onEndSession(elapsedSeconds, selectedActivities);
  };

  const startDate = activeSessionStartTime
    ? new Date(activeSessionStartTime)
    : new Date();
  const startTimeStr = startDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

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
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Close play session"
          >
            <Ionicons name="close" size={24} color={Palette.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Play Session</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Game Date Badge */}
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

          {/* Large Timer Display */}
          <View style={styles.timerCard}>
            <Text style={styles.timerDigits}>
              {formatStopwatch(elapsedSeconds)}
            </Text>
            <Text style={styles.timerSub}>Started at {startTimeStr}</Text>
          </View>

          {/* Activities Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activities</Text>
            <Text style={styles.sectionSub}>
              Select what you are doing during this session:
            </Text>
            <View style={styles.chipsContainer}>
              {ALL_CATEGORIES.map((cat) => {
                const isSelected = selectedActivities.includes(cat);
                const iconName = CATEGORY_ICONS[cat] as keyof typeof Ionicons.glyphMap;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.chip,
                      isSelected && styles.chipSelected,
                    ]}
                    onPress={() => toggleCategory(cat)}
                    activeOpacity={0.7}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isSelected }}
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
        </ScrollView>

        {/* Footer End Session Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.endBtn}
            onPress={handleEnd}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="End Session"
          >
            <Ionicons name="stop-circle" size={20} color={Palette.white} />
            <Text style={styles.endBtnText}>End Session</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
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
    alignItems: 'center',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: Tokens.spacing.md,
    paddingVertical: Tokens.spacing.xs,
    borderRadius: Tokens.radius.full,
    gap: 6,
    marginBottom: Tokens.spacing.lg,
  },
  dateBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.primary,
  },
  timerCard: {
    width: '100%',
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.lg,
    paddingVertical: Tokens.spacing.xl,
    paddingHorizontal: Tokens.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.borderLight,
    marginBottom: Tokens.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  timerDigits: {
    fontSize: 48,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
    marginBottom: Tokens.spacing.xs,
  },
  timerSub: {
    fontSize: 14,
    color: Palette.textMuted,
  },
  section: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: Tokens.spacing.xs,
  },
  sectionSub: {
    fontSize: 13,
    color: Palette.textSecondary,
    marginBottom: Tokens.spacing.md,
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
  footer: {
    padding: Tokens.spacing.md,
    backgroundColor: Palette.white,
    borderTopWidth: 1,
    borderTopColor: Palette.borderLight,
  },
  endBtn: {
    flexDirection: 'row',
    backgroundColor: Palette.danger,
    minHeight: 48,
    borderRadius: Tokens.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: Palette.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  endBtnText: {
    color: Palette.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
