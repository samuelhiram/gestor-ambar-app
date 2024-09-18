import React from "react";
import DynamicTable from "./components/DynamicTable";
import { Icon } from "@iconify/react";
import CreateUser from "./components/CreateUser";
export default function Users() {
  const headers = [
    "Nombre",
    "Número_de_control",
    "Rol",
    "Ubicación",
    "Fecha_de_Ingreso",
  ];
  const data = [
    {
      id: "osdj9thththf",
      Nombre: "Samuel Hiram",
      Número_de_control: "20212390",
      Ubicación: "Unidad Tomas Aquino",
      Rol: "Admin",
      Fecha_de_Ingreso: "2021-09-01",
    },
    {
      id: "osdj9sdfdsfdfaf",
      Nombre: "Anna Belen ",
      Número_de_control: "20195674",
      Ubicación: "Unidad Otay",
      Rol: "Mod",
      Fecha_de_Ingreso: "2021-09-01",
    },
    {
      id: "osdjasdsad3osaf",
      Nombre: "Juan Pedro",
      Número_de_control: "39492843",
      Ubicación: "Unidad Tomas Aquino",
      Rol: "Viewer",
      Fecha_de_Ingreso: "2021-09-01",
    },
  ];

  // const actions = ["editar", "detalles", "eliminar"]; // Acciones que deseas mostrar.
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
    {
      action: "sumar",
      color: "bg-orange-800",
      textColor: "text-gray-50",
      hoverColor: "hover:bg-orange-700",
      icon: "ic:baseline-add",
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <CreateUser />
      <div>
        <DynamicTable headers={headers} data={data} actions={actions} />
      </div>
    </div>
  );
}
