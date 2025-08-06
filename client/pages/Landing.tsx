import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flower2, Sparkles, Heart, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    
    // Save username to localStorage
    localStorage.setItem('bloom-current-user', username.trim());
    
    // Simulate a brief loading for smooth transition
    setTimeout(() => {
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating flowers */}
        {[...Array(8)].map((_, i) => (
          <Flower2
            key={`flower-${i}`}
            className="absolute text-white/20 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${20 + Math.random() * 15}px`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Twinkling stars */}
        {[...Array(15)].map((_, i) => (
          <Star
            key={`star-${i}`}
            className="absolute text-yellow-200/30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${12 + Math.random() * 8}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random()}s`
            }}
          />
        ))}

        {/* Floating hearts */}
        {[...Array(10)].map((_, i) => (
          <Heart
            key={`heart-${i}`}
            className="absolute text-pink-200/25 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${15 + Math.random() * 10}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}

        {/* Sparkles */}
        {[...Array(12)].map((_, i) => (
          <Sparkles
            key={`sparkle-${i}`}
            className="absolute text-white/15 animate-spin"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${10 + Math.random() * 8}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${6 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main content card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10 animate-fade-in">
        
        {/* Decorative border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 opacity-20 animate-pulse"></div>
        
        {/* Header section */}
        <div className="text-center mb-8 relative z-10">
          <div className="mb-4 relative">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4 animate-pulse">
              <Flower2 className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-8 w-6 h-6 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -bottom-2 -left-8 w-4 h-4 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Her Daily Bloom
          </h1>
          
          <p className="text-gray-600 text-lg mb-2">
            ✨ Track your goals, bloom every day ✨
          </p>
          
          <p className="text-sm text-gray-500">
            Your personal journey to achieving dreams starts here!
          </p>
        </div>

        {/* Welcome message */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-6 border border-pink-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center">
            🌸 Welcome, Beautiful! 🌸
          </h2>
          <p className="text-gray-600 text-center text-sm leading-relaxed">
            Ready to start your amazing journey? Enter your name below and let's begin tracking your daily goals together!
          </p>
        </div>

        {/* Username form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Your Beautiful Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name..."
                className="w-full pl-10 pr-4 py-4 bg-white border-2 border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-400"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={!username.trim() || isLoading}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg relative overflow-hidden"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating your garden...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Start Your Journey
                <Sparkles className="w-5 h-5" />
              </div>
            )}
          </Button>
        </form>

        {/* Features preview */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">🎯</span>
            </div>
            <p className="text-xs text-gray-600 font-medium">Daily Goals</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">📊</span>
            </div>
            <p className="text-xs text-gray-600 font-medium">Analytics</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">🏆</span>
            </div>
            <p className="text-xs text-gray-600 font-medium">Achievements</p>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 italic">
            💖 Your progress will be saved automatically 💖
          </p>
        </div>
      </div>

      {/* Additional floating decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {['🌸', '🦋', '✨', '🌺', '💫'].map((emoji, i) => (
          <div
            key={`decoration-${i}`}
            className="absolute text-2xl opacity-30 animate-bounce"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            {emoji}
          </div>
        ))}
      </div>
    </div>
  );
}
