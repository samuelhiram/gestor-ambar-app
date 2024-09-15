"use client";
import React from "react";
import { useMainAppContext } from "./MainAppContext";
import { Icon } from "@iconify/react";

export default function ModuleLoaded() {
  const { state } = useMainAppContext();
  const module = state.modules.find(
    (module) => module.moduleName === state.activeModuleName
  );
  const { icon, description, moduleName } = module;
  return (
    <div
      className={`${
        !state.showSideBar ? "w-full" : "max-sm:hidden md:w-3/5 xl:w-3/4"
      } flex flex-col flex-1 bg-gray-200/30`}
    >
      <div className="p-4 flex flex-row item-center gap-2 border-b shadow-sm bg-white">
        <Icon icon={icon} width="38" height="38" style={{ color: "#1e3a8a" }} />
        <div className="flex flex-col">
          <div className="font-semibold text-md">{moduleName}</div>
          <div className="text-sm">{description}</div>
        </div>
      </div>
    </div>
  );
}
