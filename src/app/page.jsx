"use client";
import Login from "./auth/Login";
import { useEffect } from "react";

import DialogMessage from "./components/DialogMessage";

// const EnumRole = {
//   Admin: "Admin",
//   Viewer: "Viewer",
//   Mod: "Mod",
// };

// function stringToEnumRole(value, enumObj) {
//   return Object.keys(enumObj).find((key) => enumObj[key] === value);
// }

export default function Home() {
  // useEffect(() => {
  //   const createAdmin = async () => {
  //     try {
  //       const response = await axios.post("/api/auth/register", {
  //         email: "inventario@tectijuana.edu.mx",
  //         control_number: "admin",
  //         role: stringToEnumRole("Admin", EnumRole),
  //         fullName: "Admin",
  //         location: "Unidad Tomas Aquino",
  //         password: "admin",
  //       });
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   createAdmin();
  // }, []);

  return (
    <>
      <Login />
      <DialogMessage />
    </>
  );
}
