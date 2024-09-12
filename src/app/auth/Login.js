"use client";

import React from "react";

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
import { Input } from "@/components/ui/input";

export default function Login() {
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
  function onSubmit(values) {
    // console.log(values);
    console.log("login");
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

        <div className="flex flex-col gap-4">
          <Button type="submit">Iniciar</Button>
          <a className=" w-full flex justify-center">recuperar cuenta</a>
        </div>
      </form>
    </Form>
  );
}
