import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Todo } from '@/types/game';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/utils/gameDate';
import { Palette } from '@/constants/Colors';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <View style={[styles.container, todo.isCompleted && styles.completedContainer]}>
      {/* Checkbox */}
      <TouchableOpacity
        style={styles.checkboxTouchable}
        onPress={() => onToggle(todo.id)}
        activeOpacity={0.7}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: todo.isCompleted }}
        accessibilityLabel={`Tandai ${todo.isCompleted ? 'belum selesai' : 'selesai'}: ${todo.title}`}
        accessibilityHint="Ketuk dua kali untuk mengubah status tugas"
      >
        <Ionicons
          name={todo.isCompleted ? 'checkbox' : 'square-outline'}
          size={22}
          color={todo.isCompleted ? Palette.tropicalBlue : Palette.textMuted}
        />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[styles.title, todo.isCompleted && styles.completedTitle]}
          numberOfLines={2}
        >
          {todo.title}
        </Text>

        <View style={styles.categoryBadge}>
          <Ionicons
            name={(CATEGORY_ICONS[todo.category] as any) || 'ellipse'}
            size={11}
            color={Palette.textSecondary}
          />
          <Text style={styles.categoryText}>
            {CATEGORY_LABELS[todo.category] || todo.category}
          </Text>
        </View>
      </View>

      {/* Delete button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(todo.id)}
        activeOpacity={0.6}
        accessibilityRole="button"
        accessibilityLabel={`Hapus tugas: ${todo.title}`}
      >
        <Ionicons name="trash-outline" size={18} color={Palette.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.cardBg,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Palette.borderLight,
  },
  completedContainer: {
    backgroundColor: Palette.background,
    opacity: 0.75,
  },
  checkboxTouchable: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: Palette.textMuted,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: Palette.chipBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: Palette.textSecondary,
    textTransform: 'capitalize',
  },
  deleteButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
