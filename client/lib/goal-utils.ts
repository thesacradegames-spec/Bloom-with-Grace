import { getCurrentUser } from './user-data-utils';

export interface Goal {
  id: string;
  title: string;
  icon: string;
  target: number;
}

const DEFAULT_GOALS: Goal[] = [
  { id: "codeforces", title: "Codeforces", icon: "🏆", target: 2 },
  { id: "codechef", title: "CodeChef", icon: "🥇", target: 2 },
  { id: "leetcode", title: "LeetCode", icon: "💻", target: 3 },
  { id: "dsa", title: "DSA Practice", icon: "🧠", target: 2 },
  { id: "github", title: "GitHub", icon: "📂", target: 1 }
];

/**
 * Get user-specific goals from localStorage
 */
export function getUserGoals(username?: string): Goal[] {
  const user = username || getCurrentUser();
  if (!user) return DEFAULT_GOALS;

  const key = `bloom-user-${user.toLowerCase().replace(/\s+/g, '-')}-goals`;
  const saved = localStorage.getItem(key);
  
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_GOALS;
    }
  }
  
  return DEFAULT_GOALS;
}

/**
 * Save user-specific goals to localStorage
 */
export function saveUserGoals(goals: Goal[], username?: string): void {
  const user = username || getCurrentUser();
  if (!user) return;

  const key = `bloom-user-${user.toLowerCase().replace(/\s+/g, '-')}-goals`;
  localStorage.setItem(key, JSON.stringify(goals));
}

/**
 * Add a new goal for the user
 */
export function addUserGoal(goal: Goal, username?: string): Goal[] {
  const currentGoals = getUserGoals(username);
  const newGoals = [...currentGoals, goal];
  saveUserGoals(newGoals, username);
  return newGoals;
}

/**
 * Update an existing goal for the user
 */
export function updateUserGoal(goalId: string, updates: Partial<Goal>, username?: string): Goal[] {
  const currentGoals = getUserGoals(username);
  const updatedGoals = currentGoals.map(goal =>
    goal.id === goalId ? { ...goal, ...updates } : goal
  );
  saveUserGoals(updatedGoals, username);
  return updatedGoals;
}

/**
 * Remove a goal for the user
 */
export function removeUserGoal(goalId: string, username?: string): Goal[] {
  const currentGoals = getUserGoals(username);
  const filteredGoals = currentGoals.filter(goal => goal.id !== goalId);
  saveUserGoals(filteredGoals, username);
  return filteredGoals;
}

/**
 * Reset goals to default for the user
 */
export function resetUserGoals(username?: string): Goal[] {
  saveUserGoals(DEFAULT_GOALS, username);
  return DEFAULT_GOALS;
}

/**
 * Check if a goal exists for the user
 */
export function goalExists(goalId: string, username?: string): boolean {
  const goals = getUserGoals(username);
  return goals.some(goal => goal.id === goalId);
}

/**
 * Get a specific goal by ID
 */
export function getUserGoal(goalId: string, username?: string): Goal | null {
  const goals = getUserGoals(username);
  return goals.find(goal => goal.id === goalId) || null;
}
