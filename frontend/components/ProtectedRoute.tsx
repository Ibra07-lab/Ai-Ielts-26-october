import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, isLoading } = useUser();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">
                    Checking authentication...
                </p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const isCurrentlyOnboarding = location.pathname.startsWith('/onboarding');
    
    if (!user.onboardingCompleted && !isCurrentlyOnboarding) {
        return <Navigate to="/onboarding" replace />;
    }

    if (user.onboardingCompleted && isCurrentlyOnboarding) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}
