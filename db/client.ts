import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

export const expoDb = openDatabaseSync('coralguide.db');
export const db = drizzle(expoDb, { schema });

/**
 * Initializes database tables if they do not exist yet.
 * Ensures zero-configuration startup on any device.
 */
export async function initDatabase(): Promise<void> {
  await expoDb.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY NOT NULL,
      save_name TEXT NOT NULL,
      current_year INTEGER NOT NULL DEFAULT 1,
      current_season TEXT NOT NULL DEFAULT 'spring',
      current_day INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY NOT NULL,
      profile_id TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'general',
      is_completed INTEGER NOT NULL DEFAULT 0,
      target_year INTEGER NOT NULL,
      target_season TEXT NOT NULL,
      target_day INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS quick_notes (
      id TEXT PRIMARY KEY NOT NULL,
      profile_id TEXT NOT NULL,
      content TEXT NOT NULL,
      game_year INTEGER NOT NULL,
      game_season TEXT NOT NULL,
      game_day INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY NOT NULL,
      profile_id TEXT NOT NULL,
      game_year INTEGER NOT NULL,
      game_season TEXT NOT NULL,
      game_day INTEGER NOT NULL,
      real_played_at TEXT NOT NULL,
      duration_seconds INTEGER DEFAULT 0,
      activities_json TEXT NOT NULL,
      note TEXT NOT NULL,
      next_tasks_json TEXT NOT NULL
    );
  `);

  // Migrate existing tables if needed
  try {
    const tableInfo = await expoDb.getAllAsync<{ name: string }>(
      'PRAGMA table_info(sessions);'
    );
    const hasDurationSeconds = tableInfo.some((col) => col.name === 'duration_seconds');
    if (!hasDurationSeconds) {
      await expoDb.execAsync(
        'ALTER TABLE sessions ADD COLUMN duration_seconds INTEGER DEFAULT 0;'
      );
    }
  } catch (error) {
    console.warn('Migration warning for sessions.duration_seconds:', error);
  }
}

