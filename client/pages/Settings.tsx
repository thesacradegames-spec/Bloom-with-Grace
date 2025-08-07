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
import { getUserCharacter, saveUserCharacter } from "@/lib/character-utils";
import { CUTE_CHARACTERS, Character } from "@/lib/characters";
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
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CUTE_CHARACTERS[0]);
  const [goals, setGoals] = useState<Goal[]>(DEFAULT_GOALS);
  const [notifications, setNotifications] = useState(true);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", icon: "🎯", target: 1 });
  const [hasChanges, setHasChanges] = useState(false);
  const [exportStats, setExportStats] = useState<{
    totalDays: number;
    dateRange: { start: string; end: string } | null;
    perfectDays: number;
    averageCompletion: number;
  } | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }

    setUserName(currentUser);
    setDisplayName(loadUserDisplayName(currentUser));
    setSelectedCharacter(getUserCharacter(currentUser));

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

    // Load export statistics
    setExportStats(getExportStats(currentUser));
  }, [navigate]);

  const handleSaveProfile = () => {
    if (!userName) return;

    saveUserDisplayName(userName, displayName);
    saveUserCharacter(selectedCharacter.id, userName);

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

  const handleExportJSON = () => {
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

  const handleExportCSV = (timeRange: 'all' | 'weekly' | 'monthly') => {
    exportUserDataAsCSV(timeRange, userName);
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
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600 dark:from-black dark:via-purple-900 dark:to-purple-800 relative overflow-hidden transition-colors duration-500">
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

      <BloomHeader userName={displayName} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12 relative z-10">
        {/* Page Title - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg">
                <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">Settings</h1>
                <p className="text-white/80 text-xs sm:text-sm">Customize your Her Daily Bloom experience</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Profile Settings - Mobile Responsive */}
          <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl animate-fade-in">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
                <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Profile</h2>
                <p className="text-white/70 text-xs sm:text-sm">Your personal information</p>
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

              <div>
                <Label className="text-white font-medium mb-2 sm:mb-3 block text-sm sm:text-base">
                  Profile Character 🎭
                </Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 max-h-36 sm:max-h-40 overflow-y-auto bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                  {CUTE_CHARACTERS.map((character) => (
                    <button
                      key={character.id}
                      type="button"
                      onClick={() => {
                        setSelectedCharacter(character);
                        setHasChanges(true);
                      }}
                      className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 border-2 ${
                        selectedCharacter.id === character.id
                          ? `border-white/60 bg-gradient-to-r ${character.color} shadow-lg scale-105`
                          : 'border-white/20 bg-white/10 hover:bg-white/20 hover:scale-105'
                      }`}
                    >
                      <div className="text-lg sm:text-xl lg:text-2xl mb-0.5 sm:mb-1">{character.emoji}</div>
                      <div className="text-white text-xs font-medium">{character.name}</div>
                    </button>
                  ))}
                </div>
                <p className="text-white/70 text-xs mt-2">
                  Selected: {selectedCharacter.name} - {selectedCharacter.description} ✨
                </p>
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

          {/* Notification Settings - Mobile Responsive */}
          <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl animate-fade-in"
               style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-green-400 to-blue-400 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Notifications</h2>
                <p className="text-white/70 text-xs sm:text-sm">Manage your alerts</p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-white/10 rounded-xl border border-white/20">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm sm:text-base">Daily Reminders</p>
                  <p className="text-white/70 text-xs sm:text-sm">Get reminded to track your goals</p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={handleNotificationsChange}
                  className="ml-3"
                />
              </div>
            </div>
          </div>

          {/* Goal Management - Mobile Responsive */}
          <div className="lg:col-span-2 glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl animate-fade-in"
               style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Goals Management</h2>
                  <p className="text-white/70 text-xs sm:text-sm">Add, edit, or remove your daily goals</p>
                </div>
              </div>
              
              <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white border border-white/30 text-sm sm:text-base px-3 sm:px-4 py-2">
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Add Goal</span>
                    <span className="sm:hidden">Add</span>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {goals.map(goal => (
                <div key={goal.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3">
                    <span className="text-xl sm:text-2xl">{goal.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm sm:text-base truncate">{goal.title}</h3>
                      <p className="text-white/70 text-xs sm:text-sm">Daily target: {goal.target}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateGoalTarget(goal.id, goal.target - 1)}
                      className="text-white border-white/30 hover:bg-white/10 h-8 w-8 p-0 sm:h-9 sm:w-9"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-white font-medium px-2 text-sm sm:text-base min-w-[2rem] text-center">{goal.target}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateGoalTarget(goal.id, goal.target + 1)}
                      className="text-white border-white/30 hover:bg-white/10 h-8 w-8 p-0 sm:h-9 sm:w-9"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="ml-auto h-8 w-8 p-0 sm:h-9 sm:w-9"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Save Changes Button for Goals - Mobile Responsive */}
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  // Goals are automatically saved when modified, this is for user feedback
                  alert('✨ Goal changes have been saved successfully! ✨');
                }}
                className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-sm sm:text-base w-full sm:w-auto"
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                Save Goal Changes ✅
              </Button>
            </div>
          </div>

          {/* Data Management - Mobile Responsive */}
          <div className="lg:col-span-2 glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl animate-fade-in"
               style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-red-400 to-pink-400 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
                <Download className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Data Management</h2>
                <p className="text-white/70 text-xs sm:text-sm">Export or clear your data</p>
              </div>
            </div>

            {/* Export Statistics - Mobile Responsive */}
            {exportStats && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-white/20">
                <h3 className="text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base">📊 Your Data Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
                  <div>
                    <div className="text-white text-base sm:text-lg font-bold">{exportStats.totalDays}</div>
                    <div className="text-white/70 text-xs">Total Days</div>
                  </div>
                  <div>
                    <div className="text-white text-base sm:text-lg font-bold">{exportStats.perfectDays}</div>
                    <div className="text-white/70 text-xs">Perfect Days</div>
                  </div>
                  <div>
                    <div className="text-white text-base sm:text-lg font-bold">{exportStats.averageCompletion}%</div>
                    <div className="text-white/70 text-xs">Avg Completion</div>
                  </div>
                  <div>
                    <div className="text-white text-base sm:text-lg font-bold">
                      {exportStats.dateRange ?
                        `${Math.ceil((new Date(exportStats.dateRange.end).getTime() - new Date(exportStats.dateRange.start).getTime()) / (1000 * 60 * 60 * 24)) + 1}`
                        : '0'}
                    </div>
                    <div className="text-white/70 text-xs">Day Range</div>
                  </div>
                </div>
              </div>
            )}

            {/* Export Options - Mobile Responsive */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base">📊 Export as CSV</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  <Button
                    onClick={() => handleExportCSV('weekly')}
                    className="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white text-sm sm:text-base py-2 sm:py-3"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Last Week
                  </Button>
                  <Button
                    onClick={() => handleExportCSV('monthly')}
                    className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white text-sm sm:text-base py-2 sm:py-3"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Last Month
                  </Button>
                  <Button
                    onClick={() => handleExportCSV('all')}
                    className="bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500 text-white text-sm sm:text-base py-2 sm:py-3"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    All Data
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base">🗂️ Other Options</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  <Button
                    onClick={handleExportJSON}
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white text-sm sm:text-base py-2 sm:py-3"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Export JSON
                  </Button>

                  <Button
                    onClick={handleClearAllData}
                    variant="destructive"
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-sm sm:text-base py-2 sm:py-3"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Clear All Data
                  </Button>

                  <Button
                    onClick={handleSignOut}
                    className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white text-sm sm:text-base py-2 sm:py-3"
                  >
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
