import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { withAuth } from "@/lib/withAuth";
//

//
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
