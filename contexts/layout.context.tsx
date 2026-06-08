"use client";

import React, { createContext, useContext, useState } from "react";

interface LayoutContextType {
  headerActions: React.ReactNode;
  headerTitle: string;
  setHeaderActions: (actions: React.ReactNode) => void;
  setHeaderTitle: (title: string) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [headerTitle, setHeaderTitle] = useState("");
  const [headerActions, setHeaderActions] = useState<React.ReactNode>(null);

  return (
    <LayoutContext.Provider
      value={{
        headerActions,
        headerTitle,
        setHeaderActions,
        setHeaderTitle,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
