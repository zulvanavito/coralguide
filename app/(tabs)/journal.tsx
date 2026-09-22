import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '@/store/useGameStore';
import {
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  SEASON_LABELS,
  formatDuration,
} from '@/utils/gameDate';
import { Palette, Tokens } from '@/constants/Colors';
import { NoFarmView } from '@/components/NoFarmView';

export default function JournalScreen() {
  const { activeProfile, allSessions } = useGameStore();

  if (!activeProfile) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <NoFarmView />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Session History</Text>
        <Text style={styles.headerSubtitle}>
          Review previous game sessions and progress milestones
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {allSessions.length > 0 ? (
          allSessions.map((sess, idx) => {
            const formattedGameDate = `${SEASON_LABELS[sess.gameSeason]} ${sess.gameDay} · Year ${sess.gameYear}`;
            const realDate = new Date(sess.realPlayedAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <View
                key={`${sess.id}_${idx}`}
                style={styles.sessionCard}
                accessible={true}
                accessibilityRole="summary"
                accessibilityLabel={`Session ${formattedGameDate}. Note: ${sess.note || 'No notes'}`}
              >
                {/* Header Row */}
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionDateBadge}>
                    <Ionicons name="calendar-outline" size={13} color={Palette.primary} />
                    <Text style={styles.sessionDateText}>{formattedGameDate}</Text>
                  </View>
                  <View style={styles.headerRight}>
                    {sess.durationSeconds && sess.durationSeconds > 0 ? (
                      <View style={styles.durationBadge}>
                        <Ionicons name="time-outline" size={12} color={Palette.primary} />
                        <Text style={styles.durationText}>
                          {formatDuration(sess.durationSeconds)}
                        </Text>
                      </View>
                    ) : null}
                    <Text style={styles.sessionRealDate}>{realDate}</Text>
                  </View>
                </View>

                {/* Activities Chips */}
                {sess.activities.length > 0 && (
                  <View style={styles.activitiesRow}>
                    {sess.activities.map((act) => (
                      <View key={act} style={styles.activityBadge}>
                        <Ionicons
                          name={(CATEGORY_ICONS[act] as any) || 'ellipse'}
                          size={11}
                          color={Palette.primary}
                        />
                        <Text style={styles.activityText}>
                          {CATEGORY_LABELS[act] || act}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Note */}
                {sess.note.length > 0 && (
                  <View style={styles.noteBox}>
                    <Ionicons
                      name="chatbubble-ellipses-outline"
                      size={14}
                      color={Palette.primary}
                      style={{ marginTop: 2, marginRight: 6 }}
                    />
                    <Text style={styles.noteText}>&ldquo;{sess.note}&rdquo;</Text>
                  </View>
                )}

                {/* Next Tasks */}
                {sess.nextTasks.length > 0 && (
                  <View style={styles.nextTasksBox}>
                    <Text style={styles.nextTasksTitle}>Planned Targets:</Text>
                    {sess.nextTasks.map((task, tIdx) => (
                      <View key={`${task}_${tIdx}`} style={styles.nextTaskRow}>
                        <Ionicons name="checkbox-outline" size={14} color={Palette.primary} />
                        <Text style={styles.nextTaskText}>{task}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={48} color={Palette.textMuted} />
            <Text style={styles.emptyTitle}>No Session History Yet</Text>
            <Text style={styles.emptySub}>
              When you conclude a play session using &ldquo;End Session&rdquo;, your notes, activities, and duration will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  header: {
    paddingHorizontal: Tokens.spacing.lg,
    paddingTop: Tokens.spacing.sm,
    paddingBottom: Tokens.spacing.md,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: Tokens.spacing.lg,
    paddingBottom: Tokens.spacing.xxl,
  },
  sessionCard: {
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.lg,
    padding: Tokens.spacing.md,
    marginBottom: Tokens.spacing.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Tokens.spacing.sm,
  },
  sessionDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: Tokens.spacing.sm,
    paddingVertical: 4,
    borderRadius: Tokens.radius.full,
  },
  sessionDateText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Tokens.radius.full,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primary,
  },
  sessionRealDate: {
    fontSize: 11,
    fontWeight: '500',
    color: Palette.textMuted,
  },
  activitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Tokens.spacing.sm,
  },
  activityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: Tokens.spacing.sm,
    paddingVertical: 3,
    borderRadius: Tokens.radius.sm,
  },
  activityText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Palette.background,
    borderRadius: Tokens.radius.sm,
    padding: Tokens.spacing.sm,
    marginBottom: Tokens.spacing.sm,
    borderWidth: 1,
    borderColor: Palette.borderLight,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: Palette.textPrimary,
    lineHeight: 18,
  },
  nextTasksBox: {
    borderTopWidth: 1,
    borderTopColor: Palette.borderLight,
    paddingTop: Tokens.spacing.xs,
  },
  nextTasksTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  nextTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  nextTaskText: {
    fontSize: 13,
    color: Palette.textPrimary,
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
    lineHeight: 19,
  },
});
