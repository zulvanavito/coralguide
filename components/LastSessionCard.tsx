import { Palette } from "@/constants/Colors";
import { useGameStore } from "@/store/useGameStore";
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  SEASON_LABELS,
  formatDuration,
} from "@/utils/gameDate";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export function LastSessionCard() {
  const lastSession = useGameStore((s) => s.lastSession);

  if (!lastSession) {
    return (
      <View
        style={styles.emptyCard}
        accessible={true}
        accessibilityRole="summary"
        accessibilityLabel="Save Point Ingatanmu: Belum ada sesi terakhir tercatat. Tekan End Session saat selesai bermain untuk mencatat target."
      >
        <View style={styles.emptyIconContainer}>
          <Ionicons
            name="bookmark-outline"
            size={24}
            color={Palette.deepTeal}
          />
        </View>
        <View style={styles.emptyTextContainer}>
          <Text style={styles.emptyTitle}>Save Point Ingatanmu</Text>
          <Text style={styles.emptySubtitle}>
            Saat selesai bermain nanti, tekan{" "}
            <Text style={{ fontWeight: "700" }}>End Session</Text> untuk
            mencatat apa yang terakhir kamu kerjakan dan apa rencana besok.
          </Text>
        </View>
      </View>
    );
  }

  const formattedDate = `${SEASON_LABELS[lastSession.gameSeason]} ${lastSession.gameDay} · Year ${lastSession.gameYear}`;
  const realDate = new Date(lastSession.realPlayedAt).toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <View
      style={styles.card}
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel={`Sesi Terakhir: ${formattedDate}. Catatan: ${lastSession.note || "Tidak ada catatan"}`}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <View style={styles.sessionBadge}>
            <Ionicons name="bookmark" size={14} color={Palette.deepTeal} />
            <Text style={styles.sessionBadgeText}>LAST SESSION</Text>
          </View>
          <Text style={styles.gameDateText}>{formattedDate}</Text>
        </View>
        <View style={styles.timeAndDurationRow}>
          <Text style={styles.realTimeText}>{realDate}</Text>
          {lastSession.durationSeconds && lastSession.durationSeconds > 0 ? (
            <View style={styles.durationBadge}>
              <Ionicons name="time-outline" size={12} color={Palette.primary} />
              <Text style={styles.durationBadgeText}>
                {formatDuration(lastSession.durationSeconds)}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Activities badges */}
      {lastSession.activities.length > 0 && (
        <View style={styles.activitiesRow}>
          {lastSession.activities.map((act) => (
            <View key={act} style={styles.activityChip}>
              <Ionicons
                name={(CATEGORY_ICONS[act] as any) || "ellipse"}
                size={12}
                color={Palette.deepTeal}
              />
              <Text style={styles.activityChipText}>
                {CATEGORY_LABELS[act] || act}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Note Quote */}
      {lastSession.note.length > 0 && (
        <View style={styles.noteBox}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={16}
            color={Palette.deepTeal}
            style={styles.noteIcon}
          />
          <Text style={styles.noteText}>&ldquo;{lastSession.note}&rdquo;</Text>
        </View>
      )}

      {/* Next Tasks */}
      {lastSession.nextTasks.length > 0 && (
        <View style={styles.nextTasksContainer}>
          <Text style={styles.nextTasksTitle}>Rencana Lanjutan:</Text>
          {lastSession.nextTasks.map((task, index) => (
            <View key={index} style={styles.nextTaskItem}>
              <Ionicons
                name="checkbox-outline"
                size={15}
                color={Palette.tropicalBlue}
              />
              <Text style={styles.nextTaskText}>{task}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.cardBg,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: Palette.borderLight,
    shadowColor: Palette.deepTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  sessionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Palette.chipBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Palette.skySoft,
  },
  sessionBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: Palette.deepTeal,
    letterSpacing: 0.5,
  },
  gameDateText: {
    fontSize: 13,
    fontWeight: "700",
    color: Palette.textPrimary,
  },
  timeAndDurationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  realTimeText: {
    fontSize: 11,
    fontWeight: "600",
    color: Palette.sandWoodDark,
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  durationBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: Palette.primary,
  },
  activitiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  activityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Palette.chipBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activityChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: Palette.textSecondary,
  },
  noteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Palette.background,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Palette.skySoft,
    marginBottom: 10,
  },
  noteIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    fontStyle: "italic",
    color: Palette.textPrimary,
    lineHeight: 20,
  },
  nextTasksContainer: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Palette.borderLight,
  },
  nextTasksTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Palette.textSecondary,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  nextTaskItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  nextTaskText: {
    fontSize: 13,
    fontWeight: "600",
    color: Palette.deepTeal,
  },
  emptyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Palette.chipBg,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: Palette.skySoft,
  },
  emptyIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.white,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTextContainer: {
    flex: 1,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Palette.deepTeal,
    marginBottom: 2,
  },
  emptySubtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
    lineHeight: 17,
  },
});
