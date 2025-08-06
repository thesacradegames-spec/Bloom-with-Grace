import { useEffect, useState } from "react";
import { X, Cake, Sparkles, Heart, Gift, Star, Crown } from "lucide-react";
import { Button } from "./button";
import { isTodayUsersBirthday, getUserAge } from "@/lib/birthday-utils";
import { getCurrentUser } from "@/lib/user-data-utils";

interface BirthdayPopupProps {
  currentDate: string;
}

export function BirthdayPopup({ currentDate }: BirthdayPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [userAge, setUserAge] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    // Check if today is the user's birthday
    if (isTodayUsersBirthday(currentDate, currentUser)) {
      setUserName(currentUser);
      setUserAge(getUserAge(currentUser));

      // Show popup after a brief delay
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, [currentDate]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Subtle background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gentle floating hearts */}
        {[...Array(8)].map((_, i) => (
          <Heart
            key={`heart-${i}`}
            className="absolute text-pink-300 opacity-40 animate-bounce"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${15 + Math.random() * 70}%`,
              fontSize: `${18 + Math.random() * 8}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `3s`
            }}
          />
        ))}
        
        {/* Soft twinkling stars */}
        {[...Array(12)].map((_, i) => (
          <Star
            key={`star-${i}`}
            className="absolute text-yellow-200 opacity-50 animate-pulse"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              fontSize: `${12 + Math.random() * 6}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `2s`
            }}
          />
        ))}
      </div>

      {/* Main popup with gentle entrance */}
      <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-8 rounded-3xl shadow-2xl max-w-lg w-full relative overflow-hidden animate-fade-in">
        
        {/* Subtle border glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 opacity-30"></div>
        <div className="absolute inset-1 rounded-3xl bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100"></div>
        
        {/* Minimal confetti decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {[...Array(12)].map((_, i) => {
            const shapes = ['🎉', '✨', '🌟', '💖', '🎈'];
            const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
            
            return (
              <div
                key={`confetti-${i}`}
                className="absolute text-pink-400 opacity-60 text-sm"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              >
                {randomShape}
              </div>
            );
          })}
        </div>
        
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-white/30 rounded-full transition-all duration-200 z-20"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Content */}
        <div className="text-center relative z-10">
          {/* Simple crown decoration */}
          <div className="mb-4">
            <Crown className="w-10 h-10 text-yellow-500 mx-auto animate-pulse" />
          </div>

          {/* Main cake icon with gentle animation */}
          <div className="mb-6 relative">
            <div className="relative inline-block">
              <Cake className="w-16 h-16 text-pink-600 mx-auto animate-pulse drop-shadow-lg" />
              <Sparkles className="w-6 h-6 text-purple-500 absolute -top-1 -right-1 animate-pulse" />
              <Gift className="w-5 h-5 text-blue-500 absolute -bottom-1 -left-1 opacity-70" />
            </div>
          </div>
          
          {/* Title with gentle gradient */}
          <h2 className="text-3xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            🎉 Happy Birthday{userName ? `, ${userName}` : ''}! 🎂
          </h2>

          {/* Simple subtitle with age */}
          <h3 className="text-lg font-medium text-purple-600 mb-4">
            ✨ {userAge ? `Celebrating ${userAge} amazing years!` : 'Wishing you a wonderful day!'} ✨
          </h3>

          {/* Birthday message in calm container */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-pink-200">
            <p className="text-base text-gray-700 mb-2 leading-relaxed">
              🌟 May this special day bring you joy, success, and all the happiness you deserve!
            </p>
            <p className="text-sm text-purple-600 font-medium">
              Keep blooming and achieving your dreams! ✨
            </p>
          </div>

          {/* Simple celebration cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-3">
              <div className="text-xl mb-1">🎈</div>
              <div className="text-xs font-medium text-pink-600">Birthday</div>
              <div className="text-sm font-semibold text-pink-700">Wishes!</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
              <div className="text-xl mb-1">🎁</div>
              <div className="text-xs font-medium text-purple-600">Special</div>
              <div className="text-sm font-semibold text-purple-700">Day!</div>
            </div>
          </div>
          
          {/* Simple button */}
          <Button
            onClick={() => setIsVisible(false)}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
          >
            Thank you! 💖
          </Button>

          {/* Gentle footer message */}
          <div className="mt-4">
            <p className="text-xs text-gray-500 italic">
              🌈 Hope your birthday is filled with wonderful moments! 🌈
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
