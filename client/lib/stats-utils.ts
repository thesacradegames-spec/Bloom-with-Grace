import { getAllStoredDates, getDayProgress } from "./data-utils";

export interface GlobalStats {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  perfectDays: number;
}

/**
 * Calculate global statistics from all stored data
 */
export function calculateGlobalStats(): GlobalStats {
  const allDates = getAllStoredDates().sort(); // Sort chronologically
  
  if (allDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalDays: 0,
      perfectDays: 0
    };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let perfectDays = 0;

  // Calculate total perfect days and longest streak
  for (const date of allDates) {
    const progress = getDayProgress(date);
    if (progress && progress.isPerfectDay) {
      perfectDays++;
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  // Calculate current streak (working backwards from the most recent date)
  for (let i = allDates.length - 1; i >= 0; i--) {
    const progress = getDayProgress(allDates[i]);
    if (progress && progress.isPerfectDay) {
      currentStreak++;
    } else {
      break; // Stop at first non-perfect day
    }
  }

  return {
    currentStreak,
    longestStreak,
    totalDays: allDates.length,
    perfectDays
  };
}

/**
 * Save global stats to localStorage
 */
export function saveGlobalStats(stats: GlobalStats): void {
  localStorage.setItem('bloom-global-stats', JSON.stringify(stats));
}

/**
 * Load global stats from localStorage
 */
export function loadGlobalStats(): GlobalStats {
  const saved = localStorage.getItem('bloom-global-stats');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return calculateGlobalStats();
    }
  }
  return calculateGlobalStats();
}

/**
 * Update global stats after a day change
 */
export function updateGlobalStatsAfterDayChange(wasPerfectDay: boolean): GlobalStats {
  const currentStats = calculateGlobalStats(); // Recalculate from all data
  saveGlobalStats(currentStats);
  return currentStats;
}
