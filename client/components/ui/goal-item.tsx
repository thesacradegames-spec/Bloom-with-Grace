import { Minus, Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalItemProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  current: number;
  target: number;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

export function GoalItem({
  id,
  icon,
  title,
  current,
  target,
  onIncrement,
  onDecrement
}: GoalItemProps) {
  const progressPercentage = (current / target) * 100;
  const isCompleted = current >= target;

  return (
    <div className={cn(
      "group relative bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-sm rounded-2xl p-5 border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1",
      isCompleted 
        ? "border-green-200 bg-gradient-to-r from-green-50/95 to-emerald-50/90 shadow-green-100" 
        : "border-gray-200 hover:border-purple-200 hover:shadow-purple-100"
    )}>
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Success indicator */}
      {isCompleted && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <Star className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Progress background */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 transition-all duration-500 rounded-2xl",
            isCompleted 
              ? "bg-gradient-to-r from-green-100/60 to-emerald-100/60"
              : "bg-gradient-to-r from-purple-100/40 to-pink-100/40"
          )}
          style={{ height: `${Math.min(progressPercentage, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between relative z-10">
        {/* Icon and title section */}
        <div className="flex items-center gap-4 flex-1">
          <div className="relative">
            {/* Icon background with glow */}
            <div className={cn(
              "absolute inset-0 rounded-xl blur-lg opacity-30 transition-opacity duration-300",
              isCompleted ? "bg-green-300" : "bg-purple-300 group-hover:opacity-50"
            )}></div>
            <div className={cn(
              "relative bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-md transition-all duration-300 group-hover:shadow-lg",
              isCompleted && "bg-green-50/90"
            )}>
              <div className="w-6 h-6 flex items-center justify-center">
                {icon}
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-semibold text-gray-800 transition-colors duration-300 group-hover:text-gray-900",
              isCompleted && "text-green-800"
            )}>
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className={cn(
                "text-sm font-medium",
                isCompleted ? "text-green-600" : "text-gray-600"
              )}>
                {current}/{target}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-500 rounded-full",
                    isCompleted 
                      ? "bg-gradient-to-r from-green-400 to-emerald-500"
                      : "bg-gradient-to-r from-purple-400 to-pink-500"
                  )}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
              <div className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                isCompleted 
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              )}>
                {Math.round(progressPercentage)}%
              </div>
            </div>
          </div>
        </div>
        
        {/* Control buttons */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onDecrement(id)}
            disabled={current <= 0}
            className="group/btn w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-red-100 hover:to-pink-100 disabled:from-gray-50 disabled:to-gray-50 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg disabled:hover:scale-100"
          >
            <Minus className="w-4 h-4 text-gray-600 group-hover/btn:text-red-600 transition-colors duration-200" />
          </button>
          
          <button
            onClick={() => onIncrement(id)}
            className="group/btn w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4 text-purple-600 group-hover/btn:text-purple-700 transition-colors duration-200" />
          </button>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-300",
        isCompleted 
          ? "bg-gradient-to-r from-green-400 to-emerald-500"
          : "bg-gradient-to-r from-purple-400 to-pink-500 opacity-0 group-hover:opacity-100"
      )}></div>
    </div>
  );
}
