import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/withAuth";

const prisma = new PrismaClient();

export const POST = withAuth(async (req) => {
  try {
    // Obtener el body de la solicitud (la lista de usuarios a eliminar)
    const body = await req.json();
    const { users } = body;

    // Eliminar (lógicamente) cada usuario de la base de datos
    const deletedUsers = await Promise.all(
      users.map(async (user) => {
        const { id } = user;
        return prisma.user.update({
          where: { id },
          data: { isVisible: false },
        });
      })
    );

    return new NextResponse(JSON.stringify({ deletedUsers }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
});
