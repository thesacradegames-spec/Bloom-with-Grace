import { getCurrentUser } from './user-data-utils';

/**
 * Get user's birthday from localStorage
 */
export function getUserBirthday(username?: string): string | null {
  const user = username || getCurrentUser();
  if (!user) return null;
  
  const key = `bloom-user-${user.toLowerCase().replace(/\s+/g, '-')}-birthday`;
  return localStorage.getItem(key);
}

/**
 * Save user's birthday to localStorage
 */
export function saveUserBirthday(username: string, birthday: string): void {
  const key = `bloom-user-${username.toLowerCase().replace(/\s+/g, '-')}-birthday`;
  localStorage.setItem(key, birthday);
}

/**
 * Check if today is the user's birthday
 */
export function isTodayUsersBirthday(currentDate?: string, username?: string): boolean {
  const birthday = getUserBirthday(username);
  if (!birthday) return false;
  
  const today = currentDate || new Date().toISOString().split('T')[0];
  
  // Extract month and day from birthday (YYYY-MM-DD format)
  const [, birthdayMonth, birthdayDay] = birthday.split('-');
  const [, todayMonth, todayDay] = today.split('-');
  
  return birthdayMonth === todayMonth && birthdayDay === todayDay;
}

/**
 * Get the next birthday date for the user
 */
export function getNextBirthday(username?: string): Date | null {
  const birthday = getUserBirthday(username);
  if (!birthday) return null;
  
  const today = new Date();
  const currentYear = today.getFullYear();
  const [, birthdayMonth, birthdayDay] = birthday.split('-');
  
  // Create birthday date for current year
  let nextBirthday = new Date(currentYear, parseInt(birthdayMonth) - 1, parseInt(birthdayDay));
  
  // If birthday has already passed this year, set to next year
  if (nextBirthday < today) {
    nextBirthday = new Date(currentYear + 1, parseInt(birthdayMonth) - 1, parseInt(birthdayDay));
  }
  
  return nextBirthday;
}

/**
 * Calculate days until user's next birthday
 */
export function getDaysUntilBirthday(username?: string): number | null {
  const nextBirthday = getNextBirthday(username);
  if (!nextBirthday) return null;
  
  const today = new Date();
  const diffTime = nextBirthday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Get user's age based on birthday
 */
export function getUserAge(username?: string): number | null {
  const birthday = getUserBirthday(username);
  if (!birthday) return null;
  
  const today = new Date();
  const birthDate = new Date(birthday);
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Format birthday for display
 */
export function formatBirthday(birthday: string): string {
  const date = new Date(birthday + 'T00:00:00');
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric'
  });
}
