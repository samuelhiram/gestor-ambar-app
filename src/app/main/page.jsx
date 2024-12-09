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
//
//

export default function page() {
  return (
    <MainAppContextProvider>
      <Main />
    </MainAppContextProvider>
  );
}

function Main() {
  const { state, setState } = useMainAppContext();
  const [token, setToken] = useState();
  useEffect(() => {
    if (localStorage.getItem("activeModuleName")) {
      setState((prev) => ({
        ...prev,
        activeModuleName: localStorage.getItem("activeModuleName"),
      }));
    }

    try {
      const userId = localStorage.getItem("userId");

      const getSession = async () => {
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
          // console.log(data);
          setToken(localStorage.getItem("token"));
          setState((prev) => ({
            ...prev,
            token: localStorage.getItem("token"),
            user: data.user,
            isLoadingMainApp: false,
            //adding the user module to front end
            modules: [
              ...state.modules,
              {
                id: 0,
                icon: "lets-icons--user-cicrle-duotone",
                moduleName: "Usuario",
                title: data.user.fullName,
                description: data.user.role,
              },
            ],
          }));
        }
      };
      getSession();
    } catch (e) {
      window.location.href = "/";
    }
  }, []);

  useInactivityHandler(token);

  return (
    <>
      {state.isLoadingMainApp ? (
        <>
          <div className="min-h-screen gap-2 w-full flex flex-row justify-center items-center">
            <Loader />
            <div className="text-xl">{state.loadingMainAppMessage}</div>
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
            <div className={`${state.showSideBar ? "w-3/4 " : "w-full"}`}>
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
