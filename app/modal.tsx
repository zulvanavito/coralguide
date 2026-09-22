import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '@/constants/Colors';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="game-controller" size={36} color={Palette.deepTeal} />
      </View>
      <Text style={styles.title}>Coral Island Companion</Text>
      <Text style={styles.version}>P0 Essential MVP</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Prinsip Utama</Text>
        <Text style={styles.cardDesc}>
          &ldquo;Help players quickly find game information and never forget where they left off.&rdquo;
        </Text>
      </View>

      <View style={styles.tipBox}>
        <Ionicons name="bulb-outline" size={18} color={Palette.deepTeal} />
        <Text style={styles.tipText}>
          Gunakan tombol &ldquo;End Session&rdquo; setiap kali selesai bermain di konsol atau PC agar ingatan targetmu tidak hilang saat kembali bermain nanti.
        </Text>
      </View>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: Palette.background,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Palette.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: Palette.skySoft,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  version: {
    fontSize: 13,
    color: Palette.textSecondary,
    marginTop: 4,
    marginBottom: 24,
  },
  card: {
    backgroundColor: Palette.cardBg,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    borderWidth: 1.5,
    borderColor: Palette.borderLight,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Palette.chipBg,
    borderRadius: 14,
    padding: 14,
    width: '100%',
    borderWidth: 1.5,
    borderColor: Palette.skySoft,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: Palette.textPrimary,
    lineHeight: 18,
  },
});
