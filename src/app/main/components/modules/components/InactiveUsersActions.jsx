import React from "react";
import InactiveUsersActivateAction from "./InactiveUsersActivateAction";
import InactiveUsersEditAction from "./InactiveUsersEditAction";
import UsersDetailsAction from "./UsersDetailsAction";
export default function InactiveUsersActions({
  closeThisModal,
  action,
  rows,
  setSelectedRows,
}) {
  switch (action) {
    case "details":
      return (
        <UsersDetailsAction closeThisModal={closeThisModal} users={rows} />
      );
    case "edit":
      return (
        <InactiveUsersEditAction
          closeThisModal={closeThisModal}
          users={rows}
          setSelectedRows={setSelectedRows}
        />
      );
    case "activate":
      return (
        <InactiveUsersActivateAction
          closeThisModal={closeThisModal}
          users={rows}
          setSelectedRows={setSelectedRows}
        />
      );
    default:
      return <div>Acción no encontrada</div>;
  }
}
