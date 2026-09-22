import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuickNote } from '@/types/game';
import { Palette } from '@/constants/Colors';

interface QuickNoteInputProps {
  notes: QuickNote[];
  onAddNote: (content: string) => void;
  onDeleteNote: (id: string) => void;
}

export function QuickNoteInput({ notes, onAddNote, onDeleteNote }: QuickNoteInputProps) {
  const [content, setContent] = useState('');

  const handleAdd = () => {
    if (!content.trim()) return;
    onAddNote(content.trim());
    setContent('');
  };

  return (
    <View style={styles.container}>
      {/* Input box */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Catat hal penting saat ini..."
          placeholderTextColor={Palette.textMuted}
          value={content}
          onChangeText={setContent}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.addButton, !content.trim() && styles.addButtonDisabled]}
          onPress={handleAdd}
          disabled={!content.trim()}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Simpan catatan singkat"
        >
          <Ionicons name="send" size={16} color={Palette.white} />
        </TouchableOpacity>
      </View>

      {/* Notes list */}
      {notes.length > 0 && (
        <View style={styles.notesList}>
          {notes.map((note) => (
            <View key={note.id} style={styles.noteCard}>
              <Ionicons name="pencil" size={14} color={Palette.deepTeal} style={{ marginTop: 2 }} />
              <Text style={styles.noteContent}>{note.content}</Text>
              <TouchableOpacity
                onPress={() => onDeleteNote(note.id)}
                style={styles.deleteNoteBtn}
                activeOpacity={0.6}
                accessibilityRole="button"
                accessibilityLabel={`Hapus catatan: ${note.content}`}
              >
                <Ionicons name="close" size={18} color={Palette.textMuted} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.cardBg,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: Palette.borderLight,
    marginBottom: 10,
  },
  input: {
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
  notesList: {
    gap: 6,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minHeight: 48,
    borderWidth: 1,
    borderColor: Palette.borderLight,
  },
  noteContent: {
    flex: 1,
    fontSize: 13,
    color: Palette.textPrimary,
    lineHeight: 18,
    marginHorizontal: 8,
  },
  deleteNoteBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
