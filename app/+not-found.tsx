import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { Palette } from '@/constants/Colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Halaman Tidak Ditemukan' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Halaman ini tidak tersedia.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Kembali ke Beranda</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Palette.background,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 8,
  },
  link: {
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: Palette.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.deepTeal,
  },
});
