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
  { name: "AI Coach", href: "/coach", icon: MessageCircle },
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

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="sm:block hidden"
                onClick={() => navigate('/coach')}
                aria-label="AI Teacher"
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                AI Teacher
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="sm:block hidden"
                onClick={() => navigate('/progress')}
                aria-label="Progress"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Progress
              </Button>

              <SkeuomorphicToggle />

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
