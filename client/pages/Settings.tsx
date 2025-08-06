import { useState, useEffect } from "react";
import { 
  Settings as SettingsIcon, 
  User, 
  Target, 
  Bell, 
  Download, 
  Trash2, 
  LogOut, 
  Plus, 
  Minus,
  Calendar,
  Sparkles,
  Save,
  AlertTriangle
} from "lucide-react";
import { BloomHeader } from "@/components/ui/bloom-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getCurrentUser, getAllUsers, saveUserDisplayName, loadUserDisplayName } from "@/lib/user-data-utils";
import { getUserBirthday, saveUserBirthday, formatBirthday } from "@/lib/birthday-utils";
import { exportUserDataAsCSV, getExportStats } from "@/lib/export-utils";
import { useNavigate } from "react-router-dom";

interface Goal {
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

const AVAILABLE_ICONS = ["🎯", "💻", "📚", "🏃‍♀️", "🎨", "🎵", "📝", "🍎", "💧", "🧘‍♀️", "🏆", "⭐", "🌟", "💎", "🔥"];

export default function Settings() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [goals, setGoals] = useState<Goal[]>(DEFAULT_GOALS);
  const [notifications, setNotifications] = useState(true);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", icon: "🎯", target: 1 });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }

    setUserName(currentUser);
    setDisplayName(loadUserDisplayName(currentUser));
    
    const userBirthday = getUserBirthday(currentUser);
    if (userBirthday) {
      setBirthday(userBirthday);
    }

    // Load notifications preference
    const notifPref = localStorage.getItem(`bloom-user-${currentUser.toLowerCase().replace(/\s+/g, '-')}-notifications`);
    setNotifications(notifPref !== 'false');

