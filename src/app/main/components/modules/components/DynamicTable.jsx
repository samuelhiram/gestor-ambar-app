"use client";
import React, { useState, useEffect, useRef } from "react";
import { useMainAppContext } from "../../MainAppContext";
import { Icon } from "@iconify/react";
import Image from "next/image";
import ActionsRouter from "./ActionsRouter";
//
//
const DynamicTable = ({
  tableIcon = "fluent:table-48-filled",
  tableName = "table",
  headers,
  dataHeaders,
  data,
  actions,
}) => {
  const { state } = useMainAppContext();
  const tableRef = useRef(null); // Referencia para la tabla
  // Detectar clics fuera de la tabla
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setSelectedRows([]); // Deselecciona las filas
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  //
  //
  const [showActions, setShowActions] = useState(false);
  //
  const [hideActions, setHideActions] = useState(false);
  //
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  /////
  ////
  const [actionSelected, setActionSelected] = useState("");
  const [actionTitleSelected, setActionTitleSelected] = useState("");
  const [actionIconSelected, setActionIconSelected] = useState("");
  ////
  //
  var rows = [];

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleRowClick = (row) => {
    if (selectedRows.some((r) => r.id === row.id)) {
      rows = selectedRows.filter((r) => r.id !== row.id);
      setSelectedRows(rows);
      return;
    }
    rows = [...selectedRows, row];

    setSelectedRows(rows);
  };

  const handleShowActions = () => {
    setShowActions(false);
  };

  return (
    <div ref={tableRef}>
      {showActions && (
        <ActionsRouter
          action={actionSelected}
          activeModule={tableName}
          rows={selectedRows}
          setSelectedRows={setSelectedRows}
          actiontitle={actionTitleSelected}
          actionicon={actionIconSelected}
          showActions={handleShowActions}
        />
      )}
      <div
        className={`border !bg-white p-2 min-w-full w-full max-w-full  rounded-xl flex flex-col gap-2`}
      >
        <div className="flex flex-row-reverse justify-between items-center gap-2 w-full flex-wrap">
          <div
            className={` ${
              selectedRows.length === 0 ? "hidden" : "visible"
            } select-none fixed bottom-0 bg-white border  flex flex-col flex-grow flex-wrap justify-start max-md:justify-center rounded-t-lg overflow-hidden text-sm  !m-0`}
          >
            <div
              onClick={() => {
                setHideActions(!hideActions);
              }}
              className="p-2 font-semibold cursor-pointer min-w-36 flex justify-between items-center hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <div className="text-xs border border-1 border-blue-200 rounded-md bg-blue-50 text-blue-500 p-1">
                  {state.activeModuleName}
                </div>
                <div className="text-md">Opciones {hideActions && "..."} </div>
              </div>
              <div className="flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <rect width="24" height="24" fill="none" />
                  {!hideActions && (
                    <path
                      fill="gray"
                      d="m12 13.171l4.95-4.95l1.414 1.415L12 16L5.636 9.636L7.05 8.222z"
                    />
                  )}
                  {hideActions && (
                    <path
                      fill="gray"
                      d="m12 10.8l-4.6 4.6L6 14l6-6l6 6l-1.4 1.4z"
                    />
                  )}
                </svg>
              </div>
            </div>
            <div
              className={`${!hideActions ? "p-2 gap-2 flex flex-col" : ""} `}
            >
              {selectedRows.length && !hideActions
                ? actions.map((action, actionIndex) => (
                    <div
                      className={`${action.color} ${action.textColor} flex items-center gap-1 p-1 rounded-md cursor-pointer ${action.hoverColor}`}
                      key={actionIndex}
                      onClick={() => {
                        setActionSelected(action.action);
                        setActionTitleSelected(action.actionTitle);
                        setActionIconSelected(action.icon);
                        setShowActions(true);
                      }}
                    >
                      <div className="flex flex-row-reverse gap-2 items-center w-full justify-between">
                        <div className="text-md">
                          {action.description} ({selectedRows.length})
                        </div>
                        <div>
                          <Icon icon={action.icon} width={32} height={32} />
                        </div>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </div>
          <div className="flex items-center max-md:items-start max-md:flex-col justify-between w-full gap-2 flex-wrap">
            <div className="flex px-2 font-semibold items-center">
              <Icon
                icon={tableIcon}
                width="32"
                height="32"
                style={{ color: "#1e3a8a" }}
              />
              <Image
                priority
                src={`img/${tableIcon}.svg`}
                width={32}
                height={32}
                alt="icon"
              />
              <div>{tableName}</div>
            </div>

            <div className="flex max-md:flex-col max-md:w-full flex-grow justify-end gap-3">
              <div
                className={`max-md:w-full w-56 rounded-md flex items-center bg-white`}
              >
                <input
                  type="text"
                  placeholder="Buscar en la tabla..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full search"
                />
              </div>
              <div
                className={`${
                  selectedRows.length === 0
                    ? "bg-white"
                    : "bg-green-100 font-semibold text-green-700"
                }  w-56 border text-center p-2 rounded-md flex max-md:w-full justify-center text-sm items-center `}
              >
                Registros seleccionado(s): {selectedRows.length}
              </div>
            </div>
          </div>
        </div>

        {(data === undefined || data.length === 0) && (
          <div className="w-full rounded-md border p-2 flex justify-center items-center">
            Todavía no hay datos...
          </div>
        )}

        {!(data === undefined || data.length === 0) && (
          <>
            {filteredData.length === 0 && (
              <div className="w-full rounded-md border p-2 flex justify-center items-center">
                Sin resultados para mostrar.
              </div>
            )}
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
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, rowIndex) => (
                  <tr
                    className={`cursor-pointer bg-white  hover:bg-green-50 border-2`}
                    key={rowIndex}
                    onClick={() => handleRowClick(row)}
                  >
                    {dataHeaders.map((dataHeader, colIndex) => (
                      <td
                        className={`${
                          //if the row is selected, change the background color
                          selectedRows.some((r) => r.id === row.id)
                            ? "bg-green-100 text-green-600"
                            : ""
                        } text-sm p-2 max-sm:p-1 max-sm:flex max-sm:flex-col max-sm:first:bg-blue-900 max-sm:first:text-gray-50 max-sm: text-center border`}
                        key={colIndex}
                      >
                        <div className="break-all">{row[dataHeader]}</div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default DynamicTable;
