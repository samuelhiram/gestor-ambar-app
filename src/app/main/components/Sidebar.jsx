import React from "react";
import SidebarMenuItem from "./SidebarMenuItem";
import Logo from "./Logo";
import { useMainAppContext } from "./MainAppContext";
import { useEffect } from "react";

export default function Sidebar() {
  const { state, setState } = useMainAppContext();

  return (
    <nav
      className={`${
        !state.showSideBar ? "hidden" : "visible"
      } fixed z-20 h-full w-1/4 max-sm:w-full flex flex-col flex-1 flex-grow-0 bg-gray-50 border-gray-200 md:border-r`}
    >
      <Logo />
      <div className="w-full">
        <div className="w-full py-3 px-5">
          <p>Menú</p>
        </div>
      </div>
      {Object.keys(state.modules).map((key) => {
        return (
          <SidebarMenuItem
            key={state.modules[key].moduleName}
            receivedModule={state.modules[key]}
          />
        );
      })}
    </nav>
  );
}
