// DynamicTable.js
import React, { useState } from "react";
import { useMainAppContext } from "../../MainAppContext";
import { Icon } from "@iconify/react";
import EditItem from "./EditItem";

const DynamicTable = ({ headers, data, actions }) => {
  const { state } = useMainAppContext();
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar los datos según el término de búsqueda.
  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleRowClick = (row) => {
    console.log(row); // Imprime toda la información de la fila.
  };

  return (
    <div className="border-2 p-2 shadow-md rounded-xl flex flex-col gap-2">
      <input
        type="text"
        placeholder="Buscar en la tabla..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input rounded-md border-2 p-2 md:w-2/4 shadow"
      />

      <table className="w-full  overflow-hidden rounded-xl bg-gray-50 shadow-md">
        <thead className="bg-blue-900 text-gray-50 max-sm:hidden">
          <tr>
            {headers.map((header, index) => (
              <th className="p-1 border !font-light !text-md " key={index}>
                {header}
              </th>
            ))}
            {actions && (
              <th className="p-1 border !font-light !text-md">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr
              className="cursor-pointer hover:bg-gray-200/40"
              key={rowIndex}
              onClick={() => handleRowClick(row)}
            >
              {headers.map((header, colIndex) => (
                <td
                  className="  max-sm:flex max-sm:flex-col max-sm:first:bg-blue-900 max-sm:first:text-gray-50 max-sm: text-center p-4 border"
                  key={colIndex}
                >
                  {row[header]}
                </td>
              ))}
              {actions && (
                <td className="p-4 border max-sm:block space-x-3 text-center max-lg:flex-col max-lg:flex">
                  {actions.map((action, actionIndex) => (
                    <span
                      className="bg-blue-900 text-gray-50 px-2 py-1 rounded-md cursor-pointer hover:bg-blue-400"
                      key={actionIndex}
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el click en los botones dispare el evento de la fila.
                        console.log(`${action} clicked for row`, row);
                      }}
                    >
                      {action}
                    </span>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
