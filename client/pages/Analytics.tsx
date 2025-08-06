import { useState, useEffect } from "react";
import { BloomHeader } from "@/components/ui/bloom-header";
import { NavTabs } from "@/components/ui/nav-tabs";
import { TrendingUp, Target, Calendar, Award, BarChart3, PieChart } from "lucide-react";
import { getAllStoredDates, getDayProgress, DayProgress } from "@/lib/data-utils";
import { calculateGlobalStats } from "@/lib/stats-utils";
import {
  getCurrentUser,
  getUserStoredDates,
  getUserDayProgress,
  calculateUserGlobalStats,
  loadUserDisplayName,
  saveUserDisplayName
} from "@/lib/user-data-utils";

interface AnalyticsData {
  totalDaysTracked: number;
  averageCompletion: number;
  bestStreak: number;
  currentStreak: number;
  goalCompletionRates: { goal: string; rate: number; color: string }[];
  weeklyProgress: { day: string; completion: number }[];
  monthlyStats: { month: string; perfectDays: number; totalDays: number }[];
}

const goalNames = ["Codeforces", "CodeChef", "LeetCode", "DSA Practice", "GitHub"];
const goalColors = ["bg-yellow-500", "bg-orange-500", "bg-blue-500", "bg-pink-500", "bg-gray-600"];

