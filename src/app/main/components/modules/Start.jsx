"use client";
import React from "react";
import { useEffect } from "react";
import { useMainAppContext } from "../MainAppContext";
export default function Start() {
  const { state, setState } = useMainAppContext();
  useEffect(() => {
    localStorage.setItem("activeModuleName", "Inicio");
    setState((prev) => ({
      ...prev,
      isLoadingModule: false,
    }));
  }, []);
  return <div>Start</div>;
}
