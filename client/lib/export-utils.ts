import { getCurrentUser, getUserStoredDates, loadUserDayData } from './user-data-utils';

export interface ExportData {
  date: string;
  goals: Record<string, { current: number; target: number }>;
  waterIntake: number;
  totalGoalsCompleted: number;
  totalGoals: number;
  completionRate: number;
  isPerfectDay: boolean;
}

/**
 * Get all user data formatted for export
 */
export function getAllUserData(username?: string): ExportData[] {
  const user = username || getCurrentUser();
  if (!user) return [];

  const dates = getUserStoredDates(user);
  const exportData: ExportData[] = [];

  dates.forEach(date => {
    const dayData = loadUserDayData(user, date);
    if (dayData) {
      // Convert goals array to object for easier CSV export
      const goalsObj: Record<string, { current: number; target: number }> = {};
      dayData.goalData.forEach(goal => {
        goalsObj[goal.id] = { current: goal.current, target: goal.target };
      });

      const completedGoals = dayData.goalData.filter(goal => goal.current >= goal.target).length;
      const totalGoals = dayData.goalData.length;
      const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
      const isPerfectDay = completedGoals === totalGoals && dayData.waterIntake >= 3;

      exportData.push({
        date,
        goals: goalsObj,
        waterIntake: dayData.waterIntake,
        totalGoalsCompleted: completedGoals,
        totalGoals,
        completionRate,
        isPerfectDay
      });
    }
  });

  return exportData.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Convert data to CSV format
 */
export function convertToCSV(data: ExportData[]): string {
  if (data.length === 0) return '';

  // Get all unique goal IDs
  const allGoalIds = new Set<string>();
  data.forEach(day => {
    Object.keys(day.goals).forEach(goalId => allGoalIds.add(goalId));
  });
  const goalIds = Array.from(allGoalIds).sort();

  // Create headers
  const headers = [
    'Date',
    'Water Intake (L)',
    'Total Goals Completed',
    'Total Goals',
    'Completion Rate (%)',
    'Perfect Day',
    ...goalIds.flatMap(goalId => [`${goalId} - Current`, `${goalId} - Target`])
  ];

  // Create rows
  const rows = data.map(day => [
    day.date,
    day.waterIntake.toString(),
    day.totalGoalsCompleted.toString(),
    day.totalGoals.toString(),
    day.completionRate.toString(),
    day.isPerfectDay ? 'Yes' : 'No',
    ...goalIds.flatMap(goalId => {
      const goal = day.goals[goalId];
      return [
        goal ? goal.current.toString() : '0',
        goal ? goal.target.toString() : '0'
      ];
    })
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Export user data as CSV
 */
export function exportUserDataAsCSV(timeRange: 'all' | 'weekly' | 'monthly' = 'all', username?: string): void {
  const user = username || getCurrentUser();
  if (!user) return;

  let data = getAllUserData(user);
  
  // Filter data based on time range
  if (timeRange === 'weekly') {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekAgoString = oneWeekAgo.toISOString().split('T')[0];
    data = data.filter(day => day.date >= weekAgoString);
  } else if (timeRange === 'monthly') {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const monthAgoString = oneMonthAgo.toISOString().split('T')[0];
    data = data.filter(day => day.date >= monthAgoString);
  }

  if (data.length === 0) {
    alert('No data available for the selected time range.');
    return;
  }

  const csvContent = convertToCSV(data);
  const today = new Date().toISOString().split('T')[0];
  const filename = `her-daily-bloom-${user}-${timeRange}-${today}.csv`;

  downloadCSV(csvContent, filename);
}

/**
 * Get export statistics
 */
export function getExportStats(username?: string): {
  totalDays: number;
  dateRange: { start: string; end: string } | null;
  perfectDays: number;
  averageCompletion: number;
} {
  const data = getAllUserData(username);
  
  if (data.length === 0) {
    return {
      totalDays: 0,
      dateRange: null,
      perfectDays: 0,
      averageCompletion: 0
    };
  }

  const perfectDays = data.filter(day => day.isPerfectDay).length;
  const averageCompletion = Math.round(
    data.reduce((sum, day) => sum + day.completionRate, 0) / data.length
  );

  return {
    totalDays: data.length,
    dateRange: {
      start: data[0].date,
      end: data[data.length - 1].date
    },
    perfectDays,
    averageCompletion
  };
}
