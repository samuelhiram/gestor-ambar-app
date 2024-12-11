import React, { useState } from "react";
import LoansEditLoan from "./LoansEditLoan";

export default function LoansActiveLoans({ loans }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minItems, setMinItems] = useState(0);
  const [loanId, setLoanId] = useState("");
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
        {/* Botón para resetear filtros */}
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
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    handleLoanEditAction(loan.id);
                  }}
                  className="rounded-md p-1"
                >
                  Editar
                </button>
                <button className="rounded-md p-1">Finalizar</button>
                <button className="rounded-md p-1">Ver ticket</button>
                <button className="!bg-red-800 rounded-md p-1">
                  Deshacer prestamo
                </button>
              </div>
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
