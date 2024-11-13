import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const POST = withAuth(async (req) => {
  try {
    // Obtener el body de la solicitud (la lista de usuarios a eliminar)
    const body = await req.json();
    const { users } = body;

    //set inactive
    const deletedUsers = await Promise.all(
      users.map(async (user) => {
        const deletedUser = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            status: "inactive",
          },
        });

        return deletedUser;
      })
    );

    return new NextResponse(JSON.stringify({ deletedUsers }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
});
