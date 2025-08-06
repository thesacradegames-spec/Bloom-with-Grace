import { useState, useEffect } from "react";
import { BloomHeader } from "@/components/ui/bloom-header";
import { MainNavTabs } from "@/components/ui/main-nav-tabs";
import { Calendar, Clock, CheckCircle, XCircle, Trophy, Target, Droplets, Code, Brain, Github, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportUserDataAsCSV } from "@/lib/export-utils";
import { getAllStoredDates, getDayProgress, getMonthProgress, DayProgress } from "@/lib/data-utils";
import {
  getCurrentUser,
  getUserMonthProgress,
  loadUserDisplayName,
  saveUserDisplayName
} from "@/lib/user-data-utils";

interface DayRecord {
  date: string;
  goals: { id: string; title: string; completed: number; target: number; icon: string }[];
  waterIntake: number;
  completionRate: number;
  isPerfectDay: boolean;
}

const goalNames = ["Codeforces", "CodeChef", "LeetCode", "DSA Practice", "GitHub"];
const goalIcons = ["trophy", "trophy", "code", "brain", "github"];

export default function History() {
  const [userName, setUserName] = useState("diwakar");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [historyData, setHistoryData] = useState<DayRecord[]>([]);

  // Load real history data
  useEffect(() => {
    const loadHistoryData = () => {
      const currentUser = getCurrentUser();
      if (!currentUser) return;

      const monthProgress = getUserMonthProgress(currentUser, selectedYear, selectedMonth);

      const data: DayRecord[] = monthProgress.map(progress => {
        const goals = progress.data?.goalData.map((goal, index) => ({
          id: goal.id,
          title: goalNames[index] || `Goal ${index + 1}`,
          completed: goal.current,
          target: goal.target,
          icon: goalIcons[index] || "target"
        })) || [];

        return {
          date: progress.date,
          goals,
          waterIntake: progress.waterIntake,
          completionRate: progress.completionRate,
          isPerfectDay: progress.isPerfectDay
        };
      });

      setHistoryData(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    loadHistoryData();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const displayName = loadUserDisplayName(currentUser);
    setUserName(displayName);
  }, []);


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return <Trophy className="w-4 h-4 text-yellow-600" />;
      case 'code': return <Code className="w-4 h-4 text-blue-600" />;
      case 'brain': return <Brain className="w-4 h-4 text-pink-600" />;
      case 'github': return <Github className="w-4 h-4 text-gray-700" />;
      case 'target': return <Target className="w-4 h-4 text-purple-600" />;
      default: return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredData = historyData.filter(record => {
    const date = new Date(record.date);
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  });

  const perfectDaysCount = filteredData.filter(record => record.isPerfectDay).length;
  const averageCompletion = Math.round(filteredData.reduce((sum, record) => sum + record.completionRate, 0) / filteredData.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600 dark:from-black dark:via-purple-900 dark:to-purple-800 transition-colors duration-500">
      <BloomHeader userName={userName} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
        {/* Navigation Tabs */}
        <MainNavTabs />

        {/* Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">Progress History</h1>
            <Button
              onClick={() => exportUserDataAsCSV('monthly')}
              className="self-start bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white border border-white/30 backdrop-blur-sm text-sm sm:text-base"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Export Month
            </Button>
          </div>

          {/* Month/Year Selector - Mobile Optimized */}
          <div className="flex gap-2 sm:gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-2 py-1.5 sm:px-4 sm:py-2 bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/40 text-gray-900 font-medium text-sm sm:text-base"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(2024, i).toLocaleDateString('en-US', { month: 'short' })}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-2 py-1.5 sm:px-4 sm:py-2 bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/40 text-gray-900 font-medium text-sm sm:text-base"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
          </div>
        </div>

        {/* Summary Stats - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-white/40">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              <span className="text-xs sm:text-sm text-gray-600 font-medium">Days Tracked</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{filteredData.length}</div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-white/40">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
              <span className="text-xs sm:text-sm text-gray-600 font-medium">Perfect Days</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{perfectDaysCount}</div>
            <div className="text-xs text-gray-500">
              {filteredData.length > 0 ? Math.round((perfectDaysCount / filteredData.length) * 100) : 0}% success rate
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-white/40 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              <span className="text-xs sm:text-sm text-gray-600 font-medium">Avg Completion</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{averageCompletion || 0}%</div>
          </div>
        </div>

        {/* History Timeline */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/40">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
            <Clock className="w-6 h-6 text-purple-500" />
            Daily Progress Timeline
          </h2>
          
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No data for selected period</h3>
              <p className="text-gray-500">Start tracking your goals to see your progress here!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredData.slice().reverse().map((record) => (
                <div key={record.date} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${record.isPerfectDay ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <h3 className="font-semibold text-gray-900">{formatDate(record.date)}</h3>
                      {record.isPerfectDay && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Perfect Day!
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      {record.completionRate}% completion
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    {record.goals.map((goal) => (
                      <div key={goal.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        {getIconComponent(goal.icon)}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-gray-700 truncate">{goal.title}</div>
                          <div className="text-xs text-gray-500">
                            {goal.completed}/{goal.target}
                          </div>
                        </div>
                        {goal.completed >= goal.target ? (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                    
                    {/* Water Intake */}
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Droplets className="w-4 h-4 text-cyan-500" />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-700">Water</div>
                        <div className="text-xs text-gray-500">{record.waterIntake}L</div>
                      </div>
                      {record.waterIntake >= 3 ? (
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
