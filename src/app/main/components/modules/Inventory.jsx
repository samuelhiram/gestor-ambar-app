"use client";
import React, { useEffect } from "react";
import CreateItem from "./components/CreateItem";
import { useMainAppContext } from "../../components/MainAppContext";
//
import { getCategories } from "./components/CreateCategory";
import { getLocations } from "./components/CreateLocation";
import { getUbications } from "./components/CreateUbication";
import { getUnits } from "./components/CreateUnit";
import { getTypes } from "./components/CreateType";
//
import DynamicTable from "./components/DynamicTable";
export default function Inventory() {
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
    <div className="flex flex-col gap-3">
      <CreateItem />

      <DynamicTable
        tableName="Suministros"
        tableIcon="mdi--users-outline"
        headers={[
          "Nombre",
          "Correo",
          "Número_de_control",
          "Rol",
          "Lugar",
          "Fecha_de_Ingreso",
        ]}
        dataHeaders={[]}
        data={[]}
        actions={{ editar: true, detalles: true, eliminar: true }}
      />
    </div>
  );
}
