"use client";
import React from "react";
import CreateCategory from "./components/CreateCategory";
export default function Inventory() {
  return (
    <div className="flex flex-col gap-3">
      <CreateCategory />
    </div>
  );
}
