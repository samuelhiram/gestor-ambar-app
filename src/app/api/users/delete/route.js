import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const POST = withAuth(async (req) => {
  try {
    // Obtener el body de la solicitud (la lista de usuarios a eliminar)
    const body = await req.json();
    const { users } = body;

    // borrar los logs por cada usuario
    const deletedLogs = await Promise.all(
      users.map(async (user) => {
        const { id } = user;
        return prisma.log.deleteMany({ where: { userId: id } });
      })
    );

    // borrar los usuarios
    const deletedUsers = await prisma.user.deleteMany({
      where: { id: { in: users.map((user) => user.id) } },
    });
    return new NextResponse(JSON.stringify({ deletedUsers }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
});
