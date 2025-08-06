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
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CUTE_CHARACTERS[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !birthday || !selectedCharacter) return;

    setIsLoading(true);

    // Simulate loading for smooth transition
    setTimeout(() => {
      onComplete({
        name: name.trim(),
        birthday,
        character: selectedCharacter.id
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600 dark:from-black dark:via-purple-900 dark:to-purple-800 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden transition-colors duration-500">
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
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative z-10 border border-white/20 animate-fade-in">
        
        {/* Decorative border glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-300/20 via-purple-300/20 to-blue-300/20 opacity-60 animate-pulse"></div>
        
        {/* Header section with app icon */}
        <div className="text-center mb-6 sm:mb-8 relative z-10">
          {/* App icon and title */}
          <div className="mb-4 sm:mb-6 relative">
            <div className="bg-gradient-to-br from-pink-400/30 to-purple-400/30 backdrop-blur-sm p-4 sm:p-6 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center mb-3 sm:mb-4 border border-white/30 shadow-lg">
              <span className="text-2xl sm:text-3xl">🌸</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-white drop-shadow-lg mb-2 sm:mb-3 tracking-wide">
            Her Daily Bloom
          </h1>

          <p className="text-white/90 text-base sm:text-lg mb-3 sm:mb-4">
            ✨ Track your goals, bloom every day ✨
          </p>

          <p className="text-xs sm:text-sm text-white/80 mb-4 sm:mb-6">
            Your personal journey to achieving dreams starts here!
          </p>

          {/* Welcome section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 border border-white/20">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">🌸 Welcome, Beautiful! 🌸</h2>
            <p className="text-white/80 text-xs sm:text-sm">
              Ready to start your amazing journey? Enter your name below and let's begin tracking your daily goals together!
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selected Character Display */}
          <div className="space-y-3 mb-6">
            <div className="text-center">
              <div className={`bg-gradient-to-r ${selectedCharacter.color} backdrop-blur-sm p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-3 border border-white/30 shadow-lg transition-all duration-300`}>
                <span className="text-3xl drop-shadow-lg">{selectedCharacter.emoji}</span>
              </div>
              <p className="text-white font-medium mb-2">{selectedCharacter.name}</p>
              <p className="text-white/70 text-xs">{selectedCharacter.description}</p>
            </div>

            {/* Character Selection Grid */}
            <Label className="text-white font-medium text-center block">
              Choose Your Profile Character 🎭
            </Label>
            <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto bg-white/5 rounded-2xl p-3 border border-white/20 backdrop-blur-sm">
              {CUTE_CHARACTERS.map((character) => (
                <button
                  key={character.id}
                  type="button"
                  onClick={() => setSelectedCharacter(character)}
                  className={`p-2 rounded-lg transition-all duration-200 border ${
                    selectedCharacter.id === character.id
                      ? 'border-white/60 bg-white/20 shadow-lg scale-110'
                      : 'border-white/20 bg-white/10 hover:bg-white/20 hover:scale-105'
                  }`}
                  disabled={isLoading}
                >
                  <div className="text-xl">{character.emoji}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white font-medium text-left block">
              Your Beautiful Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white/40 focus:ring-white/20 backdrop-blur-sm h-12 text-lg"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Birthday Field */}
          <div className="space-y-2">
            <Label htmlFor="birthday" className="text-white font-medium text-left block">
              Your Special Day 🎂
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <Input
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white focus:border-white/40 focus:ring-white/20 backdrop-blur-sm [&::-webkit-calendar-picker-indicator]:invert h-12"
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
            disabled={!name.trim() || !birthday || !selectedCharacter || isLoading}
            className="w-full bg-gradient-to-r from-pink-500/80 to-purple-500/80 hover:from-pink-600/90 hover:to-purple-600/90 text-white py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg relative overflow-hidden border border-white/20 backdrop-blur-sm"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Setting up your garden...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                ✨ Start Your Journey ✨
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
            <p className="text-xs text-white/80 font-medium">Analytics</p>
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
          <p className="text-xs text-white/70 italic mb-2">
            💖 Your progress will be saved automatically 💖
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
