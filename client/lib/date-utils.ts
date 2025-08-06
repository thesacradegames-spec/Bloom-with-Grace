/**
 * Get the current local date as YYYY-MM-DD string without timezone conversion issues
 */
export function getCurrentLocalDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get a local date string from a Date object without timezone conversion
 */
export function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Add days to a date string and return the new date string
 */
export function addDaysToDateString(dateString: string, days: number): string {
  const date = new Date(dateString + 'T00:00:00'); // Ensure no timezone conversion
  date.setDate(date.getDate() + days);
  return getLocalDateString(date);
}

/**
 * Format a date string for display
 */
export function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00'); // Ensure no timezone conversion
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
