"use client";
import React from "react";
import { useEffect } from "react";
import { useMainAppContext } from "../MainAppContext";
import DynamicTable from "./components/DynamicTable";
export default function Start() {
  const { state, setState } = useMainAppContext();
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isLoadingModule: false,
    }));
  }, []);
  return <div>Start</div>;
}
