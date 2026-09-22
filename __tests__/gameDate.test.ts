import { describe, it, expect } from 'vitest';
import {
  advanceGameDate,
  formatGameDate,
  formatDuration,
  formatStopwatch,
  getGreeting,
  getTimeOfDay,
} from '../utils/gameDate';

describe('Coral Island Calendar Logic', () => {
  it('advances regular day within the same season', () => {
    const current = { year: 1, season: 'spring' as const, day: 1 };
    const next = advanceGameDate(current);
    expect(next).toEqual({ year: 1, season: 'spring', day: 2 });
  });

  it('transitions from Spring 28 to Summer 1', () => {
    const current = { year: 1, season: 'spring' as const, day: 28 };
    const next = advanceGameDate(current);
    expect(next).toEqual({ year: 1, season: 'summer', day: 1 });
  });

  it('transitions from Summer 28 to Fall 1', () => {
    const current = { year: 1, season: 'summer' as const, day: 28 };
    const next = advanceGameDate(current);
    expect(next).toEqual({ year: 1, season: 'fall', day: 1 });
  });

  it('transitions from Fall 28 to Winter 1', () => {
    const current = { year: 1, season: 'fall' as const, day: 28 };
    const next = advanceGameDate(current);
    expect(next).toEqual({ year: 1, season: 'winter', day: 1 });
  });

  it('transitions from Winter 28 to Spring 1 of next year', () => {
    const current = { year: 1, season: 'winter' as const, day: 28 };
    const next = advanceGameDate(current);
    expect(next).toEqual({ year: 2, season: 'spring', day: 1 });
  });

  it('formats game date correctly', () => {
    const date = { year: 1, season: 'summer' as const, day: 13 };
    expect(formatGameDate(date)).toBe('Summer 13 · Year 1');
  });

  it('formats session duration correctly', () => {
    expect(formatDuration(0)).toBe('0m');
    expect(formatDuration(180)).toBe('3m');
    expect(formatDuration(3600)).toBe('1h');
    expect(formatDuration(8040)).toBe('2h 14m');
  });

  it('formats stopwatch display correctly', () => {
    expect(formatStopwatch(0)).toBe('00:00:00');
    expect(formatStopwatch(65)).toBe('00:01:05');
    expect(formatStopwatch(8076)).toBe('02:14:36');
  });

  it('provides appropriate greeting for time of day', () => {
    expect(getGreeting('morning').text).toContain('Good morning');
    expect(getGreeting('evening').text).toContain('Good evening');
    expect(getGreeting('night').text).toContain('Good night');
  });

  it('calculates current time of day without throwing', () => {
    const tod = getTimeOfDay();
    expect(['morning', 'evening', 'night']).toContain(tod);
  });
});
