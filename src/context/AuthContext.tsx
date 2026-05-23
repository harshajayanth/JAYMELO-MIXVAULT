import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";
import bcrypt from "bcryptjs";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PASSWORD_HASH = import.meta.env.VITE_PASSWORD_HASH || "";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (localStorage.getItem("mixvault_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (password: string) => {
    if (bcrypt.compareSync(password, PASSWORD_HASH)) {
      setIsAuthenticated(true);
      localStorage.setItem("mixvault_auth", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("mixvault_auth");
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
