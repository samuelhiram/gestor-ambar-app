"use client";
import React from "react";
import { useAppContext } from "../components/GlobalContextApp";
import Sidebar from "./components/Sidebar";
import DropdownMenu from "./components/DropdownMenu";

export default function page() {
  const { state } = useAppContext();
  return (
    <div className="min-h-screen w-full flex flex-row">
      {state.showSideBar ? <Sidebar /> : null}
      <DropdownMenu />
    </div>
  );
}
