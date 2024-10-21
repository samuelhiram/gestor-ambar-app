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

    //if user has status like "inactive" or "blocked" return error
    if (user.status !== "active") {
      console.log("--api--> user status is not active");
      return new NextResponse(
        JSON.stringify({ error: "User status is not active" }),
        {
          status: 403,
        }
      );
    }

    console.log("--api--> user found, login success");

    // Generar token JWT
    const userId = user.id;

    //omitir password en el token
    delete user.password;

    const token = jwt.sign(user, secretKey, { expiresIn: "12h" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    console.log("decoded: ", decoded);

    // Obtener fecha actual y sumar 12 horas
    const expires = new Date(Date.now() + 12 * 60 * 60 * 1000);

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
        action: "inicio de sesión",
      },
    });

    return new NextResponse(JSON.stringify({ userId, token }), {
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
