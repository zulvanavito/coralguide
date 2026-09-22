import { create } from 'zustand';
import { eq, desc, and } from 'drizzle-orm';
import { db, expoDb, initDatabase } from '@/db/client';
import { profilesTable, todosTable, quickNotesTable, sessionsTable } from '@/db/schema';
import { GameDate, Profile, QuickNote, Season, Session, TaskCategory, Todo } from '@/types/game';
import { advanceGameDate } from '@/utils/gameDate';

function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

interface GameState {
  isInitialized: boolean;
  hasSeenWelcome: boolean;
  activeProfile: Profile | null;
  allProfiles: Profile[];
  todayTodos: Todo[];
  todayNotes: QuickNote[];
  lastSession: Session | null;
  allSessions: Session[];

  // Active Play Session Timer State
  activeSessionStartTime: number | null;
  activeSessionActivities: TaskCategory[];

  // Actions
  setHasSeenWelcome: (val: boolean) => void;
  startSession: (activities?: TaskCategory[]) => void;
  cancelSession: () => void;
  init: () => Promise<void>;
  createProfile: (saveName: string, initialDate?: GameDate) => Promise<Profile>;
  deleteProfile: (profileId: string) => Promise<void>;
  switchProfile: (profileId: string) => Promise<void>;
  advanceDay: () => Promise<void>;
  setGameDate: (newDate: GameDate) => Promise<void>;
  addTodo: (title: string, category?: TaskCategory, targetDate?: GameDate) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  addQuickNote: (content: string) => Promise<void>;
  deleteQuickNote: (id: string) => Promise<void>;
  saveEndSession: (params: {
    activities: TaskCategory[];
    note: string;
    nextTasks: string[];
    advanceDate: boolean;
    durationSeconds?: number;
  }) => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  isInitialized: false,
  hasSeenWelcome: false,
  activeProfile: null,
  allProfiles: [],
  todayTodos: [],
  todayNotes: [],
  lastSession: null,
  allSessions: [],
  activeSessionStartTime: null,
  activeSessionActivities: [],

  setHasSeenWelcome: (val: boolean) => set({ hasSeenWelcome: val }),

  startSession: (activities = ['farming']) => {
    set({
      activeSessionStartTime: Date.now(),
      activeSessionActivities: activities,
    });
  },

  cancelSession: () => {
    set({
      activeSessionStartTime: null,
      activeSessionActivities: [],
    });
  },

  init: async () => {
    try {
      await initDatabase();

      const profiles = await db.select().from(profilesTable);
      const mappedProfiles: Profile[] = profiles.map((p) => ({
        id: p.id,
        saveName: p.saveName,
        currentYear: p.currentYear,
        currentSeason: p.currentSeason as Season,
        currentDay: p.currentDay,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }));

      let active: Profile | null = null;
      if (mappedProfiles.length > 0) {
        active = mappedProfiles[0];
      }

      set({
        allProfiles: mappedProfiles,
        activeProfile: active,
        isInitialized: true,
      });

      if (active) {
        await refreshActiveProfileData(active, set);
      }
    } catch (error) {
      console.error('Failed to initialize game store:', error);
      set({ isInitialized: true });
    }
  },

