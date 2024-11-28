import React from "react";
import InventoryItemReportOut from "./InventoryItemReportOut";
import InventoryReportEntry from "./InventoryReportEntry";
import InventoryItemDetails from "./InventoryItemDetails";
import InventoryItemsEdit from "./InventoryItemsEdit";
import InventoryItemDelete from "./InventoryItemDelete";
export default function InventoryItemsActions({
  closeThisModal,
  action,
  rows,
  setSelectedRows,
}) {
  switch (action) {
    case "delete":
      return (
        <InventoryItemDelete closeThisModal={closeThisModal} items={rows} />
      );
    case "outs":
      return (
        <InventoryItemReportOut
          closeThisModal={closeThisModal}
          items={rows}
          setSelectedRows={setSelectedRows}
        />
      );
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
    case "edit":
      return (
        <InventoryItemsEdit
          closeThisModal={closeThisModal}
          items={rows}
          setSelectedRows={setSelectedRows}
        />
      );
    default:
      return <div>Acción no encontrada</div>;
  }
}
