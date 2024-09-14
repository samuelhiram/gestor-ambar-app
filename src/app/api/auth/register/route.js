import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

//get secret key from environment variable
const secretKey = process.env.SECRET_KEY;
const prisma = new PrismaClient();

export async function POST(req) {
  const body = await req.json();
  const { email, control_number, role, fullName, location, password } = body;

  //create user in database
  const user = await prisma.user.create({
    data: {
      email: email,
      control_number: control_number,
      role: role,
      fullName: fullName,
      location: location,
      password: password,
    },
  });

  if (user) {
    console.log("user: ", user);
  }

  // console.log("email: ", username, "password: ", password);

  // if (!username) {
  //   return NextResponse.json(
  //     { message: "Username is required" },
  //     { status: 400 }
  //   );
  // }

  // // Genera el token con una expiración de 1 hora
  // const token = jwt.sign({ username }, secretKey, { expiresIn: "40s" });

  return NextResponse.json({ message: "logging..." });
}
