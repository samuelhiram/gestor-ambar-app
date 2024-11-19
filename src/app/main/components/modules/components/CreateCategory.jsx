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

export default function CreateCategory() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { state, setState } = useMainAppContext();
  const { toast } = useToast();
  const formSchema = z.object({
    partidaNumber: z
      .string()
      .regex(/^\d+$/, { message: "Debe contener solo números" }),
    name: z.string().min(2, { message: "Obligatorio" }).max(50),
  });
  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partidaNumber: "",
      name: "",
    },
  });

  useEffect(() => {
    // async function fetchCategories() {
    //   const response = await fetch("/api/category/get", {
    //     headers: {
    //       Authorization: `Bearer ${state.token}`,
    //     },
    //   });
    //   if (!response.ok) {
    //     const error = await response.json();
    //     setState((prevState) => ({
    //       ...prevState,
    //       showDialogAlert: true,
    //       dialogMessage: error.error || "Error desconocido",
    //     }));
    //     return;
    //   }
    //   const data = await response.json();
    //   //console.log("Categories fetched successfully:", data);
    //   setState((prevState) => ({
    //     ...prevState,
    //     categories: data.categories,
    //   }));
    // }
    // fetchCategories();
  }, []);

  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      // Ocultar alerta de diálogo al iniciar el proceso
      setState((prev) => ({
        ...prev,
        showDialogAlert: false,
      }));

      const response = await fetch("/api/category/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`, // Asegúrate de que 'token' esté definido correctamente
        },
        body: JSON.stringify(values), // Convertir 'values' en JSON
      });

      // Verificar si la respuesta no fue exitosa
      if (!response.ok) {
        const error = await response.json(); // Obtener el mensaje de error del servidor
        setState((prevState) => ({
          ...prevState,
          showDialogAlert: true,
          duration: 800,
          dialogMessage: error.error || "Error desconocido",
        }));
        setIsSubmitting(false);
        return; // Salir si ocurre un error
      }

      const data = await response.json();
      //console.log("Category registered successfully:", data); // Muestra los datos devueltos por el backend

      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "success",
        duration: 800,
        title: "Categoría creada...",
      });

      //obtener lista de categorias
      const categoriesResponse = await fetch("/api/category/get", {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });

      if (!categoriesResponse.ok) {
        const error = await categoriesResponse.json();
        setState((prevState) => ({
          ...prevState,
          showDialogAlert: true,
          dialogMessage: error.error || "Error desconocido",
        }));
        setIsSubmitting(false);
        return;
      }

      const fetchcategories = await categoriesResponse.json();

      //console.log("Categories fetched successfully:", fetchcategories);

      setState((prevState) => ({
        ...prevState,
        categories: fetchcategories.categories,
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
        title: "Error al crear categoría...",
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
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <rect width="24" height="24" fill="none" />
                <path
                  fill="#334C94"
                  d="M6.5 11L12 2l5.5 9zm11 11q-1.875 0-3.187-1.312T13 17.5t1.313-3.187T17.5 13t3.188 1.313T22 17.5t-1.312 3.188T17.5 22M3 21.5v-8h8v8z"
                />
              </svg>
              <h1 className="text-sm font-bold">
                Crear categoria / núm. partida
              </h1>
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
                      <FormLabel>Nombre de la categoría</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Mi categoría..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="partidaNumber"
                  render={({ field }) => (
                    <FormItem className="w-full flex-grow">
                      <FormLabel>Número de partida</FormLabel>
                      <FormControl>
                        <Input placeholder="00000..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isSubmitting} type="submit">
                  Crear
                </Button>
              </form>
            </Form>
            <div className="w-full py-2">
              <div className="font-semibold">Categorías existentes</div>
              <div
                className={`w-full ${
                  state.categories.length < 3 ? "h-auto" : "h-40"
                }  overflow-auto border-gray-200 py-2  gap-1 justify-between items-center`}
              >
                <CategoryList state={state} setState={setState} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

//get categories
export async function getCategories(state, setState) {
  try {
    const response = await fetch("/api/category/get", {
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
    //console.log("Categories fetched successfully:", data);

    setState((prevState) => ({
      ...prevState,
      categories: data.categories,
    }));
  } catch (error) {
    console.error("Request error:", error);
  }
}

//delete category
export async function deleteCategory(values, state, setState) {
  //console.log("Deleting category:", values);
  try {
    const response = await fetch("/api/category/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error deleting category:", error.error);
      return;
    }

    const data = await response.json();
    //console.log("Category deleted successfully:", data);

    //fetch categories
    await getCategories(state, setState);

    return data;
  } catch (error) {
    console.error("Request error:", error);
  }
}

async function updateCategory(values, state, setState) {
  //console.log("Updating category:", values);
  try {
    const response = await fetch("/api/category/put", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify(values), // Corregido a `values`
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error updating category:", error.error);
      return;
    }

    const data = await response.json();
    //console.log("Category updated successfully:", data);

    await getCategories(state, setState);

    return data;
  } catch (error) {
    console.error("Request error:", error);
  }
}

export function CategoryList({ state, setState }) {
  const { toast } = useToast();
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editedValues, setEditedValues] = useState({});

  const handleEditChange = (field, value) => {
    //get input values by id
    const name = document.getElementById("categoryName").value;
    const partidaNumber = document.getElementById("partidaNumber").value;

    setEditedValues({
      name,
      partidaNumber,
    });
  };

  const handleSave = async (categoryId) => {
    const updatedData = {
      id: categoryId,
      ...editedValues,
    };

    try {
      await updateCategory(updatedData, state, setState);
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "success",
        duration: 800,
        title: "Categoría actualizada...",
      });
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "destructive",
        duration: 800,
        title: "Error al actualizar categoría...",
      });
    }
    setEditCategoryId(null);
  };

  const handleDelete = async (categoryId) => {
    const deletedData = {
      id: categoryId,
    };
    try {
      await deleteCategory(deletedData, state, setState);
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "warning",
        duration: 800,
        title: "Categoría eliminada...",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "destructive",
        duration: 800,
        title: "Error al eliminar categoría...",
      });
    }
  };

  return (
    <>
      {state.categories.length === 0 && (
        <div>No hay categorías registradas</div>
      )}
      {state.categories.map((category) => {
        const isEditing = editCategoryId === category.id;
        return (
          <div
            key={category.id}
            className="flex flex-row max-md:flex-col w-full gap-2 items-center bg-white border-b p-2"
          >
            {isEditing ? (
              <input
                id="categoryName"
                defaultValue={category.name}
                className="w-full"
                onChange={(e) => handleEditChange("name", e.target.value)}
              />
            ) : (
              <div className="w-full">{category.name}</div>
            )}
            {isEditing ? (
              <input
                id="partidaNumber"
                pattern="[0-9]*"
                defaultValue={category.partidaNumber}
                className="w-full"
                onChange={(e) => {
                  //filter just numbers
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  handleEditChange("partidaNumber", e.target.value);
                }}
              />
            ) : (
              <div className="w-full">{category.partidaNumber}</div>
            )}
            <div className="flex justify-between max-md:w-full">
              <div
                className="text-blue-900 cursor-pointer underline"
                onClick={() =>
                  setEditCategoryId(isEditing ? null : category.id)
                }
              >
                {isEditing ? (
                  <div className="flex gap-2 max-md:gap-6">
                    <svg
                      onClick={() => handleSave(category.id)}
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
                      onClick={() => setEditCategoryId(null)}
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
              {!category.item && (
                <svg
                  onClick={() => {
                    handleDelete(category.id);
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
