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
  Sun,
  Moon,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import SkeuomorphicToggle from "./ui/SkeuomorphicToggle";
import { Logo } from "./ui/Logo";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
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

  const isFullHeightUI = location.pathname === '/tutor' || location.pathname === '/reading/tutor-chat' || location.pathname === '/vocabulary' || location.pathname === '/plan';
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen mesh-gradient">
      {/* Main content - Full width */}
      <div className="w-full">
        {/* Top bar (Hidden on Landing Page) */}
        {!isLandingPage && (
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
              
              {/* Left: Logo */}
              <Link to="/dashboard" className="flex items-center gap-2 group w-1/3">
                <Logo className="w-9 h-9 text-indigo-600 dark:text-indigo-500 group-hover:scale-105 transition-transform" />
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors hidden sm:block">
                  NewBand
                </span>
              </Link>

              {/* Center: Spare space (Logo is left, controls are right) */}
              <div className="flex-1 flex justify-center w-1/3">
              </div>

              {/* Right: Controls */}
              <div className="flex items-center justify-end w-1/3 gap-3 lg:gap-5">
                
                {/* Notification Bell stub */}
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </button>

                <div className="scale-75 origin-right lg:scale-90">
                  <SkeuomorphicToggle />
                </div>

                {user ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 h-9 px-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 hover:text-slate-900 transition-all border border-transparent shadow-sm hover:border-slate-200"
                    onClick={handleLogout}
                    aria-label="Sign out"
                  >
                    <span className="hidden sm:inline text-sm">{user.email?.split('@')[0] || 'ibragimkovalenko'}</span>
                    <LogOut className="h-4 w-4 ml-1 opacity-50" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 h-9 px-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold transition-all shadow-sm"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className={isLandingPage ? "" : isFullHeightUI ? "h-[calc(100vh-4rem)]" : "py-6"}>
          <div className={isLandingPage ? "w-full" : isFullHeightUI ? "h-full" : "w-full"}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
