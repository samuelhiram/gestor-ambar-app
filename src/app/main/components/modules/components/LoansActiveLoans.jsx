import React, { useState } from "react";
import LoansEditLoan from "./LoansEditLoan";
import { useMainAppContext } from "../../MainAppContext";

export default function LoansActiveLoans({ loans }) {
  const { state, setState } = useMainAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minItems, setMinItems] = useState(0);
  const [loanId, setLoanId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  // Filtrar préstamos
  const filteredLoans = loans.filter((loan) => {
    const matchesSearch = loan.responsibleName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDate =
      (!startDate || new Date(loan.createdAt) >= new Date(startDate)) &&
      (!endDate || new Date(loan.createdAt) <= new Date(endDate));
    const matchesItems = loan.itemsCount >= minItems;

    return matchesSearch && matchesDate && matchesItems;
  });

  const userId = state.user.id;

  const finalizeLoan = async (loanId) => {
    setLoading(true);
    setError(null);
    setSelectedId(loanId);
    try {
      const response = await fetch("/api/loans/finished", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({ loanId, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al finalizar el préstamo");
      }

      //obtener los préstamos
      await fetch("/api/loans/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setState((prev) => ({ ...prev, loans: data.formattedLoans }));
        });

      //obtener
      await fetch("/api/item/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setState((prev) => ({ ...prev, items: data.items }));
        });

      //obtener los préstamos finalizados
      await fetch("/api/loans/get-finished", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setState((prev) => ({ ...prev, finishedloans: data.formattedLoans }));
        });

      // Opcional: Recargar la lista de préstamos o eliminar el préstamo finalizado de la UI.
    } catch (err) {
      setError(err.message);
      console.error("Error al finalizar el préstamo:", err);
    } finally {
      setLoading(false);
    }
  };

  function handleLoanEditAction(loanId) {
    console.log("Editando préstamo:", loanId);
    setLoanId(loanId);
    setShowEditModal(true);
  }

  return (
    <div className="flex flex-col gap-4">
      {showEditModal && (
        <LoansEditLoan
          loanId={loanId}
          closeThisModal={() => setShowEditModal(false)}
        />
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-100 rounded-xl">
        {/* Barra de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-lg"
        />

        {/* Filtro por rango de fechas */}
        <div className="flex items-center gap-2">
          <label htmlFor="startDate" className="text-sm font-bold">
            Desde:
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded-lg"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="endDate" className="text-sm font-bold">
            Hasta:
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded-lg"
          />
        </div>

        {/* Filtro por cantidad de ítems */}
        <div className="flex items-center gap-2">
          <label htmlFor="minItems" className="text-sm font-bold">
            Mínimo de suministros:
          </label>
          <input
            type="number"
            id="minItems"
            value={minItems}
            onChange={(e) => setMinItems(Number(e.target.value))}
            className="p-2 border rounded-lg"
          />
        </div>
        <button
          onClick={() => {
            setSearchTerm("");
            setStartDate("");
            setEndDate("");
            setMinItems(0);
          }}
          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Resetear Filtros
        </button>
      </div>

      {/* Lista de préstamos */}
      <div className="flex flex-col gap-2">
        {filteredLoans.length > 0 ? (
          filteredLoans.map((loan) => (
            <div
              key={loan.id}
              className="flex flex-col gap-2 p-2 border rounded-xl bg-white"
            >
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold">Nombre del responsable:</h1>
                <h1>{loan.responsibleName}</h1>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold">Suministros prestados:</h1>
                <h1>{loan.itemsCount}</h1>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold">Fecha de creación:</h1>
                <h1>{loan.createdAt}</h1>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold">Estado:</h1>
                <h1 className="capitalize">{loan.status}</h1>
              </div>
              <div className="flex gap-1 justify-between">
                <button
                  onClick={() => finalizeLoan(loan.id)}
                  className={
                    "rounded-md p-1 bg-green-500 text-white hover:bg-green-600" +
                    (loan.status === "finished" ? " hidden" : "")
                  }
                  disabled={selectedId === loan.id && loading}
                >
                  {selectedId === loan.id && loading
                    ? "Finalizando..."
                    : "Finalizar"}
                </button>
                <button
                  onClick={() => handleLoanEditAction(loan.id)}
                  className="rounded-md p-1 bg-blue-500 text-white hover:bg-blue-600"
                >
                  Ver ticket
                </button>
              </div>
              {selectedId === loan.id && error && (
                <p className="text-red-500">{error}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No se encontraron préstamos que coincidan con los filtros.
          </p>
        )}
      </div>
    </div>
  );
}
