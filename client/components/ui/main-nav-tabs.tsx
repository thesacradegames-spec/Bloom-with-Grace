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
    <div className="mb-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-2 border border-white/20 shadow-xl">
        <div className="flex items-center justify-center">
          <nav className="flex items-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = location.pathname === tab.path;
              
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`group relative px-6 py-4 rounded-2xl transition-all duration-300 flex items-center gap-3 font-medium ${
                    isActive
                      ? 'bg-white/20 text-white shadow-lg scale-105 border border-white/30'
                      : 'text-white/80 hover:text-white hover:bg-white/10 hover:scale-105'
                  }`}
                >
                  {/* Background glow for active tab */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-2xl blur-lg animate-pulse" />
                  )}
                  
                  <div className="relative z-10 flex items-center gap-3">
                    <Icon className={`w-5 h-5 transition-all duration-300 ${
                      isActive ? 'animate-pulse' : 'group-hover:animate-pulse'
                    }`} />
                    <div className="hidden sm:block">
                      <div className="font-semibold text-sm">{tab.label}</div>
                      <div className="text-xs opacity-80">{tab.description}</div>
                    </div>
                  </div>
                  
                  {/* Cute floating sparkles for active tab */}
                  {isActive && (
                    <>
                      <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" />
                      <Sparkles className="absolute -bottom-1 -left-1 w-3 h-3 text-pink-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
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
