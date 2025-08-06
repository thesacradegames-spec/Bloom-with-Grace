import { useState, useEffect } from "react";
import { Flower2, Sparkles, Heart, Star, Moon } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStage(1);
    }, 500);

    const completeTimer = setTimeout(() => {
      setAnimationStage(2);
      setTimeout(onComplete, 1000);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600 flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating petals */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`petal-${i}`}
            className={`absolute w-4 h-4 bg-white/20 rounded-full animate-bounce ${
              animationStage >= 1 ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              transition: 'opacity 1s ease-in-out'
            }}
          />
        ))}

        {/* Sparkles */}
        {[...Array(15)].map((_, i) => (
          <Sparkles
            key={`sparkle-${i}`}
            className={`absolute text-white/30 animate-spin ${
              animationStage >= 1 ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${12 + Math.random() * 8}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
              transition: 'opacity 1s ease-in-out'
            }}
          />
        ))}

        {/* Hearts */}
        {[...Array(10)].map((_, i) => (
          <Heart
            key={`heart-${i}`}
            className={`absolute text-pink-200/25 animate-pulse ${
              animationStage >= 1 ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${16 + Math.random() * 12}px`,
              animationDelay: `${Math.random() * 2}s`,
              transition: 'opacity 1s ease-in-out'
            }}
          />
        ))}
      </div>

      {/* Main flower animation */}
      <div className="relative z-10 text-center">
        {/* Blooming flower container */}
        <div className="relative mb-8">
          {/* Outer glow */}
          <div 
            className={`absolute inset-0 w-32 h-32 mx-auto rounded-full transition-all duration-2000 ease-out ${
              animationStage >= 1 
                ? 'bg-gradient-to-r from-pink-300/30 to-purple-300/30 blur-xl scale-150' 
                : 'bg-transparent scale-0'
            }`}
          />
          
          {/* Main flower */}
          <div 
            className={`relative w-32 h-32 mx-auto transition-all duration-2000 ease-out ${
              animationStage >= 1 ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
            }`}
          >
            <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm p-8 rounded-full border border-white/30 shadow-2xl">
              <Flower2 className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
            
            {/* Rotating petals around the flower */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`rotating-petal-${i}`}
                className={`absolute w-6 h-6 transition-all duration-2000 ease-out ${
                  animationStage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-60px)`,
                  transitionDelay: `${i * 200}ms`
                }}
              >
                <div className="w-6 h-6 bg-white/40 rounded-full blur-sm animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* App title with animation */}
        <div
          className={`transition-all duration-1500 ease-out delay-500 ${
            animationStage >= 1
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-2 tracking-wide">
            <span className="bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent">
              Her Daily Bloom
            </span>
          </h1>

          {/* Blooming with grace text */}
          <div
            className={`transition-all duration-1200 ease-out delay-800 ${
              animationStage >= 1
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-6 scale-90'
            }`}
          >
            <p className="text-2xl font-semibold text-white/95 mb-4 italic tracking-wide drop-shadow-md">
              🌸 Blooming with Grace 🌸
            </p>
          </div>

          <div
            className={`transition-all duration-1000 ease-out delay-1200 ${
              animationStage >= 1
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="text-white/90 text-lg font-medium tracking-wide mb-2">
              ✨ Track your goals, bloom every day ✨
            </p>

            {/* Loading indicator */}
            <div
              className={`transition-all duration-1000 ease-out delay-1800 ${
                animationStage >= 1
                  ? 'opacity-100'
                  : 'opacity-0'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mt-8">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-white/60 rounded-full animate-bounce"
                    style={{
                      animationDelay: `${i * 200}ms`,
                      animationDuration: '1s'
                    }}
                  />
                ))}
              </div>
              <p className="text-white/70 text-sm mt-4 animate-pulse">
                Preparing your magical garden... 🌺
              </p>
            </div>
          </div>
        </div>

        {/* Fade out animation */}
        {animationStage === 2 && (
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600 animate-fade-in" />
        )}
      </div>
    </div>
  );
}
