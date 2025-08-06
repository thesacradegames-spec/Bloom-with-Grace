import { Flower2, BarChart3, Clock, Sparkles, Quote } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { UserDropdown } from "./user-dropdown";
import { ThemeToggle } from "./theme-toggle";
import { NotificationStatus } from "./notification-status";
import { getDailyQuote } from "@/lib/quotes-utils";

interface BloomHeaderProps {
  userName?: string;
  onUserNameChange?: (newName: string) => void;
}

export function BloomHeader({ userName = "diwakar", onUserNameChange }: BloomHeaderProps) {
  const location = useLocation();
  const dailyQuote = getDailyQuote();

  return (
    <header className="relative w-full px-4 sm:px-6 py-4 sm:py-6 overflow-hidden z-40">
      {/* Background with enhanced glass morphism */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-400/80 via-purple-500/80 to-blue-500/80 dark:from-purple-900/90 dark:via-black/80 dark:to-purple-800/90 backdrop-blur-xl transition-colors duration-500"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/10 to-transparent dark:from-purple-400/10 dark:via-purple-500/5 dark:to-transparent"></div>
      
      {/* Optimized decorative background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        {/* Static floating orbs */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-pink-300/20 to-purple-400/20 rounded-full blur-xl"></div>
        <div className="absolute -top-5 right-20 w-24 h-24 bg-gradient-to-br from-blue-300/20 to-pink-400/20 rounded-full blur-lg"></div>

        {/* Reduced floating sparkles */}
        {[...Array(3)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-white/15"
            style={{
              left: `${30 + i * 30}%`,
              top: `${30 + i * 20}%`,
              fontSize: '14px',
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
        {/* Enhanced Logo and Title */}
        <Link to="/dashboard" className="group flex items-center gap-2 sm:gap-4 hover:scale-105 transition-all duration-300">
          <div className="relative">
            <div className="bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-white/20 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Flower2 className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-full animate-pulse"></div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg tracking-wide">
              <span className="bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent">
                Her Daily Bloom
              </span>
            </h1>
            <p className="text-white/90 text-xs sm:text-sm font-medium tracking-wide drop-shadow-sm">
              ✨ Track your goals, bloom every day ✨
            </p>
          </div>
          <div className="block sm:hidden">
            <h1 className="text-lg font-bold text-white drop-shadow-lg tracking-wide">
              <span className="bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent">
                Her Daily Bloom
              </span>
            </h1>
          </div>
        </Link>

        {/* Enhanced Navigation and User Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Status */}
          <NotificationStatus />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Enhanced User Profile */}
          <div className="relative z-50">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-xl sm:rounded-2xl blur-lg"></div>
            <div className="relative bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 border border-white/20 shadow-lg">
              <UserDropdown
                userName={userName}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Quote Section */}
      <div className="max-w-7xl mx-auto mt-3 sm:mt-4 relative z-10">
        <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 dark:border-purple-400/30 shadow-lg mx-4 sm:mx-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="bg-white/20 dark:bg-purple-400/20 backdrop-blur-sm p-1.5 sm:p-2 rounded-lg border border-white/20 dark:border-purple-400/30 flex-shrink-0">
              <Quote className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <blockquote className="text-white/95 text-xs sm:text-sm font-medium italic leading-relaxed">
                "{dailyQuote.text}"
              </blockquote>
              {dailyQuote.author && (
                <div className="flex items-center gap-2 mt-1 sm:mt-2">
                  <div className="w-6 sm:w-8 h-px bg-white/30"></div>
                  <cite className="text-white/80 text-xs font-medium not-italic">
                    {dailyQuote.author}
                  </cite>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Bottom gradient line - hidden in dark mode for better UI */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 opacity-60 dark:opacity-0 transition-opacity duration-500"></div>
    </header>
  );
}
