"use client";
import React from "react";
import { Icon } from "@iconify/react";
import { useMainAppContext } from "./MainAppContext";
import Image from "next/image";
export default function SidebarMenuItem({ receivedModule }) {
  const { state, setState } = useMainAppContext();
  const { icon, title, description, moduleName } = receivedModule;
  return (
    <>
      {/*WHEN IS IN A SMALL SCREEN SHOW THIS STYLE AND FUNCTIONS*/}
      <div
        onClick={() => {
          setState({
            ...state,
            activeModuleName: moduleName,
            showSideBar: false,
          });
        }}
        className={`${
          state.activeModuleName === moduleName
            ? "bg-blue-100"
            : " hover:bg-gray-100"
        } sm:hidden w-full flex justify-between p-4 cursor-pointer active:bg-gray-200/80`}
      >
        <div className="flex items-center justify-start gap-2 w-4/5">
          <div>
            <Image
              priority
              src={`img/${icon}.svg`}
              width={38}
              height={38}
              alt="icon"
            />
          </div>
          <div className="text-md">
            <p>{title}</p>
            <p className="text-xs">{description}</p>
          </div>
        </div>
        <div className=" flex items-center justify-center w-1/5">
          <Icon
            icon="fluent:ios-arrow-right-24-regular"
            width="24"
            height="24"
            style={{ color: "#1e3a8a" }}
          />
        </div>
      </div>
      {/*WHEN IS IN A XL SCREEN SHOW THIS STYLE AND FUNCTIONS*/}
      <div
        onClick={() => {
          setState({
            ...state,
            activeModuleName: moduleName,
          });
        }}
        className={`${
          state.activeModuleName === moduleName
            ? "bg-blue-100 shadow-sm"
            : "hover:bg-gray-100"
        } select-none max-sm:hidden w-full flex justify-between p-2 cursor-pointer active:bg-gray-200/80`}
      >
        <div className="flex items-center justify-start gap-2 w-4/5">
          <div>
            <Image
              priority
              src={`img/${icon}.svg`}
              width={38}
              height={38}
              alt="icon"
            />
          </div>
          <div className="text-md">
            <p>{title}</p>
            <p className="text-xs">{description}</p>
          </div>
        </div>
        <div className=" flex items-center justify-center w-1/5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <rect width="24" height="24" fill="none" />
            <path
              fill="#1e3a8a"
              d="m19.704 12l-8.491-8.727a.75.75 0 1 1 1.075-1.046l9 9.25a.75.75 0 0 1 0 1.046l-9 9.25a.75.75 0 1 1-1.075-1.046z"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
