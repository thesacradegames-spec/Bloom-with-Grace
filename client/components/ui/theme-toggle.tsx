import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="group relative w-12 h-12 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 dark:border-purple-400/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-white/20 dark:hover:bg-purple-400/20"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 to-purple-300/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Icon container */}
      <div className="relative z-10">
        {theme === 'light' ? (
          <Moon className="w-5 h-5 text-white drop-shadow-lg transition-transform duration-300 group-hover:rotate-12" />
        ) : (
          <Sun className="w-5 h-5 text-white drop-shadow-lg transition-transform duration-300 group-hover:rotate-12" />
        )}
      </div>
      
      {/* Cute floating sparkles */}
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-pulse opacity-60" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-300 rounded-full animate-pulse opacity-60" style={{ animationDelay: '0.5s' }} />
    </button>
  );
}
