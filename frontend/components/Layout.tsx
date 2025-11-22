import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  TrendingUp,
  Settings,
  MessageCircle,
  Menu,
  X,
  CreditCard,
  GraduationCap,
  Sun,
  Moon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Progress Tracker", href: "/progress-tracker", icon: TrendingUp },
  { name: "AI Coach", href: "/coach", icon: MessageCircle },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800 shadow-xl">
          <div className="flex h-16 items-center justify-between px-4">
            <Button
              variant="link"
              className="text-xl font-bold text-sky-600 dark:text-sky-400 p-0 h-auto"
              onClick={() => { navigate('/'); setSidebarOpen(false); }}
              aria-label="Go to Home"
            >
              IELTS AI
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                      ? "bg-sky-100 text-sky-900 dark:bg-sky-900 dark:text-sky-100"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                    }`}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar - Hidden on larger screens */}
      <div className="hidden">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex h-16 items-center px-4">
            <Button
              variant="link"
              className="text-xl font-bold text-sky-600 dark:text-sky-400 p-0 h-auto"
              onClick={() => navigate('/')}
              aria-label="Go to Home"
            >
              IELTS AI
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                      ? "bg-sky-100 text-sky-900 dark:bg-sky-900 dark:text-sky-100"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                    }`}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content - Full width */}
      <div className="w-full">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <Button
                variant="link"
                className="text-xl font-bold text-sky-600 dark:text-sky-400 lg:block hidden p-0 h-auto"
                onClick={() => navigate('/')}
                aria-label="Go to Home"
              >
                IELTS AI
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="ml-4 lg:block hidden"
                onClick={() => navigate('/coach')}
                aria-label="AI Teacher"
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                AI Teacher
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="ml-2 lg:block hidden"
                onClick={() => navigate('/progress')}
                aria-label="Progress"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Progress
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="ml-2 lg:block hidden"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>

              {user && (
                <div className="text-sm text-gray-600 dark:text-gray-300 ml-auto">
                  Welcome back, <span className="font-medium">{user.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className={location.pathname === '/tutor' || location.pathname === '/reading/tutor-chat' ? "h-[calc(100vh-4rem)]" : "py-6"}>
          <div className={location.pathname === '/tutor' || location.pathname === '/reading/tutor-chat' ? "h-full" : "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
