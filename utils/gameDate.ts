import { GameDate, Season, TaskCategory } from '@/types/game';

export const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter'];

export const SEASON_LABELS: Record<Season, string> = {
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall',
  winter: 'Winter',
};

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  farming: 'Farming',
  fishing: 'Fishing',
  mining: 'Mining',
  diving: 'Diving',
  relationship: 'Relationship',
  museum: 'Museum',
  quest: 'Quest',
  general: 'General',
};

export const CATEGORY_ICONS: Record<TaskCategory, string> = {
  farming: 'leaf',
  fishing: 'fish',
  mining: 'hammer',
  diving: 'water',
  relationship: 'heart',
  museum: 'library',
  quest: 'bookmark',
  general: 'checkbox-outline',
};

/**
 * Coral Island calendar rule:
 * - 4 seasons per year: Spring, Summer, Fall, Winter
 * - 28 days per season
 */
export function advanceGameDate(current: GameDate): GameDate {
  if (current.day < 28) {
    return {
      ...current,
      day: current.day + 1,
    };
  }

  // Day 28: Transition to next season
  const currentSeasonIndex = SEASONS.indexOf(current.season);
  if (currentSeasonIndex < 3) {
    return {
      year: current.year,
      season: SEASONS[currentSeasonIndex + 1],
      day: 1,
    };
  }

  // Winter 28 -> Spring 1 of next year
  return {
    year: current.year + 1,
    season: 'spring',
    day: 1,
  };
}

export function formatGameDate(date: GameDate): string {
  const seasonName = SEASON_LABELS[date.season] || date.season;
  return `${seasonName} ${date.day} · Year ${date.year}`;
}

export function isSameGameDate(a: GameDate, b: GameDate): boolean {
  return a.year === b.year && a.season === b.season && a.day === b.day;
}

export function getSeasonTheme(season: Season) {
  switch (season) {
    case 'spring':
      return {
        accent: '#22c55e',
        badgeBg: '#dcfce7',
        badgeText: '#15803d',
        headerBg: '#14532d',
      };
    case 'summer':
      return {
        accent: '#f59e0b',
        badgeBg: '#fef3c7',
        badgeText: '#b45309',
        headerBg: '#78350f',
      };
    case 'fall':
      return {
        accent: '#ea580c',
        badgeBg: '#ffedd5',
        badgeText: '#c2410c',
        headerBg: '#7c2d12',
      };
    case 'winter':
      return {
        accent: '#0284c7',
        badgeBg: '#e0f2fe',
        badgeText: '#0369a1',
        headerBg: '#0c4a6e',
      };
  }
}

export type TimeOfDay = 'morning' | 'evening' | 'night';

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 15) return 'morning';
  if (hour >= 15 && hour < 19) return 'evening';
  return 'night';
}

export function getGreeting(timeOfDay: TimeOfDay): { text: string; emoji: string } {
  switch (timeOfDay) {
    case 'morning':
      return { text: 'Good morning,\nIsland Friend!', emoji: '☀️' };
    case 'evening':
      return { text: 'Good evening,\nIsland Friend!', emoji: '🌅' };
    case 'night':
      return { text: 'Good night,\nIsland Friend!', emoji: '🌙' };
  }
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0m';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

export function formatStopwatch(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

