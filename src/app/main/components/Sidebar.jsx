import React from "react";
import SidebarMenuItem from "./SidebarMenuItem";
import Logo from "./Logo";
import { useMainAppContext } from "./MainAppContext";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { Icon } from "@iconify/react";

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
      <div className="flex flex-1  items-end justify-end">
        <div
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className=" justify-center items-center flex gap-2 border p-2 m-5 cursor-pointer hover:bg-blue-100 text-blue-900 font-semibold active:bg-blue-200 rounded-md"
        >
          <Icon
            icon="system-uicons:exit-right"
            width="24"
            height="24"
            style={{ color: "#1e3a8a" }}
          />
          <div>Salir</div>
        </div>
      </div>
    </nav>
  );
}
