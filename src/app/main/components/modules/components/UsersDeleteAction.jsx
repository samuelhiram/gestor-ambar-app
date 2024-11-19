import React from "react";
import { useMainAppContext } from "../../MainAppContext";
import { useToast } from "@/hooks/use-toast";
import { set } from "react-hook-form";

export default function UsersDeleteAction({
  closeThisModal,
  users,
  setSelectedRows,
}) {
  const [loading, setLoading] = React.useState(false);
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
    //fetch inactiveUsersData
    fetch("/api/users/get-inactive", {
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log("Usuarios inactivos actualizados:", data.users);
        setState((prev) => ({ ...prev, inactiveUsersData: data.users }));
      });
  };
  //handle delete users
  const handleDeleteUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users/inactive", {
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
        title: "Usuarios desactivados...",
      });
      refreshUsers();
      setSelectedRows([]);
      closeThisModal();
      setLoading(false);
    } catch (error) {
      console.error("Error al desactivar usuarios:", error.message);
      toast({
        variant: "destructive",
        title: "Error al desactivar usuarios...",
      });
    }
  };

  return (
    <>
      <div className="w-full flex flex-col flex-grow gap-2">
        <div className="w-full text-md font-semibold">
          Los siguientes usuarios serán desactivados y no podrán acceder al
          sistema.
        </div>
        <div className="overflow-auto flex-grow max-h-[65vh] border rounded-md p-2 flex flex-col gap-2">
          {users.map((user, index) => (
            <>
              <div className="rounded-md text-black px-2 bg-orange-50 flex items-center gap-2">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                  >
                    <rect width="24" height="24" fill="none" />
                    <path
                      fill="#303030"
                      d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
                    />
                  </svg>
                </div>
                <div>
                  {user.fullName} - {user.email}
                </div>
              </div>
              <hr />
            </>
          ))}
        </div>
      </div>
      {loading && "Borrando usuarios..."}
      {!loading && (
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
            className="rounded-md p-2  text-white flex items-center gap-1"
            onClick={() => {
              handleDeleteUsers();
            }}
          >
            <div>Desactivar</div>
          </button>
        </div>
      )}
    </>
  );
}
