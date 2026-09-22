import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Tokens } from '@/constants/Colors';
import { WikiItem, TaskCategory } from '@/types/game';
import { useGameStore } from '@/store/useGameStore';

interface WikiDetailModalProps {
  item: WikiItem | null;
  visible: boolean;
  onClose: () => void;
}

export function WikiDetailModal({
  item,
  visible,
  onClose,
}: WikiDetailModalProps) {
  const { activeProfile, addTodo } = useGameStore();

  if (!item) return null;

  const handleAddToTodo = async () => {
    if (!activeProfile) {
      Alert.alert('No Active Profile', 'Please select or create a profile first.');
      return;
    }

    let category: TaskCategory = 'general';
    if (item.category === 'fish') category = 'fishing';
    else if (item.category === 'crops') category = 'farming';
    else if (item.category === 'characters') category = 'relationship';
    else if (item.category === 'items') category = 'mining';

    await addTodo(`Find or catch ${item.name}`, category, {
      year: activeProfile.currentYear,
      season: activeProfile.currentSeason,
      day: activeProfile.currentDay,
    });

    Alert.alert('Task Added', `Added "${item.name}" to today's tasks.`);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close item detail"
          >
            <Ionicons name="close" size={24} color={Palette.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{item.name}</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Avatar and Main Header */}
          <View style={styles.cardHeader}>
            <View style={styles.avatarCircle}>
              <Ionicons
                name={(item.avatarIcon as keyof typeof Ionicons.glyphMap) || 'information-circle'}
                size={36}
                color={Palette.primary}
              />
            </View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemSubtitle}>
              {item.categoryLabel}
              {item.season && item.season !== 'any' ? ` · ${item.season.charAt(0).toUpperCase() + item.season.slice(1)}` : ''}
            </Text>
          </View>

          {/* Description */}
          <View style={styles.infoCard}>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          {/* Attributes List */}
          <View style={styles.detailsCard}>
            {item.season ? (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Season</Text>
                <Text style={styles.rowValue}>
                  {item.season.charAt(0).toUpperCase() + item.season.slice(1)}
                </Text>
              </View>
            ) : null}

            {item.location ? (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Location</Text>
                <Text style={styles.rowValue}>{item.location}</Text>
              </View>
            ) : null}

            {item.weather ? (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Weather</Text>
                <Text style={styles.rowValue}>{item.weather}</Text>
              </View>
            ) : null}

            {item.time ? (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Time</Text>
                <Text style={styles.rowValue}>{item.time}</Text>
              </View>
            ) : null}

            {item.sellPrice ? (
              <View style={[styles.row, styles.lastRow]}>
                <Text style={styles.rowLabel}>Sell Price</Text>
                <Text style={[styles.rowValue, styles.priceValue]}>
                  {item.sellPrice}
                </Text>
              </View>
            ) : null}
          </View>
        </ScrollView>

        {/* Footer Primary CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleAddToTodo}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Add to Todo"
          >
            <Ionicons name="add" size={20} color={Palette.white} />
            <Text style={styles.actionBtnText}>Add to Todo</Text>
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
  },
  cardHeader: {
    alignItems: 'center',
    paddingVertical: Tokens.spacing.lg,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Palette.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Tokens.spacing.md,
  },
  itemName: {
    fontSize: 24,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: Palette.textSecondary,
  },
  infoCard: {
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.md,
    padding: Tokens.spacing.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    marginBottom: Tokens.spacing.md,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: Palette.textPrimary,
  },
  detailsCard: {
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.md,
    paddingHorizontal: Tokens.spacing.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderLight,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontSize: 14,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  rowValue: {
    fontSize: 14,
    color: Palette.textPrimary,
    fontWeight: '600',
  },
  priceValue: {
    color: Palette.primary,
  },
  footer: {
    padding: Tokens.spacing.md,
    backgroundColor: Palette.white,
    borderTopWidth: 1,
    borderTopColor: Palette.borderLight,
  },
  actionBtn: {
    flexDirection: 'row',
    backgroundColor: Palette.primary,
    minHeight: 48,
    borderRadius: Tokens.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  actionBtnText: {
    color: Palette.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
