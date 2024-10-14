"use client";
import React from "react";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
export default function UsersDetailsAction({ users }) {
  const [actions, setActions] = useState([]);
  useEffect(() => {
    const getLogs = async () => {
      const response = await fetch("/api/log/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ users }),
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
        console.log(data.logs);
        setActions(data.logs);
      }
    };
    getLogs();
  }, []);
  return (
    <>
      <div className="h-full w-full flex flex-col gap-2">
        {/* Contenedor principal con overflow */}

        <div className="overflow-auto flex-grow border rounded-md p-2 flex flex-col gap-2 max-h-[80vh]">
          {users.map((user, index) => (
            <>
              <div key={user.control_number} className=" w-full">
                <div className="w-full p-2 bg-blue-900 rounded-t-md text-white">
                  {user.fullName}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <div className="flex flex-col gap-1 p-2">
                    <div className="text-sm font-bold">Correo:</div>
                    <> {user.email}</>
                    <div className="text-sm font-bold">Número de control: </div>
                    <>{user.control_number}</>
                    <div className="text-sm font-bold">Rol:</div>
                    <>{user.role}</>
                  </div>
                  <div className="flex flex-col gap-1 p-2">
                    <div className="text-sm font-bold">Lugar:</div>
                    <>{user.location}</>
                    <div className="text-sm font-bold">Fecha de ingreso:</div>
                    <>{user.createdAt}</>
                  </div>
                </div>
                <Accordion className="w-full" type="single" collapsible>
                  <AccordionItem className="" value="item-1">
                    <AccordionTrigger className="!bg-gray-200 !p-2 !text-gray-500">
                      <div className="flex items-center gap-1">
                        <h1 className="text-sm font-semibold">
                          Historial de actividad
                        </h1>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-2 max-h-64 overflow-auto">
                      {/* Aquí se imprime la lista de actividades */}

                      {/*get the index of the array by user index*/}
                      <div className="flex flex-col gap-2">
                        {actions[index] == 0 && "No hay actividad registrada"}
                        {actions[index] &&
                          actions[index].map((log, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center border-b"
                            >
                              <div>{log.action}</div>
                              <div>{log.createdAt}</div>
                            </div>
                          ))}
                        <hr className="border-2 w-full" />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}
