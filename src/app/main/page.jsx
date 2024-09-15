"use client";
import React from "react";
import Sidebar from "./components/Sidebar";
import DropdownButton from "./components/DropdownButton";
import MainAppContextProvider, {
  useMainAppContext,
} from "./components/MainAppContext";
import ModuleLoaded from "./components/ModuleLoaded";
export default function page() {
  return (
    <MainAppContextProvider>
      <Main />
    </MainAppContextProvider>
  );
}

function Main() {
  const { state } = useMainAppContext();
  return (
    <div className="min-h-screen w-full flex flex-row">
      <Sidebar />
      <ModuleLoaded />
      <DropdownButton />
    </div>
  );
}
