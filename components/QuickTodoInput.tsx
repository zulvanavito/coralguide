import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TaskCategory } from '@/types/game';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/utils/gameDate';
import { Palette } from '@/constants/Colors';

interface QuickTodoInputProps {
  onAdd: (title: string, category: TaskCategory) => void;
  defaultCategory?: TaskCategory;
}

const CATEGORIES: TaskCategory[] = [
  'general',
  'farming',
  'mining',
  'diving',
  'fishing',
  'relationship',
  'museum',
  'quest',
];

export function QuickTodoInput({ onAdd, defaultCategory }: QuickTodoInputProps) {
  const [title, setTitle] = useState('');
  const [overrideCategory, setOverrideCategory] = useState<TaskCategory | null>(null);

  const activeCategory = overrideCategory ?? defaultCategory ?? 'general';

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), activeCategory);
    setTitle('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        {/* Active category indicator badge */}
        <View style={styles.categoryBadge}>
          <Ionicons
            name={(CATEGORY_ICONS[activeCategory] as any) || 'pricetag'}
            size={16}
            color={Palette.deepTeal}
          />
        </View>

        <TextInput
          style={styles.textInput}
          placeholder="Tambah rencana tugas hari ini..."
          placeholderTextColor={Palette.textMuted}
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />

        {/* Add button */}
        <TouchableOpacity
          style={[styles.addButton, !title.trim() && styles.addButtonDisabled]}
          onPress={handleAdd}
          disabled={!title.trim()}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Tambah tugas baru"
        >
          <Ionicons name="add" size={22} color={Palette.white} />
        </TouchableOpacity>
      </View>

      {/* Category selector row: always visible for quick 1-tap switching */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                isSelected && styles.categoryChipSelected,
              ]}
              onPress={() => setOverrideCategory(cat)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Pilih kategori: ${CATEGORY_LABELS[cat]}`}
            >
              <Ionicons
                name={(CATEGORY_ICONS[cat] as any) || 'ellipse'}
                size={13}
                color={isSelected ? Palette.white : Palette.deepTeal}
              />
              <Text
                style={[
                  styles.categoryChipText,
                  isSelected && styles.categoryChipTextSelected,
                ]}
              >
                {CATEGORY_LABELS[cat]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.cardBg,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: Palette.borderLight,
  },
  categoryBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Palette.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Palette.textPrimary,
    paddingVertical: 6,
  },
  addButton: {
    backgroundColor: Palette.tropicalBlue,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: Palette.borderLight,
  },
  categoriesScroll: {
    marginTop: 8,
  },
  categoriesContent: {
    gap: 6,
    paddingHorizontal: 2,
    alignItems: 'center',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Palette.chipBg,
    paddingHorizontal: 12,
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Palette.borderLight,
  },
  categoryChipSelected: {
    backgroundColor: Palette.deepTeal,
    borderColor: Palette.deepTeal,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.deepTeal,
  },
  categoryChipTextSelected: {
    color: Palette.white,
  },
});
