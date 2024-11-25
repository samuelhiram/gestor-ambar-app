import React from "react";
import InventoryReportEntry from "./InventoryReportEntry";
import InventoryItemDetails from "./InventoryItemDetails";
export default function InventoryItemsActions({
  closeThisModal,
  action,
  rows,
  setSelectedRows,
}) {
  switch (action) {
    case "entryes":
      return (
        <InventoryReportEntry
          closeThisModal={closeThisModal}
          items={rows}
          setSelectedRows={setSelectedRows}
        />
      );
    case "details":
      return (
        <InventoryItemDetails closeThisModal={closeThisModal} items={rows} />
      );
    default:
      return <div>Acción no encontrada</div>;
  }
}
