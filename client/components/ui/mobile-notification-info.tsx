import { useState } from "react";
import { AlertTriangle, Info, Smartphone, Wifi, WifiOff, MessageSquare, Mail, Phone, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./button";

export function MobileNotificationInfo() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-4 space-y-4">
      <div className="flex items-start gap-3">
        <Smartphone className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-amber-100 mb-1">📱 Mobile Notifications - Important Info</div>
          <p className="text-amber-100/80 text-sm leading-relaxed">
            Browser notifications only work when the app is <strong>open or in background</strong>. 
            When closed, you won't receive notifications.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/20 flex-shrink-0"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* How Browser Notifications Work */}
          <div className="bg-amber-500/5 rounded-lg p-3 space-y-3">
            <h4 className="text-amber-100 font-medium text-sm flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              When Notifications Work
            </h4>
            <ul className="text-amber-100/80 text-xs space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>App is open in browser tab</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>App is running in background tab</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Browser is open (even if tab is not active)</span>
              </li>
            </ul>
          </div>

          <div className="bg-red-500/10 rounded-lg p-3 space-y-3">
            <h4 className="text-red-200 font-medium text-sm flex items-center gap-2">
              <WifiOff className="w-4 h-4" />
              When Notifications DON'T Work
            </h4>
            <ul className="text-red-200/80 text-xs space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">✗</span>
                <span>Browser is completely closed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">✗</span>
                <span>Phone is locked (on most mobile browsers)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">✗</span>
                <span>App is cleared from recent apps</span>
              </li>
            </ul>
          </div>

          {/* Alternative Solutions */}
          <div className="bg-blue-500/10 rounded-lg p-3 space-y-3">
            <h4 className="text-blue-200 font-medium text-sm flex items-center gap-2">
              <Info className="w-4 h-4" />
              Alternative Reminder Options
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded">
                <Phone className="w-3 h-3 text-green-400" />
                <span className="text-blue-100/80">Set phone alarms</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded">
                <MessageSquare className="w-3 h-3 text-blue-400" />
                <span className="text-blue-100/80">Calendar reminders</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded">
                <Mail className="w-3 h-3 text-purple-400" />
                <span className="text-blue-100/80">Email reminders</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded">
                <Smartphone className="w-3 h-3 text-pink-400" />
                <span className="text-blue-100/80">Install as PWA</span>
              </div>
            </div>
          </div>

          {/* Install as PWA Instructions */}
          <div className="bg-purple-500/10 rounded-lg p-3 space-y-3">
            <h4 className="text-purple-200 font-medium text-sm flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              💡 Pro Tip: Install as App (PWA)
            </h4>
            <div className="text-purple-100/80 text-xs space-y-2">
              <p>For better notification support, install this as an app:</p>
              <div className="bg-white/5 rounded p-2 space-y-1">
                <div><strong>📱 iPhone/iPad:</strong> Safari → Share → "Add to Home Screen"</div>
                <div><strong>🤖 Android:</strong> Chrome → Menu → "Add to Home Screen"</div>
                <div><strong>💻 Desktop:</strong> Chrome → Address bar → Install icon</div>
              </div>
              <p className="text-purple-100/60">
                <em>Installing as an app may improve notification delivery when the app is closed.</em>
              </p>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-green-500/10 rounded-lg p-3 space-y-3">
            <h4 className="text-green-200 font-medium text-sm">🌟 Best Practices for Consistent Reminders</h4>
            <ul className="text-green-100/80 text-xs space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">•</span>
                <span>Keep the browser tab open in background</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">•</span>
                <span>Set phone alarms as backup reminders</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">•</span>
                <span>Check the app regularly throughout the day</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">•</span>
                <span>Install as PWA for better notification support</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
