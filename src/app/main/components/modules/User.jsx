"use client";
import React from "react";
import { useMainAppContext } from "../MainAppContext";
export default function User() {
  const { state, setState } = useMainAppContext();

  console.log(state);
  return (
    <div className="flex flex-col gap-3">
      <div>nombre: {state.user.fullName}</div>
      <div>correo: {state.user.email}</div>
      <div>rol: {state.user.role}</div>
    </div>
  );
}
