import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/withAuth";

const prisma = new PrismaClient();

//endpoint to set like active all users
export const POST = withAuth(async (req) => {
  try {
    // Obtener el body de la solicitud (la lista de usuarios a activar)
    const body = await req.json();
    const { users } = body;

    //set active
    const activeUsers = await Promise.all(
      users.map(async (user) => {
        const activeUser = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            status: "active",
          },
        });

        return activeUser;
      })
    );

    return new NextResponse(JSON.stringify({ activeUsers }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
});
