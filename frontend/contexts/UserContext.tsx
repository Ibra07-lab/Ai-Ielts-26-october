import { createContext, useContext, useState, useEffect } from "react";
import type { User } from "~backend/ielts/user";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) {
      // In a real app, you would fetch the user data here
      // For now, we'll create a mock user
      const mockUser: User = {
        id: parseInt(savedUserId),
        name: "John Doe",
        targetBand: 7.5,
        examDate: "2024-06-15",
        language: "en",
        theme: "light",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(mockUser);
    }
    setIsLoading(false);
  }, []);

  const updateUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem("userId", newUser.id.toString());
    } else {
      localStorage.removeItem("userId");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, isLoading }}>
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
