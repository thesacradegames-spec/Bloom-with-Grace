import { Link, useLocation } from "react-router-dom";
import { BarChart3, Home } from "lucide-react";

interface NavTabsProps {
  activeTab: "dashboard" | "analytics";
  onTabChange?: (tab: "dashboard" | "analytics") => void;
}

export function NavTabs({ activeTab }: NavTabsProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <div className="flex items-center justify-center mb-10">
      <div className="relative bg-white/20 backdrop-blur-lg rounded-2xl p-1.5 border border-white/30 shadow-lg">
        {/* Background slider */}
        <div className={`absolute top-1.5 bottom-1.5 w-1/2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-300 ${
          currentPath === "/analytics" ? "translate-x-full" : "translate-x-0"
        }`}></div>
        
        <div className="flex relative z-10">
          <Link
            to="/dashboard"
            className={`relative px-8 py-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 min-w-[140px] justify-center ${
              currentPath === "/dashboard"
                ? "text-gray-800 scale-105"
                : "text-white/90 hover:text-white hover:scale-105"
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
            {currentPath === "/dashboard" && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            )}
          </Link>
          
          <Link
            to="/analytics"
            className={`relative px-8 py-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 min-w-[140px] justify-center ${
              currentPath === "/analytics"
                ? "text-gray-800 scale-105"
                : "text-white/90 hover:text-white hover:scale-105"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
            {currentPath === "/analytics" && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            )}
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}
