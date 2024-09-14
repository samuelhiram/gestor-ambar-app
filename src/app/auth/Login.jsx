"use client";
import axios from "axios";
import React from "react";
import Image from "next/image";

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

export default function Login() {
  const { setState } = useAppContext();
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
    const email = values.email;
    const password = values.password;
    try {
      setState((prev) => ({
        ...prev,
        showDialogAlert: false,
      }));

      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        showDialogAlert: !prev.showDialogAlert,
        dialogMessage: "Credenciales inválidas",
      }));
    }
  }
  return (
    <div className="min-h-screen w-full flex flex-col gap-8 justify-center items-center">
      <div className="flex flex-col gap-4">
        <Image src="img/logo.svg" alt="TecTijuana" width={250} height={250} />
        <div>
          <p className="font-light text-2xl w-full flex justify-center items-center">
            Gestor Ambar - TecNM
          </p>
          <p className="text-sm flex w-full justify-center">
            Control e inventario de materiales
          </p>
        </div>
      </div>
      <div className="max-md:w-4/5 lg:w-2/5 xl:w-1/4 p-4 border rounded-xl flex flex-col justify-center space-y-4 shadow-xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-3"
          >
            <div className="font-bold text-xl">Iniciar Sesión</div>

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
          </form>
        </Form>
        <Form>
          <Button onClick={form.handleSubmit(onSubmit)} type="submit">
            Iniciar
          </Button>
        </Form>
        {/**/}
        <PassRecovery />
        {/**/}
      </div>
    </div>
  );
}
