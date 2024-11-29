import React, { useState } from "react";
import { useMainAppContext } from "../../MainAppContext";

export default function InventoryItemDelete({ items, closeThisModal }) {
  const { state, setState } = useMainAppContext();
  const [selectedItems, setSelectedItems] = useState(
    items.map((item) => item.id)
  ); // Inicializar con los IDs de los elementos

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
    console.log("IDs seleccionados para eliminar:", selectedItems); // Imprime los IDs
    fetch("/api/item/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify({ selectedItems }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Respuesta del servidor:", data);
        //fetch items
        fetch("/api/item/get", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Respuesta del servidor:", data);
            setState({ ...state, items: data.items });
          })
          .catch((error) => {
            console.error("Error al obtener los elementos:", error);
          });
        closeThisModal(); // Cerrar el modal
      })
      .catch((error) => {
        console.error("Error al eliminar los elementos:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>¿Estás seguro de que deseas eliminar los siguientes elementos?</p>
      <ul className="p-2">
        {items.map((item, index) => (
          <li key={index}>
            {item.partidaNumber} {item.category} - {item.name}{" "}
            <input type="hidden" name={`item-${item.id}`} value={item.id} />
          </li>
        ))}
      </ul>
      <div className="flex w-full justify-between py-2">
        <button
          type="button"
          className="rounded-md p-1"
          onClick={closeThisModal}
        >
          Cancelar
        </button>
        <button type="submit" className="rounded-md p-1 bg-red-500 text-white">
          Eliminar
        </button>
      </div>
    </form>
  );
}
