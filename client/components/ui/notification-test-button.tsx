import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "./button";
import { showNotification, requestNotificationPermission, canShowNotifications } from "@/lib/notification-utils";

export function NotificationTestButton() {
  const [lastNotificationTime, setLastNotificationTime] = useState<number>(0);
  const [isRequesting, setIsRequesting] = useState(false);

  const handleTestNotification = async () => {
    // Prevent spam (max 1 notification per 3 seconds)
    const now = Date.now();
    if (now - lastNotificationTime < 3000) {
      return;
    }

    if (!canShowNotifications()) {
      setIsRequesting(true);
      const granted = await requestNotificationPermission();
      setIsRequesting(false);
      
      if (!granted) {
        alert('Please enable notifications in your browser settings to test this feature.');
        return;
      }
    }

    const messages = [
      {
        title: "🌸 Goal Reminder",
        body: "Don't forget to work on your coding practice! You're doing great! 💪"
      },
      {
        title: "💧 Hydration Time",
        body: "Time for some water! Stay hydrated to keep blooming! 🌺"
      },
      {
        title: "⭐ Daily Check-in",
        body: "How's your progress today? Remember, every small step counts! ✨"
      },
      {
        title: "🎯 Achievement Unlocked",
        body: "Congratulations! You've completed another goal. Keep up the amazing work! 🎉"
      }
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    showNotification(randomMessage.title, {
      body: randomMessage.body,
      icon: '/favicon.ico',
      tag: 'test-notification'
    });

    setLastNotificationTime(now);
  };

  return (
    <Button
      onClick={handleTestNotification}
      disabled={isRequesting}
      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-none"
      size="sm"
    >
      {isRequesting ? (
        <>
          <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mr-2" />
          Requesting...
        </>
      ) : canShowNotifications() ? (
        <>
          <Check className="w-3 h-3 mr-2" />
          Test Notification
        </>
      ) : (
        <>
          <Bell className="w-3 h-3 mr-2" />
          Enable & Test
        </>
      )}
    </Button>
  );
}
