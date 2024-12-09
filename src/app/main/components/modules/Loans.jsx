"use client";
import React, { useEffect } from "react";
import CreateItem from "./components/CreateItem";
import { useMainAppContext } from "../../components/MainAppContext";
//

import { getResponsibles } from "./components/CreateResponsible";
//
import DynamicTable from "./components/DynamicTable";
export default function Loans() {
  const { state, setState } = useMainAppContext();
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isLoadingModule: true,
    }));
    try {
      const fetchAll = async () => {
        await getResponsibles(state, setState);
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
  const inventoryItemsActions = [
    {
      action: "asignloan",
      actionTitle: "Asignar suministros",
      color: "bg-green-900",
      textColor: "text-gray-50",
      hoverColor: "hover:bg-green-700",
      icon: "ri:user-received-fill",
      description: "Asignar suministro",
    },
  ];
  return (
    <div className="flex flex-col gap-3">
      <DynamicTable
        tableName="Asignar suministros"
        tableIcon="material-symbols-light--category-search-outline-rounded"
        headers={[
          "Partida",
          "Nombre",
          "Descripción",
          "Cantidad",
          "Unidad",
          "Entradas",
          "Salidas",
          "Ubicación",
        ]}
        dataHeaders={[
          "partidaNumber",
          "name",
          "description",
          "quantity",
          "unit",
          "entryes",
          "outs",
          "ubication",
        ]}
        data={state.items}
        showThisHeaderInHover="category"
        colHoverNumber={0}
        actions={inventoryItemsActions}
      />
    </div>
  );
}
