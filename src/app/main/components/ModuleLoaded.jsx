"use client";
import React from "react";
import { useMainAppContext } from "./MainAppContext";

export default function ModuleLoaded() {
  const { state } = useMainAppContext();
  console.log("showSideBar:  ", state.showSideBar);
  return (
    <div
      className={`${
        !state.showSideBar ? "w-full" : "max-sm:hidden md:w-3/5 xl:w-3/4"
      } bg-red-100 border-gray-200 border-r flex  shadow-md`}
    >
      {state.activeModuleName}
    </div>
  );
}
