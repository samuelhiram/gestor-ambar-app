"use client";

import React, { createContext, useContext, useState } from "react";

import { appModules } from "../utils/appModules";

const MainAppContext = createContext(null);

export default function MainAppContextProvider({ children }) {
  const [state, setState] = useState({
    //this state executes any function that receives
    //a function as a parameter
    user: null,
    token: null,
    isLoadingMainApp: true,
    isLoadingModule: true,
    activeModuleName: "Inicio",
    showSideBar: true,
    showModule: true,
    modules: appModules,
    //
    //show actionRouter
    showActionsDialog: false,
    //
    //dialog alert
    showDialogAlert: false,
    dialogMessage: "default message",
    //Users module
    usersData: [],
    inactiveUsersData: [],
    //locations
    locations: [],
    //categories
    categories: [],
  });

  const value = { state, setState };

  return (
    <MainAppContext.Provider value={value}>{children}</MainAppContext.Provider>
  );
}

// Custom hook para acceder al contexto
export function useMainAppContext() {
  const context = useContext(MainAppContext);
  if (context === null) {
    throw new Error("useFlowContext must be used within a FlowContextProvider");
  }
  return context;
}
