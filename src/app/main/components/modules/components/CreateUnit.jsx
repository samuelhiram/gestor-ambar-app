"use client";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Input } from "@/components/ui/input";
import { useMainAppContext } from "../../MainAppContext";

export default function CreateUnit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { state, setState } = useMainAppContext();
  const { toast } = useToast();
  const formSchema = z.object({
    name: z.string().min(2, { message: "Obligatorio" }).max(50),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    const asyncFetch = async () => {
      await fetchUnits(state, setState);
    };
    asyncFetch();
  }, []);

  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      setState((prev) => ({
        ...prev,
        showDialogAlert: false,
      }));

      const response = await fetch("/api/unit/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        setState((prevState) => ({
          ...prevState,
          showDialogAlert: true,
          dialogMessage: error.error || "Error desconocido",
        }));
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();
      //console.log("Unit registered successfully:", data);

      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "success",
        duration: 800,
        title: "Unidad creada...",
      });

      const unitsResponse = await fetch("/api/unit/get", {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });

      if (!unitsResponse.ok) {
        const error = await unitsResponse.json();
        setState((prevState) => ({
          ...prevState,
          showDialogAlert: true,
          dialogMessage: error.error || "Error desconocido",
        }));
        setIsSubmitting(false);
        return;
      }

      const fetchUnits = await unitsResponse.json();

      //console.log("UnitS fetched successfully:", fetchUnits);

      setState((prevState) => ({
        ...prevState,
        units: fetchUnits.units,
      }));

      form.reset({
        num: "",
        fullName: "",
      });

      setIsSubmitting(false);
    } catch (err) {
      console.error("Error en la petición:", err.message);
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "destructive",
        duration: 800,
        title: "Error al crear unidad...",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full p-2 border rounded-xl">
      <Accordion
        className="w-full !border-0 !border-b-0 "
        type="single"
        collapsible
      >
        <AccordionItem className="!border-0 !border-b-0" value="item-1">
          <AccordionTrigger className="!bg-white hover:!bg-blue-50 hover:border-blue-500 !rounded-xl !border !p-2 !text-gray-600">
            <div className="flex items-center gap-1">
              <svg
                width="45"
                height="24"
                viewBox="0 0 45 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_134_3)">
                  <g clipPath="url(#clip1_134_3)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M26.0469 28.1166C25.7112 28.1166 25.3893 27.9783 25.1519 27.7322C24.9146 27.486 24.7812 27.1522 24.7812 26.8041V4.92908C24.7812 4.58098 24.9146 4.24714 25.1519 4.001C25.3893 3.75486 25.7112 3.61658 26.0469 3.61658C26.3825 3.61658 26.7045 3.75486 26.9418 4.001C27.1792 4.24714 27.3125 4.58098 27.3125 4.92908V26.8041C27.3125 27.1522 27.1792 27.486 26.9418 27.7322C26.7045 27.9783 26.3825 28.1166 26.0469 28.1166ZM20.5625 17.6166V14.1166C20.5625 13.6524 20.3847 13.2073 20.0682 12.8791C19.7518 12.551 19.3226 12.3666 18.875 12.3666H12.125C11.6774 12.3666 11.2482 12.551 10.9318 12.8791C10.6153 13.2073 10.4375 13.6524 10.4375 14.1166V17.6166C10.4375 18.0807 10.6153 18.5258 10.9318 18.854C11.2482 19.1822 11.6774 19.3666 12.125 19.3666H18.875C19.3226 19.3666 19.7518 19.1822 20.0682 18.854C20.3847 18.5258 20.5625 18.0807 20.5625 17.6166ZM23.0938 14.1166C23.0938 12.9563 22.6493 11.8435 21.8581 11.023C21.0669 10.2025 19.9939 9.74158 18.875 9.74158H12.125C11.0061 9.74158 9.93306 10.2025 9.14189 11.023C8.35072 11.8435 7.90625 12.9563 7.90625 14.1166V17.6166C7.90625 18.1911 8.01537 18.76 8.22738 19.2908C8.4394 19.8216 8.75015 20.3039 9.14189 20.7102C9.93306 21.5306 11.0061 21.9916 12.125 21.9916H18.875C19.429 21.9916 19.9776 21.8784 20.4894 21.6586C21.0013 21.4387 21.4664 21.1164 21.8581 20.7102C22.2499 20.3039 22.5606 19.8216 22.7726 19.2908C22.9846 18.76 23.0938 18.1911 23.0938 17.6166V14.1166ZM3.6875 26.8041C3.6875 27.1522 3.82084 27.486 4.05819 27.7322C4.29554 27.9783 4.61746 28.1166 4.95312 28.1166C5.28879 28.1166 5.61071 27.9783 5.84806 27.7322C6.08541 27.486 6.21875 27.1522 6.21875 26.8041V4.92908C6.21875 4.58098 6.08541 4.24714 5.84806 4.001C5.61071 3.75486 5.28879 3.61658 4.95312 3.61658C4.61746 3.61658 4.29554 3.75486 4.05819 4.001C3.82084 4.24714 3.6875 4.58098 3.6875 4.92908V26.8041Z"
                      fill="#1E3A8A"
                    />
                  </g>
                </g>
                <path
                  d="M44.4805 18.0779H38.7031V23.8553H36.7773V18.0779H31V16.1522H36.7773V10.3748H38.7031V16.1522H44.4805V18.0779Z"
                  fill="#1E3A8A"
                />
                <defs>
                  <clipPath id="clip0_134_3">
                    <rect
                      width="31"
                      height="31"
                      fill="white"
                      transform="translate(0 0.366577)"
                    />
                  </clipPath>
                  <clipPath id="clip1_134_3">
                    <rect
                      width="27"
                      height="28"
                      fill="white"
                      transform="translate(2 1.86658)"
                    />
                  </clipPath>
                </defs>
              </svg>

              <h1 className="text-sm font-bold">Crear unidad</h1>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex gap-2 items-end flex-col"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full flex-grow">
                      <FormLabel>Nombre de la unidad de medida</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Mi unidad..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Ejemplos: CAJA, PIEZA, BOLSA, BOTE, etc.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <Button disabled={isSubmitting} type="submit">
                  Crear
                </Button>
              </form>
            </Form>
            <div className="w-full py-2">
              <div className="font-semibold">Unidades existentes</div>
              <div
                className={`w-full ${
                  state.units.length < 2 ? "h-auto" : "h-40"
                }  overflow-auto  border-gray-200 py-2  gap-1 justify-between items-center`}
              >
                <UnitList state={state} setState={setState} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export async function fetchUnits(state, setState) {
  try {
    const response = await fetch("/api/unit/get", {
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      setState((prevState) => ({
        ...prevState,
        showDialogAlert: true,
        dialogMessage: error.error || "Error desconocido",
      }));
      return;
    }
    const data = await response.json();
    //console.log("UnitS fetched successfully:", data);
    setState((prevState) => ({
      ...prevState,
      units: data.units,
    }));
  } catch (error) {
    console.error("Request error:", error);
  }
}

export async function deleteUnit(values, state, setState) {
  //console.log("Deleting unit:", values);
  try {
    const response = await fetch("/api/unit/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error deleting unit:", error.error);
      return;
    }

    const data = await response.json();
    //console.log("Unit deleted successfully:", data);

    await fetchUnits(state, setState);

    return data;
  } catch (error) {
    console.error("Request error:", error);
  }
}

async function updateUnit(values, state, setState) {
  //console.log("Updating unit:", values);
  try {
    const response = await fetch("/api/unit/put", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error updating unit:", error.error);
      return;
    }

    const data = await response.json();
    //console.log("Unit updated successfully:", data);

    await fetchUnits(state, setState);

    return data;
  } catch (error) {
    console.error("Request error:", error);
  }
}

export function UnitList({ state, setState }) {
  const { toast } = useToast();
  const [editUnitId, setEditUnitId] = useState(null);
  const [editedValues, setEditedValues] = useState({});

  const handleEditChange = (field, value) => {
    const name = document.getElementById("UnitName").value;

    setEditedValues({
      name,
    });
  };

  const handleSave = async (UnitId) => {
    const updatedData = {
      id: UnitId,
      ...editedValues,
    };

    try {
      await updateUnit(updatedData, state, setState);
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "success",
        duration: 800,
        title: "Unidad actualizada...",
      });
    } catch (error) {
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "destructive",
        duration: 800,
        title: "Error al eliminar unidad...",
      });
    }
    setEditUnitId(null);
  };

  const handleDelete = async (UnitId) => {
    const deletedData = {
      id: UnitId,
    };

    //try catch

    try {
      await deleteUnit(deletedData, state, setState);
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "warning",
        duration: 800,
        title: "Unidad eliminada...",
      });
    } catch (error) {
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "destructive",
        duration: 800,
        title: "Error al eliminar unidad...",
      });
    }
  };

  return (
    <>
      {state.units.length === 0 && <div>No hay unidades registradas</div>}
      {state.units.map((unit) => {
        const isEditing = editUnitId === unit.id;
        return (
          <div
            key={unit.id}
            className="flex flex-row max-md:flex-col w-full gap-2 items-center bg-white border-b p-2"
          >
            {isEditing ? (
              <input
                id="UnitName"
                defaultValue={unit.name}
                className="w-full"
                onChange={(e) => handleEditChange("name", e.target.value)}
              />
            ) : (
              <div className="w-full">{unit.name}</div>
            )}

            <div className="flex justify-between max-md:w-full">
              <div
                className="text-blue-900 cursor-pointer underline"
                onClick={() => setEditUnitId(isEditing ? null : unit.id)}
              >
                {isEditing ? (
                  <div className="flex gap-2 max-md:gap-6">
                    <svg
                      onClick={() => handleSave(unit.id)}
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                    >
                      <rect width="24" height="24" fill="none" />
                      <path
                        fill="#737373"
                        d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"
                      />
                    </svg>
                    <svg
                      onClick={() => setEditUnitId(null)}
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                    >
                      <rect width="24" height="24" fill="none" />
                      <path
                        fill="#737373"
                        d="m8.4 17l3.6-3.6l3.6 3.6l1.4-1.4l-3.6-3.6L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4l3.6 3.6L7 15.6zm3.6 5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"
                      />
                    </svg>
                  </div>
                ) : (
                  <svg
                    className="hover:bg-gray-200 rounded-full p-1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                  >
                    <rect width="24" height="24" fill="none" />
                    <path
                      fill="#737373"
                      d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"
                    />
                  </svg>
                )}
              </div>
              {unit.item.length === 0 && (
                <svg
                  onClick={() => {
                    handleDelete(unit.id);
                  }}
                  className="hover:bg-gray-200 rounded-full p-1 cursor-pointer flex items-center"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <rect width="24" height="24" fill="none" />
                  <path
                    fill="#fa0a0a"
                    d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"
                  />
                </svg>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
