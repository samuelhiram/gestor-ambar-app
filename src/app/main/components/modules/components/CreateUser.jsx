"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";

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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Input } from "@/components/ui/input";
import { useMainAppContext } from "../../MainAppContext";
import { use } from "bcrypt/promises";

/////////////////
/////////////////
/////////////////
export default function CreateUser() {
  const [locations, setLocations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { state, setState } = useMainAppContext();
  const { toast } = useToast();
  const formSchema = z.object({
    email: z
      .string()
      .email({ message: "Formato inválido" })
      .min(2, { message: "Obligatorio" })
      .max(50),
    fullName: z.string().min(2, { message: "Obligatorio" }).max(50),
    control_number: z.string().min(6, { message: "Obligatorio" }).max(50),
    location: z.string().min(2, { message: "Obligatorio" }).max(50),
    //make with zod required
    role: z.string().min(2, { message: "Obligatorio" }).max(50),
  });

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
      control_number: "",
      role: "",
      location: "",
    },
  });
  const sendPasswordEmail = async (email, password) => {
    // Inicializar EmailJS con tu clave pública
    emailjs.init({
      publicKey: "vGvH9vq_aIaVCEh1D",
    }); // Asegúrate de reemplazar "TU_CLAVE_PUBLICA" por tu clave real

    const templateParams = {
      email: email,
      password: password,
    };

    try {
      // console.log("Enviando email con los parámetros:", templateParams);
      // Enviar el correo usando async/await
      await emailjs.send("asiscan", "template_mei0db8", templateParams);
      // console.log("Correo enviado correctamente ----- SUCCESS!");
    } catch (error) {
      console.error("Error al enviar el correo ----- FAILED...", error);
    }
  };

  async function onSubmit(values) {
    setIsSubmitting(true);
    const password = Math.random().toString(36).slice(-8);

    values.password = password;

    console.log(values);

    try {
      // Ocultar alerta de diálogo al iniciar el proceso
      setState((prev) => ({
        ...prev,
        showDialogAlert: false,
      }));

      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`, // Asegúrate de que 'token' esté definido correctamente
        },
        body: JSON.stringify(values), // 'values' es el objeto que contiene los datos del formulario
      });

      // Verificar si la respuesta no fue exitosa
      if (!response.ok) {
        const error = await response.json(); // Obtener el mensaje de error del servidor

        setState((prevState) => ({
          ...prevState,
          showDialogAlert: true,
          dialogMessage:
            error.error === "Email already exists"
              ? "El correo ya está registrado"
              : "El número de control ya está registrado",
        }));
        setIsSubmitting(false);

        return; // Salir si ocurre un error
      }

      // Obtener datos del usuario si la solicitud fue exitosa
      const data = await response.json();
      console.log("User registered successfully:", data); // Muestra los datos devueltos por el backend

      sendPasswordEmail(values.email, password);

      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "success",
        title: "Usuario creado...",
      });

      // Obtener la lista de usuarios actualizada
      const usersResponse = await fetch("/api/users/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`, // Asegúrate de que 'token' esté definido correctamente
        },
      });

      if (!usersResponse.ok) {
        throw new Error("Failed to fetch users");
      }

      const usersData = await usersResponse.json();

      // Actualizar el estado con los datos de los usuarios
      setState((prevState) => ({
        ...prevState,
        usersData: usersData.users,
      }));

      // Limpiar el formulario
      form.reset({
        email: "",
        fullName: "",
        control_number: "",
        role: "",
        location: "",
      });

      setIsSubmitting(false);
    } catch (err) {
      console.error("Error en la petición:", err.message);
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-2 md:right-2",
        position: "top-right",
        variant: "destructive",
        title: "Error al crear usuario...",
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
              <Icon
                icon="iconoir:add-user"
                width="24"
                height="24"
                style={{ color: "#1e3a8a" }}
              />
              <h1 className="text-sm font-bold">Crear usuario</h1>
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
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="w-full flex-grow">
                      <FormLabel>Nombre completo</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Ana Gutierrez"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full flex-grow">
                      <FormLabel>Correo institucional</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="@tectijuana.edu.mx"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="control_number"
                  render={({ field }) => (
                    <FormItem className="w-full flex-grow">
                      <FormLabel>Número de control</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="20212903" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="w-full flex-grow">
                      <FormLabel>Rol</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value); // Actualiza el valor en el estado del formulario
                          }}
                          value={field.value || ""} // Asegúrate de que el valor sea un string vacío si no hay valor
                        >
                          <SelectTrigger className="!bg-white !rounded-md !text-gray-600">
                            <SelectValue placeholder="Seleccione Rol" />
                          </SelectTrigger>
                          <SelectContent className="!m-0 !p-0 !w-auto">
                            <SelectGroup>
                              <SelectLabel>Rol</SelectLabel>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                              <SelectItem value="mod">Mod</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="w-full flex-grow">
                      <FormLabel>Lugar</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value); // Actualiza el valor en el estado del formulario
                          }}
                          value={field.value || ""} // Asegúrate de que el valor sea un string vacío si no hay valor
                        >
                          <SelectTrigger className="w-full !bg-white !rounded-md !text-gray-600">
                            <SelectValue placeholder="Seleccione plantel" />
                          </SelectTrigger>
                          <SelectContent className="!m-0 !p-0 !w-auto">
                            <SelectGroup>
                              <SelectLabel>Unidad</SelectLabel>
                              {/* <SelectItem value="Unidad Tomas Aquino">
                                Unidad Tomas Aquino
                              </SelectItem>
                              <SelectItem value="Unidad Otay">
                                Unidad Otay
                              </SelectItem> */}
                              {state.locations.map((location) => (
                                <SelectItem
                                  key={location.id}
                                  value={location.id}
                                >
                                  {location.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isSubmitting} type="submit">
                  Crear
                </Button>
              </form>
            </Form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
