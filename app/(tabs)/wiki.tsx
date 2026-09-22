import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Tokens } from '@/constants/Colors';
import { WikiCategory, WikiItem } from '@/types/game';
import { WIKI_ITEMS } from '@/data/wikiData';
import { WikiDetailModal } from '@/components/WikiDetailModal';

interface CategoryTab {
  id: WikiCategory;
  label: string;
}

const CATEGORIES: CategoryTab[] = [
  { id: 'all', label: 'All' },
  { id: 'fish', label: 'Fish' },
  { id: 'crops', label: 'Crops' },
  { id: 'characters', label: 'Characters' },
  { id: 'items', label: 'Items' },
  { id: 'recipes', label: 'Recipes' },
];

export default function WikiScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WikiCategory>('all');
  const [selectedItem, setSelectedItem] = useState<WikiItem | null>(null);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return WIKI_ITEMS.filter((item) => {
      const matchesCat =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.location && item.location.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const renderItem = ({ item }: { item: WikiItem }) => {
    const seasonText =
      item.season && item.season !== 'any'
        ? item.season.charAt(0).toUpperCase() + item.season.slice(1)
        : '';
    const subtitle = [item.categoryLabel, seasonText, item.location]
      .filter(Boolean)
      .join(' · ');

    return (
      <TouchableOpacity
        style={styles.itemCard}
        onPress={() => setSelectedItem(item)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${item.name}`}
      >
        <View style={styles.itemAvatar}>
          <Ionicons
            name={(item.avatarIcon as keyof typeof Ionicons.glyphMap) || 'ellipse'}
            size={22}
            color={Palette.primary}
          />
        </View>

        <View style={styles.itemContent}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemSub}>{subtitle}</Text>
        </View>

        <Ionicons name="chevron-forward" size={18} color={Palette.textMuted} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wiki</Text>
        <Text style={styles.headerSubtitle}>
          Look up fish, crops, gifts, and crafting items
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={Palette.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for fish, crops, characters..."
            placeholderTextColor={Palette.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => setSearchQuery('')}
              accessibilityRole="button"
              accessibilityLabel="Clear search query"
            >
              <Ionicons name="close-circle" size={18} color={Palette.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoriesWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.categoryChipsList}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item.id;
            return (
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipSelected,
                ]}
                onPress={() => setSelectedCategory(item.id)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`Category ${item.label}`}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    isSelected && styles.categoryChipTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Results List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.resultsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={40} color={Palette.textMuted} />
            <Text style={styles.emptyTitle}>No matching items found</Text>
            <Text style={styles.emptySub}>
              Try searching with another keyword or pick a different category.
            </Text>
          </View>
        }
      />

      {/* Wiki Detail Modal (Screen 10) */}
      <WikiDetailModal
        item={selectedItem}
        visible={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
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
    paddingBottom: Tokens.spacing.sm,
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
  searchContainer: {
    paddingHorizontal: Tokens.spacing.lg,
    paddingVertical: Tokens.spacing.xs,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    paddingHorizontal: Tokens.spacing.md,
    minHeight: 46,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Palette.textPrimary,
  },
  clearBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesWrapper: {
    paddingVertical: Tokens.spacing.sm,
  },
  categoryChipsList: {
    paddingHorizontal: Tokens.spacing.lg,
    gap: Tokens.spacing.xs,
  },
  categoryChip: {
    minHeight: 44,
    paddingHorizontal: Tokens.spacing.md,
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.full,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryChipSelected: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  categoryChipTextSelected: {
    color: Palette.white,
  },
  resultsList: {
    paddingHorizontal: Tokens.spacing.lg,
    paddingTop: Tokens.spacing.xs,
    paddingBottom: Tokens.spacing.xxl,
    gap: Tokens.spacing.xs,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    padding: Tokens.spacing.md,
    minHeight: 56,
  },
  itemAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Tokens.spacing.md,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 2,
  },
  itemSub: {
    fontSize: 12,
    color: Palette.textSecondary,
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
    marginTop: Tokens.spacing.sm,
  },
  emptySub: {
    fontSize: 13,
    color: Palette.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
