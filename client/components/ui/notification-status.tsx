import { useState, useEffect } from "react";
import { Bell, BellOff, AlertCircle } from "lucide-react";
import { getNotificationStatus, getNotificationSettings, canShowNotifications } from "@/lib/notification-utils";
import { getCurrentUser } from "@/lib/user-data-utils";

export function NotificationStatus() {
  const [status, setStatus] = useState(() => getNotificationStatus());
  const [userSettings, setUserSettings] = useState(() => {
    const user = getCurrentUser();
    return user ? getNotificationSettings(user) : null;
  });

  useEffect(() => {
    const checkStatus = () => {
      setStatus(getNotificationStatus());
      const user = getCurrentUser();
      if (user) {
        setUserSettings(getNotificationSettings(user));
      }
    };

    // Check status periodically
    const interval = setInterval(checkStatus, 5000);
    
    // Listen for storage changes to notification settings
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes('notifications')) {
        checkStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const getStatusIcon = () => {
    if (status === 'granted' && userSettings?.enabled) {
      return <Bell className="w-4 h-4 text-green-400" />;
    } else if (status === 'denied') {
      return <BellOff className="w-4 h-4 text-red-400" />;
    } else if (status === 'unsupported') {
      return <AlertCircle className="w-4 h-4 text-gray-400" />;
    } else {
      return <BellOff className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusText = () => {
    if (status === 'granted' && userSettings?.enabled) {
      return 'Notifications active';
    } else if (status === 'denied') {
      return 'Notifications blocked';
    } else if (status === 'unsupported') {
      return 'Not supported';
    } else {
      return 'Notifications disabled';
    }
  };

  const getStatusColor = () => {
    if (status === 'granted' && userSettings?.enabled) {
      return 'bg-green-500/20 border-green-400/30';
    } else if (status === 'denied') {
      return 'bg-red-500/20 border-red-400/30';
    } else {
      return 'bg-yellow-500/20 border-yellow-400/30';
    }
  };

  if (!userSettings) return null;

  return (
    <div 
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm border transition-all duration-300 ${getStatusColor()}`}
      title={getStatusText()}
    >
      {getStatusIcon()}
      <span className="text-xs font-medium text-white/90 hidden sm:inline">
        {status === 'granted' && userSettings?.enabled ? 'ON' : 'OFF'}
      </span>
    </div>
  );
}
