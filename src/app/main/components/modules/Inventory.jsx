"use client";
import React, { useEffect } from "react";
import CreateCategory from "./components/CreateCategory";
import CreateUnit from "./components/CreateUnit";
import CreateUbication from "./components/CreateUbication";
import CreateItem from "./components/CreateItem";

import { useMainAppContext } from "../../components/MainAppContext";

export default function Inventory() {
  const { state, setState } = useMainAppContext();

  useEffect(() => {
    localStorage.setItem("activeModuleName", "Inventario");
    setState((prev) => ({
      ...prev,
      isLoadingModule: true,
    }));

    setState((prev) => ({
      ...prev,
      isLoadingModule: false,
    }));
  }, []);
  return (
    <div className="flex flex-col gap-3">
      <CreateItem />

      {state.user.role === "admin" && (
        //
        <div className="flex flex-row max-md:flex-col gap-2">
          <div className="w-full">
            <CreateCategory />
          </div>
          <div className="w-full">
            <CreateUnit />
          </div>
          <div className="w-full">
            <CreateUbication />
          </div>
        </div>
        //
      )}
      {/* <div className="bg-red-100 w-full h-12"></div> */}
    </div>
  );
}
