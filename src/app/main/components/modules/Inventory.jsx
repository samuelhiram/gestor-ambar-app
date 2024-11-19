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
        await getTypes(state, setState);

        //fetch items
        await fetch("/api/item/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setState((prev) => ({
              ...prev,
              items: data.items,
              isLoadingModule: false,
            }));
          });
      };
      fetchAll();
    } catch (e) {
      console.error(e.message);
    }
  }, []);
  console.log(state.items);
  const inventoryItemsActions = [
    {
      action: "entryes",
      actionTitle: "Reportar entrada de suministros",
      color: "bg-green-900",
      textColor: "text-gray-50",
      hoverColor: "hover:bg-green-700",
      icon: "lets-icons:in",
      description: "Reportar entrada",
    },
    {
      action: "outs",
      actionTitle: "Reportar entrada de suministros",
      color: "bg-red-900",
      textColor: "text-red-50",
      hoverColor: "hover:bg-red-700",
      icon: "lets-icons:out",
      description: "Reportar salida",
    },
    {
      action: "details",
      actionTitle: "Detalles de suministros",
      color: "bg-green-900",
      textColor: "text-gray-50",
      hoverColor: "hover:bg-green-700",
      icon: "mdi:eye",
      description: "Detalles",
    },
    {
      action: "edit",
      color: "bg-blue-900",
      actionTitle: "Editar suminitros",
      textColor: "text-gray-50",
      hoverColor: "hover:bg-blue-700",
      icon: "material-symbols:edit",
      description: "Editar",
    },
    {
      action: "delete",
      color: "bg-orange-600",
      actionTitle: "Desactivar suministros",
      textColor: "text-gray-50",
      hoverColor: "hover:bg-orange-700",
      icon: "material-symbols-light:tab-inactive-outline",
      description: "Desactivar",
    },
  ];
  return (
    <div className="flex flex-col gap-3">
      <CreateItem />

      <DynamicTable
        tableName="Suministros"
        tableIcon="material-symbols-light--category-search-outline-rounded"
        headers={[
          "Partida",
          "Nombre",
          "Descripción",
          "Unidad",
          "Cantidad",
          "Ubicación",
        ]}
        dataHeaders={[
          "partidaNumber",
          "name",
          "description",
          "unit",
          "quantity",
          "ubication",
        ]}
        data={state.items}
        actions={inventoryItemsActions}
      />
    </div>
  );
}
