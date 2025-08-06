import { useState, useEffect } from "react";
import { Calendar, Star, SkipForward } from "lucide-react";
import { Header } from "@/components/ui/header";
import { GoalCard } from "@/components/ui/goal-card";
import { AddGoal } from "@/components/ui/add-goal";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { Button } from "@/components/ui/button";

interface Goal {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface DayData {
  date: string;
  goals: Goal[];
}

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [dayData, setDayData] = useState<DayData>({ date: currentDate, goals: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`dreamdash-${currentDate}`);
    if (savedData) {
      setDayData(JSON.parse(savedData));
    } else {
      // Check if we need to carry over incomplete goals from previous day
      const yesterday = new Date(currentDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = yesterday.toISOString().split('T')[0];
      const yesterdayData = localStorage.getItem(`dreamdash-${yesterdayKey}`);
      
      if (yesterdayData) {
        const prevDay: DayData = JSON.parse(yesterdayData);
        const incompleteGoals = prevDay.goals
          .filter(goal => !goal.completed)
          .map(goal => ({ ...goal, id: crypto.randomUUID() }));
        
        setDayData({
          date: currentDate,
          goals: incompleteGoals
        });
      } else {
        setDayData({ date: currentDate, goals: [] });
      }
    }
    
    setTimeout(() => setIsLoading(false), 800);
  }, [currentDate]);

  // Save data to localStorage whenever dayData changes
  useEffect(() => {
    if (dayData.goals.length > 0 || localStorage.getItem(`dreamdash-${currentDate}`)) {
      localStorage.setItem(`dreamdash-${currentDate}`, JSON.stringify(dayData));
    }
  }, [dayData, currentDate]);

  const addGoal = (text: string) => {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setDayData(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }));
  };

  const toggleGoal = (id: string) => {
    setDayData(prev => ({
      ...prev,
      goals: prev.goals.map(goal =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    }));
  };

  const deleteGoal = (id: string) => {
    setDayData(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== id)
    }));
  };

  const goToNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setCurrentDate(nextDay.toISOString().split('T')[0]);
  };

  const completedGoals = dayData.goals.filter(goal => goal.completed).length;
  const totalGoals = dayData.goals.length;
  const progressPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Star className="w-12 h-12 text-dreamlavender animate-pulse" />
            <Star className="w-8 h-8 text-dreampink animate-ping absolute top-1 left-1" />
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-dreamlavender rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-dreampink rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-dreampeach rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-lg font-medium text-foreground/60 animate-pulse">Loading your dreams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-dreamblush/30 to-dreampeach/20">
      <Header userName="Dreamer" />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Date and Progress Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-6">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-dreamlavender" />
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    {formatDate(currentDate)}
                  </h2>
                </div>
              </div>
              <p className="text-sm sm:text-base text-foreground/70">
                {totalGoals > 0
                  ? `${completedGoals} of ${totalGoals} dreams achieved today`
                  : "Start by adding your first dream goal!"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <ProgressCircle percentage={progressPercentage} size={100} />
              <Button
                onClick={goToNextDay}
                variant="outline"
                className="w-full sm:w-auto border-dreamlavender/40 text-dreamlavender hover:bg-dreamlavender/10 rounded-xl px-4 py-2"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Next Day
              </Button>
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div className="space-y-6">
          <AddGoal onAddGoal={addGoal} />
          
          {dayData.goals.length > 0 ? (
            <div className="space-y-3">
              {dayData.goals.map((goal, index) => (
                <div
                  key={goal.id}
                  className="animate-in slide-in-from-bottom-2 duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <GoalCard
                    id={goal.id}
                    text={goal.text}
                    completed={goal.completed}
                    onToggle={toggleGoal}
                    onDelete={deleteGoal}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-dreamlavender/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground/70 mb-2">
                No dreams yet today
              </h3>
              <p className="text-foreground/50">
                Add your first goal to start your amazing day!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
