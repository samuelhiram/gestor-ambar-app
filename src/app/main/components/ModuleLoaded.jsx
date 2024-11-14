"use client";
import React, { useEffect } from "react";
import { useMainAppContext } from "./MainAppContext";
import { Icon } from "@iconify/react";
//
import Inventory from "./modules/Inventory";
import Start from "./modules/Start";
import User from "./modules/User";
import Users from "./modules/Users";
import Catalogs from "./modules/Catalogs";
import Loader from "../../components/Loader/Loader";

//
export default function ModuleLoaded() {
  const { state } = useMainAppContext();
  const module = state.modules.find(
    (module) => module.moduleName === state.activeModuleName
  );
  const { icon, description, moduleName } = module;
  // console.log("activeModuleName-> ", state.activeModuleName);

  useEffect(() => {
    localStorage.setItem("activeModuleName", state.activeModuleName);
    console.log(localStorage.getItem("activeModuleName"));
  }, [state.activeModuleName]);

  return (
    <div
      className={`${
        !state.showSideBar ? "" : ""
      } h-full flex flex-col flex-1 bg-gray-200/30 `}
    >
      <div className="fixed z-20 w-full p-4 flex flex-row item-center gap-2 border-b shadow-sm bg-white">
        <Icon icon={icon} width="38" height="38" style={{ color: "#1e3a8a" }} />
        <div className="flex flex-col">
          <div className="font-semibold text-md">{moduleName}</div>
          <div className="text-sm">{description}</div>
        </div>
      </div>

      <div className="w-full p-4 flex flex-row item-center gap-2 border-b shadow-sm bg-white">
        <Icon icon={icon} width="38" height="38" style={{ color: "#1e3a8a" }} />
        <div className="flex flex-col">
          <div className="font-semibold text-md">{moduleName}</div>
          <div className="text-sm">{description}</div>
        </div>
      </div>

      {state.isLoadingModule ? (
        <div
          className={`${
            state.showSideBar
              ? "w-3/4 bg-gray-50 absolute z-10 flex flex-row gap-4 justify-center items-center"
              : "w-full flex flex-row gap-4 justify-center items-center"
          }`}
        >
          <Loader />
          <div className="text-xl">Cargando... {state.activeModuleName}</div>
        </div>
      ) : null}

      <div className={`p-4`}>
        {state.activeModuleName === "Inicio" && <Start />}
        {state.activeModuleName === "Inventario" && <Inventory />}
        {state.activeModuleName === "Usuario" && <User />}
        {state.activeModuleName === "Usuarios" && <Users />}
        {state.activeModuleName === "Catalogos" && <Catalogs />}
      </div>
    </div>
  );
}
