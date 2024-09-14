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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
export default function PassRecovery() {
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
    console.log(values);
    // console.log("login");
  }
  return (
    <Dialog>
      <DialogTrigger className="!bg-transparent !underline !text-blue-900 !p-0 !active:bg-blue-100">
        Recuperar contraseña
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="justify-start text-start">
            <DialogTitle>Recuperar contraseña</DialogTitle>
            <DialogDescription>
              Escribe el correo de la cuenta
            </DialogDescription>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
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
            <Button>Recuperar contraseña</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
