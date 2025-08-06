import { useState } from "react";
import { User, Calendar, Sparkles, Heart } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { CUTE_CHARACTERS, Character } from "@/lib/characters";

interface ProfileFormProps {
  onComplete: (profileData: { name: string; birthday: string; character: string }) => void;
}

export function ProfileForm({ onComplete }: ProfileFormProps) {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !birthday) return;

    setIsLoading(true);
    
    // Simulate loading for smooth transition
    setTimeout(() => {
      onComplete({
        name: name.trim(),
        birthday
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating flowers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`flower-${i}`}
            className="absolute text-white/15 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${20 + Math.random() * 15}px`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          >
            🌸
          </div>
        ))}
        
        {/* Twinkling stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute text-yellow-200/25 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${12 + Math.random() * 8}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random()}s`
            }}
          >
            ✨
          </div>
        ))}

        {/* Floating hearts */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`heart-${i}`}
            className="absolute text-pink-200/20 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${15 + Math.random() * 10}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            💖
          </div>
        ))}
      </div>

      {/* Main content card with glassmorphism */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-lg relative z-10 border border-white/20 animate-fade-in">
        
        {/* Decorative border glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-300/20 via-purple-300/20 to-blue-300/20 opacity-60 animate-pulse"></div>
        
        {/* Header section */}
        <div className="text-center mb-8 relative z-10">
          <div className="mb-6 relative">
            <div className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4 border border-white/30 shadow-lg">
              <User className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            <div className="absolute -top-2 -right-8 w-6 h-6 bg-yellow-400/80 rounded-full animate-bounce blur-sm" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -bottom-2 -left-8 w-4 h-4 bg-pink-400/80 rounded-full animate-bounce blur-sm" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-3 tracking-wide">
            Tell Us About You
          </h1>
          
          <p className="text-white/90 text-lg mb-2">
            🌟 Let's personalize your journey 🌟
          </p>
          
          <p className="text-sm text-white/80">
            We'll use this information to make your experience special!
          </p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white font-medium">
              Your Beautiful Name ✨
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white/40 focus:ring-white/20 backdrop-blur-sm"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Birthday Field */}
          <div className="space-y-2">
            <Label htmlFor="birthday" className="text-white font-medium">
              Your Special Day 🎂
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <Input
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white focus:border-white/40 focus:ring-white/20 backdrop-blur-sm [&::-webkit-calendar-picker-indicator]:invert"
                required
                disabled={isLoading}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <p className="text-white/70 text-xs">
              We'll celebrate with you on your birthday! 🎉
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!name.trim() || !birthday || isLoading}
            className="w-full bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg relative overflow-hidden border border-white/30 backdrop-blur-sm"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Setting up your garden...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Create My Garden
                <Sparkles className="w-5 h-5" />
              </div>
            )}
          </Button>
        </form>

        {/* Features preview */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2 border border-white/20">
              <span className="text-xl">🎯</span>
            </div>
            <p className="text-xs text-white/80 font-medium">Daily Goals</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2 border border-white/20">
              <span className="text-xl">📊</span>
            </div>
            <p className="text-xs text-white/80 font-medium">Progress</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2 border border-white/20">
              <span className="text-xl">🏆</span>
            </div>
            <p className="text-xs text-white/80 font-medium">Achievements</p>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/70 italic">
            💖 Your information is stored safely on your device 💖
          </p>
        </div>
      </div>

      {/* Additional floating decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {['🌺', '🦋', '🌙', '⭐', '💫'].map((emoji, i) => (
          <div
            key={`decoration-${i}`}
            className="absolute text-2xl opacity-20 animate-bounce"
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
