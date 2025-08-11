import { useNavigate, useLocation } from "react-router-dom";
import { Home, TrendingUp, MessageCircle, CreditCard, Settings } from "lucide-react";

export default function DiamondNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      path: "/",
      description: "Access all IELTS sections",
    },
    {
      id: "progress",
      label: "Progress",
      icon: TrendingUp,
      path: "/progress",
      description: "View your study statistics",
    },
    {
      id: "ai-agent",
      label: "AI Agent",
      icon: MessageCircle,
      path: "/coach",
      description: "Get personalized help",
      isPrimary: true,
    },
    {
      id: "subscription",
      label: "Subscription",
      icon: CreditCard,
      path: "/subscription",
      description: "Manage your plan",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/settings",
      description: "Account & preferences",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center justify-center space-x-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-full px-6 py-4 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isPrimary = item.isPrimary;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`group relative transition-all duration-300 ease-out ${
                isPrimary 
                  ? "transform hover:scale-110" 
                  : "transform hover:scale-105"
              }`}
              title={item.description}
            >
              {/* Diamond shape container */}
              <div
                className={`
                  relative w-14 h-14 transform rotate-45 transition-all duration-300 ease-out
                  ${isPrimary ? "w-16 h-16" : ""}
                  ${isActive 
                    ? isPrimary 
                      ? "bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/50" 
                      : "bg-gradient-to-br from-sky-400 to-sky-600 shadow-md shadow-sky-400/30"
                    : isPrimary
                      ? "bg-gradient-to-br from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 shadow-md shadow-sky-400/20 hover:shadow-lg hover:shadow-sky-500/40"
                      : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-sky-100 hover:to-sky-200 dark:hover:from-sky-800 dark:hover:to-sky-700"
                  }
                `}
              >
                {/* Icon container - counter-rotate to keep icon upright */}
                <div className="absolute inset-0 flex items-center justify-center transform -rotate-45">
                  <Icon 
                    className={`
                      transition-all duration-300 ease-out
                      ${isPrimary ? "w-7 h-7" : "w-5 h-5"}
                      ${isActive || isPrimary 
                        ? "text-white" 
                        : "text-gray-600 dark:text-gray-300 group-hover:text-sky-600 dark:group-hover:text-sky-400"
                      }
                    `} 
                  />
                </div>

                {/* Glow effect for primary button */}
                {isPrimary && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 opacity-20 blur-md animate-pulse" />
                )}

                {/* Active indicator */}
                {isActive && !isPrimary && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-sky-500 rounded-full transform rotate-45 border-2 border-white dark:border-gray-800" />
                )}
              </div>

              {/* Label */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span 
                  className={`
                    text-xs font-medium transition-all duration-300
                    ${isActive || isPrimary
                      ? "text-sky-600 dark:text-sky-400" 
                      : "text-gray-500 dark:text-gray-400 group-hover:text-sky-600 dark:group-hover:text-sky-400"
                    }
                  `}
                >
                  {item.label}
                </span>
              </div>

              {/* Hover tooltip */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded whitespace-nowrap">
                  {item.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
