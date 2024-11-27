"use client";
import React from "react";
import { useMainAppContext } from "../../MainAppContext";
import { useToast } from "@/hooks/use-toast";
//////
export default function UserEditAction({
  closeThisModal,
  users,
  setSelectedRows,
}) {
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
      location_id: formData.get(index + "location"),
      control_number: formData.get(index + "control_number"),
      createdAt: user.createdAt,
      updatedAt: new Date().toISOString(),
    }));
    // Llamar a la función para actualizar los usuarios
    fetchEditUsers(updatedData);
    setSelectedRows(updatedData);
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
        <div className="p-4 overflow-auto flex-grow max-h-[65vh] border rounded-md flex flex-col gap-2">
          {users.map((user, index) => (
            <div className="flex flex-col gap-4" key={index}>
              <div className="w-full rounded-md p-1 font-semibold bg-gray-200 text-sm flex gap-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <rect width="24" height="24" fill="none" />
                  <path
                    fill="gray"
                    d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"
                  />
                </svg>
                <div>Usuario - {user.fullName}</div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor={index + "fullname"}
                    className="font-medium text-sm"
                  >
                    Nombre Completo
                  </label>
                  <input
                    id={index + "fullname"}
                    name={index + "fullname"}
                    required
                    defaultValue={user.fullName}
                    className="input w-full"
                    pattern="^(?!\s*$).+"
                    maxLength={36}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor={index + "email"}
                    className="font-medium text-sm"
                  >
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id={index + "email"}
                    name={index + "email"}
                    required
                    defaultValue={user.email}
                    className="input w-full"
                    maxLength={48}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor={index + "role"}
                    className="font-medium text-sm"
                  >
                    Rol
                  </label>
                  <select
                    id={index + "role"}
                    name={index + "role"}
                    defaultValue={user.role}
                    className="border p-1 rounded-md shadow w-full"
                  >
                    <option value="admin">Admin</option>
                    <option value="viewer">Viewer</option>
                    <option value="mod">Mod</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor={index + "location"}
                    className="font-medium text-sm"
                  >
                    Ubicación
                  </label>
                  <select
                    id={index + "location"}
                    name={index + "location"}
                    defaultValue={user.location}
                    className="border p-1 rounded-md shadow w-full"
                  >
                    {state.locations.map((location, index) => (
                      <option key={index} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor={index + "control_number"}
                    className="font-medium text-sm"
                  >
                    Número de Control
                  </label>
                  <input
                    id={index + "control_number"}
                    required
                    name={index + "control_number"}
                    defaultValue={user.control_number}
                    className="input w-full"
                    maxLength={32}
                  />
                </div>
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
