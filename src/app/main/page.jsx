"use client";
import React from "react";
import Sidebar from "./components/Sidebar";
import DropdownButton from "./components/DropdownButton";
import MainAppContextProvider, {
  useMainAppContext,
} from "./components/MainAppContext";
import ModuleLoaded from "./components/ModuleLoaded";
import { useEffect } from "react";

import Loader from "../components/Loader/Loader";

export default function page() {
  return (
    <MainAppContextProvider>
      <Main />
    </MainAppContextProvider>
  );
}

function Main() {
  const { state, setState } = useMainAppContext();
  useEffect(() => {
    const handleLoad = () => {
      console.log("La página está completamente renderizada");
    };
    window.addEventListener("load", handleLoad);
    return () => {
      window.removeEventListener("load", handleLoad);
      setState((prev) => ({ ...prev, isLoadingMainApp: false }));
    };
  }, []);

  return (
    <>
      {state.isLoadingMainApp ? (
        <>
          <div className="min-h-screen gap-2 w-full flex flex-row justify-center items-center">
            <Loader />
            <div className="text-xl">Cargando...</div>
          </div>
        </>
      ) : (
        <>
          <div className="min-h-screen w-full flex flex-row">
            <div className={`${state.showSideBar ? "w-1/4" : ""}`}>
              <Sidebar />
            </div>
            <div className={`${state.showSideBar ? "w-3/4" : "w-full"}`}>
              <ModuleLoaded />
            </div>
          </div>
          <DropdownButton />
        </>
      )}
    </>
  );
}
