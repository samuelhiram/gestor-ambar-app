"use client";
import React from "react";
import { Icon } from "@iconify/react";
import { useAppContext } from "@/app/components/GlobalContextApp";

export default function DropdownMenu() {
  const { state, setState } = useAppContext();
  return (
    <div
      onClick={() => {
        setState((prev) => ({ ...prev, showSideBar: !prev.showSideBar }));
      }}
      className="rounded-full p-1 border bg-gray-50 shadow-md absolute m-5 hover:bg-gray-100 cursor-pointer bottom-0"
    >
      <Icon
        icon={`material-symbols:${!state.showSideBar ? "menu" : "close"}`}
        width="38"
        height="38"
        style={{ color: "#1e3a8a" }}
      />
    </div>
  );
}
