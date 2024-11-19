"use client";
import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import { useMainAppContext } from "../../MainAppContext";

////////////////// **** ACTIONS ROUTER **** //////////////////
import InactiveUsersActions from "./InactiveUsersActions";
import UsersActions from "./UsersActions";
import InventoryItemsActions from "./InventoryItemsActions";
export default function ActionsRouter({
  activeModule: tableName,
  action,
  rows,
  setSelectedRows,
  actiontitle,
  actionicon,
  showActions,
}) {
  const { state, setState } = useMainAppContext();
  useEffect(() => {
    // console.log("Loading router actions...");
    console.log("ActionsRouter: ", actiontitle, tableName, action, rows);
  }, []);

  // close this modal
  let closeThisModal = () => {
    showActions();
  };

  return (
    <div className="w-full z-40 fixed right-0 left-0 top-0 bottom-0 bg-black/50 flex justify-center item-center align-middle">
      <div className="bg-white z-50 p-4 w-4/5 lg:w-2/4 m-auto rounded-lg shadow flex flex-col gap-4">
        <div className="HEADER flex items-center justify-between">
          <div className="flex items-center gap-1 px-2">
            <Icon
              icon={actionicon || "material-symbols-light:square"}
              width="24"
              height="24"
              className="text-gray-600"
            />
            <h1 className="text-lg font-semibold">{actiontitle}</h1>
          </div>
          <div>
            <div
              onClick={closeThisModal}
              className="text-white rounded-md cursor-pointer hover:bg-gray-200 "
            >
              <Icon
                icon="material-symbols:close"
                width="32"
                height="32"
                style={{ color: "#1E3A8A" }}
              />
            </div>
          </div>
        </div>
        {/* ACTIONS ROUTER COMPONENTS */}
        {tableName === "Usuarios" && (
          <UsersActions
            closeThisModal={closeThisModal}
            action={action}
            rows={rows}
            setSelectedRows={setSelectedRows}
          />
        )}
        {tableName === "Usuarios desactivados" && (
          <InactiveUsersActions
            closeThisModal={closeThisModal}
            action={action}
            rows={rows}
            setSelectedRows={setSelectedRows}
          />
        )}
        {tableName === "Suministros" && (
          <InventoryItemsActions
            closeThisModal={closeThisModal}
            action={action}
            rows={rows}
            setSelectedRows={setSelectedRows}
          />
        )}
      </div>
    </div>
  );
}
