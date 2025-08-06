import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { getDayProgress, DayProgress } from "@/lib/data-utils";
import { getUserDayProgress } from "@/lib/user-data-utils";
import { getCurrentUser } from "@/lib/user-data-utils";
import { getLocalDateString, getCurrentLocalDate } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

interface CalendarWidgetProps {
  currentDate?: string;
  onDateSelect?: (date: string) => void;
}

export function CalendarWidget({ currentDate, onDateSelect }: CalendarWidgetProps) {
  const [displayDate, setDisplayDate] = useState(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month with their progress data
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const dateString = getLocalDateString(dayDate);

      // Get user-specific progress data
      const currentUser = getCurrentUser();
      const progress = currentUser ? getUserDayProgress(currentUser, dateString) : null;

      days.push({
        day,
        date: dateString,
        progress
      });
    }
    
    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setDisplayDate(prev => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(displayDate);
  const today = getCurrentLocalDate();

  const getDayStyles = (dayData: any) => {
    if (!dayData) return "";
    
    const { date, progress } = dayData;
    const isToday = date === today;
    const isCurrentDate = date === currentDate;
    const hasProgress = progress !== null;
    
    if (isCurrentDate) {
      return "bg-purple-600 text-white font-bold";
    }
    
    if (isToday) {
      return "bg-pink-500 text-white font-semibold";
    }
    
    if (hasProgress) {
      if (progress.isPerfectDay) {
        return "bg-green-100 text-green-800 font-medium";
      } else if (progress.completionRate >= 70) {
        return "bg-blue-100 text-blue-800 font-medium";
      } else if (progress.completionRate >= 30) {
        return "bg-yellow-100 text-yellow-800";
      } else {
        return "bg-red-100 text-red-800";
      }
    }
    
    return "text-gray-700 hover:bg-gray-100";
  };

  const getProgressIndicator = (progress: DayProgress | null) => {
    if (!progress) return null;
    
    return (
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
        <div 
          className={cn(
            "w-1 h-1 rounded-full",
            progress.isPerfectDay ? "bg-green-500" :
            progress.completionRate >= 70 ? "bg-blue-500" :
            progress.completionRate >= 30 ? "bg-yellow-500" : "bg-red-500"
          )}
        />
      </div>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/40">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[displayDate.getMonth()]} {displayDate.getFullYear()}
        </h3>
        
        <button
          onClick={() => navigateMonth("next")}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day, index) => (
          <div key={`day-name-${index}`} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((dayData, index) => (
          <div key={`calendar-day-${index}`} className="aspect-square flex items-center justify-center relative">
            {dayData && (
              <>
                <button
                  onClick={() => onDateSelect && onDateSelect(dayData.date)}
                  className={cn(
                    "w-8 h-8 rounded-full text-sm font-medium transition-all duration-200 relative",
                    getDayStyles(dayData),
                    onDateSelect && "cursor-pointer hover:scale-110"
                  )}
                  title={dayData.progress ? 
                    `${dayData.progress.completionRate}% completion - ${dayData.progress.completedGoals}/${dayData.progress.goalCount} goals` : 
                    "No data"
                  }
                >
                  {dayData.day}
                </button>
                {getProgressIndicator(dayData.progress)}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-100 rounded-full border border-green-300"></div>
            <span className="text-gray-600">Perfect</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-100 rounded-full border border-blue-300"></div>
            <span className="text-gray-600">Good</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-100 rounded-full border border-yellow-300"></div>
            <span className="text-gray-600">Fair</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-100 rounded-full border border-red-300"></div>
            <span className="text-gray-600">Poor</span>
          </div>
        </div>
      </div>
    </div>
  );
}
