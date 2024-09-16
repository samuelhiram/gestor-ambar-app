import React from "react";
import DynamicTable from "./components/DynamicTable";

export default function Users() {
  const headers = ["Nombre", "NumControl", "Rol", "Ubicación"]; // Headers de la tabla
  const data = [
    {
      id: "osdj9thththf",
      Nombre: "Samuel Hiram",
      NumControl: "20212390",
      Ubicación: "Unidad Tomas Aquino",
      Rol: "Admin",
    },
    {
      id: "osdj9sdfdsfdfaf",
      Nombre: "Anna Belen ",
      NumControl: "20195674",
      Ubicación: "Unidad Otay",
      Rol: "Mod",
    },
    {
      id: "osdjasdsad3osaf",
      Nombre: "Juan Pedro",
      NumControl: "39492843",
      Ubicación: "Unidad Tomas Aquino",
      Rol: "Viewer",
    },
  ];

  const actions = ["editar", "detalles", "eliminar"]; // Acciones que deseas mostrar.

  return (
    <div>
      <div>
        <DynamicTable headers={headers} data={data} actions={actions} />
      </div>
    </div>
  );
}