export default function Analytics() {
  const [userName, setUserName] = useState("diwakar");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalDaysTracked: 0,
    averageCompletion: 0,
    bestStreak: 0,
    currentStreak: 0,
    goalCompletionRates: [],
    weeklyProgress: [],
    monthlyStats: []
  });

  // Calculate real analytics from stored data
  const calculateAnalytics = (): AnalyticsData => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        totalDaysTracked: 0,
        averageCompletion: 0,
        bestStreak: 0,
        currentStreak: 0,
        goalCompletionRates: [],
        weeklyProgress: [],
        monthlyStats: []
      };
    }

    const allDates = getUserStoredDates(currentUser);
    const allProgress = allDates.map(date => getUserDayProgress(currentUser, date)).filter(Boolean) as DayProgress[];

    if (allProgress.length === 0) {
      return {
        totalDaysTracked: 0,
        averageCompletion: 0,
        bestStreak: 0,
        currentStreak: 0,
        goalCompletionRates: [],
        weeklyProgress: [],
        monthlyStats: []
      };
    }

    // Calculate streaks
    const globalStats = calculateGlobalStats();
    const { currentStreak, longestStreak } = globalStats;

    // Calculate average completion
    const averageCompletion = Math.round(
      allProgress.reduce((sum, day) => sum + day.completionRate, 0) / allProgress.length
    );

    // Calculate goal completion rates
    const goalStats: { [key: string]: { completed: number; total: number } } = {};
    let waterCompleted = 0;
    let waterTotal = 0;

    allProgress.forEach(day => {
      if (day.data) {
        day.data.goalData.forEach((goal, index) => {
          const goalName = goalNames[index] || `Goal ${index + 1}`;
          if (!goalStats[goalName]) {
            goalStats[goalName] = { completed: 0, total: 0 };
          }
          goalStats[goalName].total++;
          if (goal.current >= goal.target) {
            goalStats[goalName].completed++;
          }
        });

        // Water intake
        waterTotal++;
        if (day.data.waterIntake >= 3) {
          waterCompleted++;
        }
      }
    });

    const goalCompletionRates = Object.entries(goalStats).map(([goal, stats], index) => ({
      goal,
      rate: Math.round((stats.completed / stats.total) * 100),
      color: goalColors[index] || "bg-gray-500"
    }));

    // Add water intake
    if (waterTotal > 0) {
      goalCompletionRates.push({
        goal: "Water Intake",
        rate: Math.round((waterCompleted / waterTotal) * 100),
        color: "bg-cyan-500"
      });
    }

    // Calculate weekly progress (last 7 days)
    const last7Days = allDates.slice(-7);
    const weeklyProgress = last7Days.map((date, index) => {
      const progress = getDayProgress(date);
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayOfWeek = new Date(date).getDay();

      return {
        day: dayNames[dayOfWeek],
        completion: progress ? progress.completionRate : 0
      };
    });

    // Calculate monthly stats (last 3 months)
    const monthlyStats: { month: string; perfectDays: number; totalDays: number }[] = [];
    const now = new Date();

    for (let i = 2; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = monthDate.toLocaleDateString('en-US', { month: 'long' });

      const monthDays = allProgress.filter(day => {
        const dayDate = new Date(day.date);
        return dayDate.getMonth() === monthDate.getMonth() &&
               dayDate.getFullYear() === monthDate.getFullYear();
      });

      const perfectDays = monthDays.filter(day => day.isPerfectDay).length;

      if (monthDays.length > 0) {
        monthlyStats.push({
          month: monthName,
          perfectDays,
          totalDays: monthDays.length
        });
      }
    }

    return {
      totalDaysTracked: allProgress.length,
      averageCompletion,
      bestStreak: longestStreak,
      currentStreak,
      goalCompletionRates,
      weeklyProgress,
      monthlyStats
    };
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const displayName = loadUserDisplayName(currentUser);
    setUserName(displayName);

    // Calculate analytics from real data
    setAnalyticsData(calculateAnalytics());
  }, []);

  const handleUserNameChange = (newName: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    setUserName(newName);
    saveUserDisplayName(currentUser, newName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600">
      <BloomHeader userName={userName} onUserNameChange={handleUserNameChange} />
      
      <main className="max-w-7xl mx-auto px-6 pb-8">
        {/* Navigation Tabs */}
        <NavTabs activeTab="analytics" onTabChange={() => {}} />

        <div className="space-y-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/40">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-blue-500" />
                <span className="text-sm text-gray-600">Days Tracked</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{analyticsData.totalDaysTracked}</div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/40">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-green-500" />
                <span className="text-sm text-gray-600">Avg Completion</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{analyticsData.averageCompletion}%</div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/40">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-6 h-6 text-yellow-500" />
                <span className="text-sm text-gray-600">Best Streak</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{analyticsData.bestStreak}</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/40">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-purple-500" />
                <span className="text-sm text-gray-600">Current Streak</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{analyticsData.currentStreak}</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
          </div>

          {/* Weekly Progress Chart */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/40">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-semibold text-gray-900">Weekly Progress</h3>
            </div>
            <div className="grid grid-cols-7 gap-4">
              {analyticsData.weeklyProgress.map((day) => (
                <div key={day.day} className="text-center">
                  <div className="text-sm font-medium text-gray-600 mb-2">{day.day}</div>
                  <div className="h-32 bg-gray-100 rounded-lg relative overflow-hidden">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-purple-500 rounded-lg transition-all duration-500"
                      style={{ height: `${day.completion}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{day.completion}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Goal Completion Rates */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/40">
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-semibold text-gray-900">Goal Completion Rates</h3>
            </div>
            <div className="space-y-4">
              {analyticsData.goalCompletionRates.map((goal) => (
                <div key={goal.goal} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium text-gray-700">{goal.goal}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${goal.color} transition-all duration-500`}
                      style={{ width: `${goal.rate}%` }}
                    />
                  </div>
                  <div className="w-12 text-sm font-semibold text-gray-900">{goal.rate}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Performance */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/40">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-purple-500" />
              <h3 className="text-xl font-semibold text-gray-900">Monthly Performance</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {analyticsData.monthlyStats.map((month) => (
                <div key={month.month} className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-lg font-semibold text-gray-900 mb-2">{month.month}</div>
                  <div className="text-3xl font-bold text-purple-600 mb-1">{month.perfectDays}</div>
                  <div className="text-sm text-gray-600">Perfect Days out of {month.totalDays}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.round((month.perfectDays / month.totalDays) * 100)}% Success Rate
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
