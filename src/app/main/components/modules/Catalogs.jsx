"use client";
import React, { useEffect } from "react";
import CreateCategory from "./components/CreateCategory";
import CreateUnit from "./components/CreateUnit";
import CreateUbication from "./components/CreateUbication";
import { useMainAppContext } from "../../components/MainAppContext";

export default function Catalogs() {
  const { state, setState } = useMainAppContext();

  useEffect(() => {
    setState((prevContext) => ({
      ...prevContext,
      isLoadingModule: false,
    }));
  }, []);

  return (
    <div>
      {state.user.role === "admin" && (
        //
        <div className="flex flex-row max-md:flex-col gap-2">
          <div className="w-full">
            <CreateCategory />
          </div>
          <div className="w-full">
            <CreateUnit />
          </div>
          <div className="w-full">
            <CreateUbication />
          </div>
        </div>
        //
      )}
    </div>
  );
}