    // Load custom goals (if any)
    const savedGoals = localStorage.getItem(`bloom-user-${currentUser.toLowerCase().replace(/\s+/g, '-')}-goals`);
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch {
        setGoals(DEFAULT_GOALS);
      }
    }
  }, [navigate]);

  const handleSaveProfile = () => {
    if (!userName) return;

    saveUserDisplayName(userName, displayName);
    
    if (birthday) {
      saveUserBirthday(userName, birthday);
    }

    setHasChanges(false);
  };

  const handleAddGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal: Goal = {
      id: newGoal.title.toLowerCase().replace(/\s+/g, '-'),
      title: newGoal.title.trim(),
      icon: newGoal.icon,
      target: newGoal.target
    };

    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
    
    setNewGoal({ title: "", icon: "🎯", target: 1 });
    setIsAddingGoal(false);
  };

  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const handleUpdateGoalTarget = (goalId: string, newTarget: number) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, target: Math.max(1, newTarget) } : goal
    );
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const saveGoals = (updatedGoals: Goal[]) => {
    if (!userName) return;
    const key = `bloom-user-${userName.toLowerCase().replace(/\s+/g, '-')}-goals`;
    localStorage.setItem(key, JSON.stringify(updatedGoals));
  };

  const handleNotificationsChange = (enabled: boolean) => {
    setNotifications(enabled);
    if (!userName) return;
    const key = `bloom-user-${userName.toLowerCase().replace(/\s+/g, '-')}-notifications`;
    localStorage.setItem(key, enabled ? 'true' : 'false');
  };

  const handleExportData = () => {
    if (!userName) return;

    // Collect all user data
    const userData = {
      profile: {
        username: userName,
        displayName,
        birthday
      },
      settings: {
        notifications,
        goals
      },
      data: []
    };

    // Collect daily data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`bloom-user-${userName.toLowerCase().replace(/\s+/g, '-')}-data-`)) {
        const date = key.replace(`bloom-user-${userName.toLowerCase().replace(/\s+/g, '-')}-data-`, '');
        const dayData = localStorage.getItem(key);
        if (dayData) {
          try {
            userData.data.push({
              date,
              data: JSON.parse(dayData)
            });
          } catch (e) {
            console.error('Error parsing day data:', e);
          }
        }
      }
    }

    // Create and download file
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `her-daily-bloom-${userName}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearAllData = () => {
    if (!userName) return;
    
    const confirmed = window.confirm(
      "⚠️ Are you absolutely sure you want to clear ALL your data?\n\nThis will permanently delete:\n• All your daily progress\n• Goal history\n• Analytics data\n• Settings\n\nThis action cannot be undone!"
    );
    
    if (!confirmed) return;

    // Clear all user data
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`bloom-user-${userName.toLowerCase().replace(/\s+/g, '-')}-`)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    alert("✅ All data has been cleared successfully.");
    navigate('/');
  };

  const handleSignOut = () => {
    localStorage.removeItem('bloom-current-user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-white/8 to-pink-300/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-300/15 to-blue-400/15 rounded-full blur-3xl"></div>
        
        {[...Array(5)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-white/8"
            style={{
              left: `${20 + i * 20}%`,
              top: `${20 + i * 15}%`,
              fontSize: '12px',
            }}
          />
        ))}
      </div>

      <BloomHeader userName={displayName} onUserNameChange={setDisplayName} />
      
      <main className="max-w-4xl mx-auto px-6 pb-12 relative z-10">
        {/* Page Title */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-3 rounded-xl shadow-lg">
                <SettingsIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">Settings</h1>
                <p className="text-white/80 text-sm">Customize your Her Daily Bloom experience</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-2 rounded-xl shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Profile</h2>
                <p className="text-white/70 text-sm">Your personal information</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName" className="text-white font-medium">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    setHasChanges(true);
                  }}
                  className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white/40 focus:ring-white/20"
                  placeholder="Enter your display name"
                />
              </div>

              <div>
                <Label htmlFor="birthday" className="text-white font-medium">Birthday</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-white/60" />
                  <Input
                    id="birthday"
                    type="date"
                    value={birthday}
                    onChange={(e) => {
                      setBirthday(e.target.value);
                      setHasChanges(true);
                    }}
                    className="bg-white/10 border-white/20 text-white focus:border-white/40 focus:ring-white/20 [&::-webkit-calendar-picker-indicator]:invert"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {birthday && (
                  <p className="text-white/70 text-xs mt-1">
                    Your birthday: {formatBirthday(birthday)} 🎂
                  </p>
                )}
              </div>

              {hasChanges && (
                <Button
                  onClick={handleSaveProfile}
                  className="w-full bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              )}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-green-400 to-blue-400 p-2 rounded-xl shadow-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Notifications</h2>
                <p className="text-white/70 text-sm">Manage your alerts</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/20">
                <div>
                  <p className="text-white font-medium">Daily Reminders</p>
                  <p className="text-white/70 text-sm">Get reminded to track your goals</p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={handleNotificationsChange}
                />
              </div>
            </div>
          </div>

          {/* Goal Management */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-xl shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Goals Management</h2>
                  <p className="text-white/70 text-sm">Add, edit, or remove your daily goals</p>
                </div>
              </div>
              
              <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white border border-white/30">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gradient-to-br from-pink-100 to-purple-100 border-none">
                  <DialogHeader>
                    <DialogTitle className="text-gray-800">Add New Goal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="goalTitle">Goal Title</Label>
                      <Input
                        id="goalTitle"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter goal name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="goalIcon">Icon</Label>
                      <div className="grid grid-cols-8 gap-2 mt-2">
                        {AVAILABLE_ICONS.map(icon => (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => setNewGoal(prev => ({ ...prev, icon }))}
                            className={`p-2 rounded-lg text-xl hover:bg-gray-200 transition-colors ${
                              newGoal.icon === icon ? 'bg-gray-200 ring-2 ring-purple-500' : ''
                            }`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="goalTarget">Daily Target</Label>
                      <Input
                        id="goalTarget"
                        type="number"
                        min="1"
                        value={newGoal.target}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, target: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddGoal} className="flex-1">
                        Add Goal
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingGoal(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {goals.map(goal => (
                <div key={goal.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{goal.title}</h3>
                      <p className="text-white/70 text-sm">Daily target: {goal.target}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateGoalTarget(goal.id, goal.target - 1)}
                      className="text-white border-white/30 hover:bg-white/10"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-white font-medium px-2">{goal.target}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateGoalTarget(goal.id, goal.target + 1)}
                      className="text-white border-white/30 hover:bg-white/10"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="ml-auto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Management */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-red-400 to-pink-400 p-2 rounded-xl shadow-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Data Management</h2>
                <p className="text-white/70 text-sm">Export or clear your data</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <Button
                onClick={handleExportData}
                className="bg-gradient-to-r from-blue-400 to-green-400 hover:from-blue-500 hover:to-green-500 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              
              <Button
                onClick={handleClearAllData}
                variant="destructive"
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
              
              <Button
                onClick={handleSignOut}
                className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
