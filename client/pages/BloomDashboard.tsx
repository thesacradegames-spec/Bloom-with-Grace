import { useState, useEffect } from "react";
import { Trophy, Code, FileText, Brain, Github, Calendar, Sparkles, Target } from "lucide-react";
import { BloomHeader } from "@/components/ui/bloom-header";
import { StatsCards } from "@/components/ui/stats-cards";
import { CalendarWidget } from "@/components/ui/calendar-widget";
import { CompleteDayButton } from "@/components/ui/complete-day-button";
import { BirthdayPopup } from "@/components/ui/birthday-popup";
import { BirthdayCelebration } from "@/components/ui/birthday-celebration";
import { getCurrentLocalDate, addDaysToDateString, formatDateForDisplay } from "@/lib/date-utils";
import { isTodayUsersBirthday } from "@/lib/birthday-utils";
import { getUserGoals } from "@/lib/goal-utils";
import { calculateGlobalStats, GlobalStats } from "@/lib/stats-utils";
import {
  getCurrentUser,
  saveUserDayData,
  loadUserDayData,
  calculateUserGlobalStats,
  saveUserDisplayName,
  loadUserDisplayName
} from "@/lib/user-data-utils";

interface Goal {
  id: string;
  title: string;
  icon: React.ReactNode;
  current: number;
  target: number;
}

interface SerializableGoalData {
  id: string;
  current: number;
  target: number;
}

interface SerializableDashboardData {
  waterIntake: number;
  goalData: SerializableGoalData[];
}

interface DashboardData {
  waterIntake: number;
  goals: Goal[];
}

// Icon mapping for goals
const getGoalIcon = (iconString: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    '🏆': <Trophy className="w-6 h-6 text-yellow-500" />,
    '🥇': <Trophy className="w-6 h-6 text-orange-500" />,
    '💻': <Code className="w-6 h-6 text-blue-500" />,
    '🧠': <Brain className="w-6 h-6 text-pink-500" />,
    '📂': <Github className="w-6 h-6 text-gray-700" />,
    '🎯': <Target className="w-6 h-6 text-purple-500" />,
    '⭐': <Sparkles className="w-6 h-6 text-yellow-400" />,
  };
  return iconMap[iconString] || <Target className="w-6 h-6 text-gray-500" />;
};

