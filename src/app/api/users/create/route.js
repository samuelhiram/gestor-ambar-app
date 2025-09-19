import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import bcrypt from "bcrypt";
import { withAuth } from "@/lib/withAuth"; // Usa la ruta correcta para importar
import { getIdByReqHeaders } from "../../getId";

const secretKey = process.env.SECRET_KEY;

export const POST = withAuth(async (req) => {
  console.log("--api--> register");
  const userId = getIdByReqHeaders(req);
  try {
    const body = await req.json();
    var {
      email,
      control_number,
      role,
      fullName,
      location: location_id,
      password,
    } = body;
    //trim all the values
    email = email.trim();
    control_number = control_number.trim();
    role = role.trim();
    fullName = fullName.trim();
    location_id = location_id.trim();
    password = password.trim();

    //capitalize the full name
    fullName = fullName.toLowerCase();
    fullName = fullName.replace(/\b\w/g, (l) => l.toUpperCase());

    //email to lowercase
    email = email.toLowerCase();

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);
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
        location: {
          connect: {
            id: location_id, // Reemplaza 'location-id' con el ID de la ubicación
          },
        },
        password: hashedPassword,
      },
    });

    // Registrar la acción en el log
    await prisma.log.create({
      data: {
        userId: userId,
        action: `registro de usuario: ${user.fullName}`,
      },
    });

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
