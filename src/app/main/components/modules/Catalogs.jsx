"use client";
import React, { useEffect } from "react";
import CreateCategory from "./components/CreateCategory";
import CreateUnit from "./components/CreateUnit";
import CreateUbication from "./components/CreateUbication";
import CreateLocation from "./components/CreateLocation";
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
    <div className="flex  max-md:flex-col gap-2">
      <div className="flex flex-col gap-2 w-1/2">
        <CreateCategory />
        <CreateLocation />
      </div>
      <div className="flex flex-col gap-2 w-1/2">
        <CreateUnit />
        <CreateUbication />
      </div>
    </div>
  );
}
