import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '@/store/useGameStore';
import { EditDateModal } from '@/components/EditDateModal';
import { ProfileManagerModal } from '@/components/ProfileManagerModal';
import { NoFarmView } from '@/components/NoFarmView';
import { formatGameDate } from '@/utils/gameDate';
import { Palette, Tokens } from '@/constants/Colors';

export default function ProfileScreen() {
  const {
    activeProfile,
    allProfiles,
    allSessions,
    todayTodos,
    deleteProfile,
  } = useGameStore();

  const [showEditDate, setShowEditDate] = useState(false);
  const [showProfileManager, setShowProfileManager] = useState(false);

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

  const currentDateText = formatGameDate({
    year: activeProfile.currentYear,
    season: activeProfile.currentSeason,
    day: activeProfile.currentDay,
  });

  const handleDeleteCurrentFarm = () => {
    Alert.alert(
      'Delete Farm Profile',
      `Are you sure you want to delete "${activeProfile.saveName}"? All tasks and session history for this save will be permanently deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteProfile(activeProfile.id);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Game Profile</Text>
        <Text style={styles.headerSubtitle}>
          Select your save file to continue playing
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Active Save Profile Card (Screen 2) */}
        <View style={styles.profileCard}>
          <Image
            source={require('@/assets/images/aset-profile.png')}
            style={styles.profileThumbnail}
            resizeMode="cover"
          />
          <View style={styles.profileDetails}>
            <View style={styles.activePill}>
              <Ionicons name="checkmark-circle" size={14} color={Palette.primary} />
              <Text style={styles.activePillText}>Active Save</Text>
            </View>
            <Text style={styles.saveName}>{activeProfile.saveName}</Text>
            <Text style={styles.currentDateBadge}>{currentDateText}</Text>
          </View>
        </View>

        {/* Quick Settings Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Settings</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowEditDate(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Adjust Game Date: Change Year, Season, or Day"
          >
            <View style={styles.menuIconWrap}>
              <Ionicons name="calendar-outline" size={20} color={Palette.primary} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>Adjust Game Date</Text>
              <Text style={styles.menuSub}>Change Year, Season, or Day</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Palette.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowProfileManager(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Switch or Create Save Profile, currently ${allProfiles.length} saves available`}
          >
            <View style={styles.menuIconWrap}>
              <Ionicons name="swap-horizontal-outline" size={20} color={Palette.primary} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>Switch / Create Farm Save</Text>
              <Text style={styles.menuSub}>
                {allProfiles.length} save profile(s) available
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Palette.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItemDanger}
            onPress={handleDeleteCurrentFarm}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Delete current farm save: ${activeProfile.saveName}`}
          >
            <View style={styles.menuIconWrapDanger}>
              <Ionicons name="trash-outline" size={20} color={Palette.danger} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitleDanger}>Delete This Farm</Text>
              <Text style={styles.menuSub}>
                Remove &ldquo;{activeProfile.saveName}&rdquo; and all its session data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Palette.danger} />
          </TouchableOpacity>
        </View>

        {/* Storage & Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics & Local Storage</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Ionicons name="book-outline" size={20} color={Palette.primary} />
              <Text style={styles.statNumber}>{allSessions.length}</Text>
              <Text style={styles.statLabel}>Sessions Saved</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="checkbox-outline" size={20} color={Palette.info} />
              <Text style={styles.statNumber}>{todayTodos.length}</Text>
              <Text style={styles.statLabel}>{"Today's Tasks"}</Text>
            </View>
          </View>

          <View style={styles.storageInfoBox}>
            <Ionicons name="shield-checkmark-outline" size={20} color={Palette.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.storageTitle}>100% Offline-First</Text>
              <Text style={styles.storageDesc}>
                All farm data is stored securely on device with Expo SQLite and Drizzle ORM. No account or internet required.
              </Text>
            </View>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfoSection}>
          <Text style={styles.appName}>Coral Island Companion</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Modals */}
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.lg,
    padding: Tokens.spacing.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    marginBottom: Tokens.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  profileThumbnail: {
    width: 68,
    height: 68,
    borderRadius: Tokens.radius.md,
    backgroundColor: Palette.primaryLight,
  },
  profileDetails: {
    flex: 1,
    marginLeft: Tokens.spacing.md,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  activePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  saveName: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 2,
  },
  currentDateBadge: {
    fontSize: 13,
    color: Palette.textSecondary,
  },
  section: {
    marginBottom: Tokens.spacing.lg,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: Tokens.spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    padding: Tokens.spacing.md,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    marginBottom: Tokens.spacing.xs,
    minHeight: 52,
  },
  menuItemDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    padding: Tokens.spacing.md,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    borderColor: '#FED7D7',
    marginTop: Tokens.spacing.sm,
    minHeight: 52,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Tokens.spacing.md,
  },
  menuIconWrapDanger: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Tokens.spacing.md,
  },
  menuTextWrap: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  menuTitleDanger: {
    fontSize: 15,
    fontWeight: '600',
    color: Palette.danger,
  },
  menuSub: {
    fontSize: 12,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Tokens.spacing.md,
    marginBottom: Tokens.spacing.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.md,
    padding: Tokens.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.borderLight,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  storageInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.md,
    padding: Tokens.spacing.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    gap: Tokens.spacing.sm,
  },
  storageTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 2,
  },
  storageDesc: {
    fontSize: 12,
    color: Palette.textSecondary,
    lineHeight: 18,
  },
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: Tokens.spacing.lg,
  },
  appName: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textMuted,
  },
  appVersion: {
    fontSize: 12,
    color: Palette.textMuted,
    marginTop: 2,
  },
});
