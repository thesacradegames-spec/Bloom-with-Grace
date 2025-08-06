import { useState, useEffect } from "react";
import { Flower2, Sparkles, Star, Moon } from "lucide-react";

interface WebappLoaderProps {
  onComplete: () => void;
}

export function WebappLoader({ onComplete }: WebappLoaderProps) {
  const [loadingStage, setLoadingStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Stage 0: Initial loading
    const stage1Timer = setTimeout(() => {
      setLoadingStage(1);
    }, 500);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + 2;
        }
        clearInterval(progressInterval);
        return 100;
      });
    }, 50);

    // Stage 1: Almost complete
    const stage2Timer = setTimeout(() => {
      setLoadingStage(2);
    }, 2500);

    // Complete loading
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(stage1Timer);
      clearTimeout(stage2Timer);
      clearTimeout(completeTimer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600 dark:from-black dark:via-purple-900 dark:to-purple-800 flex items-center justify-center overflow-hidden transition-colors duration-500">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Twinkling Stars */}
        {[...Array(20)].map((_, i) => (
          <Star
            key={`star-${i}`}
            className={`absolute text-white/30 animate-pulse ${
              loadingStage >= 1 ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${8 + Math.random() * 10}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              transition: 'opacity 1s ease-in-out'
            }}
          />
        ))}

        {/* Floating Moons */}
        {[...Array(5)].map((_, i) => (
          <Moon
            key={`moon-${i}`}
            className={`absolute text-yellow-200/25 animate-bounce ${
              loadingStage >= 1 ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${12 + Math.random() * 8}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 1}s`,
              transition: 'opacity 1s ease-in-out'
            }}
          />
        ))}

        {/* Magical Sparkles */}
        {[...Array(15)].map((_, i) => (
          <Sparkles
            key={`sparkle-${i}`}
            className={`absolute text-white/25 animate-spin ${
              loadingStage >= 1 ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${8 + Math.random() * 6}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
              transition: 'opacity 1s ease-in-out'
            }}
          />
        ))}
      </div>

      {/* Main loading content */}
      <div className="relative z-10 text-center px-4 sm:px-6">
        {/* App logo and flower animation */}
        <div className="relative mb-8">
          {/* Outer glow */}
          <div 
            className={`absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full transition-all duration-2000 ease-out ${
              loadingStage >= 1 
                ? 'bg-gradient-to-r from-pink-300/30 to-purple-300/30 blur-xl scale-150' 
                : 'bg-transparent scale-0'
            }`}
          />
          
          {/* Main flower */}
          <div 
            className={`relative w-24 h-24 sm:w-32 sm:h-32 mx-auto transition-all duration-2000 ease-out ${
              loadingStage >= 1 ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
            }`}
          >
            <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm p-6 sm:p-8 rounded-full border border-white/30 shadow-2xl">
              <Flower2 className="w-12 h-12 sm:w-16 sm:h-16 text-white drop-shadow-lg" />
            </div>
            
            {/* Rotating petals around the flower */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`rotating-petal-${i}`}
                className={`absolute w-4 h-4 sm:w-6 sm:h-6 transition-all duration-2000 ease-out ${
                  loadingStage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-50px)`,
                  transitionDelay: `${i * 200}ms`
                }}
              >
                <div className="w-4 h-4 sm:w-6 sm:h-6 bg-white/40 rounded-full blur-sm animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* App title and subtitle */}
        <div
          className={`transition-all duration-1500 ease-out delay-500 ${
            loadingStage >= 1
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-3xl sm:text-5xl font-bold text-white drop-shadow-lg mb-2 tracking-wide">
            <span className="bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent">
              Her Daily Bloom
            </span>
          </h1>

          <p className="text-lg sm:text-xl font-semibold text-white/95 mb-6 italic tracking-wide drop-shadow-md">
            🌸 Blooming with Grace 🌸
          </p>

          <p className="text-white/90 text-sm sm:text-lg font-medium tracking-wide mb-2">
            ✨ Track your goals, bloom every day ✨
          </p>
        </div>

        {/* Loading progress */}
        <div
          className={`transition-all duration-1000 ease-out delay-1000 ${
            loadingStage >= 1
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Progress bar */}
          <div className="w-64 sm:w-80 mx-auto mb-4">
            <div className="bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm border border-white/30">
              <div 
                className="h-full bg-gradient-to-r from-pink-300 to-purple-300 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-white/80 text-xs sm:text-sm mt-2">
              {progress < 30 && "Initializing your garden..."}
              {progress >= 30 && progress < 60 && "Loading your goals..."}
              {progress >= 60 && progress < 90 && "Preparing dashboard..."}
              {progress >= 90 && "Almost ready!"}
            </p>
          </div>

          {/* Loading dots */}
          <div className="flex items-center justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 sm:w-3 sm:h-3 bg-white/60 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 200}ms`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Fade out animation */}
        {loadingStage === 2 && (
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600 animate-fade-in" />
        )}
      </div>
    </div>
  );
}
