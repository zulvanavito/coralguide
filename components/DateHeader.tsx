import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '@/store/useGameStore';
import { getSeasonTheme, SEASON_LABELS } from '@/utils/gameDate';
import { Season } from '@/types/game';
import { Palette } from '@/constants/Colors';

interface DateHeaderProps {
  onOpenEditDate: () => void;
  onOpenSwitchProfile: () => void;
}

export function DateHeader({ onOpenEditDate, onOpenSwitchProfile }: DateHeaderProps) {
  const activeProfile = useGameStore((s) => s.activeProfile);
  const advanceDay = useGameStore((s) => s.advanceDay);

  if (!activeProfile) return null;

  const seasonTheme = getSeasonTheme(activeProfile.currentSeason);

  const handleAdvanceDay = () => {
    Alert.alert(
      'Maju ke Hari Berikutnya?',
      'Apakah kamu sudah tidur/save di dalam game?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Ya, Maju (+1 Day)', onPress: () => advanceDay() },
      ]
    );
  };

  const getSeasonIcon = (season: Season): keyof typeof Ionicons.glyphMap => {
    switch (season) {
      case 'spring':
        return 'leaf';
      case 'summer':
        return 'sunny';
      case 'fall':
        return 'partly-sunny';
      case 'winter':
        return 'snow';
    }
  };

  return (
    <View style={styles.container}>
      {/* Save Name & Profile Switcher */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.profileBadge}
          onPress={onOpenSwitchProfile}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Ganti Save Game: ${activeProfile.saveName}`}
          accessibilityHint="Membuka dialog pemilihan save game"
        >
          <Ionicons name="game-controller-outline" size={16} color={Palette.deepTeal} />
          <Text style={styles.profileText} numberOfLines={1}>
            {activeProfile.saveName}
          </Text>
          <Ionicons name="chevron-down" size={14} color={Palette.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Date Card */}
      <View style={[styles.dateCard, { borderColor: Palette.skySoft }]}>
        <TouchableOpacity
          style={styles.dateInfo}
          onPress={onOpenEditDate}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Ubah Tanggal Game, saat ini ${SEASON_LABELS[activeProfile.currentSeason]} Day ${activeProfile.currentDay} Year ${activeProfile.currentYear}`}
          accessibilityHint="Membuka dialog untuk mengubah tanggal kalender game"
        >
          <View style={[styles.seasonBadge, { backgroundColor: seasonTheme.badgeBg }]}>
            <Ionicons
              name={getSeasonIcon(activeProfile.currentSeason)}
              size={18}
              color={seasonTheme.accent}
            />
            <Text style={[styles.seasonBadgeText, { color: seasonTheme.badgeText }]}>
              {SEASON_LABELS[activeProfile.currentSeason]}
            </Text>
          </View>

          <View style={styles.dateTextContainer}>
            <Text style={styles.dayText}>Day {activeProfile.currentDay}</Text>
            <Text style={styles.yearText}>Year {activeProfile.currentYear}</Text>
          </View>

          <Ionicons name="pencil-outline" size={16} color={Palette.textMuted} style={styles.editIcon} />
        </TouchableOpacity>

        {/* Advance Day Button */}
        <TouchableOpacity
          style={[styles.advanceButton, { backgroundColor: Palette.tropicalBlue }]}
          onPress={handleAdvanceDay}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Maju 1 Hari dalam Game"
          accessibilityHint="Memajukan kalender game sebanyak satu hari"
        >
          <Ionicons name="play-forward" size={16} color={Palette.white} />
          <Text style={styles.advanceButtonText}>+1 Day</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Palette.chipBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 44,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Palette.skySoft,
  },
  profileText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.deepTeal,
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Palette.cardBg,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    shadowColor: Palette.deepTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minHeight: 44,
  },
  seasonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 10,
  },
  seasonBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  dateTextContainer: {
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  yearText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  editIcon: {
    marginLeft: 8,
  },
  advanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 44,
    minWidth: 44,
    borderRadius: 12,
  },
  advanceButtonText: {
    color: Palette.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
