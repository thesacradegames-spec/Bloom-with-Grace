/**
 * Notification utilities for task reminders
 * Uses browser's built-in Web Notifications API
 */

export interface NotificationSettings {
  enabled: boolean;
  reminderTimes: string[]; // Array of times in HH:MM format
  dailyReminder: boolean;
  goalReminders: boolean;
  waterReminder: boolean;
  reminderInterval: number; // Hours between reminders
  sound: boolean;
}

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  scheduledTime: string; // ISO string
  type: 'goal' | 'water' | 'daily' | 'custom';
  goalId?: string;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  reminderTimes: ['09:00', '14:00', '18:00'],
  dailyReminder: true,
  goalReminders: true,
  waterReminder: true,
  reminderInterval: 4,
  sound: true
};

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Check if notifications are supported and permitted
 */
export function canShowNotifications(): boolean {
  return 'Notification' in window && Notification.permission === 'granted';
}

/**
 * Show a notification
 */
export function showNotification(title: string, options: NotificationOptions = {}): Notification | null {
  if (!canShowNotifications()) {
    console.warn('Notifications not available or not permitted');
    return null;
  }

  const defaultOptions: NotificationOptions = {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'bloom-reminder',
    requireInteraction: false,
    silent: false,
    ...options
  };

  const notification = new Notification(title, defaultOptions);

  // Auto-close after 5 seconds
  setTimeout(() => {
    notification.close();
  }, 5000);

  return notification;
}

/**
 * Get notification settings for current user
 */
export function getNotificationSettings(username: string): NotificationSettings {
  const key = `bloom-user-${username.toLowerCase().replace(/\s+/g, '-')}-notifications`;
  const saved = localStorage.getItem(key);
  
  if (saved) {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
  
  return DEFAULT_SETTINGS;
}

/**
 * Save notification settings for current user
 */
export function saveNotificationSettings(username: string, settings: NotificationSettings): void {
  const key = `bloom-user-${username.toLowerCase().replace(/\s+/g, '-')}-notifications`;
  localStorage.setItem(key, JSON.stringify(settings));
}

/**
 * Schedule a reminder notification
 */
export function scheduleReminder(notification: ScheduledNotification): void {
  const scheduledTime = new Date(notification.scheduledTime).getTime();
  const now = Date.now();
  const delay = scheduledTime - now;

  if (delay <= 0) {
    // Time has passed, schedule for tomorrow
    const tomorrow = new Date(scheduledTime);
    tomorrow.setDate(tomorrow.getDate() + 1);
    scheduleReminder({
      ...notification,
      scheduledTime: tomorrow.toISOString()
    });
    return;
  }

  setTimeout(() => {
    if (canShowNotifications()) {
      const options: NotificationOptions = {
        body: notification.body,
        icon: '/favicon.ico',
        tag: notification.type,
        data: notification,
        actions: [
          {
            action: 'mark-complete',
            title: '✅ Mark Complete'
          },
          {
            action: 'snooze',
            title: '⏰ Snooze 30min'
          }
        ]
      };

      const notif = showNotification(notification.title, options);
      
      if (notif) {
        notif.onclick = () => {
          // Focus the app window
          window.focus();
          // Navigate to dashboard
          window.location.href = '/dashboard';
          notif.close();
        };
      }
    }
  }, delay);

  // Store scheduled notification
  const key = `bloom-scheduled-${notification.id}`;
  localStorage.setItem(key, JSON.stringify(notification));
}

/**
 * Create daily goal reminders
 */
export function createGoalReminders(username: string, goals: any[]): void {
  const settings = getNotificationSettings(username);
  
  if (!settings.enabled || !settings.goalReminders) return;

  // Clear existing goal reminders
  clearGoalReminders();

  settings.reminderTimes.forEach((time, index) => {
    const [hours, minutes] = time.split(':').map(Number);
    const today = new Date();
    const reminderTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);

    // If time has passed today, schedule for tomorrow
    if (reminderTime.getTime() <= Date.now()) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const incompleteGoals = goals.filter(goal => goal.current < goal.target);
    
    if (incompleteGoals.length > 0) {
      const notification: ScheduledNotification = {
        id: `goal-reminder-${index}`,
        title: '🌸 Time to Bloom!',
        body: `You have ${incompleteGoals.length} goals waiting to be completed. Let's make progress! 💪`,
        scheduledTime: reminderTime.toISOString(),
        type: 'goal'
      };

      scheduleReminder(notification);
    }
  });
}

/**
 * Create water intake reminders
 */
export function createWaterReminders(username: string, currentIntake: number, target: number = 3): void {
  const settings = getNotificationSettings(username);
  
  if (!settings.enabled || !settings.waterReminder || currentIntake >= target) return;

  const reminderTime = new Date();
  reminderTime.setHours(reminderTime.getHours() + settings.reminderInterval);

  const remaining = target - currentIntake;
  const notification: ScheduledNotification = {
    id: `water-reminder-${Date.now()}`,
    title: '💧 Hydration Reminder',
    body: `Don't forget to drink water! You need ${remaining.toFixed(1)}L more to reach your goal.`,
    scheduledTime: reminderTime.toISOString(),
    type: 'water'
  };

  scheduleReminder(notification);
}

/**
 * Create daily check-in reminder
 */
export function createDailyReminder(username: string): void {
  const settings = getNotificationSettings(username);
  
  if (!settings.enabled || !settings.dailyReminder) return;

  // Schedule for end of day (9 PM)
  const today = new Date();
  const reminderTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 21, 0);

  if (reminderTime.getTime() <= Date.now()) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }

  const notification: ScheduledNotification = {
    id: `daily-reminder-${today.toDateString()}`,
    title: '🌟 Daily Check-in',
    body: "How did your day go? Don't forget to update your progress and celebrate your achievements!",
    scheduledTime: reminderTime.toISOString(),
    type: 'daily'
  };

  scheduleReminder(notification);
}

/**
 * Clear all scheduled reminders
 */
export function clearGoalReminders(): void {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('bloom-scheduled-goal-reminder')) {
      localStorage.removeItem(key);
    }
  }
}

/**
 * Show instant reminder for specific goal
 */
export function showGoalReminder(goalTitle: string, current: number, target: number): void {
  if (!canShowNotifications()) return;

  const progress = Math.round((current / target) * 100);
  const remaining = target - current;

  const title = `🎯 ${goalTitle} Reminder`;
  const body = remaining > 0 
    ? `You're ${progress}% there! Just ${remaining} more to complete this goal. You've got this! 💪`
    : `🎉 Congratulations! You've completed your ${goalTitle} goal!`;

  showNotification(title, {
    body,
    tag: `goal-${goalTitle}`,
    icon: '/favicon.ico'
  });
}

/**
 * Initialize notification system for user
 */
export async function initializeNotifications(username: string): Promise<boolean> {
  const hasPermission = await requestNotificationPermission();
  
  if (hasPermission) {
    const settings = getNotificationSettings(username);
    if (settings.enabled) {
      // Show welcome notification
      showNotification('🌸 Notifications Enabled!', {
        body: 'Her Daily Bloom will now remind you to stay on track with your goals.',
        tag: 'welcome'
      });
    }
  }
  
  return hasPermission;
}

/**
 * Get notification permission status
 */
export function getNotificationStatus(): 'granted' | 'denied' | 'default' | 'unsupported' {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}
