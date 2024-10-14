import React, { useState, useEffect } from "react";
import { useMainAppContext } from "../../MainAppContext";
import { Icon } from "@iconify/react";
import ActionsRouter from "./ActionsRouter";

const DynamicTable = ({ headers, dataHeaders, data, actions }) => {
  const { state, setState } = useMainAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  /////
  ////
  ////
  const [actionSelected, setActionSelected] = useState("");
  const [actionTitleSelected, setActionTitleSelected] = useState("");
  const [actionIconSelected, setActionIconSelected] = useState("");
  ////
  ///
  //
  var rows = [];
  if (data === undefined || data.length === 0) {
    return (
      <div className="w-full rounded-md border p-2 flex justify-center items-center">
        <>Todavía no hay datos...</>
      </div>
    );
  }

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleRowClick = (row) => {
    if (state.selectedRows.some((r) => r.id === row.id)) {
      rows = state.selectedRows.filter((r) => r.id !== row.id);
      setState((prev) => ({ ...prev, selectedRows: rows }));
      // console.log("state:", state.selectedRows);
      // console.log("rows ---> deleted... : ", rows);
      return;
    }
    setSelectedRowIndex(row.id);
    rows = [...state.selectedRows, row];
    // console.log("rows: ", rows);
    setState((prev) => ({ ...prev, selectedRows: rows }));
  };

  return (
    <div>
      {state.showActionsDialog && (
        <ActionsRouter
          action={actionSelected}
          activeModule={state.activeModuleName}
          rows={state.selectedRows}
          actiontitle={actionTitleSelected}
          actionicon={actionIconSelected}
        />
      )}
      <div
        className={`border p-2 min-w-full w-full max-w-full  rounded-xl flex flex-col gap-2`}
      >
        <div className="flex flex-row-reverse justify-between items-center gap-2 w-full flex-wrap">
          <div
            className={` ${
              state.selectedRows.length === 0 ? "hidden" : "visible"
            }  fixed bottom-0 bg-white border p-2 flex flex-col flex-grow flex-wrap justify-start max-md:justify-center rounded-md text-sm gap-2 !m-0`}
          >
            <div className="p-1 text-sm font-semibold">Opciones</div>

            {state.selectedRows.length
              ? actions.map((action, actionIndex) => (
                  <div
                    className={`${action.color} ${action.textColor} flex items-center gap-1  px-2 py-1 rounded-md cursor-pointer ${action.hoverColor}`}
                    key={actionIndex}
                    onClick={(e) => {
                      e.stopPropagation();
                      // console.log(
                      //   `${action.action} ${state.activeModuleName} clicked for row`,
                      //   state.selectedRows
                      // );
                      setActionSelected(action.action);
                      setActionTitleSelected(action.actionTitle);
                      setActionIconSelected(action.icon);
                      setState((prev) => ({
                        ...prev,
                        showActionsDialog: true,
                      }));
                    }}
                  >
                    <div className="flex flex-row-reverse gap-2 items-center w-full justify-between">
                      <div>
                        {action.description} ({state.selectedRows.length})
                      </div>
                      <div>
                        <Icon icon={action.icon} width={32} height={32} />
                      </div>
                    </div>
                  </div>
                ))
              : null}
          </div>
          <div className="flex items-center justify-start w-full gap-3 flex-wrap">
            <div className="w-1/2 max-md:w-full">
              <input
                type="text"
                placeholder="Buscar en la tabla..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search w-full"
              />
            </div>
            <div
              className={`${
                state.selectedRows.length === 0 ? "bg-white" : "bg-green-100"
              } border p-2 rounded-md  flex max-md:w-full justify-center text-sm items-center`}
            >
              <div>Registros seleccionado(s): {state.selectedRows.length}</div>
            </div>
          </div>
        </div>
        <div
          className={`${
            filteredData.length === 0 ? "visible" : "hidden"
          } min-w-full w-full flex justify-center items-center p-2`}
        >
          Sin información para mostrar.
        </div>
        <table
          className={`${
            filteredData.length === 0 ? "hidden" : "visible"
          } w-full overflow-hidden rounded-xl bg-gray-50 shadow-md`}
        >
          <thead className="bg-blue-900 text-gray-50 max-sm:hidden">
            <tr>
              {headers.map((header, index) => (
                <th className="p-1 border !font-light !text-md" key={index}>
                  {header.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr
                className={`cursor-pointer bg-white hover:bg-gray-100`}
                key={rowIndex}
                onClick={() => handleRowClick(row)}
              >
                {dataHeaders.map((dataHeader, colIndex) => (
                  <td
                    className={`${
                      //if the row is selected, change the background color
                      state.selectedRows.some((r) => r.id === row.id)
                        ? "bg-green-100"
                        : ""
                    } text-sm p-2 max-sm:p-1 max-sm:flex max-sm:flex-col max-sm:first:bg-blue-900 max-sm:first:text-gray-50 max-sm: text-center border`}
                    key={colIndex}
                  >
                    <div className="">{row[dataHeader]}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DynamicTable;
