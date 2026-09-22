import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '@/store/useGameStore';
import { Season } from '@/types/game';
import { SEASONS, SEASON_LABELS } from '@/utils/gameDate';
import { Palette } from '@/constants/Colors';

interface ProfileManagerModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ProfileManagerModal({ visible, onClose }: ProfileManagerModalProps) {
  const activeProfile = useGameStore((s) => s.activeProfile);
  const allProfiles = useGameStore((s) => s.allProfiles);
  const switchProfile = useGameStore((s) => s.switchProfile);
  const createProfile = useGameStore((s) => s.createProfile);
  const deleteProfile = useGameStore((s) => s.deleteProfile);

  const [newSaveName, setNewSaveName] = useState('');
  const [year, setYear] = useState(1);
  const [season, setSeason] = useState<Season>('spring');
  const [day, setDay] = useState(1);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    const trimmed = newSaveName.trim();
    if (!trimmed) return;

    await createProfile(trimmed, { year, season, day });
    setNewSaveName('');
    setYear(1);
    setSeason('spring');
    setDay(1);
    setIsCreating(false);
    onClose();
  };

  const handleSwitch = async (id: string) => {
    await switchProfile(id);
    onClose();
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Hapus Kebun',
      `Apakah kamu yakin ingin menghapus kebun "${name}"? Seluruh data tugas dan riwayat sesi di kebun ini akan dihapus permanen.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            await deleteProfile(id);
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.header}>
            <Text style={styles.title}>Kelola Kebun (Save Game)</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Tutup dialog ganti save"
            >
              <Ionicons name="close" size={24} color={Palette.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.list}>
            {allProfiles.length > 0 ? (
              allProfiles.map((p) => {
                const isActive = activeProfile?.id === p.id;
                return (
                  <View
                    key={p.id}
                    style={[styles.profileCard, isActive && styles.profileCardActive]}
                  >
                    <TouchableOpacity
                      style={styles.profileSelectArea}
                      onPress={() => handleSwitch(p.id)}
                      activeOpacity={0.7}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isActive }}
                      accessibilityLabel={`Pilih save ${p.saveName}, game date ${SEASON_LABELS[p.currentSeason]} Day ${p.currentDay} Year ${p.currentYear}`}
                    >
                      <View style={styles.profileInfo}>
                        <Text style={[styles.profileName, isActive && styles.profileNameActive]}>
                          {p.saveName}
                        </Text>
                        <Text style={styles.profileMeta}>
                          {SEASON_LABELS[p.currentSeason]} {p.currentDay} · Year {p.currentYear}
                        </Text>
                      </View>
                      {isActive && (
                        <View style={styles.activeCheck}>
                          <Ionicons name="checkmark-circle" size={20} color={Palette.deepTeal} />
                        </View>
                      )}
                    </TouchableOpacity>

                    {/* Tombol Hapus Kebun */}
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDelete(p.id, p.saveName)}
                      activeOpacity={0.6}
                      accessibilityRole="button"
                      accessibilityLabel={`Hapus kebun ${p.saveName}`}
                    >
                      <Ionicons name="trash-outline" size={18} color="#C53030" />
                    </TouchableOpacity>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyBox}>
                <Ionicons name="leaf-outline" size={32} color={Palette.textMuted} />
                <Text style={styles.emptyText}>
                  Belum ada kebun tersimpan. Tambahkan kebun baru di bawah.
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Create new profile section */}
          {isCreating ? (
            <View style={styles.createBox}>
              <Text style={styles.createTitle}>Tambah Kebun Baru</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Nama Kebun..."
                placeholderTextColor={Palette.textMuted}
                value={newSaveName}
                onChangeText={setNewSaveName}
                autoFocus
              />

              {/* Season selection */}
              <View style={styles.seasonRow}>
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
                      accessibilityLabel={`Pilih musim ${SEASON_LABELS[s]}`}
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

              {/* Day & Year row */}
              <View style={styles.createDateRow}>
                <View style={styles.dateCol}>
                  <Text style={styles.dateLabel}>Hari (1-28): {day}</Text>
                  <View style={styles.miniStepper}>
                    <TouchableOpacity
                      style={styles.miniStepBtn}
                      onPress={() => setDay((d) => Math.max(1, d - 1))}
                      accessibilityRole="button"
                      accessibilityLabel="Kurangi hari"
                    >
                      <Ionicons name="remove" size={16} color={Palette.deepTeal} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.miniStepBtn}
                      onPress={() => setDay((d) => Math.min(28, d + 1))}
                      accessibilityRole="button"
                      accessibilityLabel="Tambah hari"
                    >
                      <Ionicons name="add" size={16} color={Palette.deepTeal} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.dateCol}>
                  <Text style={styles.dateLabel}>Tahun: {year}</Text>
                  <View style={styles.miniStepper}>
                    <TouchableOpacity
                      style={styles.miniStepBtn}
                      onPress={() => setYear((y) => Math.max(1, y - 1))}
                      accessibilityRole="button"
                      accessibilityLabel="Kurangi tahun"
                    >
                      <Ionicons name="remove" size={16} color={Palette.deepTeal} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.miniStepBtn}
                      onPress={() => setYear((y) => y + 1)}
                      accessibilityRole="button"
                      accessibilityLabel="Tambah tahun"
                    >
                      <Ionicons name="add" size={16} color={Palette.deepTeal} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.createActionRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setIsCreating(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Batal buat save baru"
                >
                  <Text style={styles.cancelBtnText}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmBtn, !newSaveName.trim() && styles.confirmBtnDisabled]}
                  onPress={handleCreate}
                  disabled={!newSaveName.trim()}
                  accessibilityRole="button"
                  accessibilityLabel="Buat save game baru"
                >
                  <Text style={styles.confirmBtnText}>Buat Kebun</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.newSaveBtn}
              onPress={() => setIsCreating(true)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Tambah kebun baru"
            >
              <Ionicons name="add" size={18} color={Palette.deepTeal} />
              <Text style={styles.newSaveBtnText}>Tambah Kebun Baru</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
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
  list: {
    maxHeight: 260,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.background,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    overflow: 'hidden',
  },
  profileCardActive: {
    backgroundColor: Palette.chipBg,
    borderColor: Palette.skySoft,
  },
  profileSelectArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 52,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  profileNameActive: {
    color: Palette.deepTeal,
  },
  profileMeta: {
    fontSize: 12,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  activeCheck: {
    marginRight: 6,
  },
  deleteBtn: {
    width: 44,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: Palette.borderLight,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: Palette.textMuted,
    textAlign: 'center',
  },
  newSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Palette.chipBg,
    borderRadius: 12,
    minHeight: 48,
    paddingVertical: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Palette.skySoft,
  },
  newSaveBtnText: {
    color: Palette.deepTeal,
    fontSize: 14,
    fontWeight: '700',
  },
  createBox: {
    marginTop: 12,
    backgroundColor: Palette.background,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Palette.borderLight,
  },
  createTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Palette.cardBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    paddingHorizontal: 12,
    minHeight: 44,
    fontSize: 14,
    color: Palette.textPrimary,
    marginBottom: 10,
  },
  seasonRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  seasonChip: {
    flex: 1,
    minHeight: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.chipBg,
    borderWidth: 1,
    borderColor: Palette.borderLight,
  },
  seasonChipSelected: {
    backgroundColor: Palette.deepTeal,
    borderColor: Palette.deepTeal,
  },
  seasonChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.deepTeal,
  },
  seasonChipTextSelected: {
    color: Palette.white,
  },
  createDateRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  dateCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Palette.cardBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Palette.borderLight,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  miniStepper: {
    flexDirection: 'row',
    gap: 4,
  },
  miniStepBtn: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: Palette.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  cancelBtn: {
    minHeight: 44,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  cancelBtnText: {
    color: Palette.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  confirmBtn: {
    backgroundColor: Palette.deepTeal,
    minHeight: 44,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  confirmBtnDisabled: {
    backgroundColor: Palette.borderLight,
  },
  confirmBtnText: {
    color: Palette.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
