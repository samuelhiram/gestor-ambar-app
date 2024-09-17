"use client";

import React, { createContext, useContext, useState } from "react";
import { ReactNode } from "react";

const AppContext = createContext(null);

export default function AppContextProvider({ children }) {
  const [state, setState] = useState({
    isTokenExpired: false,
    disableFetchButton: false,
    dialogMessage: "default indication",
    showDialogAlert: false,
    showSideBar: true,
  });

  const value = { state: state, setState: setState };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook para acceder al contexto
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error("useFlowContext must be used within a FlowContextProvider");
  }
  return context;
}
