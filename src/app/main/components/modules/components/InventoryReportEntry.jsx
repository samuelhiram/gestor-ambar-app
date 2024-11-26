import React, { useRef } from "react";
import { useMainAppContext } from "../../MainAppContext";
import { useToast } from "@/hooks/use-toast";

export default function InventoryReportEntry({
  closeThisModal,
  items,
  setSelectedRows,
}) {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const { state, setState } = useMainAppContext();

  const formRef = useRef(null); // Referencia al formulario

  const handleInput = (event) => {
    const value = event.target.value;
    // Permitir solo dígitos
    event.target.value = value.replace(/[^0-9]/g, "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevenir recarga de la página
    const formData = new FormData(formRef.current);

    const entries = items.map((item) => ({
      id: item.id,
      value: parseInt(formData.get(`item-${item.id}`), 10) || 0, // Obtener valores por id dinámico
    }));

    //si todas las entradas === 0
    if (entries.every((entry) => entry.value === 0)) {
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "warning",
        title: "No hay entradas reportadas...",
        duration: 900,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/entryes/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({
          entries,
          userId: state.user.id, // Reemplaza con el ID del usuario autenticado
        }),
      });

      const updatedEntryesResponse = await response.json();
      console.log(
        "THIS IS THE RESPONSE: ",
        updatedEntryesResponse.updatedEntryeItems
      );
      if (response.ok) {
        toast({
          className:
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
          position: "top-right",
          variant: "success",
          title: "Entradas reportadas...",
        });

        setSelectedRows(updatedEntryesResponse.updatedEntryeItems);

        await fetch("/api/item/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setState((prev) => ({
              ...prev,
              items: data.items,
            }));
          });

        closeThisModal();
      } else {
        alert(`Error: ${updatedEntryesResponse.message}`);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "destructive",
        title: "Entradas reportadas...",
        duration: 900,
      });
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="flex  p-2 flex-col gap-2 h-[40vh] overflow-auto">
        <div className="w-full flex justify-between font-semibold">
          <div className="w-2/4">Suministro</div>
          <div className="w-1/4">Cantidad</div>
        </div>
        {items.map((item) => (
          <React.Fragment key={item.id}>
            <div className="flex w-full justify-between">
              {item.partidaNumber} {item.name}
              <div>
                <input
                  defaultValue={0}
                  type="number"
                  id={`item-${item.id}`}
                  name={`item-${item.id}`}
                  onInput={handleInput}
                />
              </div>
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
      {!loading && (
        <button
          type="submit"
          className="mt-4 bg-blue-500 rounded-md text-white px-4 py-2"
        >
          Reportar entradas
        </button>
      )}
      {loading && <div className="mt-4 text-center">Cargando...</div>}
    </form>
  );
}
