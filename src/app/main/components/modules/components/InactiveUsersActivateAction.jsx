"use client";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useMainAppContext } from "../../MainAppContext";

export default function InactiveUsersActivateAction({
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

  const handleActivateUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users/activate", {
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
      // console.log("Usuarios activados:", data.activeUsers);
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2 ",
        position: "top-right",
        variant: "success",
        title: "Usuarios activados...",
      });
      refreshUsers();
      setSelectedRows([]);
      closeThisModal();
      setLoading(false);
    } catch (error) {
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "error",
        title: error.message,
      });
      console.error("Error al activar usuarios:", error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col flex-grow gap-2">
        <div className="w-full text-md font-semibold">
          Los siguientes usuarios serán activados...
        </div>
        <div className="overflow-auto flex-grow max-h-[65vh] border rounded-md p-2 flex flex-col gap-2">
          {users.map((user, index) => (
            <>
              <div
                key={index}
                className="rounded-md text-black px-2 bg-green-50 flex items-center gap-2"
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                  >
                    <rect width="24" height="24" fill="none" />
                    <path
                      fill="#737373"
                      d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"
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
      {loading && "Activando usuarios..."}
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
            className="rounded-md p-2 !bg-green-700 text-white flex items-center gap-1"
            onClick={() => {
              handleActivateUsers();
            }}
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <rect width="24" height="24" fill="none" />
                <path
                  fill="white"
                  d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"
                />
              </svg>
            </div>
            <div>Activar</div>
          </button>
        </div>
      )}
    </>
  );
}
