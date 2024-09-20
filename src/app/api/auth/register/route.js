import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
import { VerifyToken } from "../../middleware";

//import bcrypt from "bcrypt";
import bcrypt from "bcrypt";

//get secret key from environment variable
const secretKey = process.env.SECRET_KEY;
const prisma = new PrismaClient();

export async function POST(req) {
  console.log("--api--> register");
  const authResponse = await VerifyToken(req);

  if (authResponse?.status !== 200) {
    // Si el token no es válido, devolvemos la respuesta de error del middleware
    return authResponse;
  }

  const body = await req.json();
  const { email, control_number, role, fullName, location, password } = body;
  const hashedpassword = await bcrypt.hash(password, 10);

  //search if user already exists by email or control number
  const emailRepeated = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  const controlNumberRepeated = await prisma.user.findUnique({
    where: {
      control_number: control_number,
    },
  });

  if (emailRepeated) {
    return new Response(JSON.stringify({ emailAlreadyExists: true }), {
      status: 400,
    });
  }

  if (controlNumberRepeated) {
    return new Response(JSON.stringify({ controlNumberAlreadyExists: true }), {
      status: 400,
    });
  }

  //create user in database
  const user = await prisma.user.create({
    data: {
      email: email,
      control_number: control_number,
      role: role,
      fullName: fullName,
      location: location,
      password: hashedpassword,
    },
  });

  if (user) {
    console.log("user: ", user);
  }

  return new NextResponse(
    JSON.stringify({ message: "creating..." }, { status: 200 })
  );
}
