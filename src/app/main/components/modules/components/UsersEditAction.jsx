"use client";
import React from "react";
import { useMainAppContext } from "../../MainAppContext";
import { useToast } from "@/hooks/use-toast";
export default function UserEditAction({ users }) {
  const { state, setState } = useMainAppContext();
  const [edited, setEdited] = React.useState(false);
  const { toast } = useToast();

  // Función para manejar el submit del formulario
  const handleSubmit = (event) => {
    setEdited(false);
    event.preventDefault(); // Prevenir que el formulario se recargue
    const formData = new FormData(event.target); // Obtener los valores del formulario
    // Crear un objeto con los datos del formulario
    const updatedData = users.map((user, index) => ({
      id: user.id,
      fullName: formData.get(index + "fullname"),
      email: formData.get(index + "email"),
      role: formData.get(index + "role"),
      location: formData.get(index + "location"),
      control_number: formData.get(index + "control_number"),
      createdAt: user.createdAt,
      updatedAt: new Date().toISOString(),
    }));
    // Imprimir los datos actualizados o hacer alguna otra acción con ellos
    // console.log("Datos actualizados:", updatedData);
    // Llamar a la función para actualizar los usuarios
    fetchEditUsers(updatedData);
    setState((prev) => ({ ...prev, selectedRows: updatedData }));
  };

  const fetchEditUsers = async (users) => {
    try {
      const response = await fetch("/api/users/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`, // Pasar el token de autenticación
        },
        body: JSON.stringify({ users }), // Enviar la lista de usuarios
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.json();
      // console.log("Usuarios actualizados:", data.updatedUsers);
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "success",
        title: "Usuarios actualizado(s)...",
      });
      refreshUsers();
      closeThisModal();
    } catch (error) {
      console.error("Error al actualizar usuarios:", error.message);
      toast({
        variant: "destructive",
        title: "Error al actualizar usuarios...",
      });
    }
  };

  // close this modal
  const closeThisModal = () => {
    setState((prev) => ({ ...prev, showActionsDialog: false }));
  };

  const refreshUsers = () => {
    fetch("/api/users/get", {
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log("Usuarios actualizados:", data.users);
        setState((prev) => ({ ...prev, usersData: data.users }));
      });
  };

  return (
    <>
      <form
        onChange={() => setEdited(true)}
        className="h-full w-full flex flex-col gap-2"
        onSubmit={handleSubmit}
      >
        {/* Contenedor de la lista de usuarios con scroll automático */}
        <div className="overflow-auto flex-grow max-h-[65vh] border rounded-md p-2 flex flex-col gap-2">
          {users.map((user, index) => (
            <div className="flex flex-col gap-2" key={index}>
              <div className="w-full rounded-md font-semibold bg-gray-200 p-2 text-sm flex justify-between">
                <div>Usuario - {user.fullName}</div>
              </div>

              <div className="flex flex-col  lg:flex-row gap-2 ">
                <input
                  name={index + "fullname"}
                  required
                  defaultValue={user.fullName}
                  className="input lg:w-1/2"
                  //only accept letters but no only spaces
                  pattern="^(?!\s*$).+"
                  maxLength={36}
                />
                <input
                  type="email"
                  name={index + "email"}
                  required
                  defaultValue={user.email}
                  className="input lg:w-1/2"
                  maxLength={48}
                />
              </div>

              <div className="w-full flex flex-col lg:flex-row gap-2 lg:flex-wrap">
                <select
                  name={index + "role"}
                  defaultValue={user.role}
                  className="border lg:w-1/6 p-1 rounded-md shadow text-black"
                >
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                  <option value="mod">Mod</option>
                </select>
                <select
                  name={index + "location"}
                  defaultValue={user.location}
                  className="border lg:w-1/6 p-1 rounded-md shadow text-black"
                >
                  <option value="Unidad Tomas Aquino">
                    Unidad Tomas Aquino
                  </option>
                  <option value="Unidad Otay">Unidad Otay</option>
                </select>
                <input
                  required
                  name={index + "control_number"}
                  defaultValue={user.control_number}
                  className="input"
                  maxLength={32}
                />
              </div>

              <hr className="border-2" />
            </div>
          ))}
        </div>
        {/* Botón de guardar */}
        <div className="w-full flex justify-between gap-2">
          <button
            onClick={closeThisModal}
            className="p-2 rounded-md bg-blue-500 text-white"
          >
            Cancelar
          </button>
          <button
            disabled={edited ? false : true}
            type="submit"
            className={`${
              !edited ? "!bg-gray-500" : "bg-blue-500"
            }  p-2 rounded-md  text-white`}
          >
            Guardar
          </button>
        </div>
      </form>
    </>
  );
}
