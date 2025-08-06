import { SerializableDashboardData } from "./data-utils";
import { GlobalStats } from "./stats-utils";

/**
 * Get the current logged-in user
 */
export function getCurrentUser(): string | null {
  return localStorage.getItem('bloom-current-user');
}

/**
 * Set the current user
 */
export function setCurrentUser(username: string): void {
  localStorage.setItem('bloom-current-user', username);
}

/**
 * Get user-specific key for localStorage
 */
function getUserKey(username: string, key: string): string {
  return `bloom-user-${username.toLowerCase().replace(/\s+/g, '-')}-${key}`;
}

/**
 * Save daily data for a specific user and date
 */
export function saveUserDayData(username: string, date: string, data: SerializableDashboardData): void {
  const key = getUserKey(username, `data-${date}`);
  localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Load daily data for a specific user and date
 */
export function loadUserDayData(username: string, date: string): SerializableDashboardData | null {
  const key = getUserKey(username, `data-${date}`);
  const saved = localStorage.getItem(key);
  
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Get all dates with data for a specific user
 */
export function getUserStoredDates(username: string): string[] {
  const userPrefix = getUserKey(username, 'data-');
  const dates: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(userPrefix)) {
      const date = key.replace(userPrefix, '');
      if (date && date !== 'undefined') {
        dates.push(date);
      }
    }
  }
  
  return dates.sort();
}

/**
 * Get progress data for a specific user and date
 */
export function getUserDayProgress(username: string, dateString: string) {
  const data = loadUserDayData(username, dateString);
  
  if (!data) {
    return null;
  }
  
  try {
    const goalCount = data.goalData.length;
    const completedGoals = data.goalData.filter(goal => goal.current >= goal.target).length;
    const completionRate = goalCount > 0 ? Math.round((completedGoals / goalCount) * 100) : 0;
    const isPerfectDay = completedGoals === goalCount && data.waterIntake >= 3;
    
    return {
      date: dateString,
      completionRate,
      isPerfectDay,
      goalCount,
      completedGoals,
      waterIntake: data.waterIntake,
      data
    };
  } catch (error) {
    console.error('Error parsing user day data:', error);
    return null;
  }
}

/**
 * Calculate global stats for a specific user
 */
export function calculateUserGlobalStats(username: string): GlobalStats {
  const allDates = getUserStoredDates(username).sort();
  
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
    const progress = getUserDayProgress(username, date);
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
    const progress = getUserDayProgress(username, allDates[i]);
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
 * Get month progress for a specific user
 */
export function getUserMonthProgress(username: string, year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const dates: string[] = [];
  
  // Generate all dates in the month
  const currentDate = new Date(firstDay);
  while (currentDate <= lastDay) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates
    .map(date => getUserDayProgress(username, date))
    .filter(progress => progress !== null);
}

/**
 * Save user's display name preference
 */
export function saveUserDisplayName(username: string, displayName: string): void {
  const key = getUserKey(username, 'display-name');
  localStorage.setItem(key, displayName);
}

/**
 * Load user's display name preference
 */
export function loadUserDisplayName(username: string): string {
  const key = getUserKey(username, 'display-name');
  return localStorage.getItem(key) || username;
}

/**
 * Check if user exists (has any data)
 */
export function userExists(username: string): boolean {
  return getUserStoredDates(username).length > 0 || loadUserDisplayName(username) !== username;
}

/**
 * Get all users who have used the app
 */
export function getAllUsers(): string[] {
  const users = new Set<string>();
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('bloom-user-')) {
      const match = key.match(/^bloom-user-([^-]+)-/);
      if (match) {
        users.add(match[1].replace(/-/g, ' '));
      }
    }
  }
  
  return Array.from(users);
}