  createProfile: async (saveName: string, initialDate?: GameDate) => {
    const now = new Date().toISOString();
    const newProfile: Profile = {
      id: generateId('prof'),
      saveName: saveName.trim() || 'Kebun Baru',
      currentYear: initialDate?.year ?? 1,
      currentSeason: initialDate?.season ?? 'spring',
      currentDay: initialDate?.day ?? 1,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(profilesTable).values({
      id: newProfile.id,
      saveName: newProfile.saveName,
      currentYear: newProfile.currentYear,
      currentSeason: newProfile.currentSeason,
      currentDay: newProfile.currentDay,
      createdAt: newProfile.createdAt,
      updatedAt: newProfile.updatedAt,
    });

    const updatedProfiles = [...get().allProfiles, newProfile];
    set({
      allProfiles: updatedProfiles,
      activeProfile: newProfile,
    });

    await refreshActiveProfileData(newProfile, set);
    return newProfile;
  },

  deleteProfile: async (profileId: string) => {
    // 1. Delete all associated records from SQLite tables
    await db.delete(todosTable).where(eq(todosTable.profileId, profileId));
    await db.delete(quickNotesTable).where(eq(quickNotesTable.profileId, profileId));
    await db.delete(sessionsTable).where(eq(sessionsTable.profileId, profileId));
    await db.delete(profilesTable).where(eq(profilesTable.id, profileId));

    const remaining = get().allProfiles.filter((p) => p.id !== profileId);
    const currentActive = get().activeProfile;

    if (currentActive?.id === profileId) {
      if (remaining.length > 0) {
        const nextActive = remaining[0];
        set({
          allProfiles: remaining,
          activeProfile: nextActive,
        });
        await refreshActiveProfileData(nextActive, set);
      } else {
        set({
          allProfiles: [],
          activeProfile: null,
          todayTodos: [],
          todayNotes: [],
          allSessions: [],
          lastSession: null,
        });
      }
    } else {
      set({ allProfiles: remaining });
    }
  },

  switchProfile: async (profileId: string) => {
    const target = get().allProfiles.find((p) => p.id === profileId);
    if (!target) return;

    set({ activeProfile: target });
    await refreshActiveProfileData(target, set);
  },

  advanceDay: async () => {
    const { activeProfile } = get();
    if (!activeProfile) return;

    const nextDate = advanceGameDate({
      year: activeProfile.currentYear,
      season: activeProfile.currentSeason,
      day: activeProfile.currentDay,
    });

    const now = new Date().toISOString();
    await db
      .update(profilesTable)
      .set({
        currentYear: nextDate.year,
        currentSeason: nextDate.season,
        currentDay: nextDate.day,
        updatedAt: now,
      })
      .where(eq(profilesTable.id, activeProfile.id));

    const updatedProfile: Profile = {
      ...activeProfile,
      currentYear: nextDate.year,
      currentSeason: nextDate.season,
      currentDay: nextDate.day,
      updatedAt: now,
    };

    set((state) => ({
      activeProfile: updatedProfile,
      allProfiles: state.allProfiles.map((p) =>
        p.id === updatedProfile.id ? updatedProfile : p
      ),
    }));

    await refreshActiveProfileData(updatedProfile, set);
  },

  setGameDate: async (newDate: GameDate) => {
    const { activeProfile } = get();
    if (!activeProfile) return;

    const now = new Date().toISOString();
    await db
      .update(profilesTable)
      .set({
        currentYear: newDate.year,
        currentSeason: newDate.season,
        currentDay: newDate.day,
        updatedAt: now,
      })
      .where(eq(profilesTable.id, activeProfile.id));

    const updatedProfile: Profile = {
      ...activeProfile,
      currentYear: newDate.year,
      currentSeason: newDate.season,
      currentDay: newDate.day,
      updatedAt: now,
    };

    set((state) => ({
      activeProfile: updatedProfile,
      allProfiles: state.allProfiles.map((p) =>
        p.id === updatedProfile.id ? updatedProfile : p
      ),
    }));

    await refreshActiveProfileData(updatedProfile, set);
  },

  addTodo: async (title: string, category: TaskCategory = 'general', targetDate?: GameDate) => {
    const { activeProfile } = get();
    if (!activeProfile || !title.trim()) return;

    const date = targetDate ?? {
      year: activeProfile.currentYear,
      season: activeProfile.currentSeason,
      day: activeProfile.currentDay,
    };

    const newTodo: Todo = {
      id: generateId('todo'),
      profileId: activeProfile.id,
      title: title.trim(),
      category,
      isCompleted: false,
      targetYear: date.year,
      targetSeason: date.season,
      targetDay: date.day,
      createdAt: new Date().toISOString(),
    };

    await db.insert(todosTable).values({
      id: newTodo.id,
      profileId: newTodo.profileId,
      title: newTodo.title,
      category: newTodo.category,
      isCompleted: newTodo.isCompleted,
      targetYear: newTodo.targetYear,
      targetSeason: newTodo.targetSeason,
      targetDay: newTodo.targetDay,
      createdAt: newTodo.createdAt,
    });

    const isCurrentDate =
      date.year === activeProfile.currentYear &&
      date.season === activeProfile.currentSeason &&
      date.day === activeProfile.currentDay;

    if (isCurrentDate) {
      set((state) => ({
        todayTodos: [newTodo, ...state.todayTodos],
      }));
    }
  },

  toggleTodo: async (id: string) => {
    const { todayTodos } = get();
    const todo = todayTodos.find((t) => t.id === id);
    if (!todo) return;

    const updatedStatus = !todo.isCompleted;
    await db
      .update(todosTable)
      .set({ isCompleted: updatedStatus })
      .where(eq(todosTable.id, id));

    set((state) => ({
      todayTodos: state.todayTodos.map((t) =>
        t.id === id ? { ...t, isCompleted: updatedStatus } : t
      ),
    }));
  },

  deleteTodo: async (id: string) => {
    await db.delete(todosTable).where(eq(todosTable.id, id));
    set((state) => ({
      todayTodos: state.todayTodos.filter((t) => t.id !== id),
    }));
  },

  addQuickNote: async (content: string) => {
    const { activeProfile } = get();
    if (!activeProfile || !content.trim()) return;

    const newNote: QuickNote = {
      id: generateId('note'),
      profileId: activeProfile.id,
      content: content.trim(),
      gameYear: activeProfile.currentYear,
      gameSeason: activeProfile.currentSeason,
      gameDay: activeProfile.currentDay,
      createdAt: new Date().toISOString(),
    };

    await db.insert(quickNotesTable).values({
      id: newNote.id,
      profileId: newNote.profileId,
      content: newNote.content,
      gameYear: newNote.gameYear,
      gameSeason: newNote.gameSeason,
      gameDay: newNote.gameDay,
      createdAt: newNote.createdAt,
    });

    set((state) => ({
      todayNotes: [newNote, ...state.todayNotes],
    }));
  },

  deleteQuickNote: async (id: string) => {
    await db.delete(quickNotesTable).where(eq(quickNotesTable.id, id));
    set((state) => ({
      todayNotes: state.todayNotes.filter((n) => n.id !== id),
    }));
  },

  saveEndSession: async (params) => {
    const { activeProfile, advanceDay, addTodo } = get();
    if (!activeProfile) return;

    // Safety check: ensure duration_seconds column exists before inserting
    try {
      const cols = await expoDb.getAllAsync<{ name: string }>('PRAGMA table_info(sessions);');
      if (!cols.some((c) => c.name === 'duration_seconds')) {
        await expoDb.execAsync('ALTER TABLE sessions ADD COLUMN duration_seconds INTEGER DEFAULT 0;');
      }
    } catch (migErr) {
      console.warn('Could not verify sessions table schema:', migErr);
    }

    const newSession: Session = {
      id: generateId('sess'),
      profileId: activeProfile.id,
      gameYear: activeProfile.currentYear,
      gameSeason: activeProfile.currentSeason,
      gameDay: activeProfile.currentDay,
      realPlayedAt: new Date().toISOString(),
      durationSeconds: params.durationSeconds ?? 0,
      activities: params.activities,
      note: params.note.trim(),
      nextTasks: params.nextTasks.filter((t) => t.trim().length > 0),
    };

    // 1. Insert session record
    await db.insert(sessionsTable).values({
      id: newSession.id,
      profileId: newSession.profileId,
      gameYear: newSession.gameYear,
      gameSeason: newSession.gameSeason,
      gameDay: newSession.gameDay,
      realPlayedAt: newSession.realPlayedAt,
      durationSeconds: newSession.durationSeconds ?? 0,
      activitiesJson: JSON.stringify(newSession.activities),
      note: newSession.note,
      nextTasksJson: JSON.stringify(newSession.nextTasks),
    });

    // 2. If next tasks were recorded, schedule them as todos for next target date
    const targetDate = params.advanceDate
      ? advanceGameDate({
          year: activeProfile.currentYear,
          season: activeProfile.currentSeason,
          day: activeProfile.currentDay,
        })
      : {
          year: activeProfile.currentYear,
          season: activeProfile.currentSeason,
          day: activeProfile.currentDay,
        };

    for (const task of newSession.nextTasks) {
      await addTodo(task, 'general', targetDate);
    }

    set({
      activeSessionStartTime: null,
      activeSessionActivities: [],
    });

    // 3. Advance day if user slept, or refresh active profile data from database
    if (params.advanceDate) {
      await advanceDay();
    } else {
      await refreshActiveProfileData(activeProfile, set);
    }
  },
}));

