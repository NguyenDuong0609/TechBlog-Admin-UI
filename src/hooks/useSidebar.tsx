"use client";

import React, { useState, createContext, useContext, useCallback } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  isOpen: boolean;
  toggleCollapse: () => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: SidebarProviderProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isOpen, setIsOpenState] = useState(false);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpenState((prev) => !prev);
  }, []);

  const setOpen = useCallback((open: boolean) => {
    setIsOpenState(open);
  }, []);

  const contextValue = { isCollapsed, isOpen, toggleCollapse, toggleOpen, setOpen };

  return React.createElement(SidebarContext.Provider, { value: contextValue }, children);
}