import { useEffect } from "react";
import { Flower2, Sparkles } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Show splash for 3 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-white/20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              fontSize: `${12 + Math.random() * 8}px`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="text-center text-white z-10">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <Flower2 className="w-full h-full text-white drop-shadow-2xl animate-pulse" />
            <div className="absolute -inset-4 border-4 border-white/30 rounded-full animate-spin"></div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in">
            Her Daily Bloom
          </h1>
          <p className="text-xl sm:text-2xl opacity-90 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            ✨ Nurture Your Dreams Daily ✨
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-white/80">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
