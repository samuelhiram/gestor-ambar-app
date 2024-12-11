"use client";
import React, { useState, useEffect } from "react";
import { getResponsibles } from "./CreateResponsible";
import { useMainAppContext } from "../../MainAppContext";

export default function LoansEditLoan({ loanId, closeThisModal }) {
  console.log("--LoansEditLoan--> Editando préstamo:", loanId);

  const [items, setItems] = React.useState([]);
  const { state, setState } = useMainAppContext();
  const [selectedResponsable, setSelectedResponsable] = useState("");
  const [customResponsable, setCustomResponsable] = useState("");
  const [itemQuantities, setItemQuantities] = useState(
    items.map((item) => ({ id: item.id, quantity: 0 }))
  );
  const [someItemIsEmpty, setSomeItemIsEmpty] = useState(false);
  const [noValid, setNoValid] = useState(false);
  const [newResponsible, setNewResponsible] = useState(false);
  const [fetching, setFetching] = useState(false);

  //use effect where fetch the responsibles
  useEffect(() => {
    const fetchSome = async () => {
      //obtnerr los items del préstamo
      await fetch("/api/loans/get-all-loan-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify(loanId),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Items del préstamo:", data.formattedItems);
          // setItems(data.formattedItems);
          // setItemQuantities(
          //   data.formattedItems.map((item) => ({ id: item.id, quantity: 0 }))
          // );
        });
    };
    fetchSome();
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="w-full h-full flex gap-4 max-md:flex-col-reverse">
        <div className="md:w-9/12 border rounded-md flex flex-col h-[50vh] overflow-auto">
          <div className="w-full border-b flex items-center p-3 justify-between  max-md:hidden">
            <div className="w-1/3">Ítem</div>
            <div className="w-1/3">Unidad</div>
            <div className="flex w-1/3 gap-1 items-center">
              <div className="w-2/4 text-center">Cantidad</div>
              <div className="w-1/4"></div>
              <div className="w-1/4"></div>
            </div>
          </div>
          {/* {items.map((item) => (
            <div
              key={item.id}
              className="w-full border-b flex max-md:flex-col items-center p-3 justify-between"
            >
              <div className="w-1/3 max-md:w-full">{item.name}</div>
              <div className="w-1/3 max-md:w-full">{item.unit}</div>
              <div className="flex md:w-1/3 max-md:flex-col gap-1 items-center">
                <input
                  defaultValue={0}
                  value={
                    itemQuantities.find((q) => q.id === item.id)?.quantity || 0
                  }
                  readOnly
                  className="max-md:w-5/6 md:w-2/4 border rounded-md text-center"
                />
                <div className="flex gap-1 max-md:justify-between max-md:w-full md:w-2/4">
                  <button
                    onClick={() => {
                      handleQuantityChange(item.id, 1);
                      setSomeItemIsEmpty(false);
                    }}
                    className="p-1 rounded-md max-md:w-full md:w-1/2 font-bold text-xl"
                  >
                    +
                  </button>
                  <button
                    onClick={() => {
                      handleQuantityChange(item.id, -1);
                      setSomeItemIsEmpty(false);
                    }}
                    className="p-1 rounded-md max-md:w-full md:w-1/2 font-bold text-xl"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
          ))} */}
        </div>
        <div className="md:w-4/12 flex flex-col gap-3">
          <label className="text-gray-800 font-semibold w-full">
            Seleccione responsable
          </label>
          <select
            value={selectedResponsable}
            onChange={(e) => {
              setCustomResponsable("");
              setSelectedResponsable(e.target.value);
              setNoValid(false);
              newResponsible && setNewResponsible(false);
            }}
            className="border p-1 rounded-md w-full"
          >
            <option value="">Seleccione</option>
            {/* <option value="Juan Hernandez Manzera">
          Juan Hernandez Manzera
        </option> */}
            {
              //map state.responsibles
              state.responsibles.map((responsible) => (
                <option key={responsible.id} value={responsible.id}>
                  {responsible.fullName}
                </option>
              ))
            }
          </select>
          <div className="text-gray-900 w-full flex justify-center">o</div>
          {!newResponsible && (
            <button
              onClick={() => {
                setSelectedResponsable("");
                setNewResponsible(true);
                setNoValid(false);
              }}
              className="rounded-md flex items-center text-sm   justify-center  p-2"
            >
              Añadir responsable +
            </button>
          )}
          {newResponsible && (
            <>
              <label className="text-gray-800 font-semibold w-full">
                Nuevo responsable
              </label>
              <input
                value={customResponsable}
                onChange={(e) => {
                  setCustomResponsable(e.target.value);
                  setNoValid(false);
                }}
                placeholder="Nombre del responsable"
                className="border p-1 rounded-md w-full"
              />
              <button
                onClick={() => {
                  setNewResponsible(false);
                  setNoValid(false);
                }}
                className="rounded-md flex items-center text-sm   justify-center  p-2"
              >
                Cancelar
              </button>
            </>
          )}
          {noValid && (
            <div className="text-red-500">
              Es obligatorio seleccionar un responsable o crear uno nuevo.
            </div>
          )}

          {someItemIsEmpty && (
            <div className="text-red-500">
              Debe asignar al menos un suministro.
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex justify-between">
        <button
          onClick={() => {
            closeThisModal();
          }}
          className="rounded-md p-1"
        >
          Cancelar
        </button>

        <button className="rounded-md p-1">Realizar préstamo</button>
      </div>
    </div>
  );
}
