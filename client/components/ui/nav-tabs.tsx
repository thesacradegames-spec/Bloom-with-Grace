import { useNavigate, useLocation } from "react-router-dom";
import { BarChart3, Calendar, Target, Home } from "lucide-react";

export function NavTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      color: 'from-pink-400 to-purple-400'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      id: 'history',
      label: 'History',
      icon: Calendar,
      path: '/history',
      color: 'from-green-400 to-blue-400'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-2 shadow-xl animate-fade-in mb-6 sm:mb-8">
      <div className="flex gap-1 sm:gap-2">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const active = isActive(tab.path);
          
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 ${
                active
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                  : 'text-white/80 hover:text-white hover:bg-white/10 hover:scale-105'
              }`}
            >
              <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline font-medium text-sm sm:text-base">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
