"use client";

import React, { createContext, useContext, useState } from "react";

import { appModules } from "../utils/appModules";

const MainAppContext = createContext(null);

var userModuleData = {
  id: 0,
  icon: "lets-icons:user-cicrle-duotone",
  moduleName: "Usuario",
  title: "Samuel Hiram",
  description: "Admin",
};

appModules.push(userModuleData);

export default function MainAppContextProvider({ children }) {
  const [state, setState] = useState({
    isLoadingMainApp: true,
    isLoadingModule: true,
    activeModuleName: "Inicio",
    showSideBar: true,
    showModule: true,
    modules: appModules,
    userModuleData: userModuleData,

    //Users module
    usersData: [],
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
