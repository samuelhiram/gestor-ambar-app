"use client";
import React, { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function InventoryItemDetails({ closeThisModal, items }) {
  useEffect(() => {}, [items]);

  return (
    <div className="p-4 ">
      <h2 className="text-md font-semibold mb-4">
        De click sobre los suministros para ver los detalles
      </h2>
      <div className="h-[52vh] overflow-auto ">
        <Accordion type="single" collapsible>
          {items.map((item, index) => {
            // Combinar entradas y salidas
            const combinedLogs = [
              ...item.entry.map((entry) => ({ ...entry, type: "entry" })),
              ...item.out.map((out) => ({ ...out, type: "out" })),
            ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Ordenar por fecha

            return (
              <AccordionItem key={item.id || index} value={`item-${index}`}>
                <AccordionTrigger className="!bg-white !text-gray-500 !shadow-none !border-none  !p-1">
                  <div className="text-lg capitalize">
                    {item.partidaNumber} - {item.name}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-2 border-b border-black flex flex-col justify-between gap-2">
                    <div className="flex justify-between">
                      <p>
                        <strong>Categoría:</strong> {item.category}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <div className=" flex flex-col gap-2">
                        <p>
                          <strong>Locación:</strong> {item.location}
                        </p>
                        <p>
                          <strong>Ubicación:</strong> {item.ubication}
                        </p>
                      </div>
                      <p>
                        <strong>Partida:</strong> {item.partidaNumber}
                      </p>
                      <div className=" flex flex-col gap-2">
                        <p>
                          <strong>Creado por:</strong> {item.user}
                        </p>
                        <p>
                          <strong>Fecha de creación:</strong>{" "}
                          {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Renderizar la lista combinada */}
                  <Accordion type="single" collapsible>
                    {combinedLogs.map((log) => (
                      <AccordionItem key={log.id} value={log.id}>
                        <AccordionTrigger className="!bg-gray-100 !border-none !p-1 !shadow-none text-sm">
                          <div className="grid grid-cols-4 gap-4 items-center w-full">
                            <span
                              className={`text-left flex items-center gap-1 ${
                                log.type === "out"
                                  ? "text-red-700"
                                  : "text-green-700"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                              >
                                <rect width="24" height="24" fill="none" />
                                <path
                                  fill={log.type === "out" ? "red" : "green"}
                                  d="M9 2h9c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2v-2h2v2h9V4H9v2H7V4c0-1.1.9-2 2-2"
                                />
                                <path
                                  fill={log.type === "out" ? "red" : "green"}
                                  d="M10.09 15.59L11.5 17l5-5l-5-5l-1.41 1.41L12.67 11H3v2h9.67z"
                                />
                              </svg>
                              {log.type === "out" ? "Salida" : "Entrada"}
                            </span>
                            <span className="text-gray-700 text-center">
                              <span className="font-light">reportado por</span>{" "}
                              {`${log.user.fullName.split(" ")[0]} ${
                                log.user.fullName.split(" ")[1] || ""
                              } `}
                            </span>
                            <span className="text-gray-700 text-center">
                              {log.type === "out"
                                ? `- ${log.quantity}`
                                : `+ ${log.quantity}`}
                            </span>
                            <span className="text-gray-700 text-center">
                              {new Date(log.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {/* Detalles adicionales si es necesario */}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      <button
        onClick={closeThisModal}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Cerrar
      </button>
    </div>
  );
}
