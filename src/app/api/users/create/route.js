import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { withAuth } from "@/lib/withAuth"; // Usa la ruta correcta para importar

const secretKey = process.env.SECRET_KEY;
const prisma = new PrismaClient();

export const POST = withAuth(async (req) => {
  console.log("--api--> register");

  try {
    const body = await req.json();
    const { email, control_number, role, fullName, location, password } = body;
    // Hashear la contraseña

    const hashedPassword = await bcrypt.hash(password, 10);
    // Buscar si el email o el número de control ya existen
    const [emailRepeated, controlNumberRepeated] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { control_number } }),
    ]);
    // Verificar si el correo ya está registrado
    if (emailRepeated) {
      return new NextResponse(
        JSON.stringify({ error: "Email already exists" }),
        { status: 400 }
      );
    }
    // Verificar si el número de control ya está registrado
    if (controlNumberRepeated) {
      return new NextResponse(
        JSON.stringify({ error: "Control number already exists" }),
        { status: 400 }
      );
    }
    // Crear usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        email,
        control_number,
        role,
        fullName,
        location,
        password: hashedPassword,
      },
    });
    console.log("User created:", user);

    // Devolver respuesta exitosa
    return new NextResponse(
      JSON.stringify({ message: "User created successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    // Devolver error de servidor si algo falla inesperadamente
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
});
