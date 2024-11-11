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

/////////////////
/////////////////
/////////////////
export default function CreateItem() {
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
    name: z.string().min(2, { message: "Obligatorio" }).max(50),
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
      name: "",
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
              <svg
                width="24"
                height="24"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.887695 4.91931C0.887695 3.76313 1.34699 2.65431 2.16453 1.83677C2.98207 1.01923 4.09089 0.559937 5.24707 0.559937H21.7158C22.872 0.559937 23.9808 1.01923 24.7984 1.83677C25.6159 2.65431 26.0752 3.76313 26.0752 4.91931V13.4366C25.4914 12.9132 24.8397 12.4711 24.1377 12.122V4.91931C24.1377 4.27699 23.8825 3.66098 23.4283 3.20679C22.9742 2.7526 22.3581 2.49744 21.7158 2.49744H5.24707C4.60475 2.49744 3.98874 2.7526 3.53455 3.20679C3.08036 3.66098 2.8252 4.27699 2.8252 4.91931V21.3881C2.8252 22.0304 3.08036 22.6464 3.53455 23.1006C3.98874 23.5548 4.60475 23.8099 5.24707 23.8099H12.4497C12.8004 24.5152 13.2441 25.1662 13.7643 25.7474H5.24707C4.09089 25.7474 2.98207 25.2881 2.16453 24.4706C1.34699 23.6531 0.887695 22.5442 0.887695 21.3881V4.91931ZM20.2627 27.2006C22.1897 27.2006 24.0377 26.4351 25.4003 25.0725C26.7628 23.7099 27.5283 21.8619 27.5283 19.9349C27.5283 18.008 26.7628 16.1599 25.4003 14.7974C24.0377 13.4348 22.1897 12.6693 20.2627 12.6693C18.3357 12.6693 16.4877 13.4348 15.1251 14.7974C13.7626 16.1599 12.9971 18.008 12.9971 19.9349C12.9971 21.8619 13.7626 23.7099 15.1251 25.0725C16.4877 26.4351 18.3357 27.2006 20.2627 27.2006ZM21.2314 15.3334V18.9662H24.8643C25.057 18.9662 25.2418 19.0427 25.378 19.179C25.5143 19.3152 25.5908 19.5001 25.5908 19.6927C25.5908 19.8854 25.5143 20.0702 25.378 20.2065C25.2418 20.3428 25.057 20.4193 24.8643 20.4193H21.2314V24.0521C21.2314 24.2448 21.1549 24.4296 21.0186 24.5659C20.8824 24.7021 20.6976 24.7787 20.5049 24.7787C20.3122 24.7787 20.1274 24.7021 19.9911 24.5659C19.8549 24.4296 19.7783 24.2448 19.7783 24.0521V20.4193H16.1455C15.9528 20.4193 15.768 20.3428 15.6318 20.2065C15.4955 20.0702 15.4189 19.8854 15.4189 19.6927C15.4189 19.5001 15.4955 19.3152 15.6318 19.179C15.768 19.0427 15.9528 18.9662 16.1455 18.9662H19.7783V15.3334C19.7783 15.1407 19.8549 14.9559 19.9911 14.8196C20.1274 14.6834 20.3122 14.6068 20.5049 14.6068C20.6976 14.6068 20.8824 14.6834 21.0186 14.8196C21.1549 14.9559 21.2314 15.1407 21.2314 15.3334Z"
                  fill="#1E3A8A"
                />
              </svg>

              <h1 className="text-sm font-bold">
                Agregar nuevo suministro o material
              </h1>
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
                      <FormLabel>Nombre</FormLabel>
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
