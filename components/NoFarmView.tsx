import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '@/store/useGameStore';
import { Season } from '@/types/game';
import { SEASONS, SEASON_LABELS } from '@/utils/gameDate';
import { Palette } from '@/constants/Colors';

export function NoFarmView() {
  const createProfile = useGameStore((s) => s.createProfile);

  const [farmName, setFarmName] = useState('');
  const [year, setYear] = useState(1);
  const [season, setSeason] = useState<Season>('spring');
  const [day, setDay] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateFarm = async () => {
    const trimmed = farmName.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createProfile(trimmed, { year, season, day });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="leaf" size={32} color={Palette.deepTeal} />
        </View>

        <Text style={styles.title}>Mulai Petualangan Kebunmu</Text>
        <Text style={styles.subtitle}>
          Belum ada kebun yang terdaftar. Masukkan nama kebun dan tanggal awal permainan untuk mulai merencanakan aktivitasmu.
        </Text>

        {/* Input Nama Kebun */}
        <Text style={styles.inputLabel}>Nama Kebun</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Contoh: Kebun Nusantara, Coral Haven..."
          placeholderTextColor={Palette.textMuted}
          value={farmName}
          onChangeText={setFarmName}
          returnKeyType="done"
        />

        {/* Pemilihan Musim */}
        <Text style={styles.inputLabel}>Musim Awal Permainan</Text>
        <View style={styles.seasonRow}>
          {SEASONS.map((s) => {
            const isSelected = season === s;
            return (
              <TouchableOpacity
                key={s}
                style={[
                  styles.seasonChip,
                  isSelected && styles.seasonChipSelected,
                ]}
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

        {/* Stepper Hari & Tahun */}
        <View style={styles.steppersContainer}>
          <View style={styles.stepperCol}>
            <Text style={styles.inputLabel}>Hari (1-28)</Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setDay((d) => Math.max(1, d - 1))}
                accessibilityRole="button"
                accessibilityLabel="Kurangi hari"
              >
                <Ionicons name="remove" size={18} color={Palette.deepTeal} />
              </TouchableOpacity>
              <Text style={styles.stepValue}>{day}</Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setDay((d) => Math.min(28, d + 1))}
                accessibilityRole="button"
                accessibilityLabel="Tambah hari"
              >
                <Ionicons name="add" size={18} color={Palette.deepTeal} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.stepperCol}>
            <Text style={styles.inputLabel}>Tahun</Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setYear((y) => Math.max(1, y - 1))}
                accessibilityRole="button"
                accessibilityLabel="Kurangi tahun"
              >
                <Ionicons name="remove" size={18} color={Palette.deepTeal} />
              </TouchableOpacity>
              <Text style={styles.stepValue}>{year}</Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setYear((y) => y + 1)}
                accessibilityRole="button"
                accessibilityLabel="Tambah tahun"
              >
                <Ionicons name="add" size={18} color={Palette.deepTeal} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tombol Buat Kebun */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            (!farmName.trim() || isSubmitting) && styles.submitBtnDisabled,
          ]}
          onPress={handleCreateFarm}
          disabled={!farmName.trim() || isSubmitting}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Buat kebun baru dan mulai bermain"
        >
          <Ionicons name="add-circle-outline" size={20} color={Palette.white} />
          <Text style={styles.submitBtnText}>
            {isSubmitting ? 'Membuat Kebun...' : 'Buat Kebun & Mulai'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: Palette.background,
  },
  card: {
    backgroundColor: Palette.cardBg,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: Palette.borderLight,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Palette.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: Palette.skySoft,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: Palette.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  inputLabel: {
    alignSelf: 'flex-start',
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textSecondary,
    marginBottom: 6,
  },
  textInput: {
    width: '100%',
    minHeight: 48,
    backgroundColor: Palette.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: Palette.textPrimary,
    borderWidth: 1.5,
    borderColor: Palette.borderLight,
    marginBottom: 16,
  },
  seasonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
    marginBottom: 16,
  },
  seasonChip: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
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
    fontSize: 12,
    fontWeight: '700',
    color: Palette.deepTeal,
  },
  seasonChipTextSelected: {
    color: Palette.white,
  },
  steppersContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  stepperCol: {
    flex: 1,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Palette.background,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Palette.borderLight,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Palette.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.borderLight,
  },
  stepValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  submitBtn: {
    flexDirection: 'row',
    width: '100%',
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: Palette.tropicalBlue,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  submitBtnDisabled: {
    backgroundColor: Palette.borderLight,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.white,
  },
});
