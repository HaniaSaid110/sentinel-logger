import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authService } from "../services/authService";

export interface Developer {
  id: string;
  username: string;
  email: string;
  apiKey: string;
}

interface AuthContextType {
  developer: Developer | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshSession = async () => {
    try {
      const data = await authService.getMe();
      if (data?.developer) {
        setDeveloper(data.developer);
      } else {
        setDeveloper(null);
      }
    } catch {
      setDeveloper(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      if (data?.developer) {
        setDeveloper(data.developer);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message, { cause: error });
      }
      throw new Error("Login failed", { cause: error });
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    setLoading(true);
    try {
      const data = await authService.register(username, email, password);
      if (data?.developer) {
        setDeveloper(data.developer);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message, { cause: error });
      }
      throw new Error("Registration failed", { cause: error });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setDeveloper(null);
    } catch (error: unknown) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ developer, loading, login, register, logout, refreshSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
