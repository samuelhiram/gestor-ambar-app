"use client";
import React, { useEffect } from "react";
import CreateCategory from "./components/CreateCategory";
import CreateUnit from "./components/CreateUnit";
import CreateUbication from "./components/CreateUbication";
import CreateLocation from "./components/CreateLocation";
import CreateType from "./components/CreateType";
import CreateResponsible from "./components/CreateResponsible";
import { useMainAppContext } from "../../components/MainAppContext";
//
import { getCategories } from "./components/CreateCategory";
import { getLocations } from "./components/CreateLocation";
import { getUbications } from "./components/CreateUbication";
import { getUnits } from "./components/CreateUnit";
import { getTypes } from "./components/CreateType";
import { getResponsibles } from "./components/CreateResponsible";
export default function Catalogs() {
  const { state, setState } = useMainAppContext();

  useEffect(() => {
    // localStorage.setItem("activeModuleName", "Inventario");
    setState((prev) => ({
      ...prev,
      isLoadingModule: true,
    }));
    try {
      const fetchAll = async () => {
        await getCategories(state, setState);
        await getLocations(state, setState);
        await getUbications(state, setState);
        await getUnits(state, setState);
        await getResponsibles(state, setState);
        await getTypes(state, setState).finally(() => {
          setState((prev) => ({
            ...prev,
            isLoadingModule: false,
          }));
        });
      };
      fetchAll();
    } catch (e) {
      console.error(e.message);
    }
  }, []);

  return (
    <div className="flex  max-md:flex-col gap-2">
      <div className="flex flex-col gap-2 w-1/2 max-md:w-full">
        <CreateCategory />
        <CreateLocation />
        <CreateType />
      </div>
      <div className="flex flex-col gap-2 w-1/2 max-md:w-full">
        <CreateUnit />
        <CreateUbication />
        <CreateResponsible />
      </div>
    </div>
  );
}
