import { Droplets, Minus, Plus, Star } from "lucide-react";

interface WellnessSectionProps {
  waterIntake: number;
  targetWater: number;
  onWaterIncrement: () => void;
  onWaterDecrement: () => void;
}

export function WellnessSection({
  waterIntake = 0,
  targetWater = 3,
  onWaterIncrement,
  onWaterDecrement
}: WellnessSectionProps) {
  const progressPercentage = (waterIntake / targetWater) * 100;
  const isCompleted = waterIntake >= targetWater;

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-cyan-100 to-teal-100 p-2 rounded-xl">
          <Droplets className="w-6 h-6 text-cyan-600" />
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
          Wellness Tracker
        </h3>
      </div>
      
      <div className={`group relative bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-sm rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${
        isCompleted 
          ? "border-cyan-200 bg-gradient-to-r from-cyan-50/95 to-teal-50/90 shadow-cyan-100" 
          : "border-gray-200 hover:border-cyan-200 hover:shadow-cyan-100"
      }`}>
        
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Success indicator */}
        {isCompleted && (
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <Star className="w-4 h-4 text-white" />
          </div>
        )}

        {/* Water level background */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div 
            className={`absolute bottom-0 left-0 right-0 transition-all duration-700 rounded-2xl ${
              isCompleted 
                ? "bg-gradient-to-t from-cyan-100/80 to-teal-100/40"
                : "bg-gradient-to-t from-cyan-100/60 to-blue-100/30"
            }`}
            style={{ height: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between relative z-10">
          {/* Water info section */}
          <div className="flex items-center gap-4 flex-1">
            <div className="relative">
              {/* Icon background with ripple effect */}
              <div className="absolute inset-0 bg-cyan-300 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></div>
              <div className={`relative bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md transition-all duration-300 group-hover:shadow-lg ${
                isCompleted && "bg-cyan-50/90"
              }`}>
                <Droplets className={`w-8 h-8 transition-colors duration-300 ${
                  isCompleted ? "text-cyan-600" : "text-cyan-500"
                }`} />
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className={`text-lg font-semibold transition-colors duration-300 ${
                isCompleted ? "text-cyan-800" : "text-gray-800 group-hover:text-gray-900"
              }`}>
                Water Intake
              </h4>
              <div className="flex items-center gap-3 mt-2">
                <div className={`text-2xl font-bold ${
                  isCompleted ? "text-cyan-700" : "text-gray-700"
                }`}>
                  {waterIntake}L
                </div>
                <div className="text-sm text-gray-500">/ {targetWater}L</div>
                <div className={`text-xs font-medium px-3 py-1 rounded-full ${
                  isCompleted 
                    ? "bg-cyan-100 text-cyan-700"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {Math.round(progressPercentage)}%
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-3 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 rounded-full ${
                    isCompleted 
                      ? "bg-gradient-to-r from-cyan-400 to-teal-500"
                      : "bg-gradient-to-r from-cyan-400 to-blue-500"
                  }`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
              
              {/* Encouragement message */}
              <div className="mt-2 text-xs text-gray-500">
                {isCompleted 
                  ? "🎉 Amazing! You've reached your hydration goal!" 
                  : `💧 ${(targetWater - waterIntake).toFixed(1)}L more to reach your goal`}
              </div>
            </div>
          </div>
          
          {/* Control buttons */}
          <div className="flex items-center gap-3 ml-6">
            <button
              onClick={onWaterDecrement}
              disabled={waterIntake <= 0}
              className="group/btn w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-red-100 hover:to-pink-100 disabled:from-gray-50 disabled:to-gray-50 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg disabled:hover:scale-100"
            >
              <Minus className="w-5 h-5 text-gray-600 group-hover/btn:text-red-600 transition-colors duration-200" />
            </button>
            
            <div className="text-center px-2">
              <div className="text-lg font-bold text-gray-700">{waterIntake.toFixed(1)}</div>
              <div className="text-xs text-gray-500">Liters</div>
            </div>
            
            <button
              onClick={onWaterIncrement}
              className="group/btn w-12 h-12 bg-gradient-to-r from-cyan-100 to-blue-100 hover:from-cyan-200 hover:to-blue-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5 text-cyan-600 group-hover/btn:text-cyan-700 transition-colors duration-200" />
            </button>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-300 ${
          isCompleted 
            ? "bg-gradient-to-r from-cyan-400 to-teal-500"
            : "bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100"
        }`}></div>
      </div>
    </div>
  );
}
