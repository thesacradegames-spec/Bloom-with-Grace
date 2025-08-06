import { useState, useEffect } from "react";
import { Trophy, Code, FileText, Brain, Github, Calendar, Sparkles } from "lucide-react";
import { BloomHeader } from "@/components/ui/bloom-header";
import { StatsCards } from "@/components/ui/stats-cards";
import { MainNavTabs } from "@/components/ui/main-nav-tabs";
import { GoalItem } from "@/components/ui/goal-item";
import { CalendarWidget } from "@/components/ui/calendar-widget";
import { WellnessSection } from "@/components/ui/wellness-section";
import { NextDayButton } from "@/components/ui/next-day-button";
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

  const handleUserNameChange = (newName: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    setUserName(newName);
    saveUserDisplayName(currentUser, newName);
  };

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
    setDashboardData(prev => ({
      ...prev,
      goals: prev.goals.map(goal =>
        goal.id === goalId && goal.current < goal.target
          ? { ...goal, current: goal.current + 1 }
          : goal
      )
    }));
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
    setDashboardData(prev => ({
      ...prev,
      waterIntake: Math.min(prev.waterIntake + 0.5, 10) // Max 10L
    }));
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
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600 relative overflow-hidden">
      {/* Optimized background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        {/* Reduced decorative circles */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-white/8 to-pink-300/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-300/15 to-blue-400/15 rounded-full blur-3xl"></div>

        {/* Reduced floating sparkles */}
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

      <BirthdayCelebration isActive={isBirthday} />
      <BirthdayPopup currentDate={currentDate} />
      <BloomHeader userName={userName} onUserNameChange={handleUserNameChange} />
      
      <main className="max-w-7xl mx-auto px-6 pb-12 relative z-10">
        {/* Enhanced Statistics Cards with better spacing */}
        <div className="mb-12">
          <StatsCards
            currentStreak={globalStats.currentStreak}
            longestStreak={globalStats.longestStreak}
            totalDays={globalStats.totalDays}
            perfectDays={globalStats.perfectDays}
            todaysTasks={todaysTasks}
            waterIntake={dashboardData.waterIntake}
          />
        </div>

        {/* Beautiful Navigation Tabs */}
        <MainNavTabs />

        {/* Enhanced Date and Next Day Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                {formatDateForDisplay(currentDate)}
              </h2>
            </div>
            <p className="text-white/90 text-sm font-medium">
              ✨ Ready to achieve your dreams today? ✨
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20 shadow-lg">
            <NextDayButton
              currentDate={currentDate}
              onNextDay={handleNextDay}
            />
          </div>
        </div>

        {/* Enhanced Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left Column - Goals and Wellness with better spacing */}
          <div className="lg:col-span-2 space-y-8">
            {/* Beautiful Goals Section */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-3 rounded-xl shadow-lg">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white drop-shadow-lg">Today's Goals</h2>
                  <p className="text-white/80 text-sm">Track your daily achievements</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {dashboardData.goals.map((goal, index) => (
                  <div
                    key={goal.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <GoalItem
                      id={goal.id}
                      icon={goal.icon}
                      title={goal.title}
                      current={goal.current}
                      target={goal.target}
                      onIncrement={handleGoalIncrement}
                      onDecrement={handleGoalDecrement}
                    />
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
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-xl">
              <WellnessSection
                waterIntake={dashboardData.waterIntake}
                targetWater={3}
                onWaterIncrement={handleWaterIncrement}
                onWaterDecrement={handleWaterDecrement}
              />
            </div>
          </div>

          {/* Right Column - Enhanced Calendar */}
          <div>
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-2 rounded-xl shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Progress Calendar</h3>
                  <p className="text-white/70 text-xs">Your journey overview</p>
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
