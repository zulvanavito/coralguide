import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '@/store/useGameStore';
import { Season } from '@/types/game';
import { SEASONS, SEASON_LABELS } from '@/utils/gameDate';
import { Palette } from '@/constants/Colors';

interface EditDateModalProps {
  visible: boolean;
  onClose: () => void;
}

export function EditDateModal({ visible, onClose }: EditDateModalProps) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <EditDateModalContent onClose={onClose} />
    </Modal>
  );
}

function EditDateModalContent({ onClose }: { onClose: () => void }) {
  const activeProfile = useGameStore((s) => s.activeProfile);
  const setGameDate = useGameStore((s) => s.setGameDate);

  const [year, setYear] = useState(activeProfile?.currentYear ?? 1);
  const [season, setSeason] = useState<Season>(activeProfile?.currentSeason ?? 'spring');
  const [day, setDay] = useState(activeProfile?.currentDay ?? 1);

  if (!activeProfile) return null;

  const handleSave = async () => {
    await setGameDate({ year, season, day });
    onClose();
  };

  return (
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Atur Tanggal Game</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Tutup dialog atur tanggal"
            >
              <Ionicons name="close" size={24} color={Palette.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Year selector */}
          <Text style={styles.label}>Tahun (Year):</Text>
          <View style={styles.stepperRow}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setYear(Math.max(1, year - 1))}
              disabled={year <= 1}
              accessibilityRole="button"
              accessibilityLabel="Kurangi tahun"
            >
              <Ionicons name="remove" size={18} color={year <= 1 ? Palette.borderLight : Palette.deepTeal} />
            </TouchableOpacity>
            <Text style={styles.stepValue}>Year {year}</Text>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setYear(year + 1)}
              accessibilityRole="button"
              accessibilityLabel="Tambah tahun"
            >
              <Ionicons name="add" size={18} color={Palette.deepTeal} />
            </TouchableOpacity>
          </View>

          {/* Season selector */}
          <Text style={styles.label}>Musim (Season):</Text>
          <View style={styles.seasonGrid}>
            {SEASONS.map((s) => {
              const isSelected = season === s;
              return (
                <TouchableOpacity
                  key={s}
                  style={[styles.seasonChip, isSelected && styles.seasonChipSelected]}
                  onPress={() => setSeason(s)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`Musim: ${SEASON_LABELS[s]}`}
                >
                  <Text
                    style={[
                      styles.seasonChipText,
                      isSelected && styles.seasonChipTextSelected,
                    ]}
                  >
                    {SEASON_LABELS[s]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Day selector (1-28 grid) */}
          <Text style={styles.label}>Hari (Day 1 - 28):</Text>
          <ScrollView style={styles.daysScroll} contentContainerStyle={styles.daysGrid}>
            {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => {
              const isSelected = day === d;
              return (
                <TouchableOpacity
                  key={d}
                  style={[styles.dayCell, isSelected && styles.dayCellSelected]}
                  onPress={() => setDay(d)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`Hari ${d}`}
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
          </ScrollView>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Simpan Tanggal"
          >
            <Text style={styles.saveBtnText}>Simpan Tanggal</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Palette.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  dialog: {
    backgroundColor: Palette.cardBg,
    borderRadius: 20,
    width: '100%',
    maxHeight: '85%',
    padding: 20,
    borderWidth: 1.5,
    borderColor: Palette.borderLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  closeBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textSecondary,
    marginTop: 10,
    marginBottom: 6,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: Palette.background,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.borderLight,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.cardBg,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
    minWidth: 80,
    textAlign: 'center',
  },
  seasonGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  seasonChip: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: Palette.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.skySoft,
  },
  seasonChipSelected: {
    backgroundColor: Palette.deepTeal,
    borderColor: Palette.deepTeal,
  },
  seasonChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.deepTeal,
  },
  seasonChipTextSelected: {
    color: Palette.white,
  },
  daysScroll: {
    maxHeight: 160,
    marginVertical: 4,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  dayCell: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellSelected: {
    backgroundColor: Palette.tropicalBlue,
    borderColor: Palette.tropicalBlue,
  },
  dayCellText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  dayCellTextSelected: {
    color: Palette.white,
  },
  saveBtn: {
    backgroundColor: Palette.deepTeal,
    borderRadius: 14,
    minHeight: 48,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  saveBtnText: {
    color: Palette.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
