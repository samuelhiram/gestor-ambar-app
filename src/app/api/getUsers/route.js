import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { VerifyToken } from "../middleware";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  console.log("--api--> getUsers");
  const authResponse = await VerifyToken(req);

  //get token from headers
  const token = req.headers.get("Authorization").toString().split(" ")[1];

  //decode token
  const decoded = jwt.decode(token);

  const userId = decoded.userId;

  if (authResponse?.status !== 200) {
    // Si el token no es válido, devolvemos la respuesta de error del middleware
    return authResponse;
  }
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

  users = users.filter((user) => user.id !== userId);

  //cut the date string first 30 chars
  users = users.map((user) => {
    user.createdAt = user.createdAt.toString().substring(0, 24);
    return user;
  });

  // console.log(users);

  return new NextResponse(JSON.stringify({ users }));
}
