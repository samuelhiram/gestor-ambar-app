import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAuth } from "@/lib/withAuth"; // Usa la ruta correcta para importar
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const GET = withAuth(async (req) => {
  //get token from req headers
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];
  //decode token
  const decoded = jwt.verify(token, process.env.SECRET_KEY);

  const userId = decoded.userId;

  var users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      control_number: true,
      role: true,
      location: true,
      createdAt: true,
    },
  });

  //filtered users by userId

  users = users.filter((user) => user.id !== userId);

  //reformat createdAt date
  users = users.map((user) => {
    return {
      ...user,
      createdAt: new Date(user.createdAt).toString().split("GMT")[0],
    };
  });

  //reorder from newest to oldest
  users = users.reverse();

  return new NextResponse(JSON.stringify({ users }));
});
