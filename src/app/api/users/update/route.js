import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/withAuth";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const POST = withAuth(async (req) => {
  try {
    // Obtener el body de la solicitud (la lista de usuarios a actualizar)
    const body = await req.json();
    const { users } = body;

    // Recorrer cada usuario y realizar el update en la base de datos
    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        const { id, fullName, control_number, role, location, email } = user;
        return prisma.user.update({
          where: { id },
          data: {
            fullName,
            control_number,
            role,
            location,
            email,
          },
        });
      })
    );

    return new NextResponse(JSON.stringify({ updatedUsers }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
});
