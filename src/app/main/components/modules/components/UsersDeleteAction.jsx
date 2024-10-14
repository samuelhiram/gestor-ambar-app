import React from "react";
import { useMainAppContext } from "../../MainAppContext";
import { useToast } from "@/hooks/use-toast";

export default function UsersDeleteAction({ users }) {
  const { state, setState } = useMainAppContext();
  const { toast } = useToast();
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
  //handle delete users
  const handleDeleteUsers = async () => {
    try {
      const response = await fetch("/api/users/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({ users }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.json();
      // console.log("Usuarios eliminados:", data.deletedUsers);
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "success",
        title: "Usuarios eliminados...",
      });
      refreshUsers();
      setState((prev) => ({ ...prev, selectedRows: [] }));
      closeThisModal();
    } catch (error) {
      console.error("Error al eliminar usuarios:", error.message);
      toast({
        variant: "destructive",
        title: "Error al eliminar usuarios...",
      });
    }
  };

  //close this modal
  const closeThisModal = () => {
    setState((prev) => ({ ...prev, showActionsDialog: false }));
  };
  return (
    <>
      <div className="w-full flex flex-col flex-grow gap-2">
        <div className="w-full text-lg font-semibold">
          Los siguientes usuarios serán eliminados, ¿Desea continuar?
        </div>

        <div className="overflow-auto flex-grow max-h-[65vh] border rounded-md p-2 flex flex-col gap-2">
          {users.map((user, index) => (
            <>
              <div>
                {user.fullName} - {user.email}
              </div>
            </>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          className="rounded-md p-2"
          onClick={() => {
            closeThisModal();
          }}
        >
          Cancelar
        </button>
        <button
          className="rounded-md p-2 !bg-red-500"
          onClick={() => {
            handleDeleteUsers();
          }}
        >
          Eliminar
        </button>
      </div>
    </>
  );
}
