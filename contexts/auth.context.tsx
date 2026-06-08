"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import { AuthState } from "@/types/auth.types";

interface AuthContextType extends AuthState {
  login: (
    email: string,
    password: string
  ) => Promise<{ error?: string; success: boolean }>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error?: string; success: boolean }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const user = await response.json();
        setState({
          isAuthenticated: true,
          isLoading: false,
          user,
        });
      } else {
        setState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("Check session error:", error);
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ error?: string; success: boolean }> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch("/api/auth/login", {
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setState({
          isAuthenticated: true,
          isLoading: false,
          user: data,
        });
        return { success: true };
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return { error: data.error, success: false };
    } catch (err) {
      console.error("Auth context login error:", err);
      setState(prev => ({ ...prev, isLoading: false }));
      return { error: "Failed to connect to server", success: false };
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ error?: string; success: boolean }> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch("/api/auth/signup", {
        body: JSON.stringify({ email, name, password }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setState({
          isAuthenticated: true,
          isLoading: false,
          user: data,
        });
        return { success: true };
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return { error: data.error, success: false };
    } catch (err) {
      console.error("Auth context signup error:", err);
      setState(prev => ({ ...prev, isLoading: false }));
      return { error: "Failed to connect to server", success: false };
    }
  };

  const signInWithGoogle = async () => {
    console.log("Google Sign-In clicked");
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, logout, signInWithGoogle, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
