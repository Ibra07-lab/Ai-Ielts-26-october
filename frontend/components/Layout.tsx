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
  Moon,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import SkeuomorphicToggle from "./ui/SkeuomorphicToggle";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Progress Tracker", href: "/progress-tracker", icon: TrendingUp },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useUser();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const isFullHeightUI = location.pathname === '/tutor' || location.pathname === '/reading/tutor-chat' || location.pathname === '/vocabulary';

  return (
    <div className="min-h-screen mesh-gradient">
      {/* Main content - Full width */}
      <div className="w-full">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center px-4 sm:px-6 lg:px-8 border-b border-gray-200 bg-white/50 backdrop-blur-md shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                NewBand
              </span>
            </Link>

            <div className="flex items-center justify-end w-full gap-3">

              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center h-10 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all duration-300"
                onClick={() => navigate('/progress')}
                aria-label="Progress"
              >
                <TrendingUp className="h-4 w-4 mr-2 text-emerald-500 dark:text-emerald-400" />
                Progress
              </Button>

              <div className="ml-2">
                <SkeuomorphicToggle />
              </div>

              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 h-10 px-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
                  onClick={handleLogout}
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">{user.email?.split('@')[0]}</span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 h-10 px-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className={isFullHeightUI ? "h-[calc(100vh-4rem)]" : "py-6"}>
          <div className={isFullHeightUI ? "h-full" : "w-full"}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
