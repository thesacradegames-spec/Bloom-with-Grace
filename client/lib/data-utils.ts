export interface SerializableGoalData {
  id: string;
  current: number;
  target: number;
}

export interface SerializableDashboardData {
  waterIntake: number;
  goalData: SerializableGoalData[];
}

export interface DayProgress {
  date: string;
  completionRate: number;
  isPerfectDay: boolean;
  goalCount: number;
  completedGoals: number;
  waterIntake: number;
  data?: SerializableDashboardData;
}

export function getDayProgress(dateString: string): DayProgress | null {
  const savedData = localStorage.getItem(`bloom-dashboard-data-${dateString}`);
  
  if (!savedData) {
    return null;
  }
  
  try {
    const data: SerializableDashboardData = JSON.parse(savedData);
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
    console.error('Error parsing day data:', error);
    return null;
  }
}

export function getAllStoredDates(): string[] {
  const dates: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('bloom-dashboard-data-')) {
      const date = key.replace('bloom-dashboard-data-', '');
      if (date && date !== 'undefined') {
        dates.push(date);
      }
    }
  }
  
  return dates.sort();
}

export function getDateRange(startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

export function getMonthProgress(year: number, month: number): DayProgress[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const dateRange = getDateRange(firstDay, lastDay);
  
  return dateRange
    .map(date => getDayProgress(date))
    .filter((progress): progress is DayProgress => progress !== null);
}
