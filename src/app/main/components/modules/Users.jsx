"use client";
import React from "react";
import { useEffect } from "react";
import DynamicTable from "./components/DynamicTable";
import { Icon } from "@iconify/react";
import CreateUser from "./components/CreateUser";
import { useMainAppContext } from "../MainAppContext";
export default function Users() {
  const { state, setState } = useMainAppContext();
  const headers = [
    "Nombre",
    "Número_de_control",
    "Rol",
    "Ubicación",
    "Fecha_de_Ingreso",
  ];

  const dataHeaders = [
    "fullName",
    "control_number",
    "role",
    "location",
    "createdAt",
  ];

  //  const actions = ["editar", "detalles", "eliminar"]; // Acciones que deseas mostrar.
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isLoadingModule: true,
    }));
    //fetch users
    fetch("/api/getUsers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setState((prev) => ({
          ...prev,
          usersData: data,
          isLoadingModule: false,
        }));
      });
  }, []);
  const actions = [
    {
      action: "editar",
      color: "bg-blue-900",
      textColor: "text-gray-50",
      hoverColor: "hover:bg-blue-700",
      icon: "material-symbols-light:edit-sharp",
    },
    {
      action: "detalles",
      color: "bg-green-900",
      textColor: "text-gray-50",
      hoverColor: "hover:bg-green-700",
      icon: "mdi:eye",
    },
    {
      action: "eliminar",
      color: "bg-red-800",
      textColor: "text-gray-50",
      hoverColor: "hover:bg-red-700",
      icon: "ic:baseline-delete",
    },
    // {
    //   action: "sumar",
    //   color: "bg-orange-800",
    //   textColor: "text-gray-50",
    //   hoverColor: "hover:bg-orange-700",
    //   icon: "ic:baseline-add",
    // },
  ];

  return (
    //rename the received data
    <div className="flex flex-col gap-3">
      <CreateUser />
      <div>
        <DynamicTable
          headers={headers}
          dataHeaders={dataHeaders}
          data={state.usersData.users}
          actions={actions}
        />
      </div>
    </div>
  );
}
