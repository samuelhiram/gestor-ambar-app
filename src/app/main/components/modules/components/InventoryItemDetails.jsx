"use client";

import React, { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function InventoryItemDetails({ closeThisModal, items }) {
  useEffect(() => {
    console.log("InventoryItemDetails: ", items);
  }, [items]);

  return (
    <div className="p-4 ">
      <h2 className="text-md font-semibold mb-4">
        De click sobre los suministros para ver los detalles
      </h2>
      <div className="h-[52vh] overflow-auto ">
        <Accordion type="single" collapsible>
          {items.map((item, index) => (
            <AccordionItem key={item.id || index} value={`item-${index}`}>
              <AccordionTrigger className="!bg-white !text-gray-500 !shadow-none !border-none  !p-1">
                <div>
                  {item.partidaNumber} - {item.name}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-2 border-b border-black">
                  <p>
                    <strong>Categoría:</strong> {item.category}
                  </p>
                </div>
                <Accordion type="single" collapsible>
                  {item.entry.map((entry) => (
                    <AccordionItem key={entry.id} value={entry.id}>
                      <AccordionTrigger className="!bg-gray-100 !border-none !p-1 !shadow-none text-sm">
                        <div className="grid grid-cols-3 gap-4 items-center w-full">
                          <span className="text-green-700 text-left flex items-center gap-1 ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                            >
                              <rect width="24" height="24" fill="none" />
                              <path
                                fill="green"
                                d="M9 2h9c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2v-2h2v2h9V4H9v2H7V4c0-1.1.9-2 2-2"
                              />
                              <path
                                fill="green"
                                d="M10.09 15.59L11.5 17l5-5l-5-5l-1.41 1.41L12.67 11H3v2h9.67z"
                              />
                            </svg>
                            {`Entrada`}
                          </span>
                          <span className="text-gray-700 text-center">{`+ ${entry.quantity}`}</span>
                          <span className="text-gray-700 text-center">
                            {new Date(entry.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 py-3">
                          <p>
                            <strong>Se ingresó el valor:</strong>{" "}
                            {entry.quantity}
                          </p>
                          <p>
                            <strong>Reportado por:</strong> {entry.userId}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
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
