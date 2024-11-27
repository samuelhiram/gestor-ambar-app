import React, { useEffect, useState } from "react";
import { useMainAppContext } from "../../MainAppContext";

export default function InventoryItemsEdit({ closeThisModal, items }) {
  const { state } = useMainAppContext();
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    // Mapear items para asignar el ID de la categoría en lugar del nombre
    const mappedItems = items.map((item) => {
      const categoryId =
        state.categories.find((category) => category.name === item.category)
          ?.id || ""; // Buscar el ID de la categoría por nombre
      return {
        ...item,
        category: categoryId, // Reemplazar el nombre con el ID
      };
    });
    setFormData(mappedItems);
  }, [items, state.categories]);

  const handleChange = (e, index, field) => {
    const updatedFormData = [...formData];
    updatedFormData[index][field] = e.target.value;
    setFormData(updatedFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Items:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="h-[52vh] overflow-auto space-y-4">
      {formData.map((item, index) => (
        <div key={item._id} className="flex flex-col space-y-2 p-2">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col space-y-1">
              <label
                htmlFor={`name-${item._id}`}
                className="text-sm text-gray-600"
              >
                Nombre
              </label>
              <input
                type="text"
                name={`name-${item._id}`}
                id={`name-${item._id}`}
                className="border border-gray-300 rounded-md p-1"
                value={item.name}
                onChange={(e) => handleChange(e, index, "name")}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label
                htmlFor={`code-${item._id}`}
                className="text-sm text-gray-600"
              >
                Código
              </label>
              <input
                type="text"
                name={`code-${item._id}`}
                id={`code-${item._id}`}
                className="border border-gray-300 rounded-md p-1"
                value={item.code}
                onChange={(e) => handleChange(e, index, "code")}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col space-y-1">
              <label
                htmlFor={`category-${item._id}`}
                className="text-sm text-gray-600"
              >
                Categoría
              </label>
              <select
                name={`category-${item._id}`}
                id={`category-${item._id}`}
                className="border border-gray-300 rounded-md p-1"
                value={item.category} // Ahora contiene el ID
                onChange={(e) => handleChange(e, index, "category")}
              >
                {state.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label
                htmlFor={`type-${item._id}`}
                className="text-sm text-gray-600"
              >
                Tipo
              </label>
              <select
                name={`type-${item._id}`}
                id={`type-${item._id}`}
                className="border border-gray-300 rounded-md p-1"
                value={item.type}
                onChange={(e) => handleChange(e, index, "type")}
              >
                <option value="default">{item.type}</option>
              </select>
            </div>
          </div>
          <hr />
        </div>
      ))}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
