import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';

// Update the user type: role is now an array of strings
interface UserType {
  user_id: number;
  username: string;
  role: string[];  // <-- multiple roles
  jumuiya_id: number;
}

interface AuthContextType {
  user: UserType | null;
  token: string | null;
  login: (userData: UserType, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  getAuthToken: () => string | null;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Check for stored user/token on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      setUser(JSON.parse(storedUser));
    }
    if (storedToken && storedToken !== "undefined" && storedToken !== "null") {
      setToken(storedToken);
    }
  }, []);

  const login = (userData: UserType, authToken: string) => {
    console.log("AuthContext login called with:", userData, authToken);
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
    console.log("AuthContext user state after login:", userData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const getAuthToken = () => {
    return token || localStorage.getItem('token');
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        getAuthToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};