import React from "react";
import Image from "next/image";
import SidebarUser from "./SidebarUser";
import SidebarMenuItem from "./SidebarMenuItem";
import Logo from "./Logo";
import { useMainAppContext } from "./MainAppContext";
import DropdownButton from "./DropdownButton";

export default function Sidebar() {
  const { state } = useMainAppContext();
  return (
    <nav
      className={`${
        !state.showSideBar ? "hidden" : "visible"
      }  w-full md:w-2/5 xl:w-1/4 border-gray-200 md:border-r flex flex-col shadow-md`}
    >
      <Logo />
      {/* <div className="w-full">
        <div className="w-full p-3">
          <p>Usuario</p>
        </div>
      </div> */}
      {/* <SidebarMenuItem receivedModule={state.userModuleData} /> */}
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
