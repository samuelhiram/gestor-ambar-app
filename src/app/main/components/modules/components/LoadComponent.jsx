"use client";
import React, { useEffect } from "react";

export default function LoadComponent({ row }) {
  useEffect(() => {
    console.log("is loaded");
  }, []);
  return (
    <div className="z-50 absolute flex items-center justify-center w-full h-full min-h-screen bg-black/50">
      <h1>Load Component</h1>
    </div>
  );
}