async function refreshActiveProfileData(
  active: Profile,
  set: (updater: (state: GameState) => Partial<GameState>) => void
) {
  // 1. Fetch today's todos
  const todosRows = await db
    .select()
    .from(todosTable)
    .where(
      and(
        eq(todosTable.profileId, active.id),
        eq(todosTable.targetYear, active.currentYear),
        eq(todosTable.targetSeason, active.currentSeason),
        eq(todosTable.targetDay, active.currentDay)
      )
    )
    .orderBy(desc(todosTable.createdAt));

  const todos: Todo[] = todosRows.map((t) => ({
    id: t.id,
    profileId: t.profileId,
    title: t.title,
    category: t.category as TaskCategory,
    isCompleted: t.isCompleted,
    targetYear: t.targetYear,
    targetSeason: t.targetSeason as Season,
    targetDay: t.targetDay,
    createdAt: t.createdAt,
  }));

  // 2. Fetch today's notes
  const notesRows = await db
    .select()
    .from(quickNotesTable)
    .where(
      and(
        eq(quickNotesTable.profileId, active.id),
        eq(quickNotesTable.gameYear, active.currentYear),
        eq(quickNotesTable.gameSeason, active.currentSeason),
        eq(quickNotesTable.gameDay, active.currentDay)
      )
    )
    .orderBy(desc(quickNotesTable.createdAt));

  const notes: QuickNote[] = notesRows.map((n) => ({
    id: n.id,
    profileId: n.profileId,
    content: n.content,
    gameYear: n.gameYear,
    gameSeason: n.gameSeason as Season,
    gameDay: n.gameDay,
    createdAt: n.createdAt,
  }));

  // 3. Fetch sessions
  const sessionsRows = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.profileId, active.id))
    .orderBy(desc(sessionsTable.realPlayedAt));

  const sessions: Session[] = sessionsRows.map((s) => {
    let activities: TaskCategory[] = [];
    let nextTasks: string[] = [];
    try {
      activities = JSON.parse(s.activitiesJson);
    } catch {
      activities = [];
    }
    try {
      nextTasks = JSON.parse(s.nextTasksJson);
    } catch {
      nextTasks = [];
    }

    return {
      id: s.id,
      profileId: s.profileId,
      gameYear: s.gameYear,
      gameSeason: s.gameSeason as Season,
      gameDay: s.gameDay,
      realPlayedAt: s.realPlayedAt,
      durationSeconds: s.durationSeconds ?? 0,
      activities,
      note: s.note,
      nextTasks,
    };
  });

  set(() => ({
    todayTodos: todos,
    todayNotes: notes,
    allSessions: sessions,
    lastSession: sessions.length > 0 ? sessions[0] : null,
  }));
}
