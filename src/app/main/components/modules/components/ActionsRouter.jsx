"use client";
import React, { useEffect } from "react";
import UserActions from "./UserActions";
import { Icon } from "@iconify/react";
export default function ActionsRouter({
  closeThisModal,
  activeModule,
  action,
  rows,
}) {
  useEffect(() => {
    console.log("Loading router actions...");
    console.log("data recibida en actions: ", activeModule, action, rows);
  }, []);
  return (
    <div className="w-full z-40 fixed right-0 left-0 top-0 bottom-0 bg-black/50 flex justify-center item-center align-middle">
      <div className="bg-white z-50 p-4 h-4/5 w-4/5 m-auto rounded-lg shadow">
        <div className="HEADER flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Router Actions</h1>
          </div>
          <div>
            <div
              onClick={closeThisModal}
              className="text-white rounded-md cursor-pointer"
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
        <div className="w-full flex flex-1 flex-grow ">
          {activeModule === "Usuarios" && `UsersActions receives ${action}`}
        </div>
      </div>
    </div>
  );
}
