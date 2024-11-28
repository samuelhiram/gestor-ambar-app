import React, { useEffect, useState } from "react";
import { useMainAppContext } from "../../MainAppContext";
import { useToast } from "@/hooks/use-toast";

export default function InventoryItemsEdit({
  closeThisModal,
  items,
  setSelectedRows,
}) {
  const { state, setState } = useMainAppContext();
  const [formData, setFormData] = useState([]);
  const { toast } = useToast();

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

  const handleSubmit = async () => {
    console.log("Updated Items:", formData);
    await fetch("/api/item/update", {
      method: "POST",
      body: JSON.stringify({ items: formData }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
    }).then(async (res) => {
      console.log(res);
      //get json
      const responseOfUpdatedItems = await res.json();

      setSelectedRows(responseOfUpdatedItems.updatedItemsDb);
      //then fetch the items again
      fetch("/api/item/get", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      })
        .then(async (res) => {
          const response = await res.json();
          setState((prevState) => ({
            ...prevState,
            items: response.items,
          }));
          closeThisModal();
          toast({
            className:
              "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
            position: "top-right",
            variant: "success",
            title: "Suministros editado",
            duration: 900,
          });
        })
        .catch((err) => {
          console.log("Error fetching items", err);
        });
    });
  };

  return (
    <div className="space-y-4">
      <form className="h-[52vh] overflow-auto">
        <hr />
        {formData.map((item, index) => (
          <div key={item.id} className="flex flex-col space-y-2 p-2 gap-2">
            <div className="bg-blue-900 w-full p-2 text-white capitalize">
              {item.partidaNumber} - {item.name}
            </div>
            <div className="flex flex-col space-y-1 ">
              <label
                htmlFo={`category-${item.id}`}
                classNamre="text-sm text-gray-600"
              >
                Categoría
              </label>
              <select
                name={`category-${item.id}`}
                id={`category-${item.id}`}
                className="border border-gray-300 rounded-md p-1 "
                defaultValue={item.categoryId} // Ahora contiene el ID
                onChange={(e) => handleChange(e, index, "category")}
              >
                {state.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.partidaNumber} - {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-row max-md:flex-col justify-between gap-2">
              <div className="flex lg:w-2/5 flex-col space-y-1">
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
              <div className="flex lg:w-2/5 flex-col space-y-1">
                <label
                  htmlFor={`description-${item.id}`}
                  className="text-sm text-gray-600"
                >
                  Descripción
                </label>
                <input
                  type="text"
                  name={`description-${item.id}`}
                  id={`description-${item.id}`}
                  className=" border border-gray-300 rounded-md p-1"
                  value={item.description}
                  onChange={(e) => handleChange(e, index, "description")}
                />
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
                  defaultValue={item.typeId}
                  onChange={(e) => handleChange(e, index, "typeId")}
                >
                  {/* <option value="default">{item.type}</option> */}
                  {state.types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-row max-md:flex-col justify-between gap-2">
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
                  defaultValue={item.unitId}
                  onChange={(e) => handleChange(e, index, "unitId")}
                >
                  {/* <option value="default">{item.type}</option> */}
                  {state.units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col space-y-1">
                <label
                  htmlFor={`ubication-${item.id}`}
                  className="text-sm text-gray-600"
                >
                  Ubicación
                </label>
                <select
                  name={`ubication-${item.id}`}
                  id={`ubication-${item.id}`}
                  className="border border-gray-300 rounded-md p-1"
                  defaultValue={item.ubicationId}
                  onChange={(e) => handleChange(e, index, "ubicationId")}
                >
                  {/* <option value="default">{item.type}</option> */}
                  {state.ubication.map((ubication) => (
                    <option key={ubication.id} value={ubication.id}>
                      {ubication.name} - {ubication.location.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col space-y-1">
                <label
                  htmlFor={`code-${item.id}`}
                  className="text-sm text-gray-600"
                >
                  Código de barras
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

            <hr />
          </div>
        ))}
      </form>
      <div className="flex justify-end">
        <button
          onClick={() => {
            handleSubmit();
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
