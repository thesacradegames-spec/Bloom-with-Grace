import { Link, useLocation } from "react-router-dom";
import { BarChart3, Clock, Home, Sparkles } from "lucide-react";

export function MainNavTabs() {
  const location = useLocation();

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      description: 'Your daily garden'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      description: 'Track your progress'
    },
    {
      id: 'history',
      label: 'History',
      icon: Clock,
      path: '/history',
      description: 'Past achievements'
    }
  ];

  return (
    <div className="mb-6 sm:mb-8">
      <div className="bg-white/10 dark:bg-white/5 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 border border-white/20 dark:border-purple-400/30 shadow-xl transition-colors duration-300">
        <div className="flex items-center justify-center">
          <nav className="flex items-center gap-1 sm:gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = location.pathname === tab.path;

              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`group relative px-3 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center gap-2 sm:gap-3 font-medium ${
                    isActive
                      ? 'bg-white/20 dark:bg-purple-400/30 text-white shadow-lg scale-105 border border-white/30 dark:border-purple-300/50'
                      : 'text-white/80 hover:text-white hover:bg-white/10 dark:hover:bg-purple-400/20 hover:scale-105'
                  }`}
                >
                  {/* Background glow for active tab */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-xl sm:rounded-2xl blur-lg animate-pulse" />
                  )}

                  <div className="relative z-10 flex items-center gap-2 sm:gap-3">
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                      isActive ? 'animate-pulse' : 'group-hover:animate-pulse'
                    }`} />
                    <div className="hidden sm:block">
                      <div className="font-semibold text-sm">{tab.label}</div>
                      <div className="text-xs opacity-80">{tab.description}</div>
                    </div>
                    <div className="block sm:hidden">
                      <div className="font-semibold text-xs">{tab.label}</div>
                    </div>
                  </div>

                  {/* Cute floating sparkles for active tab */}
                  {isActive && (
                    <>
                      <Sparkles className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 text-yellow-300 animate-pulse" />
                      <Sparkles className="absolute -bottom-0.5 -left-0.5 sm:-bottom-1 sm:-left-1 w-2 h-2 sm:w-3 sm:h-3 text-pink-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
