import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

interface AppUser {
  id: string;        // Supabase UUID
  email: string;
  name: string;
  targetBand: number;
  examDate?: string;
  language: string;
  theme: string;
  onboardingCompleted: boolean;
  plan?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserContextType {
  user: AppUser | null;
  session: Session | null;
  setUser: (user: AppUser | null) => void;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function supabaseUserToAppUser(supabaseUser: SupabaseUser): AppUser {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || "",
    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0] || "Student",
    targetBand: supabaseUser.user_metadata?.targetBand || 7.0,
    examDate: supabaseUser.user_metadata?.examDate,
    language: supabaseUser.user_metadata?.language || "en",
    theme: supabaseUser.user_metadata?.theme || "light",
    onboardingCompleted: supabaseUser.user_metadata?.onboardingCompleted || false,
    plan: supabaseUser.user_metadata?.plan || "free",
    createdAt: supabaseUser.created_at,
    updatedAt: supabaseUser.updated_at || supabaseUser.created_at,
  };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser(supabaseUserToAppUser(session.user));
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          setUser(supabaseUserToAppUser(session.user));
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          name: name || email.split("@")[0],
          plan: "free"
        },
      },
    });
    return { error: error?.message || null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <UserContext.Provider
      value={{ user, session, setUser, isLoading, signIn, signUp, signOut }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