export default function BloomDashboard() {
  const [currentDate, setCurrentDate] = useState(getCurrentLocalDate());
  const [userName, setUserName] = useState("");
  const [isBirthday, setIsBirthday] = useState(false);
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalDays: 0,
    perfectDays: 0
  });
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    waterIntake: 0,
    goals: []
  });

  // Load data from localStorage
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return; // Protected route will handle redirect
    }

    // Set username and load display name
    const displayName = loadUserDisplayName(currentUser);
    setUserName(displayName);

    // Check if today is user's birthday
    setIsBirthday(isTodayUsersBirthday(currentDate, currentUser));

    // Load global stats for this user
    const globalStatsData = calculateUserGlobalStats(currentUser);
    setGlobalStats(globalStatsData);

    // Load user's custom goals
    const userGoals = getUserGoals(currentUser);

    // Load daily data for this user
    const savedData = loadUserDayData(currentUser, currentDate);
    if (savedData) {
      // Merge saved goal data with user's current goal configuration
      const updatedGoals = userGoals.map(userGoal => {
        const savedGoal = savedData.goalData?.find(g => g.id === userGoal.id);
        return {
          id: userGoal.id,
          title: userGoal.title,
          icon: getGoalIcon(userGoal.icon),
          current: savedGoal?.current || 0,
          target: userGoal.target
        };
      });

      setDashboardData({
        waterIntake: savedData.waterIntake || 0,
        goals: updatedGoals
      });
    } else {
      // Reset to user's goals for new day
      const newGoals = userGoals.map(userGoal => ({
        id: userGoal.id,
        title: userGoal.title,
        icon: getGoalIcon(userGoal.icon),
        current: 0,
        target: userGoal.target
      }));

      setDashboardData({
        waterIntake: 0,
        goals: newGoals
      });
    }

  }, [currentDate]);

  // Note: Removed problematic notifications useEffect that was causing infinite loops
  // Goal and water reminders are now only created during manual actions (increment/decrement)

  // Listen for goal changes from settings
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      const currentUser = getCurrentUser();
      if (!currentUser) return;

      // Check if goals were updated
      if (e.key === `bloom-user-${currentUser.toLowerCase().replace(/\s+/g, '-')}-goals`) {
        // Reload goals when they change in settings
        const userGoals = getUserGoals(currentUser);
        const savedData = loadUserDayData(currentUser, currentDate);

        if (savedData) {
          const updatedGoals = userGoals.map(userGoal => {
            const savedGoal = savedData.goalData?.find(g => g.id === userGoal.id);
            return {
              id: userGoal.id,
              title: userGoal.title,
              icon: getGoalIcon(userGoal.icon),
              current: savedGoal?.current || 0,
              target: userGoal.target
            };
          });

          setDashboardData(prev => ({
            ...prev,
            goals: updatedGoals
          }));
        } else {
          const newGoals = userGoals.map(userGoal => ({
            id: userGoal.id,
            title: userGoal.title,
            icon: getGoalIcon(userGoal.icon),
            current: 0,
            target: userGoal.target
          }));

          setDashboardData(prev => ({
            ...prev,
            goals: newGoals
          }));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentDate]);

  // Save daily data to localStorage and recalculate global stats
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const serializableData: SerializableDashboardData = {
      waterIntake: dashboardData.waterIntake,
      goalData: dashboardData.goals.map(goal => ({
        id: goal.id,
        current: goal.current,
        target: goal.target
      }))
    };
    
    saveUserDayData(currentUser, currentDate, serializableData);
    
    // Recalculate global stats whenever daily data changes
    const updatedGlobalStats = calculateUserGlobalStats(currentUser);
    setGlobalStats(updatedGlobalStats);
  }, [dashboardData, currentDate]);


  const handleNextDay = () => {
    // Move to next day using proper date utility
    const nextDateString = addDaysToDateString(currentDate, 1);
    setCurrentDate(nextDateString);
    
    // Global stats will be recalculated automatically when currentDate changes
  };

  const handleDateSelect = (selectedDate: string) => {
    setCurrentDate(selectedDate);
  };

  const handleGoalIncrement = (goalId: string) => {
    setDashboardData(prev => {
      const updatedGoals = prev.goals.map(goal => {
        if (goal.id === goalId && goal.current < goal.target) {
          const newCurrent = goal.current + 1;
          const updatedGoal = { ...goal, current: newCurrent };

          // Show notification when goal is completed
          if (newCurrent === goal.target) {
          }

          return updatedGoal;
        }
        return goal;
      });

      return {
        ...prev,
        goals: updatedGoals
      };
    });
  };

  const handleGoalDecrement = (goalId: string) => {
    setDashboardData(prev => ({
      ...prev,
      goals: prev.goals.map(goal =>
        goal.id === goalId && goal.current > 0
          ? { ...goal, current: goal.current - 1 }
          : goal
      )
    }));
  };

  const handleWaterIncrement = () => {
    setDashboardData(prev => {
      const newWaterIntake = Math.min(prev.waterIntake + 0.5, 10); // Max 10L

      // Show notification when water goal is reached
      if (newWaterIntake >= 3 && prev.waterIntake < 3) {
        const currentUser = getCurrentUser();
        if (currentUser) {
          const settings = getNotificationSettings(currentUser);
          if (settings.enabled && settings.waterReminder) {
            setTimeout(() => {
              showGoalReminder('Water Intake', newWaterIntake, 3);
            }, 500);
          }
        }
      }

      return {
        ...prev,
        waterIntake: newWaterIntake
      };
    });
  };

  const handleWaterDecrement = () => {
    setDashboardData(prev => ({
      ...prev,
      waterIntake: Math.max(prev.waterIntake - 0.5, 0)
    }));
  };

  const todaysTasks = dashboardData.goals.reduce((total, goal) => total + goal.current, 0);

  const handleCompleteDay = () => {
    // Mark the day as completed - this could trigger additional logic
    // like updating streaks, sending notifications, etc.
    console.log('Day completed!', {
      date: currentDate,
      goals: dashboardData.goals,
      waterIntake: dashboardData.waterIntake
    });

    // You could add additional completion logic here:
    // - Show a completion animation
    // - Update completion timestamps
    // - Calculate bonus points
    // - Send notifications
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600 dark:from-black dark:via-purple-900 dark:to-purple-800 relative overflow-hidden transition-colors duration-500">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        {/* Cute floating shapes */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-white/8 to-pink-300/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-300/15 to-blue-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Cute floating emojis */}
        {['🌸', '✨', '🦋', '🌺', '💖', '🌟', '🎀', '🌙'].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-white/20 text-xl animate-bounce"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 2)}s`
            }}
          >
            {emoji}
          </div>
        ))}

        {/* Floating sparkles */}
        {[...Array(8)].map((_, i) => (
          <Sparkles
            key={`sparkle-${i}`}
            className="absolute text-white/10 animate-pulse"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + i * 20}%`,
              fontSize: '14px',
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>

      <BirthdayCelebration isActive={isBirthday} />
      <BirthdayPopup currentDate={currentDate} />
      <BloomHeader userName={userName} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12 relative z-10">

        {/* Enhanced Statistics Cards with better spacing */}
        <div className="mb-8 sm:mb-12">
          <StatsCards
            currentStreak={globalStats.currentStreak}
            longestStreak={globalStats.longestStreak}
            totalDays={globalStats.totalDays}
            perfectDays={globalStats.perfectDays}
            todaysTasks={todaysTasks}
            waterIntake={dashboardData.waterIntake}
          />
        </div>

        {/* Enhanced Date and Next Day Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
          <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl animate-fade-in floating w-full sm:w-auto">
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white animate-pulse" />
              <h2 className="text-base sm:text-lg lg:text-2xl font-bold text-white drop-shadow-lg">
                {formatDateForDisplay(currentDate)}
              </h2>
              <span className="text-sm sm:text-base lg:text-lg animate-bounce">🌸</span>
            </div>
            <p className="text-white/90 text-xs sm:text-sm font-medium">
              ✨ Ready to bloom and achieve your dreams today? ✨
            </p>
          </div>

          <div className="glass-card rounded-xl sm:rounded-2xl p-2 shadow-xl animate-fade-in floating-delayed flex-shrink-0">
            <button
              onClick={handleNextDay}
              className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Next Day
            </button>
          </div>
        </div>

        {/* Enhanced Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {/* Left Column - Goals and Wellness with better spacing */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Beautiful Goals Section */}
            <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl animate-fade-in">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg animate-pulse">
                  <Trophy className="w-5 h-5 sm:w-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-lg flex items-center gap-1 sm:gap-2">
                    Today's Goals
                    <span className="text-sm sm:text-base lg:text-lg animate-bounce">🎯</span>
                  </h2>
                  <p className="text-white/80 text-xs sm:text-sm">Track your daily achievements and bloom! 🌺</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {dashboardData.goals.map((goal, index) => (
                  <div
                    key={goal.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{goal.icon}</span>
                          <div>
                            <h3 className="text-white font-medium">{goal.title}</h3>
                            <p className="text-white/70 text-sm">{goal.current}/{goal.target}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleGoalDecrement(goal.id)}
                            className="bg-white/20 hover:bg-white/30 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                          >
                            -
                          </button>
                          <span className="text-white font-bold min-w-[2rem] text-center">{goal.current}</span>
                          <button
                            onClick={() => handleGoalIncrement(goal.id)}
                            className="bg-white/20 hover:bg-white/30 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Complete Day Button */}
              <div className="mt-6">
                <CompleteDayButton
                  goals={dashboardData.goals}
                  waterIntake={dashboardData.waterIntake}
                  targetWater={3}
                  onComplete={handleCompleteDay}
                />
              </div>
            </div>

            {/* Enhanced Wellness Section */}
            <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="bg-gradient-to-r from-blue-400 to-cyan-400 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Wellness Track</h2>
                  <p className="text-white/80 text-xs sm:text-sm">Stay hydrated & healthy! 💧</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💧</span>
                    <div>
                      <h3 className="text-white font-medium">Water Intake</h3>
                      <p className="text-white/70 text-sm">{dashboardData.waterIntake}/3 glasses</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleWaterDecrement}
                      className="bg-white/20 hover:bg-white/30 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    >
                      -
                    </button>
                    <span className="text-white font-bold min-w-[2rem] text-center">{dashboardData.waterIntake}</span>
                    <button
                      onClick={handleWaterIncrement}
                      className="bg-white/20 hover:bg-white/30 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Calendar */}
          <div>
            <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-xl animate-fade-in floating" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg animate-pulse">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-1 sm:gap-2">
                    Progress Calendar
                    <span className="text-xs sm:text-sm animate-bounce">🗓️</span>
                  </h3>
                  <p className="text-white/70 text-xs">Your magical journey overview ✨</p>
                </div>
              </div>
              <CalendarWidget
                currentDate={currentDate}
                onDateSelect={handleDateSelect}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
