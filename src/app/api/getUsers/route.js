import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { VerifyToken } from "../middleware";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  console.log("--api--> getUsers");
  const authResponse = await VerifyToken(req);

  if (authResponse?.status !== 200) {
    // Si el token no es válido, devolvemos la respuesta de error del middleware
    return authResponse;
  }
  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      control_number: true,
      role: true,
      location: true,
      createdAt: true,
    },
  });

  console.log(users);

  return NextResponse.json({  users });
}
