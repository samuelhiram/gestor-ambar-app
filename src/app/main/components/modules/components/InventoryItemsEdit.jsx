import React, { useEffect, useState } from "react";
import { useMainAppContext } from "../../MainAppContext";

export default function InventoryItemsEdit({
  closeThisModal,
  items,
  setSelectedRows,
}) {
  const { state } = useMainAppContext();
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    // Inicializa el estado con los valores iniciales de los items
    setFormData(
      items.map((item) => ({
        id: item.id,
        name: item.name,
        code: item.code,
        category: item.category,
        type: item.type,
        location: item.location,
        unit: item.unit,
      }))
    );
  }, [items]);

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
        <div key={item.id} className="flex flex-col space-y-2 p-2">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col space-y-1">
              <label
                htmlFor={`name-${item.id}`}
                className="text-sm text-gray-600"
              >
                Nombre
              </label>
              <input
                type="text"
                name={`name-${item.id}`}
                id={`name-${item.id}`}
                className="border border-gray-300 rounded-md p-1"
                value={item.name}
                onChange={(e) => handleChange(e, index, "name")}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label
                htmlFor={`code-${item.id}`}
                className="text-sm text-gray-600"
              >
                Código
              </label>
              <input
                type="text"
                name={`code-${item.id}`}
                id={`code-${item.id}`}
                className="border border-gray-300 rounded-md p-1"
                value={item.code}
                onChange={(e) => handleChange(e, index, "code")}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col space-y-1">
              <label
                htmlFor={`category-${item.id}`}
                className="text-sm text-gray-600"
              >
                Categoría
              </label>
              <select
                name={`category-${item.id}`}
                id={`category-${item.id}`}
                className="border border-gray-300 rounded-md p-1"
                defaultValues={() => {
                  //return the id of the state.categories that matches the item.category
                  const category = state.categories.find(
                    (category) => category.name === item.category
                  );
                  return category.id;
                }}
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
                htmlFor={`type-${item.id}`}
                className="text-sm text-gray-600"
              >
                Tipo
              </label>
              <select
                name={`type-${item.id}`}
                id={`type-${item.id}`}
                className="border border-gray-300 rounded-md p-1"
                value={item.type}
                onChange={(e) => handleChange(e, index, "type")}
              >
                <option value="default">{item.type}</option>
              </select>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col space-y-1">
              <label
                htmlFor={`location-${item.id}`}
                className="text-sm text-gray-600"
              >
                Ubicación
              </label>
              <select
                name={`location-${item.id}`}
                id={`location-${item.id}`}
                className="border border-gray-300 rounded-md p-1"
                value={item.location}
                onChange={(e) => handleChange(e, index, "location")}
              >
                <option value={item.location}>{item.location}</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label
                htmlFor={`unit-${item.id}`}
                className="text-sm text-gray-600"
              >
                Unidad
              </label>
              <select
                name={`unit-${item.id}`}
                id={`unit-${item.id}`}
                className="border border-gray-300 rounded-md p-1"
                value={item.unit}
                onChange={(e) => handleChange(e, index, "unit")}
              >
                <option value={item.unit}>{item.unit}</option>
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
