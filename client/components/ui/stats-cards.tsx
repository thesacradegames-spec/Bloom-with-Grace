import { Flame, Trophy, Calendar, Target, CheckCircle, Droplets } from "lucide-react";

interface StatsCardsProps {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  perfectDays: number;
  todaysTasks: number;
  waterIntake: number;
}

export function StatsCards({
  currentStreak = 0,
  longestStreak = 0,
  totalDays = 0,
  perfectDays = 0,
  todaysTasks = 0,
  waterIntake = 0
}: StatsCardsProps) {
  const stats = [
    {
      icon: Flame,
      label: "Current\nStreak",
      value: currentStreak,
      unit: "days",
      iconColor: "text-orange-500 dark:text-orange-400",
      bgGradient: "from-orange-100/90 to-red-100/90 dark:from-orange-900/40 dark:to-red-900/40",
      borderColor: "border-orange-200/70 dark:border-orange-400/30",
      shadowColor: "shadow-orange-100/50 dark:shadow-orange-900/30",
      emoji: "🔥"
    },
    {
      icon: Trophy,
      label: "Longest\nStreak",
      value: longestStreak,
      unit: "days",
      iconColor: "text-yellow-500 dark:text-yellow-400",
      bgGradient: "from-yellow-100/90 to-amber-100/90 dark:from-yellow-900/40 dark:to-amber-900/40",
      borderColor: "border-yellow-200/70 dark:border-yellow-400/30",
      shadowColor: "shadow-yellow-100/50 dark:shadow-yellow-900/30",
      emoji: "🏆"
    },
    {
      icon: Calendar,
      label: "Total Days",
      value: totalDays,
      unit: "",
      iconColor: "text-blue-500 dark:text-blue-400",
      bgGradient: "from-blue-100/90 to-cyan-100/90 dark:from-blue-900/40 dark:to-cyan-900/40",
      borderColor: "border-blue-200/70 dark:border-blue-400/30",
      shadowColor: "shadow-blue-100/50 dark:shadow-blue-900/30",
      emoji: "📅"
    },
    {
      icon: Target,
      label: "Perfect\nDays",
      value: perfectDays,
      unit: "",
      iconColor: "text-purple-500 dark:text-purple-400",
      bgGradient: "from-purple-100/90 to-violet-100/90 dark:from-purple-900/40 dark:to-violet-900/40",
      borderColor: "border-purple-200/70 dark:border-purple-400/30",
      shadowColor: "shadow-purple-100/50 dark:shadow-purple-900/30",
      emoji: "⭐"
    },
    {
      icon: CheckCircle,
      label: "Today's\nTotal",
      value: todaysTasks,
      unit: "tasks",
      iconColor: "text-pink-500 dark:text-pink-400",
      bgGradient: "from-pink-100/90 to-rose-100/90 dark:from-pink-900/40 dark:to-rose-900/40",
      borderColor: "border-pink-200/70 dark:border-pink-400/30",
      shadowColor: "shadow-pink-100/50 dark:shadow-pink-900/30",
      emoji: "✅"
    },
    {
      icon: Droplets,
      label: "Water\nIntake",
      value: waterIntake,
      unit: "L",
      iconColor: "text-cyan-500 dark:text-cyan-400",
      bgGradient: "from-cyan-100/90 to-teal-100/90 dark:from-cyan-900/40 dark:to-teal-900/40",
      borderColor: "border-cyan-200/70 dark:border-cyan-400/30",
      shadowColor: "shadow-cyan-100/50 dark:shadow-cyan-900/30",
      emoji: "💧"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`group relative bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm rounded-2xl p-5 border ${stat.borderColor} ${stat.shadowColor} hover:shadow-xl transition-all duration-300 hover:scale-[1.05] animate-fade-in`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Enhanced background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/10 dark:to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="flex flex-col items-start relative z-10">
            {/* Icon with emoji */}
            <div className="relative mb-3 flex items-center gap-2">
              <div className="bg-white/90 dark:bg-white/20 backdrop-blur-sm rounded-lg p-2 shadow-sm group-hover:shadow-md transition-all duration-300">
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <span className="text-lg animate-bounce" style={{ animationDelay: `${index * 200}ms` }}>
                {stat.emoji}
              </span>
            </div>

            {/* Enhanced label */}
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-pre-line mb-2 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
              {stat.label}
            </div>

            {/* Enhanced value display */}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:from-gray-900 group-hover:to-gray-700 dark:group-hover:from-white dark:group-hover:to-gray-100 transition-all duration-300">
                {stat.value}
              </span>
              {stat.unit && (
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                  {stat.unit}
                </span>
              )}
            </div>
          </div>

          {/* Progress indicator for water intake */}
          {stat.label.includes('Water') && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-2xl overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                style={{ width: `${Math.min((waterIntake / 3) * 100, 100)}%` }}
              ></div>
            </div>
          )}

          {/* Perfect day indicator */}
          {stat.label.includes('Perfect') && perfectDays > 0 && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
          )}
        </div>
      ))}
    </div>
  );
}
