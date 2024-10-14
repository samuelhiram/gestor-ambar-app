import React from "react";
import UsersEditAction from "./UsersEditAction";
import UsersDetailsAction from "./UsersDetailsAction";
import UsersDeleteAction from "./UsersDeleteAction";
export default function UsersActions({ action, rows }) {
  switch (action) {
    case "edit":
      return <UsersEditAction users={rows} />;
    case "details":
      return <UsersDetailsAction users={rows} />;
    case "delete":
      return <UsersDeleteAction users={rows} />;
    default:
      return null;
  }
}
