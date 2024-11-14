"use client";
import React, { useEffect, useState } from "react";
import { useMainAppContext } from "../MainAppContext";
export default function User() {
  const { state, setState } = useMainAppContext();
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    // localStorage.setItem("activeModuleName", "Usuario");
    fetch("/api/log/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify({ users: [state.user] }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLogs(data.logs[0]);
      });
    setState((prev) => ({
      ...prev,
      isLoadingModule: false,
    }));
  }, []);
  return (
    <div className="flex flex-col flex-grow flex-1 h-full rounded-md bg-white shadow p-4 gap-4">
      <div className="flex gap-2 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="128"
          height="128"
          className="rounded-2xl bg-gray-100"
          viewBox="0 0 24 24"
        >
          <rect width="24" height="24" fill="none" />
          <path
            fill="#737373"
            fillOpacity="0.25"
            d="M3 11c0-3.771 0-5.657 1.172-6.828S7.229 3 11 3h2c3.771 0 5.657 0 6.828 1.172S21 7.229 21 11v2c0 3.771 0 5.657-1.172 6.828S16.771 21 13 21h-2c-3.771 0-5.657 0-6.828-1.172S3 16.771 3 13z"
          />
          <circle cx="12" cy="10" r="4" fill="#737373" />
          <path
            fill="#737373"
            fillRule="evenodd"
            d="M18.946 20.253a.23.23 0 0 1-.14.25C17.605 21 15.836 21 13 21h-2c-2.835 0-4.605 0-5.806-.498a.23.23 0 0 1-.14-.249C5.483 17.292 8.429 15 12 15s6.517 2.292 6.946 5.253"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="font-bold text-lg">{state.user.fullName}</div>
            <div className="text-sm">
              {state.user.role === "admin" && (
                <div className="w-fit rounded-md p-1 bg-orange-100 font-semibold text-orange-400">
                  admin
                </div>
              )}
              {state.user.role === "viewer" && (
                <div className="w-fit rounded-md p-1 bg-green-100 font-semibold text-green-400">
                  viewer
                </div>
              )}
              {state.user.role === "mod" && (
                <div className="w-fit rounded-md p-1 bg-blue-100 font-semibold text-blue-400">
                  mod
                </div>
              )}
            </div>
          </div>
          <div>{state.user.location.name}</div>
          <div className=" bg-blue-100 rounded-md p-1 text-blue-900 underline flex items-center justify-center">
            {state.user.email}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className=" font-bold text-sm w-full flex justify-start">
          Historial de acciones
        </div>
        <div className="max-h-[55vh] overflow-auto flex flex-col gap-1">
          {logs.map((l, lIndex) => (
            <div
              key={lIndex}
              className="flex hover:bg-green-100 gap-2 items-center justify-between p-2 bg-gray-100 rounded-md"
            >
              <hr className="border-blue-500 border-2" />

              <div className="flex w-full items-center justify-between">
                <div className="w-1/2 text-sm  overflow-hidden text-black">
                  {l.action}
                </div>
                <div className="w-1/2 text-xs text-gray-500 text-right">
                  {l.createdAt}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
