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
  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  const isChatUI = location.pathname === '/tutor' || location.pathname === '/reading/tutor-chat';

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
            <div className="flex items-center gap-2">
              <Button
                variant="link"
                className="text-xl font-bold p-0 h-auto flex items-center gap-2"
                onClick={() => navigate('/')}
                aria-label="Go to Home"
              >
                <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
                  <span className="text-white dark:text-black font-black text-xs">AI</span>
                </div>
                <span className="text-sky-600 dark:text-sky-400">IELTS AI</span>
              </Button>
            </div>

            <div className="flex items-center gap-3">

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
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className={isChatUI ? "h-[calc(100vh-4rem)]" : "py-6"}>
          <div className={isChatUI ? "h-full" : "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
