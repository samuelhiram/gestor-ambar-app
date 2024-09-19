import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

//import bcrypt from "bcrypt";
import bcrypt from "bcrypt";

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
      password: bcrypt.hash(password),
    },
  });

  if (user) {
    console.log("user: ", user);
  }

  return NextResponse.json({ message: "logging..." });
}
