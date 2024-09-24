import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

//get secret key from environment variable
const secretKey = process.env.SECRET_KEY;
const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    console.log("email: ", email, "password: ", password);

    // Buscar usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // Verificar que el usuario exista
    if (!user) {
      console.log("--api--> user not found");
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Verificar contraseña con bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("--api--> password incorrect");
      return new NextResponse(JSON.stringify({ error: "Incorrect password" }), {
        status: 403,
      });
    }

    console.log("--api--> user found, login success");

    // Generar token JWT
    const userId = user.id;
    const token = jwt.sign({ userId }, secretKey, { expiresIn: "3h" });

    // Obtener fecha actual y sumar 3 horas
    const expires = new Date(Date.now() + 3 * 60 * 60 * 1000);

    // Borrar todas las sesiones anteriores del usuario
    await prisma.session.deleteMany({
      where: {
        userId: userId,
      },
    });

    // Crear nueva sesión
    await prisma.session.create({
      data: {
        userId: userId,
        token: token,
        expiresAt: expires,
      },
    });

    // Registrar el login en el log
    await prisma.log.create({
      data: {
        userId: userId,
        action: "login",
      },
    });

    return new NextResponse(JSON.stringify({ userId: userId, token: token }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in POST /login:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
      }
    );
  }
}
