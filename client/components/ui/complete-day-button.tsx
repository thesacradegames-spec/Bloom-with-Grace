import { useState } from "react";
import { CheckCircle, Sparkles, Trophy, Clock } from "lucide-react";
import { Button } from "./button";

interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
}

interface CompleteDayButtonProps {
  goals: Goal[];
  waterIntake: number;
  targetWater: number;
  onComplete: () => void;
  disabled?: boolean;
}

export function CompleteDayButton({ 
  goals, 
  waterIntake, 
  targetWater, 
  onComplete, 
  disabled = false 
}: CompleteDayButtonProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  const completedGoals = goals.filter(goal => goal.current >= goal.target).length;
  const totalGoals = goals.length;
  const waterGoalMet = waterIntake >= targetWater;
  const allGoalsCompleted = completedGoals === totalGoals;
  const isPerfectDay = allGoalsCompleted && waterGoalMet;

  const handleComplete = async () => {
    setIsCompleting(true);
    
    // Add a small delay for better UX
    setTimeout(() => {
      onComplete();
      setIsCompleting(false);
    }, 1000);
  };

  const getButtonText = () => {
    if (isCompleting) return "Completing Day...";
    if (isPerfectDay) return "Perfect Day Complete! 🌟";
    if (allGoalsCompleted) return "Goals Complete! 🎯";
    return "Complete Day";
  };

  const getButtonVariant = () => {
    if (isPerfectDay) return "perfect";
    if (allGoalsCompleted) return "goals-complete";
    return "default";
  };

  return (
    <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl animate-fade-in">
      {/* Progress Summary */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">Day Summary</h3>
            <p className="text-white/80 text-xs sm:text-sm">Your progress today</p>
          </div>
        </div>

        {/* Goals Progress */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-white/20">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <CheckCircle className={`w-3 h-3 sm:w-4 sm:h-4 ${allGoalsCompleted ? 'text-green-400' : 'text-white/60'}`} />
              <span className="text-white text-xs sm:text-sm font-medium">Goals</span>
            </div>
            <div className="text-white text-base sm:text-lg font-bold">
              {completedGoals}/{totalGoals}
            </div>
            <div className="text-white/70 text-xs">
              {Math.round((completedGoals / totalGoals) * 100)}% complete
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-white/20">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${waterGoalMet ? 'bg-blue-400' : 'bg-white/40'}`} />
              <span className="text-white text-xs sm:text-sm font-medium">Water</span>
            </div>
            <div className="text-white text-base sm:text-lg font-bold">
              {waterIntake}L
            </div>
            <div className="text-white/70 text-xs">
              Target: {targetWater}L
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-white/20 text-center">
          {isPerfectDay ? (
            <div className="text-yellow-400 font-medium text-xs sm:text-sm">
              🌟 Perfect Day! All goals and water target achieved! 🌟
            </div>
          ) : allGoalsCompleted ? (
            <div className="text-green-400 font-medium text-xs sm:text-sm">
              🎯 All goals completed! Don't forget your water intake.
            </div>
          ) : (
            <div className="text-white/80 font-medium text-xs sm:text-sm">
              Keep going! You're making great progress.
            </div>
          )}
        </div>
      </div>

      {/* Complete Day Button */}
      <Button
        onClick={handleComplete}
        disabled={disabled || isCompleting}
        className={`w-full py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg relative overflow-hidden ${
          isPerfectDay 
            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white' 
            : allGoalsCompleted
            ? 'bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white'
            : 'bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white border border-white/30 backdrop-blur-sm'
        }`}
      >
        {isCompleting ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            {getButtonText()}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            {isPerfectDay ? (
              <Trophy className="w-5 h-5" />
            ) : allGoalsCompleted ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Clock className="w-5 h-5" />
            )}
            {getButtonText()}
            <Sparkles className="w-5 h-5" />
          </div>
        )}
      </Button>

      {/* Encouragement Message */}
      <div className="mt-4 text-center">
        <p className="text-white/70 text-xs italic">
          {isPerfectDay 
            ? "🎉 Amazing work! You're absolutely crushing it! 🎉"
            : "💖 Every step forward is progress worth celebrating! 💖"
          }
        </p>
      </div>
    </div>
  );
}
