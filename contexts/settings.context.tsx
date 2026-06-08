"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import { useAuth } from "@/contexts/auth.context";
import { Settings } from "@/types/settings.types";

interface SettingsContextType {
  deleteApiKey: (keyId: string, provider?: string) => Promise<void>;
  isSettingsLoaded: boolean;
  saveApiKey: (
    key: string,
    provider?: string,
    priority?: number,
    description?: string
  ) => Promise<void>;
  settings: Settings;
  updateApiKey: (
    keyId: string,
    updates: { description?: string; priority?: number },
    provider?: string
  ) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [settings, setSettings] = useState<Settings>({
    apiKeys: {},
    hasGeminiApiKey: false,
    theme: "system",
  });
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated]);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/user/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({
          ...prev,
          apiKeys: data.keys || {},
          hasGeminiApiKey: data.hasGeminiKey,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setIsSettingsLoaded(true);
    }
  };

  const saveApiKey = async (
    key: string,
    provider: string = "Gemini",
    priority: number = 1,
    description: string = "API Key"
  ) => {
    try {
      const response = await fetch("/api/user/settings", {
        body: JSON.stringify({
          geminiApiKey: key,
          meta: { description },
          priority,
          provider,
        }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });

      const data = await response.json();

      if (response.ok) {
        // Refetch to get updated list of keys and their IDs
        await fetchSettings();
      } else {
        console.error(
          "Save API key failed server-side:",
          data.error || "Unknown error",
          data.stack
        );
        throw new Error(data.error || "Failed to save API key");
      }
    } catch (error) {
      console.error("Save API key error:", error);
      throw error;
    }
  };

  const updateApiKey = async (
    keyId: string,
    updates: { description?: string; priority?: number },
    provider: string = "Gemini"
  ) => {
    try {
      const response = await fetch("/api/user/settings", {
        body: JSON.stringify({
          keyId,
          meta: updates.description
            ? { description: updates.description }
            : undefined,
          priority: updates.priority,
          provider,
        }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });

      if (response.ok) {
        await fetchSettings();
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to update key");
      }
    } catch (error) {
      console.error("Update key error:", error);
      throw error;
    }
  };

  const deleteApiKey = async (keyId: string, provider: string = "Gemini") => {
    try {
      const response = await fetch("/api/user/settings", {
        body: JSON.stringify({ keyId, provider }),
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
      });

      if (response.ok) {
        await fetchSettings();
      } else {
        const data = await response.json();
        console.error("Delete API key failed:", data.error);
        throw new Error(data.error || "Failed to delete API key");
      }
    } catch (error) {
      console.error("Delete API key error:", error);
      throw error;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        deleteApiKey,
        isSettingsLoaded,
        saveApiKey,
        settings,
        updateApiKey,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
