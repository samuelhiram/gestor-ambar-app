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
    async function fetchCategories() {
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
      console.log("Categories fetched successfully:", data);

      setState((prevState) => ({
        ...prevState,
        categories: data.categories,
      }));
    }

    fetchCategories();
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
          dialogMessage: error.error || "Error desconocido",
        }));
        setIsSubmitting(false);
        return; // Salir si ocurre un error
      }

      const data = await response.json();
      console.log("Category registered successfully:", data); // Muestra los datos devueltos por el backend

      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "success",
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

      console.log("Categories fetched successfully:", fetchcategories);

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
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <rect width="24" height="24" fill="none" />
                <path
                  fill="#334C94"
                  d="M6.5 11L12 2l5.5 9zm11 11q-1.875 0-3.187-1.312T13 17.5t1.313-3.187T17.5 13t3.188 1.313T22 17.5t-1.312 3.188T17.5 22M3 21.5v-8h8v8z"
                />
              </svg>
              <h1 className="text-sm font-bold">Crear categoria</h1>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex gap-2 items-end max-xl:flex-col"
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
              <div className="w-full border-b border-gray-200 py-2 flex flex-col gap-1 justify-between items-center ">
                <CategoryList state={state} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function CategoryList({ state }) {
  const [editCategoryId, setEditCategoryId] = useState(null);

  return (
    <>
      {state.categories.map((category) => {
        const isEditing = editCategoryId === category.id;

        return (
          <div key={category.id} className="flex w-full space-x-2">
            {isEditing ? (
              <input
                defaultValue={category.name}
                className="w-full text-center"
              />
            ) : (
              <input
                value={category.name}
                readOnly
                className="pointer-events-none select-none w-full bg-transparent text-center"
              />
            )}
            {isEditing ? (
              <input
                pattern="[0-9]*"
                defaultValue={category.partidaNumber}
                className="w-full text-center"
              />
            ) : (
              <input
                value={category.partidaNumber}
                readOnly
                className="pointer-events-none select-none w-full bg-transparent text-center"
              />
            )}

            <div className="flex space-x-4">
              <div
                className="text-blue-900 cursor-pointer underline"
                onClick={() =>
                  setEditCategoryId(isEditing ? null : category.id)
                }
              >
                {isEditing ? "guardar" : "editar"}
              </div>
              <div className="text-red-600 cursor-pointer">eliminar</div>
            </div>
            <hr />
          </div>
        );
      })}
    </>
  );
}
