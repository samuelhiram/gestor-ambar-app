"use client";
import React from "react";
import CreateCategory from "./components/CreateCategory";
export default function Inventory() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row gap-2">
        <div className="w-full">
          <CreateCategory />
        </div>
        <div className="w-full">
          <CreateCategory />
        </div>
      </div>
    </div>
  );
}
