"use client";
import React from "react";
import Image from "next/image";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { set, useForm } from "react-hook-form";

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
import { Input } from "@/components/ui/input";
import PassRecovery from "./components/PassRecovery";
import { useAppContext } from "../components/GlobalContextApp";
import Logo from "../main/components/Logo";
import { use } from "bcrypt/promises";
export default function Login() {
  useEffect(() => {
    //preven default
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
  }, []);
  const { state, setState } = useAppContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const formSchema = z.object({
    email: z
      .string()
      .email({ message: "Formato inválido" })
      .min(2, { message: "Obligatorio" })
      .max(50),
    password: z.string().min(2, { message: "Obligatorio" }).max(50),
  });
  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values) {
    //preven default
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    const email = values.email;
    const password = values.password;
    try {
      // Ocultar alerta de diálogo al iniciar el proceso
      setState((prev) => ({
        ...prev,
        showDialogAlert: false,
      }));
      setIsLoading(true);

      // Hacer la solicitud de autenticación
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Parsear la respuesta
      const jsonResponse = await response.json();
      console.log(jsonResponse);

      // Comprobar si la respuesta es exitosa
      if (response.ok) {
        // Almacenar los datos en localStorage
        localStorage.setItem("userId", jsonResponse.userId);
        localStorage.setItem("token", jsonResponse.token);

        // Redirigir al usuario a la página principal
        window.location.href = "/main";
      } else {
        // Mostrar alerta si las credenciales no son válidas
        setState((prev) => ({
          ...prev,
          showDialogAlert: true,
          dialogMessage: "Credenciales inválidas",
        }));
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error during login:", error);

      // Mostrar alerta si ocurre un error durante el proceso
      setState((prev) => ({
        ...prev,
        showDialogAlert: true,
        dialogMessage: "Ha ocurrido un error. Por favor, intenta de nuevo.",
      }));
    }
  }
  return (
    <div className="min-h-screen w-full flex flex-col gap-8 justify-center items-center">
      <div className="">
        <Logo />
      </div>
      <div className="max-md:w-4/5 md:w-2/5 lg:w-2/5 xl:w-1/4 p-4 border rounded-xl flex flex-col justify-center space-y-4 shadow-xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col space-y-3"
          >
            <div className="font-bold text-xl w-full">Iniciar Sesión</div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading}
              type="submit"
              className={`${isLoading ? "!bg-gray-500" : ""}`}
            >
              {isLoading ? "Cargando..." : "Iniciar"}
            </Button>
          </form>
        </Form>
        {/**/}
        {/* <PassRecovery /> */}
        {/**/}
      </div>
    </div>
  );
}
