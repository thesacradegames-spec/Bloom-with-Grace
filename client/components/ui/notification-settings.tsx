import { useState, useEffect } from "react";
import { Bell, BellOff, Clock, Droplets, Target, AlertCircle, CheckCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "./button";
import { Switch } from "./switch";
import { Label } from "./label";
import { Input } from "./input";
import {
  NotificationSettings,
  getNotificationSettings,
  saveNotificationSettings,
  requestNotificationPermission,
  getNotificationStatus,
  showNotification,
  initializeNotifications
} from "@/lib/notification-utils";

interface NotificationSettingsProps {
  username: string;
  onSettingsChange?: (settings: NotificationSettings) => void;
}

export function NotificationSettingsComponent({ username, onSettingsChange }: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSettings>(() => getNotificationSettings(username));
  const [permissionStatus, setPermissionStatus] = useState(() => getNotificationStatus());
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [testNotificationSent, setTestNotificationSent] = useState(false);
  const [newReminderTime, setNewReminderTime] = useState("");

  useEffect(() => {
    setPermissionStatus(getNotificationStatus());
  }, []);

  const handleEnableNotifications = async () => {
    setIsRequestingPermission(true);
    
    try {
      const hasPermission = await requestNotificationPermission();
      setPermissionStatus(getNotificationStatus());
      
      if (hasPermission) {
        const newSettings = { ...settings, enabled: true };
        setSettings(newSettings);
        saveNotificationSettings(username, newSettings);
        onSettingsChange?.(newSettings);
        
        // Initialize notifications for the user
        await initializeNotifications(username);
      }
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleSettingChange = (key: keyof NotificationSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveNotificationSettings(username, newSettings);
    onSettingsChange?.(newSettings);
  };

  const handleAddReminderTime = () => {
    if (newReminderTime && !settings.reminderTimes.includes(newReminderTime)) {
      const newTimes = [...settings.reminderTimes, newReminderTime].sort();
      handleSettingChange('reminderTimes', newTimes);
      setNewReminderTime("");
    }
  };

  const handleRemoveReminderTime = (timeToRemove: string) => {
    const newTimes = settings.reminderTimes.filter(time => time !== timeToRemove);
    handleSettingChange('reminderTimes', newTimes);
  };

  const handleTestNotification = () => {
    showNotification('🌸 Test Notification', {
      body: 'Your notifications are working perfectly! You\'ll receive reminders like this to help you stay on track.',
      tag: 'test'
    });
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 3000);
  };

  const getPermissionStatusIcon = () => {
    switch (permissionStatus) {
      case 'granted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'denied':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'unsupported':
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getPermissionStatusText = () => {
    switch (permissionStatus) {
      case 'granted':
        return 'Notifications enabled';
      case 'denied':
        return 'Notifications blocked - Please enable in browser settings';
      case 'unsupported':
        return 'Notifications not supported in this browser';
      default:
        return 'Click to enable notifications';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-2 rounded-lg sm:rounded-xl shadow-lg">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-white">Notification Settings</h3>
          <p className="text-white/70 text-xs sm:text-sm">Stay on track with smart reminders</p>
        </div>
      </div>

      {/* Permission Status */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {getPermissionStatusIcon()}
            <div className="min-w-0 flex-1">
              <div className="text-white font-medium text-sm sm:text-base">Notification Permission</div>
              <div className="text-white/70 text-xs sm:text-sm">{getPermissionStatusText()}</div>
            </div>
          </div>
          
          {permissionStatus !== 'granted' && permissionStatus !== 'unsupported' && (
            <Button
              onClick={handleEnableNotifications}
              disabled={isRequestingPermission || permissionStatus === 'denied'}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              {isRequestingPermission ? 'Requesting...' : 'Enable'}
            </Button>
          )}

          {permissionStatus === 'granted' && (
            <Button
              onClick={handleTestNotification}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              {testNotificationSent ? 'Sent! ✓' : 'Test Notification'}
            </Button>
          )}
        </div>
      </div>

      {/* Main Settings - Only show if notifications are supported */}
      {permissionStatus !== 'unsupported' && (
        <div className="space-y-4">
          {/* Master Toggle */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.enabled ? (
                  <Bell className="w-5 h-5 text-white" />
                ) : (
                  <BellOff className="w-5 h-5 text-white/60" />
                )}
                <div>
                  <Label className="text-white font-medium">Enable Notifications</Label>
                  <div className="text-white/70 text-sm">
                    Turn on reminders to help you achieve your goals
                  </div>
                </div>
              </div>
              <Switch
                checked={settings.enabled && permissionStatus === 'granted'}
                onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
                disabled={permissionStatus !== 'granted'}
              />
            </div>
          </div>

          {/* Notification Types - Only show if enabled */}
          {settings.enabled && permissionStatus === 'granted' && (
            <>
              {/* Reminder Types */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 space-y-4">
                <h4 className="text-white font-medium">Reminder Types</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="w-4 h-4 text-white" />
                      <div>
                        <Label className="text-white text-sm">Goal Reminders</Label>
                        <div className="text-white/70 text-xs">Get reminded about incomplete goals</div>
                      </div>
                    </div>
                    <Switch
                      checked={settings.goalReminders}
                      onCheckedChange={(checked) => handleSettingChange('goalReminders', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Droplets className="w-4 h-4 text-white" />
                      <div>
                        <Label className="text-white text-sm">Water Reminders</Label>
                        <div className="text-white/70 text-xs">Stay hydrated throughout the day</div>
                      </div>
                    </div>
                    <Switch
                      checked={settings.waterReminder}
                      onCheckedChange={(checked) => handleSettingChange('waterReminder', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-white" />
                      <div>
                        <Label className="text-white text-sm">Daily Check-in</Label>
                        <div className="text-white/70 text-xs">End of day progress reminder</div>
                      </div>
                    </div>
                    <Switch
                      checked={settings.dailyReminder}
                      onCheckedChange={(checked) => handleSettingChange('dailyReminder', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Reminder Times */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 space-y-4">
                <h4 className="text-white font-medium">Reminder Times</h4>
                
                <div className="space-y-2">
                  {settings.reminderTimes.map((time, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                      <span className="text-white text-sm">{time}</span>
                      <Button
                        onClick={() => handleRemoveReminderTime(time)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    type="time"
                    value={newReminderTime}
                    onChange={(e) => setNewReminderTime(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <Button
                    onClick={handleAddReminderTime}
                    disabled={!newReminderTime || settings.reminderTimes.includes(newReminderTime)}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 space-y-4">
                <h4 className="text-white font-medium">Advanced Settings</h4>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-white text-sm">Water Reminder Interval</Label>
                    <div className="text-white/70 text-xs mb-2">Hours between water reminders</div>
                    <select
                      value={settings.reminderInterval}
                      onChange={(e) => handleSettingChange('reminderInterval', parseInt(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    >
                      <option value={1}>Every hour</option>
                      <option value={2}>Every 2 hours</option>
                      <option value={3}>Every 3 hours</option>
                      <option value={4}>Every 4 hours</option>
                      <option value={6}>Every 6 hours</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white text-sm">Notification Sound</Label>
                      <div className="text-white/70 text-xs">Play sound with notifications</div>
                    </div>
                    <Switch
                      checked={settings.sound}
                      onCheckedChange={(checked) => handleSettingChange('sound', checked)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-blue-100 text-sm">
            <div className="font-medium mb-1">💡 Tip:</div>
            <p>
              Notifications help you stay consistent with your goals. Set reminder times that work best for your schedule, 
              and we'll gently nudge you to keep blooming! 🌸
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
