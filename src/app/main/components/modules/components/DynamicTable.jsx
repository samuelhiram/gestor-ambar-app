import React, { useState, useEffect } from "react";
import { useMainAppContext } from "../../MainAppContext";
import { Icon } from "@iconify/react";
import EditItem from "./EditItem";

const DynamicTable = ({ headers, data, actions }) => {
  const { state } = useMainAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const [isEmptyData, setIsEmptyData] = useState(false);
  // Filtrar los datos según el término de búsqueda.
  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleRowClick = (row) => {
    setSelectedRowIndex(row.id);
    console.log(row); // Imprime toda la información de la fila.
  };

  return (
    <div
      className={` border p-2 min-w-full w-full max-w-full  rounded-xl flex flex-col gap-2`}
    >
      <input
        type="text"
        placeholder="Buscar en la tabla..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input text-sm rounded-md border-2 p-2 md:w-2/4 shadow"
      />
      <div
        className={`${
          filteredData.length === 0 ? "visible" : "hidden"
        } min-w-full w-full flex justify-center items-center p-2`}
      >
        Aún no hay datos en este módulo.
      </div>
      <table
        className={`${
          filteredData.length === 0 ? "hidden" : "visible"
        } w-full overflow-hidden rounded-xl bg-gray-50 shadow-md`}
      >
        <thead className="bg-blue-900 text-gray-50 max-sm:hidden">
          <tr>
            {headers.map((header, index) => (
              <th className="p-1 border !font-light !text-sm" key={index}>
                {header.replace(/_/g, " ")}
              </th>
            ))}
            {actions && (
              <th className="p-1 border !font-light !text-sm">Acciones</th>
            )}
          </tr>
        </thead>

        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr
              className={`${
                // row.id === selectedRowIndex
                false ? "bg-green-200" : "hover:bg-gray-200/40"
              } cursor-pointer`}
              key={rowIndex}
              onClick={() => handleRowClick(row)}
            >
              {headers.map((header, colIndex) => (
                <td
                  className="text-sm p-2 max-sm:p-1 max-sm:flex max-sm:flex-col max-sm:first:bg-blue-900 max-sm:first:text-gray-50 max-sm: text-center  border"
                  key={colIndex}
                >
                  {row[header]}
                </td>
              ))}
              {actions && (
                <>
                  <td className="p-1 flex flex-grow border text-sm gap-2 justify-center !m-0 max-xl:flex-col">
                    {actions.map((action, actionIndex) => (
                      <span
                        className={`${action.color} ${action.textColor} flex justify-center items-center gap-1 max-w-[2rem] px-2 py-1 rounded-md cursor-pointer ${action.hoverColor}`}
                        key={actionIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(
                            `${action.action} ${state.activeModuleName} clicked for row`,
                            row
                          );
                        }}
                      >
                        <div>
                          <Icon icon={action.icon} width={20} height={20} />
                        </div>
                      </span>
                    ))}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
