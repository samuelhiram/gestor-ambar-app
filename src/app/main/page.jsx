"use client";
import React from "react";
import Sidebar from "./components/Sidebar";

import DropdownButton from "./components/DropdownButton";
import MainAppContextProvider, {
  useMainAppContext,
} from "./components/MainAppContext";
import ModuleLoaded from "./components/ModuleLoaded";
import { useEffect, useState } from "react";
import { useInactivityHandler } from "../hooks/useInactivityHandler";
import Loader from "../components/Loader/Loader";
import DialogAlert from "./components/DialogAlert";

export default function page() {
  return (
    <MainAppContextProvider>
      <Main />
    </MainAppContextProvider>
  );
}

function Main() {
  const { state, setState } = useMainAppContext();
  //get the userId from localStorage
  const [token, setToken] = useState();

  useEffect(() => {
    try {
      const userId = localStorage.getItem("userId");
      var userToken;
      const getSession = async () => {
        //make a simple fetch with js
        const response = await fetch(`/api/auth/getSession?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 401) {
          localStorage.clear();
          document.location.href = "/";
        }

        if (response.status === 403) {
          localStorage.clear();
          document.location.href = "/";
        }

        if (response.status === 200) {
          const data = await response.json();
          userToken = data.token;
          setToken(localStorage.getItem("token"));
          setState((prev) => ({ ...prev, isLoadingMainApp: false }));
        }
      };
      getSession();
    } catch (e) {
      // localStorage.clear();
      // console.log("error: ", e);
      document.location.href = "/";
    }
  }, []);

  useInactivityHandler(token);

  return (
    <>
      {state.isLoadingMainApp ? (
        <>
          <div className="min-h-screen gap-2 w-full flex flex-row justify-center items-center">
            <Loader />
            <div className="text-xl">Cargando...</div>
          </div>
        </>
      ) : state.isTokenExpired ? (
        <div className="min-h-screen w-full h-full flex flex-col gap-3 justify-center items-center">
          <div className=" p-4">
            La sesión ha cadudado, inicie sesión de nuevo.
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              document.location.href = "/";
            }}
            className="btn rounded-md p-2"
          >
            Iniciar sesión
          </button>
        </div>
      ) : (
        <>
          <div className="min-h-screen w-full flex flex-row">
            <div className={`${state.showSideBar ? "w-1/4" : ""}`}>
              <Sidebar />
            </div>
            <div className={`${state.showSideBar ? "w-3/4" : "w-full"}`}>
              <ModuleLoaded />
            </div>
          </div>
          <DropdownButton />
          <DialogAlert />
        </>
      )}
    </>
  );
}
