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
    "Correo",
    "Número_de_control",
    "Rol",
    "Lugar",
    "Fecha_de_Ingreso",
  ];
  const dataHeaders = [
    "fullName",
    "email",
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
    fetch("/api/users/get", {
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
          usersData: data.users,
          isLoadingModule: false,
        }));
      });
  }, []);
  const actions = [
    {
      action: "details",
      actionTitle: "Detalles de Usuarios",
      color: "bg-green-900",
      textColor: "text-gray-50",
      hoverColor: "hover:bg-green-700",
      icon: "mingcute:user-search-fill",
      description: "Detalles",
    },
    {
      action: "edit",
      color: "bg-blue-900",
      actionTitle: "Editar Usuarios",
      textColor: "text-gray-50",
      hoverColor: "hover:bg-blue-700",
      icon: "fa6-solid:user-pen",
      description: "Editar",
    },
    {
      action: "delete",
      color: "bg-red-800",
      actionTitle: "Eliminar Usuarios",
      textColor: "text-gray-50",
      hoverColor: "hover:bg-red-700",
      icon: "mdi:user-minus",
      description: "Eliminar",
    },
  ];
  return (
    //rename the received data
    <div className="flex flex-col gap-3">
      <CreateUser />
      <div>
        <DynamicTable
          headers={headers}
          dataHeaders={dataHeaders}
          data={state.usersData}
          actions={actions}
        />
      </div>
    </div>
  );
}
