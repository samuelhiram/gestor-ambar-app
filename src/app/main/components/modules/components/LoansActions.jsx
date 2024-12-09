import React from "react";
import LoansAsignLoanAction from "./LoansAsignLoanAction";
export default function LoansActions({
  closeThisModal,
  action,
  rows,
  setSelectedRows,
}) {
  switch (action) {
    case "asignloan":
      return (
        <LoansAsignLoanAction
          items={rows}
          closeThisModal={closeThisModal}
          setSelectedRows={setSelectedRows}
        />
      );

    default:
      return null;
  }
}
