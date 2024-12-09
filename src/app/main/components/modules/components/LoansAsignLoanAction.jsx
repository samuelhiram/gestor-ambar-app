import React, { useState } from "react";

export default function LoansAsignLoanAction({
  items,
  closeThisModal,
  setSelectedRows,
}) {
  const [selectedResponsable, setSelectedResponsable] = useState("");
  const [customResponsable, setCustomResponsable] = useState("");
  const [itemQuantities, setItemQuantities] = useState(
    items.map((item) => ({ id: item.id, quantity: 0 }))
  );
  const [noValid, setNoValid] = useState(false);
  const [newResponsible, setNewResponsible] = useState(false);

  const handleQuantityChange = (id, delta) => {
    setItemQuantities((prevQuantities) =>
      prevQuantities.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
    );
  };

  const handleLoanSubmit = () => {
    if (!selectedResponsable && !customResponsable.trim()) {
      setNoValid(true);
      return;
    }

    const selectedItems = itemQuantities.filter((item) => item.quantity > 0);

    if (selectedItems.length === 0) {
      alert("Debe asignar al menos un ítem.");
      return;
    }

    setSelectedRows({
      responsable: selectedResponsable || customResponsable,
      items: selectedItems,
    });
    closeThisModal();
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="w-full h-full flex gap-4 max-md:flex-col-reverse">
        <div className="md:w-9/12 border rounded-md flex flex-col h-[50vh] overflow-auto">
          <div className="w-full border-b flex items-center p-3 justify-between">
            <div className="w-1/3">Ítem</div>
            <div className="w-1/3">Unidad</div>
            <div className="flex w-1/3 gap-1 items-center">
              <div className="w-2/4 text-center">Cantidad</div>
              <div className="w-1/4"></div>
              <div className="w-1/4"></div>
            </div>
          </div>
          {items.map((item) => (
            <div
              key={item.id}
              className="w-full border-b flex items-center p-3 justify-between"
            >
              <div className="w-1/3">{item.name}</div>
              <div className="w-1/3">{item.unit}</div>
              <div className="flex w-1/3 max-md:flex-col gap-1 items-center">
                <input
                  value={
                    itemQuantities.find((q) => q.id === item.id)?.quantity || 0
                  }
                  readOnly
                  className="max-md:w-5/6 md:w-2/4 border rounded-md text-center"
                />
                <div className="max-md:flex max-md:w-full w-2/4">
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className="p-1 rounded-md max-md:w-full md:w-1/2 font-bold text-xl"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    className="p-1 rounded-md max-md:w-full md:w-1/2 font-bold text-xl"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
          ))}
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
            <option value="Juan Hernandez Manzera">
              Juan Hernandez Manzera
            </option>
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
                onChange={(e) => setCustomResponsable(e.target.value)}
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

        <button onClick={handleLoanSubmit} className="rounded-md p-1">
          Realizar préstamo
        </button>
      </div>
    </div>
  );
}
