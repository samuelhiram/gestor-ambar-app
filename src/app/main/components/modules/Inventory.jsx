"use client";
import React, { useEffect } from "react";

import CreateItem from "./components/CreateItem";

import { useMainAppContext } from "../../components/MainAppContext";

export default function Inventory() {
  const { state, setState } = useMainAppContext();
  useEffect(() => {
    // localStorage.setItem("activeModuleName", "Inventario");
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

      {/* <div className="bg-red-100 w-full h-12"></div> */}
    </div>
  );
}
