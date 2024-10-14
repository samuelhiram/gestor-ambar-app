import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/withAuth";

const prisma = new PrismaClient();

export const POST = withAuth(async (req) => {
  // Obtener el body de la solicitud (la lista de usuarios a ver sus log)
  const body = await req.json();
  const { users } = body;

  // Recorrer cada usuario y realizar la consulta en la base de datos
  var logs = await Promise.all(
    users.map(async (user) => {
      return prisma.log.findMany({
        where: {
          userId: user.id,
        },
      });
    })
  );

  // update the date
  logs = logs.map((log) => {
    return log.map((l) => {
      return {
        ...l,
        createdAt: new Date(l.createdAt).toString().split("GMT")[0],
      };
    });
  });

  //reverse the logs
  logs = logs.map((log) => log.reverse());

  return new NextResponse(JSON.stringify({ logs }));
});
