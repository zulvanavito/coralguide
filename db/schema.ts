import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const profilesTable = sqliteTable('profiles', {
  id: text('id').primaryKey(),
  saveName: text('save_name').notNull(),
  currentYear: integer('current_year').notNull().default(1),
  currentSeason: text('current_season').notNull().default('spring'),
  currentDay: integer('current_day').notNull().default(1),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const todosTable = sqliteTable('todos', {
  id: text('id').primaryKey(),
  profileId: text('profile_id').notNull(),
  title: text('title').notNull(),
  category: text('category').notNull().default('general'),
  isCompleted: integer('is_completed', { mode: 'boolean' }).notNull().default(false),
  targetYear: integer('target_year').notNull(),
  targetSeason: text('target_season').notNull(),
  targetDay: integer('target_day').notNull(),
  createdAt: text('created_at').notNull(),
});

export const quickNotesTable = sqliteTable('quick_notes', {
  id: text('id').primaryKey(),
  profileId: text('profile_id').notNull(),
  content: text('content').notNull(),
  gameYear: integer('game_year').notNull(),
  gameSeason: text('game_season').notNull(),
  gameDay: integer('game_day').notNull(),
  createdAt: text('created_at').notNull(),
});

export const sessionsTable = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  profileId: text('profile_id').notNull(),
  gameYear: integer('game_year').notNull(),
  gameSeason: text('game_season').notNull(),
  gameDay: integer('game_day').notNull(),
  realPlayedAt: text('real_played_at').notNull(),
  durationSeconds: integer('duration_seconds').default(0),
  activitiesJson: text('activities_json').notNull(),
  note: text('note').notNull(),
  nextTasksJson: text('next_tasks_json').notNull(),
});
