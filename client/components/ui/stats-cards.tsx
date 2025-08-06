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
      iconColor: "text-orange-500",
      bgGradient: "from-orange-100 to-red-100",
      borderColor: "border-orange-200",
      shadowColor: "shadow-orange-100"
    },
    {
      icon: Trophy,
      label: "Longest\nStreak",
      value: longestStreak,
      unit: "days",
      iconColor: "text-yellow-500",
      bgGradient: "from-yellow-100 to-amber-100",
      borderColor: "border-yellow-200",
      shadowColor: "shadow-yellow-100"
    },
    {
      icon: Calendar,
      label: "Total Days",
      value: totalDays,
      unit: "",
      iconColor: "text-blue-500",
      bgGradient: "from-blue-100 to-cyan-100",
      borderColor: "border-blue-200",
      shadowColor: "shadow-blue-100"
    },
    {
      icon: Target,
      label: "Perfect\nDays",
      value: perfectDays,
      unit: "",
      iconColor: "text-purple-500",
      bgGradient: "from-purple-100 to-violet-100",
      borderColor: "border-purple-200",
      shadowColor: "shadow-purple-100"
    },
    {
      icon: CheckCircle,
      label: "Today's\nTotal",
      value: todaysTasks,
      unit: "tasks",
      iconColor: "text-pink-500",
      bgGradient: "from-pink-100 to-rose-100",
      borderColor: "border-pink-200",
      shadowColor: "shadow-pink-100"
    },
    {
      icon: Droplets,
      label: "Water\nIntake",
      value: waterIntake,
      unit: "L",
      iconColor: "text-cyan-500",
      bgGradient: "from-cyan-100 to-teal-100",
      borderColor: "border-cyan-200",
      shadowColor: "shadow-cyan-100"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`group relative bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-5 border ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]`}
        >
          {/* Simplified background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          
          <div className="flex flex-col items-start relative z-10">
            {/* Simplified icon */}
            <div className="relative mb-3">
              <div className="bg-white/80 rounded-lg p-2 shadow-sm group-hover:shadow-md transition-shadow duration-200">
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
            
            {/* Enhanced text */}
            <div className="text-xs font-medium text-gray-600 whitespace-pre-line mb-2 group-hover:text-gray-700 transition-colors duration-300">
              {stat.label}
            </div>
            
            {/* Enhanced value display */}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-gray-900 group-hover:to-gray-700 transition-all duration-300">
                {stat.value}
              </span>
              {stat.unit && (
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
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
