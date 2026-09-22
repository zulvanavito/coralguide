export type Season = 'spring' | 'summer' | 'fall' | 'winter';

export interface GameDate {
  year: number;
  season: Season;
  day: number; // 1 - 28
}

export type TaskCategory =
  | 'farming'
  | 'fishing'
  | 'mining'
  | 'diving'
  | 'relationship'
  | 'museum'
  | 'quest'
  | 'general';

export interface Profile {
  id: string;
  saveName: string;
  currentYear: number;
  currentSeason: Season;
  currentDay: number;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: string;
  profileId: string;
  title: string;
  category: TaskCategory;
  isCompleted: boolean;
  targetYear: number;
  targetSeason: Season;
  targetDay: number;
  createdAt: string;
}

export interface QuickNote {
  id: string;
  profileId: string;
  content: string;
  gameYear: number;
  gameSeason: Season;
  gameDay: number;
  createdAt: string;
}

export interface Session {
  id: string;
  profileId: string;
  gameYear: number;
  gameSeason: Season;
  gameDay: number;
  realPlayedAt: string;
  durationSeconds?: number;
  activities: TaskCategory[];
  note: string;
  nextTasks: string[];
}

export type WikiCategory = 'all' | 'fish' | 'crops' | 'characters' | 'items' | 'recipes';

export interface WikiItem {
  id: string;
  name: string;
  category: 'fish' | 'crops' | 'characters' | 'items' | 'recipes';
  categoryLabel: string;
  season?: Season | 'any';
  location?: string;
  weather?: string;
  time?: string;
  sellPrice?: string;
  description: string;
  avatarIcon?: string;
}
